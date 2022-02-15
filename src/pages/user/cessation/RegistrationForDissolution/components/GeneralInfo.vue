<template>
    <div>
       
        <SearchCompanyNew 
            v-model="company" 
            :process_id="processId"
            required 
            entityInclusive 
            :entityTypes="entityTypes" 
            :customErrors="customErrors" 
            icspIdRequired
            :entityReadonly="readonly || dataSelected"
            :readonly="readonly"
            @searchedByCompanyReg="onSelectCompany"
            @searchedByNameResult="onSelectCompany"
        />
        <FormRow>
            <div class="col-sm-6">
                <RadioGroup v-model="innerValue.solvent" :disabled="readonly">
                    <Radio label="S" :disabled="readonly" rules="required">
                        Solvent
                    </Radio>
                    <Radio label="I" :disabled="readonly">
                        Insolvent
                    </Radio>
                </RadioGroup> 
            </div>
        </FormRow>
        <FormRow >
            <div class="col-sm-3">
                <InputDate rules="required" :readonly="readonly" label="Resolution Date" :options="options"  v-model="innerValue.effectiveDate"  />
            </div>
        </FormRow>
        <FormRow >
            <div class="col-sm-3">
                <InputText rules="required" :readonly="readonly" label="Liquidator Name"  v-model="innerValue.liquidatorName"  />
            </div>
            <div class="col-sm-7">
                <InputText rules="required" :readonly="readonly" label="Liquidator Address"  v-model="innerValue.liquidatorAddress"  />
            </div>
        </FormRow>

    </div>
</template>

<script>

    import InputDate from 'Components/form/InputDate';
    import valueMixin from 'Mixins/valueMixin';
    import { getEntityType, getCompany } from 'Components/companySearch/api';
    import { REGISTRATION_FOR_DISSOLUTION  } from 'Config/processIds';
    import { getStrikeOffReason } from '../../api';
    import { RadioGroup, Radio } from 'view-design'

    export default {
        name: "GeneralInfo",
        mixins: [valueMixin],
        components: {
            InputDate,
            RadioGroup,
            Radio,
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
                    getStrikeOffReason({process_id: REGISTRATION_FOR_DISSOLUTION})
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
                    process_id: REGISTRATION_FOR_DISSOLUTION,
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
            
            // new search company actions
            onSelectCompany(value) {
                this.innerValue.company_id = this.company.id;
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
