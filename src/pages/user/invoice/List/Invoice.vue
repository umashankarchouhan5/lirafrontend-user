<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="My Invoices" slot="title" />
         <div :class="$style.filter">
            <div :class="$style.filterItem" >
                <FormSelect :width="200" label="Status" :items="filtering.statuses" item-name="displaynameforweb" item-value="id" v-model="filtering.statusSelected" :clearable="false" />
            </div>
            <div :class="$style.filterItem">
                <InputText v-model="filtering.invoiceNumber" noApostrophe label="Invoice Number" />
            </div>
            <!-- <div :class="$style.filterItem">
                <FormSelect :width="200" label="Entity Type" :items="filtering.entityTypes" item-name="longName" item-value="Name" v-model="filtering.entityTypeSelected"  />
            </div> -->
            <div :class="$style.filterItem">
                <InputDate :width="200" label="Select Date Range" type="daterange"  v-model="filtering.dates"  />
            </div>
        </div>
        <div :class="$style.filter">
            
            <!-- <div :class="$style.filterItem">
                <FormSelect :width="200" label="Process" :items="filtering.processTypes" item-name="Name" item-value="id" v-model="filtering.processTypeSelected" />
            </div>
            <div :class="$style.filterItem" v-if="filtering.processTypeSelected">
                <FormSelect :width="200" label="SubProcess" :items="filtering.processNames" item-name="Name" item-value="id" v-model="filtering.processNameSelected" />
            </div> -->
            <div :class="$style.filterItem">
                <ValidationObserver ref="regex" mode="active">
                    <InputText label="Company" noApostrophe v-model="filtering.companySelectedName" />
                </ValidationObserver>
            </div>
            <div :class="$style.filterItem">
                <FormButton style="margin-top: 5px" type="primary" @click="search" :rounded="true">
                    <Icon type="ios-search" />
                </FormButton>
            </div>
        </div>
        <DataTable :actions="true"
                    ref="selection"
                    :selectAll="selectAll"
                   :data="invoices"
                   :columns="config"
                   :is-loading="isLoading"
                   @on-selection-change="selectChange"
                   @on-page-change="pageChange"
                   :pagination="pagination"
                   @on-sort-change="sortChange">
            <template slot="actionsLeft">
                <TableButton @click="() => render()">
                    <img src="../../../../assets/images/payment.png" />
                    Pay Invoice
                </TableButton>
                <TableButton @click="() => view()" >
                    <img src="../../../../assets/images/eye.png" />
                    View Invoice
                </TableButton>
                <TableButton @click="() => receipt()" >
                    <img src="../../../../assets/images/view_receipt.png" />
                    View Receipt
                </TableButton>
            </template>
            <template slot="actionsRight">
                <TableButton @click="exportInvoices">
                    <img src="../../../../assets/images/Excel_Icon.png" alt=""/>
                    Export
                </TableButton>
            </template>
        </DataTable>
        
<!-- Message popup -->
        <Popup title="Information" :value="warningModal.visible" @close="() => showWarningModal(false)">
            {{ warningModal.message }}
            <div slot="footer">
                <FormButton v-if="warningModal.buttons.cancel" @click="() => showWarningModal(false)">Cancel</FormButton>
                <FormButton v-if="warningModal.buttons.ok" @click="() => showWarningModal(false)">Ok</FormButton>
            </div>
        </Popup>
      
<!-- Invoice Preview popup -->
        <Popup title="Preview" :value="paymentModal.visible" @close="() => showpaymentModal(false)">
            <div :class="$style.popupRow">
                <InputText label="Total" :readonly="true" v-model="invoiceTotal" />
            </div>
            <div :class="$style.popupRow">
                 <FormSelect :items="paymentMethods" item-value="value" item-name="label" v-model="paymentMode" label="Select method" />
            </div>
            <div slot="footer">
                <FormButton v-if="paymentModal.buttons.pay" @click="() => payHandler()">Pay Now</FormButton>
                <FormButton v-if="paymentModal.buttons.ok" @click="() => showpaymentModal(false)">Cancel</FormButton>
            </div>
        </Popup>
    </FormWrapper>
</template>

