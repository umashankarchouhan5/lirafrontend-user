<template>
    <div class="recordLine">
        <RecordItem v-for="(item, i) in value" :key="i"  :record-index="i" :readonly="readonly" :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow" >
            <FormRow>
                <div class="col-sm-6">
                    <InputText  v-model="item.G_TrustName" :readonly="readonly" :vid="`TrustName-${i}`" label="Name of Trust" required />
                </div>
                <div class="col-sm-6">
                    <InputText  v-model="item.G_TrustNumber" :readonly="readonly" :vid="`TrustRegistration-${i}`" label="Registration Number" required />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-6">
                    <FormSelect
                            v-model="item.G_CountryOfReg"
                            :items="countries"
                            item-name="Name"
                            item-value="id"
                            :disabled="readonly"
                            label="Country of Registration" />
                </div>
                <div class="col-sm-6">
                    <InputText :readonly="readonly"  v-model="item.G_Position" label="Positions Held" :vid="`TrustPosition-${i}`" :rules="{required: notRequired ? false : true}" />
                </div>
            </FormRow>
        </RecordItem>
    </div>
</template>

<script>

    import recordMixin from 'Mixins/recordMixin'

    export default {
        name: "TrusteeRecords",
        mixins: [recordMixin],
        props:{
            readonly: Boolean,
            notRequired: {
                type: Boolean,
                default: false,
            }
        },
        computed: {
            countries() {
                return this.$store.state.common.countries;
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
                    "RecordType": "Trust",
                    "G_TrustName": "",
                    "G_TrustNumber": "",
                    "G_CountryOfReg": null,
                    "G_Position": ""
                })
            }
        }
    }
</script>
