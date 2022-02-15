<template>
    <FormWrapper>
        <PageTitle title="CSL" slot="title" link="/help/345" />
        <Wizard :steps="steps" @changeStep="setActiveStep"/>
        <ValidationObserver ref="validator" >
        <component :is="activeStep.component"
            ref="component"
            :stepId="activeStep.id"
            :readonly="readonly"
            :isSubmitted="isSubmitted"
            v-model="form.data"
            :class="$style.formContent"
            :reference_id="parseInt(taskReference)"
            @nextStep="nextStep"
            @submit="validateTicket"
            @prevStep="prevStep"
            @onPaymentSuccess="onPaymentSuccessHandler"
            @onPayLater="onPayLaterHandler"
            @onChangeCheck="checklistCheck"
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
        <Popup :value="modals.success.isVisible"
               type="success"
               title="Submitted Successfully"
               :closable="false"
               :mask-closable="false"
               @close="() => modals.success.isVisible = false">
            <div :class="$style.success">
                <template v-if="form.data && form.data.TicketReference ">
                    <template v-if="modals.success.step === 1">
                        <p>Your request has been submitted successfully.</p>
                        <p>Your request # for future reference is <strong>{{ form.data.TicketReference }}</strong>.</p>
                    </template>
                    <template v-if="modals.success.step === 3">
                        <p>Thank you for your payment.</p>
                        <p>Your case reference #<strong>{{ form.data.TicketReference }}</strong> has been submitted for further processing.</p>
                    </template>
                </template>
                <template v-if="modals.success.step === 4">
                    <p>{{ modals.success.message }}</p>
                </template>
            </div>
            <ButtonGroup slot="footer">
                <FormButton @click="backToList">Ok</FormButton>
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
    import formStepsMixin from 'Mixins/formStepsMixin';
    import countriesMixin from 'Mixins/countriesMixin';
    import checkPaymentMixin from 'Mixins/checkPaymentMixin';
    // import data from './formData';
    import steps from './steps'
    import DateUtil from 'Utils/dateUtil';
    import { ValidationObserver } from "vee-validate";
    import Declaration, { fetchDeclaration, addDeclaration } from 'Components/Declaration';
    import PageTitle from 'Components/layout/PageTitle';
    import { APPLICATION_OF_CSL  } from 'Config/processIds';
    import validateDocumentMixin from 'Mixins/validateDocumentMixin'

    import {
        createNewForm,
        CSLPCCRequest,
        getTaskDataRequest,
        generateInvoice,
        addUpdateCSLPCCActivityData,
        checkCSLPCCAssignedPeople,
    } from './api'

    export default {
        name: 'CSL',
        mixins: [formStepsMixin, countriesMixin, checkPaymentMixin, validateDocumentMixin],
        computed: {
            userData() {
                return this.$store.state.user.user
            },
            currentProcessId() {
                return this.$store.state.common.currentProcessId
            },
            showSubmitButtonAndDeclaration() {
                return this.activeStep.id === 4 
            },
        },
        data() {
            return {
                form: {
                    data: []
                },
                webTaskId: null,
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
                taskReference: null,
                activityJson: [],
            }
        },
        created() {
            this.setSteps(steps);
            if(this.$route.query.web){
                this.webTaskId = this.$route.query.web;
                this.taskReference = this.$route.query.task;
                this.getData();
            }else{
                this.draftRequest()
            }

        },
        components: {
            FormWrapper,
            Wizard,
            Declaration,
            ValidationObserver,
            PageTitle,
        },
        methods:{
            checklistCheck(data){
                this.activityJson = data;
            },
            draftRequest(){
                createNewForm({
                    process_id:  APPLICATION_OF_CSL
                }).then((response) => {
                    
                    this.$router.replace({query:{web:response.data[0].WebUserTask_id,task:response.data[0].TAskReference_id}})
                    this.webTaskId = response.data[0].WebUserTask_id;
                    this.taskReference = response.data[0].TAskReference_id;
                    this.getData();
                })
            },
            getData(){
                getTaskDataRequest({
                    process_id:  APPLICATION_OF_CSL,
                    reference_id: this.taskReference,
                    webuser_id: this.userData.user_id,
                    webusertask_id: this.webTaskId
                }).then(this.responseHandler)
            },
            responseHandler(data){
                // this.activateSteps(1);
                // this.setActiveStep(1);
                this.form.data = data.data[0];
                var stepToSend = this.form.data.ValidPage;
                if(stepToSend !== null){
                    this.activateSteps(stepToSend);
                    this.setActiveStep(stepToSend);
                }else{
                    this.activateSteps(1);
                    this.setActiveStep(1);
                }
                this.activityJson = this.form.data.ActivityJson;
                this.form.data.ValidPage = 1;
                if(this.form.data.TicketReference){
                    this.form.data.readonly = true;
                    this.readonly = true;
                    this.declaration.DeclarationDate = this.form.data.DeclarationDate;
                    this.declaration.Name = this.form.data.Name;
                    this.declaration.Place = this.form.data.Place;
                    this.activateAllStep();
                }
                if(this.form.data.invoice_id !== null ){
                    
                    this.isSubmitted = true;
                }
                
                this.$store.commit('setProcessId', APPLICATION_OF_CSL);
                
                this.getDeclaration();
            },
            finalsubmit(){
                const { Name, Place, DeclarationDate } = this.declaration;
                const declarationData = {
                    process_id:  APPLICATION_OF_CSL,
                    reference_id: this.form.data.reference_id,
                    Name,
                    Place,
                    DeclarationDate
                };
                this.validateTicket(declarationData);
            },
            documentValidationHandler(declarationData){
                if(this.form.data.ValidPage == 4){
                    addDeclaration(declarationData).then(res => {
                        const ticketData = {
                            process_id:  APPLICATION_OF_CSL,
                            reference_id: parseInt(this.taskReference),
                        }
                        // generatePQfit(ticketData).then(
                        //     res =>{
                        //         this.pqData = res.data;
                        //     }
                        // )
                        generateInvoice(ticketData).then(
                            res => {
                                this.$store.commit('setGeneratedInvoice',res.data[0].invoice_id),
                                this.isSubmitted = true;
                                this.activateSteps(5);
                                this.setActiveStep(5)
                            }
                        )
                      })
                }
            },
            saveHandler(nextStep) {
                var data = this.getDataToSend(nextStep);
                    CSLPCCRequest(data).then(res=>{
                    if(nextStep){
                        this.activateSteps(nextStep);
                        this.setActiveStep(nextStep);
                        this.getData()
                        this.form.data.ValidPage = nextStep;
                    }
                });
                addUpdateCSLPCCActivityData({
                    reference_id: this.taskReference,
                    ActivityJson: this.activityJson
                })
            },
            getDataToSend(nextStep){
                const { process_id,ConvertedCompany_id,ConvertedCompanyName,CompanyName,IncorporationDate,IncorporationCountry_id,ICSPRegNo,ValidPage,BusinessStrategy,ExpatriateYN ,OtherActivity, financialYearEndMonth} = this.form.data;
                const data = {
                    process_id,
                    ConvertedCompanyName: ConvertedCompanyName,
                    ConvertCompany_id:ConvertedCompany_id,
                    Companyname:CompanyName,
                    incorporationdate:IncorporationDate,
                    IncorporationCountry_id,
                    ICSPRegNo,
                    ICSP_id: this.userData.icsp_id,
                    webusertask_id: this.webTaskId,
                    ValidPage: nextStep ? nextStep : ValidPage,
                    BusinessStrategy,
                    ExpatriateYN,
                    OtherActivity,
                    financialYearEndMonth
                }
                return data;
            },
            validateTicket(declarationData,nextStep) {
                if(!this.readonly){
                    if (this.activeStep.id === 4 ) {
                        this.$refs.validator.validate().then((result) => {
                            if (result && this.validateDocuments() ) {
                                const data = {
                                    CSLPCCrequest_id : parseInt(this.taskReference)
                                };
                                checkCSLPCCAssignedPeople(data).then(
                                    res=>{
                                        this.form.data.ValidPage = 4;
                                        this.documentValidationHandler(declarationData);
                                    },
                                    error=>{
                                        this.form.data.ValidPage = 2;
                                        this.activateSteps(2);
                                        this.setActiveStep(2);
                                        this.saveHandler();
                                    }
                                );
                            }
                        });
                    }
                    else{
                        this.$refs.validator.validate().then((result) => {
                            if(result){
                                if(nextStep){
                                    this.form.data.ValidPage = nextStep;
                                }
                                
                            this.saveHandler(nextStep);
                            }
                        });
                    }
                }else{
                    this.setActiveStep(nextStep)
                }
            },
            getDeclaration() {
                const data = {
                    process_id:  APPLICATION_OF_CSL
                };
                fetchDeclaration(data).then(res => {
                    this.declaration.DisplayText = res.data[0].DisplayText;
                })
            },
            onPaymentSuccessHandler(data) {
                this.form.data.TicketReference = data.ticketReference;
                this.form.data.Status_id = data.Status_id;
                this.modals.success.step = 3;
                // this.modals.success.step = data.step;
                this.modals.success.isVisible = true;
            },
            onPayLaterHandler(message) {
                this.modals.success.isVisible = true;
                this.modals.success.step = 4;
                this.modals.success.message = message;
            },
            resetActivatedSteps(){   
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
                    if( this.activeStep.id == 4){
                        this.activateSteps(3);
                        this.setActiveStep(3)
                    }else{
                        var nextStep = this.activeStep.id - 1;
                        this.validateTicket('',nextStep)
                    }
                }else{
                    this.setActiveStep(this.activeStep.id - 1)
                }
            },
            backToList(){
                this.$router.push('/csl')
            }

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