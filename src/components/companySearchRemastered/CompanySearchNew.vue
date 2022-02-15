<template>
    <div >
        
        <FormRow >
            <div class="col-sm-3" v-if="entityInclusive">
                <FormSelect :disabled="entityReadonly"
                    v-model="company.EntityType"
                    :items="entityTypes"
                    :label="entityTypeLabel"
                    item-name="Name"
                    item-value="Name" 
                    :rules="{required: required}"
                />
            </div>
            <div class="col-sm-2">
                <InputText :rules="{required: required}" noApostrophe :label="entityRegLabel" :readonly="readonly || (entityInclusive && !entitySelected)" v-model="company.CompanyRegNo" @keyup.native="searchByRegNo" @focusout="searchByRegNoTab" />
            </div>
            <div class="col-sm-6">
                <FormAutoComplete
                    :disabled="readonly || (entityInclusive && !entitySelected)"
                    :label="entityNameLabel"
                    :rules="{required: required}"
                    v-model="company.Name"
                    :onChange="onSearchName"
                    :items="companies"
                    item-value="Name"
                    item-name="Name"
                    :onSelect="onSelectCompanyByName" />
            </div>
        </FormRow>
        <div :class="$style.infoMessage" v-if="noCompanyFound">No Company Found</div>
        
        <div :class="$style.error" v-if="customErrors && customErrors.notSelectedError">
            Please Select a valid company before proceeding
        </div>
    </div>
</template>

