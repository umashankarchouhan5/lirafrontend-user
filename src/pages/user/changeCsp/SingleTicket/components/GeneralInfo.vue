<template>
    <div>
        <FormRow>
            <div class="col-sm-3">
                <FormSelect rules="required"
                    :disabled="firstPage || readonly"
                    label="License"
                    :items="licenseList"
                    item-name="longName"
                    item-value="license_id"
                    v-model="innerValue.license_id" />
            </div>
            <div class="col-sm-6">
                <FormSelect rules="required"
                    :disabled="firstPage || readonly || innerValue.license_id === null"
                    label="Change Type"
                    :items="process_ids"
                    item-name="Name"
                    item-value="id"
                    v-model="innerValue.process_id" />
            </div>
        </FormRow>
        <div v-if="innerValue.process_id === 380">
            <h6>Primary Person Contact Details</h6>
            <Person v-model="primaryPersonData" :selectPersonData="selectPersonData" validationRule="required" :readonly="readonly  " :mode="mode" />
            <h6> Other Contact Details</h6>
            <Person v-model="otherPersonData" :selectPersonData="selectPersonData" :readonly="readonly  " :mode="mode" />
        </div> 
        <div v-if="innerValue.process_id === 381">
            <CompanyPerson v-model="innerValue" :personData="personData" :licenseType="licenseType[0].LicenseType" :readonly="readonly  " :mode="mode" />
        </div>
        <div v-if="innerValue.process_id === 383">
            <FormRow v-if="innerValue.OldPrincipalAddress_id !== null && innerValue.OldPrincipalAddress_id !== undefined" >
                
                <div class="col-sm-6">
                    <AddressInput v-model="innerValue.OldPrincipalAddress_id"  readonly label="Current Registered Office Address" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-6">
                    <AddressInput v-model="innerValue.PrincipalAddress_id" :readonly="readonly " rules="required" vid="PrincipleAddress_id" label="Proposed Registered Office Address" />
                </div>
            </FormRow> 
        </div>
        <div v-if="innerValue.process_id === 390">   
            <FormRow>
                 
                <div class="col-sm-6">
                    <InputText type="number" name="TIN" rules="required|digits:10" vid="TIN" :readonly="readonly"  :maxlength="10" v-model="innerValue.TIN"  label="TIN" />
                </div>
            </FormRow>
        </div>
    </div>
</template>

