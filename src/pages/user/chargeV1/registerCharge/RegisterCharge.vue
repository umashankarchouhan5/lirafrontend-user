<template>
    <FormWrapper>
        <PageTitle title="Register of Charges" slot="title"  :link="`/help/${processId}`"/>
        <div >
            <ValidationObserver ref="validator">
                <div >
                    <FormRow>
                        <div class="col-sm-2">
                            <InputText rules="required" noApostrophe label="Reg #"  v-model="company.CompanyRegNo" @keyup.native="searchByRegNo" @focusout="searchByRegNoTab" />
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
                        <div class="col-sm-2">
                            <FormButton type="primary" @click="checkReference()" :rounded="true">
                                <Icon type="ios-search" />
                            </FormButton>
                        </div>
                    </FormRow>
                </div>
                
            </ValidationObserver>
        </div>
        <br />
        <FormRow>
            <DataTable :actions="true"
                :data="tableData"
                :columns="config()"
            >
            </DataTable>
        </FormRow>
    </FormWrapper>
</template>

<script>
    
    import FormWrapper from 'Components/form/FormWrapper';
    import { getEntityType, getCompany } from 'Components/companySearch/api';
    import FormAutoComplete from 'Components/form/FormAutoComplete';
    // import debounce from 'Utils/debounce';
    import { REGISTER_OF_CHARGE } from 'Config/processIds';
    import PageTitle from 'Components/layout/PageTitle';
    import { ChargeRequest, chargeReferenceSearch, chargeRegister } from './api';
    import DataTable from 'Components/DataTable';
    import config from './table';
    import { ValidationObserver } from "vee-validate";

    export default {
        name: "RegisterCharge",
        data(){
            return {
                companies: [],
                company: {
                    EntityType: 'IBC',
                    Name: '',
                    CompanyRegNo: '',
                },
                isSelected: false,
                openForm: false,
                chargeReferenceNumber: '',
                previousCharges: [],
                tableData: [],
                config,
                customErrors: {
                    notSelectedError: false,
                },
            }
        },
        components: {
            FormAutoComplete,
            FormWrapper,
            PageTitle,
            ValidationObserver,
            DataTable
        },
        created(){
            this.setProcessId();
            // this.searchByRegNo = debounce(this.searchByRegNo, 200);
        },
        computed:{
            processId() {
                return this.$store.state.common.currentProcessId;
            },
            userData() {
                return this.$store.state.user.user;
            },
        },
        watch:{
            'company.CompanyRegNo': function (val) {
                if(val === ''){
                    this.isSelected = false;
                }
            },
            'company.Name': function (val) {
                if(val === '' || val === null || val === undefined){
                    this.isSelected = false;
                }
            },
            '$route.path': function(){
                this.setProcessId();
                this.$forceUpdate()
            }
        },
        methods: {
            openCharge(val) {
                this.$router.push({path: `chargeRegisterTicket/${this.company.id}/${val.ChargeReferenceNumber}`})
            },
            checkReference(){
                this.$refs.validator.validate().then((result) => {
                        if (result) {
                            if(this.isSelected){
                                this.customErrors.notSelectedError = false;
                                chargeRegister({process_id: this.processId, company_id: this.company.id}).then(
                                    res => {
                                        if(res.data[0] && res.data[0][0]){
                                            this.tableData = res.data[0];
                                            // this.$router.replace({name: 'RegisterOfCharge',query: {chargeRef: res.data[0][0].ChargeReferenceNumber,id:this.company.id,ibc_name:this.company.Name}})
                                        }
                                    }
                                )
                            }
                            else{
                                this.customErrors.notSelectedError = true;
                            }
                        }
                        else{
                            this.customErrors.notSelectedError = false;
                        }
                    }
                )
            },
            setProcessId(){
                this.$store.commit('setProcessId', REGISTER_OF_CHARGE);
            },
            searchByRegNo(event) {
                if(event.keyCode === 13 || event.keyCode === 9){
                    if (!this.isSelected) {
                        this.searchByRegDefault();
                    }
                }
            },
            searchByRegNoTab() {
                if (!this.isSelected) {
                    this.searchByRegDefault();
                }
            },
            searchByRegDefault() {
                const { CompanyRegNo } = this.company;
                if (CompanyRegNo ) {
                        getCompany({
                            Name: '',
                            RegNo: CompanyRegNo,
                            process_id: this.processId,
                            ICSP_id: this.userData.icsp_id
                        }).then(res => {
                            if (res.data[0] && res.data[0].length > 0) {
                                this.company = res.data[0][0];
                                
                                this.isSelected = true;
                            }
                        }
                    )
                }
            },
            onSelectCompanyByName(value) {
                this.company = this.companies.find(item => item.Name === value);
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
                };
            },
            validateQuery(value) {
                return value.length >= 3
            },resetCompanies() {
                this.companies = [];
            },
            onSearchName(val) {
                if ( this.validateQuery(val) && !this.isSelected ) {
                    this.resetCompanies();
                    this.searchForCompany(val);
                }
                // this.isSelected = false;
            },
            searchForCompany(Name) {
                getCompany({
                    EntityType: this.company.EntityType,
                    Name,
                    RegNo: '',
                    process_id: this.processId,
                    ICSP_id: this.userData.icsp_id
                }).then(res => {
                    this.companies = res.data[0];
                })
            },
            
        }
    }
</script>

<style lang="scss" module>
    
    .error {
        color: #ff3547;
        position: absolute;
        max-width: 100%;
        left: 0;
        font-size: 11px;
        line-height: 13px;
        bottom: -15px;
        font-weight: 400;
    }
</style>