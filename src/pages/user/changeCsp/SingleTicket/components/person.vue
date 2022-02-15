<template>
    <div >
        <div v-if="!showAdd">
            <FormRow>
                <div class="col-sm-4">
                    <InputText label="Passport Number" :rules="passportValidation" readonly  v-model="value.passportNumber"     />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-2">
                    <Salutation :rules="validationRule" disabled v-model="value.Salutation" />
                </div>
                <div class="col-sm-5">
                    <InputText label="First Name" :rules="validationRule" readonly v-model="value.Fname" />
                </div>
                <div class="col-sm-5">
                    <InputText label="Last Name" :rules="validationRule" readonly v-model="value.Lname" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <AddressInput label="Business Address" :rules="validationRule" readonly v-model="value.BusinessAddress_id" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-12">
                    <AddressInput label="Residential Address" :rules="validationRule" readonly v-model="value.ResAddress_id" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-4">
                    <InputTel label="Mobile" :rules="validationRule" disabled v-model="value.Mobile" />
                </div>
                <div class="col-sm-4">
                    <InputText label="Email ID" :rules="emailValidation" readonly v-model="value.Email" />
                </div>
                <div class="col-sm-4">
                    <InputTel label="Fax"  disabled v-model="value.Fax" />
                </div>
            </FormRow>
            <FormRow>
                <div class="col-sm-4">
                    <InputText label="Occupation" :rules="validationRule" readonly v-model="value.Occupation" />
                </div>
                <div class="col-sm-4">
                    <InputText v-model="value.Nationality" :rules="validationRule" readonly label="Nationality" />
                </div>
            </FormRow>
        </div>


        <div v-else>
            <ValidationObserver tag="div" ref="Person" v-slot="{ passes }">
                <FormRow>
                    
                    <div class="col-sm-4">
                        <InputText label="Passport Number" rules="required|alphaNumCustom" :readonly="readonly"  v-model="addPersonData.passportNumber" @keyup.native="getPassportByEnter" @focusout="getPassportByTab"    />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-2">
                        <Salutation rules="required" :disabled="readonly" v-model="addPersonData.Salutation" />
                    </div>
                    <div class="col-sm-5">
                        <InputText label="First Name" rules="required" :readonly="readonly" v-model="addPersonData.Fname" />
                    </div>
                    <div class="col-sm-5">
                        <InputText label="Last Name" rules="required" :readonly="readonly" v-model="addPersonData.Lname" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-12">
                        <AddressInput label="Business Address" rules="required" :readonly="readonly" v-model="addPersonData.BusinessAddress_id" />

                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-8">
                        <AddressInput label="Residential Address" rules="required" :readonly="readonly" v-model="addPersonData.ResAddress_id" />
                        
                    </div>
                    <div class="col-sm-4 align-items-center d-flex">
                        <div>
                            <input type="checkbox" name="ResidentialCheckbox" v-model="addPersonData.isResidentialChecked"  >
                            <label for="">same as above?</label>
                        </div>
                        </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-4">
                        <InputTel label="Mobile" rules="required" :disabled="readonly" v-model="addPersonData.Mobile" />
                    </div>
                    <div class="col-sm-4">
                        <InputText label="Email ID" rules="required|email" :readonly="readonly" v-model="addPersonData.Email" />
                    </div>
                    <div class="col-sm-4">
                        <InputTel label="Fax"  :disabled="readonly"  v-model="addPersonData.Fax" />
                    </div>
                </FormRow>
                <FormRow>
                    <div class="col-sm-4">
                        <InputText label="Occupation" rules="required" :readonly="readonly" v-model="addPersonData.Occupation" />
                    </div>
                    <div class="col-sm-4">
                        <InputText v-model="addPersonData.Nationality" rules="required" :readonly="readonly" label="Nationality" />
                    </div>
                </FormRow>
                <ButtonGroup>
                    <FormButton v-if="showAdd" type="success" @click="passes(addPerson)" left-icon="ios-arrow-forward">Add</FormButton>
                    <FormButton v-if="showAdd" type="primary" @click="addBox(false)" left-icon="md-checkmark-circle-outline">Cancel</FormButton>
                
                </ButtonGroup>
            </ValidationObserver>
        </div>
        <h4 v-if="!showAdd && !readonly">You may change the contact person to an existing person associated with your License or add a new person</h4>
        <br/>
        <div :class="$style.indentClass" >
            <FormRow v-if="!showAdd && !readonly">
                <div class="col-sm-4">
                    <p>Select from  existing persons :</p>
                </div>
                <div class="col-sm-4">
                    <FormSelect 
                        item-value="pq_id"
                        item-name="NameWithPQ" 
                        :items="selectPersonData"
                        :clearable="false"
                        :onSelect="onSelectPerson" :disabled="readonly" v-model="personSelection" 
                        label="Select Person"
                    />
                </div>
                
            </FormRow>
            <FormRow v-if="!showAdd && !readonly">
                <div class="col-sm-4">
                    <p>Add a new person / Enter Passport number :</p>
                </div>
                <ButtonGroup>
                    <FormButton  type="primary" @click="addBox(true)" left-icon="ios-arrow-plus">Add Person</FormButton>
                </ButtonGroup>
            </FormRow>
        </div>
        <br />
    </div>
