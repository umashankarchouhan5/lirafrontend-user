<template>
    <FormWrapper>
        <PageTitle title="Annual Renewal - Summary" slot="title" link="`/help/107`" />
        
        <DataTable :actions="true"
            :data="renewalData"
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
    import config from './feeTable';

    export default {
        name: 'AnnualRenewal',
        components:{
            FormWrapper,
            DataTable,
            PageTitle,
        },
        mixins:[validateSelectedRows],
        data(){
            return{
                config,
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
            }
        },
        computed:{
            renewalData(){
                return this.$store.state.user.renewalData;
            }
        },
        created(){

        },
        methods:{
            generateInvoice(){
                this.$store.commit('setCheckAnnual',true);
                this.$router.push('/invoice');
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
