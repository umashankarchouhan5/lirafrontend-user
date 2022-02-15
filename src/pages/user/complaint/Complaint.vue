<template> 
    <FormWrapper>
        <PageTitle :title="pageTitle" slot="title"/>

        <div v-if="instructions">

            <div v-html="instructionData"> </div>
            <br />
            <FormButton left-icon="md-checkmark-circle-outline" type="success" @click="proceedToComplaint()" >
                Proceed
            </FormButton>
        </div>
        <div v-else>
            <ValidationObserver ref="validator">
                
                <h4>1. Details of Complainant </h4>
                <br />
                <FormRow>
                    <div class="col-sm-2">
                        <InputText readonly label="Title"  v-model="userData.Salutation" />
                    </div>
                    <div class="col-sm-3">
                        <InputText readonly label="First Name" v-model="userData.Fname" />
                    </div>
                    <div class="col-sm-3">
                        <InputText readonly label="Last Name" v-model="userData.Lname" />
                    </div>
                    
                    <div class="col-sm-3">
                        <InputText readonly label="Email" v-model="userData.email" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-6">
                        <AddressInput readonly  label="Business Address" v-model="userData.Address_id" />
                    </div>
                    <div class="col-sm-6">
                        <AddressInput  label="Residence Address" v-model="form.ResAddress_id" />
                    </div>
                </FormRow>
                    
                <FormRow>
                    <div class="col-sm-4" v-if="userData.license_id !== undefined && userData.license_id !== null && userData.license_id !== 0">
                        <InputText readonly label="Company" v-model="userData.company" />
                    </div> 
                    <div class="col-sm-4">
                        <InputTel readonly label="Mobile" v-model="userData.Mobile" />
                    </div>
                    <div class="col-sm-4">
                        <InputTel  label="Alternate Phone Number" v-model="form.AlternatePhone" />
                    </div>  
                </FormRow>

                <FormRow>
                    <div class="col-sm-12">
                        <InputText  label="Subject : Brief summary about complaint" v-model="form.Subject" rules="required"  zplaceholder="Brief summary about complaint" />
                    </div>   
                </FormRow>

                <h6>2. Details of the incident(s)</h6>

                <p>Full name, address and contact details of licensed entity/person (s) that you wish to lodge a complaint against: </p>
                <br/>
                <FormRow>
                    <div class="col-sm-12">
                        <InputTextArea  label="Name" name="Name" vid="nameAgainst" rules="required" rows="2" maxlength="250" v-model="form.ComplaintAgainstName"  />
                    </div>   
                </FormRow>

                <FormRow>
                    <div class="col-sm-12">
                        <InputTextArea  label="Address" vid="addressAgainst" rules="required" rows="2" maxlength="250" v-model="form.ComplaintAgainstAddress"  />
                    </div>   
                </FormRow>

                <FormRow>
                    <div class="col-sm-12">
                        <InputTextArea  label="Contact Details" vid="contactAgainst" rules="required" rows="2" maxlength="250" v-model="form.ComplaintAgainstContactDetail"  />
                    </div>   
                </FormRow>

                <FormRow>
                    <div class="col-sm-3">
                        <InputDate  label="Date of Incident" rules="required" :options="options" v-model="form.IncidentDate"  />
                    </div>   
                    <div class="col-sm-3">
                        <InputTime  label="Time of Incident (24 hours format)"  v-model="form.IncidentTime"  />
                    </div>   
                </FormRow>
                
                <FormRow>
                    <div class="col-sm-12">
                        <InputTextArea  label="Please describe precisely the details of your complaint. Please write clearly and legibly." v-model="form.ComplaintSummary" rules="required" rows="14" :maxlength="2000" />
                    </div>   
                </FormRow>
                <br />
                <div :class="$style.additional">
                    <h4>Upload documents in support of your complaint. (Please enclose copies of all relevant documents e.g. Correspondences, Agreements, Proof of payments/invoices etc.)</h4>
                    <DataTable :class="$style.documents" ref="nonComponentDocument" no-data-text="No Documents Attached" :columns="columns()" :data="documents.additional" />
                    <div :class="$style.additionalAdd">
                        <AddRemoveButton v-if="documents.additional.length === 0" :is-last="true" @add="onAddDocument" @remove="onRemoveDocument" size="small" :length="documents.additional.length" />

                    </div>
                </div>
                <br>
                <FormRow>
                    <div class="col-sm-12">
                        <Declaration v-model="declaration" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-12">
                        <ButtonGroup>
                            <FormButton
                                    left-icon="md-checkmark-circle-outline"
                                    type="success"
                                    @click="submitData()"
                                    >
                                Submit
                            </FormButton>
                        </ButtonGroup>
                    </div>
                </FormRow>
            </ValidationObserver>
        </div>

        <Popup :value="modals.success.isVisible" :closable="false" :mask-closable="false" type="success" title="Submitted Successfully"
                @close="() => modals.success.isVisible = false">
            <p>Your complaint has been submitted. Your reference # is <strong>{{ ticketReference }}</strong></p>
            <ButtonGroup slot="footer">
                <FormButton @click="backToList">Back</FormButton>
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

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import Declaration, { fetchDeclaration, addDeclaration } from 'Components/Declaration';
    import DateUtil from 'Utils/dateUtil';
    import { ValidationObserver } from "vee-validate"; 
    import { COMPLAINT } from 'Config/processIds';
    import tableAdditional from './table/table';
    import DataTable from 'Components/DataTable';
    import AddressInput from 'Components/form/addressInput/AddressInput';
    import InputTel from 'Components/form/InputTel';
    import InputDate from 'Components/form/InputDate';
    import InputTime from 'Components/form/InputTime';
    import AddRemoveButton from 'Components/AddRemoveButton'
    import { createDraft, generateProcessTicket, uploadDocument, submitForm, fetchInstructions, deleteAdditionalDocument } from './api';

    export default {
        name: "Complaint",
        components: {
            DataTable,
            FormWrapper,
            PageTitle,
            ValidationObserver,
            Declaration,
            AddressInput,
            InputTel,
            InputDate,
            InputTime,
            AddRemoveButton,
        },
        data() {
            return {
                form:{
                    ResAddress_id: '',
                    AlternatePhone: '',
                    Subject: '',
                    ComplaintAgainstContactName: '',
                    ComplaintAgainstContactAddress: '',
                    ComplaintAgainstContactDetail: '',
                    IncidentDate: null,
                    IncidentTime: '',
                    ComplaintSummary:'',
                    reference_id: 0,
                },
                ticketReference: null,

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
                
                documents: {
                    additional: []
                },
                columns: tableAdditional,
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                instructionData: [],
                instructions: true,
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
            userData() {
                return this.$store.state.user.user;
            },
            processId() {
                return this.$store.state.common.currentProcessId;
            },
            pageTitle() {
                return `Complaint`
            },
        },
        created() {
            this.columns = this.columns.bind(this);
            this.getInstructions();
            if( this.documents.additional.length === 0){
                this.onAddDocument();
            }
        },
        methods: {
            validateAdditionalDocuments() {
                const isAdditionalDocumentsUploaded = this.documents.additional.every(item => {
                    if(item.file !== null){
                        return item.name ? true : false;
                    }
                    else if(item.documentBrief && item.documentBrief.trim() !== ''){
                        return item.name ? true : false;
                    }
                    return true;
                });
                if (!isAdditionalDocumentsUploaded) {
                    this.$store.commit('checkAdditionalUploaded',true)
                    return false;
                }
                return true;
            },
            proceedToComplaint(){
                this.generateDraft();
                this.getDeclaration();
            },
            getInstructions(){
                fetchInstructions({process_id: COMPLAINT }).then(
                    res=>{
                        this.instructionData = res.data.Instructions;
                    }
                )
            },
            generateDraft(){
                createDraft({process_id: COMPLAINT}).then(
                    res => {
                        this.form.reference_id = res.data[0].TAskReference_id;
                        this.instructions = false;
                    }
                )
            },
            submitData(){
                this.$refs.validator.validate().then(result => {
                    if (result && this.validateAdditionalDocuments()) {
                        this.addDeclarationHandler();
                           
                    }
                })
            },
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
                    url: '',
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
                fetchDeclaration({
                    process_id: COMPLAINT,
                }).then(
                    res => {
                        
                        this.declaration.DisplayText = res.data[0].DisplayText;
                    }
                )
            },
            addDeclarationHandler() {
                const { Name, Place, DeclarationDate } = this.declaration;

                const declarationData = {
                    process_id: COMPLAINT,
                    reference_id: this.form.reference_id,
                    Name,
                    Place,
                    DeclarationDate
                };
                addDeclaration(declarationData).then(this.addDeclarationSuccess);
            },
            addDeclarationSuccess() {
                // this.modals.success.isVisible = true;
                
                submitForm(this.form).then(() => {
                    const data = {
                        process_id: COMPLAINT,
                        reference_id: this.form.reference_id
                    }
                    generateProcessTicket(data).then(
                        res => {
                            this.ticketReference = res.data[0].TicketReference;
                            this.modals.success.isVisible = true;

                        }
                    )
                })
            },
            
            backToList() {
                this.modals.success.isVisible = false;
                setTimeout(() => {
                    this.$router.push('/dashboard');
                },100)
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
                    if (current.isDateRequired) {
                        data.append("DocumentDate", current.DocumentDate);
                    }
                    data.append("reference_id", this.form.reference_id);

                    uploadDocument(data).then((res) => {
                        current.url = res.data.url;
                        current.name = current.file.name;
                        current.isSaved = true;
                        current.documentdata_id = res.data.documentdata_id;
                    })
                }
            },
            onChangeDocument(row) {
                if (this.validateDocument(row)) {
                    const current = this.documents[row.type][row._index];
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
                if (!current.documentBrief) {
                    current.errors.push('brief')
                }
                return current.errors.length === 0
            },

        },
        beforeDestroy(){
            this.$store.commit('checkAdditionalUploaded',false);
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
