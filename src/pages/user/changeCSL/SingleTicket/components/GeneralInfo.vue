<template>
    <div>
        <FormRow>
            <div class="col-sm-2">
                <FormSelect rules="required"
                    :disabled="firstPage || readonly"
                    label="Select Type"
                    :items="[{name: 'CSL', type: 'CSL'}, {name: 'PCC', type: 'PCC'}]"
                    item-name="name"
                    item-value="type"
                    v-model="licenseTypeCSL" />
            </div>
            <div class="col-sm-4" v-if="licenseTypeCSL && licenseTypeCSL !== null">
                <FormSelect rules="required"
                    :disabled="firstPage || readonly"
                    label="License"
                    :items="licenseList"
                    item-name="CompanyName"
                    item-value="license_id"
                    v-model="innerValue.license_id" />
            </div>
            <div class="col-sm-6"  v-if="licenseTypeCSL && licenseTypeCSL !== null">
                <FormSelect rules="required"
                    :disabled="firstPage || readonly || innerValue.license_id === null"
                    label="Change Type"
                    :items="process_ids"
                    item-name="Name"
                    item-value="id"
                    v-model="innerValue.process_id" />
            </div>
        </FormRow>

        <div v-if="innerValue.process_id === 357">
            <CompanyPerson v-model="innerValue" :personData="personData" :licenseType="licenseTypeCSL" :readonly="readonly  " :mode="mode" />
        </div>
    </div>
</template>

<script>

    import valueMixin from 'Mixins/valueMixin';
    import {  getCompany, getICSPforCompany } from 'Components/companySearch/api';
    import { getPcWeb, changeTicket, CSPManagerialStaff, getPersonDetails, fetchICSPLicenseList } from '../api';
    import CompanyPerson from './CompanyPersons'

    export default {
        name: "GeneralInfo",
        mixins: [valueMixin],
        components: {
            CompanyPerson,
        },
        props: {
            mode: String,
            icsp_ids: Array,
            process_ids: Array,
            // licenseList: Array,
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
                licenseType: '',
                licenseTypeCSL: null,
                licenseList: [],
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
            licenseTypeCSL(val) {
                if(this.mode != 'edit') {
                    this.innerValue.license_id = null;
                    this.innerValue.process_id = null;
                }
                if(val !== null && val !== undefined) {
                    this.fetchLicenseeList(val);
                }
            },
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
                    if(val !== null && val.EntityType && val.EntityType !== null ){
                        this.licenseTypeCSL = val.EntityType;
                    }
                }
            },
            'innerValue.reference_id':function(val){
                if( val !== 0 && this.mode === 'edit' && this.innerValue.process_id === 357){
                    this.personData = this.innerValue.peopleJson !== null ? JSON.parse(this.innerValue.peopleJson): [];
                }
            },
            'innerValue.process_id': function (newValue) {
                this.$store.commit('setProcessId', newValue);
                if(!this.readonly){
                    this.reset();
                }
                this.dataSelected = false;
                if(newValue !== null && newValue !== undefined && !this.readonly && newValue !== ''){
                    this.getChangeRequest(newValue);
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
                if(this.mode !== 'edit') this.innerValue.process_id = null;
                if(val !== undefined && val !== null ){
                    this.licenseType = this.licenseList.filter( item => val == item.license_id);
                }
            }
        },
        methods: {
            fetchLicenseeList(val) {
                fetchICSPLicenseList({ICSP_id: this.userData.icsp_id, csl_pcc: val}).then( 
                    res => {
                        this.licenseList = res.data[0];
                    }
                );
            },
            getChangeRequest(id){
                const data = {process_id: id, reference_id: this.reference_id, ICSP_id: this.userData.icsp_id,license_id: this.innerValue.license_id === undefined && this.innerValue.License_id !== undefined ? this.innerValue.License_id : this.innerValue.license_id}
                changeTicket(data).then(
                    res => {
                        var response = res.data[0];
                        this.innerValue.reference_id = response.reference_id;
                        this.innerValue.peopleJson = response.peopleJson
                        if(id === 357){
                            this.personData = res.data[0].peopleJson !== null ? JSON.parse(res.data[0].peopleJson) : [];
                        }
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
