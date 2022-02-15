<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="My Tasks" slot="title" link="/help/53" />
        <ValidationObserver ref="validator" >
            <div :class="$style.filter">
                <div :class="$style.filterItem">
                    <FormSelect label="Select status" :width="200" :items="filtering.statuses" item-name="name" item-value="id" v-model="filtering.statusSelected" />
                </div>
                <div :class="$style.filterItem">
                    <FormSelect :width="100" label="Entity Type" :items="filtering.entityTypes" item-name="Name" item-value="Name" v-model="filtering.entityTypeSelected"  />
                </div>
                
                <div :class="$style.filterItem">
                    <FormSelect :width="200" label="Process" :items="filtering.processTypes" item-name="Name" item-value="id" v-model="filtering.processTypeSelected" />
                </div>
                <div :class="$style.filterItem" v-if="filtering.processTypeSelected">
                    <FormSelect :width="200" label="SubProcess" :items="filtering.processNames" item-name="Name" item-value="id" v-model="filtering.processNameSelected" />
                </div>
                <br>
                <div :class="$style.filterItem">
                    <InputText v-model="filtering.ticketReference" style="width: 200px" label="Reference #" rules="alphaNumCustom" />
                </div>
                <div :class="$style.filterItem">
                    <InputDate style="width: 200px" label="Select Date Range" type="daterange" v-model="filtering.dates" />
                </div>
                <div :class="$style.filterItem">
                    <InputText style="width: 200px" label="Company Name"  v-model="filtering.companyName" />
                </div>
                <FormButton style="margin-top: 5px" type="primary" @click="getDataByFilter" :rounded="true">
                    <Icon type="ios-search" />
                </FormButton>
            </div>
        </ValidationObserver>
        <br />
        <DataTable :actions="true"
                   :data="tasksList"
                   :columns="tableConfig"
                   :is-loading="isLoading"
                   @on-page-change="pageChange"
                   :pagination="pagination"
                   @on-selection-change="selectChange"
                   @on-sort-change="sortChange">
            <template slot="actionsLeft">
                <TableButton @click="editTask">
                    <img src="../../../assets/images/edit.png" alt="">
                    Edit
                </TableButton>
                <TableButton @click="deleteTask">
                    <img src="../../../assets/images/del.png" alt="">
                    Delete
                </TableButton>
                <TableButton @click="respond" >
                    <img src="../../../assets/images/renewal.png" alt="">
                    Respond
                </TableButton>
            </template>
        </DataTable>
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

        <!-- <Popup title="Information" :value="deleteModal.visible" @close="() => showDeleteModal(false)">
            {{ deleteModal.message }}
            <div slot="footer">
                <FormButton v-if="warningModal.buttons.cancel" @click="() => showDeleteModal(false)">Cancel
                </FormButton>
                <FormButton v-if="warningModal.buttons.confirm" type="success" @click="confirmDelete">Confirm
                </FormButton>
            </div>
        </Popup> -->
    </FormWrapper>
</template>

