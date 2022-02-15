<template>
    <div>
        <FormRow>
            <div class="col-sm-2">
                <InputText rules="required" noApostrophe label="Reg #" v-model="innerValue.company.CompanyRegNo" @keyup.native="searchByRegNo" @focusout="searchByRegNoTab" />
            </div>
            <div class="col-sm-6">
                <FormAutoComplete
                    label="Name"
                    rules="required"
                    v-model="innerValue.company.Name"
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

        <div :class="$style.checkItem">
            <div :class="$style.checkbox" >
                <FormCheckbox v-model="innerValue.isROC" :true-value="1" :false-value="0" :disabled="readonly"/>
            </div>
            <div :class="$style.checkBrief">
                Register of Charges
            </div>
        </div>    
        <div :class="$style.checkItem">
            <div :class="$style.checkbox" >
                <FormCheckbox v-model="innerValue.isROM" :true-value="1" :false-value="0" :disabled="readonly"/>
            </div>
            <div :class="$style.checkBrief">
                Register of Members
            </div>
        </div>    
        <div :class="$style.checkItem">
            <div :class="$style.checkbox" >
                <FormCheckbox v-model="innerValue.isROBO" :true-value="1" :false-value="0" :disabled="readonly"/>
            </div>
            <div :class="$style.checkBrief">
                Register of Beneficial owner
            </div>
        </div>
        
        <div :class="$style.error" v-if="customErrors.selectAtleastOne">Select at least one record.</div>
        <br />
    </div>
</template>
<script>
    import valueMixin from 'Mixins/valueMixin';
    import { getEntityType } from '../api';
    import { FILLING_OF_REGISTER } from 'Config/processIds';
    import FormAutoComplete from 'Components/form/FormAutoComplete';
    import { getCompany } from 'Components/companySearch/api';

    export default {
        name: 'RequestCertificate',
        mixins: [valueMixin],
        components: {
            FormAutoComplete,
        },
        props: {
            mode: String,
            steps: Array,
            readonly: Boolean,
            customErrors: [Array,Object],
            value: {
                type: Object,
                required: true,
            },

        },
        data(){
            return{
                entityTypes: [],
                companies: [],
                company: {
                    EntityType: 'IBC',
                    Name: '',
                    CompanyRegNo: '',
                },
                isSelected: false,
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
            'innerValue.process_id': function (newValue) {
                this.$store.commit('setProcessId', newValue);
                // this.getEntityListHandler();
            },
            'innerValue.entityType': function(val){
                this.$store.commit('setChangeEntityType',val);
            },
        },
        methods:{
            getEntityListHandler() {
                getEntityType(
                    {
                    process_id: FILLING_OF_REGISTER,
                }
                ).then(res => {
                    this.entityTypes = res.data;
                    if (this.entityTypes.length === 1) {
                        this.innerValue.entityType = this.entityTypes[0].Name
                    }
                })
            },
            searchByRegNo(event) {
                if(event.keyCode === 13 || event.keyCode === 9){
                    // if (!this.isSelected) {
                        this.searchByRegDefault();
                    // }
                }
            },
            searchByRegNoTab() {
                // if (!this.isSelected) {
                    this.searchByRegDefault();
                // }
            },
            searchByRegDefault(){
                const { CompanyRegNo } = this.innerValue.company;
                if (CompanyRegNo ) {
                        getCompany({
                            Name: '',
                            RegNo: CompanyRegNo,
                            EntityType: this.innerValue.entityType
                        }).then(res => {
                            if (res.data[0] && res.data[0].length > 0) {
                                this.innerValue.company = res.data[0][0];
                                this.companies = [];
                                this.isSelected = true;
                                this.innerValue.Company_id = this.company.id;
                                this.$store.commit('setCompany', this.company.id);
                            }else{
                                this.innerValue.company.Name = '';
                                this.innerValue.company.id = null;
                            }
                        }
                    )
                }
            },
            onSelectCompanyByName(value) {
                this.innerValue.company = this.companies.find(item => item.Name === value);
                this.innerValue.Company_id = this.innerValue.company.id;
                this.$store.commit('setCompany', this.innerValue.company.id);
                this.isSelected = true;
            },
            reset() {
                this.resetCompany();
                this.entityTypes = [];
                this.companies = [];
                this.isSelected = false;
            },
            resetCompany() {
                this.innerValue.company = {
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
                // if ( this.validateQuery(val) && !this.isSelected ) {
                if ( this.validateQuery(val) ) {

                    this.resetCompanies();
                    this.searchForCompany(val);
                }
                // this.isSelected = false;
            },
            searchForCompany(Name) {
                getCompany({
                    EntityType: this.innerValue.entityType,
                    Name,
                    RegNo: '',
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
</style>