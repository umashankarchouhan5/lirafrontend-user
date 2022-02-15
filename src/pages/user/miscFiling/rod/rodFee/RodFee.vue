<template>
    <FormWrapper>
        <PageTitle title="Register Of Director - Summary" slot="title" />
        
        <DataTable :actions="true"
            :data="rodData"
            :columns="config"
            @on-selection-change="selectChange"
            @on-sort-change="sortChange">
            
        </DataTable>
        <br />
        <FormRow>
            <FormButton @click="generateInvoice"
                type="success"
                left-icon="md-checkmark-circle-outline">Proceed to Pay</FormButton>
        </FormRow>
    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    import { getRODFeeData, GenerateTicketInvoice } from "./api";
    import config from './feeTable';

    export default {
        name: 'RODFee',
        components:{
            FormWrapper,
            DataTable,
            PageTitle,
        },
        mixins:[validateSelectedRows],
        data(){
            return{
                config,
                rodData:[],
                reference_id: null,
                selectedRows: [],
                sorting: {
                    key: "RenewalDate",
                    order: "Asc"
                },
                tableData: [],
                pagination: {
                    perPage: 10,
                    page: 1,
                    total: 0
                },
                invoice_id: null,
            }
        },
        computed:{

            
        },
        created(){
            this.reference_id = this.$route.params.reference_id;
            this.getRODFeeData();
        },
        methods:{
            getRODFeeData(){
                getRODFeeData({reference_id:this.reference_id}).then(this.handleResponse)
            },
            handleResponse(response){
                if(response.paid==true){
                    this.$router.push('/registerOfDirector');
                }
                if(response.paid==false && response.invoice_id!=null){
                    this.invoice_id = response.invoice_id;
                }
                this.rodData = response.data;
            },
            generateInvoice(){
                if(this.invoice_id!=null){
                    var id = this.invoice_id;
                    this.$router.push(`/invoice/${id}`);
                    return;
                }
                GenerateTicketInvoice({reference_id:this.reference_id, process_id:111}).then(this.handleInvoiceResponse)
            },
            handleInvoiceResponse(res){
                this.$router.push(`/invoice/${res.data[0].invoice_id}`);
            },
            sortChange(data) {
                this.sorting.key = data.key;
                this.sorting.order = data.order;
            },
            pageChange(page) {
                this.pagination.page = page;
            },
            selectChange(data) {
                this.selectedRows = data;
            },
        }

    }
</script>


<style lang="scss" module>


    .pagination {
        margin: 10px 0 0;
        text-align: right;
        display: flex;
        justify-content: flex-end;
        line-height: 26px;
    }

    .paginationText {
        margin: 0 20px;
    }

    .paginationButton {
        cursor: pointer;
        width: 26px;
        text-align: center;
        transition: background-color .2s ease-in-out,color .2s ease-in-out, box-shadow 200ms ease
    }
    .paginationButton:hover {
        background: #57a3f3;
        color: #fff;
        &:hover {
            box-shadow: 0 5px 11px 0 rgba(0,0,0,.18), 0 4px 15px 0 rgba(0,0,0,.15);
        }
    }

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
