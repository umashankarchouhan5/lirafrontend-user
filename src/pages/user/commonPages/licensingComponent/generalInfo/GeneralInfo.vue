<template>
    <div>
        <div >
            <FormRow>
                <div class="col-sm-12">
                    <span :class="$style.notesStyle"> The authority will not require the applicant to be incorporated.</span>
                </div>
            </FormRow>
                <!-- <br /> -->
            <FormRow>
                <div class="col-sm-5" >
                    <FormSelect label="Select Company Name" rules="required" :readonly="readonly" v-model="value.data.Company_id" :items="companyList" item-value="company_id" item-name="CompanyName"  />
                </div>
                <div class="col-sm-2" >
                    <FormButton v-if="!readonly" type="success" @click="() => showCompany(true)">Create New</FormButton>
                </div>
                <div class="col-sm-3">
                    <InputDate label="Date of Incorporation" :readonly="readonly" type="date" :options="options" v-model="value.data.incorporationdate" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-6">
                    <AddressInput label="Registered Address" rules="required" :readonly="readonly" v-model="value.data.address_id" />
                </div>
            </FormRow>
            <FormRow>
                
                <div class="col-sm-6">
                    <AddressInput label="Principal Place of Business" rules="required" :readonly="readonly || isAddressSame === true" v-model="value.data.PrincipalAddress_id" />
                </div>
                <div class="col-sm-6">
                    <FormCheckbox :class="$style.marginTop10" :disabled="readonly" v-model="isAddressSame">Same as above?</FormCheckbox>
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <InputTextArea :readonly="readonly" label="Former trading or corporate names by proposed company used in the past ten years, if any." v-model="value.data.OldNames" />
                </div>
            </FormRow>
            <!-- <hr style="padding:2px;backgrond:black" />
            <br /> -->
            <div class="boxStyle">
                <h6 >Principle Contact Person</h6>
                <FormRow class="marginLeft-0">
                    <div class="col-sm-12">
                        <ValidationObserver>
                            <Person validationRule="required" :readonly="readonly" v-model="value.persons['Applicant']" />
                        </ValidationObserver>
                    </div>
                    
                </FormRow>
            </div>
            <!-- <hr />
            <br /> -->
            <div class="boxStyle">
                <h6>Other Contact Person </h6>
                <FormRow  class="marginLeft-0">
                    <div class="col-sm-12">
                        <Person :readonly="readonly" v-model="value.persons['Other']" />
                    </div>
                </FormRow> 
            </div>
            <ButtonGroup>
                <FormButton v-if="!readonly" type="success" @click="saveRequest">Save</FormButton>
                <FormButton type="primary" @click="nextStep" right-icon="ios-arrow-forward">Next</FormButton>
            </ButtonGroup>
        </div>

        <Popup :value="companyModal.visible"
            type="information"
            title="Create Company"
            :closable="true"
            :mask-closable="true"
            @close="() => showCompany(false)">
            <ValidationObserver ref="newCompany" v-if="companyModal.visible" >
                <FormRow >
                    <div class="col-sm-12" >
                        <InputText label="New Company Name" :rules="{required:true,notExactCompany: companyList}" :readonly="readonly" v-model="newCompanyName" />
                    </div>
                </FormRow>
                
            </ValidationObserver>
            <ButtonGroup slot="footer">
                <FormButton v-if="!readonly" type="success" @click="() => createCompany()">Create</FormButton>
                <FormButton @click="showCompany(false)" right-icon="ios-arrow-backward">Close</FormButton>
            </ButtonGroup>
        </Popup>

    </div>
</template>

