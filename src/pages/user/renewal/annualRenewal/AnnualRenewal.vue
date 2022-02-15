<template>
    <FormWrapper>
        <PageTitle title="Annual Renewal - Delinquent List" slot="title" link="/help/107" />
        <div v-if="$route.name == 'AnnualRenewal'">
            <div :class="$style.filter">
                <div :class="$style.filterItem">
                    <FormSelect :width="100" label="Entity Type" :items="entityTypes" item-name="Name" item-value="Name" v-model="filtering.EntityType"  />
                </div>
                <div :class="$style.filterItem">
                    <RadioGroup v-model="filtering.dateRadio">
                        <Radio label="Next Week">
                            Next Week
                        </Radio>
                        <Radio label="Next Month">
                            Next Month
                        </Radio>
                        <Radio label="Next Three Month">
                            Next Three Month
                        </Radio>
                        <Radio label="Custom">
                            Select Date Range
                        </Radio>
                        <Radio label="Pending Renewal">
                            Pending Renewal
                        </Radio>
                        <Radio label="Manual">
                            Manual
                        </Radio>
                    </RadioGroup>
                </div>
                <div :class="$style.filterItem" v-if="filtering.dateRadio === 'Custom'">
                    <InputDate style="width: 200px" label="Select Date range" type="daterange" v-model="filtering.dates" />
                </div>
            <!-- </div>
            <div :class="$style.filter"> -->
                <div :class="$style.filterItem">
                    <InputText  label="Company Name " v-model="filtering.companyName"  />

                </div>
                <FormButton style="margin-top: 5px" type="primary" @click="search" :rounded="true">
                    <Icon type="ios-search" />
                </FormButton>
            </div>
            

            <FormRow>
                <div class="row">
                    <div class="col-sm-10" >
                        <FormRow v-if="filtering.dateRadio === 'Manual'">
                            <div class="col-sm-2">
                                <InputText rules="required" noApostrophe label="Reg #"  v-model="company.CompanyRegNo" @keyup.native="searchByRegNo" @focusout="searchByRegNoTab" />
                            </div>
                            <div class="col-sm-6">
                                <FormAutoComplete
                                    label="Name"
                                    rules="required"
                                    v-model="company.Name"
                                    :onChange="onSearchName"
                                    :items="companies"
                                    item-value="Name"
                                    item-name="Name"
                                    :onSelect="onSelectCompanyByName" />
                            </div>
                            <div :class="$style.error" v-if="customErrors.notSelectedError">
                                Please Select a valid company before proceeding
                            </div>
                            <div class="col-sm-2">
                                <FormButton  @click="addToTable()" >Add</FormButton>
                            </div>
                        </FormRow>
                    </div>
                    <div class="col-sm-2 " :class="$style.rightAlign">
                        <FormSelect :width="100" label="Paging" :items="pagingItems" item-name="value" item-value="value" v-model="pagination.perPage" :clearable="false" />
                    </div>
                </div>
            </FormRow>
            <DataTable :actions="true"
                :data="modifiedList"
                :columns="config"
                @on-selection-change="selectChange"
                @on-page-change="pageChange"
                :pagination="pagination"
                @on-sort-change="sortChange">
                
                <template slot="actionsLeft">
                    <TableButton @click="renewPage()">
                        <img src="../../../../assets/images/plus.png" alt="">
                        View List
                    </TableButton>
                    <TableButton @click="addToList()">
                        <img src="../../../../assets/images/plus.png" alt="">
                        Add To List
                    </TableButton>
                </template>
            </DataTable>
        </div>

        <!-- second page -->
        <div v-if="$route.name == 'AnnualRenewalList'">
            <DataTable :actions="true"
                :data="selectedList"
                :columns="config"
                @on-selection-change="selectChangeNew"
            >
                
                <template slot="actionsLeft">
                    <TableButton @click="generateRenew()">
                        <img src="../../../../assets/images/plus.png" alt="">
                        Renew
                    </TableButton>
                    <TableButton @click="deleteCompany()">
                        <img src="../../../../assets/images/delete.png" alt="">
                        Delete
                    </TableButton>
                </template>
            </DataTable>
            <br />
            <ButtonGroup >
                <FormButton @click="previous">Previous</FormButton>
            </ButtonGroup>
        </div>
        
        <Toast v-model="toastVisible">Added to List</Toast>

        <!-- message popups -->
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
                <FormButton type="primary"  @click="backToList">Back To List</FormButton>
            </ButtonGroup>
        </Popup>
    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import { fetchDelinquentList, getEntityType, annualRenewalRequest, generateProcessTicket } from './api';
    import { getCompany } from 'Components/companySearch/api';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    import config from './table';
    import InputDate from 'Components/form/InputDate';
    import { RadioGroup, Radio } from 'view-design'
    import { ANNUAL_RENEWAL } from 'Config/processIds';
    import FormAutoComplete from 'Components/form/FormAutoComplete';

    export default {
        name: 'AnnualRenewal',
        components:{
            FormWrapper,
            DataTable,
            PageTitle,
            InputDate,
            RadioGroup,
            Radio,
            FormAutoComplete
        },
        mixins:[validateSelectedRows],
        data(){
            return{
                ticket: {

                },
                config,
                selectedRows: [],
                selectedRowsNew: [],
                sorting: {
                    key: "RenewalDate",
                    order: "Asc"
                },
                tableData: [],
                pagination: {
                    perPage: null,
                    page: 1,
                    total: 0
                },
                filtering:{
                    // TicketReference: null,
                    // company_id: null,
                    EntityType: '',
                    DateFrom: '',
                    DateTo: '',
                    dates:'',
                    dateRadio:'',
                    companyName: '',
                },
                entityTypes: [],
                pagingItems: [],
                pagingItems1:[
                    {
                        value: 10,
                    },
                    {
                        value: 25,
                    },
                    {
                        value: 50,
                    },
                    {
                        value: 100,
                    },
                    {
                        value: 500,
                    },
                    {
                        value: 800,
                    }
                ],
                selectedList: [],
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
                companies: [],
                company: {
                    EntityType: 'IBC',
                    Name: '',
                    CompanyRegNo: '',
                },
                customErrors: {
                    notSelectedError: false,
                },
                toastVisible: false,
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user;
            },
            modifiedList() {
                const list = this.tableData.filter( item => {
                    const findSelected = this.selectedList.find( val => {
                        return val.company_id === item.company_id
                    })
                    return findSelected == undefined;
                })
                return list.length > 0 ? list : [];
            }
        },
        watch:{
            'company.Name': function(val){
                if(val === ''){
                    this.isSelected = false;
                }
            },
            'company.CompanyRegNo': function(val){
                if(val === '' || val === null || val === undefined){
                    this.isSelected = false;
                }
            },
            'pagination.perPage':function(){
                this.pagination.page = 1;
                this.getDelequentList();
            },
            'filtering.dates': function(val){
                this.filtering.DateFrom = val[0];
                this.filtering.DateTo = val[1];
            },
            'filtering.dateRadio': function(val){
                if(val !== 'Custom' && val !== 'Manual'){
                    var toDate,fromDate,dd,mm,yy,getToDate,month,day,year;
                    dd = new Date().getDate();
                    mm = new Date().getMonth() + 1;
                    yy = new Date().getFullYear();
                    if(dd<10) 
                    {
                        dd='0'+dd;
                    } 

                    if(mm<10) 
                    {
                        mm='0'+mm;
                    } 
                    fromDate = yy+'-'+mm+'-'+dd;
                    // getToDate = new Date(mm+'-'+dd+'-'+yy)
                    getToDate = new Date(yy,mm,dd)
                    if(val === 'Next Week'){
                        toDate = new Date(getToDate.getTime() + 7 * 24 * 60 * 60 * 1000);
                        
                    }
                    if(val === 'Next Month'){
                        toDate = new Date(getToDate.getTime() + 30 * 24 * 60 * 60 * 1000);
                    }
                    if(val === 'Next Three Month'){
                        toDate = new Date(getToDate.getTime() + 90 * 24 * 60 * 60 * 1000);
                    }
                    
                    if(val === 'Pending Renewal'){
                        fromDate = new Date(getToDate.getTime() - 7 * 365  * 24 * 60 * 60 * 1000);
                        toDate = yy+'-'+mm+'-'+dd;
                    }
                    if(val !== 'Pending Renewal'){
                        month = '' + toDate.getMonth();
                        day = '' + toDate.getDate();
                        year = toDate.getFullYear();

                        if (month.length < 2) 
                        {
                            month = '0' + month;
                        }
                        if (day.length < 2) 
                        {
                            day = '0' + day;
                        }
                        toDate = [year, month, day].join('-');
                        this.filtering.DateFrom = fromDate;
                        this.filtering.DateTo = toDate;
                    }
                    else{
                        month = '' + fromDate.getMonth();
                        day = '' + fromDate.getDate();
                        year = fromDate.getFullYear();

                        if (month.length < 2) 
                        {
                            month = '0' + month;
                        }
                        if (day.length < 2) 
                        {
                            day = '0' + day;
                        }
                        fromDate = [year, month, day].join('-');
                        this.filtering.DateFrom = fromDate;
                        this.filtering.DateTo = toDate;
                    }
                }
            }
        },
        created(){
            this.filtering.dateRadio = 'Next Three Month'
            this.fetchEntityType();
        },
        methods:{
            addToTable() {
                if(this.company.id && this.company.id !== null){
                    this.company.company_id = this.company.id;
                    this.tableData = [this.company];
                    this.resetCompany();
                    this.resetCompanies();
                    this.customErrors.notSelectedError = false;
                }
                else{
                    this.customErrors.notSelectedError = true;
                }
            },
            //Company search start

            searchByRegNo(event) {
                if(event.keyCode === 13 || event.keyCode === 9){
                    if (!this.isSelected) {
                        this.searchByRegDefault();
                    }
                }
            },
            searchByRegNoTab() {
                if (!this.isSelected) {
                    this.searchByRegDefault();
                }
            },
            searchByRegDefault(){
                const { CompanyRegNo } = this.company;
                if (CompanyRegNo ) {
                    getCompany({
                        EntityType: this.filtering.EntityType,
                        Name: '',
                        RegNo: CompanyRegNo,
                        process_id: ANNUAL_RENEWAL,
                        ICSP_id: this.userData.icsp_id
                    }).then(res => {
                        if (res.data[0] && res.data[0].length > 0) {
                            this.company = res.data[0][0];
                            this.isSelected = true;
                            
                        }
                    })
                }
            },
            onSelectCompanyByName(value) {
                    this.company = this.companies.find(item => item.Name === value);
                    this.isSelected = true;
                    
            },
            reset() {
                this.resetCompany();
                this.entityTypes = [];
                this.companies = [];
                this.isSelected = false;
            },
            resetCompany() {
                this.company = {
                    Name: '',
                    CompanyRegNo: '',
                };
            },
            validateQuery(value) {
                return value.length >= 3
            },
            resetCompanies() {
                this.companies = [];
            },
            onSearchName(val) {
                if ( this.validateQuery(val) && !this.isSelected ) {
                    this.resetCompanies();
                    this.searchForCompany(val);
                }
                // this.isSelected = false;
            },
            searchForCompany(Name) {
                getCompany({
                    EntityType: this.filtering.EntityType,
                    Name,
                    RegNo: '', 
                    process_id: ANNUAL_RENEWAL,
                    ICSP_id: this.userData.icsp_id
                }).then(res => {
                    this.companies = res.data[0];
                })
            },

            //Company Search end

            backToList() {
                this.$router.push('/annualRenewal');
                this.modals.success.isVisible = false;
                this.filtering.dateRadio = 'Next Three Month'
                this.getDelequentList();
            },
            previous() {
                this.$router.push('/annualRenewal');

            },
            validateSelectedLengthNew(value) {
                if (this.selectedRowsNew.length === value) {
                    return true;
                }
                if (value === 1 && this.selectedRowsNew.length !== 1) {
                    this.warningModal.message = 'Select one row please.';
                    this.showWarningModal(true);
                    return false
                }
                if (this.selectedRowsNew.length === 0) {
                    this.warningModal.message = 'Select at least one row!';
                    this.showWarningModal(true);
                    return false
                }
                return true;
            },
            deleteCompany() {
                if(this.validateSelectedLengthNew()){
                    var selectedForDelete = this.selectedRowsNew.map(function(e) { return e.company_id; })
                    for(var i = 0 ; i < selectedForDelete.length ; i++){
                        var index = this.selectedList.map(function(e) { return e.company_id; }).indexOf(selectedForDelete[i]);
                        this.selectedList.splice(index,1)
                    }
                }
            },
            renewPage() {
                this.$router.push('annualRenewal/List')
            },
            addToList(){
                if (this.validateSelectedLength()) {
                    this.selectedList.push(...this.selectedRows);
                    this.toastVisible = true;
                }
            },
            generateRenew(){
                if (this.validateSelectedLength()) {
                    const data = this.selectedList.map(row => row.company_id).join(', ');
                    annualRenewalRequest({companyIdString: data}).then(
                        res =>{
                            if(res.data[0].reference_id !== 0){
                                const objToSend = {
                                    process_id: ANNUAL_RENEWAL,
                                    reference_id: res.data[0].reference_id
                                }
                                generateProcessTicket(objToSend).then(
                                    response => {
                                        
                                        this.ticket.TicketReference = response.data[0].TicketReference;
                                        this.ticket.Status_id = response.data[0].Status_id;
                                        this.modals.success.step = 1;
                                        this.modals.success.isVisible = true;
                                        this.selectedList = [];
                                        this.selectedRows = [];
                                        this.selectedRowsNew = [];
                                    }
                                )
                            }
                        }
                    )
                }
            },
            fetchEntityType(){
                Promise.all([
                    getEntityType({process_id: ANNUAL_RENEWAL,
                    icsp_id: this.userData.icsp_id})
                ]).then(this.handleFilterSuccess)
            },
            handleFilterSuccess(res){
                this.entityTypes = res[0].data;
                this.filtering.EntityType = 'IBC';
                this.pagination.perPage = 10;
                this.pagingItems = this.pagingItems1;
                // this.getDelequentList();
            },
            
            sortChange(data) {
                this.sorting.key = data.key;
                this.sorting.order = data.order;
                this.getDelequentList()
            },
            pageChange(page) {
                this.pagination.page = page;
                this.getDelequentList()
            },
            selectChange(data) {
                this.selectedRows = data;
            },
            selectChangeNew(data) {
                this.selectedRowsNew = data;
            },
            search(){
                this.pagination.page = 1;
                this.getDelequentList();
            },
            getDelequentList(){
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;
                const { EntityType, DateFrom, DateTo, companyName } = this.filtering;
                const filters = {};
                    filters.EntityType = EntityType;
                    filters.DateTo = DateTo;
                    filters.DateFrom = DateFrom;
                    filters.companyName = companyName;
                const data ={
                    filterjson:{
                        filter:[filters],
                        sort: [{ key, order }],
                        paging: [
                            {
                                startindex: perPage * (page - 1) + 1,
                                pagesize: perPage
                            }
                        ],
                    }
                }
                fetchDelinquentList(data).then(
                    res => {
                        this.tableData = res.data[0];
                        this.pagination.total = res.NumberOfRecords;
                    }
                )
            },

        }

    }
</script>


<style lang="scss" module>

    .rightAlign{
        min-width: 100px;
    }
    .pagination {
        margin: 10px 0 0;
        text-align: right;
        display: flex;
        justify-content: flex-end;
        line-height: 26px;
    }

    .paginationText {
        margin: 0 20px;
    }

    .paginationButton {
        cursor: pointer;
        width: 26px;
        text-align: center;
        transition: background-color .2s ease-in-out,color .2s ease-in-out, box-shadow 200ms ease
    }
    .paginationButton:hover {
        background: #57a3f3;
        color: #fff;
        &:hover {
            box-shadow: 0 5px 11px 0 rgba(0,0,0,.18), 0 4px 15px 0 rgba(0,0,0,.15);
        }
    }

    .filter {
        margin: -10px 0 10px;
    }

    .filterItem {
        display: inline-block;
        margin: 0 15px 15px 0;
    }

    .filterItemCheckbox {
        flex-basis: auto;
        align-self: flex-start;
        margin-top: 13px;
    }

</style>
