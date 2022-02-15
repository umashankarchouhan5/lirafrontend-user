<template>
    <div>
        <div v-if="$route.name !== 'ReleaseOfChargeRequest'">
            <FormRow>
                <div class="col-sm-4">
                    <InputText label="Charge Title" v-model="innerValue.ChargeTitle" rules="required" />
                </div>
                <div class="col-sm-4">
                    <InputDate label="Charge Registration Date" :options="options" v-model="innerValue.ChargeDate" rules="required" />
                </div>
                <div class="col-sm-4">
                    <InputTime label="Charge Registration Time" v-model="innerValue.ChargeTime" rules="required" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-4">
                    <InputText label="Chargee Name" v-model="innerValue.ChargeeName" rules="required" />
                </div>
                <div class="col-sm-4">
                    <AddressInput label="Chargee Address" v-model="innerValue.ChargeeAddress" rules="required" />
                </div>
                <div class="col-sm-4">
                    <FormSelect label="Charge Type" v-model="innerValue.chargetype_id" rules="required" :items="chargeTypeArr" item-value="id" item-name="DisplayName" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-4">
                    <InputText label="Name of Instrument" v-model="innerValue.InstrumentName" rules="required" />
                </div>
                <div class="col-sm-4">
                    <InputDate label="Date of Instrument" :options="options" v-model="innerValue.InstrumentDate" rules="required" />
                </div>
                <!-- <div class="col-sm-4">
                    <InputText  label="Liability Secured Amount" v-model="innerValue.LiabilitySecured" rules="required" />
                </div> -->
            </FormRow>
            <FormRow>
                <div class="col-sm-6">
                    <InputTextArea label="Short description of Liability Secured" rows="3" :maxlength="5000" v-model="innerValue.LiabilitySecured" rules="required" />
                </div>
                <div class="col-sm-6">
                    <InputTextArea label="Details of Prohibition/Restriction" rows="3" :maxlength="5000" v-model="innerValue.Prohibition" rules="required"  />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <InputTextArea label="Description of Property Charged" rows="5" :maxlength="10000" v-model="innerValue.PropertyCharged" rules="required"  />
                </div>
            </FormRow>
        </div>
        <div v-else>
            <FormRow>
                <div class="col-sm-4" >
                    <InputDate label="Charge Discharge Date" :options="options"  v-model="innerValue.DischargeDate" rules="required" />
                </div>
            </FormRow>

             <FormRow>
                <div class="col-sm-4">
                    <InputText label="Charge Title" v-model="innerValue.ChargeTitle" rules="required" readonly />
                </div>
                <div class="col-sm-4">
                    <InputDate label="Charge Registration Date" :options="options" v-model="innerValue.ChargeDate" readonly rules="required" />
                </div>
                <div class="col-sm-4">
                    <InputTime label="Charge Registration Time" v-model="innerValue.ChargeTime" readonly rules="required" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-4">
                    <InputText label="Chargee Name" v-model="innerValue.ChargeeName" readonly rules="required" />
                </div>
                <div class="col-sm-4">
                    <AddressInput label="Chargee Address" v-model="innerValue.ChargeeAddress" readonly rules="required" />
                </div>
                <div class="col-sm-4">
                    <FormSelect label="Charge Type" v-model="innerValue.chargetype_id" rules="required" disabled :items="chargeTypeArr" item-value="id" item-name="DisplayName" vid="'ChargeType-1'" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-4">
                    <InputText label="Name of Instrument" v-model="innerValue.InstrumentName" readonly rules="required" />
                </div>
                <div class="col-sm-4">
                    <InputDate label="Date of Instrument" :options="options" v-model="innerValue.InstrumentDate" readonly rules="required" />
                </div>
                <!-- <div class="col-sm-4">
                    <InputText  label="Liability Secured Amount" v-model="innerValue.LiabilitySecured" readonly rules="required" />
                </div> -->
            </FormRow>
            <FormRow>
                <div class="col-sm-6">
                    <InputTextArea label="Short description of Liability Secured" rows="3" :maxlength="5000" readonly v-model="innerValue.LiabilitySecured" rules="required" />
                </div>
                <div class="col-sm-6">
                    <InputTextArea label="Details of Prohibition/Restriction" rows="3" :maxlength="5000" readonly v-model="innerValue.Prohibition" rules="required"  />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <InputTextArea label="Description of Property Charged" rows="5" :maxlength="10000" readonly v-model="innerValue.PropertyCharged" rules="required"  />
                </div>
            </FormRow>
        </div>
    </div>
</template>

<script>
    
    import debounce from 'Utils/debounce';
    import AddressInput from 'Components/form/addressInput/AddressInput';
    import InputDate from 'Components/form/InputDate';
    import InputTime from 'Components/form/InputTime';
    import { ChargeRequest,ChargeList } from '../api'
    import valueMixin from 'Mixins/valueMixin';
    import moment from 'moment';

    export default {
        name:'ChargeGeneralInfo',
        components: {
            InputDate,
            InputTime,
            AddressInput,
        },
        mixins:[valueMixin],
        data() {
            return {
                charge: {
                    chargeType_id: null,
                    charge_title: '',
                    charge_date: '',
                    charge_time: '',
                    liability_secured: '',
                    chargee_name: '',
                    chargee_address: '',
                    instrument_name: '',
                    instrument_date: '',
                    property_charged: '',
                    prohibition: '',
                    discharge_date: '',
                },
                chargeTypeArr: [],
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
            }
        },
        created(){
            this.getChargeType();
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
            },
            'innerValue.ChargeDate': function(val){
                this.checkDate(val).then(
                    res => {
                       this.innerValue.ChargeDate = res;
                    }
                )
            },
            'innerValue.InstrumentDate': function(val){
                this.checkDate(val).then(
                    res => {
                       this.innerValue.InstrumentDate = res;
                    }
                )
            },
            'innerValue.DischargeDate': function(val){
                this.checkDate(val).then(
                    res => {
                        this.innerValue.DischargeDate = res;
                    }
                )
            }
        },
        methods:{
            async checkDate(val){
                if(val === "1900-01-01" || val === "1900-01-01 00:00:00.000"){
                    var newDate = new Date();
                    // return moment(newDate).format('DD-MMM-YYYY');
                    return undefined;
                }else{
                    return val;
                }
            },
            getChargeType(){
                ChargeList().then(
                    res=> {
                        this.chargeTypeArr = res.data;
                    }
                )
            },
            
        }
    }
</script>
