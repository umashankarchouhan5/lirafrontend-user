<template>
    <FormWrapper>
        <PageTitle title="Filing of Document" slot="title"  />

        <ValidationObserver ref="validator">
            <FormRow>
                <div class="col-sm-3" >
                    <FormSelect
                        v-model="form.entityType"
                        :items="entityTypes"
                        label="Entity Type"
                        item-name="longName"
                        item-value="Name"
                        rules="required" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-2">
                    <InputText rules="required" noApostrophe label="Reg #" v-model="company.CompanyRegNo" @keyup.native="searchByRegNo" @focusout="searchByRegNoTab" />
                </div>
                <div class="col-sm-6">
                    <FormAutoComplete
                        label="Name"
                        rules="required"
                        v-model="company.Name"
                        :onChange="onSearchName"
                        :items="companies"
                        item-value="Name"
                        item-name="Name"
                        :onSelect="onSelectCompanyByName" />
                </div>
                <div :class="$style.error" v-if="customErrors.notSelectedError">
                    Please Select a valid company before proceeding
                </div>
            </FormRow>
            <Documents :reference_id="form.reference_id" />
        </ValidationObserver>
        <br />
        <FormButton left-icon="ios-arrow-forward" @click="submitRequest">Submit</FormButton>

        <Popup :value="modals.success.isVisible"
               type="success"
               title="Submitted Successfully"
               :closable="false"
               :mask-closable="false"
               @close="() => modals.success.isVisible = false">
            <div :class="$style.success">
                <template v-if="ticket && ticket.TicketReference">
                    <template v-if="modals.success.step === 1">
                        <p>Your request has been submitted successfully.</p>
                        <p>Your request # for future reference is <strong>{{ ticket.TicketReference }}</strong>.</p>
                    </template>
                    <template v-if="modals.success.step === 3">
                        <p>Thank you for your payment.</p>
                        <p>Your case reference #<strong>{{ ticket.TicketReference }}</strong> has been submitted for further processing.</p>
                    </template>
                </template>
                <template v-if="modals.success.step === 4">
                    <p>{{ modals.success.message }}</p>
                </template>
            </div>
            <ButtonGroup slot="footer">
                <FormButton @click="backToList">Back To List</FormButton>
            </ButtonGroup>
        </Popup>
    </FormWrapper>
