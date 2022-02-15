<template>
    <FormWrapper>
        <PageTitle title="Certified Copy" slot="title"  />
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
            <div v-if="form.entityType">
                <CompanyModule v-model="company" />
            </div>
            <div v-if="docList.length > 0">   
                <div :class="$style.checkItem" v-for="(doc,index) in docList" :key="index">
                    <div :class="$style.checkbox"  >
                        <FormCheckbox v-model="doc.copyNeeded" :true-value="1" :false-value="0" />
                    </div>
                    <div :class="$style.checkBrief">
                        {{doc.DocumentBrief}}
                    </div>
                </div>
            </div>

            <div :class="$style.error" v-if="errors.selectAtleastOne">Select at least one record.</div>
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
    import { getEntityType, getCertifiedDoc, requestbyWebuser, generateProcessTicket } from './api';
    import { CERTIFIED_COPY } from 'Config/processIds';
    import PageTitle from 'Components/layout/PageTitle';
    import CompanyModule from 'Components/companyModule/CompanyModule';
    import { ValidationObserver } from "vee-validate";

    export default {
        name: 'CertifiedCopy',
        components:{
            FormWrapper,
            PageTitle,
            CompanyModule,
            ValidationObserver
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
                    MailingAddress_id: null
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
                errors: {
                    selectAtleastOne: false
                }
            }
        },
        created(){
            this.getEntityListHandler();

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
            'form.entityType': function(val){
                if(val !== undefined && val !== null) {
                    this.getDocList(val);
                }
                else{
                    this.docList = []
                }
            },
        },
        methods:{
            checkAtleastOneDocument(){
                const noDocSelected = this.docList.every( item =>item.copyNeeded == 0 || item.copyNeeded == undefined)
                console.log(noDocSelected)
                return noDocSelected
            },
            submitRequest() {
                this.$refs.validator.validate().then((result) => {
                    if(result){
                        if(!this.checkAtleastOneDocument()){
                            this.errors.selectAtleastOne = false;
                            const copyNeeded = this.docList.map( item => {
                                if(item.copyNeeded == 1) {return item.id }
                            } ).join(',');
                            const data = {
                                typeCompanyReg: this.company.typeCompanyReg,
                                typeCompanyName: this.company.typeCompanyName,
                                reference_id: this.form.reference_id,
                                FilingDetail: copyNeeded,
                                process_id: CERTIFIED_COPY,
                                entityType: this.form.entityType,
                                MailingAddress_id: this.form.MailingAddress_id,
                            }
                            requestbyWebuser(data).then(
                                res => {
                                    const objToSend = {
                                        process_id: CERTIFIED_COPY,
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
                        else{
                            this.errors.selectAtleastOne = true;
                        }
                    }
                })
            },
            getDocList(entityType) {
                getCertifiedDoc({entityType: entityType}).then( res => {
                    this.docList = res.data;
                })
            },
            getEntityListHandler() {
                getEntityType(
                    {
                    process_id: CERTIFIED_COPY,
                }
                ).then(res => {
                    this.entityTypes = res.data;
                    if (this.entityTypes.length === 1) {
                        this.innerValue.entityType = this.entityTypes[0].Name
                    }
                })
            },
            backToList() {
                this.modals.success.isVisible = false;
                this.$router.push('/dashboard');
            },
        }
        
    }
</script>

<style lang="scss" module>

    .error {
        color: #ff3547;
        font-size: 11px;
        line-height: 13px;
        font-weight: 400;
        margin-bottom: 20px;
    }
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