<template>
    <ValidationObserver ref="observer" v-slot="{ passes }">

        <PageTitle title="Add Money" slot="title" />
        <FormRow>
            <!-- <SideLogo></SideLogo> -->
            <div class="col-sm-3"></div>
            <div class="col-sm-9">
                <div :class="$style.register">

                    <FormRow>
                        <div class="col-sm-4">
                            <InputAmount label="Amount in USD"
                                v-model="form.amount"
                                vid="amount"
                                rules="required" />
                        </div>
                    </FormRow>

                    <div :class="$style.button">
                        <ButtonGroup>
                            <FormButton type="success" v-if="$route.params.id" @click="passes(formSubmit)">Pay</FormButton>
                            <FormButton type="info"  @click="() => backToList()">Cancel</FormButton>
                        </ButtonGroup>
                    </div>
                    <div :class="$style.clearFix"></div>
                </div>

                
            </div>
        </FormRow>
        <TermsAndCondition v-model="terms"></TermsAndCondition>
        <ConfirmationModal v-model="confirmationData" :isVisible="confirmationVisible" :currency="USD"></ConfirmationModal>
        <Popup :value="successModal.visible" :title="successModal.title" type="success" :closable="false" :maskable="false" @close="() => successModal.visible = false">
            <div>
                {{ successModal.message }}
            </div>
            <div slot="footer">
                <FormButton @click="() => backToList()">Back to List</FormButton>
            </div>
        </Popup>
        <Popup :value="warningModal.visible" :title="warningModal.title" type="info" @close="() => warningModal.visible = false">
            <div>
                {{ warningModal.message }}
            </div>
            <div slot="footer">
                <FormButton @click="() => warningModal.visible = false">Close</FormButton>
            </div>
        </Popup>
        <Popup :value="modals.success.isVisible"
            type="success"
            title="Submitted Successfully"
            :closable="false"
            :mask-closable="false"
            @close="() => modals.success.isVisible = false">
        <div :class="$style.success">
            <template v-if="ticket && ticket.TicketReference">
                <template v-if="modals.success.step === 1">
                    <p>Your request has been submitted successfully.</p>
                    <p>Your request # for future reference is <strong>{{ ticket.TicketReference }}</strong>.</p>
                </template>
                <template v-if="modals.success.step === 3">
                    <p>Thank you for your payment.</p>
                    <p>Your case reference #<strong>{{ ticket.TicketReference }}</strong> has been submitted for further processing.</p>
                </template>
            </template>
            <template v-if="modals.success.step === 4">
                <p>{{ modals.success.message }}</p>
            </template>
        </div>
        <ButtonGroup slot="footer">
            <FormButton @click="backToList">Back To List</FormButton>
        </ButtonGroup>
    </Popup>
    <Popup :value="modals.failure.isVisible"
            type="error"
            title="Payment Declined"
            :closable="true"
            @close="() => modals.failure.isVisible = false">
        <div :class="$style.success">
            <template v-if="modals.failure.step === 1">
                <p>{{ modals.failure.message }}</p>
            </template>
        </div>
    </Popup>
    </ValidationObserver>
    
    
</template>

<script>

    import PageTitle from "Components/layout/PageTitle";
    import {totalPayAmountForWallet } from "../api";
    import { ValidationObserver } from "vee-validate";
    import InputAmount from "Components/form/InputAmount";
    import TermsAndCondition from "Components/modal/TermsAndCondition";
    import ConfirmationModal from '../confirmation/confirmation';
    import checkPaymentMixin from 'Mixins/checkPaymentMixin';

    export default {
        name: "Register",
        mixins:[checkPaymentMixin],
        data() {
            return {
                confirmationData: {},
                confirmationVisible: false,
                companyLogo: '',
                onSubmitError: false,
                form: {
                    amount: '',
                },
                warningModal: {
                    visible: false,
                    title: '',
                    message: ''
                },
                successModal: {
                    visible: false,
                    title: 'Success',
                    message: ''
                },
                modals: {
                    success: {
                        isVisible: false,
                        step: 1,
                        message: ''
                    },
                    failure: {
                        isVisible: false,
                        step: 1,
                        message: ''
                    }
                },
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                entityCreated: false,
                is_readonly : false,
                emailSent: false,
                otp: {
                    isModalVisible: false,
                },
                terms: {
                    success: {
                        isVisible: false,
                        message: ''
                    }
                },
            }
        },
        computed: {
            
            userData() {
                return this.$store.state.user.user; 
            },
        },
        created() {
            
            
        },
        watch:{
        },
        components: {
            PageTitle,
            ValidationObserver,
            TermsAndCondition,
            InputAmount,
            ConfirmationModal,
        },
        methods: {
            formSubmit() {
                if(this.form.amount>0)
                {
                    this.confirmationVisible = false;
                    this.form.icsplicense_id = parseInt(this.$route.params.id);
                    totalPayAmountForWallet(this.form).then(this.handleResponse)
                } else{
                    return false;
                }
            },
            handleResponse(response) {
                response.data.icsplicense_id = parseInt(this.$route.params.id);
                console.log(response);
                this.confirmationData = response.data;
                this.confirmationVisible = true;
            },
            backToList(){
                this.$router.push('/myWallet');
            }
        }
    };
</script>

<style lang="scss" module>
    .registerSuccess {
        text-align: center;
        img {
            display: block;
            margin: 40px auto;
        }
        h1 {
            margin-bottom: 20px;
        }
        h4 {
            margin-bottom: 15px;
            font-weight: 400;
            font-size: 14px;
            line-height: 20px;
        }
    }

    .register {
        padding-top: 30px;
        width: 600px;
        margin: 0 auto 0 0;
        h4 {
            font-weight: 400;
            font-size: 14px;
            line-height: 20px;
            margin-bottom: 25px;
        }
    }

    .na {
        margin-top: 10px;
        display: block;
    }
    .account {
        padding-top: 12px;
    }
    .agreement {
        margin: -10px 0 30px;
    }
    .terms{
        h3{
            margin: 15px 0px;
        }
        p{
            text-align: justify;
        }
    }
    .showPurposeMessage{
        font-size: 11px;
        margin-top: 10px;
        color: #3c8dbc;
    }
    .clearFix{
        clear: both;
        padding: 30px;
    }
</style>
