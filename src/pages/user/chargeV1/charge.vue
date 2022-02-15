<template>
    <FormWrapper>
        <PageTitle title="New Charge Registration" slot="title" v-if="$route.matched[1].path === '/charge'" :link="`/help/${processId}`"/>
        <PageTitle title="Amendment Of Charge" slot="title" v-if="$route.matched[1].path === '/amendmentOfCharge'" :link="`/help/${processId}`"/>
        <PageTitle title="Release Of Charge" slot="title" v-if="$route.matched[1].path === '/releaseOfCharge'" :link="`/help/${processId}`"/>
        <div >
            <ValidationObserver ref="validator">
                <div  v-if="$route.matched[1].path === '/charge' " >
                
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
                    </FormRow>
                    <br />
                    <div >
                        <FormButton  @click="chargeCheckRequest()" >Charge</FormButton>
                    </div>
                </div>
                <div  v-if="$route.matched[1].path === '/amendmentOfCharge' || $route.matched[1].path === '/releaseOfCharge'  ">
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
                    </FormRow>
                    <FormRow>
                        <div class="col-sm-4">
                            <InputText rules="required" label="Charge Reference Number"  v-model="chargeReferenceNumber" />
                        </div>
                        <div class="col-sm-2">
                            <FormButton type="primary" @click="checkReference" :rounded="true">
                                <Icon type="ios-search" />
                            </FormButton>
                            
                        </div>
                    </FormRow>
                    <div v-if="customErrors.chargeReferenceSearchError" :class="$style.error2">No details found with this reference. </div>
                </div>
            </ValidationObserver>
        </div>
        
    </FormWrapper>
</template>

<script>
    
    import FormWrapper from 'Components/form/FormWrapper';
    import { getEntityType, getCompany } from 'Components/companySearch/api';
    import FormAutoComplete from 'Components/form/FormAutoComplete';
    // import debounce from 'Utils/debounce';
    import { NEW_CHARGE_REGISTRATION, AMENDMENT_OF_CHARGE, RELEASE_OF_CHARGE } from 'Config/processIds';
    import PageTitle from 'Components/layout/PageTitle';
    import { ChargeRequest, chargeInProgress, chargeReferenceSearch } from './api';
    // import DataTable from 'Components/DataTable';
    import config from './table';
    import { ValidationObserver } from "vee-validate";

    export default {
        name: "Charge",
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
                customErrors: {
                    notSelectedError: false,
                    chargeReferenceSearchError:false
                },
            }
        },
        components: {
            FormAutoComplete,
            FormWrapper,
            PageTitle,
            ValidationObserver
            // DataTable
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
            
            '$route.path': function(){
                this.setProcessId();
                this.resetCompany();
                this.companies = [];
                this.$forceUpdate();
            },
            'company.Name': function(val){
                if(val === ''){
                    this.isSelected = false;
                }
            },
            'company.CompanyRegNo': function(val){
                if(val === '' || val === null || val === undefined){
                    this.isSelected = false;
                }
            }
        },
        methods: {
            checkReference(){
                this.$refs.validator.validate().then((result) => {
                    if (result) {
                        if(this.isSelected){
                            this.customErrors.notSelectedError = false;
                            this.customErrors.chargeReferenceSearchError=false;
                            chargeReferenceSearch({process_id: this.processId, company_id: this.company.id, ChargeReferenceNumber: this.chargeReferenceNumber}).then(
                                res => {
                                    if(res.data[0]){
                                       
                                        this.$store.commit('setCompany',this.company);
                                        this.chargeCheckRequest(res.data[0])
                                    }
                                    else{
                                        this.customErrors.chargeReferenceSearchError=true;

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
                })
            },
            chargeCheckRequest(prop){
                this.$refs.validator.validate().then((result) => {
                    if (result) {
                        if(this.isSelected){
                            this.customErrors.notSelectedError = false;
                            ChargeRequest({process_id: this.processId,company_id: this.company.id,reference_id: 0,ChargeReferenceNumber: this.chargeReferenceNumber}).then(
                                res => {
                                    this.$store.commit('setCompany',this.company);
                                    if(!prop){
                                        this.$router.push({name: this.$route.name + 'Request', params:{id: res.data[0].reference_id}})
                                    }else{
                                        this.$router.push({name: this.$route.name + 'Request', params:{id: res.data[0].reference_id,chargeRef:this.chargeReferenceNumber}})
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
                })
            },
            setProcessId(){
                if(this.$route.matched[1].path === '/charge'){
                    this.$store.commit('setProcessId', NEW_CHARGE_REGISTRATION);
                }else if(this.$route.matched[1].path === '/amendmentOfCharge'){
                    this.$store.commit('setProcessId', AMENDMENT_OF_CHARGE);
                }else if(this.$route.matched[1].path === '/releaseOfCharge'){
                    this.$store.commit('setProcessId', RELEASE_OF_CHARGE);
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
                            if(this.$route.name === "NewCharge" ){
                                chargeInProgress({process_id: this.processId,company_id: this.company.id}).then(
                                    res => {
                                        var previousCharges = res.data[0];
                                        if(previousCharges && previousCharges.reference_id && previousCharges.Status_id === 43){
                                            ChargeRequest({process_id: this.processId,company_id: this.company.id,reference_id: previousCharges.reference_id,ChargeReferenceNumber: previousCharges.ChargeReferenceNumber}).then(
                                                res => {
                                                    this.$store.commit('setCompany',this.company);
                                                    this.$router.push({name: this.$route.name + 'Request', params:{id: res.data[0].reference_id}})
                                                }
                                            )
                                        }
                                    }
                                )
                            }
                        }
                    })
                }
            },
            onSelectCompanyByName(value) {
                    this.company = this.companies.find(item => item.Name === value);
                    this.isSelected = true;
                    if(this.$route.name === "NewCharge" ){
                        chargeInProgress({process_id: this.processId,company_id: this.company.id}).then(
                            res => {
                                var previousCharges = res.data[0];
                                if(previousCharges && previousCharges.reference_id && previousCharges.Status_id === 43){
                                    ChargeRequest({process_id: this.processId,company_id: this.company.id,reference_id: previousCharges.reference_id,ChargeReferenceNumber: previousCharges.ChargeReferenceNumber}).then(
                                        res => {
                                            this.$store.commit('setCompany',this.company);
                                            this.$router.push({name: this.$route.name + 'Request', params:{id: res.data[0].reference_id}})
                                        }
                                    )
                                }
                            }
                        )
                    }
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
    .error2 {
        color: #ff3547;
        
        max-width: 100%;
        
        font-size: 11px;
        line-height: 13px;
        
        font-weight: 400;
    }
</style>