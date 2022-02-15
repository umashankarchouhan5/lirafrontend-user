<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="Legal Entities" slot="title"  />
        <DataTable :actions="true"
            :data="entityList"
            :columns="tableConfig"
            :is-loading="isLoading"
            @on-selection-change="selectChange"
            @on-sort-change="sortChange"
        >
            
            <!-- @on-page-change="pageChange"
            :pagination="pagination" -->
            <template slot="actionsLeft">
                <TableButton @click="addEntity">
                    <img src="../../../../assets/images/plus.png" alt="">
                    Add
                </TableButton>
                <TableButton @click="editEntity">
                    <img src="../../../../assets/images/edit.png" alt="">
                    Edit
                </TableButton>
                <TableButton>
                    <img src="../../../../assets/images/Documents.png" alt="">
                    Documents
                </TableButton>
                
            </template>
        </DataTable>
        
        <Popup :value="successModal.visible" :title="successModal.title" type="success" @close="() => successModal.visible = false">
            <div>
                {{ successModal.message }}
            </div>
            <div slot="footer">
                <FormButton @click="() => successModal.visible = false">Close</FormButton>
            </div>
        </Popup>
        <Popup title="Information" :value="warningModal.visible" @close="() => showWarningModal(false)">
            {{ warningModal.message }}
            <div slot="footer">
                
                <FormButton v-if="warningModal.buttons.confirm" type="success" @click="confirmDelete">Confirm
                </FormButton>
                <FormButton v-if="warningModal.buttons.ok" @click="() => showWarningModal(false)">Ok</FormButton>
                <FormButton v-if="warningModal.buttons.cancel" @click="() => showWarningModal(false)">Cancel
                </FormButton>
            </div>
        </Popup>

    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable'
    import loadingMixin from 'Mixins/loadingMixin'
    import { getLegalEntitiesList } from '../api'
    import tableConfig from './table'
    import validateSelectedRows from 'Mixins/validateSelectedRows';

    export default {
        name: "UserCreation",
        mixins: [loadingMixin,validateSelectedRows],
        data() {
            return {
                isModalVisible: false,
                filtering: {
                    statuses: [],
                    statusSelected: null,
                    isRFI: false,
                    companyName: '',
                    
                },
                sorting: {
                    key: 'id',
                    order: 'desc'
                },
                pagination: {
                    perPage: 10,
                    page: 1,
                    total: 0
                },
                tableConfig,
                entities: [],
                selectedRows: [],
                successModal: {
                    visible: false,
                    title: 'Success',
                    message: ''
                },
            }
        },
        watch: {
            
        },
        created() {
            
            this.getData();
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            },
            entityList() {
                if(this.entities.length > 0){
                    var list = this.entities.map( ele => {
                        if(ele.DateOfIncorporation=='1900-01-01') {
                            ele.DateOfIncorporation == '';
                        }
                        if(ele.CompanyRegNo!==null) {
                            var reg_no = ele.CompanyRegNo;
                            if(reg_no.startsWith("TEMP_") || reg_no.startsWith("ICSP_") || reg_no.startsWith("ITSP_") || reg_no.startsWith("FSP_")) {
                                ele.CompanyRegNo = '';
                            }
                        }
                        return ele;
                    })
                }
                else{
                    var list = [];
                }
                return list;
            }
        },
        components: {
            FormWrapper,
            DataTable,
            PageTitle
        },
        methods: {
            addEntity(){
                this.$router.push('/entityCreation');
            },
            editEntity(){
                 if (this.validateSelectedLength(1)) {
                    const row = this.selectedRows[0];
                    this.$router.push(`entityUpdate/${row.id}`)
                }
            },
            selectChange(data) {
                this.selectedRows = data;
            },
            sortChange(data) {
                this.sorting.key = data.key;
                this.sorting.order = data.order;
                this.getDataByFilter()
            },
            getData(){
                this.showLoader();
                getLegalEntitiesList().then(
                    res => {
                        this.entities = res.data;
                        // this.pagination.total = res.NumberOfRecords;
                        this.hideLoader();
                    }
                )
            },
            pageChange(page) {
                this.pagination.page = page;
                this.getDataByFilter()
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
