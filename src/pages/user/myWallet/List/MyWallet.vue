<template>
    <FormWrapper :is-loading="isLoading">
        <PageTitle title="My Wallet" slot="title"  />
        <DataTable :actions="true"
            :data="licenses"
            :columns="tableConfig"
            :is-loading="isLoading"
            @on-selection-change="selectChange"
            @on-sort-change="sortChange"
        >
            
            <!-- @on-page-change="pageChange"
            :pagination="pagination" -->
            <template slot="actionsLeft">
                <TableButton @click="addMoney">
                    <img src="../../../../assets/images/AddMoney.png" alt="">
                    Add Money
                </TableButton>
                <TableButton @click="history">
                    <img src="../../../../assets/images/eye.png" alt="">
                    View Transaction History
                </TableButton>
                <TableButton @click="checkBalance">
                    <img src="../../../../assets/images/CheckBalance.png" alt="">
                    Check Balance
                </TableButton>
                <TableButton @click="lowBalanceAlert">
                    <img src="../../../../assets/images/CheckBalance.png" alt="">
                    Set Low Balance Alert
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
    import { getWebuserWallet, checkWalletBalance } from '../api'
    import tableConfig from './table'
    import validateSelectedRows from 'Mixins/validateSelectedRows';

    export default {
        name: "MyWallet",
        mixins: [loadingMixin,validateSelectedRows],
        data() {
            return {
                isModalVisible: false,
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
                licenses: [],
                selectedRows: [],
                successModal: {
                    visible: false,
                    title: 'Balance',
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
        },
        components: {
            FormWrapper,
            DataTable,
            PageTitle
        },
        methods: {
            addMoney(){
                if (this.validateSelectedLength(1)) {
                    const row = this.selectedRows[0];
                    this.$router.push(`/addMoney/${row.id}`);
                }
            },
            history(){
                if (this.validateSelectedLength(1)) {
                    const row = this.selectedRows[0];
                    this.$router.push(`/transactionHistory/${row.id}`);
                }
            },
            checkBalance(){
                if (this.validateSelectedLength(1)) {
                    const row = this.selectedRows[0];
                    this.showLoader();
                    checkWalletBalance({wallet_code:row.AccountHead}).then(
                        res => {
                            const msg = 'USD '+parseFloat(res.data.balance).toFixed(2)+' is the balance of '+res.data.wallet_code+' - '+row.CompanyName;
                            this.successModal.message = msg;
                            this.showSuccessModal(true);
                            this.hideLoader();
                        }
                    )
                    }
            },
            lowBalanceAlert(){
                if (this.validateSelectedLength(1)) {
                    const row = this.selectedRows[0];
                    this.$router.push(`/lowBalance/${row.id}`);
                }
            },
            showSuccessModal(val){
                this.successModal.visible = val;
            },
            selectChange(data) {
                this.selectedRows = data;
            },
            sortChange(data) {
                this.sorting.key = data.key;
                this.sorting.order = data.order;
                // this.getDataByFilter()
            },
            getData(){
                this.showLoader();
                getWebuserWallet().then(
                    res => {
                        this.licenses = res.data;
                        // this.pagination.total = res.NumberOfRecords;
                        this.hideLoader();
                    }
                )
            },
            pageChange(page) {
                this.pagination.page = page;
                // this.getDataByFilter()
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
