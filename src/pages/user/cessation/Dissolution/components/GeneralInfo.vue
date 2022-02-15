<template>
    <div>
        <FormRow>
            <div class="col-sm-6" >
                <FormSelect :disabled="readonly || dataSelected"
                    v-model="innerValue.company_id"
                    :items="companies"
                    label="Select Registered Companies"
                    item-name="Name"
                    item-value="company_id"
                    rules="required" />
            </div>
            
            <div class="col-sm-3">
                <InputDate rules="required" :readonly="readonly" label="Dissolution Date" :options="options"  v-model="innerValue.effectiveDate"  />
            </div>
        </FormRow>

        
    </div>
</template>

<script>

    import InputDate from 'Components/form/InputDate';
    import valueMixin from 'Mixins/valueMixin';
    import { DISSOLUTION  } from 'Config/processIds';
    import { getStrikeOffReason, getCompanybyStatus, fetchDissolutionRegisteredCompany, getTicket } from '../../api';

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
            customErrors: [Array,Object],
        },
        data() {
            return {
                entitySelected: false,
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                entityTypes: [{Name: 'IBC'},{Name: 'Foundation'}],
                companies: [],
                company: {
                    EntityType: null,
                    Name: '',
                    CompanyRegNo: '',
                },
                isSelected: false,
                dataSelected: false,
                reasons: []
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
        created() {
            // this.getData();
            this.getCompanyListHandler();
            if(this.innerValue.company_id !== null  && this.mode === 'edit'){
                this.company.id = this.innerValue.company_id;
                this.$store.commit('setCompany',this.company);
            }
        },
        watch: {
            'innerValue.company_id': function(val) {
                if(val !== '' && val !== null && val !== undefined){
                    this.company.id = val;
                    this.$store.commit('setCompany', this.company);
                    this.getTaskData();
                }

            }
            
        },
        methods: {
            getTaskData() {
                getTicket({ process_id: DISSOLUTION, reference_id: this.innerValue.company_id }).then(res => {
                    this.innerValue = res.data[0];
                    this.innerValue.effectiveDate = res.data[0].EffectiveDate;
                    this.innerValue.liquidatorName = res.data[0].Liquidator;
                })
            },
            getData(){
                Promise.all([
                    getStrikeOffReason({process_id: DISSOLUTION})
                ]).then(this.handleResponse)
            },
            handleResponse(response) {
                this.reasons = response[0].data;
            },
            selectReason(id){
                if(id !== undefined && id !== null ){
                    this.innerValue.cessationReason = this.reasons.find( ele => ele.id === id).description 
                }else{
                    this.innerValue.cessationReason = '';
                }
            },
            getCompanyListHandler() {
                fetchDissolutionRegisteredCompany({icsp_id: this.userData.icsp_id}).then(res => {
                    this.companies = res.data;
                    
                })
                // getCompanybyStatus({
                //     status_id: 305
                // }).then(res => {
                //     this.companies = res.data[0];
                    
                // })
            },
        }
    }
</script>

<style lang="scss" module>


    .error {
        color: #ff3547;
        position: absolute;
        max-width: 100%;
        left: 0;
        font-size: 11px;
        line-height: 13px;
        bottom: -15px;
        font-weight: 400;
    }

</style>
