<template>
    <div class="recordLine">
        <RecordItem v-for="(item, i) in value" :key="i" :record-index="i" :readonly="readonly" :length="value.length" @onAddRow="addRow" @onDeleteRow="deleteRow" >
            <FormRow>
                <div class="col-sm-3">
                    <InputText v-model="item.C_MembershipNumber" :rules="{required: notRequired ? false : true}" :vid="`Membership-${i}`" label="Membership No." :readonly="readonly" />
                </div>
                <div class="col-sm-4">
                    <InputText  v-model="item.C_Institute" :rules="{required: notRequired ? false : true}" :vid="`MembershipInstitution-${i}`" label="Name of Institution" :readonly="readonly" />
                </div>
                <div class="col-sm-2">
                    <YearSelect label="Year Admitted" :rules="{required: notRequired ? false : true}" :vid="`MembershipYear-${i}`" v-model="item.C_MembershipYear" :readonly="readonly"/>
                </div>
                <div class="col-sm-3">
                    <FormSelect label="Membership Type"  v-model="item.C_MembershipType_AFM" :disabled="readonly" :vid="`MembershipType-${i}`" :items="membershipTypes" item-value="id" item-name="label" />
                </div>
            </FormRow>
            <h6>Contact Detail</h6>
            <FormRow>
                <div class="col-sm-4">
                    <InputText v-model="item.C_ContactName" :rules="{required: notRequired ? false : true}" :vid="`MembershipContact-${i}`" label="Contact Person / Department" :readonly="readonly" />
                </div>
                <div class="col-sm-4">
                    <InputTel label="Phone" v-model="item.C_ContactPhone" vid="Current-Member-phone-number" :disabled="readonly" />
                </div>
                <div class="col-sm-4">
                    <AddressInput label="Address" v-model="item.C_Address_id" :readonly="readonly" />
                </div>
            </FormRow>
        </RecordItem>
    </div>
</template>

<script>

    import recordMixin from 'Mixins/recordMixin'
    import InputTel from 'Components/form/InputTel'
    import AddressInput from 'Components/form/addressInput/AddressInput'

    export default {
        data() {
            return {
                membershipTypes: [
                    {
                        label: 'Associate',
                        id: 'A'
                    },
                    {
                        label: 'Fellow',
                        id: 'A'
                    },
                    {
                        label: 'Member',
                        id: 'A'
                    },
                ]
            }
        },
        name: "CurrentMembershipRecords",
        mixins: [recordMixin],
        props:{
            readonly: Boolean,
            notRequired: {
                type: Boolean,
                default: false,
            }
        },
        components: {
            InputTel,
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
            pushEmptyValue() {
                this.value.push({
                    "PQRecord_id": null,
                    "pq_id": this.pqId,
                    "RecordType": "CMemb",
                    "C_MembershipNumber": "",
                    "C_Institute": "",
                    "C_MembershipYear": "",
                    "C_MembershipType_AFM": "",
                    "C_ContactName": "",
                    "C_ContactPhone": "",
                    "C_Address_id": null
                })
            }
        }
    }
</script>
