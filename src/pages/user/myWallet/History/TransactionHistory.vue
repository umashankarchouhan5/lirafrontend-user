<template>
<FormWrapper :is-loading="isLoading">
    <PageTitle title="Transaction History" slot="title" />
    <div :class="$style.info" v-if="tableData.length !== 0">
        <div :class="$style.infoBlock">
            {{res_data[0][0].walletcode}}
        </div>
        <div :class="$style.infoBlock">
            {{res_data[1][0].clientName}}
        </div>
        
        <div :class="$style.infoBlock">
        </div>
    </div>
    <div :class="$style.filter">
        <div :class="$style.filterItem">
            <InputDate style="width: 200px" label="Select Date Range" type="daterange" v-model="form.daterange"/>
        </div>
        <div :class="$style.filterItem">
            <FormButton type="primary" @click="getDataByFilter" :rounded="true">
                <Icon type="ios-search" />
            </FormButton>
        </div>
    </div>

    <DataTable :actions="true"
                :data="tableData"
                :columns="tableConfig"
                :is-loading="isLoading"
                @on-sort-change="sortChange">
        <template slot="actionsRight">
            <TableButton @click="exportHistory">
                <img src="../../../../assets/images/Excel_Icon.png" alt=""/>
                Export
            </TableButton>
        </template>
    </DataTable>
    
    <Popup :value="successModal.visible" :title="successModal.title" type="success" :closable="false" :maskable="false" @close="() => successModal.visible = false">
        <div>
            {{ successModal.message }}
        </div>
        <div slot="footer">
            <FormButton @click="() => backToList()">Back to List</FormButton>
        </div>
    </Popup>
    <Popup :value="warningModal.visible" :title="warningModal.title" type="info" @close="() => warningModal.visible = false">
        <div>
            {{ warningModal.message }}
        </div>
        <div slot="footer">
            <FormButton @click="() => warningModal.visible = false">Close</FormButton>
        </div>
    </Popup>
    
</FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from "Components/layout/PageTitle";
    import {fetchClientLedger, exportWalletTransactionHistory} from "../api";
    import InputDate from "Components/form/InputDate";
    import DataTable from 'Components/DataTable';
    import loadingMixin from 'Mixins/loadingMixin'
    import tableConfig from './table'

    export default {
        name: "Register",
        mixins: [loadingMixin],
        data() {
            return {
                confirmationData: {},
                confirmationVisible: false,
                companyLogo: '',
                onSubmitError: false,
                form: {
                    daterange: '',
                },
                pagination: {
                    perPage: 10,
                    page: 1,
                    total: 0
                },
                tableData: [],
                tableConfig,
                warningModal: {
                    visible: false,
                    title: '',
                    message: ''
                },
                successModal: {
                    visible: false,
                    title: 'Success',
                    message: ''
                },
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                entityCreated: false,
                is_readonly : false,
                emailSent: false,
                otp: {
                    isModalVisible: false,
                },
                terms: {
                    success: {
                        isVisible: false,
                        message: ''
                    }
                },
                res_data: null,
            }
        },
        computed: {
            
            userData() {
                return this.$store.state.user.user; 
            },
        },
        created() {
            this.getDataByFilter();
        },
        watch:{
        },
        components: {
            PageTitle,
            InputDate,
            DataTable,
            FormWrapper
        },
        methods: {
            getDataByFilter() {
                this.confirmationVisible = false;
                this.form.icsplicense_id = parseInt(this.$route.params.id);
                fetchClientLedger(this.form).then(this.handleResponse)
            },
            exportHistory() {
                const data = {
                    transactions: this.tableData,
                    dates: this.form.daterange
                };
                exportWalletTransactionHistory(data).then(this.handleExportResponse)
            },
            handleExportResponse(response) {
                window.open(response.data.url,'_blank');
            },
            handleResponse(response) {
                if(response.data[0].length > 0){
                    console.log(response.data[0]);
                    var list = response.data[0].map( ele => {
                        if(ele.Deposit=='.00') {
                            ele.Deposit = '';
                        }
                        if(ele.withdrawal=='.00') {
                            ele.withdrawal = '';
                        }
                        return ele;
                    })
                }
                else{
                    var list = [];
                }
                this.tableData = list;
                this.res_data = response.data;
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
            backToList(){
                this.$router.push('/myWallet');
            }
        }
    };
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

    .registerSuccess {
        text-align: center;
        img {
            display: block;
            margin: 40px auto;
        }
        h1 {
            margin-bottom: 20px;
        }
        h4 {
            margin-bottom: 15px;
            font-weight: 400;
            font-size: 14px;
            line-height: 20px;
        }
    }

    .register {
        padding-top: 30px;
        width: 600px;
        margin: 0 auto 0 0;
        h4 {
            font-weight: 400;
            font-size: 14px;
            line-height: 20px;
            margin-bottom: 25px;
        }
    }

    .na {
        margin-top: 10px;
        display: block;
    }
    .account {
        padding-top: 12px;
    }
    .agreement {
        margin: -10px 0 30px;
    }
    .terms{
        h3{
            margin: 15px 0px;
        }
        p{
            text-align: justify;
        }
    }
    .showPurposeMessage{
        font-size: 11px;
        margin-top: 10px;
        color: #3c8dbc;
    }
    .clearFix{
        clear: both;
        padding: 30px;
    }
    #search_icon{
        margin-left: 60px;
    }
    #daterange_margin {
        margin-bottom: -70px;
        margin-top:-30px;
    }
    .info {
        background: #d7d6da;
        box-shadow: 0 2px 2px #00000059;
        padding: 0 15px;
        display: flex;
        font-size: 13px;
        margin: -39px -30px 30px;
        line-height: 35px;
        justify-content: center;
        z-index: 10;
        position: sticky;
        top: 34.5px;
        & .infoBlock:nth-child(1){
            text-align: left;
            margin: 0px auto 0xp 0px;
            width: 33.33%
        }
        & .infoBlock:nth-child(2){
            text-align: center;
            margin: 0px auto;
            width: 33.33%
        }
        & .infoBlock:nth-child(3){
            text-align: right;
            margin: 0px 0px 0px auto;
            width: 33.33%
        }
    }
</style>
