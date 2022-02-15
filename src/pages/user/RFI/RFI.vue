<template> 
    <FormWrapper>
        <PageTitle :title="pageTitle" slot="title"/>
        <TicketHeader v-if="ticketValue" :ticketValue="ticketValue" />
        <CenterBlock :width="1000">
            <ValidationObserver ref="validator">

                <DataTable :data="commentLog"
                           :columns="commentLogColumns" />
                <br>
                <FormRow>
                    <div class="col-sm-12">
                        <InputTextArea rules="required" v-model="Comments" label="Comments"  :maxlength="250" />
                    </div>
                </FormRow>
                <div :class="$style.additional">
                    <DataTable :class="$style.documents" no-data-text="No Documents Attached" :columns="columns.additional()" :data="documents.additional" />
                    <div :class="$style.additionalAdd">
                        <AddRemoveButton v-if="documents.additional.length === 0" :is-last="true" @add="onAddDocument" @remove="onRemoveDocument" size="small" :length="documents.additional.length" />

                    </div>
                </div>

                <h3 v-if="documents.rejected.length > 0"> Documents to be ReSubmitted</h3>
                <!-- <p v-if="rejectedDocuments.length > 0"><i>Please upload new documents </i></p> -->
                <div v-if="documents.rejected.length > 0">
                    <DataTable :class="$style.documents" no-data-text="No Documents Attached" :columns="columns.rejected()" :data="documents.rejected" />
                    <br>
                </div>
                
                <FormRow>
                    <div class="col-sm-12">
                        <Declaration v-model="declaration" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-12">
                        <ButtonGroup>
                            <!-- <FormButton type="primary" @click="save">Save</FormButton> -->
                            <FormButton
                                    left-icon="md-checkmark-circle-outline"
                                    type="success"
                                    @click="submit">
                                Submit
                            </FormButton>
                        </ButtonGroup>
                    </div>
                </FormRow>
            </ValidationObserver>
        </CenterBlock>

        <Popup :value="modals.success.isVisible" :closable="false" :mask-closable="false" type="success" title="Submitted Successfully"
            @close="() => modals.success.isVisible = false">

            <p v-if="modals.success.isVisible && processId !== 702">Your response has been submitted. Your reference # is <strong>{{ ticket.TicketReference }}</strong></p>
            <p v-else>Your response has been submitted</p>

            <ButtonGroup slot="footer">
                <FormButton @click="backToList">Back To List</FormButton>
            </ButtonGroup>
        </Popup>

        <Popup title="Success" type="success" :value="successModal.visible" @close="() =>{successModal.visible = false}">
            {{ successModal.message }}
            <div slot="footer">
                <FormButton @click="() =>{successModal.visible = false}">Ok</FormButton>
            </div>
        </Popup>
        <Popup title="Delete Additional Document" type="info" :value="deleteModal.visible" :closable="false" :mask-closable="false" @close="() =>{deleteModal.visible = false}">
            Are you sure to delete this document row ?
            <div slot="footer">
                <FormButton type="success" @click="deleteDoc(deleteModal.index)">Yes</FormButton>
                <FormButton @click="cancelDelete()">No</FormButton>
            </div>
        </Popup>
    </FormWrapper>
</template>

