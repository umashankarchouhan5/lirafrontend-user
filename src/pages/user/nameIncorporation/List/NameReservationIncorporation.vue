<template>
    <FormWrapper>
        <PageTitle title="Name Reservation and Incorporation" slot="title" :link="`/help/${processId}`"/>
        <div :class="$style.filter">
            <div :class="$style.filterItem">
                <FormSelect label="Select Status" :items="statuses" item-name="name" item-value="id" :clearable="false" 
                    v-model="selectedStatus"/>  
            </div>
            <div :class="$style.filterItem">
                <InputText label="Company Name" v-model="CompanyName" />
            </div>
            <FormButton type="primary" @click="getDataByFilter" :rounded="true">
                <Icon type="ios-search" />
            </FormButton>
        </div>
        
        <DataTable :actions="true"
                   :data="tableData"
                   v-if="selectedStatus"
                   :columns="config[selectedTable].columns"
                   @on-selection-change="selectChange"
                   @on-page-change="pageChange"
                   :pagination="pagination"
                   @on-sort-change="sortChange">
            <template slot="actionsLeft">
                <template >
                    <TableButton @click="addNameInc">
                        <img src="../../../../assets/images/plus.png" alt="">
                        Add
                    </TableButton>
                    <TableButton @click="() => editNameInc()" v-if="selectedTable === 43">
                        <img src="../../../../assets/images/edit.png"/>
                        Edit
                    </TableButton>
                    
                </template>
            </template>
        </DataTable>


        <Popup title="Success" type="success" :value="successModal.visible" @close="hideSuccessModal">
            {{ successModal.message }}
            <div slot="footer">
                <FormButton @click="hideSuccessModal">Ok</FormButton>
            </div>
        </Popup>

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

        <Popup title="Comments History" width="700" :value="commentLogModal.visible" @close="closeCommentLogPopup">
            <DataTable :data="commentLogModal.comments"
                       :columns="commentLogModal.columns" />
            <div slot="footer">
                <FormButton @click="closeCommentLogPopup">Close</FormButton>
            </div>
        </Popup>

        <Popup title="Error!" type="error" :value="errorModal.isVisible" @close="closeErrorModal">
            <p>{{ errorModal.message }}</p>
            <div slot="footer">
                <FormButton @click="closeErrorModal">Ok</FormButton>
            </div>
        </Popup>

    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import { NAME_INCORPORATION } from 'Config/processIds';
    import PageTitle from 'Components/layout/PageTitle';
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    import PCWebMixin from 'Mixins/pcWebMixin';
    import DataTable from 'Components/DataTable';
    import UserCell from './components/userCell';
    import Event from 'Utils/event';
    import DateUtil from 'Utils/dateUtil';
    import config from './table'
    import {
        getList, getStatuses,
    } from './api';


    export default {
        name: "NameReservationIncorporation",
        mixins: [ validateSelectedRows, PCWebMixin ],
        components: {
            FormWrapper,
            DataTable,
            PageTitle,
        },
        data() {
            return {
                selectedTable: 34,
                CompanyName: '',
                selectedEntity: null,
                entityTypeList: [],
                entityModal: {
                    isLoading: false,
                    visible: false,
                },
                errorModal: {
                    isVisible: false,
                    message: null,
                    title: null,
                },
                commentLogModal: {
                    visible: false,
                    comments: [],
                    columns: [
                        {
                            title: 'Date',
                            render: (h, params) => {
                                return h('span', DateUtil.formatDateWithTime(params.row.StatusDateTime));
                            },
                            width: 140
                        },
                        {
                            key: 'comments',
                            title: 'Comment'
                        },
                        {
                            title: 'User',
                            render: (h, params) => {
                                return h(UserCell, {
                                    props: {
                                        row: params.row,
                                    }
                                });
                            },
                            width: 100
                        }
                    ]
                },
                uploadModal: {
                    visible: false,
                },
                successModal: {
                    visible: false,
                    message: ''
                },
                statuses: [],
                entities: [],
                selectedStatus: null,
                selectedRows: [],
                sorting: {
                    key: "updated_at",
                    order: "Desc"
                },
                tableData: [],
                config,
                pagination: {
                    perPage: 10,
                    page: 1,
                    total: 0
                },
            }
        },
        created() {
            this.setProcessId();
            this.getData();
            Event.subscribe('showCommentLogPopup', this.showCommentLogPopup);
        },
        watch: {
            '$route': function (to,from) {
                this.parseUrlForValues();
            },
        },
        computed: {
            processId() {
                return this.$store.state.common.currentProcessId;
            },
            userData() {
                return this.$store.state.user.user;
            },
            TicketRef() {
                return this.$store.state.notification.TicketRef;
            }
        },
        methods: {
            addNameInc(){
                if(!this.checkRestricted()){
                    this.$store.dispatch('setProcessId', NAME_INCORPORATION);
                    this.$router.push({name: `NameReservationIncorporationForm`});
                }
                else{
                    this.warningModal.message = "You are restricted to do this action.";
                    this.showWarningModal(true)
                }
            },
            editNameInc(){
                if (this.validateSelectedLength(1)) {
                    if(!this.checkRestricted()){
                        this.$router.push(`/nameReservationIncorporation/${this.selectedRows[0].id}`);
                    }
                    else{
                        this.warningModal.message = "You are restricted to do this action.";
                        this.showWarningModal(true)
                    }
                }

            },
            parseUrlForValues() {
                const { query } = this.$route;
                if (query && query.status_id) {
                    this.selectedStatus = +query.status_id;
                }
            },
            validateBeforeRespond() {
                if (this.validateSelectedLength(1)) {
                    const { ApprovedNameStatus_id } = this.selectedRows[0];
                    const errors = [];
                    if (ApprovedNameStatus_id !== 32) {
                        errors.push('You do not need respond for this ticket')
                    }
                    if (errors.length > 0) {
                        return this.showErrorModal(errors[0])
                    }
                    return true;
                }
            },
            resetPaginationAndSorting(newValue) {
                this.pagination.page = 1;
                this.sorting = this.config[newValue].sorting || {
                    key: "updated_at",
                    order: "Desc"
                };
            },
            closeErrorModal() {
                this.errorModal.isVisible = false;
                this.errorModal.message = '';
                this.errorModal.title = 'Error!';
            },
            showErrorModal(message, title) {
                this.errorModal.isVisible = true;
                this.errorModal.message = message;
                title && (this.errorModal.title = title);
            },
            showCommentLogPopup(comments) {
                this.commentLogModal.visible = true;
                this.commentLogModal.comments = comments;
            },
            closeCommentLogPopup() {
                this.commentLogModal.visible = false;
                this.commentLogModal.comments = [];
            },
            showSuccessModal() {
                this.successModal.visible = true;
            },
            hideSuccessModal() {
                this.successModal.visible = false;
                this.successModal.message = '';
            },

            
            getData() {
                Promise.all([
                    getStatuses({ process_id: this.processId }),
                ]).then(this.getDataSuccess)
            },
            getDataSuccess(response) {
                this.statuses = response[0].data[0];
                this.parseUrlForValues();
                    if (!this.selectedStatus) {
                        this.selectedStatus = this.statuses[0].id;
                    }
                    this.getDataByFilter();
            },
            setProcessId() {
                this.$store.commit('setProcessId', NAME_INCORPORATION)
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
            
            getDataByFilter() {
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;
                const data = {
                    filter: [{
                        status_id: this.selectedStatus,
                        EntityType: 'IBC',
                        CompanyName: this.CompanyName,
                        process_id: this.processId
                    }],
                    sort: [{ key, order }],
                    paging: [
                        {
                            startindex: perPage * (page - 1) + 1,
                            pagesize: perPage
                        }
                    ],
                };
                const { query } = this.$route;
                if(query && query.status_id && query.status_id !== this.selectedStatus){
                    
                    this.$router.replace({'query': {'status_id': this.selectedStatus}}).catch(err => {});
                    this.resetPaginationAndSorting(this.selectedStatus);
                    this.selectedTable = this.selectedStatus;
                }else if(query && !query.status_id ){
                    this.$router.replace({'query': {'status_id': this.selectedStatus}}).catch(err => {});
                    this.resetPaginationAndSorting(this.selectedStatus);
                    this.selectedTable = this.selectedStatus;
                }
                
                getList({ filterjson: data })
                    .then(this.handleResponse)
                    .catch(this.handleError)
            },
            handleResponse(response) {
                this.tableData = response.data[0];
                this.pagination.total = response.data[1][0].NumberOfRecords;
            },

            
            validateDelete() {
                if (this.selectedRows.length === 0) {
                    this.warningModal.message = 'Select at least one row.';
                    this.warningModal.buttons.ok = true;
                    this.warningModal.buttons.confirm = false;
                    this.warningModal.buttons.cancel = false;
                } else {
                    this.warningModal.message = `You are trying to delete ${this.selectedRows.length} row(s). Are you sure?`;
                    this.warningModal.buttons.ok = false;
                    this.warningModal.buttons.confirm = true;
                    this.warningModal.buttons.cancel = true;
                }
                this.showWarningModal(true);
            },
            confirmDelete() {
                const ids = this.selectedRows.map(row => row.id).join(", ");
                deleteEntityByIds({ ids }).then(() => {
                    this.showWarningModal(false);
                    this.getDataByFilter();
                })
            }
        }
    }
</script>

<style lang="scss" module>

    .currentEntityFile {
        display: inline-flex;
        span {
            margin-left: 20px;
            padding: 3px;
            cursor: pointer;
        }
    }

    .bulkFilesError {
        position: absolute;
        z-index: 4;
        bottom: 5px;
        left: 11px;
        font-size: 11px;
        color: #ff3547
    }

    .exampleFile {
        display: inline-block;
        margin-top: 10px;
    }

    .uploadedFiles {
        background: rgb(241, 241, 241);
        height: 200px;
        width: calc(100%/2 - 8px);
        padding: 10px 15px;
        border-radius: 4px;
        overflow: auto;
    }

    .bulkFile {
        display: flex;
        border-bottom: 1px solid darken(rgb(241, 241, 241), 10%);
        align-items: center;
        &:last-child {
            border-bottom: none;
        }
    }

    .removeBulkFile {
        cursor: pointer;
        padding: 3px;
        margin-left: auto;
    }

    .excelFile {
        display: flex;
        padding: 5px 0;
    }

    .excelFileLabel {
        width: 120px;
        flex-shrink: 0;
        flex-grow: 0;
        align-items: center;
        display: flex;
    }

    .excelFileInput {
        flex-grow: 1;
    }

    .progress {
        margin: 0 20px;
        progress {
            width: 100%;
        }
    }

    .upload {
        width: calc(100%/2 - 8px);
        height: 200px;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        &:hover {
            .uploadArea {
                background: darken(#f2f2f2, 5%);
                border: 2px dashed  darken(#e3e3e3, 5%);
            }
        }
        .uploadArea {
            position: absolute;
            pointer-events: none;
            background: #f2f2f2;
            border: 2px dashed #e3e3e3;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1;
            outline: none;
            display: flex;
            align-items: center;
            text-align: center;
            justify-content: center;
        }
        input {
            width: 100%;
            height: 100%;
        }
    }

    .files {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
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
        max-width: 400px;
    }

</style>
