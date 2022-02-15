<template>
    <FormWrapper>
        <PageTitle title="New Charge Registration" slot="title" v-if="$route.name === 'NewChargeRequest'" :link="`/help/${processId}`"/>
        <PageTitle title="Amendment Of Charge" slot="title" v-if="$route.name === 'AmendmentOfChargeRequest'" :link="`/help/${processId}`"/>
        <PageTitle title="Release Of Charge" slot="title" v-if="$route.name === 'ReleaseOfChargeRequest' " :link="`/help/${processId}`"/>
        
        <TicketHeader v-if="ticketValue" :ticketValue="ticketValue" />

        <Wizard :steps="steps" @changeStep="setActiveStep" />
        <ValidationObserver ref="validator">
            <component :is="activeStep.component"
                       v-if="activeStep && ticket"
                       ref="component"
                       v-model="ticket"
                       :reference_id="ticket.reference_id"
                       :customErrors="customErrors"
                       :isSubmitted="isSubmitted"
                       @onPaymentSuccess="onPaymentSuccessHandler"
                       @onPayLater="onPayLaterHandler"
                       :steps="steps" />
            <FormRow v-if="showSubmitButtonAndDeclaration ">
                <div class="col-sm-12">
                    <Declaration v-model="declaration"  />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <ButtonGroup>
                        <FormButton v-if="showPrevButton" type="primary" @click="prevStep" left-icon="ios-arrow-back">Previous</FormButton>
                        <!-- <FormButton @click="validateTicket" v-if="activeStep.id === 1">Submit</FormButton> -->
                        <FormButton
                                left-icon="md-checkmark-circle-outline"
                                v-if="showSubmitButtonAndDeclaration && ticket.invoice_id === null"
                                type="success"
                                @click="validateTicket">
                            Submit
                        </FormButton>
                        <FormButton v-if="showNextButton" left-icon="ios-arrow-forward" @click="nextStep">Next</FormButton>
                        
                        <!-- <FormButton type="primary" @click="backToList" left-icon="ios-arrow-back">Back</FormButton> -->
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
    import PageTitle from 'Components/layout/PageTitle'; 
    import formStepsMixin from 'Mixins/formStepsMixin';
    import Wizard from 'Components/wizard/Wizard';
    import { ValidationObserver } from "vee-validate";
    import steps from './steps';
    import { NEW_CHARGE_REGISTRATION, AMENDMENT_OF_CHARGE, RELEASE_OF_CHARGE } from 'Config/processIds';
    import { PROCESS_ID, REFERENCE_ID } from 'Config/localStorageKeys';
    import TicketHeader from 'Components/layout/TicketHeader';
    import checkPaymentMixin from 'Mixins/checkPaymentMixin';
    import Declaration, { fetchDeclaration, addDeclaration } from 'Components/Declaration';
    import { ChargeRequest, generateProcessTicket, generateInvoice, getTicket, chargeReferenceSearch } from './api'
    import DateUtil from 'Utils/dateUtil';
    import validateDocumentMixin from 'Mixins/validateDocumentMixin'

    export default {
        name:"ChargeForm",
        mixins: [formStepsMixin,checkPaymentMixin, validateDocumentMixin],
        components: {
            FormWrapper,
            PageTitle,
            Wizard,
            ValidationObserver,
            TicketHeader,
            Declaration
        },
        computed:{
            processId() {
                return this.$store.state.common.currentProcessId;
            },
            userData() {
                return this.$store.state.user.user;
            },
            showNextButton() {
                return this.activeStep && (this.activeStep.id === 1 || (this.ticket && this.ticket.invoice_id !== null && this.activeStep.id === 2)) && this.steps.length > 1 ;
            },
            showSubmitButtonAndDeclaration() {
                return this.activeStep.id === 2
            },
            showPrevButton() {
                return (this.activeStep && this.activeStep.id === 2)
            },
        },
        data(){
            return{
                ticketValue: null,
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
                declaration: {
                    DeclarationDate: DateUtil.formatDate(Date.now()),
                    Name: '',
                    Place: '',
                    isChecked: false,
                    DisplayText: '',
                },
                ticket: {
                    TicketReference: '',
                    chargeType_id: null,
                    charge_title: '',
                    charge_date: '',
                    charge_time: '',
                    liability_secured: '',
                    chargee_name: '',
                    chargee_address: '',
                    instrument_name: '',
                    instrument_date: '',
                    property_charged: '',
                    prohibition: '',
                    discharge_date: '',
                },
                customErrors: [],
                isSubmitted: false,
            }

        },
        created(){
            this.setProcessId().then(this.getTicketHandler);
            this.setStepsHandler();
        },
        watch:{
            ticket(val){
                this.ticket = val;
                return val;
            },
        },
        methods:{
            async setProcessId(){
                if(this.$route.name === 'NewChargeRequest'){
                    this.$store.commit('setProcessId', NEW_CHARGE_REGISTRATION);
                }else if(this.$route.name=== 'AmendmentOfChargeRequest'){
                    this.$store.commit('setProcessId', AMENDMENT_OF_CHARGE);
                }else if(this.$route.name=== 'ReleaseOfChargeRequest'){
                    this.$store.commit('setProcessId', RELEASE_OF_CHARGE);
                }

            },
            setStepsHandler() {
                this.setSteps(steps);
                this.setActiveStep(1);
            },
            getTicketHandler() {
                const data = { process_id: this.processId, reference_id: parseInt(this.$route.params.id) };
                getTicket(data).then(this.getTicketHandlerSuccess)
            },
            getTicketHandlerSuccess(response) {
                this.ticket = response.data[0];
                if(this.ticket.ChargeDate == null && this.ticket.ChargeTime == '00:00:00.0000' ){
                    var d = new Date();
                    this.ticket.ChargeTime = `${d.getHours()}:${d.getMinutes()}`;
                }
                this.ticket.chargetype_id = this.ticket.chargetype_id && this.ticket.chargetype_id !== 0 ? this.ticket.chargetype_id : null;
                if(this.$route.name !== 'NewChargeRequest'){
                    this.checkReference(this.ticket.ChargeReferenceNumber)
                }
                this.ticketValue = {
                    Referrence: this.ticket.TicketReference,
                    EntityType: this.ticket.EntityType,
                    CompanyName: this.ticket.companyname
                }
                if(this.ticket.Invoice_id !== null){
                    this.isSubmitted = true;
                    this.declaration.isChecked = true;
                    this.declaration.DeclarationDate = this.ticket.DeclarationDate;
                    this.declaration.Name = this.ticket.Name;
                    this.declaration.Place = this.ticket.Place;
                    this.declaration.DeclarationMessage = this.ticket.DeclarationMessage;
                    this.$store.commit('setGeneratedInvoice',this.ticket.Invoice_id);
                    this.activateAllStep();
                }
                if(this.ticket.TicketReference){
                    this.activateAllStep();
                }
                
                this.$store.commit('setCompany',{id: this.ticket.company_id});
                this.getDeclaration();
                this.setStepsHandler();
            },
            checkReference(ChargeReferenceNumber){
                chargeReferenceSearch({process_id: this.processId, company_id: this.ticket.company_id, ChargeReferenceNumber: ChargeReferenceNumber}).then(
                    res => {
                        const { ChargeType_id, ChargeTitle, ChargeDate, ChargeTime, LiabilitySecured, ChargeeName, ChargeeAddress, InstrumentName, InstrumentDate, PropertyCharged, Prohibition, } = res.data[0];
                        this.ticket.chargetype_id = ChargeType_id;
                        this.ticket.ChargeTitle = ChargeTitle;
                        this.ticket.ChargeDate = ChargeDate;
                        this.ticket.ChargeTime = ChargeTime;
                        this.ticket.LiabilitySecured = LiabilitySecured;
                        this.ticket.ChargeeName = ChargeeName;
                        this.ticket.ChargeeAddress = ChargeeAddress;
                        this.ticket.InstrumentName = InstrumentName;
                        this.ticket.InstrumentDate = InstrumentDate;
                        this.ticket.PropertyCharged = PropertyCharged;
                        this.ticket.Prohibition = Prohibition;

                    }
                )
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
            getDeclaration() {
                const data = {
                    process_id: this.processId,
                    EntityType: 'IBC',
                    reference_id: parseInt(this.$route.params.id),
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
                generateProcessTicket(data).then(
                    res => {
                        this.ticket.TicketReference = res.data[0].TicketReference;
                        this.modals.success.step = 1;
                        this.modals.success.isVisible = true;
                    }
                )
                // generateInvoice(data).then(
                //     (res) => {
                //         this.$store.commit('setGeneratedInvoice',res.data[0].invoice_id),
                //         this.activateSteps(3)
                //         this.setActiveStep(3)
                //     }
                // )
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
            validateTicket(next) {
                if (this.activeStep.id === 1) {
                    this.$refs.validator.validate().then((result) => {
                        if (result) {
                            this.setData().then(res => {
                                ChargeRequest(res).then(
                                    res => {
                                        this.activateSteps(next)
                                        this.setActiveStep(next)
                                    }
                                )
                            })
                        }
                    })
                } else {
                    this.$refs.validator.validate().then((result) => {
                        if (result && this.validateDocuments()) {
                            this.saveHandler();
                        }
                    });
                }
            },

            saveHandler() {
                var self = this;
                self.setData().then(
                    res =>{

                        ChargeRequest(res).then(self.saveTicketHandlerSuccess)
                    })
            },
            saveTicketHandlerSuccess(response) {
                    this.isSubmitted = true;
                    this.ticketValue = {
                        Referrence: this.ticket.TicketReference,
                        EntityType: this.ticket.EntityType,
                        CompanyName: this.ticket.companyname
                    }
                    this.addDeclarationHandler()
            },

            async setData(){
                var company = { id : this.ticket.company_id}
                this.$store.commit('setCompany',{id: this.ticket.company_id});
                if(this.$route.name === 'NewChargeRequest' || this.$route.name === 'AmendmentOfChargeRequest'){
                    var company = { id : this.ticket.company_id}
                    const data = {
                        webuser_id: this.userData.user_id,
                        icsp_id: this.userData.icsp_id,
                        process_id: this.processId,
                        ChargeReferenceNumber: this.$route.params.chargeRef ? this.$route.params.chargeRef : this.ChargeReferenceNumber,
                        reference_id: parseInt(this.$route.params.id),
                        company_id: this.ticket.company_id,
                        chargetype_id: this.ticket.chargetype_id,
                        charge_title: this.ticket.ChargeTitle,
                        charge_date: this.ticket.ChargeDate,
                        charge_time: this.ticket.ChargeTime,
                        liability_secured: this.ticket.LiabilitySecured,
                        chargee_name: this.ticket.ChargeeName,
                        chargee_address: this.ticket.ChargeeAddress,
                        instrument_name: this.ticket.InstrumentName,
                        instrument_date: this.ticket.InstrumentDate,
                        property_charged: this.ticket.PropertyCharged,
                        prohibition: this.ticket.Prohibition,
                    }
                    return data;
                }
                else{
                    const data = {
                        webuser_id: this.userData.id,
                        icsp_id: this.userData.icsp_id,
                        company_id: this.ticket.company_id,
                        process_id: this.processId,
                        reference_id: this.ticket.reference_id,
                        ChargeReferenceNumber: this.$route.params.chargeRef ? this.$route.params.chargeRef : this.ChargeReferenceNumber,
                        discharge_date: this.ticket.DischargeDate,
                    }
                return data;
                }
            },

            // nextStep(){
            //     this.setActiveStep(1)
            // },
            nextStep() {
                this.validateTicket(this.activeStep.id + 1)
            },
            prevStep() {
                this.setActiveStep(this.activeStep.id - 1)
            },
            backToList() {
                this.modals.success.isVisible = false;
                this.$router.go(-1)
            },
        },
        beforeDestroy(){
            this.resetActivatedSteps();
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