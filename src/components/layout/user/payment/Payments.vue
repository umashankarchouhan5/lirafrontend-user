<template>
    <FormWrapper :border="$route.params.invoiceId || $route.name === 'MultiplePayment' ? true : false">

        <PageTitle title="Payment Summary" slot="title" v-if="$route.params.invoiceId || $route.name === 'MultiplePayment'"/>

        <div  v-if="$route.params.invoiceId || $route.name === 'MultiplePayment'">
            <TicketHeader v-if="ticketValue !== null" :ticketValue="ticketValue" />
        </div>
        <br/>

        <div :class="$style.payments">
            <div v-if="invoice.length > 0  && invoice[1][0].InvStatus === 500">
                <h5>Review Your Request</h5>
                <p>By clicking on "Pay" button you agree to FSA's <a @click="privacy.success.isVisible = true">Privacy Policy</a> and <a @click="terms.success.isVisible = true">Condition of Use</a></p>
            </div>
            <div v-if="$route.name !== 'MultiplePayment'">
                <div>
                    <h5>Payment Summary</h5>
                </div>
                <p v-if="invoice.length > 0 && invoice[1][0].InvStatus === 500">
                    {{ invoice[0][0].Narration }}
                </p>
                <p v-if="invoice.length > 0 && (invoice[1][0].InvStatus === 500 || invoice[1][0].InvStatus === 505)">All Amounts are in {{invoice[0][0].currency}}</p>
                <div :class="$style.total" v-if="invoice.length > 0 && (invoice[1][0].InvStatus === 500 || invoice[1][0].InvStatus === 505)">
                    <div :class="$style.totalRow" v-if="invoice.length > 0 && invoice[0][0].Fee > 0">
                        <div>
                            Fees <span>:</span>
                        </div>
                        <div>
                            <p> {{ invoice[0][0].Fee }} </p>
                        </div>
                    </div>
                    <div :class="$style.totalRow" v-if="invoice[0][0].Tax > 0">
                        
                        <div>
                            {{ invoice[0][0].TaxType }} Tax ({{ invoice[0][0].Taxpct }}%) <span>:</span>
                        </div>
                        <div>
                            <p>{{ invoice[0][0].Tax }} </p>
                        </div>
                    </div>
                    <div :class="$style.totalRow" v-if="invoice[0][0].Interest > 0">
                        
                        <div>
                            Interest: <span>:</span>
                        </div>
                        <div>
                            <p>{{ invoice[0][0].Interest }} </p>
                        </div>
                    </div>
                    <div :class="$style.totalRow" v-if="invoice[0][0].Penalty > 0">
                        
                        <div>
                            Penalty <span>:</span>
                        </div>
                        <div>
                            <p>{{ invoice[0][0].Penalty }} </p>
                        </div>
                    </div>
                    <div v-if="getAdditionalCharges(invoice[1][0]['InvoiceDetail'])!==false">
                        <div v-for="(item, i) in getAdditionalCharges(invoice[1][0]['InvoiceDetail'])" :key="i" :class="$style.totalRow">
                            <div v-if="item.chargeDesc !== ''">
                                {{item.chargeDesc}}<span>:</span>
                            </div>
                            <div v-if="item.chargeDesc !== ''">
                                <p>{{item.chargeAmount.toFixed(2)}} </p>
                            </div>
                        </div>
                    </div>
                    <div :class="$style.totalRow">                    
                        <div>
                            Total Amount<span>:</span>
                        </div>
                        <div>
                            <p>{{ invoice[0][0].Total }} </p>
                        </div>
                    </div>
                </div>
                <div v-if="invoice.length > 0 && invoice[1][0].InvStatus === 500">
                    <template v-if="((!readonly && isSubmitted) || feeOnly || $route.params.invoiceId)">
                        <h6 >Payment Details</h6>
                        <FormRow v-if="parseFloat(invoice[0][0].Total) !== 0">
                            <div class="col-sm-6">
                                <FormSelect :items="paymentMethods" item-value="id" :width="220" item-name="Name" v-model="paymentmode" label="Select Method" />
                            </div>
                        </FormRow>
                        <ButtonGroup>
                            
                            <FormButton @click="generateTicket"
                                type="success"
                                v-if="parseFloat(invoice[0][0].Total) === 0 "
                                left-icon="md-checkmark-circle-outline">Continue</FormButton>
                            <FormButton @click="payHandler"
                                type="success"
                                v-else
                                :title="!paymentmode ? 'Select a payment method first' : ''"
                                :disabled="!paymentmode"
                                left-icon="md-checkmark-circle-outline">Pay Now</FormButton>
                            <FormButton @click="cancelFee"
                                type="primary"
                                left-icon="ios-close-circle-outline">Cancel</FormButton>
                            <div v-if="invoice && invoice.PayLater">
                                <FormButton type="success"
                                    @click="payLaterHandler"
                                    :disabled="!paymentmode"
                                    left-icon="md-time">Pay Later</FormButton>
                            </div>
                        </ButtonGroup>
                    </template>
                </div>
                <div v-else>
                    <h6>Payment Details</h6>
                    <DataTable :actions="false"
                    v-if="invoices.length > 0"
                    :data="invoices[0][1]"
                    :columns="config"
                    >
                    </DataTable>
                    <br />
                    <FormButton type="success"
                        @click="backToList"
                        left-icon="ios-close-circle-outline">Back To List</FormButton>
                </div>
            </div>
            <div v-else>
                <!-- <div >
                    <h5>Review Your Request</h5>
                    <p>By clicking on "Pay" button you agree to FSA's <a @click="privacy.success.isVisible = true">Privacy Policy</a> and <a @click="terms.success.isVisible = true">Condition of Use</a></p>
                </div> -->
                <!-- <div v-if="!$route.params.invoiceId"> -->
                <div>
                    <h5>Payment Summary</h5>
                </div>
                <p >
                    {{ invoice[0][0].Narration }}
                </p>
                <p>All Amounts are in {{invoice[0][0].currency}}</p>
                <div :class="$style.total" >
                    <div :class="$style.totalRow" v-if="invoice[0][0].Fee > 0">
                        <div>
                            Fees <span>:</span>
                        </div>
                        <div>
                            <p> {{ invoice[0][0].Fee }} </p>
                        </div>
                    </div>
                    <div :class="$style.totalRow" v-if="invoice[0][0].Tax > 0">
                        
                        <div>
                            {{ invoice[0][0].TaxType }} Tax  <span>:</span>
                        </div>
                        <div>
                            <p>{{ invoice[0][0].Tax }} </p>
                        </div>
                    </div>
                    <div :class="$style.totalRow" v-if="invoice[0][0].Interest > 0">
                        
                        <div>
                            Interest: <span>:</span>
                        </div>
                        <div>
                            <p>{{ invoice[0][0].Interest }} </p>
                        </div>
                    </div>
                    <div :class="$style.totalRow" v-if="invoice[0][0].Penalty > 0">
                        
                        <div>
                            Penalty <span>:</span>
                        </div>
                        <div>
                            <p>{{ invoice[0][0].Penalty }} </p>
                        </div>
                    </div>
                    <div v-if="getAdditionalCharges(invoice[1][0]['InvoiceDetail'])!==false">
                        <div v-for="(item, i) in getAdditionalCharges(invoice[1][0]['InvoiceDetail'])" :key="i" :class="$style.totalRow">
                            <div v-if="item.chargeDesc !== ''">
                                {{item.chargeDesc}}<span>:</span>
                            </div>
                            <div v-if="item.chargeDesc !== ''">
                                <p>{{item.chargeAmount}} </p>
                            </div>
                        </div>
                    </div>
                    <div :class="$style.totalRow">                    
                        <div>
                            Total Amount<span>:</span>
                        </div>
                        <div>
                            <p>{{ invoice[0][0].Total }} </p>
                        </div>
                    </div>
                </div>
                <template >
                    <h6 v-if="parseFloat(invoice[0][0].Total) !== 0">Payment Details</h6>
                    <FormRow v-if="parseFloat(invoice[0][0].Total) !== 0">
                        <div class="col-sm-6">
                            <FormSelect :items="paymentMethods" item-value="id" :width="220" item-name="Name" v-model="paymentmode" label="Select Method" />
                        </div>
                    </FormRow>
                    <ButtonGroup>
                        <FormButton @click="generateTicket"
                            type="success"
                            v-if="parseFloat(invoice[0][0].Total) === 0"
                            left-icon="md-checkmark-circle-outline">Continue</FormButton>
                        <FormButton @click="payHandler"
                            type="success"
                            v-else
                            :title="!paymentmode ? 'Select a payment method first' : ''"
                            :disabled="!paymentmode"
                            left-icon="md-checkmark-circle-outline">Pay Now</FormButton>
                        <FormButton @click="cancelFee"
                            type="primary"
                            left-icon="ios-close-circle-outline">Cancel</FormButton>
                        <div v-if="invoice && invoice.PayLater">
                            <FormButton type="success"
                                @click="payLaterHandler"
                                :disabled="!paymentmode"
                                left-icon="md-time">Pay Later</FormButton>
                        </div>
                    </ButtonGroup>
                </template>
            </div>
        </div>

        <PrivacyPolicy v-model="privacy"/>
        <TermsAndCondition v-model="terms"></TermsAndCondition>

        <ConfirmationModal v-model="confirmationData" :isVisible="confirmationVisible" v-if="invoice.length > 0" :currency="invoice[0][0].currency" :invoice_idstring="invoice_idstring"></ConfirmationModal>

        <Popup :value="modals.success.isVisible"
               type="success"
               title="Payment Successful"
               :closable="false"
               :mask-closable="false"
               @close="() => modals.success.isVisible = false">
            <div :class="$style.success">
                <template v-if="TicketReference && TicketReference !== '' && TicketReference !== null">
                    <template v-if="modals.success.step === 3">
                        <p>Thank you for your payment.</p>
                        <p>Your case reference #<strong>{{ TicketReference }}</strong> has been submitted for further processing.</p>
                    </template>
                    
                    <template v-if="modals.success.step === 4">
                        <p>{{ modals.success.message }}</p>
                    </template>

                    <template v-if="modals.success.step === 5">
                        <p>Thank you for your payment.</p>
                        <p>The expiry date has been extended. Your reference number is #<strong>{{ TicketReference }}</strong>.</p>
                    </template>
                </template>
                <template v-else>
                    <template v-if="modals.success.step === 4">
                        <p>{{ modals.success.message }}</p>
                    </template>
                    <template v-if="modals.success.step === 5">
                        <p>Thank you for your payment.</p>
                    </template>
                    <template v-if="modals.success.step === 6">
                        <p>Thank you for your payment.</p>
                    </template>
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
    import { fetchFees, preProcessTicket, payLater, updateInvoice, totalPayAmount, fetchPaymentMode, payMultipleInvoicesWallet, generateProcessTicket, fetchPQTicketByProcessReference } from './api'
    import PrivacyPolicy from 'Components/modal/PrivacyPolicy';
    import TermsAndCondition from "Components/modal/TermsAndCondition";
    import PageTitle from 'Components/layout/PageTitle';
    import TicketHeader from 'Components/layout/TicketHeader';
    import DataTable from 'Components/DataTable';
    import config from './table';
    import ConfirmationModal from './confirmation/confirmation';
    import checkPaymentMixin from 'Mixins/checkPaymentMixin';
    import BaseConfig from 'Config/base';

    export default {
        name: "Payments",
        mixins:[checkPaymentMixin],
        data() {
            return {
                // invoice: null,
                confirmationData: {},
                confirmationVisible: false,
                config,
                privacy: {
                    success: {
                        isVisible: false,
                        message: ''
                    }
                },
                terms: {
                    success: {
                        isVisible: false,
                        message: ''
                    }
                },
                paymentMethods: [
                    
                ],
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
                paymentmode: null,
                invoices:[],
                ticketValue: null,
                invoice_idstring:'',
                TicketReference:'',
                pqData: [],
            }
        },
        components:{
            PrivacyPolicy,
            TermsAndCondition,
            DataTable,
            PageTitle,
            ConfirmationModal,
            TicketHeader,
            FormWrapper
        },
        created() {
            this.fetchMode();
            this.fetchFeesHandler();
        },
        props: {
            feeOnly: Boolean,
            value: [Object,Array],
            readonly: Boolean,
            isSubmitted: Boolean,
            cancelRoute: String,
        },
        computed: {
            processId() {
                return this.$store.state.common.currentProcessId;
            },
            userData() {
                return this.$store.state.user.user;
            },
            invoice(){
                return this.$store.state.invoice.invoice;
            },
            currency(){
                return this.$store.state.invoice.currency;
            },
            generatedInvoice() {
                return this.$store.state.user.generatedInvoice;
            },
            multiplePayment( ){
                return this.$store.state.user.multiplePayment
            },
            multiIdString(){
                return this.$store.state.user.multiIdString;
            },
            pqGenerationFormIds() {
                return this.$store.state.user.pqGenerationFormIds;
            }
        },
        watch:{
            invoice(val){
                this.invoices.push(val);
                if(val !== '' || val !== null || val!== '{}'){
                    this.ticketValue =
                    {
                        'Referrence': this.invoice.TicketReference,
                        'EntityType': this.invoice.EntityType,
                        'CompanyName': this.invoice.companyName

                    }
                }
            }
        },
        methods: {
            getAdditionalCharges(detail) {
                var additional = JSON.parse(detail);
                if(typeof additional[0].additionalCharge!="undefined"){
                    var charges = JSON.parse(additional[0].additionalCharge);
                    return charges;
                } else {
                    return false;
                }
            },
            getFormattedAmount (value){
                const formatted = new Intl.NumberFormat('en-IN').format(value)
                return formatted;
            },
            getNarrations(item){
                var narration = JSON.parse(item.InvoiceDetail)[0].Narration;
                return narration;
            },
            generateTicket(){
                const data = {
                    process_id: JSON.parse(this.invoice[1][0].InvoiceDetail)[0].process_id,
                    reference_id: JSON.parse(this.invoice[1][0].InvoiceDetail)[0].reference_id
                };
                generateProcessTicket(data).then(
                    res => {
                        const data = {
                            ticketReference: res.data[0].TicketReference,
                            ApprovedNameStatus_id: res.data[0].ApprovedNameStatus_id,
                            step: 3,
                        };
                        if(this.$route.params.invoiceId){
                            this.modals.success.step = 3;
                            this.modals.success.isVisible = true;
                            this.TicketReference = res.data[0].TicketReference;
                        }else{
                            this.$emit('onPaymentSuccess', data)
                        }
                    }
                )
            },
            fetchMode(){
                fetchPaymentMode().then(
                    res => {
                        this.paymentMethods = res.data;
                    }
                )
            },
            cancelFee(){
                this.$router.go(-1)
            },
            fetchFeesHandler() {
                if(this.$route.name === 'MultiplePayment'){
                    if(this.multiplePayment.length > 0){
                        this.$store.dispatch('getMultipleInvoice',this.multiplePayment);
                    }
                    else{
                            
                        const data = {
                            invoice_idstring: this.$route.params.invoiceId,
                        };
                        this.invoice_idstring = this.$route.params.invoiceId;
                        this.$store.dispatch('getInvoice',data);
                    }
                }
                else if(this.$route.params.invoiceId){
                    const data = {
                        // invoice_id: this.$route.params.invoiceId,
                        invoice_idstring: this.$route.params.invoiceId,
                    };
                    this.invoice_idstring = this.$route.params.invoiceId;
                    this.$store.dispatch('getInvoice',data);
                }
                else{
                    const data = {
                        // invoice_id: this.generatedInvoice,
                        invoice_idstring: this.generatedInvoice,
                    };
                    this.invoice_idstring = this.generatedInvoice;
                    this.$store.dispatch('getInvoice',data);
                    if(this.pqGenerationFormIds.indexOf(this.processId) !== -1){
                        fetchPQTicketByProcessReference({process_id: this.processId, reference_id: parseInt(this.$route.params.id)}).then(
                            res => {
                                this.pqData = res.data;
                            }
                        )
                    }
                }
            },
            payLaterHandler() {
                payLater({
                    process_id: this.processId,
                    reference_id: this.value.reference_id,
                    paymentmode: this.paymentmode
                }).then(res => {
                    this.$emit('onPayLater', res.message)
                })
            },
            payHandler() {
                if(this.$route.params.invoiceId){
                    const data = {
                        invoice_idstring: this.$route.params.invoiceId,
                        paymentmode: this.paymentmode,
                        FSATransReference: 'referencecheck',
                        paymentInvoices: this.invoice
                    };
                    this.updateInvoiceHandler(data)
                }
                else if(this.$route.name === 'MultiplePayment'){
                    this.invoice_idstring = this.multiIdString;
                    const data = {
                        invoice_idstring: this.multiIdString,
                        paymentmode: this.paymentmode,
                        FSATransReference: 'referencecheck',
                        paymentInvoices: this.multiplePayment
                    };
                    this.updateInvoiceHandler(data)
                }
                else{
                    const data = {
                        invoice_idstring: this.generatedInvoice,
                        paymentmode: this.paymentmode,
                        FSATransReference: 'referencecheck',
                        paymentInvoices: this.invoice
                    };
                    this.updateInvoiceHandler(data)
                }
                
            },
            updateInvoiceHandler(data){
                if(data.paymentmode === 1){
                    payMultipleInvoicesWallet(data).then(
                        res =>{
                            if(this.$route.name !== 'MultiplePayment'){
                                const data = {
                                    ticketReference: res.data[0].TicketReference,
                                    //ApprovedNameStatus_id: res.data[0].ApprovedNameStatus_id,
                                    step: 3,
                                    pqData: this.pqData
                                };
                                if(this.$route.params.invoiceId){
                                    if(typeof res.data[0].DisplayMessage !== 'undefined'){
                                        this.modals.success.step = 4;
                                        this.modals.success.message = res.data[0].DisplayMessage;
                                        this.modals.success.isVisible = true;
                                    } else {
                                        this.modals.success.step = 3;
                                        this.modals.success.isVisible = true;
                                        this.TicketReference = res.data[0].TicketReference;
                                    }
                                }else{
                                    this.$emit('onPaymentSuccess', data)
                                }
                            }else{
                                this.modals.success.step = 4;
                                this.modals.success.message = 'Your request(s) have been submitted for further processing';
                                this.modals.success.isVisible = true;
                            }
                    })
                }else{
                    if (this.$route.name !== 'MultiplePayment'){
                        if (BaseConfig.ENV=='DEVELOPMENT') {
                            const totalData ={
                                amount: this.invoice[0][0].Total,
                                currency: this.invoice[0][0].currency,
                                reference_id: data.invoice_idstring
                            }
                            this.confirmationVisible = false;
                            totalPayAmount(totalData).then(
                                (res) =>{
                                    if(res.data[0].TicketReference===undefined){
                                        this.modals.success.step = 4;
                                        this.modals.success.message = 'Your request(s) have been submitted for further processing';
                                        this.modals.success.isVisible = true;
                                    }else{
                                        this.modals.success.step = 3;
                                        this.modals.success.isVisible = true;
                                        this.TicketReference = res.data[0].TicketReference;
                                        
                                    }
                                }
                            )
                        } else {
                            const totalData ={
                                amount: this.invoice[0][0].Total,
                                currency: this.invoice[0][0].currency,
                                reference_id: data.invoice_idstring
                            }
                            this.confirmationVisible = false;
                            totalPayAmount(totalData).then(
                                (res) =>{
                                    this.confirmationData = res.data;
                                    this.confirmationVisible = true;
                                }
                            )
                        }
                        
                    } else {
                        if (BaseConfig.ENV=='DEVELOPMENT') {
                            const totalData ={
                                amount: this.multiplePayment[0][0].Total,
                                currency: this.invoice[0][0].currency,
                                reference_id: data.invoice_idstring,
                            }
                            this.confirmationVisible = false;
                            totalPayAmount(totalData).then(
                                (res) =>{
                                    if(res.data[0].TicketReference==undefined){
                                        this.modals.success.step = 4;
                                        this.modals.success.message = 'Your request(s) have been submitted for further processing';
                                        this.modals.success.isVisible = true;
                                    }else{
                                        this.modals.success.step = 3;
                                        this.modals.success.isVisible = true;
                                        this.TicketReference = res.data[0].TicketReference;
                                        
                                    }
                                }
                            )
                        } else {
                            const totalData ={
                                amount: this.multiplePayment[0][0].Total,
                                currency: this.invoice[0][0].currency,
                                reference_id: data.invoice_idstring,

                            }
                            this.confirmationVisible = false;
                            totalPayAmount(totalData).then(
                                (res) =>{
                                    this.confirmationData = res.data;
                                    this.confirmationVisible = true;
                                }
                            )
                        }
                    }
                }
            },
            backToList() {
                this.$router.go(-1)
            },
            mapCurrencyToSign() {
                if (this.invoice && this.invoice.currency) {
                    if (this.invoice.currency === 'USD') {
                        return '$'
                    }
                    return ''
                }
                return ''
            }
        }
    }
