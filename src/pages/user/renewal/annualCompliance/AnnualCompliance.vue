<template>
    <FormWrapper >
        <PageTitle title="Licence Renewal  and Submission of Compliance Form" slot="title" :link="`/help/117/${activeStep.id}`" />
        <div >
            <Wizard :steps="steps" @changeStep="setActiveStep"/>
        
            <ValidationObserver ref="validator" >
                <component :is="activeStep.component"
                    ref="component"
                    :stepId="activeStep.id"
                    :readonly="readonly"
                    :isSubmitted="isSubmitted"
                    v-model="form"
                    :class="$style.formContent"
                    :reference_id="parseInt($route.params.id)"
                    @nextStep="nextStep"
                    @submit="validateTicket"
                    @onPaymentSuccess="onPaymentSuccessHandler"
                    @onPayLater="onPayLaterHandler"
                    @prevStep="prevStep"
                    @onSave="validateTicket"/>
                <FormRow v-if="showSubmitButtonAndDeclaration ">
                    <div class="col-sm-12">
                        <Declaration :readonly="readonly" v-model="declaration" />
                    </div>
                </FormRow>
                <ButtonGroup>
                    <FormButton type="primary" v-if="showSubmitButtonAndDeclaration && !readonly" @click="prevStep" left-icon="ios-arrow-back">Previous</FormButton>
                    <FormButton
                        left-icon="md-checkmark-circle-outline"
                        v-if="showSubmitButtonAndDeclaration && !readonly"
                        type="success"
                        @click="finalsubmit" >
                        Submit
                    </FormButton>
                </ButtonGroup>
            </ValidationObserver>
        </div>


        <Popup :value="modals.success.isVisible"
               type="success"
               title="Submitted Successfully"
               :closable="false"
               :mask-closable="false"
               @close="() => modals.success.isVisible = false">
            <div :class="$style.success">
                <template v-if="ticketReference !== null">
                    <template v-if="modals.success.step === 1">
                        <p>Your request has been submitted successfully.</p>
                        <p>Your request # for future reference is <strong>{{ ticketReference }}</strong>.</p>
                    </template>
                    <template v-if="modals.success.step === 3">
                        <p>Thank you for your payment.</p>
                        <p>Your case reference #<strong>{{ ticketReference }}</strong> has been submitted for further processing.</p>
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

    import FormWrapper from 'Components/form/FormWrapper';
    import Wizard from 'Components/wizard/Wizard.vue';
    import formStepsMixin from 'Mixins/formStepsMixin'
    import countriesMixin from 'Mixins/countriesMixin'
    import steps from './steps'
    import DateUtil from 'Utils/dateUtil';
    import { ValidationObserver } from "vee-validate";
    import Declaration, { fetchDeclaration, addDeclaration } from 'Components/Declaration';
    import PageTitle from 'Components/layout/PageTitle';
    import { ANNUAL_COMPLIANCE } from 'Config/processIds';
    import DataTable from 'Components/DataTable';
    import validateDocumentMixin from 'Mixins/validateDocumentMixin'
    import checkPaymentMixin from 'Mixins/checkPaymentMixin';

    import {
        getTaskDataRequest,
        generateProcessTicket,
        generateInvoice,
        getComplianceDataById,
        addUpdateComplianceData
    } from './APIRequests';
    

    export default {
        name: 'AnnualComplianceForm',
        mixins: [formStepsMixin, countriesMixin, validateDocumentMixin, checkPaymentMixin],
        components: {
            FormWrapper,
            Wizard,
            Declaration,
            ValidationObserver,
            PageTitle,
            DataTable
        },
        data() {
            return {
                form: {},
                declaration: {
                    DeclarationDate: DateUtil.formatDate(Date.now()),
                    Name: '',
                    Place: '',
                    isChecked: false,
                    DisplayText: '',
                },
                countries: [],
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
                ticket:{
                    TicketReference: null,
                    webUserTask_id: null,
                },
                readonly: false,
                ValidPage: 0,
                isSubmitted: false,
                ticketReference: null,
            }
        },
        created() {
            this.setSteps(steps);
            this.getDataById();
        },
        
        computed: {
            userData() {
                return this.$store.state.user.user
            },
            currentProcessId() {
                return this.$store.state.common.currentProcessId
            },
            showSubmitButtonAndDeclaration() {
                return this.activeStep.id === 8 
            },
            previousYear(){
                return moment().year() - 1;
            }
        },
        methods: {

            getDataById(val){
                getComplianceDataById({Compliance_id:this.$route.params.id}).then(
                    res => {
                        this.form = res.data[1];
                        if(res.data[0][0].Status_id === 34){
                            this.readonly = true;
                            this.activateAllStep();
                        }
                        this.$store.commit('setProcessId', ANNUAL_COMPLIANCE)
                        this.getDeclaration();
                    }
                )
            },
            onPaymentSuccessHandler(data) {
                this.ticketReference = data.ticketReference;
                this.modals.success.step = data.step;
                this.modals.success.isVisible = true;
            },
            onPayLaterHandler(message) {
                this.modals.success.isVisible = true;
                this.modals.success.step = 4;
                this.modals.success.message = message;
            },
            resetActivatedSteps(){  
                this.setActiveStep(1); 
                this.steps.forEach(item => {
                    if(item.id !== 1){
                        item.isDisabled = true;
                    }
                })
            },
            activateSteps(step) {
                this.steps.forEach(item => {
                    if(item.id === step){
                        item.isDisabled = false;
                    }else{
                        item.isDisabled = true;
                    }
                })
            },
            activateAllStep(){
                this.steps.forEach(item => {
                    item.isDisabled = false;
                })
            },
            nextStep() {
                if(!this.readonly){
                    var nextStep = this.activeStep.id + 1;
                    this.validateTicket('',nextStep)
                }else{
                    this.setActiveStep(this.activeStep.id + 1)
                }
            },
            prevStep() {
                if(!this.readonly){
                    if( this.activeStep.id == 8){
                        this.activateSteps(7);
                        this.setActiveStep(7)
                    }else{
                        var nextStep = this.activeStep.id - 1;
                        this.validateTicket('',nextStep)
                    }
                }else{
                    this.setActiveStep(this.activeStep.id - 1)
                }
            },
            getDeclaration() {
                const data = {
                    process_id:  ANNUAL_COMPLIANCE
                };
                fetchDeclaration(data).then(res => {
                    this.declaration.DisplayText = res.data[0].DisplayText;
                })
            },
            finalsubmit(){
                const { Name, Place, DeclarationDate } = this.declaration;
                const declarationData = {
                    process_id:  ANNUAL_COMPLIANCE,
                    reference_id: this.$route.params.id,
                    Name,
                    Place,
                    DeclarationDate
                };
                this.validateTicket(declarationData);
            },
            documentValidationHandler(declarationData){
                // if(this.form.data.ValidPage == 5){
                    addDeclaration(declarationData).then(res => {
                        const ticketData = {
                            process_id:  ANNUAL_COMPLIANCE,
                            reference_id: this.$route.params.id,
                        }
                        generateInvoice(ticketData).then(
                            res => {
                                this.$store.commit('setGeneratedInvoice',res.data[0].invoice_id),
                                this.isSubmitted = true;
                                this.activateSteps(9);
                                this.setActiveStep(9)
                            }
                        )
                      })
                    
                // }
            },
            saveHandler(nextStep) {
                this.setData().then(
                    response => {
                        addUpdateComplianceData(response).then(
                            res => {
                                if(nextStep){
                                    this.activateSteps(nextStep);
                                    this.setActiveStep(nextStep);
                                }
                            }
                        )

                    }
                )
                
            },
            async setData(){
                var comData = this.form;
                var len = comData.length;
                for(var i=0; i < len; i++){
                    if(comData[i].Stats  ){
                        comData[i].StatsJson = JSON.stringify(comData[i].Stats)
                    }
                }

                const data = {
                    Compliance_id: this.$route.params.id,
                    ComplianceDataJson: comData
                }
                return data;
            },

            validateTicket(declarationData,nextStep) {
                if(!this.readonly){
                    if (this.activeStep.id === 8 ) {
                        this.$refs.validator.validate().then((result) => {
                            if (result && this.validateDocuments() ) {

                                this.documentValidationHandler(declarationData);
                                   
                            }
                        });
                    }
                    else{
                        this.$refs.validator.validate().then((result) => {
                            if(result){
                                if(nextStep){
                                    // this.form.data.ValidPage = nextStep;
                                }
                            this.saveHandler(nextStep);
                            }
                        });
                    }
                }else{
                    this.setActiveStep(nextStep)
                }
            },
            backToList(){
                this.modals.success.isVisible = false;
                this.$router.push('/dashboard')
            }
        },
        beforeDestroy(){
            this.resetActivatedSteps();
        }
    }
</script>

<style lang="scss" module>
    .formContent {
        h6 {
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 20px;
        }
        p {
            text-align: justify;
            margin-bottom: 20px;
        }
        ol {
            padding-left: 40px;
            margin-bottom: 20px;
            li {
                margin-bottom: 10px;
            }
        }
    }
</style>
