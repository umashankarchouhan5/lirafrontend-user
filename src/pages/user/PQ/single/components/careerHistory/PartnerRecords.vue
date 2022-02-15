<template>
    <div class="recordLine">
        <RecordItem v-for="(item, i) in value" :key="i" :record-index="i" :readonly="readonly" :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow" >
            <FormRow>
                <div class="col-sm-6">
                    <InputText  v-model="item.H_CompanyName" :readonly="readonly" label="Company Name" :vid="`PartnerCompanyName-${i}`" :rules="{required: notRequired ? false : true}" />
                </div>
                <div class="col-sm-6">
                    <InputText  v-model="item.H_CompanyNumber" :readonly="readonly" label="Company Number" :vid="`PartnerCompanyNumber-${i}`" :rules="{required: notRequired ? false : true}" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-6">
                    <FormSelect
                            v-model="item.H_CountryOfReg"
                            :items="countries"
                            item-name="Name"
                            item-value="id"
                            :disabled="readonly"
                            label="Country of Registration" />
                </div>
                <div class="col-sm-6">
                    <InputText  v-model="item.H_NatureOfBusiness" :vid="`PartnerNature-${i}`" :readonly="readonly" label="Nature of Business" :rules="{required: notRequired ? false : true}" />
                </div>
            </FormRow>
        </RecordItem>
    </div>
</template>

<script>

    import recordMixin from 'Mixins/recordMixin'

    export default {
        name: "DirectorRecords",
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
                    "RecordType": "Partn",
                    "H_CompanyName": "",
                    "H_CompanyNumber": "",
                    "H_CountryOfReg": null,
                    "H_NatureOfBusiness": ""
                })
            }
        }
    }
</script>
