<template>
    <FormWrapper>
        <PageTitle title="Licence Renewal  and Submission of Compliance Form" slot="title" link="/help/117" />
        
        <!-- <div v-if="nextPage">
            <FormRow>
                <div class="col-sm-3">
                    <YearSelect label="Year"  v-model="filtering.yearSelected" :clearable="false" />
                </div>
            </FormRow>
            <br />
            <ButtonGroup>
                <FormButton type="success" @click="goToForm"  left-icon="md-checkmark-circle-outline">Proceed</FormButton>
                <FormButton type="primary" @click="backToInstruction" left-icon="ios-close-circle-outline">Cancel</FormButton>
            </ButtonGroup>
        </div>
        <div v-else>
            <div :class="$style.filter">
                <div :class="$style.filterItem">
                    <FormSelect label="Select Status" :items="statuses" :width="200" :filterable="false" item-name="name" item-value="id" :clearable="true" v-model="selectedStatus"/>  
                </div>
                <div :class="$style.filterItem">
                    <FormButton type="primary" @click="fetchGridData()" :rounded="true">
                        <Icon type="ios-search" />
                    </FormButton>
                </div>
            </div> -->

            <DataTable :actions="true"
                :data="complianceList"
                :columns="tableConfig"
                :is-loading="isLoading"
                @on-selection-change="selectChange"
            >
                <template slot="actionsLeft">
                    <TableButton @click="editForm" >
                        <img src="../../../../../assets/images/edit.png" alt="">
                        Edit Compliance Form
                    </TableButton>
                </template>
            </DataTable>
        <!-- </div> -->


        <Popup title="Information" :value="warningModal.visible" @close="() => showWarningModal(false)">
            {{ warningModal.message }}
            <div slot="footer">
                <FormButton v-if="warningModal.buttons.cancel" @click="() => showWarningModal(false)">Cancel
                </FormButton>
                <FormButton v-if="warningModal.buttons.confirm" type="success" @click="confirmDelete">Confirm
                </FormButton>
                <FormButton v-if="warningModal.buttons.ok" @click="() => showWarningModal(false)">Ok</FormButton>
            </div>
        </Popup>
    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import { createNewForm, fetchComplianceFormForYear, getStatuses, fetchNextComplianceSubmissionDue } from '../APIRequests';
    import { ANNUAL_COMPLIANCE } from 'Config/processIds';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable'
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    import loadingMixin from 'Mixins/loadingMixin'
    import moment from 'moment';
    import tableConfig from './tableConfig/tableNew'

    const DEFAULT_STATUS = 43;

    export default {
        name:'AnnualRenewalGrid',
        mixins: [loadingMixin,validateSelectedRows],
        components:{
            PageTitle,
            FormWrapper,
            DataTable
        },
        data(){
            return{
                instructionData:[],
                popupSuccess: {
                    isVisible: false,
                },
                nextPage: false,
                cspType:[],
                selectedStatus: null,
                yearSelected: null,
                statuses: [],
                tableConfig,
                complianceList: [],
                filtering:{
                    yearSelected: moment().year()-1,
                    statuses: [],
                    selectedStatus: null,

                },
                tableSelected: null,
            }
        },
        computed:{
            userData() {
                return this.$store.state.user.user
            },
            currentProcessId() {
                return this.$store.state.common.currentProcessId
            },
        },
        created(){
            this.fetchGridData()
        },
        mounted(){
            // this.filtering.yearSelected = ;

        },
        methods:{
            
            editForm(){
                if (this.validateSelectedLength(1)) {
                    var row = this.selectedRows[0];
                    // var d1 = new Date();
                    // var d2 = new Date(row.earliestSubmissionDate);
                    // if(d1 > d2){
                    if(row.submissionCheck == '' || row.submissionCheck == ' ') {
                        if(row.status_id == 43 || row .status_id == null){
                            if(row.reference_id == null) {
                                this.generateDraft(row.licenseType);
                            }else{
                                this.$router.push(`annualCompliance/${row.reference_id}`);
                            }
                        }
                        else{
                            this.warningModal.message = 'This form cannot be edited.';
                            this.showWarningModal(true);

                        }
                    }
                    else{
                        this.warningModal.message = row.submissionCheck;
                        this.showWarningModal(true);
                    }
                }
            },
            selectChange(data) {
                this.selectedRows = data;
            },
            getFilterValues() {
                this.showLoader();
                Promise.all([
                    getStatuses({process_id: ANNUAL_COMPLIANCE}),
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response){
                this.hideLoader();
                this.statuses = response[0].data[0];
                this.selectedStatus = 43;
                this.fetchGridData();
            },
            async getUserCsp(){
                var csp = this.userData.icsp_license[0];
                if(csp.is_ICSP === 1){
                    this.generateDraft('ICSP');
                }
                if(csp.is_ITSP === 1){
                    this.generateDraft('ITSP');
                }
                if(csp.is_FSP === 1){
                    this.generateDraft('FSP')
                }
                return true;
            },
            goToForm(){
                this.getUserCsp().then(
                    res => {
                    this.getFilterValues();
                        
                    }
                );
            },
            backToInstruction(){
                this.$router.push('/annualCompliance');
            },
            fetchGridData(){
                
                fetchNextComplianceSubmissionDue({process_id: ANNUAL_COMPLIANCE, icsp_id: this.userData.icsp_id}).then(
                // fetchComplianceFormForYear({icsp_id:this.userData.icsp_id,year:this.filtering.yearSelected,status_id:this.selectedStatus}).then(
                    res=> {
                        this.complianceList = res.data;
                        // this.tableSelected = this.selectedStatus;
                    }
                )
            },
            generateDraft(val){
                createNewForm({
                    year:  this.selectedRows[0].year,
                    EntityType: val,
                    icsp_id: this.userData.icsp_id
                }).then((response) => {
                    // this.nextPage= false;
                    this.$router.push(`annualCompliance/${response.data[0].reference_id}`)
                })
            },
            
        }
    }
</script>


<style lang="scss" module>


    .filter {
        margin: -10px 0 10px;
    }

    .filterItem {
        display: inline-block;
        margin: 0 15px 15px 0;
    }

    .filterItemCheckbox {
        flex-basis: auto;
        align-self: flex-start;
        margin-top: 13px;
    }

</style>