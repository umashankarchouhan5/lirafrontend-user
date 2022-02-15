<template>
    <div class="recordLine">
        <RecordItem v-for="(item, i) in value" :key="i" :readonly="readonly" :record-index="i" :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow" >
            <FormRow>
                <div class="col-sm-4">
                    <InputText  v-model="item.K_position" :readonly="readonly" label="Positions" :vid="`PrevPosition-${i}`" :rules="{required: notRequired ? false : true}" />
                </div>
                <div class="col-sm-4">
                    <InputText  v-model="item.K_jurisdiction" :readonly="readonly" label="Jurisdiction" :vid="`PrevJurisdiction-${i}`" :rules="{required: notRequired ? false : true}" />
                </div>
                <div class="col-sm-4">
                    <InputText v-model="item.K_RAuthority" :readonly="readonly" label="Regulatory Authority" :vid="`PrevRegulatory-${i}`" :rules="{required: notRequired ? false : true}" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-4">
                    <YearSelect label="Year" :rules="{required: notRequired ? false : true}" v-model="item.K_Year" :vid="`PrevYear-${i}`" :readonly="readonly"/>
                </div>
                <div class="col-sm-4">
                    <InputText  v-model="item.K_NatureOfBusiness" :readonly="readonly" label="Nature of Business" :vid="`PrevNature-${i}`" :rules="{required: notRequired ? false : true}" />
                </div>
                <div class="col-sm-4">
                    <InputText  label="Outcome" :vid="`PrevOutcome-${i}`" :rules="{required: notRequired ? false : true}" v-model="item.K_outcome" :readonly="readonly"/>
                </div>
            </FormRow>
        </RecordItem>
    </div>
</template>

<script>

    import recordMixin from 'Mixins/recordMixin'

    export default {
        name: "PrevAppInnRecords",
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
        methods: {
            pushEmptyValue() {
                this.value.push({
                        "PQRecord_id": null,
                        "pq_id": this.pqId,
                        "RecordType": "PrevA",
                        "K_position": "",
                        "K_jurisdiction": "",
                        "K_RAuthority": "",
                        "K_Year": "",
                        "K_NatureOfBusiness": "",
                        "K_outcome": ""
                    })
            }
        }
    }
</script>
