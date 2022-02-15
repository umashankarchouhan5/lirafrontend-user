<template>
    <div>
        <FormRow>
            <div class="col-sm-7">
                <div class="row">
                    <div class="col-sm-8">
                        <FormSelect rules="required"
                            :disabled="readonly || isSaved"
                            label="Change Type"
                            :items="process_ids"
                            item-name="Name"
                            item-value="id"
                            v-model="innerValue.process_id" />
                    </div>
                    <div class="col-sm-3" v-if="innerValue.process_id && innerValue.process_id !== 302">
                        <FormSelect :disabled="readonly || dataSelected || isSaved || isRestricted"
                            v-model="company.EntityType"
                            :items="entityTypes"
                            label="Entity Type"
                            item-name="Name"
                            item-value="Name"
                            rules="required" />
                    </div>
                </div>
            </div>
        </FormRow>
        <!-- <SearchCompanyNew v-model="company"   /> -->
        <template v-if="innerValue.process_id && innerValue.process_id !== 300  && innerValue.process_id !== 311 && innerValue.process_id !== 302 && innerValue.process_id !== 602 && innerValue.process_id !== 603">
            <FormRow >
                <div class="col-sm-6">
                    <div class="row">
                        <div class="col-sm-2">
                            <InputText rules="required" noApostrophe label="Reg #" :disabled="readonly || !entitySelected || dataSelected || isSaved || isRestricted" v-model="company.CompanyRegNo" @keyup.native="searchByRegNo" @focusout="searchByRegNoTab" />
                        </div>
                        <div class="col-sm-8">
                            <FormAutoComplete
                                :disabled="readonly || !entitySelected  || dataSelected || isSaved || isRestricted"
                                label="Entity Name"
                                rules="required"
                                v-model="company.Name"
                                :onChange="onSearchName"
                                :items="companies"
                                item-value="Name"
                                item-name="Name"
                                :onSelect="onSelectCompanyByName" />
                        </div>
                    </div>
                </div>
            </FormRow>
            <div :class="$style.infoMessage" v-if="noCompanyFound">No Company Found</div>
        </template>

        <FormRow v-if="company.Address_id">
            <div class="col-sm-7">
                <AddressInput readonly label="Company Address" :value="company.Address_id" />
            </div>
        </FormRow>

        <template v-if="innerValue.process_id === 300 || innerValue.process_id === 311">
            <CompanyModule v-model="innerValue" :readonly="readonly || isRestricted" />
            <br />
            <p><b>Incoming Agent Details:</b></p>
            <br />

            <FormRow>
                <div class="col-sm-6">
                    <div class="row">
                        <div class="col-sm-7">
                            <InputText label="Agent Name" v-model="userData.icsp_name" readonly />
                        </div>
                    </div>
                </div>
            </FormRow>
        </template>

        <template v-if="innerValue.process_id === 301">
            <p><b>Incoming Agent Details:</b></p>
            <br />

            <FormRow>
                <div class="col-sm-6">
                    <div class="row">
                        <div class="col-sm-7">
                            <FormSelect :rules="{required:true}" :vid="`CSPNameIncoming`" :disabled="readonly || isRestricted" label="Agent Name" :items="outgoingFileteredIcspIds" item-name="name" item-value="id" v-model="innerValue.IncomingICSP_id" />
                        </div>
                    </div>
                </div>
            </FormRow>

                <p><b>Outgoing Agent Details:</b></p>
                <br />

            <FormRow>
                <div class="col-sm-6">
                    <div class="row">
                        <div class="col-sm-7">
                            <InputText label="Agent Name" v-model="userData.icsp_name" readonly />
                        </div>
                    </div>
                </div>
            </FormRow>
        </template>
        
        <template v-if="innerValue.process_id === 302">
            <FormRow>
                <div class="col-sm-7">
                    <AddressInput rules="required" label="Present Address" readonly :value="presentAddress_id" />
                </div>
            </FormRow>
        </template>
        <template v-if="innerValue.process_id === 302">
            <FormRow>
                <div class="col-sm-7">
                    <AddressInput rules="required" label="New Address" :vid="`NewAddress`" v-model="innerValue.newAddressId" />
                </div>
            </FormRow>
        </template>
        <template v-if="innerValue.process_id === 303">
            <div :class="$style.checkItem">
                <div :class="$style.checkbox" @change="changeCheckboxValue" >
                    <FormCheckbox v-model="innerValue.isMOU" :true-value="1" :false-value="0" :disabled="readonly || isRestricted"/>
                </div>
                <div :class="$style.checkBrief">
                    Amendment to Memorandum
                </div>
            </div>    
            <div :class="$style.checkItem">
                <div :class="$style.checkbox" @change="changeCheckboxValue" >
                    <FormCheckbox v-model="innerValue.isAOA" :true-value="1" :false-value="0" :disabled="readonly || isRestricted"/>
                </div>
                <div :class="$style.checkBrief">
                    Amendment to Articles
                </div>
            </div>    
            <div :class="$style.checkItem">
                <div :class="$style.checkbox" @change="changeCheckboxValue" >
                    <FormCheckbox v-model="innerValue.isRestatedMOU" :true-value="1" :false-value="0" :disabled="readonly || isRestricted"/>
                </div>
                <div :class="$style.checkBrief">
                    Restated Memorandum
                </div>
            </div>    
            <div :class="$style.checkItem">
                <div :class="$style.checkbox" @change="changeCheckboxValue" >
                    <FormCheckbox v-model="innerValue.isRestatedAOA" :true-value="1" :false-value="0" :disabled="readonly || isRestricted"/>
                </div>
                <div :class="$style.checkBrief">
                    Restated Articles
                </div>
            </div>
            <br /> 
        </template>
        <template v-if="innerValue.process_id === 304">
            <FormRow v-if="entitySelected">
                <div class="col-sm-5">
                    <ApprovedNamesSelect v-model="innerValue.ApprovedName_id" :entityType="company.EntityType" v-if="!readonly && !isRestricted" />
                    <ApprovedNamesSelect v-model="innerValue.CompanyNewName" :entityType="company.EntityType" v-else :readonly="readonly  || isRestricted" />
                </div>
            </FormRow>
            <div :class="$style.checkItem">
                <div :class="$style.checkbox" @change="changeCheckboxValue" >
                    <FormCheckbox v-model="innerValue.isMOU" :true-value="1" :false-value="0" :disabled="readonly || isRestricted"/>
                </div>
                <div :class="$style.checkBrief">
                    Amendment to Memorandum
                </div>
            </div>    
            <div :class="$style.checkItem">
                <div :class="$style.checkbox" @change="changeCheckboxValue" >
                    <FormCheckbox v-model="innerValue.isAOA" :true-value="1" :false-value="0" :disabled="readonly || isRestricted"/>
                </div>
                <div :class="$style.checkBrief">
                    Amendment to Articles
                </div>
            </div>    
            <div :class="$style.checkItem">
                <div :class="$style.checkbox" @change="changeCheckboxValue" >
                    <FormCheckbox v-model="innerValue.isRestatedMOU" :true-value="1" :false-value="0" :disabled="readonly || isRestricted"/>
                </div>
                <div :class="$style.checkBrief">
                    Restated Memorandum
                </div>
            </div>    
            <div :class="$style.checkItem">
                <div :class="$style.checkbox" @change="changeCheckboxValue" >
                    <FormCheckbox v-model="innerValue.isRestatedAOA" :true-value="1" :false-value="0" :disabled="readonly || isRestricted"/>
                </div>
                <div :class="$style.checkBrief">
                    Restated Articles
                </div>
            </div>
        </template>
        <template v-if="innerValue.process_id === 305">
            <FormRow>
                <div class="col-sm-2">
                    <InputDate :readonly="readonly || isRestricted" :options="options" :vid="`NoticeDate`" rules="required" label="Notice Date" v-model="innerValue.NoticeDate" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-5">
                    <InputTextArea :readonly="readonly || isRestricted" :vid="`ReasonOfResignation`" rules="required" label="Reason for Resigning" v-model="innerValue.ResigReason" />
                </div>
            </FormRow>
        </template>
        <template v-if="innerValue.process_id === 306">
            Template for the process 306
        </template>
        <template v-if="innerValue.process_id === 307 && innerValue.Company_id">
            <FormRow>
                <div class="col-sm-12">
                    <CompanyPersons v-model="innerValue" :readonly="readonly || isRestricted" @onAction="disableAction" :entityType="company.EntityType" />
                </div>
            </FormRow>
        </template>
        <template v-if="innerValue.process_id === 309">
            <FormRow>
                <div class="col-sm-2">
                <FormSelect rules="required"
                    label="Currency"
                    v-model="innerValue.currency"
                    :disabled="readonly || isRestricted"
                    name="NR_currency"
                    :items="currenciesList"
                    item-value="code" item-name="code"/>
                </div>
                <div class="col-sm-4">
                    <InputAmount label="Share Capital" :readonly="readonly || isRestricted" rules="required" v-model="innerValue.shareCapital" />
                </div>
            </FormRow>
            <div :class="$style.checkItem">
                <div :class="$style.checkbox" @change="changeCheckboxValue" >
                    <FormCheckbox v-model="innerValue.isMOU" :true-value="1" :false-value="0" :disabled="readonly || isRestricted"/>
                </div>
                <div :class="$style.checkBrief">
                    Amendment to Memorandum
                </div>
            </div>    
            <div :class="$style.checkItem">
                <div :class="$style.checkbox" @change="changeCheckboxValue" >
                    <FormCheckbox v-model="innerValue.isAOA" :true-value="1" :false-value="0" :disabled="readonly || isRestricted"/>
                </div>
                <div :class="$style.checkBrief">
                    Amendment to Articles
                </div>
            </div>    
            <div :class="$style.checkItem">
                <div :class="$style.checkbox" @change="changeCheckboxValue" >
                    <FormCheckbox v-model="innerValue.isRestatedMOU" :true-value="1" :false-value="0" :disabled="readonly || isRestricted"/>
                </div>
                <div :class="$style.checkBrief">
                    Restated Memorandum
                </div>
            </div>    
            <div :class="$style.checkItem">
                <div :class="$style.checkbox" @change="changeCheckboxValue" >
                    <FormCheckbox v-model="innerValue.isRestatedAOA" :true-value="1" :false-value="0" :disabled="readonly || isRestricted"/>
                </div>
                <div :class="$style.checkBrief">
                    Restated Articles
                </div>
            </div>
            <br /> 
        </template>
        <template v-if="innerValue.process_id === 310">
            <div :class="$style.checkItem">
                <div :class="$style.checkbox" @change="changeCheckboxValue" >
                    <FormCheckbox v-model="innerValue.isMOU" :true-value="1" :false-value="0" :disabled="readonly || isRestricted"/>
                </div>
                <div :class="$style.checkBrief">
                    Amendment to Memorandum
                </div>
            </div>    
            <div :class="$style.checkItem">
                <div :class="$style.checkbox" @change="changeCheckboxValue" >
                    <FormCheckbox v-model="innerValue.isAOA" :true-value="1" :false-value="0" :disabled="readonly || isRestricted"/>
                </div>
                <div :class="$style.checkBrief">
                    Amendment to Articles
                </div>
            </div>    
            <div :class="$style.checkItem">
                <div :class="$style.checkbox" @change="changeCheckboxValue" >
                    <FormCheckbox v-model="innerValue.isRestatedMOU" :true-value="1" :false-value="0" :disabled="readonly || isRestricted"/>
                </div>
                <div :class="$style.checkBrief">
                    Restated Memorandum
                </div>
            </div>    
            <div :class="$style.checkItem">
                <div :class="$style.checkbox" @change="changeCheckboxValue" >
                    <FormCheckbox v-model="innerValue.isRestatedAOA" :true-value="1" :false-value="0" :disabled="readonly || isRestricted"/>
                </div>
                <div :class="$style.checkBrief">
                    Restated Articles
                </div>
            </div>
            <br />
            <FormRow>
                <div class="col-sm-12">
                    <InputTextArea label="Description of change being requested" rows="4" maxlength="500" :readonly="readonly || isRestricted" v-model="innerValue.comment" />    
                </div>    
            </FormRow> 
        </template>
        <template v-if="innerValue.process_id === 602">
            <FormRow>
                <div class="col-sm-2">
                    <InputDate :readonly="readonly || isRestricted" :vid="`EffectiveDate-1`" rules="required" label="Effective Date" v-model="innerValue.ResolutionDate" />
                </div>
            </FormRow>
            <h6>Select Entities to Merge</h6>
            <MergeComponent v-model="innerValue.mergeJson" :readonly="readonly || isRestricted" @companyChange="checkSurvivingCompany" />
            
            <FormRow v-if="innerValue.mergeJson && innerValue.mergeJson[0] && filteredMergeJson.length > 0">
                <div class="col-sm-6">
                    <FormSelect :rules="{required:true}" :vid="`SelectSurvivingCompany`" :disabled="readonly || isRestricted" label="Select Surviving Company Name" :items="filteredMergeJson" item-name="name" item-value="id" v-model="innerValue.Company_id" />
                </div>
            </FormRow>
            <br />
        </template>
        <template v-if="innerValue.process_id === 603">
            <FormRow>
                <div class="col-sm-2">
                    <InputDate :readonly="readonly || isRestricted" :vid="`EffectiveDate-2`" rules="required" label="Effective Date" v-model="innerValue.ResolutionDate" />
                </div>
            </FormRow>
            <h6>Select Entities to consolidate</h6>
            <MergeComponent v-model="innerValue.mergeJson" :readonly="readonly || isRestricted" />
            <FormRow>
                <div class="col-sm-6">
                    <ApprovedNamesSelect v-model="innerValue.ApprovedName_id" :entityType="company.EntityType" :readonly="readonly || isRestricted" />
                </div>
            </FormRow>
        </template>
    </div>