<script>

    import TicketHeader from 'Components/layout/TicketHeader';
    import FormWrapper from 'Components/form/FormWrapper';
    import { getTicket, fetchCommentLog, submitRFIResponse, getAdditionalDocuments, rejectedDocuments, uploadFileAdditional, uploadFile, deleteAdditionalDocument } from './api';
    import PageTitle from 'Components/layout/PageTitle';
    import Declaration, { fetchDeclaration, addDeclaration } from 'Components/Declaration';
    import UserCell from './components/userCell';
    import DateUtil from 'Utils/dateUtil';
    import { ValidationObserver } from "vee-validate"; 
    import { PROCESS_ID, REFERENCE_ID } from 'Config/localStorageKeys';
    import { INCORPORATE_PROCESS_ID } from 'Config/processIds';
    // import Actions from 'Components/layout/user/actions';
    import tableAdditional from 'Organisms/documents/config/tableAdditional';
    import tableRejected from 'Organisms/documents/config/tableRejected';
    import DataTable from 'Components/DataTable';
    import AddRemoveButton from 'Components/AddRemoveButton'

    export default {
        name: "RFI",
        components: {
            DataTable,
            AddRemoveButton,
            FormWrapper,
            PageTitle,
            ValidationObserver,
            Declaration,
            // Actions,
            TicketHeader
        },
        data() {
            return {
                ticketValue: null,
                ticket: null,
                Comments: '',
                declaration: {
                    DeclarationDate: DateUtil.formatDate(Date.now()),
                    Name: '',
                    Place: '',
                    isChecked: false,
                    DisplayText: '',
                },
                modals: {
                    success: {
                        isVisible: false,
                    }
                },
                commentLog: [],
                commentLogColumns: [
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
                ],
                documents: {
                    additional: [],
                    rejected: []
                },
                columns: {
                    additional: tableAdditional,
                    rejected: tableRejected,
                },
                successModal: {
                    visible: false,
                    message: ''
                },
                deleteModal: {
                    visible: false,
                    index: null,
                }
            }
        },
        computed: {
            processId() {
                return this.$store.state.common.currentProcessId;
            },
            pageTitle() {
                return `Response to RFI (Reference : ${this.ticket && this.ticket !== null ? this.ticket.TicketReference : ''})`
            },
            processName() {
                return this.ticket && this.ticket.process_id === INCORPORATE_PROCESS_ID ? 'Incorporation' : 'Continuation'
            },
        },
        created() {
            this.columns.rejected = this.columns.rejected.bind(this);
            this.columns.additional = this.columns.additional.bind(this);
            const processIdFromStorage = localStorage.getItem(PROCESS_ID) || +sessionStorage.getItem(PROCESS_ID);
            if (!this.processId && processIdFromStorage) {
                this.$store.dispatch('setProcessId', processIdFromStorage)
            }
            this.processId && this.getTicketHandler();
        },
        methods: {
            onAddDocument() {
                const template = {
                    DocumentDate: '',
                    UploadDate: '',
                    documentBrief: '',
                    type: 'additional',
                    errors: [],
                    file: null,
                    name: '',
                    path: '',
                    url: ''
                };
                this.documents.additional.push(template)
            },
            onRemoveDocument(index) {
                if( this.documents.additional[index].documentdata_id && this.documents.additional[index].documentdata_id !== null ){
                    this.deleteModal.visible = true;
                    this.deleteModal.index = index;
                }
                else{
                    this.documents.additional.splice(index, 1);
                }
            },
            deleteDoc(index) {
                this.deleteModal.visible = false;
                this.deleteModal.index = null;
                deleteAdditionalDocument({documentData_id : this.documents.additional[index].documentdata_id }).then(
                    res => {
                        this.successModal.message = 'Deleted Successfully';
                        this.successModal.visible = true;
                        this.documents.additional.splice(index, 1)
                    }
                )
            },
            cancelDelete() {
                this.deleteModal.index = null;
                this.deleteModal.visible = false;
            },
            getDeclaration() {
                return fetchDeclaration({
                    process_id: this.processId,
                    isRFI: true,
                })
            },
            getCommentLog() {
                return fetchCommentLog({
                    process_id: this.processId,
                    reference_id: this.ticket.reference_id,
                })
            },
            getAdditionalDocuments() {
                return getAdditionalDocuments({
                    process_id: this.processId,
                    reference_id: this.ticket.reference_id,
                    isRFI: true
                })
            },
            getRejectedDocuments() {
                return rejectedDocuments({
                    process_id:this.processId,
                    reference_id: this.ticket.reference_id
                })
            },
            submit() {
                this.$refs.validator.validate().then(result => {
                    if (result) {
                        submitRFIResponse({
                            process_id: this.processId,
                            reference_id: this.ticket.reference_id,
                            Comments: this.Comments
                        }).then(() => {
                            this.modals.success.isVisible = true;
                        })
                    }
                })
            },
            addDeclarationHandler() {
                const { Name, Place, DeclarationDate } = this.declaration;

                const declarationData = {
                    process_id: this.processId,
                    reference_id: this.ticket.reference_id,
                    Name,
                    Place,
                    DeclarationDate
                };
                addDeclaration(declarationData).then(this.addDeclarationSuccess);
            },
            addDeclarationSuccess() {
                this.modals.success.isVisible = true;
            },
            getTicketHandler() {
                const data = {
                    process_id: this.processId,
                    reference_id: +this.$route.params.id || +sessionStorage.getItem(REFERENCE_ID),
                };
                getTicket(data).then(this.getTicketHandlerSuccess)
            },
            getTicketHandlerSuccess(response) {
                this.ticket = response.data[0];
                this.ticketValue = {
                    Referrence: this.ticket && this.ticket !== null ? this.ticket.TicketReference : '',
                    EntityType: this.ticket.EntityType,
                    CompanyName: this.ticket.CompanyName
                }
                Promise.all([
                    this.getCommentLog(),
                    this.getDeclaration(),
                    this.getAdditionalDocuments(),
                    this.getRejectedDocuments()
                ]).then(response => {
                    this.commentLog = response[0].data[0];
                    this.declaration.DisplayText = response[1].data[0].DisplayText;
                    this.documents.additional = response[2].data !== '' ? this.mapDocuments(response[2].data, 'additional') : [];

                    if(response[3].data.mandatory.length > 0) this.documents.rejected.push(...this.mapDocuments(response[3].data.mandatory,'rejected'));
                    if(response[3].data.optional.length > 0) this.documents.rejected.push(...this.mapDocuments(response[3].data.optional,'rejected'));
                    if(response[3].data.additional.length > 0) this.documents.rejected.push(...this.mapDocuments(response[3].data.additional,'rejected'));
                })
            },
            backToList() {
                this.modals.success.isVisible = false;
                this.$router.go(-1)
            },

            onFileChange(file, row) {
                this.documents[row.type][row._index].file = file;
                if(file !== null) this.onSaveDocument(row);
            },

            onDateChange(data, row) {
                this.documents[row.type][row._index].DocumentDate = data;
            },

            onBriefChange(data, row) {
                this.documents[row.type][row._index].documentBrief = data;
            },

            onSaveDocument(row) {
                if (this.validateDocument(row)) {
                    const current = this.documents[row.type][row._index];
                    let data = new FormData();

                    if (current.documentBrief) {
                        data.append("DocumentBrief", current.documentBrief);
                    }
                    if (current.file) {
                        data.append("image", current.file, current.file.name);
                    }
                    data.append("process_id", this.processId);
                    data.append("masterid", current.documentmaster_id);
                    data.append('DocumentData_id',current.documentdata_id)
                    current.type == 'additional' ? data.append("isRFI",  true ) : '';
                    data.append("code", current.DocumentCode);
                    if (current.isDateRequired || current.DocumentDate) {
                        data.append("DocumentDate", current.DocumentDate);
                    }
                    //data.append("user_id", this.userData.user_id);
                    data.append("reference_id", this.ticket.reference_id);
                    const apiType = current.documentmaster_id == 0 || current.documentmaster_id == undefined ? uploadFileAdditional: uploadFile;
                    apiType(data).then((res) => {
                        current.url = res.data.url;
                        current.name = current.file.name;
                        current.isSaved = true;
                        current.isChange = false;
                        current.UploadDate = res.data.UploadDate;
                        current.documentdata_id = res.data.documentdata_id;
                    })
                }
            },
            onChangeDocument(row) {
                const current = this.documents[row.type][row._index];
                if(current.isSaved == false){
                    current.isSaved = true
                    current['isChange'] = false;
                }
                else{
                    current.isSaved = false;
                    current['isChange'] = true;
                }
            },

            validateDocument(row) {
                const current = this.documents[row.type][row._index];
                current.errors = [];
                if (!current.name && !current.file) {
                    current.errors.push('file')
                }
                else if (current.name && !current.file && !current.isSaved) {
                    current.errors.push('file')
                }
                if (row.type === 'rejected') {
                    if (current.isDateRequired && !current.DocumentDate) {
                        current.errors.push('date')
                    }
                }
                if (!current.documentBrief) {
                    current.errors.push('brief')
                }
                return current.errors.length === 0
            },

            mapDocuments(documents, type) {
                return documents.map((document) => {
                    return {
                        reference_id: this.ticket.reference_id,
                        errors: [],
                        type,
                        isSaved: document.name && document.url,
                        file: null,
                        ...document,
                    };
                });
            },
        }
    }
</script>

<style lang="scss" module>

    .info {
        background: #d7d6da;
        box-shadow: 0px 2px 2px #00000059;
        width: 83%;
        font-size: 13px;
        margin: -20px auto 30px;
        hr {
            margin: 5px 15px 0;
            border: none;
            border-bottom: 1px solid #6666;
            clear: both;
        }
        &:after {
            content: '';
            display: block;
            clear: both;
        }
    }
    .infoBlock {
        line-height: 40px;
    }

    .additional {
        position: relative;
    }

    .additionalAdd {
        position: absolute;
        right: -25px;
        top: 36px;

    }

    .verify,
    .note {
        line-height: 21px;
        font-size: 15px;
        padding: 8px 0;
        font-weight: 500;
    }

    .verify {
        margin: 15px 0 -15px;
    }

    .summary {
        font-weight: 700;
        padding: 7px 4px;
    }
    .error {
        color: #ff3547;
        font-size: 11px;
        line-height: 13px;
        font-weight: 400;
    }

    .documents {

        :global {
            .ivu-table,
            .ivu-table-wrapper {
                overflow: visible;
            }
        }
    }
</style>
