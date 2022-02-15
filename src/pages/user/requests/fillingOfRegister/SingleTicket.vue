<template>
    <FormWrapper>
        <PageTitle title="Filing Of Register" slot="title"/>
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
                <Declaration v-model="declaration" />
            </div>
        </FormRow>
        
        <ButtonGroup >
            <FormButton v-if="showPrevButton" type="primary" @click="prevStep" left-icon="ios-arrow-back">Previous</FormButton>
            <FormButton
                    left-icon="md-checkmark-circle-outline"
                    v-if="showSubmitButtonAndDeclaration "
                    type="success"
                    @click="finalsubmit">
                Submit
            </FormButton>
            <FormButton v-if="showNextButton" left-icon="ios-arrow-forward" @click="nextStep">Next</FormButton>
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
    import { FILLING_OF_REGISTER } from 'Config/processIds';
    import { requestByWebUser, generateProcessTicket } from './api';
    import Declaration, { fetchDeclaration, addDeclaration } from 'Components/Declaration';
    import DateUtil from 'Utils/dateUtil';
    import validateDocumentMixin from 'Mixins/validateDocumentMixin'

    export default {
        name: 'FillingOfRegister',
        mixins: [formStepsMixin,validateDocumentMixin],
        components: {
            RequestCertificate,
            FormWrapper,
            PageTitle,
            Wizard,
            ValidationObserver,
            Declaration

        },
        data(){
            return{
                isEditable: true,
                mode: 'request',
                ticket: {
                    process_id: null,
                    reference_id: 0,
                    Company_id: null,
                    address_id: null,
                    company: {},
                    isChecked: false,
                    isROM: 0,
                    isROC: 0,
                    isROBO: 0
                },
                declaration: {
                    DeclarationDate: DateUtil.formatDate(Date.now()),
                    Name: '',
                    Place: '',
                    isChecked: false,
                    DisplayText: '',
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
                ticketValue: null,
                customErrors: {
                    notSelectedError: false,
                    selectAtleastOne: false
                },
            }
        },
        computed:{
            showNextButton() {
                return this.activeStep && (this.activeStep.id === 1) && this.steps.length > 1 ;
            },
            showSubmitButtonAndDeclaration() {
                return this.activeStep.id === 2
            },
            showPrevButton() {
                return (this.activeStep && this.activeStep.id === 2)
            },
        },
        created(){
            this.setStepsHandler();
            this.ticket.process_id = FILLING_OF_REGISTER;
            this.$store.commit('setCompany',null);
            this.getDeclaration();
        },
        methods:{
            getDeclaration() {
                const data = {
                    process_id:  FILLING_OF_REGISTER
                };
                fetchDeclaration(data).then(res => {
                    this.declaration.DisplayText = res.data[0].DisplayText;
                })
            },
            documentValidationHandler(declarationData){
                addDeclaration(declarationData).then(res => {
                    const Data = {
                        process_id:  FILLING_OF_REGISTER,
                        reference_id: parseInt(this.ticket.reference_id),
                    }
                    generateProcessTicket(Data).then(
                        res => {
                            
                            this.ticket.TicketReference = res.data[0].TicketReference;
                            this.ticket.Status_id = res.data[0].Status_id;
                            this.modals.success.step = 1;
                            this.modals.success.isVisible = true;
                        }
                    )
                })
            },
            finalsubmit(){
                const { Name, Place, DeclarationDate } = this.declaration;
                const declarationData = {
                    process_id:  FILLING_OF_REGISTER,
                    reference_id: this.ticket.reference_id,
                    Name,
                    Place,
                    DeclarationDate
                };
                this.validateTicket(declarationData);
            },
            validateTicket(declarationData,nextStep) {
                if (this.activeStep.id === 2 ) {
                    this.$refs.validator.validate().then((result) => {
                        if (result && this.validateDocuments() ) {
                            this.documentValidationHandler(declarationData);
                        }
                    });
                }
                else{
                    this.$refs.validator.validate().then((result) => {
                        if(result){
                            console.log('1')
                            this.saveHandler(nextStep);
                        }
                        else{
                            this.customErrors.notSelectedError = false;
                        }
                    });
                }
            },
            saveHandler(nextStep){
                const {
                    Company_id,
                    reference_id,
                    isROM,
                    isROC,
                    isROBO,
                    process_id,
                    entityType
                } = this.ticket;
                console.log(2)
                if(isROM == 0 && isROC == 0 && isROBO == 0){
                    console.log(3)
                    this.customErrors.selectAtleastOne = true;
                }
                else{
                    this.customErrors.selectAtleastOne = false;
                    const data= {
                        Company_id,
                        reference_id,
                        process_id,
                        entityType,
                        isROM,
                        isROC,
                        isROBO,
                    }
                    requestByWebUser(data).then(
                        response => {this.ticket.reference_id = response.data[0].reference_id;

                        if(!this.$route.params.id){
                            this.$router.replace(`filingOfRegister/${response.data[0].reference_id}`);
                        }
                        if(nextStep){
                            this.activateSteps(nextStep);
                            this.setActiveStep(nextStep);
                        }

                    });
                }
            },
            handleSuccess(response){
                
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
                this.validateTicket('',this.activeStep.id + 1)
            },
            prevStep() {
                this.setActiveStep(this.activeStep.id - 1)
            },
            backToList() {
                this.modals.success.isVisible = false;
                this.$router.push('/dashboard');
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