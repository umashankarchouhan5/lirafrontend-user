<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="CSL" slot="title" link="/help/345" />
        <div :class="$style.filter">
            <div :class="$style.filterItem">
                <FormSelect label="Select status" :width="200" :items="filtering.statuses" item-name="name" item-value="id" v-model="filtering.statusSelected" />
            </div>
            <div :class="$style.filterItem">
                <InputText style="width: 200px" label="Company Name"  v-model="filtering.companyName" />
            </div>
            <FormButton style="margin-top: 5px" type="primary" @click="getDataByFilter" :rounded="true">
                <Icon type="ios-search" />
            </FormButton>
        </div>
        <DataTable :actions="true"
                   :data="tasksList"
                   :columns="tableConfig"
                   :is-loading="isLoading"
                   @on-page-change="pageChange"
                   :pagination="pagination"
                   @on-selection-change="selectChange"
                   @on-sort-change="sortChange">
            <template slot="actionsLeft">
                <TableButton @click="addTask">
                    <img src="../../../assets/images/plus.png" alt="">
                    Add
                </TableButton>
                <TableButton @click="editTask">
                    <img src="../../../assets/images/edit.png" alt="">
                    Edit
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

    </FormWrapper>
</template>

<script>

    const DEFAULT_STATUS = 43;
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable'
    import loadingMixin from 'Mixins/loadingMixin'
    import { getStatuses, getFilteredData } from './api'
    import tableConfig from './table'
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    import { PROCESS_ID, REFERENCE_ID } from 'Config/localStorageKeys';
    import { APPLICATION_OF_CSL  } from 'Config/processIds';

    export default {
        name: "TicketsList",
        mixins: [loadingMixin,validateSelectedRows],
        data() {
            return {
                isModalVisible: false,
                filtering: {
                    statuses: [],
                    statusSelected: null,
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
            
        },
        created() {
            this.getFilterValues();
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            },
        },
        components: {
            FormWrapper,
            DataTable,
            PageTitle
        },
        methods: {
            addTask(){
                this.$router.push('/cslForm');
            },
            editTask(){
                 if (this.validateSelectedLength(1)) {
                    const row = this.selectedRows[0];
                    if(row.Status_id === 43){
                        const referenceID = row.reference_id
                        const webTaskId = row.WebUserTask_id
                        this.$router.push({name:'CSLForm',query:{web:webTaskId,task:referenceID}})
                        
                        
                    }else{
                        this.warningModal.message = 'This action cannot be performed on this task';
                        this.showWarningModal(true);
                    }
                }
            },
            deleteTask(){
                if (this.validateSelectedLength(1)) {
                    
                    this.warningModal.message = 'Are you sure you want to delete this record.';
                    this.warningModal.buttons.confirm = true;
                    this.warningModal.buttons.ok = false;
                    this.showWarningModal(true);
                    
                }
            },
            confirmDelete(){
                const row = this.selectedRows[0];
                deleteApi({process_id: APPLICATION_OF_CSL,reference_id: row.reference_id}).then(
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
                    if( row.Status_id === 32 ){
                        this.$store.dispatch('setProcessId', APPLICATION_OF_CSL);
                        this.$store.dispatch('setReferenceId',row.reference_id);
                        this.$router.push({path:`/respond/${row.reference_id}/respond`});
                    }else{
                        this.warningModal.message = 'This action cannot be performed on this task';
                        this.showWarningModal(true);
                    }
                }
            },
            getFilterValues() {
                this.showLoader();
                Promise.all([
                    getStatuses({process_id: APPLICATION_OF_CSL}),
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.filtering.statuses = response[0].data[0];
                this.filtering.statusSelected = DEFAULT_STATUS;
                this.getDataByFilter();
                
            },
            sortChange(data) {
                this.sorting.key = data.key;
                this.sorting.order = data.order;
                this.getDataByFilter()
            },
            getDataByFilter() {
                this.showLoader();
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;

                const filters = {};

                
                filters.status_id = this.filtering.statusSelected;
                // filters.isRFI = this.filtering.isRFI;
                filters.process_id = APPLICATION_OF_CSL;
                // filters.companyname = this.filtering.companyName;
                // filters.processtype_id = this.filtering.processTypeSelected;
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
            },
            pageChange(page) {
                this.pagination.page = page;
                this.getDataByFilter()
            },
            handleResponse(response) {
                this.hideLoader();
                this.tasksList = response.data[0];
                this.pagination.total = response.NumberOfRecords;
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