<script>

    import { getCompany, getExcludedCompany } from './api';
    import FormAutoComplete from 'Components/form/FormAutoComplete';
    import valueMixin from 'Mixins/valueMixin';

    export default {
        name: "CompanySearch",
        mixins: [ valueMixin ],
        components: {
            FormAutoComplete
        },
        props: {
            readonly: {
                type: Boolean,
                default: false
            },
            getExclusive: {
                type: Boolean,
                default: false
            },
            process_id: {
                type: [Number, String],
                default: null,
            },
            icspIdRequired: {
                type: Boolean,
                default: false
            },
            entityInclusive: {
                type: Boolean,
                default: false,
            },
            entityTypes: [Array],
            entityReadonly: {
                type: Boolean,
                default: false,
            },
            entityTypeLabel: {
                type: String,
                default: 'Entity Type',
            },
            entityRegLabel: {
                type: String,
                default: 'Reg #',
            },
            entityNameLabel: {
                type: String,
                default: 'Company Name',
            },
            customErrors: [Array,Object],
            required: {
                type: Boolean,
                default: false
            }

        },
        data() {
            return {
                companies: [],
                company: {
                    EntityType: '',
                    Name: '',
                    CompanyRegNo: '',
                },
                CompanyRegNoQuery: '',
                selectedFromList: false,
                isSelected: false,
                noCompanyFound: false,
                entitySelected: false

            }
        },
        computed: {
            processId() {
                return this.$store.state.common.currentProcessId
            },
            userData() {
                return this.$store.state.user.user;
            },
        },
        watch: {
            company(val){
            },
            'company.EntityType': function(val){
                if(val !== null && val !== undefined){
                    this.entitySelected = true;
                }
                else if(this.entitySelected == true && (val == null || val == undefined)){
                    this.entitySelected = false;
                    this.resetCompany();
                    this.resetCompanies();
                }
            },
            'company.CompanyRegNo': function (val) {
                if(val === ''){
                    this.isSelected = false;
                    this.resetSearched();
                }
            },
            'company.Name': function (val) {
                if(val === '' || val === null || val === undefined){
                    this.isSelected = false;
                    this.resetSearched();
                }
            },
            'innerValue.id': function(val){
                if(val == null){
                    this.resetCompany();
                    this.resetCompanies();
                }
                // if(val !== null){
                //     this.company = this.innerValue;
                // }
            }
        },
        created() {
            if(this.innerValue.id !== null){
                this.company = this.innerValue;
            }
        },
        methods: {
            searchByRegNoTab() {
                this.searchByDefault();
            },
            searchByRegNo(event) {
                if(event.keyCode === 13){
                    this.searchByDefault();
                }
            },
            searchByDefault(){
                if (!this.isSelected) {
                    this.noCompanyFound = false;
                    const { CompanyRegNo } = this.company;
                    const { EntityType } = this.company;
                    if (CompanyRegNo ) {
                        if(!this.getExclusive){
                            getCompany({
                                EntityType: EntityType,
                                Name: '',
                                RegNo: CompanyRegNo,
                                ...(this.process_id !== null && {process_id: this.process_id}),
                                ...(this.icspIdRequired && {icsp_id: this.userData.icsp_id})
                            }).then(res => {
                                if (res.data[0] && res.data[0].length > 0) {
                                    this.company = res.data[0][0];
                                    this.innerValue.id = this.company.id
                                    this.innerValue.EntityType = this.company.EntityType;
                                    this.innerValue.Name = this.company.Name;
                                    this.innerValue.CompanyRegNo = this.company.CompanyRegNo;
                                    this.innerValue.Address_id = this.company.Address_id;
                                    this.isSelected = false;
                                    this.$store.commit('setCompany',this.company);
                                    this.noCompanyFound = false;
                                }
                                if(this.innerValue.id == null){
                                    this.noCompanyFound = true;
                                }
                                this.$emit('searchedByCompanyReg',res.data[0])
                            })
                        }else{
                            getExcludedCompany({
                                EntityType,
                                Name: '',
                                RegNo: CompanyRegNo,
                                ...(this.process_id !== null && {process_id: this.process_id}),
                            }).then(
                                res=> {
                                    if(res.data[0][0]){
                                        this.companies = res.data[0];
                                        this.onSelectCompanyByName(res.data[0][0].Name);
                                    }
                                }
                            )
                        }
                    }
                }
            },
            onSelectCompanyByName(value) {
                if(!this.readonly){
                    this.company = this.companies.find(item => item.Name === value);
                    this.innerValue.id = this.company.id;
                    this.innerValue.EntityType = this.company.EntityType;
                    this.innerValue.Name = this.company.Name;
                    this.innerValue.CompanyRegNo = this.company.CompanyRegNo;
                    this.noCompanyFound = false;
                }
                this.isSelected = true;
                this.$store.commit('setCompany',this.company);
                this.$emit('searchedByNameResult');
            },
            reset() {
                if(!this.readonly){
                    this.resetCompany();
                    // this.entityTypes = [];
                    this.companies = [];
                    this.isSelected = false;
                    this.innerValue.address_id = null;
                    this.entitySelected = false;
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
            resetSearched() {
                if(!this.readonly){
                    this.company.Name = '';
                    this.company.CompanyRegNo = '';
                    this.isSelected = false;
                    this.innerValue.id = null;
                    this.innerValue.Name = '';
                    this.innerValue.CompanyRegNo = '';
                    this.noCompanyFound = false;
                    this.companies = []
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
                this.isSelected = false;
            },
            searchForCompany(Name) {
                const { EntityType } = this.company;
                if(!this.readonly){
                    if( !this.getExclusive ){
                        getCompany({
                            EntityType,
                            Name,
                            RegNo: '',
                            ...(this.process_id !== null && {process_id: this.process_id}),
                            ...(this.icspIdRequired && {icsp_id: this.userData.icsp_id})
                        }).then(res => {
                            this.companies = res.data[0];
                        })
                    }else{
                        getExcludedCompany({
                            EntityType,
                            icsp_id: this.userData.icsp_id,
                            Name,
                        }).then(
                            res=> {
                                this.companies = res.data[0];
                            }
                        )
                    }
                }
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
    }
    .infoMessage{
        color: #609dff;
        font-size: 11px;
        line-height: 13px;
        font-weight: 400;
    }
</style>
