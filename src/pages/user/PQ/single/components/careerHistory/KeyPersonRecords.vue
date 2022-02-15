
<template>
    <div class="recordLine">
        <RecordItem v-for="(item, i) in value" :key="i" :record-index="i" :readonly="readonly" :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow" >
            <FormRow>
                <div class="col-sm-6">
                    <InputText  v-model="item.J_position" :readonly="readonly" :vid="`KeyPosition-${i}`" label="Positions" :rules="{required: notRequired ? false : true}" />
                </div>
                <div class="col-sm-6">
                    <InputText  v-model="item.J_jurisdiction" :readonly="readonly" :vid="`KeyJurisdiction-${i}`" label="Jurisdiction" :rules="{required: notRequired ? false : true}" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-4">
                    <YearSelect label="Year" v-model="item.J_Year" :readonly="readonly" :vid="`KeyYear-${i}`" :rules="{required: notRequired ? false : true}" />
                </div>
                <div class="col-sm-4">
                    <InputText  v-model="item.J_NatureOfBusiness" :readonly="readonly" :vid="`KeyNature-${i}`" label="Nature of Business" :rules="{required: notRequired ? false : true}" />
                </div>
                <div class="col-sm-4">
                    <InputText  label="Regulatory Authority" :readonly="readonly" :vid="`KeyRegulatory-${i}`" v-model="item.J_RAuthority" :rules="{required: notRequired ? false : true}" />
                </div>
            </FormRow>
        </RecordItem>
    </div>
</template>

<script>

    import recordMixin from 'Mixins/recordMixin'

    export default {
        name: "KeyPersonRecords",
        mixins: [recordMixin],
        props:{
            readonly: Boolean,
            notRequired: {
                type: Boolean,
                default: false,
            }
        },
        watch:{
            value(val) {
                if(this.value.length < 1){
                    this.pushEmptyValue();
                }
            }
        },
        created() {
            if (this.value.length === 0) {
                this.pushEmptyValue()
            }
        },
        methods: {
            addRow() {
                this.pushEmptyValue()
            },
            pushEmptyValue() {
                this.value.push({
                    "PQRecord_id": null,
                    "pq_id": this.pqId,
                    "RecordType": "KPer",
                    "J_position": "",
                    "J_jurisdiction": "",
                    "J_Year": "",
                    "J_NatureOfBusiness": "",
                    "J_RAuthority": ""
                })
            }
        }
    }
</script>
