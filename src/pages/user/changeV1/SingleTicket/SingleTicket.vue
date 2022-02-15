<template>
    <FormWrapper>
        <PageTitle title="Changes" v-if="processId ===  null || processId === 0" slot="title" link="/help/300"/>
        <PageTitle :title="`Changes ${processTitleName}`" v-else slot="title" :link="`/help/${processId}/${activeStep.id}`"/>
        <TicketHeader v-if="ticketValue" :ticketValue="ticketValue" />

        <Wizard :steps="steps" @changeStep="setActiveStep" v-if="isTicket"/>
        <ValidationObserver ref="validator">
            <component :is="activeStep.component"
                v-if="ticket && activeStep && isTicket"
                :readonly="!isEditable"
                ref="component"
                v-model="ticket"
                :process_ids="process_ids"
                :mode="mode"
                :feeOnly="feeOnly"
                :reference_id="ticket.reference_id"
                :customErrors="customErrors"
                :isSubmitted="isSubmitted"
                :isSaved="isSaved"
                @onPaymentSuccess="onPaymentSuccessHandler"
                @onPayLater="onPayLaterHandler"
                @changeStep="changeSteps"
                @307Action="changeAction"
                @changeProcessName="changeTitleName"
                :steps="steps" />
            <FormRow v-if="showSubmitButtonAndDeclaration ">
                <div class="col-sm-12">
                    <Declaration v-model="declaration" :readonly="!isEditable" v-if="pcWeb !== null && pcWeb.Declaration === 1"/>
                </div>
            </FormRow>
            <!-- Error Message -->
            <div :class="$style.error" v-if="customErrors.mergeNotEnoughCompany">Atleast two entities must be selected.</div>
            <div :class="$style.error" v-if="customErrors.noCompanyIdFound">No valid company selected.</div>
            <br />
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
                        <FormButton v-if="showNextButton" left-icon="ios-arrow-forward" :disabled="(processId === 307 && particularAction === false)" @click="validateTicket">Next</FormButton>
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

    import FormWrapper from 'Components/form/FormWrapper';
    import formStepsMixin from 'Mixins/formStepsMixin';
    import Wizard from 'Components/wizard/Wizard';
    import { getTicket, changeTicket, changeType, searchICSPTypes, generateInvoice, getPcWeb, generateProcessTicket } from './api';
    import PageTitle from 'Components/layout/PageTitle';
    import Declaration, { fetchDeclaration, addDeclaration } from 'Components/Declaration';
    import DateUtil from 'Utils/dateUtil';
    import { ValidationObserver } from "vee-validate";
    import steps from './steps';
    import { PROCESS_ID, REFERENCE_ID } from 'Config/localStorageKeys';
    import TicketHeader from 'Components/layout/TicketHeader';
    import checkPaymentMixin from 'Mixins/checkPaymentMixin';
    import validateDocumentMixin from 'Mixins/validateDocumentMixin'

    const SingleTicket = {
        name: "SingleTicket",
        mixins: [formStepsMixin,checkPaymentMixin,validateDocumentMixin],
        data() {
            return {
                isTicket: true,
                // pcWeb: null,
                ticketValue: null,
                feeOnly: false,
                mode: 'add',
                ticket: {
                    process_id: null,
                    reference_id: 0,
                    Company_id: null,
                    OutgoingICSP_id: null,
                    IncomingICSP_id: null,
                    ICSPCode: '',
                    address_id: null,
                    ApprovedName_id: null,
                    ResigReason: '',
                    NoticeDate: '',
                    ResolutionDate: '',
                    company: [{
                        EntityType: null,
                        Name: '',
                        CompanyRegNo: '',
                    }],
                    mergeJson: [],
                    isMOU: 0,
                    isAOA: 0,
                    isRestatedMOU: 0,
                    isRestatedAOA: 0,
                    newAddressId: null
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
                customErrors: {
                    mergeNotEnoughCompany: false,
                    noCompanyIdFound: false
                },
                isSubmitted: false,
                isSaved: false,
                particularAction: false,
                processTitleName: '',
                changeProcesses: [ 109,300,301,302,303,304,305,307,309,310,602,603,311 ]
            }
        },
        computed: {
            pcWeb() {
                return this.$store.state.user.pcWeb;
            },
            isEditable:{
                get(){
                    if(this.$route.params.id && this.$route.params.id != 'add' && this.$route.params.id != 'edit'){
                        return false;
                    }else{
                        return (this.mode === 'edit' && this.activeStep.id === 2 && !this.feeOnly)
                        || (this.mode === 'edit' && this.activeStep.id === 1 && !this.feeOnly)
                        || (this.mode === 'add' && (this.activeStep.id === 2 || this.activeStep.id === 1) && this.isSaved)
                        || (this.mode === 'add' && (this.activeStep.id === 1) && !this.isSaved);
                    }
                    

                },
                set(newValue){
                    return newValue;
                }
            },
            showNextButton() {
                return this.activeStep && this.activeStep.id === 1 && this.steps.length > 1 && ((this.pcWeb !== null && (this.pcWeb.isRestricted == 0 || this.pcWeb.isRestricted == null || this.userData.isRestricted == 0) || this.ticket.process_id == 302));
            },
            showSubmitButtonAndDeclaration() {
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
        components: {
            FormWrapper,
            PageTitle,
            Wizard,
            ValidationObserver,
            Declaration,
            TicketHeader
        },
        created() {
            this.setMode();
            this.fetchChangeTypes();
            // this.fetchICSPTypes();
            this.setStepsHandler();
            if (this.mode === 'edit') {
                this.isTicket = false
                this.activateAllStep();
                this.checkStorageAndGetData();
                
            }
        },
        watch:{
            ticket(val){
                this.ticket = val;
                return val;
            },
            processId(val){
                this.setStepsHandler();
            },
        },
        methods: {
            changeTitleName(val){
                
                this.processTitleName = val !== "" ? "- " + val : '';
            },
            changeAction(data){
                this.particularAction = data;
            },
            changeSteps(entity){
                console.log(entity)
                if(entity === 'Trust'){
                    this.setSteps(steps[305]);
                    this.setActiveStep(1);
                }
                else if (entity == "threeStep"){
                    this.setSteps(steps[300]);
                    this.setActiveStep(1);
                }
                // else{
                //     this.setSteps(steps[300]);
                //     this.setActiveStep(1);
                // }
            },
            setMode() {
                if(this.$route.params.id && this.$route.params.id != 'add' && this.$route.params.id != 'edit'){
                    this.isEditable = false;
                    return this.mode = 'edit';
                }
                else if(this.$route.params.addRef){
                    this.isEditable = false;
                    return this.mode = 'edit';
                }
                else{
                    return this.mode = this.$route.path === '/changes/edit' ? 'edit' : 'add'
                }
            },
            getPcWebData(){
                getPcWeb({
                    step: 1,
                    process_id: this.processId,
                    EntityType: this.ticket.EntityType  ? this.ticket.EntityType : this.changeEntityType,
                }).then(
                    (res) =>{
                        // this.pcWeb = res.data[0];
                        this.$store.commit('setPcWeb',res.data[0]);
                        if(res.data[0].isRestricted && res.data[0].isRestricted == 1){
                            this.isEditable = false;
                        }
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
                if(this.ticket.reference_id && this.ticket.reference_id !== 0){
                    this.isSaved = true;
                }
                if(this.ticket.mergeJson && this.ticket.mergeJson !== null){
                    this.ticket.mergeJson = JSON.parse(this.ticket.mergeJson);
                }
                this.isTicket = true;
                this.getPcWebData();
                this.ticketValue = {
                    Referrence: this.ticket.TicketReference,
                    EntityType: this.ticket.EntityType,
                    CompanyName: this.ticket.companyname
                }
                if( this.ticket.TicketReference !== null){
                    
                    this.feeOnly = true
                    this.isEditable = false;
                    this.isSubmitted = true;
                    this.declaration.isChecked = true;
                    this.declaration.DeclarationDate = this.ticket.DeclarationDate;
                    this.declaration.Name = this.ticket.Name;
                    this.declaration.Place = this.ticket.Place;
                    this.declaration.DeclarationMessage = this.ticket.DeclarationMessage;
                    // this.$store.commit('setGeneratedInvoice',this.ticket.invoice_id);
                }
                if(this.ticket.Address_id && this.ticket.Address_id !== null && !this.ticket.address_id){
                    this.ticket.address_id = this.ticket.Address_id;
                }
                
                this.getDeclaration();
                this.setStepsHandler();
            },
            fetchICSPTypes() {
                searchICSPTypes({is_csp: true}).then(res => {
                    this.icsp_ids = res.data
                })
            },
            setStepsHandler() {
                if(this.processId !== 0 && this.processId !== null && (this.changeProcesses.indexOf(this.processId) !== -1)){
                    // this.setSteps(steps[this.processId]);
                    this.setSteps(steps[305])
                    this.setActiveStep(1);
                    if(this.mode === 'edit'){
                        // this.activateSteps();
                        if(this.ticket.invoice_id === null ){
                            if(this.steps.length === 3){
                                this.steps.forEach( step => {
                                    if(step.id !== 3){
                                        step.isDisabled = false;
                                    }
                                    else{
                                        step.isDisabled = true;
                                    }
                                })
                            }
                            else{
                                this.activateAllStep();
                            }
                        }
                        else{
                            this.activateAllStep();
                        }
                    }
                }else{
                    this.setSteps(steps[305]);
                    this.setActiveStep(1);
                }
            },
            activateAllStep(){
                this.steps.forEach(item => {
                    item.isDisabled = false;
                })
            },
            activateSteps(step) {
                // this.steps.forEach(item => item.isDisabled = false)
                this.steps.forEach(item => {
                    if(item.id === step){
                        item.isDisabled = false;
                    }else{
                        item.isDisabled = true;
                    }
                })
                
            },
            fetchChangeTypes() {
                changeType().then(res => {
                    this.process_ids = res.data
                })
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
                    EntityType: this.ticket.EntityType,
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
                // if( (process_id == 602 )){
                //     generateInvoice(data).then(
                //         (res) => {
                //             this.$store.commit('setGeneratedInvoice',res.data[0].invoice_id),
                //             this.feeOnly = true;
                //             this.isEditable = false;
                //             this.setActiveStep(3)
                //             this.activateAllStep();
                //         }
                //     )
                // }else{
                    generateProcessTicket(data).then(
                        (res) => {
                            this.ticket.TicketReference = res.data[0].TicketReference;
                            this.modals.success.step = 1;
                            this.modals.success.isVisible = true;
                        }
                    )
                // }
            },

            validateTicket() {
                if (this.activeStep.id === 1) {
                    if (this.mode !== 'edit') {
                        this.$refs.validator.validate().then((result) => {
                            if (result) {
                                this.saveHandler();
                                this.getPcWebData();
                            }
                        })
                    } else {
                        this.activateSteps(2); 
                        this.setActiveStep(2)
                    }
                } else {
                    this.$refs.validator.validate().then((result) => {
                        if (result && this.validateDocuments()) {
                            this.saveHandler();
                        }
                    });
                }
            },

            

            saveHandler() {
                this.customErrors.mergeNotEnoughCompany = false;
                this.customErrors.noCompanyIdFound = false;
                for (let key in this.ticket) {
                    if (this.ticket.hasOwnProperty(key) && !this.ticket[key]) {
                        this.ticket[key] = 0;
                    }
                }
                const {
                    process_id,
                    reference_id,
                    Company_id,
                    IncomingICSP_id,
                    OutgoingICSP_id,
                    ResolutionDate,
                    address_id,
                    ApprovedName_id,
                    CompanyNewName,
                    RegisterMOA,
                    ResigReason,
                    NoticeDate,
                    isMOU,
                    isAOA,
                    isRestatedMOU,
                    isRestatedAOA,
                    comment,
                    currency,
                    shareCapital,
                    mergeJson,
                    effectiveDate,
                    typeCompanyReg,
                    typeCompanyName,
                } = this.ticket;


                if(this.ticket.process_id == 303){
                    const data = {
                        process_id,
                        reference_id,
                        Company_id,
                        ResolutionDate,
                        address_id,
                        CompanyNewName,
                        RegisterMOA,
                        ResigReason,
                        NoticeDate,
                        icsp_id: this.userData.icsp_id,
                        isMOU,
                        isAOA,
                        isRestatedMOU,
                        isRestatedAOA,
                    };
                    if(Company_id == null || Company_id == 0) {
                        this.customErrors.noCompanyIdFound = true;
                    }
                    else{
                        changeTicket(data).then(this.saveTicketHandlerSuccess)
                    }
                }
                else if(this.ticket.process_id == 304){
                    const data = {
                        process_id,
                        reference_id,
                        Company_id,
                        ResolutionDate,
                        address_id,
                        ApprovedName_id,
                        CompanyNewName,
                        RegisterMOA,
                        ResigReason,
                        NoticeDate,
                        icsp_id: this.userData.icsp_id,
                        isMOU,
                        isAOA,
                        isRestatedMOU,
                        isRestatedAOA,
                    };
                    if(Company_id == null || Company_id == 0) {
                        this.customErrors.noCompanyIdFound = true;
                    }
                    else{
                        changeTicket(data).then(this.saveTicketHandlerSuccess)
                    }
                }
                else if (this.ticket.process_id == 309) {
                    const data = {
                        process_id,
                        reference_id,
                        Company_id,
                        ResolutionDate,
                        address_id,
                        CompanyNewName,
                        NoticeDate,
                        icsp_id: this.userData.icsp_id,
                        isMOU,
                        isAOA,
                        isRestatedMOU,
                        isRestatedAOA,
                        currency,
                        shareCapital
                    };
                    if(Company_id == null || Company_id == 0) {
                        this.customErrors.noCompanyIdFound = true;
                    }
                    else{
                        changeTicket(data).then(this.saveTicketHandlerSuccess)
                    }
                }
                else if(this.ticket.process_id == 310){
                    const data = {
                        process_id,
                        reference_id,
                        Company_id,
                        ResolutionDate,
                        address_id,
                        CompanyNewName,
                        NoticeDate,
                        icsp_id: this.userData.icsp_id,
                        isMOU,
                        isAOA,
                        isRestatedMOU,
                        isRestatedAOA,
                        comment
                    };
                    if(Company_id == null || Company_id == 0) {
                        this.customErrors.noCompanyIdFound = true;
                    }
                    else{
                        changeTicket(data).then(this.saveTicketHandlerSuccess)
                    }
                }
                else if( this.ticket.process_id == 602 ){
                    
                    const data = {
                        process_id,
                        reference_id,
                        Company_id,
                        ResolutionDate,
                        address_id,
                        CompanyNewName,
                        NoticeDate,
                        icsp_id: this.userData.icsp_id,
                        mergeJson: JSON.stringify(mergeJson),
                        effectiveDate
                    };
                    const checkMergeJsonLength = mergeJson.filter( item => {
                        return item.id !== null
                    })
                    if(checkMergeJsonLength.length > 1){
                        changeTicket(data).then(this.saveTicketHandlerSuccess)
                    }
                    else{
                        this.customErrors.mergeNotEnoughCompany = true;
                    }
                }else if( this.ticket.process_id == 603 ){
                    
                    const data = {
                        process_id,
                        reference_id,
                        Company_id,
                        ResolutionDate,
                        address_id,
                        CompanyNewName,
                        NoticeDate,
                        icsp_id: this.userData.icsp_id,
                        mergeJson: JSON.stringify(mergeJson),
                        effectiveDate,
                        ApprovedName_id
                    };

                    changeTicket(data).then(this.saveTicketHandlerSuccess)
                }
                else if ( this.ticket.process_id == 300 || this.ticket.process_id == 311 ){
                    const data = {
                        process_id,
                        reference_id,
                        // Company_id,
                        typeCompanyReg,
                        typeCompanyName,
                        IncomingICSP_id,
                        OutgoingICSP_id,
                        ResolutionDate,
                        address_id,
                        ApprovedName_id,
                        CompanyNewName,
                        RegisterMOA,
                        ResigReason,
                        NoticeDate,
                        icsp_id: this.userData.icsp_id,
                    };

                    changeTicket(data).then(this.saveTicketHandlerSuccess)
                }
                else if( this.ticket.process_id == 302 ){
                    const data = {
                        process_id,
                        reference_id,
                        Company_id,
                        IncomingICSP_id,
                        OutgoingICSP_id,
                        ResolutionDate,
                        address_id,
                        ApprovedName_id,
                        CompanyNewName,
                        RegisterMOA,
                        ResigReason,
                        NoticeDate,
                        icsp_id: this.userData.icsp_id,
                    };
                    changeTicket(data).then(this.saveTicketHandlerSuccess);
                }
                else{
                    const data = {
                        process_id,
                        reference_id,
                        Company_id,
                        IncomingICSP_id,
                        OutgoingICSP_id,
                        ResolutionDate,
                        address_id,
                        ApprovedName_id,
                        CompanyNewName,
                        RegisterMOA,
                        ResigReason,
                        NoticeDate,
                        icsp_id: this.userData.icsp_id,
                    };
                    if(Company_id == null || Company_id == 0) {
                        this.customErrors.noCompanyIdFound = true;
                    }
                    else{
                        changeTicket(data).then(this.saveTicketHandlerSuccess)
                    }
                }
                
            },
            saveTicketHandlerSuccess(response) {
                if (this.activeStep.id === 1) {
                    this.isSaved = true;
                    this.nextStep();
                    this.ticket.reference_id = response.data[0].reference_id;
                    if(this.mode === 'add'){
                        sessionStorage.setItem(PROCESS_ID, this.ticket.process_id);
                        sessionStorage.setItem(REFERENCE_ID, this.ticket.reference_id);
                        this.$store.dispatch('setProcessId',this.ticket.process_id)
                        this.$router.replace({name:'changes_add',params:{addRef:this.ticket.reference_id}});
                        this.activateSteps(2);

                    }
                    // else{

                    // }
                    // this.$route.params.addRef = this.ticket.reference_id;
                    // this.activateAllStep();
                    this.getDeclaration();
                } else {
                    this.isSubmitted = true;
                    this.addDeclarationHandler()
                }
                this.ticketValue = {
                    Referrence: this.ticket.TicketReference === null || this.ticket.TicketReference === 0 ? '' : this.ticket.TicketReference,
                    EntityType: this.selectedCompany !== null && this.selectedCompany.EntityType && this.selectedCompany.EntityType !== null ? this.selectedCompany.EntityType : '',
                    CompanyName: this.selectedCompany !== null ? this.selectedCompany.Name : ''
                }
            },

            nextStep() {
                // this.activateSteps(this.activeStep.id + 1); 
                this.setActiveStep(this.activeStep.id + 1)
            },
            prevStep() {
                this.activateSteps(this.activeStep.id - 1); 
                this.setActiveStep(this.activeStep.id - 1)
            },
            backToList() {
                this.modals.success.isVisible = false;
                this.$router.push({ path: '/changes' })
            },
            resetActivatedSteps(){   
                this.steps.forEach(item => {
                    if(item.id !== 1){
                        item.isDisabled = true;
                    }
                    if(item.id == 1){
                        this.activateSteps(1); 
                        this.setActiveStep(1)
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
    .error {
        color: #ff3547;
        font-size: 11px;
        line-height: 13px;
        font-weight: 400;
        margin-bottom: 20px;
    }
</style>