<script>

    const DEFAULT_STATUS = 43;
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable'
    import loadingMixin from 'Mixins/loadingMixin'
    import { getStatuses, getProcessTypes, getEntityType, getProcesses, getFilteredData, deleteApi } from './config/api'
    import tableConfig from './config/table'
    import InputDate from 'Components/form/InputDate';
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    import { PROCESS_ID, REFERENCE_ID } from 'Config/localStorageKeys';
    import { ValidationObserver } from 'vee-validate'

    export default {
        name: "TicketsList",
        mixins: [loadingMixin,validateSelectedRows],
        components: {
            InputDate,
            FormWrapper,
            DataTable,
            PageTitle,
            ValidationObserver
        },
        data() {
            return {
                isModalVisible: false,
                filtering: {
                    statuses: [],
                    statusSelected: null,
                    entityTypes: [],
                    entityTypeSelected: null,
                    ticketReference: '',
                    processTypes: [],
                    processTypeSelected: null,
                    processNames: [],
                    processNameSelected: null,
                    dates: '',
                    isRFI: false,
                    companyName: '',
                    
                },
                sorting: {
                    key: 'id',
                    order: 'desc'
                },
                pagination: {
                    perPage: 10,
                    page: 1,
                    total: 0
                },
                tableConfig,
                tableData: [],
                tasksList: [],
                selectedRows: [],
            }
        },
        watch: {
            '$route': function (to,from) {
                this.parseUrlForValues();
                this.getDataByFilter();
                if(to.name === this.$route.name && this.TicketRef){
                    this.getDataByFilter();
                }
            },
            'filtering.processTypeSelected': function (newValue) {
                if (newValue) {
                    this.showLoader();
                    getProcesses(newValue).then(res => {
                        this.hideLoader();
                        this.filtering.processNames = res.data
                        if(this.TicketRef !== null){
                            this.filtering.notifProcess_id = this.notifProcess_id;
                        }
                    }).catch(this.hideLoader)
                }
            }
        },
        created() {
            this.getFilterValues();
            this.parseUrlForValues();
            if(this.$route.query.TicketReference){
                this.filtering.ticketReference = this.$route.query.TicketReference;
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            },
            TicketRef() {
                return this.$store.state.notification.TicketRef;
            },
            notifProcessType(){
                return this.$store.state.notification.parent_id;
            },
            notifProcess_id(){
                return this.$store.state.notification.process_id;
            },
            menu() {
                return this.$store.state.menu.menu
            },
        },
        methods: {
            editTask(){
                 if (this.validateSelectedLength(1)) {
                    const row = this.selectedRows[0];
                    if(row.Status_id === 43){
                        const processID = row.Process_id;
                        const referenceID = row.reference_id
                        this.$store.dispatch('setProcessId', processID);
                        this.$store.dispatch('setReferenceId',referenceID);
                        var parentMenu = this.menu.find( item => {
                            return item.id === row.ProcessType_id;
                        })
                        if(processID === 109 || processID === 300 || processID === 301 || processID === 302 || processID === 303 || processID === 304 || processID === 305 || processID === 307 || processID === 309 || processID === 310 || processID === 311 || processID === 602 || processID === 603){
                            var subMenu = parentMenu.submenu.find( item => {
                                return item.process_id === 300;
                            })
                        }else{
                            var subMenu = parentMenu.submenu.find( item => {
                                return item.process_id === processID;
                            })
                        }
                        if(processID === 109 || processID === 300 || processID === 301 || processID === 302 || processID === 303 || processID === 304 || processID === 305 || processID === 307 || processID === 309 || processID === 310 || processID === 311 || processID === 602 || processID === 603){
                            sessionStorage.setItem(PROCESS_ID, processID);
                            sessionStorage.setItem(REFERENCE_ID, referenceID);
                            // this.$router.push({path:`${subMenu.URL}/${referenceID}`});
                            this.$router.push({ name: 'changes_edit'})
                        }
                        else if(processID === 702){
                            let formId = row.pq_id;
                            this.$router.push({path: `/pq-forms/${formId}`})
                        }
                        else{
                            if( subMenu.URL.path){
                                this.$router.push({path:`${subMenu.URL.path}/${referenceID}`});

                            }else{
                                this.$router.push({path:`${subMenu.URL}/${referenceID}`});
                            }

                        }
                    }else{
                        this.warningModal.message = 'This action cannot be performed on this task';
                        this.showWarningModal(true);
                    }
                }
            },
            deleteTask(){
                if (this.validateSelectedLength(1)) {
                    
                    const row = this.selectedRows[0];
                    if( row.Status_id === 43 ){
                        this.warningModal.message = 'Are you sure you want to delete this record.';
                        this.warningModal.buttons.confirm = true;
                        this.warningModal.buttons.ok = false;
                        this.showWarningModal(true);
                    }else{
                        this.warningModal.message = 'This action cannot be performed on this task';
                        this.showWarningModal(true);
                    }
                    
                }
            },
            confirmDelete(){
                const row = this.selectedRows[0];
                deleteApi({process_id: row.Process_id,reference_id: row.reference_id}).then(
                    res => {
                        this.warningModal.buttons.confirm = false;
                        this.warningModal.buttons.ok = true;
                        this.showWarningModal(false);
                         this.warningModal.message = 'The record has been deleted successfully.';
                        this.showWarningModal(true);
                        this.getDataByFilter();
                    }
                )
            },
            selectChange(data) {
                this.selectedRows = data;
            },
            respond(){
                if (this.validateSelectedLength(1)) {
                    const row = this.selectedRows[0];
                    if( row.Status_id === 32 && row.Process_id !== 101){
                        this.$store.dispatch('setProcessId', row.Process_id);
                        this.$store.dispatch('setReferenceId',row.reference_id);
                        this.$router.push({path:`/respond/${row.reference_id}/respond`});
                    }
                    else if(row.Status_id === 32 && row.Process_id == 101){
                        this.$store.dispatch('setProcessId', row.Process_id);
                        this.$store.dispatch('setReferenceId',row.reference_id);
                        // this.$router.push({path:`/submissions?status_id=32`});
                        this.$router.push({name:`submissionsRespond`,params: {TicketReference:row.TicketReference}});

                    }
                    else{
                        this.warningModal.message = 'This action cannot be performed on this task';
                        this.showWarningModal(true);
                    }
                }
            },
            parseUrlForValues() {
                const mapping = {
                    process_type: 'processTypeSelected',
                    process_id: 'processNameSelected'
                };
                const { query } = this.$route;
                Object.keys(query).forEach(item => {
                    if (query[item] && mapping[item]) {
                        this.filtering[mapping[item]] = +query[item]
                    }
                })
            },
            selectICSP(name) {
                this.filtering.ICSPSelectedID = this.filtering.ICSPResultsFiltered.find(item => item.name === name).id;
            },
            searchICSP(value) {
                if (value.length > 2) {
                    this.filtering.ICSPResultsFiltered = this.filtering.ICSPResults.filter(item => {
                        return item.name.toLowerCase().includes(value.toLowerCase());
                    })
                } else {
                    this.filtering.ICSPResultsFiltered = []
                }
            },
            getFilterValues() {
                this.showLoader();
                Promise.all([
                    getStatuses(),
                    getEntityType(),
                    getProcessTypes()
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.filtering.statuses = response[0].data[0];
                this.filtering.entityTypes = response[1].data;
                this.filtering.processTypes = response[2].data;
                this.filtering.statusSelected = DEFAULT_STATUS;
                this.getDataByFilter();
                
            },
            sortChange(data) {
                this.sorting.key = data.key;
                this.sorting.order = data.order;
                this.getDataByFilter()
            },
            getDataByFilter() {
                this.$refs.validator.validate().then((res) => {
                    if (res ) {
                        this.showLoader();
                        const { key, order } = this.sorting;
                        const { perPage, page } = this.pagination;

                        const filters = {};

                        // Ignore other filters if we have ticket reference
                        
                        if(this.TicketRef === null){
                            if (this.filtering.ticketReference) {
                                filters.TicketReference = this.filtering.ticketReference
                            } else {
                                filters.status_id = this.filtering.statusSelected;
                                filters.DateFrom = this.filtering.dates[0];
                                filters.DateTo = this.filtering.dates[1];
                                filters.isRFI = this.filtering.isRFI;
                                filters.process_id = this.filtering.processNameSelected;
                                filters.companyname = this.filtering.companyName;
                                filters.entityType = this.filtering.entityTypeSelected;
                                filters.processtype_id = this.filtering.processTypeSelected;
                                if(this.$route.query.TicketReference){
                                   this.$router.replace({'query': null});
                                }
                            }
                        }else{
                            filters.TicketReference = this.TicketRef;
                            this.filtering.ticketReference = this.TicketRef
                            this.filtering.processTypeSelected = this.notifProcessType;
                        }
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
                        getFilteredData(data).then(this.handleResponse).catch(this.handleError)
                    }
                })
            },
            pageChange(page) {
                this.pagination.page = page;
                this.getDataByFilter()
            },
            handleResponse(response) {
                this.hideLoader();
                this.tasksList = response.data[0];
                this.pagination.total = response.NumberOfRecords;
                if(this.TicketRef !== null){
                    this.$store.dispatch('setTicketReference',null);
                }
            },
        }
    }
</script>

<style lang="scss" module>


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
