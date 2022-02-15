<template>
    <div >
        <FormRow>
            <div class="col-sm-12">
                <h6>Contingent and Prospective Liability Coverage </h6>
                <InputTextArea
                    rows="3"
                    v-model="value.data.LiabilityCoverage"
                    :readonly="readonly"
                    label="(Please provide a brief description of how contingent and prospective liabilities will be covered)" :maxlength="250" />
            </div>
        </FormRow>
        <FormRow>
            <div class="col-sm-12">
                <h6 :class="$style.flexClass"> Choose your financial year end 
                    <div :class="$style.monthWidth">
                        <InputMonth name="Choose your financial year end" :readonly="readonly" :clearable="true" v-model="value.data.financialYearEndMonth" rules="required"/>
                    </div> 
                    <span class="text-danger">*</span>
                </h6>
            </div>
        </FormRow>
        <h6>Financial Details</h6>
        <FormRow>
            <div class="col-sm-4">
                <InputAmount label="Capital of Applicant (US $)" type="number" :readonly="readonly" v-model="value.data.Capital" rules="required"/>
            </div>
            <div class="col-sm-4">
                <div :class="$style.selectSource">
                    <FormCheckbox :disabled="readonly" :true-value='1' :false-value="0" v-model="value.data.ownerequityYN">Owner Equity</FormCheckbox>
                    <FormCheckbox :disabled="readonly" :true-value='1' :false-value="0" v-model="value.data.shareholderequityYN">Shareholder Equity</FormCheckbox>
                    <FormCheckbox :disabled="readonly" :true-value='1' :false-value="0" v-model="value.data.LoanYN">Loan</FormCheckbox>
                </div>
            </div>
        </FormRow>
        <h6>Source of Capital 
            <span v-if="$route.path === '/icspForm' || $route.name === 'icspFormRef'" :class="$style.notesStyle">(Applicant shall have and maintain a fully paid-up share capital of SCR 150,000.)</span>
            <span v-if="$route.path === '/itspForm' || $route.name === 'itspFormRef'" :class="$style.notesStyle">(Applicant shall have and maintain a fully paid-up share capital of SCR 250,000 and proof of the same shall be made readily available if and when requested by the Authority. Include overdraft or other bank facilities to accommodate unforeseen expenses or liabilities.)</span>
            <span v-if="$route.path === '/fspForm' || $route.name === 'fspFormRef'" :class="$style.notesStyle">(The applicant shall have and maintain a fully paid-up share capital of SCR 200,000 (or its equivalent in any other currency) and proof of the same shall be made readily available if and when requested by the Authority. Include overdraft or other bank facilities to accommodate unforeseen expenses or liabilities.)</span>
        </h6>
        <FormRow v-if="value.records && value.records.SOC">
            <div class="col-sm-12">
                <Record :readonly="readonly" v-model="value.records.SOC" pqId="''" />
            </div>
        </FormRow>
        <h6>Proposed Employment Size</h6>   
        <FormRow>
            <div class="col-sm-4">
                <InputIntegerNumber rules="required" type="number" :readonly="readonly" label="Local" v-model="value.data.EsizeLocal"/>
            </div>
            <div class="col-sm-4">
                <InputIntegerNumber rules="required" type="number" :readonly="readonly" label="Expatriates" v-model="value.data.ESizeEx"/>
            </div>
            <div class="col-sm-4">
                <!-- Calculated field -->
                <InputIntegerNumber rules="required" type="number" readonly label="Total" v-model="value.data.ESizeTotal"/>
            </div>
        </FormRow>
        <h6>Forecasted Cash Flows</h6>
        <FormRow>
            <div class="col-sm-4">
                <InputAmount rules="required"  :readonly="readonly" label="Annual Revenue (US $)" v-model="value.data.ForecastAnnualRevenue"/>
            </div>
            <div class="col-sm-4">
                <InputAmount rules="required"  :readonly="readonly" label="Domestic Expenditure (US $)" v-model="value.data.ForecastDomesticUSD"/>
            </div>
            <div class="col-sm-4">
                <InputAmount rules="required"  :readonly="readonly" label="Domestic Expenditure (SCR)" v-model="value.data.ForecastDomesticSCR"/>
            </div>
        </FormRow>
        <FormRow>
            <div class="col-sm-12">
                <InputTextArea v-model="value.data.ProposedIndemnityCover" label="Details of Proposed Professional Indemnity Cover" :maxlength="5000" rows="5" rules="required" />
            </div>
        </FormRow>
        <br />
        <ButtonGroup>
            <FormButton type="primary" @click="prevStep" left-icon="ios-arrow-back">Previous</FormButton>
            <FormButton type="success" @click="saveRequest">Save</FormButton>
            <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
        </ButtonGroup>
    </div>
