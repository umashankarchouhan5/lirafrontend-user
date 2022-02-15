<template>
    <FormWrapper>
        <PageTitle title="Continuation" slot="title" :link="`/help/${processId}`"/>
        <div :class="$style.filter">
            <div :class="$style.filterItem">
                <FormSelect label="Select Status" :items="statuses" item-name="name" item-value="id" :clearable="true"
                            v-model="selectedStatus"/>
            </div>
            <div :class="$style.filterItem">
                <FormSelect label="Select EntityType" :width="130" :items="entityTypeList" item-name="Name" item-value="id"
                v-model="selectedEntity"/>
            </div>
                <!-- <div class="col-sm-4"> -->
            <div :class="$style.filterItem">
                <InputText label="Search Company" v-model="searchCompany" />
            </div>
            <FormButton type="primary" @click="getDataByFilter" :rounded="true">
                <Icon type="ios-search" />
            </FormButton>
            <!-- </div> -->
        </div>
        
        <DataTable :actions="true"
                   :data="tableData"
                   v-if="respondStatus"
                   :columns="config[respondStatus].columns"
                   @on-selection-change="selectChange"
                   @on-page-change="pageChange"
                   :pagination="pagination"
                   @on-sort-change="sortChange">
            <template slot="actionsLeft">
                <template >
                    <TableButton @click="() => goToTicket(CONTINUATION_PROCESS_ID)">
                        <img src="../../../../assets/images/Continuation.png"/>
                        Continuation
                    </TableButton>
                </template>
                <template v-if="respondStatus === 32">
                    <TableButton @click="continuationRespond">
                        <img src="../../../../assets/images/renewal.png" alt="">
                        Respond
                    </TableButton>
                </template>
            </template>
        </DataTable>

        <Popup title="Success" :value="successModal.visible" @close="hideSuccessModal">
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
    import { CONTINUATION_PROCESS_ID } from 'Config/processIds';
    import PageTitle from 'Components/layout/PageTitle';
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    import DataTable from 'Components/DataTable';
    import UserCell from './components/userCell';
    import DateUtil from 'Utils/dateUtil';
    import config from './table'
    import {
        getList, getStatuses, getEntityType, getEntityById, getPcWeb
    } from './api';
    import { getEntityList } from 'Pages/master/masterActions';

    export default {
        name: "Continuation",
        data() {
            return {
                respondStatus: null,
                selectedTable: 201,
                searchCompany: '',
                selectedEntity: null,
                entityTypeList: [],
                CONTINUATION_PROCESS_ID,
                errorModal: {
                    isVisible: false,
                    message: null,
                    title: null,
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
                pcWeb: {}
            }
        },
        mixins: [validateSelectedRows],
        created() {
            this.setProcessId();
            this.getData();
            this.fetchEntityList();
            this.getPCWebData();
        },
        watch: {
            '$route': function () {
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
        },
        components: {
            FormWrapper,
            DataTable,
            PageTitle,
        },
        methods: {
            getPCWebData() {
                getPcWeb({process_id: CONTINUATION_PROCESS_ID}).then( res=> {
                    this.pcWeb = res.data[0];
                })
            },
            parseUrlForValues() {
                const { query } = this.$route;
                if (query && query.status_id) {
                    this.selectedStatus = +query.status_id;
                }
            },
            continuationRespond() {
                if (this.validateBeforeRespond()) {
                    const { reference_id, process_id } = this.selectedRows[0];
                    this.$store.dispatch('setProcessId', process_id);
                    this.$router.push({ path: `/submissions/${reference_id}/respond` })
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
            validateBeforeGoToTicket(selectedProcessId) {
                if (this.validateSelectedLength(1)) {
                    const { process_id, ApprovedNameStatus_id, EntityType } = this.selectedRows[0];
                    const errors = [];
                    if (ApprovedNameStatus_id !== 205 && ApprovedNameStatus_id !== 202 && ApprovedNameStatus_id !== 500) {
                        errors.push('Your case is pending with FSA')
                    }
                    if (EntityType === 'Trust' && selectedProcessId === CONTINUATION_PROCESS_ID) {
                        errors.push('Continuation is not applicable to Trust')
                    }
                    if (process_id && process_id !== selectedProcessId) {
                        errors.push('This operation is not permitted');
                    }
                    if (errors.length > 0) {
                        return this.showErrorModal(errors[0])
                    }
                    return true;
                }
            },
            
            showSuccessModal() {
                this.successModal.visible = true;
            },
            hideSuccessModal() {
                this.successModal.visible = false;
                this.successModal.message = '';
            },
            goToTicket(selectedProcessId) {
                if(this.userData.isRestricted == 1 && this.pcWeb.isRestricted == 1){
                    this.warningModal.message = `You're restricted to do this action`;
                    this.warningModal.visible = true; 
                }
                
                else{
                    if (this.validateBeforeGoToTicket(selectedProcessId)) {
                        const { reference_id } = this.selectedRows[0];
                        this.$store.dispatch('setProcessId', selectedProcessId);
                        this.$router.push({ path: `/continuation/${reference_id}` })
                    }
                }
            },
            
            getData() {
                Promise.all([
                    getStatuses({ process_id: this.processId }),
                    getEntityList()
                ]).then(this.getDataSuccess)
            },
            getDataSuccess(response) {
                this.statuses = response[0].data[0];
                this.entities = response[1].data;
                this.parseUrlForValues();
                // if (!this.selectedStatus) {
                //      this.selectedStatus = this.statuses[0].id;
                // }
                this.getDataByFilter();
            },
            setProcessId() {
                this.$store.commit('setProcessId', CONTINUATION_PROCESS_ID)
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
            fetchEntityList(){
                getEntityType({ process_id: this.processId }).then((res) => {
                    this.entityTypeList = res.data;
                }).catch(this.handleError)
            },
            getDataByFilter() {
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;
                if(this.selectedEntity != null){
                    var entitySelectedObj = this.entityTypeList.filter((entity) => { return entity.id === this.selectedEntity});
                    var entitySelected = entitySelectedObj[0].Name;
                }else{
                    var entitySelected = '';
                }
                const data = {
                    filter: [{
                        status_id: this.selectedStatus,
                        EntityType: entitySelected,
                        CompanyName: this.searchCompany,
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
                if(query && query.status_id && query.status_id !== this.selectedStatus && this.selectedStatus !== undefined){
                    this.$router.replace({'query': {'status_id': this.selectedStatus}})
                    this.resetPaginationAndSorting(this.selectedTable);
                }
                else if(query && !query.status_id && this.selectedStatus !== null && this.selectedStatus !== undefined ){
                    // this.$router.replace({'query': null});
                    this.$router.replace({'query': {'status_id': this.selectedStatus}})
                    this.resetPaginationAndSorting(this.selectedTable);
                }
                else if(this.selectedStatus === undefined){
                    this.$router.replace({'query': null});
                }
                this.respondStatus = this.selectedStatus !== null && this.selectedStatus !== undefined ? this.selectedStatus: this.selectedTable ;
                getList({ filterjson: data })
                    .then(this.handleResponse)
                    .catch(this.handleError)
            },
            handleResponse(response) {
                this.tableData = response.data[0];
                this.pagination.total = response.data[1][0].NumberOfRecords;
            },
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
    }

</style>
