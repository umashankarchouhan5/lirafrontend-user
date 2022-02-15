<template>
    <div>
        <FormRow>
            <div class="col-sm-3" v-if="innerValue.process_id">
                <FormSelect :disabled="readonly"
                    v-model="company.EntityType"
                    :items="entityTypes"
                    label="Entity Type"
                    item-name="longName"
                    item-value="Name"
                    rules="required" />
            </div>
        </FormRow>
        <FormRow v-if="innerValue.process_id ">
            <div class="col-sm-6">
                <div class="row">
                    <div class="col-sm-6">
                        <InputText rules="required" noApostrophe label="Reg #" :disabled="readonly || !entitySelected" v-model="company.CompanyRegNo" @keyup.native="searchByRegNo" @focusout="searchByRegNoTab" />
                    </div>
                    <div class="col-sm-6">
                        <FormAutoComplete
                            :disabled="readonly || !entitySelected"
                            label="Name"
                            rules="required"
                            v-model="company.Name"
                            :onChange="onSearchName"
                            :items="companies"
                            item-value="Name"
                            item-name="Name"
                            :onSelect="onSelectCompanyByName" />
                    </div>
                </div>
            </div>
        </FormRow>
        <FormRow v-if="company.id">
            <div class="col-sm-7">
                <AddressInput readonly label="Company Address" :value="company.Address_id" />
            </div>
        </FormRow>
        <FormRow>
            <div :class="$style.checkbox">
                <FormCheckbox  :disabled="readonly" name="Declaration_confirm" v-model="value.isChecked">
                    <span :class="$style.checkboxText">Please mail me the certificate</span>
                </FormCheckbox>
            </div>
        </FormRow>
        <FormRow v-if="value.isChecked">
            <div class="col-sm-7">
                <AddressInput  label="Mailing Address"  v-model="value.MailingAddress_id"/>
            </div>
        </FormRow>
    </div>
</template>
<script>
    import AddressInput from 'Components/form/addressInput/AddressInput';
    import valueMixin from 'Mixins/valueMixin';
    import { getEntityType, getCompany, getExcludedCompany, getICSPforCompany } from 'Components/companySearch/api';
    // import { getPcWeb } from '../api';
    import FormAutoComplete from 'Components/form/FormAutoComplete';
    // import debounce from 'Utils/debounce';

    export default {
        name: 'RequestCertificate',
        mixins: [valueMixin],
        components:{
            AddressInput,
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
                entitySelected: false,
            }
        },
        created(){
            this.getEntityListHandler();
            // this.searchByRegNo = debounce(this.searchByRegNo, 200);
            if(this.selectedCompany !== null){
                this.company = this.selectedCompany;
            }

        },
        props: {
            mode: String,
            steps: Array,
            readonly: Boolean,
            customErrors: Array,
            value: {
                type: Object,
                required: true,
            },
        },
        computed: {
            selectedCompany(){
                return this.$store.state.user.selectedCompany;
            },
            processId() {
                return this.$store.state.common.currentProcessId;
            },
            userData() {
                return this.$store.state.user.user;
            },
        },
        watch: {
            'innerValue.process_id': function (newValue) {
                this.$store.commit('setProcessId', newValue);
                this.reset();
                this.getEntityListHandler();
            },
            // 'company.CompanyRegNo': function () {
            //     if (!this.isSelected) {
            //         this.searchByRegNo()
            //     }
            // },
            'company.EntityType': function(val){
                this.$store.commit('setChangeEntityType',val);
                if(val !== null && val !== undefined){
                    this.entitySelected = true;
                }else{
                    this.entitySelected = false;
                    this.resetCompany();
                    this.resetCompanies();
                }
            },
        },
        methods:{
            searchByRegNoTab() {
                if (!this.isSelected) {
                    const { CompanyRegNo } = this.company;
                    if (CompanyRegNo) {
                        getCompany({
                            EntityType: null,
                            Name: '',
                            RegNo: CompanyRegNo,
                            process_id: this.processId
                        }).then(res => {
                            if (res.data[0] && res.data[0].length > 0) {
                                this.company = res.data[0][0];
                                this.innerValue.Company_id = this.company.id
                                this.innerValue.Address_id = this.company.Address_id;
                                this.isSelected = false;
                                // this.getPcWebData();
                            }
                        })
                    }
                }
            },
            searchByRegNo(event) {
                if(event.keyCode === 13){
                    if (!this.isSelected) {
                        const { CompanyRegNo } = this.company;
                        if (CompanyRegNo) {
                            getCompany({
                                EntityType: null,
                                Name: '',
                                RegNo: CompanyRegNo,
                                process_id: this.processId
                            }).then(res => {
                                if (res.data[0] && res.data[0].length > 0) {
                                    this.company = res.data[0][0];
                                    this.innerValue.Company_id = this.company.id
                                    this.innerValue.Address_id = this.company.Address_id;
                                    this.isSelected = false;
                                    // this.getPcWebData();
                                }
                            })
                        }
                    }
                }
            },
            onSelectCompanyByName(value) {
                this.company = this.companies.find(item => item.Name === value);
                this.innerValue.Company_id = this.company.id;
                var self = this;
                if(this.innerValue.process_id !== 300){
                    this.innerValue.Address_id = this.company.Address_id;
                }
                if(this.innerValue.process_id === 300){
                    getICSPforCompany({company_id: self.company.id}).then(
                        (res) => {
                            self.innerValue.address_id = res.data[0].Address_id;
                            self.innerValue.OutgoingICSP_id = res.data[0].ICSP_id;
                            self.outgoingICSP.name = res.data[0].ICSP;
                            self.outgoingICSP.address = res.data[0].Address_id;
                        }
                    )
                }
                this.isSelected = true;
                this.$store.commit('setCompany',this.company);
            },
            reset() {
                this.resetCompany();
                this.entityTypes = [];
                this.companies = [];
                this.isSelected = false;
                this.innerValue.address_id = null;
            },
            resetCompany() {
                this.company = {
                    EntityType: null,
                    Name: '',
                    CompanyRegNo: '',
                };
            },
            validateQuery(value) {
                return value.length >= 3
            },
            resetCompanies() {
                this.companies = [];
            },
            onSearchName(val) {
                if (this.validateQuery(val) && !this.isSelected) {
                    this.resetCompanies();
                    this.searchForCompany(val);
                }
                this.isSelected = false;
            },
            searchForCompany(Name) {
                const { EntityType } = this.company;
                getCompany({
                    EntityType,
                    Name,
                    RegNo: '',
                    process_id: this.processId,
                    ICSP_id: this.userData.icsp_id
                }).then(res => {
                    this.companies = res.data[0];
                    // this.getPcWebData();
                })
                
            },
            getEntityListHandler() {
                getEntityType({
                    process_id: this.processId,
                    icsp_id: this.userData.icsp_id
                }).then(res => {
                    this.entityTypes = res.data;
                    if (this.entityTypes.length === 1) {
                        this.company.EntityType = this.entityTypes[0].Name
                    }
                })
            },
        }
        
    }
</script>

<style lang="scss" module>
    
    .checkbox {
        margin-bottom: 10px;
    }
    
    .checkboxText{
        text-align: justify;
        font-size: 14px;
        color: #555;
    }
</style>