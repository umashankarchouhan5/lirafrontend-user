<template>
    <div>
        <RecordItem v-for="(item, i) in value" :readonly="readonly" :key="i" :record-index="i" :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow">
            <FormRow>
                <div class="col-sm-2">
                    <FormSelect label="Month From"
                        v-model="item.L_PastMonthFrom"
                        :items="months"
                        item-name="label"
                        :disabled="readonly"
                        item-value="id"
                        
                    />
                </div>
                <div class="col-sm-1">
                    <YearSelect label="Year" :readonly="readonly" v-model="item.L_PastyearFrom" />
                </div>
                <div class="col-sm-2">
                    <FormSelect label="Month To"
                        v-model="item.L_PastMonthTo"
                        :items="months"
                        item-name="label"
                        :disabled="readonly"
                        item-value="id"
                    />
                        <!-- :rules="{checkMonthDateGreaterOrNot: item.L_PastMonthFrom !== null && item.L_PastyearFrom !== null && item.L_PastMonthTo !== null && item.L_PastyearTo !== null ? `${item.L_PastyearFrom},${item.L_PastMonthFrom}|${item.L_PastyearTo},${item.L_PastMonthTo}`: false}" -->
                </div>
                <div class="col-sm-1">
                    <YearSelect label="Year" :readonly="readonly" v-model="item.L_PastyearTo" />
                </div>
                <div class="col-sm-6">
                    <AddressInput label="Address" rules="required" :vid="`Address-${i}`" :readonly="readonly" v-model="item.L_PastAddress_id"  />
                </div>
            </FormRow>
        </RecordItem>
    </div>
</template>

<script>

    import AddressInput from 'Components/form/addressInput/AddressInput';
    import recordMixin from 'Mixins/recordMixin';

    export default {
        name: "AddressRecords",
        mixins: [recordMixin],
        data() {
            return {
                months: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ].map((item, i) => {
                    return {
                        id: i + 1,
                        label: item
                    }
                })
            }
        },
        props:{
            readonly: Boolean,
        },
        components: {
            AddressInput
        },
        watch:{
            value(val) {
                if(this.value.length < 1){
                    this.pushEmptyValue();
                }
            }
        },
        methods: {
            clearMonth(val) {
                console.log(val)
            },
            pushEmptyValue() {
                this.value.push({
                    PQRecord_id: null,
                    pq_id: this.pqId,
                    L_PastMonthFrom: null,
                    L_PastMonthTo: null,
                    L_PastyearFrom: null,
                    L_PastyearTo: null,
                    L_PastAddress_id: null,
                    RecordType: "Addrs"
                })
            }
        }
    }
</script>
