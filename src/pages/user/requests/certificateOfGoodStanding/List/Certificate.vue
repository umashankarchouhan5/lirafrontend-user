<template>
    <FormWrapper>
        <div :class="$style.filter">
            <div :class="$style.filterItem">
                <FormSelect label="Select Status" :items="statuses" item-name="name" item-value="id" :clearable="false"
                    v-model="selectedStatus"/>
            </div>
            <div :class="$style.filterItem">
                <FormSelect label="Select EntityType" :items="entityTypeList" item-name="longName" item-value="Name" 
                v-model="selectedEntity"/>
            </div>
            <div :class="$style.filterItem">
                <InputText label="Search Company Name" v-model="searchCompany" />
            </div>
            <FormButton type="primary" @click="getDataByFilter" :rounded="true">
                <Icon type="ios-search" />
            </FormButton>
        </div>
        <PageTitle title="Certificate of Good Standing" slot="title"/>
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
    import { CERTIFICATE_OF_GOODSTANDING_PROCESS_ID } from 'Config/processIds';
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    import DataTable from 'Components/DataTable';
    import config from './table';
    import { getStatuses, getFilteredData, getEntityType } from './api';

    export default {
        name: 'CertificateOfGoodStanding',
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
                selectedEntity: null,
                selectedStatus: '',
                searchCompany:'',
                statuses:[],
                entityTypeList:[],
            }
        },
        components:{
            FormWrapper,
            DataTable,
            PageTitle,
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
        },
        methods:{
            requestCertificate() {
                this.$router.push({path: './certificateOfGoodStanding/request'})
            },
            setProcessId() {
                this.$store.commit('setProcessId', CERTIFICATE_OF_GOODSTANDING_PROCESS_ID);
                this.getData();
            },
            getData(){
                Promise.all([
                    getStatuses({process_id: CERTIFICATE_OF_GOODSTANDING_PROCESS_ID}),
                    getEntityType({process_id: CERTIFICATE_OF_GOODSTANDING_PROCESS_ID,
                    icsp_id: this.userData.icsp_id})
                ]).then(this.handleData);
            },
            handleData(response){
                this.statuses = response[0].data[0];
                this.entityTypeList = response[1].data;
                this.getDataByFilter();
            },
            getDataByFilter(){
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;
                // if(this.selectedEntity != null){
                //     var entitySelectedObj = this.entityTypeList.filter((entity) => { return entity.id === this.selectedEntity})
                //     var entitySelected = entitySelectedObj[0].Name
                // }else{
                //     var entitySelected = '';
                // }
                const data = {
                    filterjson: {
                        filter:[{
                            status_id: this.selectedStatus,
                            entityType: this.selectedEntity,
                            companyname: this.searchCompany,
                            process_id: CERTIFICATE_OF_GOODSTANDING_PROCESS_ID
                        }],
                        sort: [{ key, order }],
                        paging: [
                            {
                                startindex: perPage * (page - 1) + 1,
                                pagesize: perPage
                            }
                        ],
                    }
                };
                getFilteredData(data).then(this.handleFilteredData);
            },
            handleFilteredData(response){
                this.tableData = response.data[0];
                this.pagination.total = response.NumberOfRecords;
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

<style lang="scss" module>
    .filter {
        margin: -10px 0 25px;
        display: flex;
        align-items: flex-end;
    }

    .filterItem {
        flex: 0 0 180px;
        margin-right: 20px;
    }

</style>