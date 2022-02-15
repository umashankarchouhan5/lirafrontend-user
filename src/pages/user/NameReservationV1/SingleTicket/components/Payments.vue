<template>
    <CenterBlock :width="700">
        <div :class="$style.payments">
            <h5>Review Your Request</h5>
            <p>By clicking on "Pay" button you agree to FSA's Privacy Policy and Condition of Use</p>
            <h6>Payment Summary</h6>
            <div :class="$style.total" v-if="invoice">
                <div :class="$style.totalRow">
                    <div>
                        {{ invoice.Narration }}
                    </div>
                    <div>
                        Fees <span>:</span>
                    </div>
                    <div>
                        {{ mapCurrencyToSign() }}{{ invoice.feeUSD }}
                    </div>
                </div>
                <div :class="$style.totalRow">
                    <div />
                    <div>
                        {{ invoice.TaxType }} Tax ({{ invoice.Taxpct }}%) <span>:</span>
                    </div>
                    <div>
                        {{ mapCurrencyToSign() }}{{ invoice.Tax }}
                    </div>
                </div>
                <div :class="$style.totalRow">
                    <div />
                    <div>
                        Interest: <span>:</span>
                    </div>
                    <div>
                        {{ mapCurrencyToSign() }}{{ invoice.Interest }}
                    </div>
                </div>
                <div :class="$style.totalRow">
                    <div />
                    <div>
                        Penalty: <span>:</span>
                    </div>
                    <div>
                        {{ mapCurrencyToSign() }}{{ invoice.Penalty }}
                    </div>
                </div>
                <div :class="$style.totalRowSummary">
                    <div />
                    <div>
                        Total Amount Payable<span>:</span>
                    </div>
                    <div>
                        {{ mapCurrencyToSign() }}{{ invoice.Total }}
                    </div>
                </div>
            </div>
            <template v-if="!readonly && isSubmitted">
                <h6>Payment details:</h6>
                <FormRow>
                    <div class="col-sm-6 col-sm-offset-3">
                        <FormSelect :items="paymentMethods" item-value="value" item-name="label" v-model="paymentmode" label="Select method" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-3 col-sm-offset-3">
                        <FormButton @click="payHandler"
                                    type="success"
                                    :disabled="!paymentmode"
                                    :full-width="true"
                                    left-icon="md-checkmark-circle-outline">Pay Now</FormButton>
                    </div>
                    <div class="col-sm-3" v-if="invoice && invoice.PayLater">
                        <FormButton type="success"
                                    @click="payLaterHandler"
                                    :disabled="!paymentmode"
                                    :full-width="true"
                                    left-icon="md-time">Pay Later</FormButton>
                    </div>
                </FormRow>
            </template>
        </div>
    </CenterBlock>
</template>

<script>

    import { fetchFees, preProcessTicket, payLater } from '../api'

    export default {
        name: "Payments",
        data() {
            return {
                invoice: null,
                paymentMethods: [
                    {
                        label: 'Wallet',
                        value: 1
                    },
                    {
                        label: 'Credit/Debit card',
                        value: 2
                    }
                ],
                paymentmode: null,
            }
        },
        created() {
            this.fetchFeesHandler();
        },
        props: {
            value: Object,
            readonly: Boolean,
            isSubmitted: Boolean
        },
        computed: {
            processId() {
                return this.$store.state.common.currentProcessId;
            },
            userData() {
                return this.$store.state.user.user;
            },
        },
        methods: {
            fetchFeesHandler() {
                const data = {
                    process_id: this.processId,
                    reference_id: this.value.reference_id,
                };
                fetchFees(data).then(res => {
                    this.invoice = res.data[0]
                })
            },
            payLaterHandler() {
                payLater({
                    process_id: this.processId,
                    reference_id: this.value.reference_id,
                    paymentmode: this.paymentmode
                }).then(res => {
                    this.$emit('onPayLater', res.message)
                })
            },
            payHandler() {
                const data = {
                    process_id: this.processId,
                    reference_id: this.value.reference_id,
                    paymentmode: this.paymentmode
                };
                preProcessTicket(data).then(res => {
                    const data = {
                        ticketReference: res.data[0].TicketReference,
                        ApprovedNameStatus_id: res.data[0].ApprovedNameStatus_id,
                        step: 3,
                    };
                    this.$emit('onPaymentSuccess', data)
                })
            },
            backToList() {
                this.$router.push({ path: '/submissions' })
            },
            mapCurrencyToSign() {
                if (this.invoice && this.invoice.currency) {
                    if (this.invoice.currency === 'USD') {
                        return '$'
                    }
                    return ''
                }
                return ''
            }
        }
    }
</script>

<style lang="scss" module>
    .payments {
        h5 {
            font-size: 17px;
            font-weight: 500;
            text-align: center;
            margin-bottom: 20px;
        }
        p {
            margin-bottom: 20px;
        }
        h6 {
            text-align: center;
            font-size: 15px;
            margin-bottom: 20px;
        }
    }
    .total {
        margin-bottom: 20px;
    }
    .totalRow,
    .totalRowSummary {
        border-bottom: 1px solid #fff;
        background: #f4f4f4;
        display: flex;
        > div {
            padding: 10px 15px;
            display: flex;
            font-weight: 500;
            &:nth-child(1) {
                width: 45%;
            }
            &:nth-child(2) {
                width: 30%;
                span {
                    margin-left: auto;
                }
            }
            &:nth-child(3) {
                width: 25%;
                padding-left: 40px;
                font-size: 14px;
            }
        }
    }

    .totalRowSummary {
        > div {
            &:first-child {
                font-size: 15px;
                font-weight: 500;
            }
            &:last-child {
                font-size: 17px;
                font-weight: 700;
            }
        }
    }
</style>
