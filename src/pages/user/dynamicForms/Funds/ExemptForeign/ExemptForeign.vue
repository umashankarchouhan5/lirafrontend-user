<template>
    <FormWrapper >
        <PageTitle :title="pageTitle" slot="title" :link="`/help/2012/${activeStep.id}`" />
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
                    :companyName="company.companyName"
                    :reference_id="parseInt($route.params.id)"
                    :process_id="currentProcessId"
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
                
                <div v-if="customErrors.notFilledCompletely.status" :class="$style.error"><span >{{customErrors.notFilledCompletely.message}}</span></div>

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
                        
                        <DataTable :actions="true"
                            v-if="pqData.length > 0"
                            :data="pqData"
                            :columns="pqConfig"
                            >
                        </DataTable>
                    </template>
                </template>
                <template v-if="modals.success.step === 4">
                    <p>{{ modals.success.message }}</p>
                    
                    <DataTable :actions="true"
                        v-if="pqData.length > 0"
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
        <Popup :value="companyModals.isVisible"
            type="info"
            title="Company"
            :closable="false"
            :mask-closable="false"
            @close="() => companyModals.isVisible = false">

            <InputText v-model="company.companyName" label="Company Name" />
            
            <ButtonGroup slot="footer">
                <FormButton @click="createCompany">Create</FormButton>
            </ButtonGroup>
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
    import { EXEMPT_FOREIGN } from 'Config/processIds';
    import DataTable from 'Components/DataTable';
    import checkPaymentMixin from 'Mixins/checkPaymentMixin';
    import validateDocumentMixin from 'Mixins/validateDocumentMixin'

    import {
        getTaskDataRequest,
        generateProcessTicket,
        generateInvoice,
        getDynamicDatabyID,
        addUpdateDynamicData,
        createNewForm,
        fetchLicenseApplicantCompany,
        validateNinsertCompany,
        generatePQfit,
        generateSecuritiesPDF,
        checkLicenseAssignedPeople,
    } from '../../components/APIRequests';
    

    export default {
        name: 'ExemptForeign',
        mixins: [formStepsMixin, countriesMixin, checkPaymentMixin, validateDocumentMixin],
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
                reference_id: 0,
                pageTitle: '',
                company: {
                    companyName: '',
                },
                companyModals: {
                    isVisible: false,
                },
                customErrors: {
                    notFilledCompletely: {
                        status: false, 
                        message: 'Fill form completely first.'
                    }
                },
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
            }
        },
        created() {
            this.setSteps(steps);
            fetchLicenseApplicantCompany({process_id: EXEMPT_FOREIGN}).then(
                res => {
                    if(res.data[0].company_id === 0){
                        this.companyModals.isVisible = true;
                    }
                    else{
                        this.company.company_id = res.data[0].company_id;
                        this.company.companyName = res.data[0].companyName;
                        this.getData();
                    }
                },
                err => {
                    setTimeout(() => {
                        this.$router.push('/dashboard')
                    },500);
                }
            )
            this.customErrors.notFilledCompletely.status = false;
        },
        
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
            userDefinedStep() {
                return this.$store.state.common.userDefinedStep;
            },
            previousYear(){
                return moment().year() - 1;
            }
        },
        methods: {
            generatePdf(){
                const formData = new FormData();
                formData.append('form_id',this.reference_id);
                formData.append('process_id', EXEMPT_FOREIGN);
                formData.append('prefix','EXEMPT_FOREIGN');
                generateSecuritiesPDF(formData).then(
                    res => {
                        
                        window.open(res.data.url,'_blank');
                    }
                )
            },
            getData(){
                if(this.$route.params.id){
                    this.reference_id = parseInt(this.$route.params.id);
                    this.getDataById(this.$route.params.id)
                }else{
                    this.generateDraft();
                }
            },
            createCompany(){
                validateNinsertCompany({companyName: this.company.companyName}).then(
                    res => {
                        this.company.company_id = res.data[0].company_id;
                        this.companyModals.isVisible = false;
                        this.getData();
                    }
                )
            },
            generateDraft(){
                createNewForm({process_id: EXEMPT_FOREIGN, company_id: this.company.company_id}).then(
                    res => {
                        this.reference_id = res.data[0].reference_id;
                        this.$router.replace({name:"ExemptForeignFundById",params:{id:res.data[0].reference_id}})
                        this.getDataById(res.data[0].reference_id);
                    }
                )
            },

            getDataById(val){
                getDynamicDatabyID({process_id: EXEMPT_FOREIGN, reference_id: val}).then(
                    res => {
                        this.form = res.data[1];
                        this.pageTitle = res.data[0][0].FormTitle;
                        this.$store.commit('setProcessId', EXEMPT_FOREIGN);
                        this.getDeclaration();
                        if(this.userDefinedStep !== null){
                            this.setActiveStep(this.userDefinedStep);
                            this.activateSteps(this.userDefinedStep);
                            this.$store.commit('setUserDefinedStep',null);
                        }
                    }
                )
            },
            checkFormStatus() {
                const actualQuestions = this.form.filter( item => item.BlockJson == null);
                const totalCompleted = this.form.filter( ele => {
                    if(ele.BlockJson !== null) {
                        return false;
                    }
                    else if(ele.ValueTextArea == null && ele.ValueInt == null && ele.ValueDate == null && (ele.isNA == null || ele.isNA == false) && ele.FieldType !== 'table' && ( ele.FieldType !== 'table' && ele.isMandatory == 1) ){
                        return false
                    }
                    else if(ele.FieldType == 'table'){
                        const formatJson = JSON.parse(ele.FieldJson);
                        const tableValue = JSON.parse(ele.TableJson);
                        const filled = formatJson.every( item => {
                            if(item.required != true){
                                return true;
                            }
                            else{
                                try {

                                    if(tableValue[0][item.field].trim() !== '' ){
                                        return true;
                                    }
                                    return false;
                                    
                                } catch (error) {
                                    return true;
                                }
                            }
                            return false;
                        })
                        if( filled || ele.isNA == true || ele.isNA == 1 ){
                            return true;
                        }
                        return false
                    }
                    return true;
                });
                return totalCompleted.length === actualQuestions.length;
            },
            onPaymentSuccessHandler(data) {
                this.ticketReference = data.ticketReference;
                this.pqData = data.pqData.length > 0 ? data.pqData : this.pqData;
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
                    this.activateSteps(this.activeStep.id + 1);
                    this.setActiveStep(this.activeStep.id + 1)
                }
            },
            prevStep() {
                if(!this.readonly){
                    if( this.activeStep.id == 5){
                        this.activateSteps(this.activeStep.id - 1);
                        this.setActiveStep(this.activeStep.id - 1);
                        this.customErrors.notFilledCompletely.status = false;
                    }else{
                        var nextStep = this.activeStep.id - 1;
                        this.validateTicket('',nextStep)
                    }
                }else{
                    this.activateSteps(this.activeStep.id - 1);
                    this.setActiveStep(this.activeStep.id - 1);
                }
            },
            getDeclaration() {
                const data = {
                    process_id:  EXEMPT_FOREIGN
                };
                fetchDeclaration(data).then(res => {
                    this.declaration.DisplayText = res.data[0].DisplayText;
                })
            },
            submitTest(){

            },
            finalsubmit(){
                const { Name, Place, DeclarationDate } = this.declaration;
                const declarationData = {
                    process_id:  EXEMPT_FOREIGN,
                    reference_id: this.reference_id,
                    Name,
                    Place,
                    DeclarationDate
                };
                this.validateTicket(declarationData);
            },
            documentValidationHandler(declarationData){
                addDeclaration(declarationData).then(res => {
                    const ticketData = {
                        process_id:  EXEMPT_FOREIGN,
                        reference_id: this.reference_id,
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
            },
            saveHandler(nextStep) {
                this.customErrors.notFilledCompletely.status = false;
                this.setData().then(
                    response => {
                        const data ={
                            process_id: EXEMPT_FOREIGN,
                            reference_id: this.reference_id,
                             FormDataJson: response.ComplianceDataJson
                        }
                        addUpdateDynamicData(data).then(
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
                        comData[i].TableJson = JSON.stringify(comData[i].Stats)
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
                    if (this.activeStep.id === 5 ) {
                        this.$refs.validator.validate().then((result) => {
                            if (result && this.validateDocuments() ) {
                                const data = {
                                    licenseRequest_id: this.reference_id
                                }
                                checkLicenseAssignedPeople(data).then(
                                    res => {
                                        if(this.checkFormStatus()){
                                            this.customErrors.notFilledCompletely.status = false;
                                            this.documentValidationHandler(declarationData);
                                        }
                                        else{
                                            this.customErrors.notFilledCompletely.status = true;
                                        }
                                 
                                    },
                                    error=>{
                                        this.activateSteps(4);
                                        this.setActiveStep(4);
                                        this.saveHandler();
                                    }
                                )  
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
    .error {
        color: #ff3547;
        font-size: 11px;
        line-height: 11px;
        margin: 10px 0;
        font-weight: 400;
    }
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
