<template>
    <div  v-if="Array.isArray(value)">
        <div v-for="(item, i) in value" :key="i">
            <FormRow>
                <div class="col-sm-2">
                    <Salutation :rules="validationRule" :disabled="readonly" v-model="item.Salutation"    />
                </div>
                <div class="col-sm-5">
                    <InputText label="First Name" :readonly="readonly" :rules="validationRule" v-model="item.Fname"   />
                </div>
                <div class="col-sm-5">
                    <InputText label="Last Name" :readonly="readonly" :rules="validationRule" v-model="item.Lname"   />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-6">
                    <AddressInput label="Business Address" :readonly="readonly" :rules="validationRule" v-model="item.BusinessAddress_id"    />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-6">
                    <AddressInput label="Residential Address" :readonly="readonly" :rules="validationRule" v-model="item.ResAddress_id"    />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-4">
                    <InputTel label="Mobile" :rules="validationRule" :disabled="readonly" v-model="item.Mobile"    />
                </div>
                <div class="col-sm-4">
                    <InputText label="Email ID" :rules="validationRule+ '|email'" :readonly="readonly" v-model="item.Email"    />
                </div>
                <div class="col-sm-4">
                    <InputTel label="Fax"  :disabled="readonly" v-model="item.Fax"    />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-4">
                    <InputText label="Occupation" :rules="validationRule" :readonly="readonly" v-model="item.Occupation"    />
                </div>
                <div class="col-sm-4">
                    <InputText v-model="item.Nationality" :readonly="readonly" :rules="validationRule" label="Nationality"    />
                </div>
                <div class="col-sm-4">
                    <InputText label="Passport Number" :rules="validationRule" :readonly="readonly"  v-model="item.passportNumber"    />
                    
                </div>
            </FormRow>
        </div>
    </div>
    <div  v-else>
        <FormRow>
            <div class="col-sm-2">
                <FormSelect 
                    item-value="pq_id"
                    item-name="NameWithPQ" 
                    :items="persons"
                    :clearable="false"
                    :onSelect="onSelectPerson" 
                    :disabled="readonly" 
                    v-model="personSelection"
                />
            </div>
            <div class="col-sm-2">
                <Salutation :rules="validationRule" :disabled="readonly" v-model="value.Salutation" />
            </div>
            <div class="col-sm-4">
                <InputText label="First Name" :rules="validationRule" :readonly="readonly" v-model="value.Fname" />
            </div>
            <div class="col-sm-4">
                <InputText label="Last Name" :rules="validationRule" :readonly="readonly" v-model="value.Lname" />
            </div>
        </FormRow>
        <FormRow>
            <div class="col-sm-6">
                <AddressInput label="Business Address" :rules="validationRule" :readonly="readonly" v-model="value.BusinessAddress_id" />
            </div>
        </FormRow>
        <FormRow>
            <div class="col-sm-6">
                <AddressInput label="Residential Address" :rules="validationRule" :readonly="readonly || isAddressSame === true" v-model="value.ResAddress_id" />
            </div>
            <div class="col-sm-6" >
                <FormCheckbox :class="$style.marginTop10" :disabled="readonly" v-model="isAddressSame">Same as above?</FormCheckbox>
            </div>
        </FormRow>

        <FormRow>
            <div class="col-sm-4">
                <InputTel label="Mobile" :rules="validationRule" :disabled="readonly" v-model="value.Mobile" />
            </div>
            <div class="col-sm-4">
                <InputText label="Email ID" :rules="emailValidation" :readonly="readonly" v-model="value.Email" />
            </div>
            <div class="col-sm-4">
                <InputTel label="Fax"  :disabled="readonly" v-model="value.Fax" />
            </div>
        </FormRow>
        <FormRow>
            <div class="col-sm-4">
                <InputText label="Occupation" :rules="validationRule" :readonly="readonly" v-model="value.Occupation" />
            </div>
            <div class="col-sm-4">
                <InputText v-model="value.Nationality" :rules="validationRule" :readonly="readonly" label="Nationality" />
            </div>
            <div class="col-sm-4">
                <InputText label="Passport Number" :rules="validationRule" :readonly="readonly"  v-model="value.passportNumber"    />
            </div>
        </FormRow>
    </div>
</template>

