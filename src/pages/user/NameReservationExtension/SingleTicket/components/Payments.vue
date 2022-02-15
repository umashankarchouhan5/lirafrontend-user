<template>
    <div>
        <div :class="$style.payments">
            <h5>Review Your Request</h5>
            <p>By clicking on "Pay" button you agree to FSA's Privacy Policy and Condition of Use</p>
            <h5>Payment Summary</h5>
            <p>
                {{ invoice.Narration }}
            </p>
            <div :class="$style.total" v-if="invoice">
                <div :class="$style.totalRow">
                    <div>
                        Fees <span>:</span>
                    </div>
                    <div>
                        <p> {{ mapCurrencyToSign() }}{{ invoice.feeUSD }} </p>
                    </div>
                </div>
                <div :class="$style.totalRow">
                    
                    <div>
                        {{ invoice.TaxType }} Tax ({{ invoice.Taxpct }}%) <span>:</span>
                    </div>
                    <div>
                        <p> {{ mapCurrencyToSign() }}{{ invoice.Tax }} </p>
                    </div>
                </div>
                <div :class="$style.totalRow" v-if="invoice.Interest > 0">
                    
                    <div>
                        Interest: <span>:</span>
                    </div>
                    <div>
                        <p> {{ mapCurrencyToSign() }}{{ invoice.Interest }} </p>
                    </div>
                </div>
                <div :class="$style.totalRow" v-if="invoice.Penalty > 0">
                    
                    <div>
                        Penalty: <span>:</span>
                    </div>
                    <div>
                        <p> {{ mapCurrencyToSign() }}{{ invoice.Penalty }} </p>
                    </div>
                </div>
                <div :class="$style.totalRow">                    
                    <div>
                        Total Amount Payable<span>:</span>
                    </div>
                    <div>
                        <p> {{ mapCurrencyToSign() }} {{ invoice.Total }} </p>
                    </div>
                </div>
            </div>
            <template v-if="!readonly && isSubmitted">
                <h6>Payment details:</h6>
                <FormRow>
                    <div class="col-sm-4 ">
                        <FormSelect :items="paymentMethods" item-value="value" item-name="label" v-model="paymentmode" label="Select method" />
                    </div>
                </FormRow>
                <FormRow>
                    <ButtonGroup>
                        <FormButton @click="payHandler"
                            type="primary"
                            :disabled="!paymentmode"
                            left-icon="md-checkmark-circle-outline">Pay Now</FormButton>
                        <FormButton @click="cancel"
                            type="primary"
                            :disabled="!paymentmode"
                            left-icon="md-cross-circle-outline">Cancel</FormButton>
                        <div v-if="invoice && invoice.PayLater">
                            <FormButton type="success"
                                @click="payLaterHandler"
                                :disabled="!paymentmode"
                                left-icon="md-time">Pay Later</FormButton>
                        </div>
                    </ButtonGroup>
                </FormRow>
            </template>
        </div>
    </div>
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
            text-align: left;
            margin-bottom: 10px;
        }
        p {
            margin-bottom: 15px;
        }
        h6 {
            text-align: left;
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
        // background: #f4f4f4;
        display: flex;
        > div {
            padding: 8px 15px;
            display: flex;
            font-weight: 500;
            justify-content: flex-start;
            &:nth-child(1) {
                width: 30%;
                span {
                    margin-left: auto;
                }
            }
            &:nth-child(2) {
                width: 20%;
                text-align: right;
                p{
                    margin-left: auto;
                    margin-bottom: 0px;
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