<script>

    import AddressInput from 'Components/form/addressInput/AddressInput';
    import valueMixin from 'Mixins/valueMixin';
    import {  getCompany, getICSPforCompany } from 'Components/companySearch/api';
    import { getPcWeb, changeTicket, CSPManagerialStaff, getPersonDetails } from '../api';
    import Person from './person';
    import CompanyPerson from './CompanyPersons'

    export default {
        name: "GeneralInfo",
        mixins: [valueMixin],
        components: {
            AddressInput,
            Person,
            CompanyPerson,
        },
        props: {
            mode: String,
            icsp_ids: Array,
            process_ids: Array,
            licenseList: Array,
            steps: Array,
            readonly: Boolean,
            customErrors: Array,
            firstPage: Boolean,
            value: {
                type: Object,
                required: true,
            },
            reference_id:[Number,String]
        },
        data() {
            return {
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                dateOptions: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                companies: [],
                company: {
                    EntityType: null,
                    Name: '',
                    CompanyRegNo: '',
                },
                isSelected: false,
                dataSelected: false,
                primaryPersonData: {},
                otherPersonData: {},
                personData: [],
                selectPersonData: [],
                licenseType: ''
            }
        },
        created() {
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
            licenseList(val){
                if(val.length === 1){
                    this.innerValue.license_id = val[0].license_id
                }
            },
            innerValue:{
                deep: true,
                handler(val){
                    if(this.innerValue.license_id === undefined && this.innerValue.License_id !== undefined ){
                        this.innerValue.license_id = this.innerValue.license_id === undefined && this.innerValue.License_id !== undefined ? this.innerValue.License_id : this.innerValue.license_id;
                    }
                }
            },
            'innerValue.reference_id':function(val){
                if( val !== 0 && this.mode === 'edit' && this.innerValue.process_id === 381){
                    this.personData = JSON.parse(this.innerValue.peopleJson);
                }
                if( val !== 0 && this.mode === 'edit'&& this.innerValue.process_id === 380 ){
                    this.fetchPersons();
                }
            },
            'innerValue.process_id': function (newValue) {
                this.$store.commit('setProcessId', newValue);
                if(!this.readonly){
                    this.reset();
                }
                this.dataSelected = false;
                if(newValue !== null && newValue !== undefined && !this.readonly){
                    this.getChangeRequest(newValue);
                }
                if(newValue === 380){
                    this.getPersonData()
                }
                
            },
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
            primaryPersonData:{
                deep: true,
                handler(val){
                    this.innerValue.PrimaryPerson_id = val.id;
                }
            },
            otherPersonData:{
                deep: true,
                handler(val){
                    this.innerValue.OtherPerson_id = val.id;
                }
            },
            'innerValue.license_id': function(val) {
                if(val !== undefined && val !== null ){
                    this.licenseType = this.licenseList.filter( item => val == item.license_id);
                }
            }
        },
        methods: {
            getChangeRequest(id){
                changeTicket({process_id: id, reference_id: this.reference_id, ICSP_id: this.userData.icsp_id,license_id: this.innerValue.license_id === undefined && this.innerValue.License_id !== undefined ? this.innerValue.License_id : this.innerValue.license_id}).then(
                    res => {
                        var response = res.data[0];
                        this.$set(this.innerValue,'OldPrincipalAddress_id',response.OldPrincipalAddress_id);
                        this.innerValue.reference_id = response.reference_id;
                        this.innerValue.OtherPerson_id = response.OtherPerson_id;
                        this.innerValue.PrimaryPerson_id = response.PrimaryPerson_id;
                        // this.innerValue.PrincipalAddress_id = response.PrincipalAddress_id !== 0 ? response.PrincipalAddress_id : '';
                        this.$set(this.innerValue,'PrincipalAddress_id',response.PrincipalAddress_id !== 0 ? response.PrincipalAddress_id : '');
                        this.innerValue.peopleJson = response.peopleJson
                        if(id === 381){
                            this.personData = JSON.parse(res.data[0].peopleJson);
                        }
                        if(id === 380){
                            this.fetchPersons();
                        }
                    }
                )
            },
            fetchPersons(){
                if(this.innerValue.PrimaryPerson_id !== null && this.innerValue.PrimaryPerson_id !== undefined ){
                    getPersonDetails({person_id: this.innerValue.PrimaryPerson_id}).then(
                        res=>{
                            this.primaryPersonData = res.data[0]
                        }
                    )
                }
                if(this.innerValue.OtherPerson_id !== null && this.innerValue.OtherPerson_id !== undefined ){
                    getPersonDetails({person_id: this.innerValue.OtherPerson_id}).then(
                        res=>{
                            this.otherPersonData = res.data[0]
                        }
                    )
                }
            },
            getPersonData(){
                const data = {
                    license_id: this.innerValue.license_id === undefined && this.innerValue.License_id !== undefined ? this.innerValue.License_id : this.innerValue.license_id
                }
                CSPManagerialStaff(data).then(
                    res => {
                        this.selectPersonData = res.data;
                    }
                )
            },
            getPcWebData(){
                getPcWeb({
                    step: 1,
                    process_id: this.processId,
                    EntityType: this.company.EntityType,
                }).then(
                    (res) =>{
                        this.pcWeb = res.data[0];
                        this.$store.commit('setPcWeb',this.pcWeb);
                    }
                )
            },
            searchByRegNoTab() {
                
                if (!this.isSelected) {
                    const { CompanyRegNo } = this.company;
                    const { EntityType } = this.company;
                    if (CompanyRegNo ) {
                        getCompany({
                            EntityType: EntityType,
                            Name: '',
                            RegNo: CompanyRegNo,
                            process_id: this.processId,
                            ICSP_id: this.userData.icsp_id
                        }).then(res => {
                            if (res.data[0] && res.data[0].length > 0) {
                                this.company = res.data[0][0];
                                this.innerValue.Company_id = this.company.id
                                this.innerValue.company[0].EntityType = this.company.EntityType;
                                this.innerValue.company[0].Name = this.company.Name;
                                this.innerValue.company[0].CompanyRegNo = this.company.CompanyRegNo;
                                this.innerValue.Address_id = this.company.Address_id;
                                this.isSelected = false;
                                this.$store.commit('setCompany',this.company);
                            }
                        })
                    }
                }
            },
            searchByRegNo(event) {
                if(event.keyCode === 13){
                    if (!this.isSelected) {
                        const { CompanyRegNo } = this.company;
                        const { EntityType } = this.company;
                        if (CompanyRegNo ) {
                            getCompany({
                                EntityType: EntityType,
                                Name: '',
                                RegNo: CompanyRegNo,
                                process_id: this.processId,
                                ICSP_id: this.userData.icsp_id
                            }).then(res => {
                                if (res.data[0] && res.data[0].length > 0) {
                                    this.company = res.data[0][0];
                                    this.innerValue.Company_id = this.company.id
                                    this.innerValue.company[0].EntityType = this.company.EntityType;
                                    this.innerValue.company[0].Name = this.company.Name;
                                    this.innerValue.company[0].CompanyRegNo = this.company.CompanyRegNo;
                                    this.innerValue.Address_id = this.company.Address_id;
                                    // this.innerValue.IncomingICSP_id = this.company.id;
                                    this.isSelected = false;
                                    // this.getPcWebData();
                                    
                                    this.$store.commit('setCompany',this.company);
                                }
                            })
                        }
                    }
                }
            },
            onSelectCompanyByName(value) {
                if(!this.readonly){
                    this.company = this.companies.find(item => item.Name === value);
                    this.innerValue.Company_id = this.company.id;
                    
                    this.innerValue.company[0].EntityType = this.company.EntityType;
                    this.innerValue.company[0].Name = this.company.Name;
                    this.innerValue.company[0].CompanyRegNo = this.company.CompanyRegNo;
                }
                var self = this;
                if(this.innerValue.process_id !== 300){
                    this.innerValue.Address_id = this.company.Address_id;
                }
                if(this.innerValue.process_id === 300 && !this.readonly){
                    getICSPforCompany({company_id: self.company.id}).then(
                        (res) => {
                            self.innerValue.address_id = res.data[0].Address_id;
                            self.innerValue.OutgoingICSP_id = res.data[0].ICSP_id;
                            self.outgoingICSP.name = res.data[0].ICSP;
                            self.outgoingICSP.address = res.data[0].Address_id;
                            self.outgoingICSP.ICSPCode = res.data[0].ICSPCode
                        }
                    )
                }else{
                     getICSPforCompany({company_id: self.innerValue.Company_id}).then(
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
                this.isSelected = false;
            },
            searchForCompany(Name) {
                const { EntityType } = this.company;
                if(!this.readonly){
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
                }
            },
        }
    }
</script>

<style lang="scss" module>

    .limitedBy {
        display: flex;
        height: 38px;
        align-items: center;
        margin-bottom: 20px;

        > * {
            margin-right: 40px;
        }
    }

    .limitedByValues {
        display: flex;
        margin-bottom: 20px;

        > * {
            width: 200px;
            margin-right: 20px;

            &:first-child {
                width: 80px;
            }
        }
    }

    .error {
        color: #ff3547;
        font-size: 11px;
        line-height: 13px;
        font-weight: 400;
    }

</style>
