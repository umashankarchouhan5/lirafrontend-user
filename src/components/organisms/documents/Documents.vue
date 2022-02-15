<template>
    <div>
        <FormRow>
            <div class="col-sm-12">
                <p :class="$style.note" v-if="documents.mandatory.length > 0 && mandatoryDocumentText == null">Please attach the following mandatory documents and remember to save them.</p>
                <p :class="$style.note" v-if="documents.mandatory.length > 0 &&     mandatoryDocumentText != null">{{mandatoryDocumentText}}</p>
                <DataTable v-if="documents.mandatory.length > 0" no-data-text="No Documents Attached" :class="$style.maxWidth" :columns="columns.mandatory()" :data="documents.mandatory"  />
                <div v-if="documents.mandatory.length > 0" :class="$style.summary">{{ documentsTotal }} required documents received</div>
                <div  :class="$style.error" v-if="error.areAllUploaded">Please upload all mandatory documents.</div>
                <br v-if="documents.mandatory.length > 0">

                <p :class="$style.note" v-if="documents.optional.length > 0">Please attach optional documents, if any, and remember to save them.</p>
                <DataTable no-data-text="No Documents Attached" v-if="documents.optional.length > 0" :class="$style.maxWidth" :columns="columns.optional()" :data="documents.optional" />
                <br v-if="documents.mandatory.length > 0">

                <p :class="$style.note">Please attach any additional documents relevant to the application and remember to save them.</p>
                <div :class="$style.additional">
                    <DataTable :class="$style.documents"  no-data-text="No Documents Attached" :columns="columns.additional()" :data="documents.additional" />
                    <div :class="$style.additionalAdd">
                        <AddRemoveButton :is-last="true" v-if="documents.additional.length === 0 &&  !readonly" @add="onAddDocument" @remove="onRemoveDocument" :length="documents.additional.length" size="small" />
                    </div>
                </div>
                <p :class="$style.verify" v-if="processId && processId !== 702">Please verify all the documents before submission. You will not be able to modify the document once submission is made.</p>
            </div>
        </FormRow>
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
    </div>
</template>

