<template>
    <FormWrapper>
        <PageTitle title="Name Reservation" slot="title" :link="`/help/${processId}`"/>
        <div :class="$style.filter">
            <div :class="$style.filterItem">
                <FormSelect label="Select Status" :items="statuses" item-name="name" item-value="id" :clearable="false" 
                    v-model="selectedStatus"/>  
            </div>
            <div :class="$style.filterItem">
                <FormSelect label="Select EntityType" :width="130" :items="entityTypeList" item-name="Name" item-value="id" 
                v-model="selectedEntity"/>
            </div>
            <div :class="$style.filterItem">
                <InputText label="Search Proposed Name" v-model="searchCompany" />
            </div>
            <FormButton type="primary" @click="getDataByFilter" :rounded="true">
                <Icon type="ios-search" />
            </FormButton>
        </div>
        <FormRow>
            <div class="row">
                <div class="col-sm-2 col-sm-offset-10" :class="$style.rightAlign">
                    <FormSelect :width="100" label="Paging" :items="pagingItems" item-name="value" item-value="value" v-model="pagination.perPage" :clearable="false" />
                </div>
            </div>
        </FormRow>
        
        <DataTable :actions="true"
                   :data="tableData"
                   v-if="selectedStatus"
                   :columns="config[selectedTable].columns"
                   @on-selection-change="selectChange"
                   @on-page-change="pageChange"
                   :pagination="pagination"
                   @on-sort-change="sortChange">
            <template slot="actionsLeft">
                <template v-if="selectedTable === 43">
                    <TableButton @click="addNewEntity">
                        <img src="../../../../assets/images/plus.png" alt="">
                        Add
                    </TableButton>
                    <TableButton @click="() => editEntity('edit')">
                        <img src="../../../../assets/images/edit.png"/>
                        Edit
                    </TableButton>
                    <TableButton @click="validateDelete">
                        <img src="../../../../assets/images/del.png"/>
                        Delete
                    </TableButton>
                    <TableButton @click="showUploadModal">
                        <img src="../../../../assets/images/upload.png"/>
                        Upload File
                    </TableButton>
                </template>
                <template v-if="selectedTable === 32">
                    <TableButton @click="() => editEntity('respond')">
                        <img src="../../../../assets/images/renewal.png" alt="">
                        Respond
                    </TableButton>
                </template>
            </template>
            <template slot="actionsRight" v-if="selectedTable === 43">
                <TableButton @click="submitPendingEntities">
                    <img src="../../../../assets/images/submit.png" alt=""/>
                    Submit
                </TableButton>
            </template>
        </DataTable>

        <ValidationObserver v-slot="{ passes }" ref="entityValidator">
            <Popup :title="currentEntity.title"
                   width="450"
                   :closable="true"
                   :maskClosable="false"
                   :value="entityModal.visible"
                   @close="() => showEntityModal(false)">
                <Loader v-if="entityModal.isLoading" />
                <div :class="$style.popupRow">
                    <FormSelect label="Entity Type"
                                rules="required"
                                :items="entities"
                                item-value="Name"
                                item-name="Name"
                                v-model="currentEntity.EntityType" 
                                :width="150"/>
                </div>
                <div :class="$style.popupRow">
                    <InputText label="Proposed Name"
                               v-model="currentEntity.ProposedName"
                               :maxlength="300"
                               :width="200"
                               />
                </div>
                <div :class="$style.popupRow">
                    <InputText label="Foreign Name"
                               :maxlength="300"
                               :rules="currentEntity.attachmentfile || currentEntity.document_file ? 'required' : null"
                               v-model="currentEntity.ForeignName"/>
                </div>

                <div :class="$style.popupRow">
                    <div :class="$style.currentEntityFile" v-if="currentEntity.document_file">
                        <a :href="currentEntity.document_file" target="_blank">
                            <Icon type="md-eye" />
                            {{ currentEntity.TranslationFile }}
                        </a>
                        <span @click="removeCurrentEntityFile">
                            <img src="../../../../assets/images/delete.png" height="15px" alt="">
                        </span>
                    </div>
                    <InputFile v-else @onChange="uploadFileHandler" :value="currentEntity.attachmentfile" name="Upload" :rules="{required:currentEntity.ForeignName ?  true : false, docCheck:'pdf,jpg,jpeg,png',checkFileRegex: true}" />
                   
                </div>
                <div :class="$style.popupRow" v-if="currentEntity.mode === 'respond'">
                    <InputTextArea label="Comment:" rules="required" v-model="currentEntity.comment" rows="3" :maxlength="250" />
                </div>
                <template slot="footer">
                    <FormButton type="success" @click="passes(addEntityHandler)">Save</FormButton>
                    <FormButton @click="() => showEntityModal(false)">Cancel</FormButton>
                </template>
            </Popup>
        </ValidationObserver>

        <ValidationObserver v-slot="{ passes }">
            <Popup title="Bulk Upload Entries" :value="uploadModal.visible" width="500" @close="hideUploadModal" :mask-closable="false" :closable="true">
                
                <div :class="$style.files">
                    <div :class="$style.upload">
                        <div :class="$style.uploadArea">
                            Drop the translation files here!<br>(Allowed: .jpg, .jpeg, .pdf)
                        </div>
                        <input type="file" name="Bulk" multiple="multiple" :rules="{docType: 'jpg,pdf,jpeg,zip'}" @change="bulkUploadHandler"/>
                    </div>
                    <div :class="$style.uploadedFiles">
                        <div v-for="(file, i) in bulkUploadFiles.files" :class="$style.bulkFile" :key="i">
                            {{ file.name }}
                            <span :class="$style.removeBulkFile" @click="() => removeBulkFile(i)">
                                <img src="../../../../assets/images/delete.png" height="15px" alt="">
                            </span>
                        </div>
                    </div>
                </div>
                <div :class="$style.progress">
                    <progress max="100" :value="bulkUploadFiles.progress" />
                </div>
                
                <br />
                <div :class="$style.excelFile">
                    <div :class="$style.excelFileLabel">
                       <span>Select EntityType:</span>
                    </div>
                    <div :class="$style.excelFileInput">
                        <FormSelect name="Select EntityType" :width="130" rules="required" :items="entityTypeList" item-name="Name"     item-value="Name"  v-model="bulkUploadFiles.EntityType"/>
                    </div>
                </div>
                <div :class="$style.excelFile">
                    <div :class="$style.excelFileLabel">
                       <span>Choose File:</span>
                    </div>
                    <div :class="$style.excelFileInput">
                        <InputFile :rules="{required:true,docCheck:'xlsx,xls',checkFileRegex: true}" :value="bulkUploadFiles.fileXSLS" name="nameReservationBulkExcel" @onChange="fileXSLSUploadHandler" label="Upload File (xlsx,xls)" />
                        <a target="_blank" :class="$style.exampleFile" href="/NameReservation-uploader.xlsx">Download Sample File</a>
                    </div>
                </div>
                <div v-if="!bulkUploadFiles.isPristine">
                    <div :class="$style.excelFile">
                        <div :class="$style.excelFileLabel">
                            <span>Total Records</span>
                        </div>
                        <div :class="$style.excelFileInput">
                            {{ bulkUploadFiles.success + bulkUploadFiles.fail }}
                        </div>
                    </div>
                    <div :class="$style.excelFile">
                        <div :class="$style.excelFileLabel">
                            <span>Success</span>
                        </div>
                        <div :class="$style.excelFileInput">
                            {{ bulkUploadFiles.success }}
                        </div>
                    </div>
                    <div :class="$style.excelFile">
                        <div :class="$style.excelFileLabel">
                            <span>Failed</span>
                        </div>
                        <div :class="$style.excelFileInput">
                            {{ bulkUploadFiles.fail }}
                        </div>
                    </div>
                    <div :class="$style.excelFile">
                        <div :class="$style.excelFileLabel">
                            <span>Response File</span>
                        </div>
                        <div :class="$style.excelFileInput">
                            <a target="_blank" :href="bulkUploadFiles.responseFileLink">Download</a>
                        </div>
                    </div>
                </div>

                <div slot="footer">
                    <FormButton type="success" @click="passes(bulkUpload)" v-if="!bulkUploadFiles.isLoading  && (!bulkUploadFiles.wereFilesUploaded || bulkUploadFiles.fail != 0 )">Check</FormButton>

                    <FormButton type="success" @click="bulkUploadFinal" v-if="!bulkUploadFiles.isLoading && (bulkUploadFiles.wereFilesUploaded && bulkUploadFiles.fail == 0 )">Process</FormButton>

                    <FormButton @click="hideUploadModal">Close</FormButton>
                    <span style="margin-left: 10px;" v-if="bulkUploadFiles.isLoading">Please wait...</span>
                </div>
            </Popup>
        </ValidationObserver>

        <Popup title="Success" type="success" :value="successModal.visible" @close="hideSuccessModal">
            {{ successModal.message }}
            <div slot="footer">
                <FormButton @click="hideSuccessModal">Ok</FormButton>
            </div>
        </Popup>

        <Popup title="Information" :value="warningModal.visible" @close="() => showWarningModal(false)">
            {{ warningModal.message }}
            <div slot="footer">
                <FormButton v-if="warningModal.buttons.confirm" type="success" @click="confirmDelete">Confirm
                </FormButton>
                <FormButton v-if="warningModal.buttons.ok" @click="() => showWarningModal(false)">Ok</FormButton>
                <FormButton v-if="warningModal.buttons.cancel" @click="() => showWarningModal(false)">Cancel
                </FormButton>
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
    import { NAME_RESERVATION_PROCESS_ID, INCORPORATE_PROCESS_ID, CONTINUATION_PROCESS_ID } from 'Config/processIds';
    import PageTitle from 'Components/layout/PageTitle';
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    import DataTable from 'Components/DataTable';
    import UserCell from './components/userCell';
    import Event from 'Utils/event';
    import DateUtil from 'Utils/dateUtil';
    import { ValidationObserver } from "vee-validate";
    import config from './table'
    import {
        getList, getStatuses,getEntityType,
        getEntityById,
        resubmitTicket,
        processNamereservation,
        addEntity, deleteEntityByIds, updateEntity, submitPending, bulkUploadFiles, getGenericUserTask, bulkUploadFilesEntity,  getPcWeb
    } from './api';
    import { getEntityList } from 'Pages/master/masterActions';

    const NEW_ENTITY = {
        title: 'Add Entity',
        mode: 'add',
        EntityType: null,
        ProposedName: '',
        ForeignName: '',
        comment: '',
        attachmentfile: null,
    };

    export default {
        name: "NameReservation",
        mixins: [validateSelectedRows],
        components: {
            FormWrapper,
            DataTable,
            PageTitle,
            ValidationObserver
        },
        data() {
            return {
                selectedTable: 43,
                searchCompany: '',
                selectedEntity: null,
                entityTypeList: [],
                CONTINUATION_PROCESS_ID,
                INCORPORATE_PROCESS_ID,
                validationConfig: {
                    LP: 'required|nameReservation_LP',
                    IBC: 'required|nameReservation_IBC',
                    Foundation: 'required|nameReservation_Foundation',
                    Trust: 'required|nameReservation_Trust'
                },
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
                                return h('span', DateUtil.formatDate(params.row.StatusDateTime));
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
                    perPage: null,
                    page: 1,
                    total: 0
                },
                currentEntity: JSON.parse(JSON.stringify(NEW_ENTITY)),
                bulkUploadFiles: {
                    files: [],
                    fileXSLS: null,
                    isLoading: false,
                    total: 0,
                    success: 0,
                    fail: 0,
                    responseFileLink: '',
                    isPristine: true,
                    progress: 0 ,
                    wereFilesUploaded: false,
                    EntityType: null,
                },
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
                    }
                ],
                successJSON: [],
                toReset: false
            }
        },
        watch: {
            'pagination.perPage':function(){
                if(this.$route.name !== 'submissionsRespond'){
                    this.pagination.page = 1;
                    this.getDataByFilter();
                }
            },
            '$route': function (to,from) {
                this.parseUrlForValues();
            },
            selectedStatus() {
                this.toReset = true;
            }
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
        created() {
            this.setProcessId();
            this.getData();
            this.fetchEntityList();
            Event.subscribe('showCommentLogPopup', this.showCommentLogPopup);
            if(this.$route.name == 'submissionsRespond'){
                this.getTicketRefData()
            }
            // this.getPCWebData();
        },
        methods: {
            getTicketByTicketRef(){
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;
                const data = {
                    filter: [{
                        TicketReference: this.$route.params.TicketReference
                    }],
                    sort: [{ key, order }],
                    paging: [
                        {
                            startindex: perPage * (page - 1) + 1,
                            pagesize: perPage
                        }
                    ],
                };
                getList({ filterjson: data })
                    .then(this.handleResponse)
                    .catch(this.handleError)
            },
            parseUrlForValues() {
                const { query } = this.$route;
                if (query && query.status_id) {
                    this.selectedStatus = +query.status_id;
                }
            },
            incorporateRespond() {
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
                    if (ApprovedNameStatus_id !== 205 && ApprovedNameStatus_id !== 202) {
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
            goToTicket(selectedProcessId) {
                if (this.validateBeforeGoToTicket(selectedProcessId)) {
                    const { reference_id } = this.selectedRows[0];
                    this.$store.dispatch('setProcessId', selectedProcessId);
                    this.$router.push({ path: `/submissions/${reference_id}` })
                }
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

            showUploadModal() {
                this.uploadModal.visible = true;
            },

            hideUploadModal() {
                this.uploadModal.visible = false;
                if (this.bulkUploadFiles.wereFilesUploaded) {
                    this.resetBulkUploadData();
                    this.bulkUploadFiles.wereFilesUploaded = false;
                }
                this.getDataByFilter();
            },

            resetBulkUploadData() {
                this.bulkUploadFiles = {
                        files: [],
                        fileXSLS: null,
                        isLoading: false,
                        total: 0,
                        success: 0,
                        fail: 0,
                        responseFileLink: '',
                        isPristine: true,
                        progress: 0,
                        EntityType: null,
                };
                this.successJSON = []
            },

            bulkUploadHandler(e) {
                this.bulkUploadFiles.files = [
                    ...this.bulkUploadFiles.files,
                    ...e.target.files
                ]
            },

            removeBulkFile(index) {
                this.bulkUploadFiles.files.splice(index, 1)
            },

            fileXSLSUploadHandler(file) {
                this.bulkUploadFiles.fileXSLS = file;
            },
            bulkUploadFinal() {
                processNamereservation({successJSON: JSON.parse(this.successJSON)}).then(
                    res => {
                        this.hideUploadModal();
                        this.successModal.message = 'Name(s) have uploaded.';
                        this.successModal.visible = true;
                    }
                )
            },
            bulkUpload() {
                const formData = new FormData();
                this.bulkUploadFiles.files.forEach((item, i) => {
                    formData.append('files[' + i + ']', item);
                });
                formData.append('excelfile', this.bulkUploadFiles.fileXSLS);
                formData.append('EntityType',this.bulkUploadFiles.EntityType)
                this.bulkUploadFiles.isLoading = true;

                const onUploadProgress = (progressEvent) =>  {
                    this.bulkUploadFiles.progress = Math.round((progressEvent.loaded * 100)/progressEvent.total);
                };

                bulkUploadFilesEntity(formData, { onUploadProgress }).then(res => {
                    this.bulkUploadFiles.isLoading = false;
                    this.bulkUploadFiles.isPristine = false;
                    this.bulkUploadFiles.fail = res.data.fail;
                    this.bulkUploadFiles.success = res.data.success;
                    this.bulkUploadFiles.responseFileLink = res.filepath;
                    this.bulkUploadFiles.wereFilesUploaded = true;
                    if(res.data.fail == 0) {
                        this.successJSON = res.successJSON;
                    }
                }).catch(() => {
                    this.bulkUploadFiles.isLoading = false;
                });
            },
            setCurrentEntity(entity) {
                this.currentEntity = entity;
            },
            showEntityModal(value) {
                this.$refs.entityValidator.reset();
                // this.currentEntity = JSON.parse(JSON.stringify(NEW_ENTITY));
                this.successJSON = [];
                this.entityModal.visible = value;
            },
            removeCurrentEntityFile() {
                this.currentEntity.document_file = null;
            },
            uploadFileHandler(file) {
                this.currentEntity.attachmentfile = file;
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
                this.selectedStatus = this.statuses[0].id;
                this.pagingItems = this.pagingItems1;
                this.pagination.perPage = 10;
                if(this.$route.name !== 'submissionsRespond'){
                    if (!this.selectedStatus) {
                        this.selectedStatus = this.statuses[0].id;
                    }
                    this.getDataByFilter();
                }
            },
            getTicketRefData(){
                this.selectedStatus = 30;
                this.selectedTable = this.selectedStatus;
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;

                const filters = {};

                // Ignore other filters if we have ticket reference
                filters.TicketReference = this.$route.params.TicketReference;
                
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
                getGenericUserTask(data).then(this.handleTicketRefResponse).catch(this.handleError)
            },
            handleTicketRefResponse(response) {
                this.tableData = response.data[0];
                this.pagination.total = response.data[1][0].NumberOfRecords;
                this.selectedStatus = this.tableData[0].Status_id;
                this.selectedTable = this.tableData[0].Status_id;
            },
            setProcessId() {
                this.$store.commit('setProcessId', NAME_RESERVATION_PROCESS_ID)
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
                getEntityType({ process_id: this.processId,
                    icsp_id: this.userData.icsp_id }).then((res) => {
                    this.entityTypeList = res.data;
                }).catch(this.handleError)
            },
            
            getDataByFilter() {
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;
                if(this.selectedEntity != null){
                    var entitySelectedObj = this.entityTypeList.filter((entity) => { return entity.id === this.selectedEntity})
                    var entitySelected = entitySelectedObj[0].Name
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
                if(query && query.status_id && query.status_id !== this.selectedStatus){
                    this.$router.replace({'query': {'status_id': this.selectedStatus}}).catch(err => {});
                    if(this.toReset) this.resetPaginationAndSorting(this.selectedStatus);
                    this.selectedTable = this.selectedStatus;
                }else if(query && !query.status_id ){
                    this.$router.replace({'query': {'status_id': this.selectedStatus}}).catch(err => {});
                    if(this.toReset) this.resetPaginationAndSorting(this.selectedStatus);
                    this.selectedTable = this.selectedStatus;
                }
                
                getList({ filterjson: data })
                    .then(this.handleResponse)
                    .catch(this.handleError)
            },
            handleResponse(response) {
                this.tableData = response.data[0];
                this.pagination.total = response.data[1][0].NumberOfRecords;
                this.toReset = false;
            },

            // Add Entity Methods START
            addNewEntity() {
                this.setCurrentEntity(JSON.parse(JSON.stringify(NEW_ENTITY)));
                this.showEntityModal(true);
            },
            addEntityHandler() {
                const formData = new FormData();
                for (let key in this.currentEntity) {
                    if (this.currentEntity.hasOwnProperty(key)) {
                        formData.append(key, this.currentEntity[key]);
                    }
                }
                const modes = {
                    add: addEntity,
                    edit: updateEntity,
                    respond: resubmitTicket
                }
                const action = modes[this.currentEntity.mode];
                formData.append('ICSP_id', this.userData.icsp_id);
                this.entityModal.isLoading = true;
                action(formData)
                    .then(this.addEntitySuccessHandler)
                    .catch(() => {
                        this.entityModal.isLoading = false;
                    });
            },
            addEntitySuccessHandler(response) {
                this.entityModal.isLoading = false;
                this.showEntityModal(false);
                this.successModal.message = response.message;
                this.showSuccessModal();
                setTimeout(() => {
                    this.$router.push({name: 'submissions'}).catch(() => true);
                    this.getDataByFilter();
                },1000)
            },
            // Add Entity Methods END

            // Edit Entity Methods START
            editEntity(mode) {
                if (this.validateSelectedLength(1)) {
                    getEntityById(this.selectedRows[0].id || this.selectedRows[0].reference_id).then(response => {
                        const { EntityType, ProposedName, ForeignName, id, TranslationFile, document_file } = response.data[0];
                        const currentEntity = {
                            title: 'Edit Entity',
                            EntityType,
                            ProposedName,
                            ForeignName: ForeignName || '',
                            mode,
                            id,
                            comment: '',
                            attachmentfile: null,
                            document_file,
                            TranslationFile
                        };
                        this.setCurrentEntity(currentEntity);
                        this.showEntityModal(true);
                    })
                }

            },
            // Edit Entity Methods END

            // Submit START
            submitPendingEntities() {
                if (this.validateSelectedLength()) {
                    const data = this.selectedRows.map(row => row.id).join(', ');
                    submitPending({ id: data }).then(this.submitPendingEntitiesSuccess)
                }
            },
            submitPendingEntitiesSuccess(response) {
                this.successModal.message = response.message;
                this.showSuccessModal();
                this.getDataByFilter();
            },
            // Submit END
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
    
    .rightAlign{
        min-width: 100px;
    }
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