</template>

<script>

    import AddressInput from 'Components/form/addressInput/AddressInput';
    import InputTel from 'Components/form/InputTel';
    import Salutation from "Components/layout/salutation";
    import { addUpdatePerson,getPersonDetails } from '../api';
    import { ValidationObserver } from "vee-validate";

    export default {
        name: "Person",
        components: {
            AddressInput,
            InputTel,
            Salutation,
            ValidationObserver
        },
        data() {
            return {
                isModalVisible: false,
                isLoading: false,
                addressToEdit: null,
                addressToEditId: null,
                persons: [],
                personSelection:'',
                showAdd: false,
                addPersonData:{
                    BusinessAddress_id: null,
                    Email: '',
                    Fax: '',
                    Fname: '',
                    Lname: '',
                    Mobile: '',
                    Nationality: '',
                    ResAddress_id: null,
                    isResidentialChecked:false,
                    Salutation: '',
                    id: '',
                    Occupation: '',
                    passportNumber: '',
                }
            }
        },
        props: {
            value: [Object,Array],
            readonly: Boolean,
            validationRule: String,
            selectPersonData: Array
        },
        computed: {
            emailValidation(){
                return this.validationRule ? this.validationRule + '|email' : ''
            },
            passportValidation(){
                return this.validationRule ? this.validationRule + '|alphaNumCustom' : ''
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
                        id: null,
                        Occupation: "",
                        passportNumber: "",
                        person_id: "",
                        persontype: "",
                        residenceCountry_id: "",
                    }
                return valueToAdd;
            }
        },
        watch:{
            value(val){
                if (this.value.id === undefined) {
                    this.value = Object.assign(this.value,this.addData)
                }
            },
            personSelection(val){
                this.onSelectPerson(val);
            }
        },
        created(){
        },
        methods: {
            addBox(val){
                this.showAdd = val;
            },
            addPerson(){
                this.getDataToSend().then(
                            res =>{
                                addUpdatePerson(res).then(
                                    response =>{
                                        this.value = Object.assign(this.value,this.addPersonData);
                                        this.value.id = response.data[0].person_id;
                                        this.showAdd = false;
                                        
                                    }
                                )
                            }
                )
            },
            async getDataToSend(){
                const {
                        BusinessAddress_id,
                        Email,
                        Fax,
                        Fname,
                        Lname,
                        Mobile,
                        Nationality,
                        ResAddress_id,
                        Salutation,
                        id,
                        Occupation,
                        passportNumber,
                    } = this.addPersonData;
                const data = {
                        businessaddress_id: BusinessAddress_id,
                        email: Email,
                        fax: Fax,
                        fname: Fname,
                        lname: Lname,
                        mobile: Mobile,
                        nationality: Nationality,
                        resaddress_id: ResAddress_id,
                        salutation: Salutation,
                        id: id,
                        occupation: Occupation,
                        passportnumber: passportNumber,
                    }
                return data;
            },
            getPassportByEnter(event){
                if(event.keyCode === 13 || event.keyCode === 9){
                    this.getPassport(this.addPersonData.passportNumber);
                }
            },
            getPassportByTab(){
                this.getPassport(this.addPersonData.passportNumber)
            },
            getPassport(data){
                getPersonDetails({
                    passportnumber: data
                }).then(
                    res => {
                        if(res.data[0]){
                            var data = res.data[0]
                            this.addPersonData.Salutation = data.Salutation;
                            this.addPersonData.Fname = data.Fname;
                            this.addPersonData.Lname = data.Lname;
                            this.addPersonData.BusinessAddress_id = data.BusinessAddress_id;
                            this.addPersonData.ResAddress_id = data.ResAddress_id;
                            this.addPersonData.Mobile = data.Mobile;
                            this.addPersonData.Fax = data.Fax;
                            this.addPersonData.Email = data.Email;
                            this.addPersonData.passportNumber = data.passportNumber;
                            this.addPersonData.Nationality = data.Nationality;
                            this.addPersonData.Occupation = data.Occupation;
                            this.addPersonData.id = data.id;
                        }
                    }
                )
            },
            onSelectPerson(data){
                // this.value.Lname 
                var person = this.selectPersonData.find( item => {
                    return item.pq_id == data;
                })
                this.value.Fname = person.Fname;
                this.value.Lname = person.Lname;
                this.value.passportNumber = person.passportNumber;
                this.value.id = person.id;
                this.value.Fax = person.Fax !== null ? person.Fax : '';
                this.value.Email = person.Email;
                this.value.BusinessAddress_id = person.BusinessAddress_id;
                this.value.Salutation = person.Salutation;
                this.value.Nationality = person.Nationality;
                this.value.Occupation = person.occupation;
                this.value.ResAddress_id = person.ResAddress_id;
                this.value.Mobile = person.Mobile !== null ? person.Mobile : '';
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

<style lang="scss" module>
    .indentClass{
        margin-left: 30px;
    }

</style>