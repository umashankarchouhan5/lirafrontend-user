<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="Correspondence List" slot="title" />

        <ValidationObserver ref="validator" >
            <div :class="$style.filter">
                <div :class="$style.filterItem">
                    <FormSelect :width="200" label="Communication Mode" :items="filtering.communicationModes" item-name="name" item-value="id" v-model="filtering.communicationModeSelected" />
                </div>
                <div :class="$style.filterItem">
                    <InputText v-model="filtering.ticketReference" label="Ticket Reference" rules="alphaNumCustom" />
                </div>
                <div :class="$style.filterItem">
                    <InputText v-model="filtering.RegNo" label="Company Registration No." />
                </div>
                <div :class="$style.filterItem">
                    <InputDate label="Select Dates" type="daterange" v-model="filtering.dates" />
                </div>
                <div :class="$style.filterItemSmall">
                    <FormButton style="margin-top: 5px" type="primary" @click="getDataByFilter" :rounded="true">
                        <Icon type="ios-search" />
                    </FormButton>
                </div>
            </div>
        </ValidationObserver>
        <DataTable :actions="true"
                   :data="correspondences"
                   :columns="config"
                   :is-loading="isLoading"
                   @on-selection-change="selectChange"
                   @on-page-change="pageChange"
                   :pagination="pagination"
                   @on-sort-change="sortChange">
            <template slot="actionsLeft">
                <TableButton @click="() => render()">
                    <img src="../../../../assets/images/eye.png" />
                    View
                </TableButton>
            </template>
        </DataTable>
        
<!-- Message popup -->
        <Popup title="Information" :value="warningModal.visible" @close="() => showWarningModal(false)">
            {{ warningModal.message }}
            <div slot="footer">
                <FormButton v-if="warningModal.buttons.cancel" @click="() => showWarningModal(false)">Cancel</FormButton>
                <FormButton v-if="warningModal.buttons.confirm" type="success" @click="confirmDelete">Confirm</FormButton>
                <FormButton v-if="warningModal.buttons.ok" @click="() => showWarningModal(false)">Ok</FormButton>
            </div>
        </Popup>
      
<!-- Email Preview popup -->
        <Popup title="Preview" width="1000px" :value="previewModal.visible" @close="() => showPreviewModal(false)">
            <div v-html="previewModal.message"> </div>
            <div v-if="selectedRows[0] && selectedRows !== null && selectedRows[0].attachmentArray" :class="$style.indentClass">
                <br />
                <p  v-for="(obj,index) in getAttachment(selectedRows[0].attachmentArray)" :key="index" ><a :href="obj.url" target="blank">{{ obj.filename }}</a></p>
            </div>
            <div slot="footer">
                <FormButton v-if="previewModal.buttons.ok" @click="() => showPreviewModal(false)">Ok</FormButton>
            </div>
        </Popup>

    </FormWrapper>
</template>

<script>
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    import InputDate from 'Components/form/InputDate';
    import config from './table';
    import loadingMixin from 'Mixins/loadingMixin';
    import { searchICSPTypes, getCorrespondenceList } from '../api'
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    import { ValidationObserver } from 'vee-validate'
    
    export default {
        name: "Correspondence",
        mixins: [loadingMixin,validateSelectedRows],
        components: {
            FormWrapper,
            PageTitle,
            DataTable,
            InputDate,
            ValidationObserver
        },
        data() {
            return {
                filtering: {
                    communicationModes: ['email'],
                    communicationModeSelected: 'email',
                    icspResults: [],
                    icspResultsFiltered: [],
                    ICSPSelectedID: null,
                    ICSPSelectedName: '',
                    companyResults: [],
                    companyResultsFiltered: [],
                    companySelectedID: null,
                    companySelectedName: '',
                    ticketReference: '',
                    RegNo: null,
                    dates: '',
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
                warningModal: {
                    visible: false,
                    buttons: {
                        ok: true,
                        confirm: false,
                        cancel: false
                    }
                },
                previewModal: {
                    visible: false,
                    buttons: {
                        ok: true,
                    }
                },
                correspondences: [],
                tableData: [],
                config,
                selectedRows: [],
            }
        },
        created() {
        //   this.getFilterValues();
          this.getDataByFilter();
        },
        watch: {  },
        computed: {
            userData() {
                return this.$store.state.user.user
            }
        },
        methods: {
            getFilterValues() {
                this.showLoader();
                Promise.all([
                    searchICSPTypes(), // icsplist
                    // getCompanies(),
                ]).then(this.handleFilterValues)
            },
            handleFilterValues(response) {
                this.filtering.icspResults = response[0].data;
                // this.filtering.companyResults = response[1].data;
            },
            selectICSP(name) {
                this.filtering.ICSPSelectedID = this.filtering.icspResultsFiltered.find(item => item.name === name).id;
            },
            searchICSP(value) {
                if (value.length > 2) {
                    this.filtering.icspResultsFiltered = this.filtering.icspResults.filter(item => {
                        return item.name.toLowerCase().includes(value.toLowerCase());
                    })
                } else {
                    this.filtering.icspResultsFiltered = []
                }
            },
            selectCompany(name) {
                this.filtering.companySelectedID = this.filtering.companyResultsFiltered.find(item => item.Name === name).id;
                this.filtering.RegNo = this.filtering.companyResultsFiltered.find(item => item.Name === name).CompanyRegNo;
            },
            searchCompany(value) {
                if (value.length > 2) {
                    this.filtering.companyResultsFiltered = this.filtering.companyResults.filter(item => {
                        return item.Name.toLowerCase().includes(value.toLowerCase());
                    })
                } else {
                    this.filtering.companyResultsFiltered = []
                }
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
            getDataByFilter() {
                
                setTimeout(() => {
                    this.$refs.validator.validate().then((result) => {
                        if (result ) {
                            this.showLoader();
                            const { key, order } = this.sorting;
                            const { perPage, page } = this.pagination;

                            const filters = {};

                            // Ignore other filters if we have Ticket Reference
                            if (this.filtering.ticketReference) {
                                filters.TicketReference = this.filtering.ticketReference;
                            } else {
                                filters.communicationMode = this.filtering.communicationModeSelected;
                                filters.company_id = this.filtering.companySelectedID;
                                filters.ICSP_id = this.filtering.ICSPSelectedID;
                                filters.DateFrom = this.filtering.dates[0];
                                filters.DateTo = this.filtering.dates[1];
                            }

                            const data = {
                                user_id: this.userData.user_id,
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
                            getCorrespondenceList(data)
                                .then(this.handleResponse)
                                .catch(this.handleError)
                        }
                    })
                },
                50 
                )
            },
            handleResponse(response) {
                this.hideLoader();
                this.correspondences = response.data[0];
                this.pagination.total = response.NumberOfRecords;
            },
            showWarningModal(value) {
                this.warningModal.visible = value;
            },
            showPreviewModal(value) {
                this.previewModal.visible = value;
            },
            render() {
                if (this.validateSelectedLength(1)) {
                    var row  = this.selectedRows[0];
                    if(typeof row.attachmentjson!="undefined" && row.attachmentjson && row.attachmentjson !== null && row.attachmentjson !== '' ){
                        row.attachmentArray = row.attachmentjson;
                    }
                    this.previewModal.message = row.template; 
                    this.showPreviewModal(true);
                }
            },
            getAttachment(items) {
                return JSON.parse(items);
            },
        }
    }
</script>

<style lang="scss" module>
    .indentClass{
        margin-left: 35px;
    }
    .progress {
        margin: 0 20px;
        progress {
            width: 100%;
        }
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
    .preview{
        width: 1000px !important;
    }
</style>
