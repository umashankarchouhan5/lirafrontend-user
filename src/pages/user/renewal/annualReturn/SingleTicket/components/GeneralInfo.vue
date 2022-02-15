<template>
    <div>
        <div v-if="processId === 115 || processId === 346">
            
            <FormRow>
                <div class="col-sm-4">
                    <InputText v-model="innerValue.CompanyName" readonly label="Company Name" :maxlength="200" />
                </div>
                <div class="col-sm-2">
                    <InputText v-model="innerValue.CompanyRegNo" readonly :maxlength="20" label="Company Reg No" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-6">
                    <AddressInput v-model="userData.icsp_address[0].address_id"  label="Company Address" readonly />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-4">
                    <InputText v-model="innerValue.AuditorName" rules="required" :readonly="innerValue.Status_id !== 43" label="Auditor Name" :maxlength="200" />
                </div>
                <div class="col-sm-2">
                    <InputText v-model="innerValue.AuditorRegNo" rules="required" :readonly="innerValue.Status_id !== 43" :maxlength="20" label="Auditor Reg No" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-6">
                    <InputText v-model="innerValue.AuditorAddress" rules="required" :readonly="innerValue.Status_id !== 43"  label="Auditor Address"  />
                </div>
            </FormRow>
            <FormRow :class="$style.flexRow">
                <div class="col-sm-2" >
                    <p>Current Year Revenue</p>
                </div>
                <div class="col-sm-2">
                    <InputAmount label="in SCR" rules="required" :readonly="innerValue.Status_id !== 43" v-model="innerValue.RevenueSCR" />
                </div>
                <div class="col-sm-2">
                    <InputAmount label="in USD" rules="required" :readonly="innerValue.Status_id !== 43" v-model="innerValue.RevenueUSD" />
                </div>
            </FormRow>
            <FormRow :class="$style.flexRow">
                <div class="col-sm-2">
                    <p>Current Assets</p>
                </div>
                <div class="col-sm-2">
                    <InputAmount label="in SCR" rules="required" :readonly="innerValue.Status_id !== 43" v-model="innerValue.CurrentAsset" />
                </div>
                <div class="col-sm-2">
                    <p>Current Liability</p>
                </div>
                <div class="col-sm-2">
                    <InputAmount label="in SCR" rules="required" :readonly="innerValue.Status_id !== 43" v-model="innerValue.CurrentLiability" />
                </div>
            </FormRow>
            <FormRow :class="$style.flexRow">
                <div class="col-sm-2">
                    <p>Total Asset</p>
                </div>
                <div class="col-sm-2">
                    <InputAmount label="in SCR" rules="required" :readonly="innerValue.Status_id !== 43" v-model="innerValue.TotalAsset" />
                </div>
                <div class="col-sm-2">
                    <p>Total Liability</p>
                </div>
                <div class="col-sm-2">
                    <InputAmount label="in SCR" rules="required" :readonly="innerValue.Status_id !== 43" v-model="innerValue.TotalLiability" />
                </div>
            </FormRow>
            <FormRow >
                <div class="col-sm-2">
                    <InputAmount label="Liquid Asset" rules="required" :readonly="innerValue.Status_id !== 43" v-model="innerValue.LiquidAsset" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-2">
                    <InputAmount label="Total Equity" rules="required" :readonly="innerValue.Status_id !== 43" v-model="innerValue.TotalEquity" />
                </div>
            </FormRow>
            <FormRow :class="$style.flexRow">
                <div class="col-sm-2">
                    <p>Current Year Profit Loss</p>
                </div>
                <div class="col-sm-2">
                    <InputAmount label="in SCR" rules="required" :readonly="innerValue.Status_id !== 43" v-model="innerValue.ProfitLossSCR" />
                </div>
                <div class="col-sm-2">
                    <InputAmount label="in USD" rules="required" :readonly="innerValue.Status_id !== 43" v-model="innerValue.ProfitLossUSD" />
                </div>
            </FormRow>
        </div>
        <div v-if="processId === 116 || processId === 347">
            <FormRow>
                <div class="col-sm-4" >
                    <InputDate label="Due Date" v-model="innerValue.DueDate" readonly />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-4" >
                    <InputDate label="Requested Due Date" rules="required" :readonly="innerValue.Status_id !== 43" v-model="innerValue.RequestedDueDate"  />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-6" >
                    <InputTextArea :row="5" label="Reason For Extension" rules="required" :readonly="innerValue.Status_id !== 43" v-model="innerValue.ReasonForExtension"  />
                </div>
            </FormRow>
        </div>

    </div>
</template>

<script>

    import AddressInput from 'Components/form/addressInput/AddressInput';
    import InputDate from 'Components/form/InputDate';
    import valueMixin from 'Mixins/valueMixin';
    import { processDependentComponents } from '../steps';
    import { getCompany } from '../../api';
    // import debounce from 'Utils/debounce';

    export default {
        name: "GeneralInfo",
        mixins: [valueMixin],
        components: {
            AddressInput,
            InputDate,
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
            innerValue(val){
                if(val.company_id !== null && val.company_id !== undefined){
                    this.getCompanyFromID();
                }
            }
        },
        data() {
            return {
                entitySelected: false,
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
                dataSelected: false,
                company: [],
            }
        },
        props: {
            mode: String,
            steps: Array,
            readonly: Boolean,
            customErrors: Array,
            value: {
                type: Object,
                required: true,
            },
        },
        methods: {
            
            getCompanyFromID(){
                getCompany({
                    EntityType: this.innerValue.EntityType,
                    Name: '',
                    RegNo: this.innerValue.company_id,
                    ICSP_id: this.userData.icsp_id
                }).then(
                    res => {
                        this.company = res.data[0];
                })
            }
            
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
    .flexRow {
        display: flex;
        align-items: center;
    }
</style>
