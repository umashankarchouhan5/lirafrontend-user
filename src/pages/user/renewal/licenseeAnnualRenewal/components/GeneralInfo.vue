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
                    :disabled="readonly || licenseList.length == 1"
                    v-model="license_id" />
            </div>
                <div class="col-sm-6">
                    <InputText rules="required" label="For Company" readonly  v-model="licenseeCompany"  />
                </div>
        </FormRow>
        <FormRow>
            <div class="col-sm-4" >
                <p><b>Last Renewal Date :</b> {{formatDate(innerValue.lastRenewalDate)}}</p>
            </div>
            
            <div class="col-sm-4" >
                <p><b>Next Renewal Due Date :</b> {{formatDate(innerValue.nextDueDate)}}</p>
            </div>
        </FormRow>
        <FormRow>
            <div class="col-sm-2" >
                <InputText label="Next Renewal Due Year" v-model="innerValue.nextDueYear" readonly />
                <!-- <p><b>Next Renewal Due Year :</b> {{value.DueYear}}</p> -->
            </div>
        </FormRow>
    </div>
</template>
<script>
    import DateUtil from 'Utils/dateUtil';
    import { fetchNextExcelReturnDue, fetchICSPLicenseList } from '../api';
    import valueMixin from 'Mixins/valueMixin';

    export default {
        name: 'GeneralInfo',
        mixins: [valueMixin],
        props: {
            mode: String,
            steps: Array,
            readonly: Boolean,
            customErrors: Array,
            value: {
                type: Object,
                required: true,
            },
            // licenseList: Array,
        },
        components: {
        },
        data(){
            return{
                licenseList: [],
                license_id: null,
                licenseeCompany: '',
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
        created(){
            this.getData();
        },
        watch: {
            license_id (val){
                if(val !== null && val !== undefined){
                    this.licenseeCompany = this.licenseList.find( item => {
                        return item.license_id == this.license_id;
                    }).CompanyName;
                    fetchNextExcelReturnDue({license_id: val, process_id: this.processId}).then(
                        res => {
                            this.innerValue = res.data[0];
                            this.innerValue.license_id = this.license_id;
                        },
                        err => {
                            this.license_id = null;
                            this.licenseeCompany = '';
                            this.ticket = {}
                        }
                    )
                }
            }
        },
        methods: {
            getData(){
                Promise.all([
                    fetchICSPLicenseList({ICSP_id: this.userData.icsp_id})
                ]).then(this.handleResponse)
            },
            handleResponse(response) {
                this.licenseList = response[0].data[0];
                if(this.licenseList.length == 1){
                    this.license_id = this.licenseList[0].license_id
                    this.licenseeCompany = this.licenseList.find( item => {
                        return item.license_id == this.license_id;
                    }).CompanyName;
                    fetchNextExcelReturnDue({license_id: this.userData.license_id, process_id: this.processId}).then(
                        res => {
                            this.innerValue = res.data[0];
                            this.innerValue.license_id = this.license_id;
                        },
                        err => {
                            this.license_id = null;
                        }
                    )
                }
            },
            formatDate(value) {
                if (value !== null && value !== undefined) {
                   return DateUtil.formatDate(value);
                }
                else if( value == undefined) {
                    return ''
                }
                else  {
                    return value
                }
            },
        }
        
    }
</script>

<style lang="scss" module>
    
    .checkbox {
        margin-bottom: 10px;
    }
    
    .checkboxText{
        text-align: justify;
        font-size: 14px;
        color: #555;
    }
</style>