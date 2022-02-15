<template>
    <div>
        <RecordItem v-for="(item, i) in value" :key="i" :readonly="readonly" :record-index="i" :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow">
            <FormRow>
                <div class="col-sm-4">
                    <FormSelect
                            :items="identificationTypes"
                            item-name="DisplayName"
                            v-model="item.N_IDType_id"
                            item-value="id"
                            :disabled="readonly"
                            rules="required"
                            label="Identification Type" />
                </div>
                <div class="col-sm-4">
                    <InputText label="Identification Number" rules="required" :readonly="readonly" v-model="item.N_IDNo" />
                </div>
                <div class="col-sm-4">
                    <InputDate label="Expiry Date" :readonly="readonly" v-model="item.N_IdExpiryDate" :options="options" />
                </div>
            </FormRow>
        </RecordItem>
    </div>
</template>

<script>

    import InputDate from 'Components/form/InputDate';
    import recordMixin from 'Mixins/recordMixin';

    export default {
        name: "NationalityRecords",
        mixins: [recordMixin],
        data() {
            return {
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() < Date.now();
                    }
                },
            }
        },
        props:{
            readonly: Boolean,
        },
        computed: {
            identificationTypes() {
                return this.$store.state.common.identificationTypes;
            }
        },
        components: {
            InputDate
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
                    PQRecord_id: null,
                    pq_id: this.pqId,
                    N_IDType_id: null,
                    N_IDNo: null,
                    N_IdExpiryDate: null,
                    RecordType: "Natnl",
                })
            }
        }
    }
</script>
