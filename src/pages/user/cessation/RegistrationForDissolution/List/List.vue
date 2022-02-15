<template>
    <FormWrapper>
        <PageTitle title="Registration of Dissolution List" slot="title"/>
        <div :class="$style.filter">
            <div :class="$style.filterItem">
                <FormSelect label="Select Status" :items="statuses" item-name="name" item-value="id" :clearable="true"
                    v-model="selectedStatus"/>
            </div>
            <div :class="$style.filterItem">
                <FormSelect label="Select EntityType" :items="entityTypeList" item-name="Name" item-value="id" :clearable="true"
                v-model="selectedEntity"/>
            </div>
            <FormButton type="primary" @click="getDataByFilter" :rounded="true">
                <Icon type="ios-search" />
            </FormButton>
        </div>
        <DataTable :actions="true"
                   :data="tableData"
                   :columns="config[Status].columns"
                   @on-selection-change="selectChange"
                   @on-page-change="pageChange"
                   :pagination="pagination"
                   @on-sort-change="sortChange">
            <template slot="actionsLeft">
                <template >
                    <TableButton @click="cessationRequest">
                        <img src="../../../../../assets/images/plus.png" alt="">
                        Register Dissolution
                    </TableButton><TableButton @click="editCessationRequest">
                        <img src="../../../../../assets/images/edit.png" alt="">
                        Edit Dissolution Request
                    </TableButton>
                </template>
            </template>
        </DataTable>
        <Popup title="Information" type="info" :value="warningModal.visible" @close="() => showWarningModal(false)">
            {{ warningModal.message }}
            <div slot="footer">
                <FormButton v-if="warningModal.buttons.ok" @click="() => showWarningModal(false)">Ok</FormButton>
            </div>
        </Popup>
    </FormWrapper>
</template>

<script>
    import { REGISTRATION_FOR_DISSOLUTION  } from 'Config/processIds';
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    import DataTable from 'Components/DataTable';
    import config from './table';
    import { getFilteredData, getStatuses, getEntityType } from '../../api';

    const DEFAULT_STATUS = 43;

    export default {
        name: 'CessationList',
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
            // this.setProcessId();
            this.getData();
        },
        methods:{
            editCessationRequest(){
                if (this.validateSelectedLength(1) ) {
                    if(this.selectedRows[0].Status_id === 43){
                        this.$router.push(`/dissolutionRegistration/${this.selectedRows[0].reference_id}`)
                    }else{
                        this.warningModal.message = 'You can\'t edit this request';
                        this.showWarningModal(true);
                    }
                }
            },
            cessationRequest() {
                this.$router.push('/dissolutionRegistrationForm')
            },
            setProcessId() {
                this.$store.commit('setProcessId', REGISTRATION_FOR_DISSOLUTION);
                this.getData();
            },
            getData(){
                Promise.all([
                    getStatuses({process_id: REGISTRATION_FOR_DISSOLUTION}),
                    getEntityType({process_id: REGISTRATION_FOR_DISSOLUTION,
                    icsp_id: this.userData.icsp_id})
                ]).then(this.handleData);
            },
            handleData(response){
                this.statuses = response[0].data[0];
                this.entityTypeList = response[1].data;
                this.selectedStatus = DEFAULT_STATUS;
                this.getDataByFilter();
            },
            getDataByFilter(){
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;
                if(this.selectedEntity != null){
                    var entitySelectedObj = this.entityTypeList.filter((entity) => { return entity.id === this.selectedEntity})
                    var entitySelected = entitySelectedObj[0].Name
                }else{
                    var entitySelected = '';
                }
                const data = {
                    filterjson: {
                        filter:[{
                            status_id: this.selectedStatus,
                            entityType: entitySelected,
                            process_id: REGISTRATION_FOR_DISSOLUTION
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