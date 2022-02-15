<template>
    <div class="recordLine">
        <RecordItem v-for="(item, i) in value" :key="i" :readonly="readonly" :record-index="i" :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow">
        <FormRow>
                <div class="col-sm-4">
                    <InputText v-model="item.D_Training" :vid="`Training-${i}`" :rules="{required: notRequired ? false : true}" :readonly="readonly" label="Training" />
                </div>
                <div class="col-sm-4">
                    <InputText v-model="item.D_trainingProvider" :vid="`TainingProvider-${i}`" :rules="{required: notRequired ? false : true}" :readonly="readonly" label="Training Provider" />
                </div>
                <div class="col-sm-2">
                    <InputText v-model="item.D_Duration" :vid="`TrainingDuration-${i}`" :rules="{required: notRequired ? false : true}" :readonly="readonly" label="Duration (Ex: 2 Years or 6 Months)" />
                </div>
                <div class="col-sm-2">
                    <YearSelect label="Year" :readonly="readonly" :vid="`TrainingYear-${i}`" :rules="{required: notRequired ? false : true}" v-model="item.D_TrainingYear" />
                </div>
            </FormRow>
        </RecordItem>
    </div>
</template>

<script>

    import recordMixin from 'Mixins/recordMixin'

    export default {
        name: "TrainingRecords",
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
                    "RecordType": "Train",
                    "D_Training": "",
                    "D_trainingProvider": "",
                    "D_Duration": "",
                    "D_TrainingYear": ""
                })
            }
        }
    }
</script>

<style>
    .recordLine > .row {
        position: relative;
    }
</style>
