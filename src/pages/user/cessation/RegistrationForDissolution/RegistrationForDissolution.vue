<template>
    <FormWrapper>
        <PageTitle title="Registration of Dissolution" slot="title" :link="`/help/470`" />
        <Wizard :steps="steps" @changeStep="setActiveStep"/>
        <ValidationObserver ref="validator" >
        <component :is="activeStep.component"
            ref="component"
            :stepId="activeStep.id"
            :readonly="readonly"
            :isSubmitted="isSubmitted"
            v-model="form.data"
            :class="$style.formContent"
            :customErrors="customErrors"
            :reference_id="reference_id"
            :mode="mode"
            @nextStep="nextStep"
            @submit="validateTicket"
            @prevStep="prevStep"
            @onPaymentSuccess="onPaymentSuccessHandler"
            @onPayLater="onPayLaterHandler"
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
            <FormButton v-if="showNextButton" left-icon="ios-arrow-forward" @click="nextStep">Next</FormButton>
        </ButtonGroup>
        </ValidationObserver>
        <Popup :value="modals.success.isVisible"
               type="success"
               title="Submitted Successfully"
               :closable="false"
               :mask-closable="false"
               @close="() => modals.success.isVisible = false">
            <div :class="$style.success">
                <template v-if="form.data && form.data.TicketReference ">
                    <template v-if="modals.success.step === 1">
                        <p>Your request has been submitted successfully.</p>
                        <p>Your request # for future reference is <strong>{{ form.data.TicketReference }}</strong>.</p>
                    </template>
                    <template v-if="modals.success.step === 3">
                        <p>Thank you for your payment.</p>
                        <p>Your case reference #<strong>{{ form.data.TicketReference }}</strong> has been submitted for further processing.</p>
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
    import Wizard from 'Components/wizard/Wizard.vue';
    import formStepsMixin from 'Mixins/formStepsMixin';
    import steps from './steps'
    import { ValidationObserver } from "vee-validate";
    import Declaration, { fetchDeclaration, addDeclaration } from 'Components/Declaration';
    import PageTitle from 'Components/layout/PageTitle';
    import { REGISTRATION_FOR_DISSOLUTION  } from 'Config/processIds';
    import validateDocumentMixin from 'Mixins/validateDocumentMixin'
    import DateUtil from 'Utils/dateUtil';
    import checkPaymentMixin from 'Mixins/checkPaymentMixin';
    import {
        cessationRequest,
        generateProcessTicket,
        getTicket,
        generateInvoice
    } from '../api'

    export default {
        name: 'Cessation',
        mixins: [ formStepsMixin, validateDocumentMixin, checkPaymentMixin ],
        components: {
            FormWrapper,
            Wizard,
            Declaration,
            ValidationObserver,
            PageTitle,
        },
        data() {
            return {
                form: {
                    data: {}
                },
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
                },
                readonly: false,
                isSubmitted: false,
                reference_id: 0,
                customErrors: {
                    notSelectedError: false,
                },
                mode: 'add'
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            },
            currentProcessId() {
                return this.$store.state.common.currentProcessId
            },
            showSubmitButtonAndDeclaration() {
                return this.activeStep.id === 2 
            },
            showNextButton() {
                return this.activeStep && this.activeStep.id === 1 && this.steps.length > 1;
            },
        },
        created() {
            this.setSteps(steps);
            if(this.$route.params.id){
                this.mode= 'edit';
                this.reference_id = parseInt(this.$route.params.id);
                this.getData();
            }
            this.$store.commit('setProcessId', REGISTRATION_FOR_DISSOLUTION);
            this.getDeclaration();

        },
        methods:{
            getData(){
                getTicket({
                    process_id:  REGISTRATION_FOR_DISSOLUTION,
                    reference_id: this.reference_id,
                }).then(this.responseHandler)
            },
            responseHandler(data){
                this.form.data = data.data[0];
                this.reference_id = this.form.data.reference_id;
                this.form.data.effectiveDate = this.form.data.EffectiveDate;
                this.form.data.liquidatorName = this.form.data.Liquidator;
                this.activateSteps(1);
                this.setActiveStep(1);
                if(this.form.data.TicketReference){
                    this.readonly = true;
                    this.declaration.DeclarationDate = this.form.data.DeclarationDate;
                    this.declaration.Name = this.form.data.Name;
                    this.declaration.Place = this.form.data.Place;
                    this.activateAllStep();
                }
                this.$store.commit('setProcessId', REGISTRATION_FOR_DISSOLUTION);
                
            },
            finalsubmit(){
                const { Name, Place, DeclarationDate } = this.declaration;
                const declarationData = {
                    process_id:  REGISTRATION_FOR_DISSOLUTION,
                    reference_id: this.reference_id,
                    Name,
                    Place,
                    DeclarationDate
                };
                this.validateTicket(declarationData);
            },
            documentValidationHandler(declarationData){
                addDeclaration(declarationData).then(res => {
                    const Data = {
                        process_id:  REGISTRATION_FOR_DISSOLUTION,
                        reference_id: parseInt(this.reference_id),
                    }
                    generateProcessTicket(Data).then(
                        res => {
                            
                            this.form.data.TicketReference = res.data[0].TicketReference;
                            this.form.data.Status_id = res.data[0].Status_id;
                            this.modals.success.step = 1;
                            this.modals.success.isVisible = true;
                        }
                    )
                    // generateInvoice(Data).then(
                    //     res => {
                    //         this.$store.commit('setGeneratedInvoice',res.data[0].invoice_id),
                    //         this.isSubmitted = true;
                    //         this.activateSteps(3);
                    //         this.setActiveStep(3)
                    //     }
                    // )
                })
            },
            saveHandler(nextStep) {
                var data = this.getDataToSend(nextStep);
                if(data !== null){
                    cessationRequest(data).then(res=>{
                        this.reference_id = res.data[0].reference_id;
                        this.form.reference_id = res.data[0].reference_id;
                        if(!this.$route.params.id){
                            this.$router.replace(`dissolutionRegistration/${res.data[0].reference_id}`);
                        }
                        if(nextStep){
                            this.activateSteps(nextStep);
                            this.setActiveStep(nextStep);
                        }
                    });
                }
            },
            getDataToSend(nextStep){
                if( this.form.data.company_id && this.form.data.company_id !== null && this.form.data.company_id !== ''){
                    this.customErrors.notSelectedError = false;
                    const { company_id, effectiveDate, cessationReason, solvent,  liquidatorName, liquidatorAddress } = this.form.data;
                    const data = {
                        process_id: REGISTRATION_FOR_DISSOLUTION,
                        reference_id: this.reference_id,
                        company_id, 
                        effectiveDate, 
                        cessationReason,
                        license_id: this.userData.license_id,
                        solvent, 
                        liquidatorName, 
                        liquidatorAddress
                    }
                    return data;
                }else{
                    this.customErrors.notSelectedError = true;
                    return null;
                }
            },
            validateTicket(declarationData,nextStep) {
                if(!this.readonly){
                    if (this.activeStep.id === 2 ) {
                        this.$refs.validator.validate().then((result) => {
                            if (result && this.validateDocuments() ) {
                                this.documentValidationHandler(declarationData);
                            }
                        });
                    }
                    else{
                        this.$refs.validator.validate().then((result) => {
                            if(result){
                                this.saveHandler(nextStep);
                            }
                            else{
                                this.customErrors.notSelectedError = false;
                            }
                        });
                    }
                }else{
                    this.setActiveStep(nextStep)
                }
            },
            getDeclaration() {
                const data = {
                    process_id:  REGISTRATION_FOR_DISSOLUTION
                };
                fetchDeclaration(data).then(res => {
                    this.declaration.DisplayText = res.data[0].DisplayText;
                })
            },
            onPaymentSuccessHandler(data) {
                this.form.data.TicketReference = data.ticketReference;
                this.form.data.Status_id = data.Status_id;
                this.modals.success.step = 3;
                // this.modals.success.step = data.step;
                this.modals.success.isVisible = true;
            },
            onPayLaterHandler(message) {
                this.modals.success.isVisible = true;
                this.modals.success.step = 4;
                this.modals.success.message = message;
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
            nextStep() {
                if(!this.readonly){
                    var nextStep = this.activeStep.id + 1;
                    this.validateTicket('',nextStep)
                }else{
                    this.setActiveStep(this.activeStep.id + 1)
                }
            },
            prevStep() {
                if(!this.readonly){
                    if( this.activeStep.id == 2){
                        this.activateSteps(1);
                        this.setActiveStep(1)
                    }else{
                        var nextStep = this.activeStep.id - 1;
                        this.validateTicket('',nextStep)
                    }
                }else{
                    this.setActiveStep(this.activeStep.id - 1)
                }
            },
            backToList(){
                this.$router.push('/dissolutionRegistration')
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