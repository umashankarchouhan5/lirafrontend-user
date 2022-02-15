<template>
    <Popup :value="showModal"
        width="700"
        type="info"
        title="Payment Confirmation"
        :closable="true"
        :mask-closable="true"
        @close="() => showModal = false">
        <div :class="$style.confirmation">
            <div >
                <h6>Confirm the payment amount before you proceed.</h6>
                <p>All Amounts are in USD</p>
                <div :class="$style.container">
                    <div :class="$style.flex">
                        <div :class="$style.firstBox"><p>Deposit Amount</p><span>:</span></div>
                        <div :class="$style.secondBox"> {{value.deposit_amount}}</div>
                    </div>
                    
                    
                    <div :class="$style.flex">
                        <div :class="$style.firstBox"><p>Bank Fee</p><span>:</span></div>
                        <div :class="$style.secondBox"> {{value.bank_fee}}</div>
                    </div>
                    <div :class="$style.flex">
                        <div :class="$style.firstBox"><p>Total Amount</p><span>:</span></div>
                        <div :class="$style.secondBox"> {{value.total_amount}}</div>
                    </div>
                </div>
                
            </div>
        </div>
        <template slot="footer">
            <FormButton type="success" @click="confirmPayment()">Confirm</FormButton>
            <FormButton @click="showModal = false">Cancel</FormButton>
        </template>
    <form id="payment_form" v-if="paymentData !== null" :action="paymentData.action_url" method="post">
        <input type="hidden" name="access_key" id="access_key"  :value="paymentData.access_key">
        <input type="hidden" name="profile_id" id="profile_id"  :value="paymentData.profile_id">
        <input type="hidden" name="transaction_uuid" id="transaction_uuid" :value="paymentData.transaction_uuid">
        <input type="hidden" name="signed_field_names" id="signed_field_names" :value="paymentData.signed_field_names">
        <input type="hidden" name="unsigned_field_names" id="unsigned_field_names" :value="paymentData.unsigned_field_names">
        <input type="hidden" name="signed_date_time" id="signed_date_time" :value="paymentData.signed_date_time">
        <input type="hidden" name="locale" id="locale" :value="paymentData.locale">
        <input type="hidden" name="transaction_type" id="transaction_type" :value="paymentData.transaction_type">
        <input type="hidden" name="webuser_id" id="webuser_id" :value="paymentData.webuser_id">
        <input type="hidden" name="icsplicense_id" id="icsplicense_id" :value="paymentData.icsplicense_id">
        <input type="hidden" name="account_head" id="webuser_id" :value="paymentData.account_head">
        <input type="hidden" name="amount" id="amount" :value="paymentData.amount">
        <input type="hidden" name="bankFee" id="bankFee" :value="paymentData.bank_fee">
        <input type="hidden" name="currency" id="currency" :value="paymentData.currency">
        <input type="hidden" name="action_url" id="action_url" :value="paymentData.action_url">
        <input type="hidden" name="signature" id="signature" :value="paymentData.signature">
        <input type="hidden" name="reference_number" id="reference_number" :value="paymentData.reference_number">
        <!-- <input type="hidden" name="signature" id="signature" :value="paymentData"> -->
    </form>
    </Popup>
</template>
<script>

import { PaymentConfirmation } from '../api';
const axios = require("axios");

export default {
    name: "Confirmation",
    props: {
        value: Object,
        isVisible: Boolean,
        currency: String,
        invoice_idstring: [String,Number]
    },
    data(){
        return{
            showModal: false,
            paymentData: null,
        }
    },
    watch:{
        isVisible(val){
            this.showModal = val;
        },
        paymentData(val){
            if(val !== null){
                setTimeout(() => {
                    var form1 = document.getElementById('payment_form');
                    form1.submit();

                },1000)
            }
        }
    },
    methods:{
        confirmPayment(){
            const Data = {
                amount: this.value.total_amount,
                currency: this.currency,
                addToWallet: true,
                bankFee: this.value.bank_fee,
                icsplicense_id: this.value.icsplicense_id,
                account_head: this.value.account_head,
                balance: this.value.balance,
            }
            PaymentConfirmation(Data).then(
                (res) =>{
                    localStorage.setItem('pathToReturn',this.$route.fullPath);
                    localStorage.setItem('tblCCBeforePosting_id',res.tblCCBeforePosting_id);
                    this.paymentData = res.data;
                }
            )
        },
        async saveLocalData(){
            localStorage.setItem('pathToReturn',this.$route.fullPath);
            localStorage.setItem('invoice_idstring',this.invoice_idstring);
            return true;
        }
    }
}
</script>

<style lang="scss" module>
.container{
    .flex{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .firstBox{
            text-align: left;
            display: flex;
            justify-content: space-between;
            min-width: 150px;
            span{
                text-align: right;
            }
        }
        .secondBox{
            text-align: right;
            min-width: 100px;
        }
    }
}
.confirmation{
    padding: 0px 10px;
    h3{
        margin: 15px 0px;
    }
    p{
        text-align: justify;
    }
}

</style>