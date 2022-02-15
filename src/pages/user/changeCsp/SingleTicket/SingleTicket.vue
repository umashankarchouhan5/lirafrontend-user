<template>
    <FormWrapper>
        <PageTitle title="CSP Change Request" v-if="processId !==  null && processId !== 0 && processId !== undefined" slot="title"  :link="`/help/${processId}/${activeStep.id}`" />
        <PageTitle title="CSP Change Request" v-else slot="title" link="/help/380" />
        <TicketHeader v-if="ticketValue" :ticketValue="ticketValue" />

        <Wizard :steps="steps" @changeStep="setActiveStep" v-if="isTicket"/>
        <ValidationObserver ref="validator">
            <component :is="activeStep.component"
                v-if="ticket && activeStep && isTicket"
                :readonly="!isEditable"
                :firstPage="firstPage"
                ref="component"
                v-model="ticket"
                :process_ids="process_ids"
                :licenseList="licenseList"
                :mode="mode"
                :icsp_ids="icsp_ids"
                :reference_id="ticket.reference_id"
                :customErrors="customErrors"
                :isSubmitted="isSubmitted"
                @onPaymentSuccess="onPaymentSuccessHandler"
                @onPayLater="onPayLaterHandler"
                :steps="steps" />
            <FormRow v-if="showSubmitButtonAndDeclaration ">
                <div class="col-sm-12">
                    <Declaration v-model="declaration" :readonly="!isEditable" v-if="pcWeb !== null && pcWeb.Declaration === 1"/>
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <ButtonGroup>
                        <FormButton v-if="showPrevButton" type="primary" @click="prevStep" left-icon="ios-arrow-back">Previous</FormButton>
                        <FormButton
                                left-icon="md-checkmark-circle-outline"
                                v-if="showSubmitButtonAndDeclaration && isEditable"
                                type="success"
                                @click="validateTicket">
                            Submit
                        </FormButton>
                        <FormButton v-if="showNextButton" left-icon="ios-arrow-forward" @click="validateTicket">Next</FormButton>
                    </ButtonGroup>
                </div>
            </FormRow>
        </ValidationObserver>
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
                        <DataTable :actions="true"
                            v-if="pqData.length > 0"
                            :data="pqData"
                            :columns="pqConfig"
                        ></DataTable>
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
               title="Payment Cancelled"
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
    import formStepsMixin from 'Mixins/formStepsMixin';
    import Wizard from 'Components/wizard/Wizard';
    import { getTicket, changeTicket, changeType, generateInvoice, getPcWeb, generateProcessTicket, fetchICSPLicenseList, generatePQfit } from './api';
    import PageTitle from 'Components/layout/PageTitle';
    import Declaration, { fetchDeclaration, addDeclaration } from 'Components/Declaration';
    import DateUtil from 'Utils/dateUtil';
    import { ValidationObserver } from "vee-validate";
    import steps from './steps';
    import { PROCESS_ID, REFERENCE_ID } from 'Config/localStorageKeys';
    import TicketHeader from 'Components/layout/TicketHeader';
    import checkPaymentMixin from 'Mixins/checkPaymentMixin';
    import { APPLICATION_OF_ITSP  } from 'Config/processIds';
    import DataTable from 'Components/DataTable';
    import validateDocumentMixin from 'Mixins/validateDocumentMixin'

    const SingleTicket = {
        name: "SingleTicket",
        mixins: [formStepsMixin,checkPaymentMixin,validateDocumentMixin],
        components: {
            FormWrapper,
            PageTitle,
            Wizard,
            ValidationObserver,
            Declaration,
            TicketHeader,
            DataTable
        },
        data() {
            return {
                isTicket: true,
                pcWeb: null,
                ticketValue: null,
                feeOnly: false,
                mode: 'add',
                ticket: {
                    process_id: null,
                    reference_id: 0,
                    ResigReason: '',
                    NoticeDate: '',
                    license_id: null,
                    company: [{
                        EntityType: null,
                        Name: '',
                        CompanyRegNo: '',
                    }],
                },
                process_ids: [],
                icsp_ids: [],
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
                message: '',
                customErrors: [],
                isSubmitted: false,
                isSaved: false,
                particularAction: false,
                firstPage: false,
                licenseList: [],
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
            this.setMode();
            this.fetchData();
            this.setStepsHandler();
            if (this.mode === 'edit') {
                this.isTicket = false
                this.activateSteps();
                this.checkStorageAndGetData();
                
            }
            
           
        },
        computed: {
            isEditable:{
                get(){
                    if(this.$route.params.id && this.$route.params.id != 'add' && this.$route.params.id != 'edit'){
                        return false;
                    }
                    else{
                        return true;
                    }
                    

                },
                set(newValue){
                    return newValue;
                }
            },
            showNextButton() {
                return this.activeStep && this.activeStep.id === 1 && this.steps.length > 1;
            },
            showSubmitButtonAndDeclaration() {
                // if (!this.isEditable) {
                //     return false
                // }
                return this.activeStep.id === 2
            },
            showPrevButton() {
                return (this.activeStep && this.activeStep.id === 2)
            },
            isOnlyOneStep() {
                return this.steps.length === 1;
            },
            processId() {
                return this.$store.state.common.currentProcessId;
            },
            userData() {
                return this.$store.state.user.user;
            },
            changeEntityType() {
                return this.$store.state.user.changeEntityType;
            },
            selectedCompany(){
                return this.$store.state.user.selectedCompany;
            }
        },
        watch:{
            ticket(val){
                this.ticket = val;
                return val;
            },
            processId(val){
                this.setStepsHandler();
            }
        },
        methods: {
            changeAction(data){
                this.particularAction = data;
            },
            
            setMode() {
                if(this.$route.params.id && this.$route.params.id != 'add' && this.$route.params.id != 'edit'){
                    this.isEditable = true;
                    this.firstPage = false;
                    return this.mode = 'edit';
                }
                else if(this.$route.params.addRef){
                    this.isEditable = true;
                    this.firstPage = false;
                    return this.mode = 'edit';
                }
                else{
                    this.firstPage = this.$route.path === '/changesCSP/edit' ? true : false;
                    return this.mode = this.$route.path === '/changesCSP/edit' ? 'edit' : 'add';
                }
            },
            getPcWebData(){
                getPcWeb({
                    step: 1,
                    process_id: this.processId,
                    EntityType: this.ticket.EntityType  ? this.ticket.EntityType : this.changeEntityType,
                }).then(
                    (res) =>{
                        this.pcWeb = res.data[0];
                        this.$store.commit('setPcWeb',this.pcWeb);
                    }
                )
            },
            checkStorageAndGetData() {
                const process_id = sessionStorage.getItem(PROCESS_ID);
                const reference_id = sessionStorage.getItem(REFERENCE_ID);
                if (process_id && reference_id) {
                    
                    this.ticket.reference_id = +reference_id;
                    this.ticket.process_id = +process_id;
                    this.$store.commit('setProcessId', +process_id);
                    this.getTicketHandler();
                }
            },
            getTicketHandler() {
                const { process_id, reference_id } = this.ticket;
                const data = { process_id, reference_id };
                getTicket(data).then(this.getTicketHandlerSuccess)
            },
            getTicketHandlerSuccess(response) {
                this.ticket = response.data[0];
                this.isTicket = true;
                this.getPcWebData();
                if(this.ticket.License_id && this.ticket.License_id !== null){
                    this.ticket.license_id = this.ticket.License_id;
                }
                if(this.ticket.TicketReference){
                    // this.ticket.PeopleJson = this.ticket.peopleJson;
                    this.isEditable = false;
                    this.isSubmitted = true;
                    this.declaration.isChecked = true;
                    this.declaration.DeclarationDate = this.ticket.DeclarationDate;
                    this.declaration.Name = this.ticket.Name;
                    this.declaration.Place = this.ticket.Place;
                    this.declaration.DeclarationMessage = this.ticket.DeclarationMessage;
                    this.activateSteps();
                }
                this.ticketValue = {
                    Referrence: this.ticket.TicketReference,
                    EntityType: this.ticket.EntityType,
                    CompanyName: this.ticket.companyname
                }
                
                this.getDeclaration();
                this.setStepsHandler();
            },
            setStepsHandler() {
                if(this.processId !== 0 && this.processId !== null && this.process_id !== undefined ){
                    this.setSteps(steps[this.processId]);
                    this.setActiveStep(1);
                    if(this.mode === 'edit'){
                        this.activateSteps();
                    }
                }else{
                    this.setSteps(steps[32]);
                    this.setActiveStep(1);
                }
            },
            activateSteps() {
                this.steps.forEach(item => item.isDisabled = false)
                
            },
            fetchData(){
                Promise.all([
                    this.fetchCspList(),
                    this.fetchChangeTypes(),
                ]).then(this.handleData);
            },
            handleData(response){
                    this.licenseList = response[0].data[0];
                    this.process_ids = response[1].data;
            },
            fetchCspList() {
                return fetchICSPLicenseList({ICSP_id: this.userData.icsp_id});
            },
            fetchChangeTypes() {
                return changeType();
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
            getDeclaration() {
                const data = {
                    process_id: this.ticket.process_id,
                    reference_id: this.ticket.reference_id,
                };
                fetchDeclaration(data).then(res => {
                    this.declaration.DisplayText = res.data[0].DisplayText;
                })
            },
            
            addDeclarationHandler() {

                const { Name, Place, DeclarationDate } = this.declaration;

                const declarationData = {
                    process_id: this.processId,
                    reference_id: this.ticket.reference_id,
                    Name,
                    Place,
                    DeclarationDate
                };
                addDeclaration(declarationData).then(this.addDeclarationSuccess);
            },
            addDeclarationSuccess() {
                const { process_id, reference_id } = this.ticket;
                const data = {
                    process_id,
                    reference_id
                }
                if(process_id === 381){
                    generatePQfit(data).then(
                        res =>{
                            this.pqData = res.data;
                        }
                    )
                }
                generateProcessTicket(data).then(
                    (res) => {
                        this.ticket.TicketReference = res.data[0].TicketReference;
                        this.modals.success.step = 1;
                        this.modals.success.isVisible = true;
                    }
                )
            },

            validateTicket() {
                if(this.isEditable){
                    if (this.activeStep.id === 1) {
                            this.$refs.validator.validate().then((result) => {
                                if (result) {
                                    this.saveHandler();
                                    this.getPcWebData();
                                }
                            })
                    } else {
                        this.$refs.validator.validate().then((result) => {
                            if (result && this.validateDocuments()) {
                                this.saveHandler();
                            }
                        });
                    }
                }
                else{
                    this.nextStep();
                }
            },


            saveHandler() {
                for (let key in this.ticket) {
                    if (this.ticket.hasOwnProperty(key) && !this.ticket[key]) {
                        this.ticket[key] = 0;
                    }
                }
                const {
                    process_id,
                    reference_id,
					PrimaryPerson_id,
                    OtherPerson_id,
                    PrincipalAddress_id,
                    TIN ,
                    CompanyNewName,
                    license_id,
                } = this.ticket;
                if(process_id === 380){
                    const data = {
                        process_id,
                        reference_id,
                        PrimaryPerson_id,
                        OtherPerson_id,
                        license_id,
                        ICSP_id: this.userData.icsp_id
                    };
                    changeTicket(data).then(this.saveTicketHandlerSuccess)
                }
                else if(process_id === 381){
                    const data = {
                        process_id,
                        reference_id,
                        license_id,
                        ICSP_id: this.userData.icsp_id
                    };
                    changeTicket(data).then(this.saveTicketHandlerSuccess)
                }
                else if(process_id === 383){
                    const data = {
                        process_id,
                        reference_id,
                        license_id,
                        PrincipalAddress_id,
                        ICSP_id: this.userData.icsp_id
                    };
                    changeTicket(data).then(this.saveTicketHandlerSuccess)
                }
                
                else if(process_id === 390){
                    const data = {
                        process_id,
                        reference_id,
                        TIN,
                        license_id,
                        ICSP_id: this.userData.icsp_id
                    };
                    changeTicket(data).then(this.saveTicketHandlerSuccess)
                }
            },
            saveTicketHandlerSuccess(response) {
                if (this.activeStep.id === 1) {
                    this.isSaved = true;
                    this.nextStep();
                    if(this.mode === 'add'){
                        sessionStorage.setItem(PROCESS_ID, this.ticket.process_id);
                        sessionStorage.setItem(REFERENCE_ID, this.ticket.reference_id);
                        this.$store.dispatch('setProcessId',this.ticket.process_id);

                    }
                    this.activateSteps();
                    this.getDeclaration();
                } else {
                    this.isSubmitted = true;
                    this.addDeclarationHandler()
                }
            },

            nextStep() {
                this.setActiveStep(this.activeStep.id + 1)
            },
            prevStep() {
                this.setActiveStep(this.activeStep.id - 1)
            },
            backToList() {
                this.modals.success.isVisible = false;
                this.$router.push({ path: '/changesCSP' })
            },
            resetActivatedSteps(){   
                this.steps.forEach(item => {
                    if(item.id !== 1){
                        item.isDisabled = true;
                    }
                })
            },
        },
        beforeDestroy(){
            this.resetActivatedSteps();
        }
    }

    export default SingleTicket;
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
