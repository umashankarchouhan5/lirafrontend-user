<template>
    <FormWrapper>
        <PageTitle title="Register Of Director" slot="title"/>
        <ValidationObserver ref="validator">
        <RequestROD v-model="ticket" :readonly="!isEditable" :customErrors="customErrors" ></RequestROD>
             
        </ValidationObserver>
        <ButtonGroup >
            <FormButton left-icon="ios-arrow-forward" @click="validateTicket" >Submit</FormButton>
        </ButtonGroup>
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
                        
                        <FormButton slot="footer" @click="backToList">Back</FormButton>
                    </template>
                </template>
                
            </div>
        </Popup>
    </FormWrapper>
</template>
<script>
    import RequestROD from './components/RequestROD'
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import { ValidationObserver } from "vee-validate";
    import { ROD_PROCESS_ID } from 'Config/processIds';
    import { requestByWebUser, generateProcessTicket } from './api';
    // import TicketHeader from 'Components/layout/TicketHeader';

    export default {
        name: 'ROD',
        data(){
            return{
                isEditable: true,
                mode: 'request',
                ticket: {
                    process_id: null,
                    reference_id: 0,
                    Company_id: null,
                    address_id: null,
                    MailingAddress_id: null,
                    company: {},
                    isChecked: false,
                },
                modals: {
                    success: {
                        isVisible: false,
                        step: 1,
                        message: ''
                    }
                },
                isSubmitted: false,
                customErrors: {
                    rodNotSaved: false,
                },
                ticketValue: null,
            }
        },
        components: {
            RequestROD,
            FormWrapper,
            PageTitle,
            // TicketHeader,
            ValidationObserver,

        },
        created(){
            this.ticket.process_id = ROD_PROCESS_ID;
            this.$store.commit('setCompany',null);
        },
        methods:{
            validateTicket() {
                this.$refs.validator.validate().then((result) => {
                    if (result) {
                        if(this.ticket.reference_id == 0){
                            this.customErrors.rodNotSaved  = true;
                        }
                        else{
                            this.customErrors.rodNotSaved = false;
                            this.submitForm();
                        }
                    }
                })
            },
            submitForm(){
               const { process_id, reference_id } = this.ticket;
               const data = {
                    process_id,
                    reference_id
                };
                generateProcessTicket(data).then(res=>{
                    this.ticket.TicketReference =  res.data[0].TicketReference;
                    this.modals.success.isVisible = true;
                })

            },
            setStepsHandler() {
                this.setSteps(steps);
                this.setActiveStep(1);
            },
            activateSteps() {
                this.steps.forEach(item => item.isDisabled = false)
            },
            
            setMode() {
                if(this.$route.params.action && this.$route.params.action != 'request' ){
                    this.isEditable = false;
                    return this.mode = 'request';
                }else{
                    return this.mode = 'ticket';
                }
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
            nextStep() {
                this.setActiveStep(this.activeStep.id + 1)
            },
            prevStep() {
                this.setActiveStep(this.activeStep.id - 1)
            },
            backToList() {
                this.modals.success.isVisible = false;
                this.$router.push('/dashboard');
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