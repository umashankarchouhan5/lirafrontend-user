<template>
    <div>
        <FormRow>
            <div class="col-sm-4" v-if="$route.name != 'PCCForm'">
                <!-- <FormSelect label="Select" :items="existValue" item-value="value" item-name="value" v-model="selectExisting" :clearable="false" rules="required" :disabled="readonly" /> -->
                <RadioGroup v-model="selectExisting" rules="required" :disabled="readonly" >
                    <Radio label="Existing">
                        Existing
                    </Radio>
                    <Radio label="Non-Existing">
                        Non-Existing
                    </Radio>
                </RadioGroup>
            </div>
            <div class="col-sm-8" v-if="selectExisting === 'Non-Existing'">
                <InputText label="Proposed Company Name" v-model="innerValue.CompanyName" :readonly="readonly" />
            </div>
            <div class="col-sm-2" v-if="selectExisting === 'Existing'">
                <InputText rules="required" noApostrophe label="Reg #"  v-model="company.CompanyRegNo" @keyup.native="searchByRegNo" @focusout="searchByRegNoTab" :readonly="readonly" />
            </div>
            <div class="col-sm-6" v-if="selectExisting === 'Existing'">
                <FormAutoComplete
                    label="Name"
                    rules="required"
                    v-model="innerValue.ConvertedCompanyName"
                    :onChange="onSearchName"
                    :items="companies"
                    item-value="Name"
                    item-name="Name"
                    :onSelect="onSelectCompanyByName" :disabled="readonly" />
            </div>
        </FormRow>
        <div v-if="selectExisting === 'Existing'">
            <p><b>If the Company exists already, please indicate </b></p>
            <FormRow>
                <div class="col-sm-4">
                    <InputDate label="Date of Incorporation / Registration" :rules="{required: selectExisting === 'Existing' ? true:false}" type="date" v-model="innerValue.IncorporationDate" :readonly="readonly" />
                </div>
                <div class="col-sm-4">
                    <FormSelect
                        :rules="{required: selectExisting === 'Existing' ? true:false}"
                        :items="countries"
                        item-name="Name"
                        item-value="id"
                        label="Country of Incorporation / Registration"
                        v-model="innerValue.IncorporationCountry_id" :disabled="readonly" />
                </div>
            </FormRow>
        </div>
        <p><b>Applicant's Detail</b></p>
        <FormRow>
            <div class="col-sm-6">
                <InputText label="Name of Company's Secratary" v-model="userData.icsp_name" readonly />
            </div>
            <div class="col-sm-4">
                <InputText label="Incorporation Number" :readonly="readonly" v-model="innerValue.ICSPRegNo"  />
            </div>
        </FormRow>
        <FormRow>
            <div class="col-sm-8">
                <InputText label="Registered Address in Seychelles" v-model="userData.icsp_address[0].caddress" readonly />
            </div>
        </FormRow>
        <FormRow>
            <div class="col-sm-4">
                <InputText label="Telephone" v-model="userData.Mobile" readonly />
            </div>
            <div class="col-sm-4">
                <InputText label="Fax" v-model="userData.icsp_fax" readonly />
            </div>
            <div class="col-sm-4">
                <InputText label="Email" v-model="userData.email" readonly />
            </div>
        </FormRow>
        
        <FormRow v-if="$route.name != 'PCCForm'">
            <div class="col-sm-12">
                <h6 :class="$style.flexClass"> Choose your financial year end
                    <div :class="$style.monthWidth">
                        <InputMonth name="Financial Year End Month" v-model="innerValue.financialYearEndMonth" rules="required"/>
                    </div> 
                    <span class="text-danger">*</span></h6>
            </div>
        </FormRow>
        <p> <b>Proposed Activity </b></p>
        <div v-for="(check, i) in activityJson" :key="i" :class="$style.checkItem">
            <div :class="$style.checkbox" @change="changeCheckboxValue" >
                <FormCheckbox v-model="check.isChecked" :disabled="readonly"/>
            </div>
            <div :class="$style.checkBrief">
                {{ check.Name }}
            </div>
        </div>
        <br />
        <FormRow>
            <div class="col-sm-12">
                <InputTextArea :readonly="readonly" label="Other activity which will be subject to approval by the Authority (please specify in space below)" v-model="innerValue.OtherActivity" rows="10" :rules="{required: checkProposed()}"  />
            </div>
        </FormRow>
        <FormRow>
            <ButtonGroup>
                <FormButton  type="success" @click="saveRequest" v-if="!readonly">Save</FormButton>
                <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
            </ButtonGroup>
        </FormRow>

    </div>
</template>

