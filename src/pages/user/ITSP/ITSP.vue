<template>
    <FormWrapper >
        <PageTitle title="ITSP Application Form" slot="title" :link="`/help/704/${activeStep.id}`" :pdf="generatePdf" />
        <Wizard :steps="steps" @changeStep="setActiveStep"/>
        <ValidationObserver ref="validator" v-if="itsp_id !== null">
            <component :is="activeStep.component"
                ref="component"
                :stepId="activeStep.id"
                :readonly="readonly"
                :feeOnly="feeOnly"
                :isSubmitted="isSubmitted"
                v-model="form"
                :class="$style.formContent"
                :reference_id="itsp_id"
                @nextStep="nextStep"
                @submit="validateTicket"
                @onPaymentSuccess="onPaymentSuccessHandler"
                @onPayLater="onPayLaterHandler"
                @prevStep="prevStep"
                @onSave="validateTicket"
                mandatoryDocumentText="The following documents are required to be submitted together with your licence application."
            />
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
                <template v-if="form.data && form.data.TicketReference">
                    <template v-if="modals.success.step === 1">
                        <p>Your request has been submitted successfully.</p>
                        <p>Your request # for future reference is <strong>{{ form.data.TicketReference }}</strong>.</p>
                    </template>
                    <template v-if="modals.success.step === 3">
                        <p>Thank you for your payment.</p>
                        <p>Your case reference #<strong>{{ form.data.TicketReference }}</strong> has been submitted for further processing.</p>
                        <p>Fit and Proper tickets have been generated for the managerial staff </p>
                        <DataTable :actions="true"
                            :data="pqData"
                            :columns="pqConfig"
                        >
                        </DataTable>
                    </template>
                </template>
                <template v-if="modals.success.step === 4">
                    <p>{{ modals.success.message }}</p>
                    <DataTable :actions="true"
                            :data="pqData"
                            :columns="pqConfig"
                        >
                    </DataTable>
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
    import data from './formData';
    import steps from './steps'
    import DateUtil from 'Utils/dateUtil';
    import { ValidationObserver } from "vee-validate";
    import Declaration, { fetchDeclaration, addDeclaration } from 'Components/Declaration';
    import PageTitle from 'Components/layout/PageTitle';
    import { APPLICATION_OF_ITSP  } from 'Config/processIds';
    import DataTable from 'Components/DataTable';
    import validateDocumentMixin from 'Mixins/validateDocumentMixin'
    import checkPaymentMixin from 'Mixins/checkPaymentMixin';

    import {
        ISCPRequest,
        createNewForm,
        ICSPRequestRecordRequest,
        fetchMultipleFields,
        getICSPRequestPeople,
        addUpdatePersonRequest,
        getTaskDataRequest,
        getPersonDetails,
        generateProcessTicket,
        checkAssignedPeople,
        generateInvoice,
        generatePQfit,
        fetchICSPCompanyList,
        fetchWebuserCompany,
        generateITSPPdf,
    } from './APIRequests'

    export default {
        name: 'ITSP',
        mixins: [formStepsMixin, countriesMixin, validateDocumentMixin, checkPaymentMixin],
        computed: {
            userData() {
                return this.$store.state.user.user
            },
            currentProcessId() {
                return this.$store.state.common.currentProcessId
            },
            showSubmitButtonAndDeclaration() {
                return this.activeStep.id === 5 
            },
        },
        data() {
            return {
                form: {
                    data,
                    persons: {
                        Applicant: {},
                        Other: {},
                    },
                    companyList: null,
                    legalJson: [{
                        name: '',phone: '',email: '',address: ''
                    }],
                    auditorJson: [{
                        name: '',phone: '',email: '',address: ''
                    }],
                    staffJson: [{
                        name:'', phone: '', email: '', address: '', fax: ''
                    }]
                },
                records: {
                    A: [],
                    LOAN: [],
                    OE: [],
                    SE: []
                },
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
                feeOnly: false,
                ValidPage: 0,
                isSubmitted: false,
                pqDataVisible: false,
                pqData: [],
                pqConfig:[
                    {
                        title: 'TicketReference',
                        key: 'TicketReference',
                    },
                    {
                        title: 'PQ ID',
                        key: 'uniqueref',
                    },
                    {
                        title: 'Name',
                        key: 'personname',
                    },
                    {
                        title: 'Position',
                        key: 'position',
                    },
                ],
                itsp_id: null,
            }
        },
        created() {
            this.form.data.ValidPage = 0;
            this.setSteps(steps);
                createNewForm({
                    process_id:  APPLICATION_OF_ITSP
                }).then((response) => {
                    var userData = JSON.parse(localStorage.getItem('userData')); // fetch user data from localstorage
                    this.itsp_id = response.data[0].TAskReference_id;
                    this.$store.commit('setCspId',this.itsp_id);
                    userData.webUserTask_id = response.data[0].WebUserTask_id; //mutate data
                    localStorage.setItem('userData',JSON.stringify(userData)); // update localstorage
                    this.$store.commit('setUser',userData) // update on store
                    this.fetchData();
                })
            // }

        },
        components: {
            FormWrapper,
            Wizard,
            Declaration,
            ValidationObserver,
            PageTitle,
            DataTable
        },
        methods: {
            generatePdf(){
                const formData = new FormData();
                formData.append('itsp_id',this.itsp_id);
                formData.append('process_id',APPLICATION_OF_ITSP);
                formData.append('prefix','ITSP');
                generateITSPPdf(formData).then(
                    res => {
                        
                        window.open(res.data.url,'_blank');
                    }
                )
            },
            onPaymentSuccessHandler(data) {
                this.form.data.TicketReference = data.ticketReference;
                this.pqData = data.pqData.length > 0 ? data.pqData : this.pqData;
                this.form.data.Status_id = data.Status_id;
                this.modals.success.step = data.step;
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
                    if( this.activeStep.id == 5){
                        this.activateSteps(4);
                        this.setActiveStep(4)
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
                    process_id:  APPLICATION_OF_ITSP
                };
                fetchDeclaration(data).then(res => {
                    this.declaration.DisplayText = res.data[0].DisplayText;
                })
            },
            finalsubmit(){
                const { Name, Place, DeclarationDate } = this.declaration;
                const declarationData = {
                    process_id:  APPLICATION_OF_ITSP,
                    reference_id: this.form.data.id,
                    Name,
                    Place,
                    DeclarationDate
                };
                this.validateTicket(declarationData);
            },
            documentValidationHandler(declarationData){
                if(this.form.data.ValidPage == 5){
                    addDeclaration(declarationData).then(res => {
                        const ticketData = {
                            process_id:  APPLICATION_OF_ITSP,
                            reference_id: this.form.data.id,
                        }
                        generatePQfit(ticketData).then(
                            res =>{
                                this.pqData = res.data;
                            }
                        )
                        generateInvoice(ticketData).then(
                            res => {
                                this.$store.commit('setGeneratedInvoice',res.data[0].invoice_id),
                            
                                this.isSubmitted = true;
                                this.activateSteps(6);
                                this.setActiveStep(6)
                            }
                        )
                      })
                    
                }
            },
            saveHandler(nextStep) {
                const mode = nextStep ? 1 : 2;
                this.form.data.legalJson = this.form.legalJson.length !== 0 ? JSON.stringify(this.form.legalJson) : null;
                this.form.data.staffJson = this.form.staffJson.length !== 0 ? JSON.stringify(this.form.staffJson) : null;
                this.form.data.auditorJson = this.form.auditorJson.length !== 0 ? JSON.stringify(this.form.auditorJson) : null;
                Promise.all([
                    addUpdatePersonRequest({
                        icsprequest_id: this.itsp_id,
                        recordJson: this.form.persons
                    }),
                    ISCPRequest({
                        ValidPage: this.form.data.ValidPage,
                        process_id:  APPLICATION_OF_ITSP,
                        ...this.form.data,
                        webusertask_id: this.userData.webUserTask_id ,
                        mode
                    }),
                    ICSPRequestRecordRequest({
                        icsprequest_id: this.itsp_id,
                        recordJson: this.form.records
                    }),
                    ]
                ).then(res=>{
                    this.form.persons.Applicant = res[0].data.recordJson.Applicant.id ? res[0].data.recordJson.Applicant : {} ;
                    this.form.persons.Other = res[0].data.recordJson.Other.id ? res[0].data.recordJson.Other: {} ;
                    if(nextStep){
                        this.activateSteps(nextStep);
                        this.setActiveStep(nextStep);
                    }
                });
            },
            validateTicket(declarationData,nextStep) {
                if(!this.readonly){
                    if (this.activeStep.id === 5 ) {
                        this.$refs.validator.validate().then((result) => {
                            if (result && this.validateDocuments() ) {
                                const data = {
                                    icsprequest_id : this.itsp_id
                                };
                                checkAssignedPeople(data).then(
                                    res=>{
                                        this.documentValidationHandler(declarationData);
                                    },
                                    error=>{
                                        this.form.data.ValidPage = 3;
                                        this.activateSteps(3);
                                        this.setActiveStep(3);
                                        this.saveHandler();
                                    }
                                );
                            }
                        });
                    }
                    // else if(this.activeStep.id === 3){
                    //     this.saveHandler(nextStep);
                    // }
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
            
            fetchData() {
                Promise.all([
                    this.getFormData(),
                    this.getPersonData(),
                    this.getRecords(),
                    // this.getCompany()
                ]).then(this.responseHandler)
            },
            getCompany() {
                if(this.userData.icsp_id !== null){
                    return fetchWebuserCompany({ICSP_id:this.userData.icsp_id})
                }
                else{
                    var res ={}
                    res.data = [null]
                    return res
                }
            },
            getRecords() {
                return fetchMultipleFields({
                    icsprequest_id: this.itsp_id,
                    webuser_id: this.userData.user_id
                })
            },
            getPersonData() {
                return getICSPRequestPeople({
                    icsprequest_id: this.itsp_id,
                    webuser_id: this.userData.user_id
                })
            },
            getFormData() {
                return getTaskDataRequest({
                    process_id:  APPLICATION_OF_ITSP,
                    reference_id: this.itsp_id,
                    webuser_id: this.userData.user_id
                })
            },
            responseHandler(response) {
                const data = response.map(item => item.data);
                this.form.data = data[0][0];
                if(!this.$route.params.id || (this.$route.params.id && this.$route.params.id != this.form.data.reference_id)){
                    this.$router.replace({name:'itspFormRef',params:{id:this.form.data.reference_id}})
                }
                this.form.records = data[2];
                // this.form.companyList = data[3];
                if(this.form.data.staffJson && this.form.data.staffJson !== null && this.form.data.staffJson !== ''){
                    this.form.staffJson = JSON.parse(this.form.data.staffJson);
                }
                if(this.form.data.legalJson && this.form.data.legalJson !== null && this.form.data.legalJson !== ''){
                    this.form.legalJson = JSON.parse(this.form.data.legalJson);
                }
                if(this.form.data.auditorJson && this.form.data.auditorJson !== null && this.form.data.auditorJson !== ''){
                    this.form.auditorJson = JSON.parse(this.form.data.auditorJson);
                }
                if(this.form.data.TicketReference){
                    this.form.data.readonly = true;
                    this.readonly = true;
                    this.declaration.DeclarationDate = this.form.data.DeclarationDate;
                    this.declaration.Name = this.form.data.Name;
                    this.declaration.Place = this.form.data.Place;
                    
                }
                if(this.form.data.invoice_id !== null ){
                    
                    this.isSubmitted = true;
                    this.feeOnly = this.form.data.Status_id === 500 ? true : false;
                    this.readonly = true;
                    this.$store.commit('setGeneratedInvoice',this.form.data.invoice_id);
                }
                if(!this.readonly){
                    if(this.form.data.ValidPage != 0 && this.form.data.ValidPage !== null){
                        // var stepToSend = this.form.data.ValidPage === 8 ? this.form.data.ValidPage : this.form.data.ValidPage + 1;
                        var stepToSend = this.form.data.ValidPage;
                        this.activateSteps(stepToSend);
                        this.setActiveStep(stepToSend);
                    }else{
                        this.activateSteps(1);
                        this.setActiveStep(1);
                    }
                }else{
                    this.activateAllStep();
                }
                if((this.userData.company != '' || this.userData.company != null) && this.form.data.Companyname === null && this.form.data.Company_id && this.form.data.Company_id === null){
                    this.form.data.Companyname = this.userData.company;
                }
                this.$store.commit('setProcessId', APPLICATION_OF_ITSP)
                this.fetchPerson();
                this.getDeclaration();
            },
            fetchPerson(){
                const data ={
                    person_id: this.form.data.PrimaryPerson_id
                }
                getPersonDetails( data ).then(response => {
                    this.form.persons.Applicant = response.data[0] ? response.data[0] : {}
                })
                const data1 ={
                    person_id: this.form.data.OtherPerson_id
                }
                getPersonDetails( data1 ).then(response => {
                    this.form.persons.Other = response.data[0] ? response.data[0] : {}
                })
            },
            
            backToList(){
                this.modals.success.isVisible = false;
                this.$router.push({ path: '/dashboard' })
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
