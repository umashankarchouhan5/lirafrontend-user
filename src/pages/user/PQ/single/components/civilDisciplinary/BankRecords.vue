<template>
    <div>
        <RecordItem v-for="(item, i) in value" :readonly="readonly" :key="i" :record-index="i" :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow">
            <FormRow>
                <div class="col-sm-4">
                    <InputText v-model="item.M_BankName" :readonly="readonly" rules="required" label="Name of Bank" />
                </div>
                <div class="col-sm-4">
                    <AddressInput label="Address" :readonly="readonly" v-model="item.M_BankAddress_id" rules="required" />
                </div>
                <div class="col-sm-4">
                    <InputTel label="Phone Number" :readonly="readonly" v-model="item.M_BankContactNo" rules="required" />
                </div>
            </FormRow>
        </RecordItem>
    </div>
</template>

<script>

    import InputTel from 'Components/form/InputTel';
    import AddressInput from 'Components/form/addressInput/AddressInput';
    import recordMixin from 'Mixins/recordMixin';

    export default {
        name: "BankRecords",
        mixins: [recordMixin],
        components: {
            InputTel,
            AddressInput
        },
        props:{
            readonly: Boolean
        },
        watch:{
            value(val) {
                if(this.value.length < 1){
                    this.pushEmptyValue();
                }
            }
        },
        methods: {
            pushEmptyValue() {
                this.value.push({
                    "PQRecord_id": null,
                    "pq_id": this.pqId,
                    "RecordType": "Bank",
                    "M_BankContactNo": "",
                    "M_BankName": "",
                    "M_BankAddress_id": null
                })
            }
        }
    }
</script>