<script>

    
    import valueMixin from 'Mixins/valueMixin';
    import { getEntityType, getCompany, getExcludedCompany, getICSPforCompany } from 'Components/companySearch/api';
    import FormAutoComplete from 'Components/form/FormAutoComplete';
    import InputDate from 'Components/form/InputDate';
    import { RadioGroup, Radio } from 'view-design'

    export default {
        name:"CSLPCCGeneralInfo",
        mixins: [valueMixin],
        components: {
            FormAutoComplete,
            InputDate,
            RadioGroup,
            Radio,
        },
        props:{
            readonly: Boolean
        },
        data(){
            return{
                companies: [],
                existValue:[
                    {
                        value: 'Existing'
                    },
                    {
                        value: 'Non-Existing'
                    }
                ],
                selectExisting: '',
                CompanyRegNo:'',
                company: {
                    EntityType: 'IBC',
                    Name: '',
                    CompanyRegNo: '',
                },
                isSelected: false,
                activityJson: [],
            }
        },
        computed:{
            countries() {
                return this.$store.state.common.countries;
            },
            userData() {
                return this.$store.state.user.user;
            },
            processId() {
                return this.$store.state.common.currentProcessId;
            },
        },
        created(){
           
        },
        watch:{
            innerValue(val){
                this.getActivityJson();
                if(val.ConvertedCompany_id !== '' && val.ConvertedCompany_id  !== ' ' && val.ConvertedCompany_id  !== null && val.ConvertedCompany_id !== undefined && this.$route.name !== 'PCCForm'){
                    setTimeout(() => {
                        this.selectExisting = 'Existing';
                        this.searchForCompany1(val.ConvertedCompanyName);

                    },100)
                }
                else if((val.CompanyName !== '' && val.CompanyName !== ' ' && val.CompanyName !== null && val.CompanyName !== undefined ) || this.$route.name == 'PCCForm'){
                    this.selectExisting = 'Non-Existing';

                }
                else{
                    this.selectExisting = 'Existing';
                }
            },
            'innerValue.ConvertedCompanyName': function(val){
                if(val === '' || val === null){
                    this.isSelected = false;
                }
                // else{
                // }
            },
            'company.CompanyRegNo':function(val){
                if(val === '' || val === null){
                    this.isSelected = false;
                }
                // else{
                //     this.searchByRegDefault();
                // }
            }
        },
        methods:{
            checkProposed() {
                const noneChecked = this.activityJson.every( ele => ele.isChecked == false);
                if(noneChecked) {
                    return true;
                }
                else{
                    return false
                }
            },
            saveRequest(activeStep) {
                this.$emit('onSave', activeStep)
            },
            nextStep() {
                this.$emit('nextStep')
            },
            changeCheckboxValue() {
                this.$emit('onChangeCheck', JSON.stringify(this.activityJson));
            },
            getActivityJson(){
                if(this.activityJson.length === 0 && this.innerValue.ActivityJson){
                    setTimeout(() => {
                        this.activityJson = JSON.parse(this.innerValue.ActivityJson);
                    },100)
                }
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
            searchByRegDefault(){
                // const { CompanyRegNo } = this.company;
                const CompanyRegNo = this.company.CompanyRegNo
                if (CompanyRegNo ) {
                        getCompany({
                            
                            EntityType: this.company.EntityType,
                            Name: '',
                            RegNo: CompanyRegNo,
                            process_id: this.processId,
                            ICSP_id: this.userData.icsp_id
                        }).then(res => {
                            if (res.data[0] && res.data[0].length > 0) {
                                this.company = res.data[0][0];
                                this.innerValue.ConvertedCompanyName = res.data[0][0].Name;
                                this.company.CompanyRegNo= res.data[0][0].CompanyRegNo;
                                this.innerValue.ConvertedCompany_id = res.data[0][0].id;
                                this.isSelected = true;
                                this.$store.commit('setCompany',this.company);
                                
                            }
                        }
                    )
                }
            },
            onSelectCompanyByName(value) {
                this.company = this.companies.find(item => item.Name === value);
                
                this.innerValue.ConvertedCompanyName = this.company.Name;
                this.company.CompanyRegNo = this.company.CompanyRegNo;
                this.innerValue.ConvertedCompany_id = this.company.id;
                this.isSelected = true;
                this.$store.commit('setCompany',this.company);
            },
            reset() {
                this.resetCompany();
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
            searchForCompany1(Name) {
                getCompany({
                    EntityType: this.company.EntityType,
                    Name,
                    RegNo: '',
                    process_id: this.processId,
                    ICSP_id: this.userData.icsp_id
                }).then(res => {
                    this.companies = res.data[0];
                    this.onSelectCompanyByName(Name)
                })
            },
        },


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

    .error {
        color: #ff3547;
        max-width: 100%;
        font-size: 11px;
        line-height: 13px;
        font-weight: 400;
        margin: -18px 0 18px;
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
