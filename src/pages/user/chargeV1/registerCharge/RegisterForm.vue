<template>
    <FormWrapper>
        <PageTitle title="Register of Charges" slot="title"  :link="`/help/${processId}`"/>
        
        <TicketHeader v-if="ticketValue" :ticketValue="ticketValue" />

        <GeneralInfo v-if="chargeData !== null" v-model="chargeData"></GeneralInfo>
        <FormRow>
            <FormButton @click="backToList">Back</FormButton>
        </FormRow>

        
    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle'; 
    import { REGISTER_OF_CHARGE } from 'Config/processIds';
    import { PROCESS_ID, REFERENCE_ID } from 'Config/localStorageKeys';
    import TicketHeader from 'Components/layout/TicketHeader';
    import { ChargeRequest, generateProcessTicket, generateInvoice, getTicket, chargeReferenceSearch } from './api'
    import DateUtil from 'Utils/dateUtil';
    import GeneralInfo from './components/GeneralInfo'

    export default {
        name:"RegisterChargeForm",
        components: {
            FormWrapper,
            PageTitle,
            TicketHeader,
            GeneralInfo
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
                    chargeType_id: '',
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
                chargeData: null,
            }

        },
        created(){
            this.setProcessId().then(this.chargeSearch);
        },
        watch:{
            ticket(val){
                this.ticket = val;
                return val;
            },
        },
        methods:{
            chargeSearch(){
                chargeReferenceSearch({process_id: REGISTER_OF_CHARGE, company_id: this.$route.params.id, ChargeReferenceNumber: this.$route.params.chargeRef}).then(
                        res => {
                            if(res.data[0]){
                                this.chargeData = res.data[0];
                            }
                        }
                    )
            },
            async setProcessId(){
                this.$store.commit('setProcessId', REGISTER_OF_CHARGE);

            },
             
            backToList() {
                this.modals.success.isVisible = false;
                this.$router.push('/chargeRegister');
            },
        },
        
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