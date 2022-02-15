<template>
    <div >
        <p>1. &nbsp; Type of licence being sought: </p>
        <FormRow>
            <div class="col-sm-6" >
                <div  :class="$style.checkItem">
                    <div :class="$style.checkbox">
                        <FormCheckbox :disabled="readonly || sdCompany !== ''"  name="Securities Dealer’s Representative Licence"  vid="`CheckBox-SecurityDealer`"  v-model="sd" ></FormCheckbox>
                    </div>
                    <div :class="$style.checkBrief">
                        <span >
                            Securities Dealer’s Representative Licence
                        </span>
                    </div>
                </div>
            </div>
            <div class="col-sm-6" v-if="sd">
                <div class="row" v-if="sdCompany == ''">
                    <div class="col-sm-6">
                        <InputText  label="Enter Company Code" v-model="repSDCode" :vid="`RepCode-SecurityDealer`"  />
                    </div>
                    <div class="col-sm-6">
                        <FormButton @click="validateRepSDCode">Validate</FormButton>
                    </div>
                </div>
                <div v-else>
                    <InputText  label="Company Name" v-model="sdCompany" readonly :vid="`CompanyName-SecurityDealer`"  />
                </div>
            </div>
        </FormRow>
        <FormRow>
            <div class="col-sm-6" >
                <div  :class="$style.checkItem">
                    <div :class="$style.checkbox">
                        <FormCheckbox :disabled="readonly || iaCompany !== ''"  name="Investment Advisor’s Representative Licence" vid="`CheckBox-SecurityDealer`" v-model="ia" ></FormCheckbox>
                    </div>
                    <div :class="$style.checkBrief">
                        <span >
                            Investment Advisor’s Representative Licence
                        </span>
                    </div>
                </div>
            </div>
            <div class="col-sm-6" v-if="ia">
                <div class="row" v-if="iaCompany == ''">
                    <div class="col-sm-6">
                        <InputText  label="Enter Company Code" v-model="repIACode" :vid="`RepCode-InvestmentAdvisor`"  />
                    </div>
                    <div class="col-sm-6">
                        <FormButton @click="validateRepIACode">Validate</FormButton>
                    </div>
                </div>
                <div v-else>
                    <InputText  label="Company Name" v-model="iaCompany" readonly :vid="`CompanyName-Investment Advisor`"  />
                </div>
            </div>
        </FormRow>
    </div>
</template>

<script>
    import  { attachLicenseToRep, fetchAttachedLicenseToRep } from '../APIRequests';
    export default {
        name: 'RepCode',
        props: {
            readonly: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                sd: false,
                ia: false,
                sdCompany: '',
                iaCompany: '',
                repSDCode: '',
                repIACode: '',
            }
        },
        watch: {
            '$route.params.id': function(val){
                if(val !== undefined && val !== null){
                    this.getData();
                }
            }
        },
        created() {
            if(this.$route.params.id){
                this.getData();
            }
        },
        methods: {
            getData() {
                fetchAttachedLicenseToRep({reference_id: parseInt(this.$route.params.id)}).then(
                    res => {
                        const data = res.data;
                        if(data.length > 0){
                            data.filter( item => {
                                if(item.license_type == 'SD'){
                                    this.sd = true;
                                    this.sdCompany = item.company_name;
                                }
                                if(item.license_type == 'IA'){
                                    this.ia = true;
                                    this.iaCompany = item.company_name;
                                }
                            })
                        }
                    }
                )
            },
            validateRepSDCode() {
                const data = {
                    rep_code: this.repSDCode,
                    reference_id: parseInt(this.$route.params.id),
                    type: 'SD'
                }
                attachLicenseToRep(data).then(
                    res => {
                        this.sdCompany = res.data.company_name;
                    }
                )
            },
            validateRepIACode() {
                const data = {
                    rep_code: this.repIACode,
                    reference_id: parseInt(this.$route.params.id),
                    type: 'IA'
                }
                attachLicenseToRep(data).then(
                    res => {
                        this.iaCompany = res.data.company_name;
                    }
                )
            }
        }
        
    }
</script>
<style lang="scss" module>
    .checkItem {
        padding: 5px 8px;
        display: flex;
        align-items: center;

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
        margin-left: 0px;
    }
</style>