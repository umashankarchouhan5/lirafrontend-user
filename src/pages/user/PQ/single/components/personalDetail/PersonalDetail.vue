<template>
    <div>
        <FormRow>
            <div class="col-sm-2">
                <Salutation
                    label="Title"
                    rules="required"
                    :disabled="readonly"
                    v-model="value.data.Salutation" />
            </div>
            <div class="col-sm-5">
                <InputText label="First Name" rules="required" :readonly="readonly" v-model="value.data.Fname" />
            </div>
            <div class="col-sm-5">
                <InputText label="Last Name" rules="required" :readonly="readonly" v-model="value.data.Lname" />
            </div>
        </FormRow>

        <FormRow>
            <div class="col-sm-12">
                <InputText :readonly="readonly" rules="required"  label="Other names that you are/ have been known by (including name at birth, previous married names, aliases). Indicate reason for change i.e. marriage, adoption by common usage, etc" name="Other Names" v-model="value.data.OldNames" />
            </div>
        </FormRow>

        <FormRow>
            <div class="col-sm-3">
                <FormSelect
                        v-model="value.data.gender"
                        label="Gender"
                        item-value="id"
                        item-name="label"
                        rules="required"
                        :disabled="readonly"
                        :items="[{ id: 'M', label: 'Male'}, { id: 'F', label: 'Female'}]" />
            </div>
            <div class="col-sm-3">
                <InputDate :readonly="readonly" label="Date of Birth" rules="required" format="formatDateWithSlash" v-model="value.data.DOB" />
            </div>
            <div class="col-sm-3">
                <InputText :readonly="readonly" label="Place of Birth" rules="required" v-model="value.data.PlaceOfBirth" />
            </div>
            <div class="col-sm-3">
                <FormSelect
                        :items="countries"
                        item-name="Name"
                        item-value="id"
                        :disabled="readonly"
                        rules="required"
                        label="Country of Permanent Residence"
                        v-model="value.data.CountryofPR" />
            </div>
        </FormRow>

        <FormRow>
            <div class="col-sm-3">
                <InputText label="Registered Email ID" readonly rules="required|email" v-model="value.data.Email" />
            </div>
            <div class="col-sm-3">
                <InputText label="Email ID (Secondary)" :readonly="readonly" rules="required|email" v-model="value.data.Email2" />
            </div>
            <div class="col-sm-6">
                <AddressInput label="Address" vid="Address-main" rules="required" name="Address" :readonly="readonly" v-model="value.data.Address_id" />
            </div>
        </FormRow>

        <FormRow>
            <div class="col-sm-4">
                <InputTel label="Phone No. Primary" rules="required" :readonly="readonly" v-model="value.data.Mobile" />
            </div>
            <div class="col-sm-4">
                <InputTel label="Phone No. Secondary" :readonly="readonly" v-model="value.data.Mobile2" />
            </div>
            <div class="col-sm-4">
                <InputTel label="Fax No." v-model="value.data.Fax" vid="PQ-personal-fax-number" :readonly="readonly" placeholder="Enter a fax number" />
            </div>
        </FormRow>

        <NationalityRecords v-if="value.records.Natnl" :readonly="readonly" v-model="value.records.Natnl" :pqId="value.data.id" />

        <PassportRecords v-model="value.records.Psprt" :readonly="readonly" :pqId="value.data.id" />

        <p>Beginning with your current residential address, list below all addresses during the last 5 years with relevant dates.</p>

        <AddressRecords v-model="value.records.Addrs" :readonly="readonly" :pqId="value.data.id" />

        <FormRow>
            <div class="col-sm-12">
                <div :class="$style.exposed">
                    <div :class="$style.exposedLabel">Political Exposed Person</div>
                    <FormCheckbox v-model="value.data.isPoliticallyExposed" :disabled="readonly" :true-value="1" :false-value="0">Yes</FormCheckbox>
                    <FormCheckbox v-model="value.data.isPoliticallyExposed" :disabled="readonly" :true-value="0" :false-value="1">No</FormCheckbox>
                </div>
            </div>
        </FormRow>
    </div>
</template>

<script>

    import AddressRecords from './AddressRecords'
    import PassportRecords from './PassportRecords'
    import NationalityRecords from './NationalityRecords'
    import InputDate from 'Components/form/InputDate';
    import InputTel from 'Components/form/InputTel';
    import AddressInput from 'Components/form/addressInput/AddressInput';
    import Salutation from "Components/layout/salutation";

    export default {
        name: "PersonalDetail",
        props: ['value', 'stepId','readonly'],
        computed: {
            countries() {
                return this.$store.state.common.countries;
            },
        },
        watch:{
            'value.data.isPoliticallyExposed': function (val) {
                if(this.value.data.isPoliticallyExposed === null){
                    this.value.data.isPoliticallyExposed = 0;
                }                
            }, 
            'value.records.Nantl': function (val) {
                return val;
            }
        }, 
        components: {
            AddressInput,
            InputTel,
            InputDate,
            AddressRecords,
            PassportRecords,
            NationalityRecords,
            Salutation
        },
    }
</script>

<style lang="scss" module>

    .exposed {
        display: flex;
    }

    .exposedLabel {
        font-weight: 700;
        margin-right: 20px;
    }

</style>
