<template>
    <div>
        
        <FormRow>
            <div class="col-sm-3">
                <FormSelect rules="required"
                    :disabled="readonly"
                    label="License"
                    :items="licenseList"
                    item-name="longName"
                    item-value="license_id"
                    v-model="innerValue.license_id" />
            </div>
            <div class="col-sm-6">
                <FormSelect rules="required"
                    :disabled="readonly || innerValue.license_id === null"
                    label="Change Type"
                    :items="process_ids"
                    item-name="Name"
                    item-value="id"
                    v-model="innerValue.process_id" />
            </div>
            
            <div class="col-sm-3">
                <InputDate label="Effective Date" rules="required" v-model="innerValue.effectiveDate" />
            </div>
        </FormRow>
        <template v-if="innerValue.process_id === 2048">
            <FormRow>
                <div class="col-sm-3">
                    <InputMonth name="Financial Year End Month" label="Old Financial Year End Month" readonly :clearable="true" v-model="licenseData.FinancialYearEndMM" rules="required"/>
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-3">
                    <InputMonth name="New Financial Year End Month" label="New Financial Year End Month" :readonly="readonly" :clearable="true" v-model="innerValue.financialYearEndMM" />
                </div>
            </FormRow>
        </template>
        <template v-if="innerValue.process_id === 2046">
            <FormRow>
                <div class="col-sm-5">
                    <InputText name="Old Trade Name" label="Old Trade Name" readonly :clearable="true" v-model="licenseData.TradeName" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-5">
                    <InputText name="New Trade Name" label="New Trade Name" :readonly="readonly" :clearable="true" v-model="innerValue.tradeName" rules="required"/>
                </div>
            </FormRow>
        </template>
        <template v-if="innerValue.process_id === 2045">
            <FormRow>
                <div class="col-sm-8">
                    <AddressInput name="Old Principal Address" label="Old Principal Address" readonly :clearable="true" v-model="licenseData.PrincipalAddress_id" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-8">
                    <AddressInput name="New Principal Address" label="New Principal Address" :readonly="readonly" :clearable="true" v-model="innerValue.principalAddress_id" rules="required"/>
                </div>
            </FormRow>
        </template>
        <template v-if="innerValue.process_id === 2044">
            <FormRow>
                <div class="col-sm-8">
                    <AddressInput name="Old Registered Address" label="Old Registered Address" readonly :clearable="true" v-model="licenseData.Address_id" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-8">
                    <AddressInput name="New Registered Address" label="New Registered Address" :readonly="readonly" :clearable="true" v-model="innerValue.address_id" rules="required"/>
                </div>
            </FormRow>
        </template>
        
        <template v-if="innerValue.process_id === 2041">
            <h4>Old Auditor Data</h4>
            <br />
            <FormRow v-if="licenseData.AuditorJson !== undefined">
                <div class="col-sm-12">
                    <Records v-model="licenseData.AuditorJson" readonly />
                </div>
            </FormRow>
            <h4>New Auditor Data</h4>
            <br />
            <FormRow>
                <div class="col-sm-12">
                    <Records v-model="innerValue.auditorJson" :readonly="readonly" />
                </div>
            </FormRow>
        </template>
        <template v-if="innerValue.process_id === 2042">
            <h4>Old Legal Data</h4>
            <br />
            <FormRow v-if="licenseData.LegalJson !== undefined">
                <div class="col-sm-12">
                    <Records v-model="licenseData.LegalJson" readonly />
                </div>
            </FormRow>
            <h4>New Legal Data</h4>
            <br />
            <FormRow>
                <div class="col-sm-12">
                    <Records v-model="innerValue.legalJson" :readonly="readonly" />
                </div>
            </FormRow>
        </template>

    </div>
</template>

<script>

    import valueMixin from 'Mixins/valueMixin';
    import { getPcWeb, fetchLicenseeData } from '../api';
    import InputDate from 'Components/form/InputDate';
    import AddressInput from 'Components/form/addressInput/AddressInput';
    import Records from './records';

    export default {
        name: "GeneralInfo",
        mixins: [valueMixin],
        components: {
            InputDate,
            AddressInput,
            Records
        },
        props: {
            mode: String,
            process_ids: Array,
            steps: Array,
            readonly: Boolean,
            customErrors: Array,
            value: {
                type: Object,
                required: true,
            },
            licenseList: Array,
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
                licenseData: [],
            }
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
            licenseList(val){
                if(val.length === 1){
                    this.innerValue.license_id = val[0].license_id;
                }
                if(val !== null && val !== undefined){
                    this.getChangeRequest();
                }
            },
            'innerValue.process_id': function (newValue) {
                this.$store.commit('setProcessId', newValue);
                this.dataSelected = false;
                if(newValue !== null && newValue !== undefined && !this.readonly){
                }
                
            },
        },
        created() {
        },
        methods: {
            getPcWebData(){
                getPcWeb({
                    step: 1,
                    process_id: this.processId,
                }).then(
                    (res) =>{
                        this.pcWeb = res.data[0];
                        this.$store.commit('setPcWeb',this.pcWeb);
                    }
                )
            },
            getChangeRequest(){
                fetchLicenseeData({license_id: this.innerValue.license_id}).then(
                    res => {
                        this.licenseData = res.data[0];
                        this.licenseData.AuditorJson = JSON.parse(this.licenseData.AuditorJson);
                        this.licenseData.LegalJson = JSON.parse(this.licenseData.LegalJson);
                    }
                )
            }
        }
    }
</script>

<style lang="scss" module>

    .error {
        color: #ff3547;
        font-size: 11px;
        line-height: 13px;
        font-weight: 400;
    }

</style>
