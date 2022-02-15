<template>
    <FormWrapper>
        <PageTitle title="Fit & Proper Assessment" slot="title" />
        <div :class="$style.filter">
            <div :class="$style.filterItem">
                <FormSelect label="Select status" :width="200" :items="filtering.statuses" item-name="name" item-value="id" v-model="filtering.statusSelected" />
            </div>
            <div :class="$style.filterItem">
                <InputText v-model="filtering.LastName" style="width: 200px" label="Last Name" />
            </div>
            <div :class="$style.filterItem">
                <InputText style="width: 200px" label="PQ ID"  v-model="filtering.PQID" />
            </div>
            <div :class="$style.filterItem">
                <!-- <InputText style="width: 200px" label="Position"  v-model="filtering.Position" /> -->
            </div>
            <FormButton style="margin-top: 5px" type="primary" @click="getDataByFilter" :rounded="true">
                <Icon type="ios-search" />
            </FormButton>
        </div>
        <DataTable :actions="true"
                   :data="tableData"
                   :columns="tableConfig"
                   @on-page-change="pageChange"
                   :pagination="pagination"
                   @on-selection-change="selectChange"
                   @on-sort-change="sortChange">
            <template slot="actionsLeft">
                <TableButton @click="fitAndAssessment">
                    <img src="../../../../assets/images/plus.png" alt="">
                    Add
                </TableButton>
                <!-- <TableButton @click="() => {}">
                    <img src="../../../../assets/images/renewal.png" />
                    Respond
                </TableButton> -->
            </template>
        </DataTable>

        <Popup :value="isModalVisible" @close="hideModal" type="error" title="Error!">
            Select one row!
            <FormButton slot="footer" @click="hideModal">Ok</FormButton>
        </Popup>

        <Popup :value="errorPopup.isVisible" @close="() => errorPopup.isVisible = false" title="Error!">
            This form is incomplete. Please fill the whole form first.
            <FormButton slot="footer" @click="() => errorPopup.isVisible = false">Ok</FormButton>
        </Popup>

        <Popup :value="successPopup.isVisible" @close="() => successPopup.isVisible = false" title="Success" type="success">
            <p>Your request has been submitted successfully.</p>
            <p>Your request # for future reference is <strong>{{ ticketReference }}</strong>.</p>
            <FormButton slot="footer" @click="() => successPopup.isVisible = false">Ok</FormButton>
        </Popup>

        <AssessmentModal :is-visible="isAssessmentModalVisible"
                         @onTicketReference="setTicketReference"
                         @onClose="isAssessmentModalVisible = false" />
    </FormWrapper>
</template>

<script>
    
    const DEFAULT_STATUS = 34;
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable'
    import AssessmentModal from './components/AssessmentModal'
    import { getList,getFilteredData, getStatuses } from './config/api'
    import moment from 'moment'
    import statuses from './config/statuses';
    import tableConfig from './config/table'
    import { PQ_PROCESS_ID } from 'Config/processIds'
    import loadingMixin from 'Mixins/loadingMixin'


    export default {
        name: "FitAndAssessmentList",
        mixins:[loadingMixin],
        data() {

            return {
                isAssessmentModalVisible: false,
                selectedPQID: null,
                successPopup: {
                    isVisible: false,
                },
                errorPopup: {
                    isVisible: false,
                },
                ticketReference: null,
                isLoading: false,
                isModalVisible: false,
                sorting: {
                    key: "statusdate",
                    order: "Desc"
                },
                statuses: Object.keys(statuses).map(item => (
                    {
                        value: statuses[item].value,
                        text: statuses[item].text
                    }
                )),
                selectedStatus: statuses.pending.value,
                dates: [moment().format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")],
                tableConfig,
                selectedRows: [],
                user: null,
                users: [],
                tableData: [],
                isUserSearching: false,
                pagination: {
                    perPage: 10,
                    page: 1,
                    total: 0
                },
                filtering: {
                    statuses: [],
                    statusSelected: null,
                    LastName: '',
                    PQID: '',
                    Position: ''
                },
            }
        },
        watch: {
            options: {
                handler() {
                    this.getDataByFilter()
                        .then(this.handleResponse).catch(this.handleError)
                },
                deep: true,
            },
        },
        created() {
            this.$store.commit('setProcessId', PQ_PROCESS_ID);
            this.getFilterValues();
        },
        components: {
            FormWrapper,
            DataTable,
            PageTitle,
            AssessmentModal
        },
        methods: {
            getFilterValues() {
                this.showLoader();
                Promise.all([
                    getStatuses(),
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.filtering.statuses = response[0].data[0];
                this.filtering.statusSelected = DEFAULT_STATUS;
                this.getDataByFilter();
                
            },
            respondChange() {
                if (this.validateSelectedLength(1) && this.validateCanRespond()) {
                    const { reference_id, process_id } = this.selectedRows[0];
                    sessionStorage.setItem(PROCESS_ID, process_id);
                    sessionStorage.setItem(REFERENCE_ID, reference_id);
                    this.$store.dispatch('setProcessId',process_id)
                    this.$router.push({ path: `/pq-forms-assessment/${reference_id}/respond/${process_id}`})
                }
            },
            validateCanRespond() {
                if (this.selectedRows[0].Status_id !== 32) {
                    this.warningModal.message = 'You can\'t respond to this ticket';
                    this.showWarningModal(true);
                    return false
                }
                return true;
            },
            setTicketReference(data) {
                this.ticketReference = data;
                this.isAssessmentModalVisible = false;
                this.successPopup.isVisible = true;
                this.getDataByFilter();
            },
            fitAndAssessment() {
                this.isAssessmentModalVisible = true;
            },
            sortChange(data) {
                this.sorting.key = data.key;
                this.sorting.order = data.order;
                this.getDataByFilter()
            },
            selectChange(data) {
                this.selectedRows = data;
            },
            getDataByFilter() {
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;
                const data = {
                    filter: [{
                        status_id: this.filtering.statusSelected,
                        // start_date: this.dates[0],
                        // end_date: this.dates[1],
                        LastName: this.filtering.LastName,
                        // Position: this.filtering.Position,
                        PQID: this.filtering.PQID,
                        process_id: PQ_PROCESS_ID
                    }],
                    sort: [{ key, order }],
                    paging: [
                        {
                            startindex: perPage * (page - 1) + 1,
                            pagesize: perPage
                        }
                    ]
                };
                getFilteredData({filterjson: data})
                    .then(this.handleResponse)
                    .catch(this.handleError)
            },
            pageChange(page) {
                this.pagination.page = page;
                this.getDataByFilter()
            },
            handleResponse(response) {
                this.tableData = response.data[0];
                this.pagination.total = response.data[1][0].NumberOfRecords;
            },
            validateSelectedLength() {
                return this.selectedRows.length === 1 || this.showWarning();
            },
            showWarning() {
                this.isModalVisible = true
            },
            hideModal() {
                this.isModalVisible = false
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

</style>
