<template>
    <div>
        <RecordItem v-for="(item, i) in valueUp" :key="i" :record-index="i" :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow" :readonly="readonly" :firstNonRemovable="i == 0 ? true : false" >
            <FormRow>
                <div class="col-sm-4">
                    <InputText label="Name" :vid="`BankName-${i}`" :readonly="readonly" :rules="{required:isRequired}" v-model="item.name" />
                </div>
                <div class="col-sm-4">
                    <InputText label="Branch Address" :vid="`BankAddress-${i}`" :readonly="readonly" :rules="{required:isRequired}"  v-model="item.address" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-4">
                    <InputText label="Account Number" :vid="`BankAccountNumber-${i}`" :readonly="readonly" v-model="item.accountNumber" />
                </div>
                <div class="col-sm-4">
                    <InputText label="Account Type"  :vid="`BankAccountType-${i}`" :readonly="readonly" v-model="item.accountType" />
                </div>
            </FormRow>
            <h5>Signatory to the Account</h5>
            <br />
            <FormRow>
                <div class="col-sm-4">
                    <InputText label="Name" :vid="`BankSignatory1Name-${i}`" :readonly="readonly" v-model="item.signatory1Name" />
                </div>
                <div class="col-sm-4">
                    <InputText label="Position" :vid="`BankSignatory1Position-${i}`" :readonly="readonly" v-model="item.signatory1Position" />
                </div>
            </FormRow>
            <h5>Signatory to the Account</h5>
            <br />
            <FormRow>
                <div class="col-sm-4">
                    <InputText label="Name" :vid="`BankSignatory2Name-${i}`" :readonly="readonly" v-model="item.signatory2Name" />
                </div>
                <div class="col-sm-4">
                    <InputText label="Position" :vid="`BankSignatory2Position-${i}`" :readonly="readonly" v-model="item.signatory2Position" />
                </div>
            </FormRow>
        </RecordItem> 

    </div>
</template>

<script>

    import recordMixin from 'Mixins/recordMixin1';

    export default {
        name: "Record",
        mixins: [recordMixin],
        props:{
            isRequired: {
                type: Boolean,
                default: false    
            },
        },
        components: {
        },
        data(){
            return{
                valueUp: this.value
            }
        },
        computed:{
            userData() {
                return this.$store.state.user.user
            }, 
        },
        watch:{
            value(val){
                this.valueUp = val
            },
        },
        methods: {
            pushEmptyValue() {
                this.value.push({
                    name: '',address: '',accountNumber: '',accountType: '', signatory1Name: '', signatory1Position: '',signatory2Name: '',signatory2Position: ''
                })
                return this.value;
            }, 
        }
    }
</script>
