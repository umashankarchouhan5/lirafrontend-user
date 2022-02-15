<template>
    <FormWrapper>
        <PageTitle title="Certificate of Official Search" slot="title"/>
        <FilterTaskData v-if="filter" :tableData="tableData" :pagination="pagination" :sorting="sorting" @tableDataUpdate="setData"></FilterTaskData>
        <DataTable :actions="true"
                   :data="tableData"
                   :columns="config[Status].columns"
                   @on-selection-change="selectChange"
                   @on-page-change="pageChange"
                   :pagination="pagination"
                   @on-sort-change="sortChange">
            <template slot="actionsLeft">
                <template >
                    <TableButton @click="requestCertificate">
                        <img src="../../../../../assets/images/plus.png" alt="">
                        Request
                    </TableButton>
                </template>
            </template>
        </DataTable>
    </FormWrapper>
</template>

<script>
    import { CERTIFICATE_OF_OFFICIAL_SEARCH_PROCESS_ID } from 'Config/processIds';
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    import DataTable from 'Components/DataTable';
    import config from './table';
    import FilterTaskData from 'Components/filteredSearch/FilterTaskData';

    export default {
        name: 'CertificateOfOfficialSearch',
        data(){
            return {
                Status: 501,
                selectedRows: [],
                sorting: {
                    key: "updated_at",
                    order: "Desc"
                },
                tableData: [],
                config,
                pagination: {
                    perPage: 10,
                    page: 1,
                    total: 0
                },
            }
        },
        components:{
            FormWrapper,
            DataTable,
            PageTitle,
            FilterTaskData,
        },
        mixins: [validateSelectedRows],
        computed: {
            processId() {
                return this.$store.state.common.currentProcessId;
            },
            userData() {
                return this.$store.state.user.user;
            },
        },
        created(){
            this.setProcessId();
            this.$on("tableData",(val) => {
                this.tableData = val;
            })
        },
        methods:{
            setData(res){
                this.tableData = res;
            },
            requestCertificate() {
                this.$router.push({path: './certificateOfOfficialSearch/request'})
            },
            setProcessId() {
                this.$store.commit('setProcessId', CERTIFICATE_OF_OFFICIAL_SEARCH_PROCESS_ID);
                this.filter = true;
            },
            sortChange(data) {
                this.sorting.key = data.key;
                this.sorting.order = data.order;
                this.getDataByFilter()
                
            },
            pageChange(page) {
                this.pagination.page = page;
                this.getDataByFilter()
            },
            selectChange(data) {
                this.selectedRows = data;
            },
        },
    }
</script>