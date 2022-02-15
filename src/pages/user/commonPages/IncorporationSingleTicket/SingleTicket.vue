<template>
    <FormWrapper>
        <PageTitle :title="pageTitle" slot="title" :link="`/help/${processId}`"/>
        <TicketHeader v-if="ticketValue" :ticketValue="ticketValue" />
        <Wizard :steps="steps" @changeStep="setActiveStep"/>
        <ValidationObserver ref="validator">
            <component :is="activeStep.component"
                       v-if="ticket && activeStep"
                       :readonly="!isEditable"
                       :feeOnly="feeOnly"
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
                        <FormButton v-if="showNextButton || (!isEditable && activeStep && activeStep.id == 2)" left-icon="ios-arrow-forward" @click="nextStep">Next</FormButton>
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
        
        <Popup title="Information" :value="warningModal.visible" @close="() => showWarningModal(false)">
            {{ warningModal.message }}
            <div slot="footer">
                <FormButton v-if="warningModal.buttons.cancel" @click="() => showWarningModal(false)">Cancel
                </FormButton>
                <FormButton v-if="warningModal.buttons.confirm" type="success" @click="confirmDelete">Confirm
                </FormButton>
                <FormButton v-if="warningModal.buttons.ok" @click="() => showWarningModal(false)">Ok</FormButton>
            </div>
        </Popup>

    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import formStepsMixin from 'Mixins/formStepsMixin';
    import Wizard from 'Components/wizard/Wizard';
    import { incorporateTicket, generateInvoice, incorporatepeople, getPcWeb } from './api';
    import { getTicket } from 'Pages/master/masterActions';
    import entityTypesSchema from './entityTypesSchema'
    import { PROCESS_ID } from 'Config/localStorageKeys';
    import PageTitle from 'Components/layout/PageTitle';
    import TicketHeader from 'Components/layout/TicketHeader';
    import Declaration, { fetchDeclaration, addDeclaration } from 'Components/Declaration';
    import DateUtil from 'Utils/dateUtil';
    import { ValidationObserver } from "vee-validate";
    import checkPaymentMixin from 'Mixins/checkPaymentMixin';
    import validateDocumentMixin from 'Mixins/validateDocumentMixin';
    import validateSelectedRows from 'Mixins/validateSelectedRows';

    export default {
        name: "SingleTicket",
        mixins: [formStepsMixin,checkPaymentMixin, validateDocumentMixin,validateSelectedRows],
        components: {
            FormWrapper,
            PageTitle,
            Wizard,
            ValidationObserver,
            Declaration,
            TicketHeader
        },
        data() {
            return {
                feeOnly: false,
                ticketValue: null,
                ticket: null,
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
                pcWeb: {},
            }
        },
        computed: {
            isEditable:{
                get(){
                    return this.activeStep && this.ticket && this.activeStep.editable.indexOf(this.ticket.ApprovedNameStatus_id) !== -1 && ((this.pcWeb.isRestricted == 1 && this.userData.isRestricted == 0) || (this.pcWeb.isRestricted == 0 && this.userData.isRestricted == 0) || (this.pcWeb.isRestricted == 0 && this.userData.isRestricted == 1));
                },
                set(newValue){
                    return newValue;
                }
            },
            showNextButton() {
                return this.activeStep && this.activeStep.id === 1 && this.steps.length > 1 ;
            },
            showSubmitButtonAndDeclaration() {
                return this.isOnlyOneStep ||
                    (this.activeStep && this.activeStep.id === 2)
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
            pageTitle() {
                if (!this.ticket) {
                    return '';
                }
                if(this.processId === 101){
                    return 'Name Reservation';
                }
                const { EntityType } = this.ticket;
                return entityTypesSchema[EntityType].title[this.processId]
            },
        },
        created() {
            const processIdFromStorage = localStorage.getItem(PROCESS_ID);
            if (!this.processId && processIdFromStorage) {
                this.$store.dispatch('setProcessId', processIdFromStorage)
            }
            this.processId && this.getTicketHandler();
            this.processId && this.getPCWebData();
        },
        methods: {
            getPCWebData() {
                getPcWeb({process_id: this.processId}).then( res=> {
                    this.pcWeb = res.data[0];
                    if(this.pcWeb.isRestricted == 1 && this.userData.isRestricted == 1){
                        this.isEditable = false;
                        this.warningModal.message = `You're restricted to do this action`;
                        this.warningModal.visible = true; 
                    }
                })
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
            onPaymentSuccessHandler(data) {
                this.ticket.TicketReference = data.ticketReference;
                this.ticket.ApprovedNameStatus_id = data.ApprovedNameStatus_id;
                this.modals.success.step = data.step;
                this.modals.success.isVisible = true;
            },
            onPayLaterHandler(message) {
                this.modals.success.isVisible = true;
                this.modals.success.step = 4;
                this.modals.success.message = message;
            },
            setStepsHandler() {
                const { EntityType, ApprovedNameStatus_id } = this.ticket;
                const stepsConfig = entityTypesSchema[EntityType].steps[ApprovedNameStatus_id] || entityTypesSchema[EntityType].steps['default'];
                this.setSteps(stepsConfig);
                this.setActiveStep(1);
                this.activateSteps(1);
                if(!this.isEditable){
                    this.activateAllStep();
                }
            },
            getTicketHandler() {
                const data = {
                    process_id: this.processId,
                    reference_id: +this.$route.params.id,
                };
                getTicket(data).then(this.getTicketHandlerSuccess)
            },
            getDeclaration() {
                const data = {
                    process_id: this.processId,
                    EntityType: this.ticket.EntityType,
                    reference_id: this.ticket.reference_id,
                };
                fetchDeclaration(data).then(res => {
                    this.declaration.DisplayText = res.data[0].DisplayText;
                })
            },
            getTicketHandlerSuccess(response) {
                this.ticket = response.data[0];
                this.ticketValue = {
                    Referrence: this.ticket.TicketReference,
                    EntityType: this.ticket.EntityType,
                    CompanyName: this.ticket.CompanyName
                }
                if(this.ticket.shareNoPar){
                    this.ticket.ShareNoPar = this.ticket.shareNoPar;
                    console.log(this.ticket.ShareNoPar)
                }
                if(this.ticket.invoice_id !== null || this.ticket.TicketReference !== null){
                    this.ticket.jurisdiction_id = this.ticket.Jurisdiction_id;
                    this.feeOnly = this.ticket.ApprovedNameStatus_id === 500 ? true : false;
                    this.isEditable = false;
                    this.isSubmitted = true;
                   
                    this.$store.commit('setGeneratedInvoice',this.ticket.invoice_id);
                    
                }
                
                this.getDeclaration();
                this.setStepsHandler();
                if(this.ticket.invoice_id !== null){
                    this.declaration.isChecked = true;
                    this.declaration.DeclarationDate = this.ticket.DeclarationDate;
                    this.declaration.Name = this.ticket.Name;
                    this.declaration.Place = this.ticket.Place;
                    this.declaration.DeclarationMessage = this.ticket.DeclarationMessage;

                    if( this.ticket.CompanyPeople !== null && this.ticket.CompanyPeople !== ''){
                        this.ticket.recordJSON = JSON.parse(this.ticket.CompanyPeople);
                    }
                }else{
                    if(this.steps && this.steps.length === 3){
                        this.steps.forEach( step => {
                            if(step.id === 3){
                                step.isDisabled = true;
                            }
                        })
                    }
                }
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
                if (this.steps.length === 1) {
                    this.modals.success.isVisible = true;
                } else {
                    const { process_id, reference_id } = this.ticket;
                    const data = {
                        process_id,
                        reference_id
                    }
                    generateInvoice(data).then(
                        (res) => {
                            this.$store.commit('setGeneratedInvoice',res.data[0].invoice_id);
                            this.feeOnly = true;
                            this.isEditable = false;
                            this.activateSteps(3);
                            this.setActiveStep(3);

                        }
                    )
                }
            },

            validateTicket(step) {
                this.$refs.validator.validate().then((result) => {
                    if (result && this.validateDocuments() && this.validateLimitedBy()) {
                        if(step && step !== 2){
                            if(this.isEditable){
                                this.saveHandler();
                            }
                        }
                        if(step){
                            if(this.isEditable){
                                this.activateSteps(step);
                            }
                            this.setActiveStep(step);
                        }
                    }
                })
            },

            validateLimitedBy() {
                const { EntityType, LimitedByShares, LimitedByGuarantee } = this.ticket;
                this.customErrors = [];
                if (entityTypesSchema[EntityType].limitedByRequired && !LimitedByGuarantee && !LimitedByShares) {
                    this.customErrors.push('limitedBy');
                    return false;
                }
                return true; 
            },

            saveHandler() {
                for (let key in this.ticket) {
                    if (this.ticket.hasOwnProperty(key) && !this.ticket[key]) {
                        this.ticket[key] = 0;
                    }
                }

                const {
                    reference_id,
                    LimitedByShares,
                    currency,
                    LimitedByGuarantee,
                    AuthorizedShareCapital,
                    GuaranteeAmount,
                    regaddress_id,
                    OriginalName,
                    OriginalIncorporationDate,
                    jurisdiction_id,
                    ShareNoPar
                } = this.ticket;

                const data = {
                    icsp_id: this.userData.icsp_id,
                    process_id: +this.processId,
                    mode: 2,
                    reference_id,
                    LimitedByShares,
                    currency,
                    LimitedByGuarantee,
                    AuthorizedShareCapital,
                    GuaranteeAmount,
                    regaddress_id,
                    ShareNoPar
                };

                if(this.ticket.EntityType === 'LP'){
                    const {
                        NatureOfBusiness,recordJSON
                    } = this.ticket;
                    data.NatureOfBusiness = NatureOfBusiness;
                    data.recordJSON = recordJSON;
                }

                if (OriginalName && OriginalIncorporationDate && jurisdiction_id) {
                    data.OriginalName = OriginalName;
                    data.OriginalIncorporationDate = OriginalIncorporationDate;
                    data.Jurisdiction_id = jurisdiction_id;
                }

                incorporateTicket(data).then(this.incorporateTicketSuccess)
            },
            nextStep() {
                this.validateTicket(this.activeStep.id + 1)
            },
            prevStep() {
                this.activateSteps(this.activeStep.id - 1);
                this.setActiveStep(this.activeStep.id - 1);
            },
            incorporateTicketSuccess(response) {
                this.isSubmitted = true;
                this.ticket.TicketReference = response.data[1][0].TicketReference;
                this.ticket.ApprovedNameStatus_id = response.data[1][0].ApprovedNameStatus_id
                this.addDeclarationHandler()
            },
            backToList() {
                this.modals.success.isVisible = false;
                // this.$router.push({ path: '/incorporation' })
                this.$router.go(-1);
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