</template>
<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import { getEntityType, requestbyWebuser, generateProcessTicket, createNewForm } from './api';
    import { FILING_OF_DOCUMENT } from 'Config/processIds';
    import PageTitle from 'Components/layout/PageTitle';
    import { Documents } from  'Organisms/documents';
    import { ValidationObserver } from "vee-validate";
    import FormAutoComplete from 'Components/form/FormAutoComplete';
    import validateDocumentMixin from 'Mixins/validateDocumentMixin';
    import { getCompany } from 'Components/companySearch/api';

    export default {
        name: 'FilingDocumnet',
        mixins: [validateDocumentMixin],
        components:{
            FormWrapper,
            PageTitle,
            Documents,
            ValidationObserver,
            FormAutoComplete
        },
        data(){
            return{
                entityTypes: [],
                companies: [],
                company: {
                    EntityType: null,
                    Name: '',
                    CompanyRegNo: '',
                },
                isSelected: false,
                form: {
                    entityType: null,
                    docDetail: null,
                    reference_id: 0,
                    MailingAddress_id: null,
                    Company_id: null,
                },
                docList: [],
                ticket: {},
                modals: {
                    success: {
                        isVisible: false,
                        step: 1,
                        message: ''
                    },
                    failure: {
                        isVisible: false,
                        step: 1,
                        message: ''
                    }
                },
                documents: {
                    additional: []
                },
                customErrors: {
                    notSelectedError: false,
                },
            }
        },
        computed: {
            processId() {
                return this.$store.state.common.currentProcessId;
            },
            userData() {
                return this.$store.state.user.user;
            },
        },
        watch: {
        },
        created(){
            this.$store.commit('setProcessId', FILING_OF_DOCUMENT);
            this.draftRequest();
            this.getEntityListHandler();
        },
        methods:{
            draftRequest() {
                createNewForm({process_id: FILING_OF_DOCUMENT}).then(
                    res => {
                        this.form.reference_id = res.data[0].TAskReference_id;
                    }
                )
            },
            submitRequest() {
                this.$refs.validator.validate().then((result) => {
                    if (result && this.validateDocuments() ) {
                        const copyNeeded = this.docList.map( item => item.id ).join(',');
                        const data = {
                            reference_id: this.form.reference_id,
                            process_id: FILING_OF_DOCUMENT,
                            entityType: this.form.entityType,
                            Company_id: this.company.id
                        }
                        requestbyWebuser(data).then(
                            res => {
                                const objToSend = {
                                    process_id: FILING_OF_DOCUMENT,
                                    reference_id: res.data[0].reference_id
                                }
                                generateProcessTicket(objToSend).then(
                                    res => {
                                        
                                        this.ticket.TicketReference = res.data[0].TicketReference;
                                        this.ticket.Status_id = res.data[0].Status_id;
                                        this.modals.success.step = 3;
                                        this.modals.success.isVisible = true;
                                    }
                                )
                            }
                        )
                    }
                })
            },
            getEntityListHandler() {
                getEntityType(
                    {
                    process_id: FILING_OF_DOCUMENT,
                }
                ).then(res => {
                    this.entityTypes = res.data;
                    if (this.entityTypes.length === 1) {
                        this.form.entityType = this.entityTypes[0].Name
                    }
                })
            },
            backToList() {
                this.modals.success.isVisible = false;
                this.$router.push('/dashboard');
            },

            //company search start

            searchByRegNo(event) {
                if(event.keyCode === 13 || event.keyCode === 9){
                        this.searchByRegDefault();
                }
            },
            searchByRegNoTab() {
                    this.searchByRegDefault();
            },
            searchByRegDefault(){
                const { CompanyRegNo } = this.company;
                if (CompanyRegNo ) {
                        getCompany({
                            Name: '',
                            RegNo: CompanyRegNo,
                            EntityType: this.form.entityType
                        }).then(res => {
                            if (res.data[0] && res.data[0].length > 0) {
                                this.company = res.data[0][0];
                                this.companies = [];
                                this.isSelected = true;
                                this.form.Company_id = this.company.id;
                                this.$store.commit('setCompany', this.company.id);
                            }else{
                                this.company.Name = '';
                                this.company.id = null;
                            }
                        }
                    )
                }
            },
            onSelectCompanyByName(value) {
                this.company = this.companies.find(item => item.Name === value);
                this.form.Company_id = this.company.id;
                this.$store.commit('setCompany', this.company.id);
                this.isSelected = true;
            },
            reset() {
                this.resetCompany();
                this.entityTypes = [];
                this.companies = [];
                this.isSelected = false;
            },
            resetCompany() {
                this.company = {
                    Name: '',
                    CompanyRegNo: '',
                    id: null,
                    EntityType: 'IBC'
                };
            },
            validateQuery(value) {
                return value.length >= 3
            },resetCompanies() {
                this.companies = [];
            },
            onSearchName(val) {
                if ( this.validateQuery(val) ) {

                    this.resetCompanies();
                    this.searchForCompany(val);
                }
            },
            searchForCompany(Name) {
                getCompany({
                    EntityType: this.form.entityType,
                    Name,
                    RegNo: '',
                }).then(res => {
                    this.companies = res.data[0];
                })
            },
            //company search end
        }
        
    }
</script>

<style lang="scss" module>
    .checkList {
        position: relative;
        min-height: 30px;
        margin-bottom: 20px;
        border-radius: 3px;
        overflow: hidden;
        border: 1px solid #e1e1e1;
    }

    .checkItem {
        padding: 5px 8px;
        border-bottom: 1px solid #e1e1e1;
        display: flex;
        align-items: center;
        background: lighten(#ccc, 17%);

        &:last-child {
            border-bottom: none;
        }
    }

    .checkbox {
        flex-shrink: 0;
        flex-grow: 0;
        width: 25px;
        text-align: center;
        align-self: flex-start;
    }

    .checkBrief {
        flex-grow: 1;
    }
    // .checkbox {
    //     margin-bottom: 10px;
    // }
    
    // .checkboxText{
    //     text-align: justify;
    //     font-size: 14px;
    //     color: #555;
    // }
</style>