<script>

    import { uploadFile, uploadFileAdditional, getTaskDocuments, deleteAdditionalDocument } from './api';
    import tableAdditional from './config/tableAdditional';
    import tableMandatory from './config/tableMandatory';
    import tableOptional from './config/tableOptional';
    import DataTable from 'Components/DataTable';
    import AddRemoveButton from 'Components/AddRemoveButton'

    const CompanyProcesses = [ 109, 201, 202, 203, 301, 303, 304, 305, 307, 106, 401, 402, 404, 407, 602 ]

    export default {
        name: "Documents",
        data() {
            return {
                documents: {
                    mandatory: [],
                    optional: [],
                    additional: []
                },
                columns: {
                    mandatory: tableMandatory,
                    optional: tableOptional,
                    additional: tableAdditional
                },
                error: {
                    areAllUploaded: false,
                    areDateFilled: false,
                    areAllAdditionalUploaded: false,
                    areAllOptionalUploaded: false,
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
        components: {
            DataTable,
            AddRemoveButton
        },
        created() {
            this.columns.mandatory = this.columns.mandatory.bind(this);
            this.columns.optional = this.columns.optional.bind(this);
            this.columns.additional = this.columns.additional.bind(this);
            this.getDocuments().then(this.getDocumentsResponse)
        },
        computed: {
            processId() {
                return this.$store.state.common.currentProcessId;
            },
            userData() {
                return this.$store.state.user.user;
            },
            documentsTotal() {
                const existingDocuments = this.documents.mandatory.filter(item => item.name);
                return `${existingDocuments.length} of ${this.documents.mandatory.length}`
            },
        },
        props: {
            readonly: Boolean,
            reference_id: {
                type: [Number, String],
                required: true
            },
            mandatoryDocumentText: {
                type: String,
                default: null,
            }
        },
        watch:{
            'error.areAllUploaded':function(val){
                this.$store.commit('checkAllUploaded',val)
                return val;
            },
            'error.areAllAdditionalUploaded':function(val){
                this.$store.commit('checkAdditionalUploaded',val)
                return val;
            },
            'error.areAllOptionalUploaded':function(val){
                this.$store.commit('checkOptionalUploaded',val)
                return val;
            }
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
                    name: null,
                    path: '',
                    url: '',
                    isSaved: false
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
            getDocuments() {
                return getTaskDocuments({
                    process_id: this.processId,
                    reference_id: this.reference_id,
                })
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
            
            onChangeDocument(row) {
                // if (this.validateDocument(row)) {
                    const current = this.documents[row.type][row._index];
                    if(current.isSaved == false){
                        current.isSaved = true
                        current['isChange'] = false;
                    }
                    else{
                        current.isSaved = false;
                        current['isChange'] = true;
                    }
                // }
            },

            onSaveDocument(row) {
                if (this.validateDocument(row)) {
                    const current = this.documents[row.type][row._index];
                    let data = new FormData();
                    if(CompanyProcesses.indexOf(this.processId) !== -1 ){
                        var company = this.$store.state.user.selectedCompany;
                        data.append('company_id',company.id);
                    }
                    if (current.documentBrief) {
                        data.append("DocumentBrief", current.documentBrief);
                    }
                    if (current.file) {
                        data.append("image", current.file, current.file.name);
                    }
                    data.append("process_id", this.processId);
                    data.append("masterid", current.documentmaster_id);
                    data.append("code", current.DocumentCode);
                    data.append('DocumentData_id',current.documentdata_id)
                    if (current.isDateRequired || current.DocumentDate) {
                        data.append("DocumentDate", current.DocumentDate);
                    }
                    data.append("user_id", this.userData.user_id);
                    data.append("reference_id", this.reference_id);

                    const uploadFunction = current.type === 'additional' ? uploadFileAdditional : uploadFile;

                    uploadFunction(data).then((res) => {
                        current.url = res.data.url;
                        current.name = current.file.name;
                        current.UploadDate = res.data.UploadDate,
                        current.isSaved = true;
                        current.isChange = false;
                        current.documentdata_id = res.data.documentdata_id;
                        // current.isAccepted = null;
                    })
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
                if (row.type === 'mandatory') {
                    if (current.isDateRequired && !current.DocumentDate) {
                        current.errors.push('date')
                    }
                }

                if (row.type === 'optional') {
                    if (current.isDateRequired && !current.DocumentDate) {
                        current.errors.push('date')
                    }
                }

                if (row.type === 'additional') {
                    if (!current.documentBrief) {
                        current.errors.push('brief')
                    }
                }
                return current.errors.length === 0
            },

            mapDocuments(documents, type) {
                return documents.map((document) => {
                    return {
                        reference_id: this.reference_id,
                        errors: [],
                        type,
                        isSaved: document.name && document.url,
                        file: null,
                        ...document,
                    };
                });
            },

            getDocumentsResponse(response) {
                const documents = response.data;
                this.documents.mandatory = this.mapDocuments(documents.mandatory, 'mandatory');
                this.documents.optional = this.mapDocuments(documents.optional, 'optional');
                this.documents.additional = this.mapDocuments(documents.additional, 'additional');
                if( this.documents.additional.length === 0){
                    this.onAddDocument();
                }
            },
        },
        beforeDestroy(){
            this.$store.commit('checkAllUploaded',false);
            this.$store.commit('checkAdditionalUploaded',false);
        }
    }
</script>

<style lang="scss" module>
    .maxWidth{
        max-width: 100%;
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
        // max-width: 100%;
        // // padding: 0px 40px;
        // box-sizing: border-box;
        // overflow: hidden;
        // .DataTable_block{
        //     // overflow: hidden;
        // }
        :global {
            .ivu-table,
            .ivu-table-wrapper {
                overflow: visible;
            }
        }
    }
    :global {
        .ivu-table td.demo-table-info-documentBrief .ivu-table-cell span{
            word-break: break-word!important;
        }
    }
</style>


