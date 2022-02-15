<template>
    <FormWrapper>
        <PageTitle title="Licensee Annual Renewal" slot="title"/>
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
        
        <FormRow v-if="showSubmitButtonAndDeclaration ">
            <div class="col-sm-12">
                <Declaration :readonly="!isEditable" v-model="declaration" />
            </div>
        </FormRow>
        
        <FormRow>
            <div class="col-sm-12">
                <ButtonGroup>
                    <FormButton v-if="showPrevButton" type="primary" @click="prevStep" left-icon="ios-arrow-back">Previous</FormButton>
                    <FormButton
                            left-icon="md-checkmark-circle-outline"
                            v-if="showSubmitButtonAndDeclaration"
                            type="success"
                            @click="validateTicket">
                        Submit
                    </FormButton>
                    <FormButton v-if="showNextButton" left-icon="ios-arrow-forward"  @click="validateTicket">Next</FormButton>
                </ButtonGroup>
            </div>
        </FormRow>
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
        <Popup :value="modals.error.isVisible"
               type="error"
               title="Error Message"
               :closable="true"
               @close="() => modals.error.isVisible = false">
            <div :class="$style.success">
                <template v-if="modals.error.step === 1">
                    <p>{{ modals.error.message }}</p>
                </template>
            </div>
        </Popup>
    </FormWrapper>
</template>
<script>
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import formStepsMixin from 'Mixins/formStepsMixin';
    import Wizard from 'Components/wizard/Wizard';
    import steps from './steps';
    import { ValidationObserver } from "vee-validate";
    import { annualLicenseRenewalRequest, getNextAnnualLicenseRenewal, generateInvoice, generateProcessTicket,  } from './api';
    import checkPaymentMixin from 'Mixins/checkPaymentMixin';
    import Declaration, { fetchDeclaration, addDeclaration } from 'Components/Declaration';
    import DateUtil from 'Utils/dateUtil';
    import validateDocumentMixin from 'Mixins/validateDocumentMixin'
    import { ANNUAL_RENEWAL_SECURITY, ANNUAL_RENEWAL_INSURANCE, ANNUAL_RENEWAL_GAMBLING } from 'Config/processIds';

    export default {
        name: 'LicenseeAnnualRenewal',
        mixins: [formStepsMixin,checkPaymentMixin,validateDocumentMixin],
        components: {
            FormWrapper,
            PageTitle,
            Wizard,
            ValidationObserver,
            Declaration,
        },
        data(){
            return{
                isEditable: true,
                mode: 'request',
                ticket: {
                    reference_id: 0,
                    for_year: null,
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
                    },
                    error: {
                        isVisible: false,
                        step: 1,
                        message: ''
                    }
                },
                isSubmitted: false,
                customErrors: [],
                declaration: {
                    DeclarationDate: DateUtil.formatDate(Date.now()),
                    Name: '',
                    Place: '',
                    isChecked: false,
                    DisplayText: '',
                },
                licenseList: [],
            }
        },
        computed:{
            showSubmitButtonAndDeclaration() {
                return this.activeStep && this.activeStep.id === 2 && this.steps.length > 1 ;
            },
            userData() {
                return this.$store.state.user.user;
            },
            showNextButton() {
                return this.activeStep && this.activeStep.id === 1 && this.steps.length > 1 ;
            },
            showPrevButton() {
                return this.activeStep && this.activeStep.id === 2 && this.steps.length > 1 ;
            },
            processId() {
                return this.$store.state.common.currentProcessId;
            },
        },
        created(){
            this.setStepsHandler();
            if(this.$route.name == 'LicenseeAnnualRenewalSecurity'){
                this.$store.commit('setProcessId', ANNUAL_RENEWAL_SECURITY);
            // this.getData();
                this.getDeclaration();
            }
            else if(this.$route.name == 'LicenseeAnnualRenewalInsurance'){
                this.$store.commit('setProcessId', ANNUAL_RENEWAL_INSURANCE);
            // this.getData();
                this.getDeclaration();
            }
            else if(this.$route.name == 'LicenseeAnnualRenewalGambling'){
                this.$store.commit('setProcessId', ANNUAL_RENEWAL_GAMBLING);
            // this.getData();
                this.getDeclaration();
            }
        },  
        methods:{
            documentValidationHandler(declarationData){
                addDeclaration(declarationData).then(res => {
                    
                    const Data = {
                        process_id:  this.processId,
                        reference_id: this.ticket.reference_id,
                    }
                    generateInvoice(Data).then(
                        (res) => {
                            this.$store.commit('setGeneratedInvoice',res.data[0].invoice_id);
                            this.isSubmitted = true;
                            this.setActiveStep(3);
                            this.activateSteps();
                        }
                    )
                })
            },
            validateTicket(declarationData,nextStep) {
                if (this.activeStep.id === 2 ) {
                    this.$refs.validator.validate().then((result) => {
                        if (result && this.validateDocuments() ) {
                            const { Name, Place, DeclarationDate } = this.declaration;
                            const declarationData = {
                                process_id:  this.processId,
                                reference_id: this.ticket.reference_id,
                                Name,
                                Place,
                                DeclarationDate
                            };
                            this.documentValidationHandler(declarationData);
                            
                        }
                    });
                }
                else{
                    this.$refs.validator.validate().then((result) => {
                        if (result) {
                            if(this.ticket.Submissioncheck == ''){
                                const {
                                    nextDueYear,
                                } = this.ticket;

                                const data= {
                                    for_year: nextDueYear,
                                    license_id: this.ticket.license_id,
                                }
                                annualLicenseRenewalRequest(data).then(
                                    res => {
                                        this.ticket.reference_id = res.data[0].reference_id;
                                        this.nextStep();
                                    }
                                );
                            }
                            else{
                                this.modals.error.message = this.ticket.Submissioncheck;
                                this.modals.error.isVisible = true;
                            }
                        }
                    })
                }
            },
            getDeclaration() {
                const data = {
                    process_id:  this.processId
                };
                fetchDeclaration(data).then(res => {
                    this.declaration.DisplayText = res.data[0].DisplayText;
                })
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