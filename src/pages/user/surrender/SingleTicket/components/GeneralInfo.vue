<template>
    <div>
        <FormRow >
            <div class="col-sm-6">
                <FormSelect rules="required"
                    label="License"
                    :items="licenseList"
                    item-name="longName"
                    item-value="license_id"
                    :clearable="false"
                    v-model="innerValue.license_id" />
            </div>
        </FormRow>
        <FormRow >
            <div class="col-sm-6">
                <InputText rules="required" label="For Company" readonly  v-model="licenseeCompany"  />
            </div>
        </FormRow>
        <FormRow >
            <div class="col-sm-4">
                <InputDate rules="required" label="Tentative Effective Date of Surrender of Licence" :options="options"  v-model="innerValue.effectiveDate"  />
            </div>
        </FormRow>
       
        <!-- <FormRow>
            <div class="col-sm-4" >
                <FormSelect  label="Select Reason" :items="reasons" :disabled="readonly" item-name="Name" item-value="id" v-model="innerValue.cessationReason_id" :onChange="selectReason" />
            </div> 
        </FormRow> -->
        <FormRow >
            <div class="col-sm-12">
                <InputTextArea rules="required" label="Please provide the full disclosure of the reasons for the surrender of licence" rows="5"  v-model="innerValue.cessationReason" maxlength="500"  />
            </div>
        </FormRow>
        <FormRow >
            <div class="col-sm-12">
                <InputTextArea rules="required" label="Please state below the measures being undertaken to discharge your liabilities and the transfer of business of your clients" rows="5" maxlength="500"  v-model="innerValue.measure"  />
            </div>
        </FormRow>
    </div>
</template>

<script>

    import InputDate from 'Components/form/InputDate';
    import valueMixin from 'Mixins/valueMixin';
    import { getStrikeOffReason, fetchICSPLicenseList } from '../../api';

    export default {
        name: "GeneralInfo",
        mixins: [valueMixin],
        components: {
            InputDate,
        },
        props: {
            mode: String,
            icsp_ids: Array,
            process_ids: Array,
            steps: Array,
            readonly: Boolean,
            customErrors: Array,
        },
        data() {
            return {
                entitySelected: false,
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                isSelected: false,
                dataSelected: false,
                reasons: [],
                licenseList: [],
                licenseeCompany: '',
            }
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
        created() {
            this.getData();
        },
        watch: {
            'innerValue.license_id': function(val) {
                if( val !== null && val !== undefined && this.licenseList.length !== 0){
                    this.licenseeCompany = this.licenseList.find( item => {
                        return item.license_id == val;
                    }).CompanyName
                }
            }
            
        },
        methods: {
            getData(){
                Promise.all([
                    fetchICSPLicenseList({ICSP_id: this.userData.icsp_id}),
                    getStrikeOffReason({process_id: this.processId}),
                ]).then(this.handleResponse)
            },
            handleResponse(response) {
                // this.reasons = response[1].data;
                this.licenseList = response[0].data[0];
                if(this.licenseList.length == 1){
                    
                    this.innerValue.license_id = this.licenseList[0].license_id;
                    this.licenseeCompany = this.licenseList.find( item => {
                        return item.license_id == this.innerValue.license_id;
                    }).CompanyName
                }
            },
            selectReason(id){
                if(id !== undefined && id !== null ){
                    this.innerValue.cessationReason = this.reasons.find( ele => ele.id === id).description 
                }else{
                    this.innerValue.cessationReason = '';
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