</template>

<script>

    import formStepMixin from '../formStepMixin';
    import Record from './Record'

    export default {
        name: "FinancialInfo",
        props: {
            readonly: Boolean,
        },
        data() {
            return {
                owner: false,
                share: false,
                loan: false
            }
        },
        computed:{
            userData() {
                return this.$store.state.user.user
            },
        },
        components:{
            Record,
        },
        mixins: [formStepMixin],
        created(){
            if(this.value.data.EsizeLocal == '' || this.value.data.EsizeLocal == null)
                this.value.data.EsizeLocal = '';
            if(this.value.data.ESizeEx == '' || this.value.data.ESizeEx == null)
                this.value.data.ESizeEx = '';
            if(this.value.records.SOC && this.value.records.SOC.length > 0 ){
                this.owner = this.value.records.SOC.length > 0;
            }
            if(this.value.records.SOC && this.value.records.SOC.length === 0){
                this.value.records.SOC = [];
            }
        },  
        watch: {
            'value.data.ownerequityYN': function(newVal) {
                this.owner = this.value.data.ownerequityYN;
            },
            'value.data.shareholderequityYN': function(newVal) {
                this.share = this.value.data.shareholderequityYN;
            },
            'value.data.LoanYN': function(newVal) {
                this.loan = this.value.data.LoanYN;
            },
            'value.data.EsizeLocal': function(newVal) {
                var localE = 0;
                if( newVal == '' || newVal == null ){
                    // this.value.data.EsizeLocal = '';
                    this.value.data.EsizeLocal = 0;
                    localE = 0;
                }else{
                    localE = newVal;
                }
                var sizeE = 0;
                if( this.value.data.ESizeEx == '' || this.value.data.ESizeEx == null){
                    // this.value.data.ESizeEx = '';
                    this.value.data.ESizeEx = 0;
                    sizeE = 0;
                }else{
                    sizeE = this.value.data.ESizeEx;
                }
                this.value.data.ESizeTotal = parseInt(localE) + parseInt(sizeE);
            },
            'value.data.ESizeEx': function(newVal) {
                var sizeE = 0;
                if( newVal == '' || newVal == null){
                    // this.value.data.ESizeEx = '';
                    this.value.data.ESizeEx = 0;
                    sizeE = 0;
                }else{
                    sizeE = newVal;
                }
                var localE = 0;
                if( this.value.data.EsizeLocal == '' || this.value.data.EsizeLocal == null ){
                    // this.value.data.EsizeLocal = '';
                    this.value.data.EsizeLocal = 0;
                    localE = 0;
                }else{
                    localE = this.value.data.EsizeLocal;
                }
                this.value.data.ESizeTotal = parseInt(localE) + parseInt(sizeE);
            },
            'value.data.ESizeTotal': {
                deep: true,
                handler(val){
                    if(val === null ){
                        var sizeE = 0;
                        if( this.value.data.ESizeEx == '' || this.value.data.ESizeEx == null){
                            var sizeE = 0;
                            sizeE = 0;
                        }else{
                            sizeE = this.value.data.ESizeEx;
                        }
                        var localE = 0;
                        if( this.value.data.EsizeLocal == '' || this.value.data.EsizeLocal == null ){
                            localE = 0;
                        }else{
                            localE = this.value.data.EsizeLocal;
                        }
                        return parseInt(localE) + parseInt(sizeE);
                    }
                }
            }
        },
        methods: {
            saveRequest(activeStep) {
                this.$emit('onSave', activeStep)
            },
            nextStep() {
                this.$emit('nextStep')
            },
            prevStep() {
                this.$emit('prevStep')
            }
        }
    }
</script>

<style lang="scss" module>
    .notesStyle {
        font-style: italic;
        font-size: 13.5px;
    }
    .selectSource {
        display: flex;
        justify-content: space-between;
        // align-items: center;
    }
    .monthWidth{
        max-width: 120px;
        width: 120px;
        margin: 0px 10px;
        position: relative;
    }
    .flexClass {
        display: flex;
        align-items: center;
    }
</style>
