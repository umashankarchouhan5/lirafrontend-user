<template>
    <div>
        <FormRow>
            <div class="col-sm-2" >
                <FormSelect :disabled="readonly || dataSelected"
                    v-model="company.EntityType"
                    :items="entityTypes"
                    label="Entity Type"
                    item-name="Name"
                    item-value="Name"
                    rules="required" />
            </div>
            <div class="col-sm-2">
                <InputText rules="required" noApostrophe label="Reg #" :disabled="readonly || !entitySelected" v-model="company.CompanyRegNo" @keyup.native="searchByRegNo" @focusout="searchByRegNoTab" />
            </div>
            <div class="col-sm-6">
                <FormAutoComplete
                    :disabled="readonly || !entitySelected"
                    label="Company Name"
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
    </div>
</template>

<script>

    import valueMixin from 'Mixins/valueMixin';
    import { getEntityType, getCompany } from 'Components/companySearch/api';
    import FormAutoComplete from 'Components/form/FormAutoComplete';
    import { RESTORATION_BY_COURT_ORDER  } from 'Config/processIds';
    import { getStrikeOffReason } from '../../api';

    export default {
        name: "GeneralInfo",
        mixins: [valueMixin],
        components: {
            FormAutoComplete,
        },
        props: {
            mode: String,
            icsp_ids: Array,
            process_ids: Array,
            steps: Array,
            readonly: Boolean,
            customErrors: [Array,Object],
        },
        data() {
            return {
                entitySelected: false,
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                entityTypes: [{Name: 'IBC'},{Name: 'Foundation'}],
                companies: [],
                company: {
                    EntityType: null,
                    Name: '',
                    CompanyRegNo: '',
                },
                isSelected: false,
                dataSelected: false,
                reasons: []
            }
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
        created() {
            // this.getData();
            // this.getEntityListHandler();
            if(this.selectedCompany !== null && this.readonly !== true && this.$route.name == 'DissolutionRegistrationByID' && this.innerValue.company_id){
                this.company = this.selectedCompany;
            }
            if(this.innerValue.length > 0 && this.innerValue.company_id !== undefined && this.innerValue.company_id !== null && this.mode === 'edit'){
                this.company.id = this.innerValue.company_id;
                this.company.EntityType = this.innerValue.entityType;
                this.company.CompanyRegNo = this.innerValue.companyRegNo;
                this.company.Name = this.innerValue.companyName;
                this.$store.commit('setCompany',this.company);
            }
        },
        watch: {
            'innerValue.company_id': function(val){
                if(this.innerValue.company_id !== undefined && this.innerValue.company_id !== null && this.mode === 'edit'){
                this.company.id = this.innerValue.company_id;
                this.company.EntityType = this.innerValue.entityType;
                this.company.CompanyRegNo = this.innerValue.companyRegNo;
                this.company.Name = this.innerValue.companyName;
                this.$store.commit('setCompany',this.company);
            }
            },
            'company.EntityType': function(val){
                if(val !== null && val !== undefined){
                    this.entitySelected = true;
                }else{
                    this.entitySelected = false;
                    this.resetCompany();
                    this.resetCompanies();
                }
            },
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
            processId(val) {
                if(val !== null && val !== undefined){
                    // this.getEntityListHandler();
                }
            }
            
        },
        methods: {
            getData(){
                Promise.all([
                    getStrikeOffReason({process_id: RESTORATION_BY_COURT_ORDER})
                ]).then(this.handleResponse)
            },
            handleResponse(response) {
                this.reasons = response[0].data;
            },
            selectReason(id){
                if(id !== undefined && id !== null ){
                    this.innerValue.cessationReason = this.reasons.find( ele => ele.id === id).description 
                }else{
                    this.innerValue.cessationReason = '';
                }
            },
            getEntityListHandler() {
                getEntityType({
                    process_id: RESTORATION_BY_COURT_ORDER,
                    icsp_id: this.userData.icsp_id
                }).then(res => {
                    this.entityTypes = res.data;
                    if (this.entityTypes.length === 1) {
                        if(this.innerValue.reference_id === 0){
                            this.company.EntityType = this.entityTypes[0].Name;
                        }
                    }
                })
            },
            searchByRegNoTab() {
                
                if (!this.isSelected && this.company.CompanyRegNo != '') {
                    const { CompanyRegNo } = this.company;
                    const { EntityType } = this.company;
                    getCompany({
                        EntityType: EntityType,
                        Name: '',
                        RegNo: CompanyRegNo,
                        process_id: this.processId,
                        ICSP_id: this.userData.icsp_id
                    }).then(res => {
                        if (res.data[0] && res.data[0].length > 0) {
                            this.company = res.data[0][0];
                            this.innerValue.company_id = this.company.id;
                            this.innerValue.companyName = this.company.Name;
                            this.innerValue.companyRegNo = this.company.CompanyRegNo;
                            this.innerValue.Address_id = this.company.Address_id;
                            this.isSelected = true;
                            this.$store.commit('setCompany',this.company);
                        }
                    })
                }
            },
            searchByRegNo(event) {
                if(event.keyCode === 13){
                    if (!this.isSelected) {
                        const { CompanyRegNo } = this.company;
                        const { EntityType } = this.company;
                        getCompany({
                            EntityType: EntityType,
                            Name: '',
                            RegNo: CompanyRegNo,
                            process_id: this.processId,
                            ICSP_id: this.userData.icsp_id
                        }).then(res => {
                            if (res.data[0] && res.data[0].length > 0) {
                                this.company = res.data[0][0];
                                this.innerValue.company_id = this.company.id;
                                this.innerValue.companyName = this.company.Name;
                                this.innerValue.companyRegNo = this.company.CompanyRegNo;
                                this.isSelected = true;
                                this.$store.commit('setCompany',this.company);
                            }
                        })
                    }
                }
            },
            onSelectCompanyByName(value) {
                this.company = this.companies.find(item => item.Name === value);
                this.innerValue.company_id = this.company.id;
                this.innerValue.companyName = this.company.Name;
                this.innerValue.companyRegNo = this.company.CompanyRegNo;
                this.isSelected = true;
                this.$store.commit('setCompany',this.company);
            },
            reset() {
                if(!this.readonly){
                    this.resetCompany();
                    this.entityTypes = [];
                    this.companies = [];
                    this.isSelected = false;
                    this.innerValue.address_id = null;
                }
            },
            resetCompany() {
                if(!this.readonly){
                    this.company = {
                        EntityType: null,
                        Name: '',
                        CompanyRegNo: '',
                    };
                }
            },
            validateQuery(value) {
                return value.length >= 3
            },
            resetCompanies() {
                this.companies = [];
            },
            onSearchName(val) {
                if (this.validateQuery(val) && !this.isSelected && !this.readonly) {
                    this.resetCompanies();
                    this.searchForCompany(val);
                }
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
