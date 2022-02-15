<template>
    <div>
        <RecordItem v-for="(item, i) in value" :key="i" :record-index="i" :readonly="readonly" :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow" >
            <FormRow>
                <div class="col-sm-4">
                    <InputText  v-model="item.E_Employername" :readonly="readonly" :vid="`EmployeeName-${i}`" label="Name" :rules="{required: notRequired ? false : true}" />
                </div>
                <div class="col-sm-4">
                    <AddressInput v-model="item.E_employerAddress_id" :readonly="readonly" :vid="`EmployeeAddress-${i}`" label="Address" :rules="{required: notRequired ? false : true}" />
                </div>
                <div class="col-sm-4">
                    <InputText  v-model="item.E_EmployerContact" :readonly="readonly" :vid="`EmployeeContact-${i}`" label="Contact Details of Employer" :rules="{required: notRequired ? false : true}" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-4">
                    <InputText  v-model="item.E_NatureOfBusiness" :readonly="readonly" :vid="`EmployeeNature-${i}`" label="Nature of Business" :rules="{required: notRequired ? false : true}" />
                </div>
                <div class="col-sm-4">
                    <InputText  v-model="item.E_Position" :readonly="readonly" :vid="`EmployeePosition-${i}`" label="Positions Held" :rules="{required: notRequired ? false : true}" />
                </div>
                <div class="col-sm-2">
                    <InputDate v-model="item.E_EmploymentStartDate" :readonly="readonly" label="Start Date"  />
                </div>
                <div class="col-sm-2">
                    <InputDate v-model="item.E_EmploymentEndDate" :readonly="readonly" label="End Date" />
                </div>
            </FormRow>
        </RecordItem>
    </div>
</template>

<script>

    import recordMixin from 'Mixins/recordMixin'
    import InputDate from 'Components/form/InputDate';
    import AddressInput from 'Components/form/addressInput/AddressInput';

    export default {
        name: "EmployerRecords",
        components: { AddressInput, InputDate },
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
                    "pq_id":  this.pqId,
                    "RecordType": "Emplr",
                    "E_Employername": "",
                    "E_employerAddress_id": null,
                    "E_EmployerContact": "",
                    "E_NatureOfBusiness": "",
                    "E_Position": "",
                    "E_EmploymentStartDate": '',
                    "E_EmploymentEndDate": ''
            })
            }
        }
    }
</script>