<script>

    import AddressInput from 'Components/form/addressInput/AddressInput';
    import InputTel from 'Components/form/InputTel';
    import Salutation from "Components/layout/salutation";
    // import FormAutoComplete from 'Components/form/FormAutoComplete';

    export default {
        name: "Person",
        computed: {
            emailValidation(){
                return this.validationRule ? this.validationRule + '|email' : ''
            },
            userData() {
                return this.$store.state.user.user
            },
            addData(){
                let icsprequest_id = this.userData.icsp_id;
                const valueToAdd = {
                        BusinessAddress_id: null,
                        Email: "",
                        Fax: "",
                        Fname: "",
                        Lname: "",
                        Mobile: "",
                        Nationality: "",
                        PlaceOfBirth: null,
                        ResAddress_id: null,
                        Salutation: null,
                        icsprequest_id: icsprequest_id,
                        id: null,
                        Occupation: "",
                        passportNumber: "",
                        person_id: "",
                        persontype: "",
                        persontype_id: "1",
                        residenceCountry_id: "",
                    }
                return valueToAdd;
            }
        },
        data() {
            return {
                isModalVisible: false,
                isLoading: false,
                addressToEdit: null,
                addressToEditId: null,
                persons: [],
                personSelection:'',
                isAddressSame: false,
            }
        },
        props: {
            value: [Object,Array],
            readonly: Boolean,
            validationRule: String,
        },
        watch:{
            value(val){
                if (this.value.id === undefined) {
                    this.value = Object.assign(this.value,this.addData)
                }
            },
            personSelection(val){
                this.onSelectPerson(val);
            },
            'isAddressSame': function(newVal) {
                
                if( newVal === true ){
                    this.value.ResAddress_id = this.value.BusinessAddress_id;
                }else if( newVal === false ){
                    this.value.ResAddress_id = null;
                }
            },
            'value.BusinessAddress_id': function(newVal){
                if( this.value.BusinessAddress_id == this.value.ResAddress_id  && this.value.BusinessAddress_id !== null && this.value.BusinessAddress_id !== undefined){
                    this.isAddressSame = true;
                }
            }
        },
        components: {
            AddressInput,
            InputTel,
            Salutation,
        },
        created(){
            var personData = JSON.parse(localStorage.getItem('personData'));
            if(personData && personData !== null && personData.PQCount > 0){
                this.persons = JSON.parse(personData.people);
            }
            if( this.value.BusinessAddress_id == this.value.ResAddress_id  && this.value.BusinessAddress_id !== null  && this.value.ResAddress_id !== null && this.value.ResAddress_id !== null && this.value.BusinessAddress_id !== undefined){
                this.isAddressSame = true;
            }
        },
        methods: {
            onSelectPerson(data){
                // this.value.Lname 
                var person = this.persons.find( item => {
                    return item.pq_id == data;
                })
                this.value.Fname = person.Fname;
                this.value.Lname = person.Lname;
                this.value.passportNumber = person.PassportNumber;
                this.value.id = person.id;
                this.value.Fax = person.Fax;
                this.value.Email = person.Email;
                this.value.BusinessAddress_id = person.BusinessAddress_id;
                this.value.Salutation = person.Salutation;
                this.value.Nationality = person.Nationality;
                this.value.Occupation = person.Occupation;
                this.value.ResAddress_id = person.ResAddress_id;
                this.value.Mobile = person.Mobile;
            },
            addValue() {
                let icsprequest_id = this.userData.icsp_id;
                const valueToAdd = {
                        BusinessAddress_id: null,
                        Email: "",
                        Fax: null,
                        Fname: "",
                        Lname: "",
                        Mobile: "",
                        Nationality: "",
                        ResAddress_id: null,
                        Salutation: null,
                        icsprequest_id: icsprequest_id,
                        id: null,
                        Occupation: "",
                        passportNumber: "",
                        person_id: "",
                        persontype: "",
                        persontype_id: "1",
                        residenceCountry_id: "",
                    }
                this.value = valueToAdd
            }
        }
    }
</script>

<style lang="scss" module >
    .marginTop10 {
        margin: 10px;
    }
    .boxStyle {
        border: 2px solid #ccc;
        // box-shadow: 0px 5px 20px inset rgba(0,0,0,0.1), 0px 5px 20px rgba(0,0,0,0.1);
        padding: 15px;
    }

</style>
