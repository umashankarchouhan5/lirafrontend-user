<template>
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
</template>

<script>

    import { getStatuses, getFilteredData, getEntityType } from './api';

    export default {
        name:'FilterTaskData',
        data() {
            return{
                selectedEntity: null,
                selectedStatus: '',
                searchCompany:'',
                statuses:[],
                entityTypeList:[],
            }
        },
        props: {
            tableData: [Array,Object],
            pagination: Object,
            sorting: Object
        },
        computed: {
            processId() {
                return this.$store.state.common.currentProcessId;
            },
            userData() {
                return this.$store.state.user.user;
            },

        },
        watch: {
            'pagination.page':function(val){
                this.getDataByFilter();
            },
            'sorting.order':function(val){
                this.getDataByFilter();
            },
            pagination(val){
                this.getDataByFilter();
            },
            sorting(val){
                this.getDataByFilter();
            }
        },
        created() {
            this.getData();
        },
        methods: {
            getData(){
                Promise.all([
                    getStatuses({process_id: this.processId}),
                    getEntityType({process_id: this.processId})
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
                const data = {
                    filterjson: {
                        filter:[{
                            status_id: this.selectedStatus,
                            entityType: this.selectedEntity,
                            companyname: this.searchCompany,
                            process_id: this.processId
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
                // this.tableData = response.data[0];
                this.$emit("tableDataUpdate",response.data[0]);
                this.pagination.total = response.NumberOfRecords;
            },
        }
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
