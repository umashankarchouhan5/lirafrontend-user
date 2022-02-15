<template>
    <FormWrapper>
        <PageTitle title="Notifications" slot="title"/>
        <ValidationObserver ref="validator" >
            <div :class="$style.filter">
                <div :class="$style.filterItem">
                    <InputText v-model="filtering.TicketReference" style="width: 200px" label="Reference #" rules="alphaNumCustom" />
                </div>
                <div :class="$style.filterItem">
                    <InputText label="Company ID"  v-model="filtering.company_id" />
                </div>
                <div :class="$style.filterItem">
                    <InputDate style="width: 200px" label="Select Date range" type="daterange" v-model="filtering.dates" />
                </div>
                <FormButton style="margin-top: 5px" type="primary" @click="getNotifs" :rounded="true">
                    <Icon type="ios-search" />
                </FormButton>
            </div>
        </ValidationObserver>
        <br />
        <DataTable :actions="true"
            :data="tableData"
            :columns="config"
            @on-selection-change="selectChange"
            @on-page-change="pageChange"
            :pagination="pagination"
            @on-sort-change="sortChange">
            
            <template slot="actionsLeft">
                <template >
                    <TableButton @click="seeNotification(selectedRows[0])">
                        <img src="../../../assets/images/plus.png" alt="">
                        See
                    </TableButton>
                </template>
            </template>
        </DataTable>
    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import { getNotification, getNotificationCount, readNotificationWeb, ticketToProcess } from './api';
    import PageTitle from 'Components/layout/PageTitle';
    import DataTable from 'Components/DataTable';
    import validateSelectedRows from 'Mixins/validateSelectedRows';
    import config from './table';
    import InputDate from 'Components/form/InputDate';
    import { ValidationObserver } from 'vee-validate'

    export default {
        name: 'Notifications',
        components:{
            FormWrapper,
            DataTable,
            PageTitle,
            InputDate,
            ValidationObserver
        },
        mixins:[validateSelectedRows],
        data(){
            return{
                config,
                selectedRows: [],
                sorting: {
                    key: "id",
                    order: "Desc"
                },
                tableData: [],
                pagination: {
                    perPage: 10,
                    page: 1,
                    total: 0
                },
                filtering:{
                    TicketReference: null,
                    company_id: null,
                    DateFrom: '',
                    DateTo: '',
                    dates:'',
                }
            }
        },
        created(){

            this.getNotifs();
        },
        watch:{
            'filtering.dates': function(val){
                this.filtering.DateFrom = val[0];
                this.filtering.DateTo = val[1];
            }
        },
        methods:{
            seeNotification(notif){
                
                if(notif.notificationType_id && notif.notificationType_id == 2){
                    this.$router.push(`/invoice/${notif.invoice_id}`)
                }else{
                    ticketToProcess({TicketReference: notif.TicketReference}).then(
                        res => {
                            this.$store.dispatch('setParent',res.data[1][0]);
                            this.$store.dispatch('setTicketReference', notif.TicketReference);

                            this.$router.push({
                                name:'tasks', 
                                query: { TicketReference: notif.TicketReference}
                            });
                        }
                    )
                }
            },
            
            sortChange(data) {
                this.sorting.key = data.key;
                this.sorting.order = data.order;
                this.getNotifs()
            },
            pageChange(page) {
                this.pagination.page = page;
                this.getNotifs()
            },
            selectChange(data) {
                this.selectedRows = data;
            },
            getNotifs(){
                
                setTimeout(() => {
                    this.$refs.validator.validate().then((res) => {
                        if (res ) {
                            const { key, order } = this.sorting;
                            const { perPage, page } = this.pagination;
                            const { TicketReference, company_id, DateFrom, DateTo } = this.filtering;
                            const filters = {}
                            if(TicketReference  !== null){
                                filters.TicketReference= TicketReference;
                            }else{
                                filters.company_id = company_id;
                                filters.DateTo = DateTo;
                                filters.DateFrom = DateFrom;
                            }
                            const data ={
                                filterjson:{
                                    filter:[filters],
                                    sort: [{ key, order }],
                                    paging: [
                                        {
                                            startindex: perPage * (page - 1) + 1,
                                            pagesize: perPage
                                        }
                                    ],
                                }
                            }
                            getNotification(data).then(
                                res => {
                                    this.tableData = res.data[0];
                                    this.pagination.total = res.NumberOfRecords;
                                }
                            )
                        }
                    })
                },
                50
                )
            },
            readNotification(notif){
                
                ticketToProcess({TicketReference: notif.TicketReference}).then(
                    res => {
                        this.$store.dispatch('setParent',res.data[1][0]);
                        this.$store.dispatch('setTicketReference', notif.TicketReference);

                        this.$router.push({
                            name:'tasks', 
                            query: { TicketReference: notif.TicketReference}
                        });

                    }
                )
                readNotificationWeb({notification_id:notif.notification_id}).then(
                    res => {
                        this.getNotifs();
                    }
                )
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