</script>

<style lang="scss" module>
    .indent {
        margin-left: 20px;
    }
    .success {
        p {
            margin-bottom: 10px;
            &:last-child {
                margin-bottom: 0;
            }
        }
    }
    .payments {
        padding: 0px 20px;
        h5 {
            font-size: 17px;
            font-weight: 500;
            text-align: left;
            margin-bottom: 10px;
        }
        p {
            margin-bottom: 15px;
        }
        h6 {
            text-align: left;
            font-size: 15px;
            margin-bottom: 20px;
        }
    }
    .total {
        margin-bottom: 20px;
    }
    .totalRow,
    .totalRowSummary {
        border-bottom: 1px solid #fff;
        display: flex;
        > div {
            padding: 8px 0px;
            display: flex;
            font-weight: 500;
            justify-content: flex-start;
            &:nth-child(1) {
                width: 30%;
                min-width: 120px;
                max-width: 140px;
                span {
                    margin-left: auto;
                }
            }
            &:nth-child(2) {
                width: 20%;
                text-align: right;
                min-width: 80px;
                max-width: 110px;
                p{
                    margin-left: auto;
                    margin-bottom: 0px;
                }
            }
            &:nth-child(3) {
                width: 25%;
                padding-left: 40px;
                font-size: 14px;
            }
        }
    }

    .totalRowSummary {
        > div {
            &:first-child {
                font-size: 15px;
                font-weight: 500;
            }
            &:last-child {
                font-size: 17px;
                font-weight: 700;
            }
        }
    }
</style>
