<template>
    <FormWrapper>
        <PageTitle title="Name Reservation Extension" slot="title" :link="`/help/${processId}`"/>
        <div :class="$style.filter">
            <div :class="$style.filterItem">
                <FormSelect label="Select EntityType" :items="entityTypeList" item-name="Name" item-value="id" :clearable="true"
                v-model="selectedEntity"  :width="130"/>
            </div>
            <div :class="$style.filterItem">
                <InputText label="Search Company" v-model="searchCompany" />
            </div>
            <FormButton type="primary" @click="getDataByFilter" :rounded="true">
                <Icon type="ios-search" />
            </FormButton>
        </div>
        
        <DataTable :actions="true"
                   :data="tableData"
                   :columns="config"
                   @on-selection-change="selectChange"
                   @on-page-change="pageChange"
                   :pagination="pagination"
                   @on-sort-change="sortChange">
            <template slot="actionsLeft">
                <TableButton  @click="rereserveName()">
                    <img src="../../../../assets/images/exten-latest-new.png" />
                    ReReserve
                </TableButton>
                
                <TableButton @click="releaseName()">
                    <img src="../../../../assets/images/exten-latest-new.png" />
                    Release
                </TableButton>
            </template>
        </DataTable>

       
        <Popup title="Success" type="success" :value="successModal.visible" @close="hideSuccessModal">
            <template >
                        <!-- <p>Thank you for your payment.</p> -->
                        <p>Your case reference #<strong>{{ successModal.TicketReference }}</strong> has been submitted for further processing.</p>
                    </template>
            <div slot="footer">
                <FormButton @click="hideSuccessModal">Ok</FormButton>
            </div>
        </Popup>
        <Popup title="Name Release" :value="releaseModal.visible" @close="() => showReleasePopup(false)">
            <p>Are you sure you wish to release this name ?</p>
            <div slot="footer">
                <FormButton type="success" @click="() => release()">Release</FormButton>
                <FormButton @click="() => showReleasePopup(false)">Close</FormButton>
            </div>
        </Popup>

        <Popup title="Name ReReserve" :value="rereserveModal.visible" @close="() => showReReservePopup(false)">
            <p>Are you sure you wish to rereserve this name ?</p>
            <div slot="footer">
                <FormButton type="success" @click="() => extend()">ReReserve Name</FormButton>
                <FormButton @click="() => showReReservePopup(false)">Close</FormButton>
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
    import { NAME_RESERVATION_PROCESS_EXTENSION_ID, INCORPORATE_PROCESS_ID, CONTINUATION_PROCESS_ID } from 'Config/processIds';
    import PageTitle from 'Components/layout/PageTitle';
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    import DataTable from 'Components/DataTable';
    import UserCell from './components/userCell';
    import Event from 'Utils/event';
    import DateUtil from 'Utils/dateUtil';
    import config from './table'
    import {
        getList ,getEntityType, generateInvoice, checkExtend,
        nameRelease,
        generateProcessTicket
    } from './api';

    const NEW_ENTITY = {
        title: 'Add Entity',
        mode: 'add',
        EntityType: null,
        ProposedName: '',
        ForeignName: '',
        comment: '',
        attachmentfile: null
    };

    export default {
        name: "NameReservationExtension",
        data() {
            return {
                selectedTable: '',
                searchCompany: '',
                selectedEntity: null,
                entityTypeList: [],
                CONTINUATION_PROCESS_ID,
                INCORPORATE_PROCESS_ID,
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
                releaseModal: {
                    visible: false,
                },
                rereserveModal: {
                    visible: false,
                },
                successModal: {
                    visible: false,
                    message: '',
                    TicketReference: '',
                },
                statuses: [],
                entities: [],
                selectedStatus: null,
                selectedRows: [],
                sorting: {
                    key: "id",
                    order: "Asc"
                },
                tableData: [],
                config,
                pagination: {
                    perPage: 10,
                    page: 1,
                    total: 0
                },
                currentEntity: JSON.parse(JSON.stringify(NEW_ENTITY)),
            }
        },
        mixins: [validateSelectedRows],
        created() {
            this.setProcessId();
            this.fetchEntityList();
            Event.subscribe('showCommentLogPopup', this.showCommentLogPopup)
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
            
            release(){
                var row = this.selectedRows[0];
                nameRelease({reference_id: row.reference_id}).then(
                    res => {
                        this.showReleasePopup(false);
                        this.successModal.TicketReference = res.data[0][0].TicketReference;
                        // this.successModal.message = res.message;
                        this.showSuccessModal();
                        this.getDataByFilter();
                    },
                    () => {
                        this.getDataByFilter();
                        this.showReleasePopup(false);
                    }
                )
            },
            showReleasePopup(val){
                this.releaseModal.visible = val;
            },
            releaseName(){
                
                if (this.validateSelectedLength(1)) {
                    this.showReleasePopup(true);
                }
            },
            extend(){
                if (this.validateSelectedLength(1)) {
                    checkExtend({approvedname_id: this.selectedRows[0].reference_id}).then(this.handleExtendRequest,this.handleExtendError);
                }
            },
            showReReservePopup(val) {
                this.rereserveModal.visible = val;
            },
            rereserveName(){
                
                if (this.validateSelectedLength(1)) {
                    this.showReReservePopup(true);
                }
            },
            handleExtendRequest(response){
                if(response.data[0][0].Status === 1){
                    var process_id = NAME_RESERVATION_PROCESS_EXTENSION_ID;
                    var reference_id = this.selectedRows[0].reference_id;
                    const data = {
                        process_id,
                        reference_id
                    }
                    generateProcessTicket(data).then(
                        res => {
                            this.showReReservePopup(false);
                            this.successModal.TicketReference = res.data[0].TicketReference;
                            this.successModal.message = res.message;
                            this.showSuccessModal();
                            this.getDataByFilter();
                        },
                        () => {
                            this.getDataByFilter();
                            this.showReReservePopup(false);
                        }
                    )
                    // generateInvoice(data).then(
                    //     (res) => {
                    //         this.$store.commit('setGeneratedInvoice',res.data[0].invoice_id);
                    //         this.$router.push({ path: `/invoice/${res.data[0].invoice_id}` })
                    //     }
                    // )
                    // this.$router.push({path:`nameReservationExtension/${reference_id}/payment`})
                }
            },
            handleExtendError(){
                this.getDataByFilter();
                this.showReReservePopup(false);

            },
            parseUrlForValues() {
                const { query } = this.$route;
                if (query && query.status_id) {
                    this.selectedStatus = +query.status_id;
                }
                if (query && query.entityTypId) {
                    this.selectedEntity = +query.entityTypId;
                }
                if (query && query.companyName) {
                    this.searchCompany = query.companyName;
                }
            },
            
            resetPaginationAndSorting(newValue) {
                this.pagination.page = 1;
                this.sorting = {
                    key: "id",
                    order: "Asc"
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
            
            showSuccessModal() {
                this.successModal.visible = true;
            },
            hideSuccessModal() {
                this.successModal.visible = false;
                this.successModal.message = '';
                this.successModal.TicketReference = '';
            },


            setProcessId() {
                this.$store.commit('setProcessId', NAME_RESERVATION_PROCESS_EXTENSION_ID)
            },
            sortChange(data) {
                this.sorting.key = data.key;
                this.sorting.order = data.order;
                this.getDataByFilter();
            },
            pageChange(page) {
                this.pagination.page = page;
                this.getDataByFilter();
            },
            selectChange(data) {
                this.selectedRows = data;
            },
            fetchEntityList(){
                getEntityType({ process_id: this.processId,
                    icsp_id: this.userData.icsp_id }).then((res) => {
                    this.entityTypeList = res.data;
                    this.getDataByFilter();
                }).catch(this.handleError)
            },
            
            getDataByFilter() {
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;
                var entitySelected = this.entityTypeList.filter((entity) => { return entity.id === this.selectedEntity})
                if(this.selectedEntity != null){
                    var entitySelectedObj = this.entityTypeList.filter((entity) => { return entity.id === this.selectedEntity})
                    var entitySelected = entitySelectedObj[0].Name
                }else{
                    var entitySelected = '';
                }
                const data = {
                    filter: [{
                        status_id: '',
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
                if(query && query.entityType && query.entityType !== this.selectedEntity){
                    this.$router.replace({'query': {'entityType': this.selectedEntity}}).catch(err => {});
                    this.resetPaginationAndSorting(this.selectedTable);
                }else if(query && !query.entityType ){
                    this.$router.replace({'query': {'entityType': this.selectedEntity}}).catch(err => {});
                    this.resetPaginationAndSorting(this.selectedTable);
                }
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
