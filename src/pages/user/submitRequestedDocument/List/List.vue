<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="Requested Document List" slot="title" />
        
        <SearchCompanyNew 
            v-model="filtering.company" 
            entityInclusive 
            icspIdRequired
            :entityTypes="entityTypes" 
        />
        <div :class="$style.filter">
            <div :class="$style.filterItem">
                <InputText style="width: 200px" label="TicketReference"  v-model="filtering.TicketReference" />
            </div>
            <FormButton style="margin-top: 5px" type="primary" @click="getDataByFilter" :rounded="true">
                <Icon type="ios-search" />
            </FormButton>
        
        </div>

        <DataTable :actions="true"
            :data="docList"
            :columns="tableConfig"
            :is-loading="isLoading"
            @on-page-change="pageChange"
            :pagination="pagination"
            @on-selection-change="selectChange"
            @on-sort-change="sortChange">

            <template slot="actionsLeft">
                <TableButton @click="viewDocs">
                    <img src="../../../../assets/images/view.png" alt="">
                    View
                </TableButton>
            </template>
        </DataTable>
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
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    import loadingMixin from 'Mixins/loadingMixin';
    import { getRegisteredDocumentList } from '../api';
    import tableConfig from './table';
    import validateSelectedRows from 'Mixins/validateSelectedRows';

    export default {
        name: "RequestedDocList",
        mixins: [loadingMixin,validateSelectedRows],
        components: {
            FormWrapper,
            DataTable,
            PageTitle
        },
        data() {
            return {
                entityTypes: [
                    {
                        Name: 'CSL'
                    },
                    {
                        Name: 'PCC'
                    }
                ],
                filtering: {
                    statuses: [],
                    statusSelected: null,
                    TicketReference: '',
                    company: {
                        EntityType: null,
                        Name: '',
                        CompanyRegNo: '',
                    },
                },
                pagination: {
                    perPage: 10,
                    page: 1,
                    total: 0
                },
                tableConfig,
                tableData: [],
                docList: [],
                selectedRows: [],
            }
        },
        created() {
            this.getDataByFilter();
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            },
        },
        methods: {
            viewDocs(){
                if (this.validateSelectedLength(1)) {
                    const row = this.selectedRows[0];
                    this.$router.push(`/requestedDoc/${row.TicketReference}`);
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
            getDataByFilter() {
                this.showLoader();
                const { perPage, page } = this.pagination;

                const filters = {};
                const { TicketReference, company} = this.filtering;

                if(TicketReference.trim() != '') filters.TicketReference = TicketReference
                else {
                    filters.company_id = company.id;
                    filters.entityType = company.EntityType
                }
                // filters.status_id = this.filtering.statusSelected;
                const data = {
                    filterjson: {
                        filter: [filters],
                        paging: [
                            {
                                startindex: perPage * (page - 1) + 1,
                                pagesize: perPage
                            }
                        ]
                    }
                };
                getRegisteredDocumentList(data).then(this.handleResponse).catch(this.handleError)
            },
            pageChange(page) {
                this.pagination.page = page;
                this.getDataByFilter()
            },
            handleResponse(response) {
                this.hideLoader();
                this.docList = response.data[0];
                this.pagination.total = response.NumberOfRecords;
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
