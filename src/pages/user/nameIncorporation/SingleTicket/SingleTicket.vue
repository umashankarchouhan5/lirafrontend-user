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
                        <FormButton v-if="showNextButton || (!isEditable && activeStep && activeStep.id == 1)" left-icon="ios-arrow-forward" @click="nextStep">Next</FormButton>
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
    import { nameResInc, generateInvoice, incorporatepeople, generateProcessTicket, createNewForm } from './api';
    import { getTicket } from 'Pages/master/masterActions';
    import { PROCESS_ID } from 'Config/localStorageKeys';
    import { NAME_INCORPORATION } from 'Config/processIds';
    import PageTitle from 'Components/layout/PageTitle';
    import TicketHeader from 'Components/layout/TicketHeader';
    import Declaration, { fetchDeclaration, addDeclaration } from 'Components/Declaration';
    import PCWebMixin from 'Mixins/pcWebMixin';
    import DateUtil from 'Utils/dateUtil';
    import { ValidationObserver } from "vee-validate";
    import checkPaymentMixin from 'Mixins/checkPaymentMixin';
    import steps from './steps';

    export default {
        name: "SingleTicket",
        mixins: [formStepsMixin,checkPaymentMixin,PCWebMixin],
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
                ticket: {
                    ProposedName: null,
                    EntityType: 'IBC',
                    attachmentFile: null,
                    TranslationFile: null,
                    ForeignName: ''
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
                proposedName: null,
                retainData: {},
            }
        },
        computed: {
            isEditable:{
                get(val){
                    return this.activeStep && this.ticket && (this.ticket.TicketReference === undefined || this.ticket.TicketReference === null)&& ((this.pcWeb.isRestricted == 1 && this.userData.isRestricted == 0) || (this.pcWeb.isRestricted == 0 && this.userData.isRestricted == 0) || (this.pcWeb.isRestricted == 0 && this.userData.isRestricted == 1));
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
                return 'Name Reservation and Incorporation'
            },
        },
        created() {
            this.$store.dispatch('setProcessId', NAME_INCORPORATION);
            this.processId;
            if( this.$route.params.id){
                this.getTicketHandler();
            }
            this.setStepsHandler();
        },
        methods: {
            validateLimitedBy() {
                const { LimitedByShares, LimitedByGuarantee } = this.ticket;
                this.customErrors = [];
                if (!LimitedByGuarantee && !LimitedByShares) {
                    this.customErrors.push('limitedBy');
                    return false;
                }
                return true; 
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
                this.setSteps(steps);
                if(!this.isEditable){
                    this.activateAllStep();
                }
                this.setActiveStep(1);
            },
            getTicketHandler(id,step) {
                const data = {
                    process_id: this.processId,
                    reference_id: this.$route.params.id ? parseInt(this.$route.params.id) : id,
                };
                getTicket(data).then(
                    res => {
                        this.getTicketHandlerSuccess(res,step)
                    }
                )
            },
            getTicketHandlerSuccess(response,step) {
                this.retainData = this.ticket;
                this.ticket = response.data[0];
                this.ticket.TranslationFile = this.retainData.TranslationFile;
                this.ticket.ForeignName = this.retainData.ForeignName;
                this.ticket.ProposedName = this.proposedName !== null ? this.proposedName : this.ticket.ProposedName;
                this.ticketValue = {
                    Referrence: this.ticket.TicketReference,
                    EntityType: this.ticket.EntityType,
                    CompanyName: this.ticket.CompanyName
                }
                this.getDeclaration();
                if( this.ticket.TicketReference !== null){
                    this.isEditable = false;
                    this.isSubmitted = true;
                    this.activateAllStep();
                    
                }else{
                    this.activateSteps(step);
                    
                }
                this.setActiveStep(step);
                if(!this.ticket.regaddress_id || this.ticket.regaddress_id === undefined){
                    this.ticket.regaddress_id = null;
                }
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
                    this.saveHandler();

                }
            },

            validateTicket(step) {
                this.$refs.validator.validate().then((result) => {
                    if (result ) {
                        
                        if(step && step === 2){
                            if(this.isEditable){
                                this.proposedName = this.ticket.ProposedName;
                                if( this.$route.params.id){
                                    this.activateSteps(step);
                                    this.setActiveStep(step);
                                }
                                else{    
                                    createNewForm({process_id: this.processId}).then(
                                        res => {
                                            this.$router.push(`/nameReservationIncorporation/${res.data[0].TAskReference_id}`);
                                            this.getTicketHandler(res.data[0].TAskReference_id,step);
                                        }
                                    )
                                }
                            }
                            else{
                                this.setActiveStep(step);

                            }

                        }
                        else if(step && typeof step !== 'number' && this.validateLimitedBy()){
                            this.addDeclarationHandler()
                        }
                    }
                })
            },
            saveHandler(step) {

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
                    ShareNoPar,
                    ProposedName,
                    ForeignName,
                    attachmentFile,
                    EntityType,
                    TranslationFile,
                } = this.ticket;

                let data = new FormData();
                data.append("icsp_id", this.userData.icsp_id);
                data.append("process_id", this.processId);
                data.append("reference_id", reference_id);
                data.append("LimitedByShares", LimitedByShares);
                data.append("currency", currency);
                data.append("LimitedByGuarantee", LimitedByGuarantee);
                data.append("AuthorizedShareCapital", AuthorizedShareCapital);
                data.append("GuaranteeAmount", GuaranteeAmount);
                data.append("regaddress_id", regaddress_id);
                data.append("ShareNoPar", ShareNoPar);
                data.append("ProposedName", ProposedName);
                data.append("ForeignName", ForeignName);
                data.append("attachmentfile", TranslationFile);
                data.append("EntityType", EntityType);
                data.append("TranslationFile", TranslationFile);
                nameResInc(data).then(
                    res =>{
                        this.ticket.TicketReference = res.data[0].TicketReference;
                        this.modals.success.step = 1;
                        this.modals.success.isVisible = true;
                    }
                )

            },
            nextStep() {
                this.validateTicket(this.activeStep.id + 1)
            },
            prevStep() {
                this.activateSteps(this.activeStep.id - 1)
                this.setActiveStep(this.activeStep.id - 1)
            },
            backToList() {
                this.modals.success.isVisible = false;
                this.$router.push('/nameReservationIncorporation');
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
