<template>
    <FormWrapper>
        <PageTitle slot="title" title="Requested Documents" />
        <DataTable :actions="true"
            :data="documents"
            :columns="tableConfig()"
            :is-loading="isLoading">

        </DataTable>
    </FormWrapper>
</template>


<script>
    import { getRegisteredDocumentForTicketReference, upload } from '../api';
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    import loadingMixin from 'Mixins/loadingMixin';
    import tableConfig from './table';

    export default {
        name: 'RequestedDocuments',
        mixins: [ loadingMixin ],
        components: {
            FormWrapper,
            PageTitle,
            DataTable,
        },
        data() {
            return {
                documents: [],
                TicketReference: null,
                tableConfig
            }
        },
        created() {
            this.TicketReference = this.$route.params.ticketReference;
            this.getList()
        },
        methods: {
            getList() {
                getRegisteredDocumentForTicketReference({TicketReference: this.TicketReference}).then(
                    res => {
                        this.documents = this.mapDocuments(res.data[0]);
                    }
                )
            },
            onFileChange(file, row) {
                this.documents[row._index].file = file;
                if(file !== null) this.onSaveDocument(row);
            },

            onDateChange(data, row) {
                this.documents[row._index].registrationDate = data;
            },

            onBriefChange(data, row) {
                this.documents[row._index].documentBrief = data;
            },
            
            onChangeDocument(row) {
                // if (this.validateDocument(row)) {
                    const current = this.documents[row._index];
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
                    const current = this.documents[row._index];
                    let data = new FormData();
                    if (current.documentBrief) {
                        data.append("DocumentBrief", current.documentBrief);
                    }
                    if (current.file) {
                        data.append("image", current.file, current.file.name);
                    }
                    data.append("process_id", current.process_id);
                    if(current.registeredDocumentData_id && current.registeredDocumentData_id !== null) data.append('DocumentData_id',current.registeredDocumentData_id)
                    data.append("registrationDate", current.registrationDate);
                    data.append("registeredDocument_id", current.registeredDocument_id);
                    data.append("reference_id", current.reference_id);

                    upload(data).then((res) => {
                        current.RegisteredDocument = res.data.url;
                        current.name = current.file.name;
                        current.UploadDate = res.data.UploadDate,
                        current.isSaved = true;
                        current.isChange = false;
                        current.registeredDocumentData_id = res.data.documentdata_id;
                        // current.isAccepted = null;
                    })
                }
            },
            
            validateDocument(row) {
                const current = this.documents[row._index];
                current.errors = [];
                if (!current.name && !current.file) {
                    current.errors.push('file')
                }
                else if (current.name && !current.file && !current.isSaved) {
                    current.errors.push('file')
                }
                if (!current.registrationDate) {
                    current.errors.push('date')
                }

                return current.errors.length === 0
            },

            mapDocuments(documents, type) {
                return documents.map((document) => {
                    return {
                        errors: [],
                        isSaved: document.RegisteredDocument !== null,
                        file: null,
                        ...document,
                    };
                });
            },

        }
    }
</script>