<script>

    import { getICSPOperationType,searchForPQ, getPersonDetails, validateNinsertCompany, fetchWebuserCompany, } from '../APIRequests'
    import formStepMixin from '../formStepMixin'
    import InputDate from 'Components/form/InputDate';
    import AddressInput from 'Components/form/addressInput/AddressInput';
    import Person from 'Components/Person';
    import { ValidationObserver } from "vee-validate";
   

    export default {
        name: "GeneralInfo",
        mixins: [formStepMixin],
        components: {
            InputDate,
            AddressInput,
            Person,
            ValidationObserver,
        },
        data() {
          return {
                isModalVisible: false,
                openedPanel: 'applying_for_license',
                isAddressSame: false,
                selectExisting: '',
                newCompanyName: '',
                companyModal: {
                    visible: false,
                },
                companyList: [],
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
          }
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            },

        },
        props: {
            readonly: Boolean
        },
        created(){
            this.getCompany();
            if(this.value && this.value.data.PrincipalAddress_id == this.value.data.address_id  && this.value.data.PrincipalAddress_id !== null && this.value.data.PrincipalAddress_id !== undefined){
                this.isAddressSame = true;
            }
        },
        watch:{
            'value.data.Company_id': function(val){
                if(val !== undefined && val !== null && this.companyList.length > 0){
                    this.value.data.Companyname = this.companyList.find( item => {
                        return item.company_id === val;
                    }).CompanyName
                }
            },
            'value.data.isICSP': function(newVal) {
                if( newVal === true){
                    this.value.data.isFSP = false;
                    this.value.data.isITSP = false;
                }
            },
            'value.data.isFSP': function(newVal) {
                if( newVal === true){
                    this.value.data.isICSP = false;
                    this.value.data.isITSP = false;
                }
            },
            'value.data.isITSP': function(newVal) {
                if( newVal === true){
                    this.value.data.isFSP = false;
                    this.value.data.isICSP = false;
                }
            },
            'isAddressSame': function(newVal) {
                
                if( newVal === true ){
                    this.value.data.PrincipalAddress_id = this.value.data.address_id;
                }else if( newVal === false ){
                    this.value.data.PrincipalAddress_id = null;
                }
            },
            'value.data.PrincipalAddress_id': function(newVal){
                if( this.value.data.PrincipalAddress_id == this.value.data.address_id  && this.value.data.PrincipalAddress_id !== null &&  this.value.data.PrincipalAddress_id !== undefined){
                    this.isAddressSame = true;
                }
            }
        },
        methods: {
            showCompany(val){
                this.companyModal.visible = val;
                if( val === false ){
                    this.newCompanyName = ''
                }
            },
            getCompany() {
                fetchWebuserCompany({ICSP_id:this.userData.icsp_id}).then(
                    res => {
                        this.companyList = res.data;
                    }
                )
            },
            getCompanyList(company_id) {
                fetchWebuserCompany({ICSP_id:this.userData.icsp_id}).then(
                    res => {
                        this.companyList = res.data;
                        this.value.data.Company_id = company_id;
                        this.showCompany(false);
                    }
                )
            },
            async getAsyncList(company_id) {
                 fetchWebuserCompany({ICSP_id:this.userData.icsp_id}).then(
                    res => {
                        this.companyList = res.data;
                        return this.companyList;
                    }
                )
            },
            createCompany(){
                this.$refs.newCompany.validate().then(
                    res => {
                        if(res){
                            validateNinsertCompany({companyName: this.newCompanyName}).then(
                                res => {
                                    // this.getCompanyList(res.data[0].company_id);
                                    this.getAsyncList(res.data[0].company_id).then(
                                        response => {
                                                setTimeout(() => {
                                                    this.value.data.Company_id = res.data[0].company_id;
                                                    // this.value.data.Companyname = this.companyList.find( item => {
                                                    //     return item.company_id === res.data[0].company_id;
                                                    // }).CompanyName
                                                    this.showCompany(false)

                                                },500)
                                        }
                                    );
                                    // this.value.data.Company_id = company_id;
                                    // this.showCompany(false);
                                }
                            )

                        }
                    }
                )
            },
            saveRequest(activeStep) {
                this.$emit('onSave', activeStep)
            },
            nextStep() {
                this.$emit('nextStep')
            },
        }
    }
</script>

<style lang="scss" module>
    .notesStyle {
        font-style: italic;
        font-size: 13.5px;

    }
    .checkboxes {
        display: flex;
        margin-bottom: 20px;
        > span {
            margin-right: 30px;
        }
    }
    .selectSource {
        display: flex;
        justify-content: space-between;
        min-width: 200px;
    }
    
    .headingStyle {
        background:#ccc;
        padding: 5px 10px;
        letter-spacing:1.4px;
        text-shadow:1px 1px rgba(0,0,0,0.1);
        width:fit-content;
        min-width:50%;
    }
    .marginTop10 {
        margin: 10px;
    }
</style>
