<template>
    <FormWrapper>
        <PageTitle title="Certificate of Official Search" slot="title"/>
        <Wizard :steps="steps" @changeStep="setActiveStep"/>
        <ValidationObserver ref="validator">
            <component :is="activeStep.component"
                v-if="ticket && activeStep"
                :readonly="!isEditable"
                ref="component"
                v-model="ticket"
                :mode="mode"
                :reference_id="ticket.reference_id"
                :customErrors="customErrors"
                :isSubmitted="isSubmitted"
                @onPaymentSuccess="onPaymentSuccessHandler"
                @onPayLater="onPayLaterHandler"
                :steps="steps" />
             
        </ValidationObserver>
        
        <ButtonGroup >
            <FormButton left-icon="ios-arrow-forward" @click="validateTicket">Submit</FormButton>
        </ButtonGroup>
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
    </FormWrapper>
</template>
<script>
    import RequestCertificate from './components/RequestCertificate';
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import formStepsMixin from 'Mixins/formStepsMixin';
    import Wizard from 'Components/wizard/Wizard';
    import steps from './steps';
    import { ValidationObserver } from "vee-validate";
    import { CERTIFICATE_OF_OFFICIAL_SEARCH_PROCESS_ID } from 'Config/processIds';
    import { requestByWebUser, generateInvoice, generateProcessTicket } from './api';
    // import TicketHeader from 'Components/layout/TicketHeader';
    import checkPaymentMixin from 'Mixins/checkPaymentMixin';

    export default {
        name: 'CertificateOfOfficialSearchTicket',
        data(){
            return{
                isEditable: true,
                mode: 'request',
                ticket: {
                    process_id: null,
                    reference_id: 0,
                    Company_id: null,
                    address_id: null,
                    MailingAddress_id: null,
                    company: {},
                    isChecked: false,
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
                isSubmitted: false,
                customErrors: [],
                ticketValue: null,
            }
        },
        components: {
            RequestCertificate,
            FormWrapper,
            PageTitle,
            // TicketHeader,
            Wizard,
            ValidationObserver,

        },
        mixins: [formStepsMixin,checkPaymentMixin],
        computed:{
            showSubmitButton() {
                return this.activeStep && this.activeStep.id === 1 && this.steps.length > 1 ;
            },
        },
        created(){
            this.setStepsHandler();
            this.ticket.process_id = CERTIFICATE_OF_OFFICIAL_SEARCH_PROCESS_ID;
            this.$store.commit('setCompany',null);
        },
        methods:{
            validateTicket() {
                this.$refs.validator.validate().then((result) => {
                    if (result) {
                        this.submitForm();
                    }
                })
            },
            submitForm(){
                const {
                    typeCompanyReg,
                    typeCompanyName,
                    reference_id,
                    MailingAddress_id,
                    process_id,
                    entityType
                } = this.ticket;

                const data= {
                    typeCompanyReg,
                    typeCompanyName,
                    reference_id,
                    MailingAddress_id,
                    process_id,
                    entityType
                }
                requestByWebUser(data).then(this.handleSuccess);
            },
            handleSuccess(response){
                this.ticket.reference_id = response.data[0].reference_id;
                const { process_id, reference_id } = this.ticket;
                const data = {
                        process_id,
                        reference_id
                    }
                    generateProcessTicket(data).then(
                        res => {
                            this.ticket.TicketReference = res.data[0].TicketReference;
                            this.modals.success.step = 1;
                            this.modals.success.isVisible = true;
                        }
                    )
                    // generateInvoice(data).then(
                    //     (res) => {
                    //         this.$store.commit('setGeneratedInvoice',res.data[0].invoice_id);
                    //         this.isSubmitted = true;
                    //         this.setActiveStep(2);
                    //         this.activateSteps();
                    //     }
                    // )
            },
            setStepsHandler() {
                this.setSteps(steps);
                this.setActiveStep(1);
            },
            activateSteps() {
                this.steps.forEach(item => item.isDisabled = false)
            },
            
            setMode() {
                if(this.$route.params.action && this.$route.params.action != 'request' ){
                    this.isEditable = false;
                    return this.mode = 'request';
                }else{
                    return this.mode = 'ticket';
                }
            },
            onPaymentSuccessHandler(data) {
                this.ticket.TicketReference = data.ticketReference;
                this.ticket.Status_id = data.Status_id;
                this.modals.success.step = data.step;
                this.modals.success.isVisible = true;
            },
            onPayLaterHandler(message) {
                this.modals.success.isVisible = true;
                this.modals.success.step = 4;
                this.modals.success.message = message;
            },
            nextStep() {
                this.setActiveStep(this.activeStep.id + 1)
            },
            prevStep() {
                this.setActiveStep(this.activeStep.id - 1)
            },
            backToList() {
                this.modals.success.isVisible = false;
                this.$router.go(-1);
            },
        }
    }
</script>


<style lang="scss" module>
    .success {
        p {
            margin-bottom: 10px;
            &:last-child {
                margin-bottom: 0;
            }
        }
    }
</style>