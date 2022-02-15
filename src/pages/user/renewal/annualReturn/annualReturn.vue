<template>
    <FormWrapper>
        <PageTitle title="Annual Return" v-if="processId ===  null || processId === 0 || processId === undefined" slot="title"  />
        <PageTitle title="Annual Return" v-else slot="title" :link="`/help/${processId}`" />
        <div v-if="instructions">
            <div v-html="instructionData"> </div>
            <br />
            <FormButton left-icon="md-checkmark-circle-outline" type="success" @click="proceedToReturn()" >
                Proceed
            </FormButton>

        </div>
        <div v-else>
            <FormRow>
                <div class="col-sm-6">
                    <FormSelect rules="required"
                        label="Select Annual Return Type"
                        :items="process_ids"
                        item-name="ProcessName"
                        item-value="process_id"
                        v-model="annual.process_id" />
                </div>
            </FormRow>
        </div>
        <div v-if="annual.process_id !== null && annual.process_id !== undefined">
            <FormRow>
                <div class="col-sm-1" >
                    <YearSelect label="Year" readonly  v-model="annual.year" :clearable="false" :maxValue="annual.year" />
                </div>
                <div class="col-sm-2" v-if="(annual.process_id === 115 || annual.process_id === 116) && annual.DueDate !== null">
                    <InputDate label="Due Date" readonly v-model="annual.DueDate" />
                </div>
                <div class="col-sm-2" v-if="(annual.process_id === 115 || annual.process_id === 116) && annual.ExtendedDueDate !== null">
                    <InputDate label="Extended Due Date" readonly v-model="annual.ExtendedDueDate" />
                </div>
            </FormRow>
            <!-- <FormRow  v-if="annual.process_id === 115">
                <div v-html="instructionData"></div>
            </FormRow> -->
        </div>

        <FormRow v-if="annual.process_id === 346 || annual.process_id === 347">
            <DataTable :actions="true"
                :data="companyList"
                :columns="columns"
                @on-selection-change="selectChange"
            >
            </DataTable>
        </FormRow>
            
        <div v-if="!instructions">
            <FormButton type="success" :disabled="(annual.process_id === null || annual.process_id === undefined) && annual.Status_id !== 43" @click="proceed" left-icon="md-checkmark-circle-outline">Proceed</FormButton>
        </div>

        <Popup title="Information" type="information" :value="warningModal.visible" @close="() => showWarningModal(false)">
            {{ warningModal.message }}
            <div slot="footer">
                <FormButton v-if="warningModal.buttons.ok" @click="() => showWarningModal(false)">Ok</FormButton>
            </div>
        </Popup>

    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import InputDate from 'Components/form/InputDate';
    import PageTitle from 'Components/layout/PageTitle';
    import {  annualReturnProcessSelection, annualReturnDraftRequest, fetchInstructions, getCompany } from './api';
    import DataTable from 'Components/DataTable';
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    import { PROCESS_ID, REFERENCE_ID } from 'Config/localStorageKeys';

    export default {
        name: "AnnualReturn",
        mixins: [validateSelectedRows],
        components: {
            FormWrapper,
            PageTitle,
            DataTable,
            InputDate
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
                entityTypes: [],
                companies: [],
                company: {
                    EntityType: null,
                    Name: '',
                    CompanyRegNo: '',
                },
                isSelected: false,
                dataSelected: false,
                annual:{
                    process_id: null,
                    reference_id: 0,
                    company_id: null,
                    icsp_id: null,
                    EntityType: '',
                    year: null,
                    ExtendedDueDate: null,
                    DueDate: null,
                },
                process_ids: [],
                instructionData: null,
                instructions: true,
                columns: [
                    {
                        type:'selection',
                        width: 40,
                        align: 'center'
                    },
                    {
                        title: 'Reg #',
                        key: 'CompanyRegNo',
                        width: 100,
                    },
                    {
                        title: 'Company Name',
                        key: 'Name',
                        maxWidth: 300
                    },
                    {
                        title: 'Address',
                        key: 'Address',
                    },
                ],
                companyList: [],
                selectedRows: []
            }
        },
        watch: {
            'annual.reference_id':function(val){
                if(val !== 0 && this.mode === 'edit'){
                    this.company['Name'] = this.annual.companyname;
                    this.company.EntityType = this.annual.company[0].Entitytype;
                }
            },
            'annual.process_id': function (newValue) {
                this.$store.commit('setProcessId', newValue);
                
                this.dataSelected = false;
                this.selectProcess(newValue);
                if(newValue === 115){
                    // this.fetchInstruction();
                    this.getCompanyFromID();
                }
                if(newValue === 346 || newValue === 347){
                    this.getCompanyList();
                }
            },
            'company.EntityType': function(val){
                this.$store.commit('setChangeEntityType',val);
                
                if(val !== null && val !== undefined){
                    this.entitySelected = true;
                }else{
                    this.entitySelected = false;
                    this.resetCompany();
                    this.resetCompanies();
                }
            },
        },
        created() {
            this.getSelection();
            this.fetchInstruction();
        },
        methods: {
            proceedToReturn(){
                this.instructions = false;
            },
            selectChange(data){
                this.selectedRows = data;
            },
            proceed(){
                var process = this.annual.process_id;
                if(process === 115 || process === 116){
                    const data = {
                        process_id: process,
                        icsp_id: this.userData.icsp_id,
                        EntityType: 'ICSP',
                        year: this.annual.year,
                        company_id: this.annual.company_id
                    }
                    annualReturnDraftRequest(data).then(
                        res => {
                            
                            sessionStorage.setItem(PROCESS_ID, process);
                            sessionStorage.setItem(REFERENCE_ID, res.data[0].reference_id);
                            this.$router.push(`/annualReturn/${res.data[0].reference_id}`)
                        }
                    )
                }
                else if( process === 346 || process === 347 ){
                    if(this.validateSelectedLength(1)){
                        const data = {
                            process_id: process,
                            icsp_id: this.userData.icsp_id,
                            EntityType: 'CSL',
                            year: this.annual.year,
                            company_id: this.selectedRows[0].id
                        }
                        annualReturnDraftRequest(data).then(
                            res => {
                                sessionStorage.setItem(PROCESS_ID, process);
                                sessionStorage.setItem(REFERENCE_ID, res.data[0].reference_id);
                                this.$router.push(`/annualReturn/${res.data[0].reference_id}`)
                            }
                        )
                    }
                }
            },
            selectProcess(val){
                const selected = this.process_ids.find(item => {
                    return item.process_id === val;
                })
                this.annual.company_id = selected.company_id;
                this.annual.year = selected.year;
                this.annual.DueDate = selected.DueDate;
                this.annual.ExtendedDueDate = selected.ExtendedDueDate;
            },
            fetchInstruction(){
                fetchInstructions({process_id: 115 }).then(
                    res=>{
                        this.instructionData = res.data.Instructions;
                    }
                )
            },
            getSelection(){
                annualReturnProcessSelection({icsp_id: this.userData.icsp_id}).then(res => {
                    this.process_ids = res.data
                })
            },
            getCompanyList(event) {
                const EntityType  = 'CSL';
                getCompany({
                    EntityType: EntityType,
                    Name: '',
                    RegNo: '',
                    ICSP_id: this.userData.icsp_id
                }).then(
                    res => {
                        this.companyList = res.data[0];
                })
            },
            getCompanyFromID(){
                getCompany({
                    EntityType: 'CSP',
                    Name: '',
                    RegNo: this.annual.company_id,
                    ICSP_id: this.userData.icsp_id
                }).then(
                    res => {
                        this.companyList = res.data[0];
                })
            },
            // reset() {
            //     this.resetCompany();
            //     this.entityTypes = [];
            //     this.companies = [];
            //     this.isSelected = false;
            //     this.annual.address_id = null;
            // },
            resetCompany() {
                this.company = {
                    EntityType: null,
                    Name: '',
                    CompanyRegNo: '',
                };
            },
            validateQuery(value) {
                return value.length >= 3
            },
            resetCompanies() {
                this.companies = [];
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
