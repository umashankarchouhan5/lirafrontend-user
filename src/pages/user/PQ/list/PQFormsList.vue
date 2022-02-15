<template>
    <FormWrapper>
        <PageTitle title="Personal Questionnaire Forms" slot="title" />
        <div :class="$style.filter">
            <div :class="$style.filterItem">
                <InputText label="Search Name" v-model="user" />
            </div>
            <FormButton type="primary" @click="getDataByFilter" :rounded="true">
                <Icon type="ios-search" />
            </FormButton>
        </div>

        <DataTable :actions="true"
                   :data="tableData"
                   :columns="tableConfig"
                  
                   @on-selection-change="selectChange"
                   @on-sort-change="sortChange">
            <template slot="actionsLeft">
                <TableButton v-if="showButtons" @click="addForm">
                    <img src="../../../../assets/images/plus.png" alt="">
                    Add
                </TableButton>
                <TableButton v-if="showButtons" @click="editForm">
                    <img src="../../../../assets/images/edit.png" />
                    Edit
                </TableButton>
                <TableButton v-if="showButtons" @click="associatePopup(true)">
                    <img src="../../../../assets/images/plus.png" alt="">
                    Associate
                </TableButton>
            </template>
        </DataTable>
        <Popup :value="associateModal.visible" @close="associatePopup(false)" type="info" :title="pqAuth.title">
            <h5>{{pqAuth.message}}</h5>
            
            <br />
            <PQPassword v-if="associateModal.visible" @forgotClicked="onForgot" @resetScreen="onResetScreen" @pqValidation="associateForm" :closePopup="true" @closeModal="associatePopup(false)" />
        </Popup>
        <Popup :value="isModalVisible" @close="hideModal" type="info" title="Information">
            Select one row!
            <FormButton slot="footer" @click="hideModal">Ok</FormButton>
        </Popup>
    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable'
    import { getList, associateFreePQ } from './config/api'
    import moment from 'moment'
    import statuses from './config/statuses';
    import { tableConfigNew } from './config/table'
    import PQPassword from 'Components/pqPassword';


    export default {
        name: "PQFormsList",
        components: {
            FormWrapper,
            DataTable,
            PageTitle,
            PQPassword
        },
        data() {
            return {
                selectedPQID: null,
                successPopup: {
                    isVisible: false,
                },
                errorPopup: {
                    isVisible: false,
                },
                isLoading: false,
                isModalVisible: false,
                statuses: Object.keys(statuses).map(item => (
                    {
                        value: statuses[item].value,
                        text: statuses[item].text
                    }
                )),
                selectedStatus: statuses.pending.value,
                dates: [moment().format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")],
                sorting: {
                    key: "statusdate",
                    order: "Desc"
                },
                tableConfig: tableConfigNew,
                selectedRows: [],
                user: '',
                users: [],
                tableData: [],
                isUserSearching: false,
                pagination: {
                    perPage: 10,
                    page: 1,
                    total: 0
                },
                associateData : {
                    PQID: '',
                    passportNo: '',
                    password: '',
                },
                associateModal: {
                    visible: false,
                    message: ''
                },
                pqAuth:  {
                    title: 'Associated PQ',
                    message: 'Please add the details of the person you wish to associate.',
                },
                oldValues: {
                    title: 'Associated PQ',
                    message: 'Please add the details of the person you wish to associate.',
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
            this.getDataByFilter();
        },
        computed: {
            showButtons() {
                return this.selectedStatus === statuses.pending.value
            },
        },
        methods: {
            onResetScreen(){
                this.pqAuth.title = this.oldValues.title;
                this.pqAuth.message = this.oldValues.message;
            },
            onForgot(value){
                this.pqAuth.title = value.title;
                this.pqAuth.message = value.message;
            },
            associatePopup(val){
                this.associateModal.visible = val;
                this.resetAssociate();
            },
            resetAssociate(){
                this.associateData = {
                    PQID: '',
                    passportNo: '',
                    password: '',
                }
            },
            associateForm(val){
                const data = {
                    pq_id: val.pq_id
                }
                associateFreePQ(data).then(
                    res => {
                        this.associateModal.visible = false;
                        this.resetAssociate();
                        this.getDataByFilter();
                    }
                )
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
                        Name: this.user,
                        // status: this.selectedStatus,
                        // start_date: this.dates[0],
                        // end_date: this.dates[1]
                    }],
                    sort: [{ key, order }],
                    paging: [
                        {
                            startindex: perPage * (page - 1) + 1,
                            pagesize: perPage
                        }
                    ]
                };
                getList({filterjson: data})
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
            editForm() {
                if (this.validateSelectedLength()) {
                    let formId = this.selectedRows[0].pq_id;
                    this.$router.push({path: `/pq-forms/${formId}`})
                }
            },
            addForm() {
                this.$router.push({path: '/pq-forms/check'})
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
        margin: -10px 0 25px;
        display: flex;
        align-items: flex-end;
    }

    .filterItem {
        flex: 0 0 180px;
        margin-right: 20px;
    }

</style>
