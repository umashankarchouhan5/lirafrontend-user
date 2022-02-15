<template>
    <FormWrapper>
        <PageTitle title="CSP Change Request" slot="title" :link="`/help/380`"/>
        <div :class="$style.filter">
            <div :class="$style.filterItem">
                <FormSelect label="Select Status" :items="statuses" item-name="name" item-value="id" :clearable="false"
                    v-model="selectedStatus"/>
            </div>
            <!-- <div :class="$style.filterItem">
                <FormSelect label="Select EntityType" :items="entityTypeList" item-name="Name" item-value="Name" 
                v-model="selectedEntity"/>
            </div> -->
            <div :class="$style.filterItem">
                <InputText label="Search Company Name" v-model="searchCompany" />
            </div>
            <FormButton type="primary" @click="getDataByFilter" :rounded="true">
                <Icon type="ios-search" />
            </FormButton>
        </div>

        <DataTable :actions="true"
                   :data="tableData"
                   :columns="config[selectedTable].columns"
                   @on-page-change="pageChange"
                   @on-selection-change="selectChange"
                   :pagination="pagination">
            <template slot="actionsLeft">
                <TableButton @click="addChange" v-if="selectedTable === 43">
                    <img src="../../../../assets/images/plus.png">
                    Add
                </TableButton>
				<TableButton @click="editChange" v-if="selectedTable === 43">
                    <img src="../../../../assets/images/edit.png">
                    Edit
                </TableButton>
				<TableButton @click="respondChange" v-if="selectedTable === 32">
                    <img src="../../../../assets/images/renewal.png">
                    Respond
                </TableButton>
            </template>
        </DataTable>

        <Popup :value="isPopupVisible" type="success" title="Title" :mask-closable="false" :closable="false">
            <InputText label="Add some text" v-model="test" />
            <FormButton slot="footer" @click="submit">Submit</FormButton>
        </Popup>

        <Popup title="Information" type="information" :value="warningModal.visible" @close="() => showWarningModal(false)">
            {{ warningModal.message }}
            <div slot="footer">
                <FormButton v-if="warningModal.buttons.ok" @click="() => showWarningModal(false)">Ok</FormButton>
            </div>
        </Popup>

    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    import { getChangeList, getStatuses, getEntityType, getFilteredData } from './config/api';
    import { PROCESS_ID, REFERENCE_ID } from 'Config/localStorageKeys';
    import config from './config/table';
    import { CHANGECSP_PROCESS_ID } from 'Config/processIds';

    export default {
        name: "ChangeRequest",
        data() {
            return {
                selectedTable: 43,
                searchCompany: '',
                selectedEntity: null,
                entityTypeList: [],
                isPopupVisible: false,
                test: '',
                selectedRows: [],
                config,
				statuses: [],
                selectedStatus: '',
                sorting: {
                    key: "updated_at",
                    order: "Desc"
                },
                tableData: [],
                pagination: {
                    perPage: 10,
                    page: 1,
                    total: 0
                },
            }
        },
        mixins: [validateSelectedRows],
        created() {
            this.setProcessId();
			this.getData();
            this.$store.commit('setCompany',null);
        },
		watch: {
            // selectedStatus(newValue) {
            //     this.resetPaginationAndSorting(newValue);
            //     this.getDataByFilter();
            // }
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
            setProcessId() {
                this.$store.commit('setProcessId', CHANGECSP_PROCESS_ID)
            },
            respondChange() {
                if (this.validateSelectedLength(1) && this.validateCanRespond()) {
                    const { reference_id, process_id } = this.selectedRows[0];
                    sessionStorage.setItem(PROCESS_ID, process_id);
                    sessionStorage.setItem(REFERENCE_ID, reference_id);
                    this.$store.dispatch('setProcessId',process_id)
                    this.$router.push({ path: `changes/${reference_id}/respond/${process_id}`})
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
            validateCanEdit() {
                const { Status_id } = this.selectedRows[0];
                const allowedStatuses = [53, 43];
                if (allowedStatuses.indexOf(Status_id) === -1) {
                    this.warningModal.message = 'You can\'t edit this ticket';
                    this.showWarningModal(true);
                    return false
                }
                return true;
            },
            selectChange(data) {
                this.selectedRows = data;
            },
            resetPaginationAndSorting() {
                this.pagination.page = 1;
                this.sorting = {
                    key: "updated_at",
                    order: "Desc"
                }
            },
            addChange() {
                this.$router.push({ path: '/changesCSP/add' })
            },
			editChange() {
                if (this.validateSelectedLength(1) && this.validateCanEdit()) {
                    const { reference_id, Process_id } = this.selectedRows[0];
                    sessionStorage.setItem(PROCESS_ID, Process_id);
                    sessionStorage.setItem(REFERENCE_ID, reference_id);
                    this.$router.push({ name: 'changesCSP_edit'})
                }
            },
            pageChange(page) {
                this.pagination.page = page;
                this.getDataByFilter()
            },
            submit() { 
                this.test = '';
                this.isPopupVisible = false;
            },
            getDataByFilter() {
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;
                const data = {
                    filter: [{
                        status_id: this.selectedStatus,
                        CompanyName: this.searchCompany,
                        processtype_id: 32
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
                if(query && query.status_id && query.status_id != this.selectedStatus){
                    this.$router.replace({'query': {'status_id': this.selectedStatus}}).catch(err => {});
                    this.resetPaginationAndSorting(this.selectedStatus);
                    this.selectedTable = this.selectedStatus;
                }else if(query && !query.status_id ){
                    this.$router.replace({'query': null});
                    this.$router.replace({'query': {'status_id': this.selectedStatus}}).catch(err => {});
                    this.resetPaginationAndSorting(this.selectedStatus);
                    this.selectedTable = this.selectedStatus;
                }
                else if(query && query.status_id && query.status_id == this.selectedStatus){
                    this.selectedTable = this.selectedStatus;
                }
                // getChangeList({filterjson:data}).then(this.handleResponse)
                getFilteredData({filterjson:data}).then(this.handleResponse)
            },
			getData() {
                Promise.all([
                    getStatuses({ process_id: 32 }),
                    // getEntityType({ process_id: 32 })

                ]).then(this.getDataSuccess)
            },
            getDataSuccess(response) {
                this.statuses = response[0].data[0];
                // this.entityTypeList = response[1].data;
                this.parseUrlForValues();
                if (!this.selectedStatus) {
                    this.selectedStatus = this.statuses[0].id;
                    this.$router.replace({'query': {'status_id': this.selectedStatus}}).catch(err => {});
                    this.getDataByFilter();
                }
                else{
                    this.getDataByFilter();
                }
            },
            fetchEntityList(){
                getEntityType({ process_id: 32 }).then((res) => {
                    this.entityTypeList = res.data;
                }).catch(this.handleError)
            },
            parseUrlForValues() {
                const { query } = this.$route;
                if (query && query.status_id) {
                    this.selectedStatus = +query.status_id;
                }
                if (!query || !query.status_id) {
                    this.$router.push({query:{status_id: this.selectedTable}})
                }
            },
            handleResponse(res) {
                this.tableData = res.data[0];
                this.pagination.total =  res.data[1][0].NumberOfRecords
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
    }

</style>