</template>

<script>

    import AddressInput from 'Components/form/addressInput/AddressInput';
    import InputDate from 'Components/form/InputDate';
    import valueMixin from 'Mixins/valueMixin';
    import CompanyPersons from './CompanyPersons';
    import ApprovedNamesSelect from './ApprovedNamesSelect';
    import { processDependentComponents } from '../steps'
    import { getEntityType, getCompany, getExcludedCompany, getICSPforCompany } from 'Components/companySearch/api';
    import { getPcWeb, searchICSPTypes } from '../api';
    import FormAutoComplete from 'Components/form/FormAutoComplete';
    import currenciesMixin from 'Mixins/currenciesMixin';
    import MergeComponent from './MergeComponent';
    import CompanyModule from 'Components/companyModule/CompanyModule';
    // import debounce from 'Utils/debounce';
    
    export default {
        name: "GeneralInfo",
        mixins: [ valueMixin, currenciesMixin ],
        components: {
            ApprovedNamesSelect,
            AddressInput,
            CompanyPersons,
            InputDate,
            FormAutoComplete,
            MergeComponent,
            CompanyModule
        },
        props: {
            mode: String,
            process_ids: Array,
            steps: Array,
            readonly: Boolean,
            customErrors: [Array,Object],
            value: {
                type: Object,
                required: true,
            },
            isSaved: Boolean
        },
        data() {
            return {
                entitySelected: false,
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                newAddressId: '',
                presentAddress_id: '',
                processDependentComponents,
                dateOptions: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                entityTypes: [],
                companies: [],
                outgoingICSP:{
                    name: '',
                    address: ''
                },
                company: {
                    EntityType: null,
                    Name: '',
                    CompanyRegNo: '',
                },
                isSelected: false,
                dataSelected: false,
                icsp_ids: [],
                noCompanyFound: false,
                pcWeb: null
            }
        },
        computed: {
            filteredMergeJson() {
                return this.innerValue.mergeJson.filter(item => item.id !== null)
            },
            selectedCompany(){
                return this.$store.state.user.selectedCompany;
            },
            outgoingFileteredIcspIds(){
                return this.icsp_ids.filter(item => item.id !== this.innerValue.OutgoingICSP_id);
            },
            incomingFileteredIcspIds(){
                return this.icsp_ids.filter(item => item.id !== this.innerValue.IncomingICSP_id);
            },
            processId() {
                return this.$store.state.common.currentProcessId;
            },
            userData() {
                return this.$store.state.user.user;
            },
            outgoingICSPAddressId() {
                let selectedICSP = this.icsp_ids.find(item => item.id === this.innerValue.OutgoingICSP_id);
                return selectedICSP ? selectedICSP.Address_id : null;
            },
            incomingICSPAddressId() {
                let selectedICSP = this.icsp_ids.find(item => item.id === this.innerValue.IncomingICSP_id);
                return selectedICSP ? selectedICSP.Address_id : null;
            },
            incomingICSPCode() {
                let selectedICSP = this.icsp_ids.find(item => item.id === this.innerValue.IncomingICSP_id);
                return selectedICSP ? selectedICSP.ICSPCode : null;
            },
            isRestricted() {
                if(this.pcWeb !== null && this.pcWeb.isRestricted == 1 && this.userData.isRestricted == 1){
                    return true
                }
                return false;
            }
        },
        watch: {
            'innerValue.mergeJson': function(val){
                if(val !== undefined && val !== null){
                    
                }
            },
            'innerValue.reference_id':function(val){
                if(val !== 0 && this.mode === 'edit'){
                    this.company['Name'] = this.innerValue.companyname;
                    if(this.innerValue.company){
                        this.company.EntityType = this.innerValue.company[0].Entitytype;
                    }
                    if(this.innerValue.company && this.innerValue.company[0]){
                        this.company = this.innerValue.company;
                    }
                }
            },
            'innerValue.process_id': function (newValue) {
                this.$store.commit('setProcessId', newValue);
                var processName = newValue !== null  && newValue !== undefined && this.process_ids.length !== 0? this.process_ids.find((item) => {
                    return item.id === newValue;
                }).Name : '';
                this.innerValue.isMOU= 0;
                this.innerValue.isAOA= 0;
                this.innerValue.isRestatedMOU= 0;
                this.innerValue.isRestatedAOA= 0;
                this.$emit('changeProcessName',processName);
                if(!this.readonly){
                    this.reset();
                }
                this.dataSelected = false;
                this.getEntityListHandler();
                if (newValue === 300 || newValue === 311) {
                    this.innerValue.IncomingICSP_id = this.userData.icsp_id;
                    this.innerValue.OutgoingICSP_id = null;
                }
                if (newValue === 301) {
                    this.innerValue.OutgoingICSP_id = this.userData.icsp_id;
                    // if(!this.readonly){
                        this.innerValue.IncomingICSP_id = null;
                    // }
                }
                if (newValue === 302) {
                    this.innerValue.address_id = this.userData.icsp_address[0].address_id;
                    this.presentAddress_id = this.userData.icsp_address[0].address_id;
                    this.innerValue.IncomingICSP_id = null;
                }
            },
            'company.EntityType': function(val){
                this.$store.commit('setChangeEntityType',val);
                if(val !== null && val !== undefined){
                    this.entitySelected = true;
                    this.fetchICSPTypes();
                    this.getPcWebData();
                }else{
                    this.entitySelected = false;
                    this.pcWeb = null;
                    this.resetCompany();
                    this.resetCompanies();
                }
            },
            'innerValue.newAddressId': function(val){
                if(!this.readonly){
                    console.log(val)
                    this.innerValue.address_id = val;
                }
            },
            'innerValue.Company_id': function(val) {
                this.$store.commit('setCompany',{id:val});
            },
        },
        created() {
            this.getEntityListHandler();
            if(this.selectedCompany !== null && this.readonly !== true){
                this.company.id = this.selectedCompany.id;
            }
            if(this.innerValue.company){
                this.company = this.innerValue.company[0];
            }
            if(this.innerValue.process_id == 603 || this.innerValue.process_id == 602){
                this.company.EntityType = 'IBC';
                this.innerValue.EntityType = 'IBC'
            }
            if(this.innerValue.Company_id !== null  && this.mode === 'edit'){
                this.company.id = this.innerValue.Company_id;
                this.$store.commit('setCompany',this.company);
            }
        },
        methods: {
            checkSurvivingCompany(){
                if(this.innerValue.process_id == 602) {
                    if(this.innerValue.Company_id !== null){
                        const checkSelection = this.filteredMergeJson.filter( item => {
                            return item.id == this.innerValue.Company_id;
                        })
                        if(checkSelection.length == 0){
                            this.innerValue.Company_id = null;
                        }
                    }
                }
            },
            fetchICSPTypes() {
                searchICSPTypes({entityType: this.company.EntityType}).then(res => {
                    this.icsp_ids = res.data
                })
            },
            changeCheckboxValue() {
                // this.$emit('onChangeCheck', JSON.stringify(this.activityJson));
            },
            disableAction(data){
                this.dataSelected = data;
                this.$emit('307Action',true);
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
                        if(this.innerValue.process_id !== 300 || this.innerValue.process_id !== 311){
                            getCompany({
                                EntityType: EntityType,
                                Name: '',
                                RegNo: CompanyRegNo,
                                process_id: this.processId,
                                icsp_id: this.userData.icsp_id
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
                                    this.noCompanyFound = false;
                                }
                                
                                if(this.innerValue.Company_id == null){
                                    this.noCompanyFound = true;
                                }
                            })
                        }else{
                            getExcludedCompany({
                                EntityType,
                                Name: '',
                                RegNo: CompanyRegNo,
                                process_id: this.processId,
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
                    this.innerValue.Company_id = this.company.id;
                    
                    this.innerValue.company[0].EntityType = this.company.EntityType;
                    this.innerValue.company[0].Name = this.company.Name;
                    this.innerValue.company[0].CompanyRegNo = this.company.CompanyRegNo;
                    this.noCompanyFound = false;
                }
                var self = this;
                if(this.innerValue.process_id !== 300 || this.innerValue.process_id !== 311){
                    this.innerValue.Address_id = this.company.Address_id;
                }
                if((this.innerValue.process_id === 300 || this.innerValue.process_id === 311) && !this.readonly){
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
                    if( this.innerValue.process_id !== 300 || this.innerValue.process_id !== 311 ){
                        getCompany({
                            EntityType,
                            Name,
                            RegNo: '',
                            process_id: this.processId,
                            icsp_id: this.userData.icsp_id
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
            getEntityListHandler() {
                getEntityType({
                    process_id: this.processId,
                    icsp_id: this.userData.icsp_id
                }).then(res => {
                    this.entityTypes = res.data;
                    if (this.entityTypes.length === 1) {
                        if(this.innerValue.reference_id === 0){
                            this.company.EntityType = this.entityTypes[0].Name;
                        }
                    }
                    if(this.innerValue.reference_id  !== 0){
                        this.company.EntityType = this.innerValue.company[0].EntityType;
                        if(this.innerValue.company && this.innerValue.company[0]) this.company = this.innerValue.company[0]
                    }
                })
            },
            changeAddressId(id) {
                this.innerValue.address_id = id;
            },
        }
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

    // .error {
    //     color: #ff3547;
    //     max-width: 100%;
    //     font-size: 11px;
    //     line-height: 13px;
    //     font-weight: 400;
    //     margin: -18px 0 18px;
    // }

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
