<template>
    <FormWrapper>
        <PageTitle title="ROD Updates" slot="title"  :link="`/help/${processId}`"/>        
        <div >
            <!-- <ValidationObserver ref="validator"> -->
                
                    <FormRow>
                        <div class="col-sm-2">
                            <InputText label="Reg #" noApostrophe v-model="company.CompanyRegNo"  @keyup.native="searchByRegNo" @focusout="searchByRegNoTab" />
                        </div>
                        <div class="col-sm-6">
                            <FormAutoComplete
                                label="Name"
                                v-model="company.Name"
                                :onChange="onSearchName"
                                :items="companies"
                                item-value="Name"
                                item-name="Name"
                                :onSelect="onSelectCompanyByName" />
                        </div>
                    </FormRow>
                    <br />
                
            <!-- </ValidationObserver> -->
        </div>
        <div v-if="isSelected">
            <CompanyPerson v-model="info"></CompanyPerson>
        </div>
    </FormWrapper>
</template>

<script>
    
    import FormWrapper from 'Components/form/FormWrapper';
    import { getEntityType, getCompany, getExcludedCompany, getICSPforCompany } from 'Components/companySearch/api';
    import FormAutoComplete from 'Components/form/FormAutoComplete';
    import debounce from 'Utils/debounce';
    import { ROD_PROCESS_INCREMENTAL_ID} from 'Config/processIds';
    import PageTitle from 'Components/layout/PageTitle';
    // import DataTable from 'Components/DataTable';
    // import config from './table';
    // import { ValidationObserver } from "vee-validate";
    import CompanyPerson from './components/CompanyPersons';

    export default {
        name: "RegisterOfDirectorUpdates",
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
                info:{
                    company:  {
                        EntityType: 'IBC',
                        Name: '',
                        CompanyRegNo: '',
                    },
                    reference_id: 0,
                    process_id: ROD_PROCESS_INCREMENTAL_ID
                }
            }
        },
        components: {
            FormAutoComplete,
            FormWrapper,
            PageTitle,
            // ValidationObserver,
            CompanyPerson,
            // DataTable
        },
        created(){
            this.setProcessId();
            this.searchByRegNo = debounce(this.searchByRegNo, 200);
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
                if (val == undefined || val == '') {
                    this.reset();
                }
            },
            'company.Name': function (val) {
                if (val == undefined || val == null || val == '') {
                    this.reset();
                }
            },
        },
        methods: {
            setProcessId(){
                this.$store.commit('setProcessId', ROD_PROCESS_INCREMENTAL_ID);
            },
            searchByRegNo(event){
                
                if(event.keyCode === 13){
                    if (!this.isSelected) {
                        this.searchByRegNoDefault();
                    }
                }
            },
            searchByRegNoTab(){
                if (!this.isSelected) {
                    this.searchByRegNoDefault();
                }

            },
            searchByRegNoDefault() {
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
                                this.info.company = res.data[0][0];
                                // this.isSelected = false;
                                // this.isSelected = true;
                                
                                this.isSelected = true;
                                this.$store.commit('setCompany',this.company);
                            }
                        }
                    )
                }
            },
            onSelectCompanyByName(value) {
                this.company = this.companies.find(item => item.Name === value);
                this.info.company = this.company;
                this.isSelected = true;
                this.$store.commit('setCompany',this.company);
            },
            reset() {
                this.entityTypes = [];
                this.companies = [];
                this.isSelected = false;
                this.resetCompany();
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

</style>