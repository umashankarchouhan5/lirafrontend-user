<template>
    <div>
        <RecordItem  v-for="(item, i) in value" :key="i" :record-index="i" :readonly="readonly" :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow" >
            <FormRow>
                <div class="col-sm-6">
                    <InputText  v-model="item.F_CompanyName" :readonly="readonly" label="Company Name" :vid="`DirectorCompanyName-${i}`" :rules="{required: notRequired ? false : true}" />
                </div>
                <div class="col-sm-6">
                    <InputText  v-model="item.F_CompanyNumber" :readonly="readonly" label="Company Number" :vid="`DirectorCompanyNumber-${i}`"  :rules="{required: notRequired ? false : true}" />
                </div>
            </FormRow>  
            <FormRow>
                <div class="col-sm-4">
                    <FormSelect
                            v-model="item.F_CountryOfReg"
                            :items="countries"
                            item-name="Name"
                            item-value="id"
                            label="Country"
                            :disabled="readonly" 
                            :vid="`DirectorCountry-${i}`" 
                            />
                </div>
                <div class="col-sm-4">
                    <InputText  v-model="item.F_NatureOfBusiness" :readonly="readonly" :vid="`DirectorNature-${i}`"  label="Nature of Business" :rules="{required: notRequired ? false : true}" />
                </div>
                <div class="col-sm-4">
                    <InputText  v-model="item.F_Position" :readonly="readonly" label="Positions Held" :vid="`DirectorPosition-${i}`"  :rules="{required: notRequired ? false : true}" />
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
        watch:{
            value(val) {
                if(this.value.length < 1){
                    this.pushEmptyValue();
                }
            }
        },
        computed: {
            countries() {
                return this.$store.state.common.countries;
            }
        },
        methods: {
            pushEmptyValue() {
                this.value.push({
                    "PQRecord_id": null,
                    "pq_id": this.pqId,
                    "RecordType": "Direc",
                    "F_CompanyName": "",
                    "F_CompanyNumber": "",
                    "F_NatureOfBusiness": "",
                    "F_CountryOfReg": null,
                    "F_Position": ""
                })
            }
        }
    }
</script>
