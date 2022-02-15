<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="Company List" slot="title" />
         <div :class="$style.filter">
            <div :class="$style.filterItem">
                <InputText v-model="filtering.Name" label="Company Name" />
            </div>
            <div :class="$style.filterItem">
                <InputText v-model="filtering.RegNo" label="Registration No." />
            </div>
            <div :class="$style.filterItem">
                <FormSelect :width="200" label="Status" :items="filtering.status" item-name="name" item-value="id" v-model="filtering.statusSelected" />
            </div>
            <div :class="$style.filterItem">
                <FormSelect :width="200" label="Entity Type" :items="filtering.entityTypes" item-name="Name" item-value="Name" v-model="filtering.entityTypeSelected"  />
            </div>
            <!-- <div :class="$style.filterItem">
                <InputDate label="Select Dates" type="daterange" v-model="filtering.dates" />
            </div> -->
            <div :class="$style.filterItemSmall">
            <FormButton style="margin-top: 5px" type="primary" @click="search" :rounded="true">
                <Icon type="ios-search" />
            </FormButton>
            </div>
        </div>
        <DataTable :actions="false"
                   :data="companies"
                   :columns="config"
                   :is-loading="isLoading"
                   @on-selection-change="selectChange"
                   @on-page-change="pageChange"
                   :pagination="pagination"
                   @on-sort-change="sortChange" v-if="companies.length>0 || isSearched==true">
        </DataTable>
    </FormWrapper>
</template>

<script>
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    // import InputDate from 'Components/form/InputDate';
    import config from './table';
    import loadingMixin from 'Mixins/loadingMixin';
    import { getCompanyStatus, getICSP, getEntityType, getCompanies } from '../api'
    
    export default {
        name: "DocumentMasters",
        mixins: [loadingMixin],
        data() {
            return {
                filtering: {
                    status: [],
                    statusSelected: null,
                    entityTypes: [],
                    entityTypeSelected: null,
                    Name: null,
                    RegNo: null,
                    dates: '',
                    icsp_id: null,
                },
                isSearched: false,
                sorting: {
                    key: 'id',
                    order: 'desc'
                },
                pagination: {
                    perPage: 10,
                    page: 1,
                    total: 0
                },
                companies: [],
                tableData: [],
                config,
            }
        },
        created() {
            this.parseUrlForValues();
            this.getFilterValues();
            // this.getDataByFilter();
        },
        watch: {
            '$route': function (newValue) {
                this.parseUrlForValues();
                this.getDataByFilter();
            },
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            }
        },
        components: {
            FormWrapper,
            PageTitle,
            DataTable,
            // InputDate,
        },
        methods: {
            parseUrlForValues() {
                const mapping = {
                    entityType: 'entityTypeSelected'
                };
                const { query } = this.$route;
                Object.keys(query).forEach(item => {
                    if (query[item] && mapping[item]) {
                        this.filtering[mapping[item]] = ""+query[item]+""
                    }
                })
            },
            getFilterValues() {
                this.showLoader();
                Promise.all([
                    getEntityType({process_id: 564}),
                    getCompanyStatus(),
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.filtering.entityTypes = response[0].data;
                this.filtering.status = response[1].data;
                this.hideLoader();
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
            search(){
                this.pagination.page = 1;
                this.getDataByFilter()
            },
            getDataByFilter() {
                this.showLoader();
                const { key, order } = this.sorting;
                const { perPage, page } = this.pagination;
                const filters = {};

                // Ignore other filters if we have RegNo
                if (this.filtering.RegNo) {
                    filters.RegNo = this.filtering.RegNo
                } else {
                    filters.Name = this.filtering.Name;
                    filters.status_id = this.filtering.statusSelected;
                    filters.ICSP_id = this.userData.icsp_id;
                    filters.DateFrom = this.filtering.dates[0];
                    filters.DateTo = this.filtering.dates[1];
                    filters.EntityType = this.filtering.entityTypeSelected;
                }

                const data = {
                    user_id: this.userData.user_id,
                    type: "companies",
                    filterjson: {
                        filter: [filters],
                        sort: [{ key, order }],
                        paging: [
                            {
                                startindex: perPage * (page - 1) + 1,
                                pagesize: perPage
                            }
                        ]
                    }
                };
                getCompanies(data)
                    .then(this.handleResponse)
            },
            handleResponse(response) {
                this.isSearched = true;
                this.hideLoader();
                this.companies = response.data[0];
                this.pagination.total = response.NumberOfRecords;
            },
        }
    }
</script>

<style lang="scss" module>

    .currentEntityFile {
        display: inline-flex;
        span {
            margin-left: 20px;
            padding: 3px;
            cursor: pointer;
        }
    }

    .bulkFilesError {
        position: absolute;
        z-index: 4;
        bottom: 5px;
        left: 11px;
        font-size: 11px;
        color: #ff3547
    }

    .exampleFile {
        display: inline-block;
        margin-top: 10px;
    }

    .uploadedFiles {
        background: rgb(241, 241, 241);
        height: 200px;
        width: calc(100%/2 - 8px);
        padding: 10px 15px;
        border-radius: 4px;
        overflow: auto;
    }

    .bulkFile {
        display: flex;
        border-bottom: 1px solid darken(rgb(241, 241, 241), 10%);
        align-items: center;
        &:last-child {
            border-bottom: none;
        }
    }

    .removeBulkFile {
        cursor: pointer;
        padding: 3px;
        margin-left: auto;
    }

    .excelFile {
        display: flex;
        padding: 5px 0;
    }

    .excelFileLabel {
        width: 120px;
        flex-shrink: 0;
        flex-grow: 0;
        align-items: center;
        display: flex;
    }

    .excelFileInput {
        flex-grow: 1;
    }

    .progress {
        margin: 0 20px;
        progress {
            width: 100%;
        }
    }

    .upload {
        width: calc(100%/2 - 8px);
        height: 200px;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        &:hover {
            .uploadArea {
                background: darken(#f2f2f2, 5%);
                border: 2px dashed  darken(#e3e3e3, 5%);
            }
        }
        .uploadArea {
            position: absolute;
            pointer-events: none;
            background: #f2f2f2;
            border: 2px dashed #e3e3e3;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1;
            outline: none;
            display: flex;
            align-items: center;
            text-align: center;
            justify-content: center;
        }
        input {
            width: 100%;
            height: 100%;
        }
    }

    .files {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
    }

    .filter {
        margin: -10px 0 25px;
        display: flex;
        max-width: 1000px;
        flex-wrap: wrap;
        align-items: flex-end;
    }

    .filterItem {
         flex: 0 0 200px;
        margin: 0 20px 20px 0;
    }
    .filterItemSmall {
        flex: 0 0 50px;
        margin: 0 20px 20px 0;
    }

    .popupRow {
        padding: 5px 0 15px;
    }



</style>