<script>
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    import config from './table';
    import loadingMixin from 'Mixins/loadingMixin';
    import InputDate from 'Components/form/InputDate';
    import { ANNUAL_RENEWAL } from 'Config/processIds';
    import { COMPANY_NAME_NOT_ALLOWED } from 'Config/defaultData';
    import { ValidationObserver } from 'vee-validate';
    
    import {fetchReceiptByInvoiceId, getProcessTypes, getProcesses, getEntityType, getCompanies, getInvoiceStatus, getInvoiceList, getInvoiceDetails, updateInvoice, generateAnnualRenewalInvoice, fetchMultipleInvoice, exportInvoices } from '../api'
    
    export default {
        name: "Invoice",
        mixins: [loadingMixin],
        components: {
            FormWrapper,
            PageTitle,
            DataTable,
            InputDate,
            ValidationObserver,
        },
        data() {
            return {
                invoiceId: '',
                paymentMode: '',
                invoiceTotal: '',
                filtering: {
                    statuses: [], 
                    statusSelected: null,
                    invoiceNumber: null,
                    id: null,
                    dates: [],
                    processTypes: [],
                    processTypeSelected: null,
                    processNames: [],
                    processNameSelected: null,
                    entityTypes: [],
                    entityTypeSelected: null,
                    companyResults: [],
                    companyResultsFiltered: [],
                    companySelectedID: null,
                    companySelectedName: '',
                },
                sorting: {
                    key: 'invoiceDate',
                    order: 'desc'
                },
                pagination: {
                    perPage: 10,
                    page: 1,
                    total: 0
                },
                warningModal: {
                    visible: false,
                    buttons: {
                        ok: true,
                        confirm: false,
                        cancel: false
                    }
                },
                paymentModal: {
                    visible: false,
                    buttons: {
                        ok: true,
                        pay: true,
                    }
                },
                paymentMethods: [
                    {
                        label: 'Wallet',
                        value: 1
                    },
                    {
                        label: 'Credit/Debit card',
                        value: 2
                    }
                ],
                invoices: [],
                tableData: [],
                config,
                selectedRows: [],
                annualInvoiceId: null,
                selectAll: false,
                rodInvoiceId: null,
            }
        },
        created() {
          this.getFilterValues();
          
        },
        watch: { 
            'filtering.processTypeSelected': function (newValue) {
                if (newValue) {
                    this.showLoader();
                    getProcesses(newValue).then(res => {
                        this.hideLoader();
                        this.filtering.processNames = res.data
                    }).catch(this.hideLoader)
                }
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            },
            renewalData() {
                return this.$store.state.user.renewalData;
            },
            checkAnnual() {
                return this.$store.state.user.checkAnnual;
            },
            rodInvoice() {
                return this.$store.state.user.rodInvoice;
            },
            checkRod() {
                return this.$store.state.user.checkRod;
            }
        },
        methods: {
            exportInvoices() {
                const data = {
                    invoices: this.invoices,
                    dates: this.filtering.dates
                };
                exportInvoices(data).then(this.handleExportResponse)
            },
            handleExportResponse(response) {
                window.open(response.data.url,'_blank');
            },
            getFilterValues() {
                this.showLoader();
                Promise.all([
                    getInvoiceStatus(),
                    // getProcessTypes(),
                    // getEntityType(),
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.filtering.statuses = response[0].data; 
                // this.filtering.processTypes = response[1].data; 
                // this.filtering.entityTypes = response[2].data; 
                this.filtering.statusSelected = 500;
                if(this.checkAnnual === true){
                    this.generateRenewalInvoices();
                }
                else if(this.checkRod === true){
                    this.rodInvoiceId = this.rodInvoice.invoice_id.toString();
                    this.getDataByFilter();
                    this.$store.commit('setRodInvoice',[]);
                    this.$store.commit('setCheckRod',false);
                } 
                else{
                    this.getDataByFilter();

                }
            },
            generateRenewalInvoices(){
                generateAnnualRenewalInvoice({process_id: ANNUAL_RENEWAL,reference_id: this.renewalData[0].AnnualRenewalRequest_id}).then(
                    res => {
                        var data = res.data;
                        var dataArr = data.split(',');
                        this.annualInvoiceId = data;
                        this.getDataByFilter();
                        this.$store.commit('setRenewalData',[]);
                        this.$store.commit('setCheckAnnual',false);
                    }
                )
            },
            selectCompany(name) {
                this.filtering.companySelectedID = this.filtering.companyResultsFiltered.find(item => item.Name === name).id;
            },
            searchCompany(value) {
                if (value.length > 2) {
                    this.filtering.companyResultsFiltered = this.filtering.companyResults.filter(item => {
                        return item.Name.toLowerCase().includes(value.toLowerCase());
                    })
                } else {
                    this.filtering.companyResultsFiltered = []
                }
            },
            checkEmpty(value){
                if(value == ''){
                    this.filtering.companySelectedID = ''
                    this.filtering.companySelectedName = ''
                }
            },
            sortChange(data) {
                this.sorting.key = data.key;
                this.sorting.order = data.order;
                this.getDataByFilter()
            },
            pageChange(page) {
                this.pagination.page = page;
                this.getDataByFilter()
            },
            selectChange(data) {
                this.selectedRows = data;
            },
            search(){
                this.pagination.page = 1;
                this.getDataByFilter()
            },
            getDataByFilter() {
                this.showLoader();
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;
                const filters = {};
                if(this.annualInvoiceId !== null){
                    filters.invoiceIdString = this.annualInvoiceId;
                }
                if(this.rodInvoiceId !== null){
                    filters.invoiceIdString = this.rodInvoiceId;
                }
                filters.InvoiceNumber = this.filtering.invoiceNumber;
                filters.status_id = this.filtering.statusSelected;  
                filters.entityType = this.filtering.entityTypeSelected;
                filters.process_id = this.filtering.processNameSelected;
                filters.company_id = this.filtering.companySelectedID;
                filters.CompanyName = this.filtering.companySelectedName;
                filters.processtype_id = this.filtering.processTypeSelected;
                
                filters.DateFrom = this.filtering.dates[0];
                filters.DateTo = this.filtering.dates[1];
            
                const data = {
                    user_id: this.userData.user_id,
                    filterjson: {
                        filter: [filters],
                        sort: [{ key, order }],
                        paging: [
                            {
                                startindex: perPage * (page - 1) + 1,
                                pagesize: perPage
                            }
                        ]
                    }
                };
                getInvoiceList(data)
                    .then(this.handleResponse)
                    .catch(this.handleError)
            },
            handleResponse(response) {
                this.hideLoader();
                this.invoices = response.data[0];
                this.pagination.total = response.NumberOfRecords;
                if(this.annualInvoiceId !== null){ 
                    this.selectAll = true;
                }
            },
            showWarningModal(value) {
                this.warningModal.visible = value;
            },
            showpaymentModal(value) {
                this.paymentModal.visible = value;
            },
            validateSelectedLength(value) {
                if (this.selectedRows.length === value) {
                    return true;
                }
                if (this.selectedRows.length === 0) {
                    this.warningModal.message = 'Select at least one row!';
                    this.showWarningModal(true);
                    return false
                }
                if (value === 1 && this.selectedRows.length !== 1) {
                    this.warningModal.message = 'Select one row please.';
                    this.showWarningModal(true);
                    return false
                }
                return true;
            },
            render() {
                if( this.selectedRows.length <= 1){
                    if (this.validateSelectedLength(1)) {
                        if(this.selectedRows[0].StatusDescription === 'Pending Payment'){
                            let id = this.selectedRows[0].id; // allow only the first row
                            this.$router.push({ path: `/invoice/${id}` })
                        }else{
                            this.warningModal.message = 'The selected invoices have already been paid.';
                            this.showWarningModal(true);
                        }
                    }
                }
                else{
                    if (this.validateSelectedLength()) {
                        
                        if(this.selectedRows[0].StatusDescription === 'Pending Payment'){
                            const data = this.selectedRows.map(row => row.id).join(',');
                            fetchMultipleInvoice({invoice_idstring: data}).then(
                                res=>{
                                    this.$store.commit('setMultiplePayment',res.data)
                                    this.$store.commit('setMultiIdString',data);
                                    // this.$router.push({ name: 'MultiplePayment',query:{ids:data} })
                                    this.$router.push(`/invoice/${data}/multiplePayment`)
                                }
                            )
                        }else{
                            this.warningModal.message = 'The selected invoices have already been paid.';
                            this.showWarningModal(true);
                        }
                    }
                }
            },
            
            fetchMultiple(){
                if (this.validateSelectedLength()) {
                    const data = this.selectedRows.map(row => row.id).join(', ');
                    fetchMultipleInvoice({invoice_idstring: data}).then(
                        res=>{
                            this.$store.commit('setMultiplePayment',res.data[0])
                            this.$store.commit('setMultiIdString',data);
                            // this.$router.push({ name: 'MultiplePayment',query:{ids:data} })
                            this.$router.push(`/invoice/${data}/multiplePayment`)
                        }
                    )
                }
            },
            view() {
                if (this.validateSelectedLength(1)) {
                    let data = this.selectedRows[0];
                    this.invoiceId = data.id;
                    if( data.DocumentPath != '' && data.DocumentPath != null ){
                        window.open(data.DocumentPath, "_blank");
                    }else{
                        this.warningModal.message = 'No attachment found for this Invoice.';
                        this.showWarningModal(true);
                        return false;
                    }
                }
            },
            receipt(){
                if (this.validateSelectedLength(1)) {
                    let data = this.selectedRows[0];
                    this.invoiceId = data.id;
                    if (data.StatusDescription == 'Pending Payment') {
                        this.warningModal.message = 'This invoice has not been paid';
                        this.showWarningModal(true);
                        return false;
                    } else {
                        fetchReceiptByInvoiceId({invoice_id: data.id}).then(
                        res=>{
                            window.open(res.data,'_blank');
                        }
                    )
                    }
                }
            },
            payHandler() {
                const data = {
                    invoice_idstring: this.invoiceId,
                    paymentmode: this.paymentMode,
                    FSATransReference: 'referencecheck'
                };
                updateInvoice(data).then( 
                    this.showpaymentModal(false),
                    this.getDataByFilter() 
                );
            },
            handleinvoiceResponse(response){
                this.invoiceTotal = response.data[0].InvoiceDetail.Total;
                this.showpaymentModal(true);
            }
        }
    }
</script>

<style lang="scss" module>

    .progress {
        margin: 0 20px;
        progress {
            width: 100%;
        }
    }

    
    .filter {
        margin: -10px 0 25px;
        display: flex;
        align-items: flex-end;
    }

    .filterItem {
        flex: 0 0 180px;
        margin-right: 20px;
    }

    .popupRow {
        padding: 5px 0 15px;
    }
    .preview{
        width: 1000px !important;
    }
</style>
