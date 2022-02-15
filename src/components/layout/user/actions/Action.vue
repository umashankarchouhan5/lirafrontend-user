<template>
    <div :is-loading="isLoading">
        <div v-if="actions.length > 0">
            <h6 >Actions</h6>
            <DataTable :actions="true"
                :data="actions"
                :columns="tableConfig"
                :is-loading="isLoading"
                @on-selection-change="selectChange"
                @on-page-change="pageChange"
                :pagination="pagination"
                @on-sort-change="sortChange">
                <template slot="actionsLeft">
                    <TableButton @click="markAsComplete">
                        <img src="../../../../assets/images/check-o.png" alt="" >
                        Mark Done
                    </TableButton>
                    <TableButton @click="openInvoice" v-if="selectedRows && ActionType === 'Pay Fees'">
                        <img src="../../../../assets/images/check-o.png" alt="" >
                        Pay
                    </TableButton>
                </template>
            </DataTable>
        </div>
        
        <Popup title="Success" type="success" :value="successModal.visible" @close="hideSuccessModal">
            {{ successModal.message }}
            <div slot="footer">
                <FormButton @click="hideSuccessModal">Ok</FormButton>
            </div>
        </Popup>
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
    </div>
</template>

<script>

    import DataTable from 'Components/DataTable';
    import tableConfig from './config/table';
    import loadingMixin from 'Mixins/loadingMixin';
    import { getActions, markDone } from './config/api';
    import validateSelectedRows from 'Mixins/validateSelectedRows';

    export default {
        name: 'Actions',
        mixins: [loadingMixin,validateSelectedRows],
        data(){
            return{
                selectedRows: [],
                successModal: {
                    visible: false,
                    message: ''
                },
                isVisible: false,
                tableConfig,
                pagination: {
                    perPage: 10,
                    page: 1,
                    total: 0
                },
                actions: [],
                sorting: {
                    key: 'Deadline',
                    order: 'asc'
                },
                actionList: [
                    {
                        ActionType: 2,
                        ActionName: 'Pay Fees',
                    }
                ],
                ActionType:'',
            }
        },
        components:{
            DataTable,
        },
        props:{
            ticket: {
                type: Object,
            }
        },
        computed:{
            processId() {
                return this.$store.state.common.currentProcessId
            },
            userData() {
                return this.$store.state.user.user
            },
        },
        watch:{
            selectedRows(val){
                this.ActionType = val[0].ActionType;
            }
        },
        created(){
            this.getActionsData();
        },
        methods:{
            openInvoice(){
                this.$router.push(`/invoice/${this.selectedRows[0].invoice_id}`)
            },
            markAsComplete(){
                if (this.validateSelectedLength(1)) {
                    this.showLoader();
                    const data ={
                        TicketReference: this.ticket.TicketReference,
                        reviewAction_id: this.selectedRows[0].ReviewAction_id
                    }
                    markDone(data).then(
                        (res) => {
                            this.hideLoader();
                            this.successModal.message = res.message;
                            this.showSuccessModal();
                            this.getActionsData();
                        }
                    )
                }
            },
            selectChange(data) {
                this.selectedRows = data;
            },
            showSuccessModal() {
                this.successModal.visible = true;
            },
            hideSuccessModal() {
                this.successModal.visible = false;
                this.successModal.message = '';
            },
            
            showActionModal(value){
                this.isVisible = value;
            },
            pageChange(page) {
                this.pagination.page = page;
                this.getActionsData()
            },
            sortChange(data) {
                this.sorting.key = data.key;
                this.sorting.order = data.order;
                this.getActionsData()
            },
            getActionsData(){
                this.showLoader();
                getActions({TicketReference:this.ticket.TicketReference}).then(
                    (res) => {
                        this.actions = res.data;
                        this.hideLoader();
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
    .popupRow {
        padding: 5px 0 15px;
    }


</style>