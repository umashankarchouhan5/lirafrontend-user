<template>
    <FormWrapper >
        <PageTitle :title="pageTitle" :pdf="generatePdf" slot="title" :link="`/help/2007/${activeStep.id}`"  />
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
                        <DataTable :actions="true"
                            v-if="pqData.length > 0"
                            :data="pqData"
                            :columns="pqConfig"
                        ></DataTable>
                    </template>
                    <template v-if="modals.success.step === 3">
                        <p>Thank you for your payment.</p>
                        <p>Your case reference #<strong>{{ ticketReference }}</strong> has been submitted for further processing.</p>
                        <DataTable :actions="true"
                            v-if="pqData.length > 0"
                            :data="pqData"
                            :columns="pqConfig"
                        ></DataTable>
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
    import { REPRESENTATIVE_LICENSE } from 'Config/processIds';
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
        checkLicenseAssignedPeople,
        generateSecuritiesPDF,
        validateNinsertCompany,
        fetchLicenseApplicantCompany,
        generatePQfit
    } from '../../components/APIRequests';
    

    export default {
        name: 'SecClearingForm',
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
                pqData: [],
                company: {
                    companyName: '',
                },
                companyModals: {
                    isVisible: false,
                }
            }
        },
        created() {
            this.setSteps(steps);
            fetchLicenseApplicantCompany({process_id: REPRESENTATIVE_LICENSE}).then(
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
            previousYear(){
                return moment().year() - 1;
            }
        },
        methods: {
            generatePdf(){
                const formData = new FormData();
                formData.append('form_id',this.reference_id);
                formData.append('process_id', REPRESENTATIVE_LICENSE);
                formData.append('prefix','REPRESENTATIVE_LICENSE');
                generateSecuritiesPDF(formData).then(
                    res => {
                        
                        window.open(res.data.url,'_blank');
                    }
                )
            },
            getData(){
                if(this.$route.params.id){
                    this.reference_id = this.$route.params.id;
                    this.getDataById(this.$route.params.id)
                }else{
                    this.generateDraft();
                }
            },
            createCompany(){
                validateNinsertCompany({companyName: this.company.companyName}).then(
                    res => {
                        this.company.company_id = res.data[0].company_id
                        this.companyModals.isVisible = false;
                        this.getData();
                    }
                )
            },
            generateDraft(){
                createNewForm({process_id: REPRESENTATIVE_LICENSE, company_id: this.company.company_id}).then(
                    res => {
                        this.reference_id = res.data[0].reference_id;
                        this.$router.push({name:"RepresentativeLicenseById",params:{id:res.data[0].reference_id}})
                        this.getDataById(res.data[0].reference_id);
                    }
                )
            },

            getDataById(val){
                getDynamicDatabyID({process_id: REPRESENTATIVE_LICENSE, reference_id: val}).then(
                    res => {
                        this.form = res.data[1];
                        this.pageTitle = res.data[0][0].FormTitle;
                        this.$store.commit('setProcessId', REPRESENTATIVE_LICENSE);
                        this.getDeclaration();
                    }
                )
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
                    }else{
                        var nextStep = this.activeStep.id - 1;
                        this.validateTicket('',nextStep)
                    }
                }else{
                    this.activateSteps(this.activeStep.id - 1);
                    this.setActiveStep(this.activeStep.id - 1)
                }
            },
            getDeclaration() {
                const data = {
                    process_id:  REPRESENTATIVE_LICENSE
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
                    process_id:  REPRESENTATIVE_LICENSE,
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
                        process_id:  REPRESENTATIVE_LICENSE,
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
                this.setData().then(
                    response => {
                        const data ={
                            process_id: REPRESENTATIVE_LICENSE,
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
                                        this.documentValidationHandler(declarationData);

                                    },
                                    error=>{
                                        this.activateSteps(4);
                                        this.setActiveStep(4);
                                        this.saveHandler();
                                    }
                                )
                                // this.documentValidationHandler(declarationData);
                                   
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
