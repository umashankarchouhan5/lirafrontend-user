<template>
    <div>
        <div class="row">
            <div class="col-sm-6">
                <FormRow>
                    <div class="col-sm-12">
                        <InputText label="Approved Name" readonly v-model="value.CompanyName"/>
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-12">
                        <AddressInput name="Registered Office Address"
                            :readonly="readonly || sameAsICSPAddress || userData.icsp_address[0].address_id === value.regaddress_id"
                            v-model="value.regaddress_id"
                            label="Registered Office Address"
                            :vid="`Registered Office Address-${1}`"
                            rules="required" />
                        <br>
                        <FormCheckbox v-if="!readonly" disabled v-model="sameAsICSPAddress">
                            Same as Registered Agent Address
                        </FormCheckbox>
                    </div>
                </FormRow>
            </div>
            <div class="col-sm-6">
                <FormRow v-if="showContinuationFields">
                    <div class="col-sm-12">
                        <InputText :readonly="readonly"
                                   label="Original Name"
                                   rules="required"
                                   maxlength="200"
                                   name="NR_originalName"
                                   v-model="value.OriginalName"/>
                    </div>
                </FormRow>
                <FormRow v-if="value.CompanyRegNo">
                    <div class="col-sm-12">
                        <InputText label="Company Reg #" readonly v-model="value.CompanyRegNo"/>
                    </div>
                </FormRow>
                <FormRow v-if="showCurrencyRelatedFields">
                    <div class="col-sm-12">
                        <div :class="$style.limitedBy">
                            <div :class="$style.limitedByLabel">
                                Company Limited By
                                <span :class="$style.error" v-if="isCurrencyRelatedRequired">*</span>
                            </div>
                            <FormCheckbox :true-value="1"
                                          :false-value="0"
                                          :disabled="readonly"
                                          :showAsterisk="false"
                                          v-model="value.LimitedByShares"
                                          name="LimitedByShares">
                                Shares
                            </FormCheckbox>
                            <FormCheckbox :true-value="1"
                                          :false-value="0"
                                          :disabled="readonly"
                                          v-model="value.LimitedByGuarantee"
                                          name="LimitedByGuarantee">
                                Guarantee
                            </FormCheckbox> 
                        </div>
                        <div :class="$style.error" style="margin-top: -25px;" v-if="customErrors.indexOf('limitedBy') !== -1">Select at least one type</div>
                        <div :class="$style.limitedByValues">
                            <div v-show="!!value.LimitedByShares || !!value.LimitedByGuarantee">
                                <FormSelect :rules="{ required: !!value.LimitedByShares || !!value.LimitedByGuarantee }"
                                            label="Currency"
                                            v-model="value.currency"
                                            :disabled="readonly"
                                            name="NR_currency"
                                            :items="currenciesList"
                                            item-value="code" item-name="code"/>
                            </div>
                            <div v-show="!!value.LimitedByShares">
                                <InputAmount :label="authorizedShareLabel"
                                           :readonly="readonly"
                                           v-model="value.AuthorizedShareCapital"
                                           :rules="{ required: !!value.LimitedByShares }"/>
                            </div>
                            <div v-show="!!value.LimitedByGuarantee">
                                <InputAmount :label="guaranteeLabel"
                                           :readonly="readonly"
                                           v-model="value.GuaranteeAmount"
                                           :rules="{ required: !!value.LimitedByGuarantee }"/>
                            </div>
                        </div>
                        <br>
                        <div v-if="value.EntityType === 'IBC'">
                            <FormCheckbox :disabled="readonly" v-model="value.ShareNoPar" :trueValue="1" :falseValue="0">
                                The company will issue shares with no par value
                            </FormCheckbox>
                        </div>
                    </div>
                </FormRow>
            </div>
        </div>
        <FormRow v-if="showContinuationFields">
            <div class="col-sm-6">
                <InputDate :label="continuationDateLabel" :options="options" :readonly="readonly"  rules="required" v-model="value.OriginalIncorporationDate"/>
            </div>
            <div class="col-sm-6">
                <FormSelect label="Jurisdiction"
                            :disabled="readonly"
                            rules="required"
                            v-model="value.jurisdiction_id"
                            :items="jurisdictionsList"
                            item-name="Name"
                            item-value="id"/>
            </div>
        </FormRow>
        <h6>Registered Agent (<span v-if="value.EntityType.toLowerCase() == 'ibc' || value.EntityType.toLowerCase() == 'lp' ">ICSP</span><span v-if="value.EntityType.toLowerCase() == 'foundation'">FSP</span><span v-if="value.EntityType.toLowerCase() == 'trust'">ITSP</span>)</h6>
        <FormRow>
            <div class="col-sm-6">
                <InputText label="Name" readonly :value="userData.icsp_name"/>
            </div>
            <div class="col-sm-6">
                <AddressInput :value="userData.icsp_address[0].address_id"
                              readonly
                              label="Registered Office Address"/>
            </div>
        </FormRow>
        <FormRow v-if="value.EntityType === 'LP'">
            <div class="col-sm-12">
                <InputTextArea :readonly="readonly" rows="10" rules="required"  v-model="value.NatureOfBusiness" label="General Nature of Business"/>
            </div>
        </FormRow>
        <FormRow v-if="value.EntityType === 'LP'">
            <div class="col-sm-12">
                <GeneralPartner v-model="recordJson" :readonly="readonly"></GeneralPartner>
            </div>
        </FormRow>
    </div>
