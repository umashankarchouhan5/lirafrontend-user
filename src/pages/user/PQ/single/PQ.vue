<template>
    <FormWrapper>
        <PageTitle title="Personal Questionnaire Form" v-if="!checkIfPQExist && pqAuth.disabled" :link="`/help/${currentProcessId}/${activeStep.id}`"
         :pdf="generatePdf" slot="title" />
        <PageTitle title="Personal Questionnaire Form" v-if="checkIfPQExist || !pqAuth.disabled" :link="`/help/${currentProcessId}`" slot="title" />
        <CheckPQExist v-if="checkIfPQExist" @onCreateNew="createNewPQ" />
        <template v-else>
            <div v-if="pqAuth.disabled">
            <Wizard :steps="steps" @changeStep="setActiveStep"/>
                <ValidationObserver ref="validator" >
                    <component :is="activeStep.component"
                        ref="component"
                        :stepId="activeStep.id"
                        :value="form"
                        :reference_id="form.data.id"
                        :class="$style.formContent"
                        :readonly='readonly'
                    />
                </ValidationObserver>
            </div>
        </template>

        <Popup :value="popupSuccess.isVisible" title="Success!" :mask-closable="false" :closable="false">
            Your form is now in a state where it can be submitted for Fit and Proper assessment.
            <FormButton slot="footer" @click="backToList">Back To List</FormButton>
        </Popup>

        <ButtonGroup>
            <FormButton type="primary" @click="prevStep" v-if="showButtons.prev" left-icon="ios-arrow-back">Previous</FormButton>
            <FormButton type="success" @click="updateForm()" v-if="!checkIfPQExist">Save</FormButton>
            <FormButton type="primary" @click="nextStep" v-if="showButtons.next" right-icon="ios-arrow-forward">Next</FormButton>
            <FormButton type="success" @click="submit" v-if="showButtons.submit" left-icon="md-checkmark-circle-outline">
                Submit
            </FormButton>
        </ButtonGroup>
         <Popup :value="popup.isVisible" title="Success" type="success" :closable="false" :mask-closable="false" @close="() => popup.isVisible = false">
            <p>{{ popup.message }}</p>
            <FormButton  slot="footer" @click="backToList" left-icon="md-arrow-round-back">Back to list</FormButton>
        </Popup>

        <Popup :value="!pqAuth.disabled" :title="pqAuth.title" type="info" :closable="false" :mask-closable="false">
            <div v-if="pqAuth.errMessage !== ''">
                <p :class="$style.error">{{pqAuth.errMessage}}</p>
            </div>
            <h5 v-if="pqAuth.message !== ''">{{pqAuth.message}} </h5>
            <PQPassword v-if="!pqAuth.disabled" @pqValidation="checkPassword" :backButton="true"  @forgotClicked="onForgot" @resetScreen="onResetScreen" @backTo="backToList" />
               
        </Popup>
    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper'
    import Wizard from 'Components/wizard/Wizard.vue'
    import PageTitle from 'Components/layout/PageTitle'
    import CheckPQExist from './components/CheckPQExist'
    import STEPS from './config/steps'
    import data from './config/data'
    import formStepsMixin from 'Mixins/formStepsMixin'
    import DateUtil from 'Utils/dateUtil';
    import { addDeclaration } from 'Components/Declaration';
    import { ValidationObserver } from 'vee-validate'
    import PQPassword from 'Components/pqPassword';
    import validateDocumentMixin from 'Mixins/validateDocumentMixin'

    import {
        getIdentificationTypes,
        getQualificationTypes,
        addUpdatePQForm,
        createNewForm,
        addUpdatePQRecord,
        getPQformDetails,
        getPQRecordByPQid,
        addUpdatePQFormChecklistData,
        getPQChecklistDataByPQId,
        generatePqFormPdf
    } from './config/requests'

    export default {
        name: 'PQ',
        mixins: [formStepsMixin, validateDocumentMixin],
        components: {
            FormWrapper,
            Wizard,
            PageTitle,
            CheckPQExist,
            ValidationObserver,
            PQPassword
        },
        data() {
            return {
                readonly: false,
                popupSuccess: {
                    isVisible: false,
                },
                popup: {
                    isVisible: false,
                    message: '',
                },
                mode: 1,
                form: {
                    data,
                    records: {
                        AQual: [],
                        Addrs: [],
                        Bank: [],
                        CMemb: [],
                        Direc: [],
                        Emplr: [],
                        KPer: [],
                        PQual: [],
                        Partn: [],
                        PrevA: [],
                        Train: [],
                        Trust: [],
                        Natnl: [],
                        Psprt: [],
                    },
                    declaration: {
                        DeclarationDate: DateUtil.formatDate(Date.now()),
                        Name: '',
                        Place: '',
                        isChecked: false,
                        DisplayText: '',
                    },
                    checkList: []
                },
                identificationTypes: null,
                qualificationTypes: null,
                checkIfPQExist: false,
                pdfURL:'',
                pqAuth: {
                    title: 'PQ Authenthication',
                    message: '',
                    errorMessage: '',
                    disabled: false,
                },
                oldValues: {
                    title: 'PQ Authenthication',
                    message: '',
                }
            }
        },
        computed: {
            showButtons() {
                const activeStep = this.activeStep;
                if (activeStep) {
                    return {
                        next: activeStep.id < this.steps.length,
                        submit: activeStep.id === this.steps.length,
                        prev: activeStep.id > 1
                    }
                }
                return false
            },
            userData() {
                return this.$store.state.user.user
            },
            currentProcessId() {
                return this.$store.state.common.currentProcessId
            }
        },
        created() {
            this.mode = 1;

            this.$store.commit('setProcessId', 702);

            const { id: formId } = this.$route.params;
            if (formId === 'check') {
                this.pqAuth.disabled = true;
                this.checkIfPQExist = true;
            } else {
                this.pqAuth.disabled = false;
                
            }
        },
        watch: {
            'pqAuth.disabled': function(val){
                if(val === true && this.$route.params.id !== 'check'){
                    this.getPqData();
                }
            }
        },
        methods: { 
            onResetScreen(){
                this.pqAuth.title = this.oldValues.title;
                this.pqAuth.message = this.oldValues.message;
            },
            onForgot(value){
                this.pqAuth.title = value.title;
                this.pqAuth.message = value.message;
            },
            checkPassword(data){
                if(data.pq_id && data.pq_id === parseInt(this.$route.params.id)){
                    this.pqAuth.disabled = true;
                    this.pqAuth.message = ''
                }
                else if(data.pq_id && data.pq_id !== parseInt(this.$route.params.id)){
                    this.pqAuth.message = 'You are editing for a different PQ Form ( ' + parseInt(this.$route.params.id) + ')';
                }
            },
            getPqData(){
                const { id: formId } = this.$route.params;
                getIdentificationTypes().then(response => this.$store.commit('setIdentificationType', response.data));
                getQualificationTypes().then(response => this.$store.commit('setQualificationTypes', response.data));
                this.setSteps(STEPS);
                this.setActiveStep(1);
                this.form.data.id = formId;
                this.getDataRequest()
                    .then(this.handleDataRequest)
            },
            generatePdf(){
                const formData = new FormData();
                formData.append('pq_id',parseInt(this.form.data.id));
                formData.append('process_id',702);
                formData.append('prefix','PQFORM');
                generatePqFormPdf(formData).then(
                    res => {
                        window.open(res.data.url,'_blank');
                    }
                )
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
            createNewPQ(data) {
                const { Fname, Lname, DOB, PassportNo, email, salutation } = data;
                this.form.data.Fname = Fname;
                this.form.data.Lname = Lname;
                this.form.data.DOB = DOB;
                this.form.data.PassportNo = PassportNo;
                this.form.data.email = email;
                this.form.data.salutation
                const request = {
                    Fname, Lname, DOB, PassportNo, email, salutation
                }
                createNewForm({
                    process_id: this.currentProcessId,
                    ...request
                }).then((response)=> {
                    // this.checkIfPQExist = false;
                    // this.setSteps(STEPS);
                    // this.setActiveStep(1);
                    // this.form.data.id = response.data[0].reference_id;
                    // this.$router.replace({ path: `/pq-forms/${this.form.data.id}` });
                    // this.getDataRequest(true).then(this.handleDataRequest);
                    // this.$router.push('/pq-forms');
                    this.popup.message = 'The PQ password has been emailed to PQ person’s email id. Please use Edit option from list of PQs to proceed forward.'
                    this.popup.isVisible = true;

                })  
            },
            nextStep() {
                this.updateForm(this.activeStep.id + 1)
            },
            prevStep() {
                this.updateForm(this.activeStep.id - 1,'prev')
            },
            pqFormDataRequest() {
                return getPQformDetails({
                    pq_id: this.form.data.id,
                    webuser_id: this.userData.user_id
                })
            },
            submit() {
                this.mode = 2;
                this.updateForm()
            },
            getDataRequest() {
                const requests = [
                    this.pqFormDataRequest(),
                    getPQRecordByPQid(this.form.data.id),
                    getPQChecklistDataByPQId(this.form.data.id)
                ];
                return Promise.all(requests)
            },
            handleDataRequest(response) {
                this.form.data = response[0].data[0];
                if(this.form.data.ValidPage != 0){
                    // var stepToSend = this.form.data.ValidPage === 8 ? this.form.data.ValidPage : this.form.data.ValidPage + 1;
                    var stepToSend = this.form.data.ValidPage
                    this.setActiveStep(stepToSend);
                    this.activateSteps(stepToSend);
                }else{
                    this.setActiveStep(1);
                    this.activateSteps(1);
                }
                if (response[1].data) {
                    this.form.records = response[1].data
                }
                if (response[2].data) {
                    this.form.checkList = response[2].data
                }
            },
            updateForm(nextStep,dir) {
                if(nextStep && (nextStep === 6 || nextStep === 7 )&& dir == 'prev'){
                    this.handleUpdate(nextStep)
                }else{
                    this.$refs.validator.validate().then((res) => {
                        if (res ) {
                            if(this.activeStep.id != 7){
                                this.handleUpdate(nextStep);
                            }
                            else{
                                if (res && this.validateDocuments()) {
                                    this.handleUpdate(nextStep)
                                }
                            }
                        }
                    });   
                }
            },
            handleUpdate(nextStep){
                if(nextStep){
                    this.form.data.ValidPage = nextStep;
                }
                Promise.all([
                    addUpdatePQForm(this.form.data),
                    addUpdatePQRecord({
                        pq_id: this.form.data.id,
                        recordJson: this.form.records
                    }),
                    addUpdatePQFormChecklistData({
                        pq_id: this.form.data.id,
                        PQChecklistDataJson: this.form.checkList
                    })
                ]).then((response) => {
                    this.form.records= response[1].data;
                    if (nextStep) {
                        this.activateSteps(nextStep);
                        this.setActiveStep(nextStep);
                    }else{
                        this.setActiveStep(this.activeStep.id)
                    }
                    if (this.mode === 2) {
                        const { Name, Place, DeclarationDate } = this.form.declaration;

                        const declarationData = {
                            process_id: this.currentProcessId,
                            reference_id: this.form.data.id,
                            Name,
                            Place,
                            DeclarationDate
                        };
                        addDeclaration(declarationData).then(res => {
                            this.popupSuccess.isVisible = true;
                        })
                    }
                })
            },
            backToList() {
                this.popupSuccess.isVisible = false;
                this.popup.isVisible = false;
                this.$router.push({ path: '/pq-forms' })
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
    .error {
        color: #ff3547;
        font-size: 11px;
        line-height: 13px;
        font-weight: 400;
        margin-bottom: 15px;
    }
</style>
