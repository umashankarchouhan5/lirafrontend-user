<template>
    <div>
        <div class="row">
            <div class="col-sm-6">
                <FormRow>
                    <div class="col-sm-12">
                        <InputText label="Proposed Name" readonly v-model="value.ProposedName"/>
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-12">
                        <AddressInput name="Registered Office Address"
                            :readonly="readonly || sameAsICSPAddress || userData.icsp_address[0].address_id === value.regaddress_id"
                            v-model="value.regaddress_id"
                            label="Registered Office Address"
                            rules="required" 
                            vid="RegisteredOfficeAddress1"
                        />
                        <br>
                        <FormCheckbox  v-model="sameAsICSPAddress">
                            Same as Registered Agent Address
                        </FormCheckbox>
                    </div>
                </FormRow>
            </div>
            <div class="col-sm-6">
                <FormRow v-if="value.CompanyRegNo">
                    <div class="col-sm-12">
                        <InputText label="Company Reg #" readonly v-model="value.CompanyRegNo"/>
                    </div>
                </FormRow>
                <FormRow >
                    <div class="col-sm-12">
                        <div :class="$style.limitedBy">
                            <div :class="$style.limitedByLabel">
                                Company Limited By
                                <span :class="$style.error" >*</span>
                            </div>
                            <FormCheckbox :true-value="1"
                                          :false-value="0"
                                          :showAsterisk="false"
                                          v-model="value.LimitedByShares"
                                          name="LimitedByShares">
                                Shares
                            </FormCheckbox>
                            <FormCheckbox :true-value="1"
                                          :false-value="0"
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
                        <div>
                            <FormCheckbox  v-model="value.ShareNoPar">
                                The company will issue shares with no par value
                            </FormCheckbox>
                        </div>
                    </div>
                </FormRow>
            </div>
        </div>
        
        <h6>Registered Agent (CSP)</h6>
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
    </div>
</template>

<script>

    import AddressInput from 'Components/form/addressInput/AddressInput';
    import currenciesMixin from 'Mixins/currenciesMixin';
    import jurisdictionsMixin from 'Mixins/jurisdictionsMixin';

    export default {
        name: "GeneralInfo",
        mixins: [currenciesMixin, jurisdictionsMixin],
        components: {
            AddressInput,
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
        data() {
            return {
                currency: '',
                sameAsICSPAddress: false,
                registeredOfficeAddress: this.value.regaddress_id ? JSON.parse(JSON.stringify(this.value.regaddress_id)) : null,
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
        },
        watch: {
            sameAsICSPAddress(newValue) {
                this.value.regaddress_id = newValue ? this.userData.icsp_address[0].address_id : this.registeredOfficeAddress
            },
            'value.regaddress_id': function (newValue) {
                if (newValue !== this.userData.icsp_address[0].address_id) {
                    this.registeredOfficeAddress = JSON.parse(JSON.stringify(newValue));
                }
            },
            recordJson:{
                // 
                deep: true,
                handler(val){
                    this.value.recordJSON = this.recordJson;

                }
            }
        },
        created(){
            if(this.value.invoice_id !== null){
                if( this.value.CompanyPeople !== null && this.value.CompanyPeople !== ''){
                    this.recordJson = this.value.recordJSON;
                }
            }
            this.sameAsICSPAddress = true;
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
