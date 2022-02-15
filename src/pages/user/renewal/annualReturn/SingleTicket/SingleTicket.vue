<template>
    <FormWrapper>
        <PageTitle title="Annual Return" v-if="processId ===  null || processId === 0" slot="title" link="/help/300"/>
        <PageTitle :title="`Annual Return ${processTitleName}`" v-else slot="title" :link="`/help/${processId}/${activeStep.id}`"/>
        <TicketHeader v-if="ticketValue" :ticketValue="ticketValue" />

        <Wizard :steps="steps" @changeStep="setActiveStep" v-if="isTicket"/>
        <ValidationObserver ref="validator">
            <component :is="activeStep.component"
                       v-if="ticket && activeStep && isTicket"
                       :readonly="!isEditable"
                       ref="component"
                       v-model="ticket"
                       :mode="mode"
                       :feeOnly="feeOnly"
                       :reference_id="ticket.reference_id"
                       :customErrors="customErrors"
                       :isSubmitted="isSubmitted"
                       @onPaymentSuccess="onPaymentSuccessHandler"
                       @onPayLater="onPayLaterHandler"
                       @307Action="changeAction"
                       @changeProcessName="changeTitleName"
                       :steps="steps" />
            <FormRow v-if="showSubmitButtonAndDeclaration ">
                <div class="col-sm-12">
                    <Declaration v-model="declaration" :readonly="!isEditable" />
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
                        
                        <FormButton v-if="showNextButton" left-icon="ios-arrow-forward"  @click="validateTicket">Next</FormButton>
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
    import { getTicket, annualReturnRequest, annualReturnProcessSelection, generateInvoice, generateProcessTicket, annualReturnExtensionRequest, getAnnualReturnDueDate } from '../api';
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
        mixins: [formStepsMixin,checkPaymentMixin, validateDocumentMixin],
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
                    company_id: null,
                    
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
                message: '',
                customErrors: [],
                isSubmitted: false,
                isSaved: false,
                particularAction: false,
                processTitleName: '',
                isEditable: true,
            }
        },
        created() {
            this.setStepsHandler();
                this.isTicket = false
                this.checkStorageAndGetData();
        },
        computed: {
            showNextButton() {
                return this.activeStep && (this.activeStep.id === 1 ) && this.steps.length > 1 ;
                // || (this.activeStep.id === 2 && this.isEditable === false) 
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
            changeTitleName(val){
                this.processTitleName = val !== "" ? "- " + val : '';
            },
            changeAction(data){
                this.particularAction = data;
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
                if(this.ticket.DueDate === null){
                    getAnnualReturnDueDate({company_id: this.ticket.company_id}).then(
                        res => {
                            this.ticket.DueDate = res.data[0].DueDate;
                        }
                    )
                }
                if(this.ticket.process_id === 115 || this.ticket.process_id === 116){
                    this.ticketValue = {
                        Referrence: this.ticket.Year,
                        EntityType: this.ticket.EntityType,
                        CompanyName: this.userData.icsp_name,
                    }
                }
                if(this.ticket.process_id === 346 || this.ticket.process_id === 347){
                    this.ticketValue = {
                        Referrence: this.ticket.Year,
                        EntityType: this.ticket.EntityType,
                    }
                }
                if(this.ticket.invoice_id !== null || (this.ticket.TicketReference)){
                    
                    this.feeOnly = this.ticket.Status_id === 500 ? true : false;
                    this.isEditable = false;
                    this.isSubmitted = true;
                    this.declaration.DeclarationDate = this.ticket.DeclarationDate;
                    this.declaration.Name = this.ticket.Name;
                    this.declaration.Place = this.ticket.Place;
                    this.declaration.DeclarationMessage = this.ticket.DeclarationMessage;
                    this.$store.commit('setGeneratedInvoice',this.ticket.invoice_id);
                    this.activateSteps();
                }
                if(this.ticket.Status_id === 34){
                    this.isEditable = false;
                    this.activateSteps();
                }
                
                this.getDeclaration();
                this.setStepsHandler();
            },
            setStepsHandler() {
                if(this.processId !== 0 && this.processId !== null && (this.processId === 109 || this.processId === 300 || this.processId === 301  || this.processId === 302 || this.processId === 303 || this.processId === 304 || this.processId === 305 || this.processId === 307 || this.processId === 311)){
                    this.setSteps(steps[this.processId]);
                    this.setActiveStep(1);
                    if(this.mode === 'edit'){
                        this.activateSteps();
                        if(this.ticket.invoice_id === null ){
                            if(this.steps.length === 3){
                                this.steps.forEach( step => {
                                    if(step.id === 3){
                                        step.isDisabled = true;
                                    }
                                })
                            }
                        }
                    }
                }else{
                    this.setSteps(steps[115]);
                    this.setActiveStep(1);
                }
            },
            activateSteps() {
                this.steps.forEach(item => item.isDisabled = false)
                
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
            addDeclarationSuccess(response) {
                const { process_id, reference_id } = this.ticket;
                const data = {
                    process_id,
                    reference_id
                }
                const total = response.data[1][0].Total;
                if(total === 0 || total === '0' || total === ".00"){
                    generateProcessTicket(data).then(
                        res => {
                            this.ticket.TicketReference = res.data[0].TicketReference;
                            this.ticket.Status_id = res.data[0].Status_id;
                            this.modals.success.step = 3;
                            this.modals.success.isVisible = true;
                        }
                    )
                }
                else{
                    generateInvoice(data).then(
                        (res) => {
                            this.$store.commit('setGeneratedInvoice',res.data[0].invoice_id),
                            this.feeOnly = true;
                            this.isEditable = false;
                            this.activateSteps();
                            this.setActiveStep(3)
                        }
                    )
                }
            },

            validateTicket() {
                if (this.activeStep.id === 1) {
                    if (this.mode !== 'edit') {
                        this.$refs.validator.validate().then((result) => {
                            if (result) {
                                this.saveHandler();
                            }
                        })
                    } else {
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
                if(this.ticket.process_id === 115 || this.ticket.process_id === 346){

                    const {
                        process_id,
                        reference_id,
                        company_id,
                        EntityType,
                        Year,
                        RevenueSCR,
                        RevenueUSD,
                        CurrentAsset,
                        CurrentLiability,
                        LiquidAsset,
                        TotalAsset,
                        TotalLiability,
                        TotalEquity,
                        ProfitLossUSD,
                        ProfitLossSCR,
                        AuditorName,
                        AuditorRegNo,
                        AuditorAddress
                    } = this.ticket;
                    const data = {
                        process_id,
                        reference_id,
                        company_id,
                        EntityType,
                        year: Year,
                        RevenueSCR,
                        RevenueUSD,
                        CurrentAsset,
                        CurrentLiability,
                        LiquidAsset,
                        TotalAsset,
                        TotalLiability,
                        TotalEquity,
                        ProfitLossUSD,
                        ProfitLossSCR,
                        AuditorName,
                        AuditorRegNo,
                        AuditorAddress,
                        icsp_id: this.userData.icsp_id
                    };

                    annualReturnRequest(data).then(this.saveTicketHandlerSuccess)
                }
                else if(this.ticket.process_id === 116 || this.ticket.process_id === 347){
                                        const {
                        process_id,
                        reference_id,
                        company_id,
                        EntityType,
                        Year,
                        RequestedDueDate,
                        ReasonForExtension
                    } = this.ticket;
                    const data = {
                        process_id,
                        reference_id,
                        company_id,
                        EntityType,
                        year: Year,
                        RequestedDueDate,
                        ReasonForExtension,
                        icsp_id: this.userData.icsp_id
                    };
                    annualReturnExtensionRequest(data).then(this.saveTicketHandlerSuccess);
                }
            },
            saveTicketHandlerSuccess(response) {
                if (this.activeStep.id === 1) {
                    this.isSaved = true;
                    this.nextStep();
                    this.ticket.reference_id = response.data[0].reference_id;
                    sessionStorage.setItem(PROCESS_ID, this.ticket.process_id);
                    sessionStorage.setItem(REFERENCE_ID, this.ticket.reference_id);
                    this.$store.dispatch('setProcessId',this.ticket.process_id)

                    // this.$route.params.addRef = this.ticket.reference_id;
                    this.activateSteps();
                    this.getDeclaration();
                } else {
                    this.isSubmitted = true;
                    this.addDeclarationHandler()
                }
                // this.ticketValue = {
                //     Referrence: this.ticket.TicketReference,
                //     // EntityType: this.selectedCompany.EntityType,
                //     // CompanyName: this.selectedCompany.Name
                // }
            },

            nextStep() {
                this.setActiveStep(this.activeStep.id + 1)
            },
            prevStep() {
                this.setActiveStep(this.activeStep.id - 1)
            },
            backToList() {
                this.modals.success.isVisible = false;
                this.$router.push({ path: '/annualReturn' })
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
