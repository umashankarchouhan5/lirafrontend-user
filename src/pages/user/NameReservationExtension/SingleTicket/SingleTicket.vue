<template>
    <FormWrapper>
        <PageTitle :title="pageTitle" slot="title" :link="`/help/${processId}`"/>
        <Wizard :steps="steps" @changeStep="setActiveStep"/>
        <ValidationObserver ref="validator">
            <component :is="activeStep.component"
                       v-if="ticket && activeStep"
                       :readonly="!isEditable"
                       ref="component"
                       v-model="ticket"
                       :reference_id="ticket.reference_id"
                       :customErrors="customErrors"
                       :isSubmitted="isSubmitted"
                       @onPaymentSuccess="onPaymentSuccessHandler"
                       @onPayLater="onPayLaterHandler"
                       :steps="steps" />
            <FormRow v-if="showSubmitButtonAndDeclaration">
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
                                v-if="showSubmitButtonAndDeclaration"
                                type="success"
                                @click="validateTicket">
                            Submit
                        </FormButton>
                        <FormButton v-if="showNextButton" left-icon="ios-arrow-forward" @click="nextStep">Next</FormButton>
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
    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import formStepsMixin from 'Mixins/formStepsMixin';
    import Wizard from 'Components/wizard/Wizard';
    import { incorporateTicket } from './api';
    import { getTicket } from 'Pages/master/masterActions';
    import entityTypesSchema from './entityTypesSchema'
    import { PROCESS_ID } from 'Config/localStorageKeys';
    import PageTitle from 'Components/layout/PageTitle';
    import Declaration, { fetchDeclaration, addDeclaration } from 'Components/Declaration';
    import DateUtil from 'Utils/dateUtil';
    import { ValidationObserver } from "vee-validate";
    import validateDocumentMixin from 'Mixins/validateDocumentMixin'

    export default {
        name: "SingleTicket",
        mixins: [formStepsMixin, validateDocumentMixin],
        data() {
            return {
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
                    }
                },
                message: '',
                customErrors: [],
                isSubmitted: false,
            }
        },
        created() {
            const processIdFromStorage = localStorage.getItem(PROCESS_ID);
            if (!this.processId && processIdFromStorage) {
                this.$store.dispatch('setProcessId', processIdFromStorage)
            }
            this.processId && this.getTicketHandler();
        },
        computed: {
            isEditable() {
                return this.activeStep && this.ticket && this.activeStep.editable.indexOf(this.ticket.ApprovedNameStatus_id) !== -1;
            },
            showNextButton() {
                return this.activeStep && this.activeStep.id === 1 && this.steps.length > 1;
            },
            showSubmitButtonAndDeclaration() {
                if (!this.isEditable) {
                    return false
                }
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
                const { EntityType } = this.ticket;
                return entityTypesSchema[EntityType].title[this.processId]
            }
        },
        components: {
            FormWrapper,
            PageTitle,
            Wizard,
            ValidationObserver,
            Declaration
        },
        methods: {
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
                this.getDeclaration();
                this.setStepsHandler();
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
                    this.setActiveStep(3)
                }
            },

            validateTicket() {
                this.$refs.validator.validate().then((result) => {
                    if (result &&
                        this.validateDocuments() &&
                        this.validateLimitedBy()) {
                        this.saveHandler();
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
                    jurisdiction_id
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
                };

                if (OriginalName && OriginalIncorporationDate && jurisdiction_id) {
                    data.OriginalName = OriginalName;
                    data.OriginalIncorporationDate = OriginalIncorporationDate;
                    data.Jurisdiction_id = jurisdiction_id;
                }

                incorporateTicket(data).then(this.incorporateTicketSuccess)
            },
            nextStep() {
                this.setActiveStep(this.activeStep.id + 1)
            },
            prevStep() {
                this.setActiveStep(this.activeStep.id - 1)
            },
            incorporateTicketSuccess(response) {
                this.isSubmitted = true;
                this.ticket.TicketReference = response.data[1][0].TicketReference;
                this.ticket.ApprovedNameStatus_id = response.data[1][0].ApprovedNameStatus_id
                this.addDeclarationHandler()
            },
            backToList() {
                this.modals.success = false;
                this.$router.push({ path: '/submissions' })
            },
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