</template>

<script>

    import AddressInput from 'Components/form/addressInput/AddressInput';
    import currenciesMixin from 'Mixins/currenciesMixin';
    import jurisdictionsMixin from 'Mixins/jurisdictionsMixin';
    import InputDate from 'Components/form/InputDate';
    import entityTypesSchema from '../entityTypesSchema';
    import GeneralPartner from './GeneralPartner';

    export default {
        name: "GeneralInfo",
        mixins: [currenciesMixin, jurisdictionsMixin],
        components: {
            InputDate,
            AddressInput,
            GeneralPartner
        },
        data() {
            return {
                currency: '',
                sameAsICSPAddress: false,
                registeredOfficeAddress: JSON.parse(JSON.stringify(this.value.regaddress_id)),
                limitedByOptions: ['Shares', 'Guarantee', 'Both'],
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                recordJson: [
                    {
                        Name: '',
                        ResidenceAddress: ''
                    }
                ]
            }
        },
        computed: {
            showContinuationFields() {
                return entityTypesSchema[this.value.EntityType].fields.continuations[this.processId];
            },
            isCurrencyRelatedRequired() {
                return entityTypesSchema[this.value.EntityType].limitedBy;
            },
            processId() {
                return this.$store.state.common.currentProcessId;
            },
            guaranteeLabel() {
                const currency = this.value.currency ? `in (${this.value.currency})` : ''
                return `Guarantee Amount ${currency}`
            },
            authorizedShareLabel() {
                const currency = this.value.currency ? `in (${this.value.currency})` : ''
                return `Authorized Share Capital ${currency}`
            },
            userData() {
                return this.$store.state.user.user;
            },
            showCurrencyRelatedFields() {
                return entityTypesSchema[this.value.EntityType].fields.currency;
            },
            continuationDateLabel() {
                return entityTypesSchema[this.value.EntityType].labels[this.processId].continuationDate;
            }
        },
        watch: {

            sameAsICSPAddress(newValue) {
                this.value.regaddress_id = newValue ? this.userData.icsp_address[0].address_id : null
            },
            'value.regaddress_id': function (newValue) {
                if( this.value.regaddress_id == this.userData.icsp_address[0].address_id && this.value.regaddress_id !== null){
                    this.sameAsICSPAddress = true;
                }
            },
            recordJson:{
                deep: true,
                handler(val){
                    this.value.recordJSON = this.recordJson;

                }
            }
        },
        props: {
            steps: Array,
            readonly: Boolean,
            customErrors: Array,
            value: {
                type: Object,
                required: true,
            },
        },
        created(){
            
            if( this.value && this.value.regaddress_id == this.userData.icsp_address[0].address_id && this.value.regaddress_id !== null){
                this.sameAsICSPAddress = true;
            }
            if(this.value.invoice_id !== null){
                if( this.value.CompanyPeople !== null && this.value.CompanyPeople !== ''){
                    this.recordJson = this.value.recordJSON;
                }
            }
            if(this.value.reference_id !== undefined && this.value.reference_id !== null && this.value.reference_id !== 0 && this.value.recordJSON !== undefined){
                this.recordJson = this.value.recordJSON;
            }
            if(this.value && this.value !== null) {
                this.sameAsICSPAddress = true;
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
        line-height: 18px;
        font-weight: 400;
    }

</style>
