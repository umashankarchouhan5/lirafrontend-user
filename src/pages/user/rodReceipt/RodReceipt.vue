<template>
    <FormWrapper>
        <PageTitle title="ROD Receipt" slot="title" />
        <div >
            <ValidationObserver ref="validator">
                <FormRow>
                    <div class="col-sm-2">
                        <InputText rules="required" noApostrophe label="Reg #" v-model="company.CompanyRegNo" @keyup.native="searchByRegNo" @focusout="searchByRegNoTab" />
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
                <!-- <div >
                    <FormButton  @click="chargeCheckRequest()" >Sear</FormButton>
                </div> -->
                <ButtonGroup v-if="company.id">
                    <FormButton  @click="printReceipt('report')" >Report</FormButton>
                    <FormButton  @click="printReceipt('receipt')" >Print Receipt</FormButton>
                    <FormButton  @click="printReceipt('confirm')" >Print Confirmation</FormButton>
                </ButtonGroup>
                
            </ValidationObserver>

            <Popup title="Information" :value="warningModal.visible" @close="() => showWarningModal(false)">
                {{ warningModal.message }}
                <div slot="footer">
                    <FormButton  @click="() => showWarningModal(false)">Ok</FormButton>
                </div>
            </Popup>
        </div>
        
    </FormWrapper>
</template>

<script>
    
    import FormWrapper from 'Components/form/FormWrapper';
    import { getCompany, } from 'Components/companySearch/api';
    import FormAutoComplete from 'Components/form/FormAutoComplete';
    import PageTitle from 'Components/layout/PageTitle';
    import { receiptConfirmPdfROD } from './api';
    import { ValidationObserver } from "vee-validate";

    export default {
        name: "RodReceipt",
        components: {
            FormAutoComplete,
            FormWrapper,
            PageTitle,
            ValidationObserver
        },
        data(){
            return {
                companies: [],
                company: {
                    EntityType: 'IBC',
                    Name: '',
                    CompanyRegNo: '',
                    id: null,
                },
                isSelected: false,
                customErrors: {
                    notSelectedError: false,
                },
                warningModal: {
                    visible: false,
                    message: '',
                }
            }
        },
        created(){
        },
        computed:{
            userData() {
                return this.$store.state.user.user;
            },
        },
        watch:{
            'company.Name': function(val){
                if(val === ''){
                    this.isSelected = false;
                    this.reset();
                }
            },
            'company.CompanyRegNo': function(val){
                if(val === '' || val === null || val === undefined){
                    this.isSelected = false;
                    this.reset();
                }
            }
        },
        methods: {
            printReceipt(type) {
                receiptConfirmPdfROD({company_id: this.company.id, type: type}).then(
                    res => {
                        if(res.data == ''){
                            this.warningModal.message = 'No Data available for this IBC yet.';
                            this.showWarningModal(true);
                        }
                        else{
                            window.open(res.data, 'blank')
                        }
                    }
                )
            },
            showWarningModal(val){
                this.warningModal.visible = val;
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
                const { CompanyRegNo , EntityType} = this.company;
                if (CompanyRegNo ) {
                        getCompany({
                            Name: '',
                            RegNo: CompanyRegNo,
                            EntityType: EntityType
                        }).then(res => {
                            if (res.data[0] && res.data[0].length > 0) {
                                this.company = res.data[0][0];
                                this.companies = [];
                                this.isSelected = true;
                            }else{
                                this.company.Name = '';
                                this.company.id = null;
                            }
                        }
                    )
                }
            },
            onSelectCompanyByName(value) {
                this.company = this.companies.find(item => item.Name === value);
                this.isSelected = true;
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
                    EntityType: this.company.EntityType,
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
        position: absolute;
        max-width: 100%;
        left: 0;
        font-size: 11px;
        line-height: 13px;
        bottom: -15px;
        font-weight: 400;
    }
</style>