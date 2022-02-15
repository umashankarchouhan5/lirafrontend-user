<template>
    <ValidationObserver ref="validator">
        <CenterBlock :width="800">
            <div :class="$style.note">
                <p><strong>Note:</strong> If you have filled the PQ form before, you MUST NOT add a new form. You must Edit the previously filled form.</p>
                <p><strong>Note:</strong> If your passport is expiring in 3 months or have already expired, please do not proceed as you will not be able to fill up the form completely. Please use renewed passport number.</p>
            </div>
            <div :class="$style.search">
                <FormRow>
                    <div class="col-sm-6">
                        <InputText v-model="email" label="Email" rules="required|email" :readonly="checked" />
                    </div>
                    <div class="col-sm-4">
                        <InputText v-model="PassportNo" :max-length="20" label="Passport Number" rules="required|alphaNumCustom" :readonly="checked"  />
                    </div>
                </FormRow>
                
                <FormRow v-if="!checked">
                    <div class="col-sm-12">
                        <FormButton type="success" @click="validatePQ" left-icon="md-checkmark-circle-outline">Check</FormButton>
                    </div>
                </FormRow>
                <div v-if="checked">
                    <FormRow>
                        <div class="col-sm-2">
                            <Salutation
                                label="Title"
                                rules="required"
                                v-model="salutation" />
                        </div>
                        <div class="col-sm-5">
                            <InputText v-model="Fname" label="First Name" rules="required" />
                        </div>
                        <div class="col-sm-5">
                            <InputText v-model="Lname" label="Last Name" rules="required" />
                        </div>
                    </FormRow>
                    <FormRow>
                        <div class="col-sm-6">
                            <DateSelect :errors="errors" is-required label="Date of Birth" @onSelect="onSelectDOB" />
                        </div>
                    </FormRow>
                    <FormRow>
                        <div class="col-sm-12">
                            <FormButton type="success" @click="validateData" left-icon="md-checkmark-circle-outline">Submit</FormButton>
                        </div>
                    </FormRow>
                </div>
            </div>
        </CenterBlock>
        <Popup :value="popup.isVisible" title="Information" @close="() => popup.isVisible = false">
            <p>{{ message }}</p>
            <FormButton  slot="footer" @click="backToList" left-icon="md-arrow-round-back">Back to list</FormButton>
            <FormButton  slot="footer" @click="() => popup.isVisible = false" >Close</FormButton>
            <!-- <FormButton v-else slot="footer" type="success" @click="createNewForm" left-icon="md-checkmark-circle-outline">Add New</FormButton> -->
        </Popup>
    </ValidationObserver>
</template>

<script>

    import { checkIfPQExist, checkPQexistencebyEmail } from '../config/requests';
    import DateSelect from 'Components/dateSelect/dateSelect'
    import { ValidationObserver } from 'vee-validate'
    import Salutation from "Components/layout/salutation";

    export default {
        name: "CheckPQExist",
        components: {
            DateSelect,
            ValidationObserver,
            Salutation
        },
        data() {
            return {
                Fname: '',
                Lname: '',
                DOB: '',
                PassportNo: '',
                email: '',
                salutation: '',
                errors: [],
                message: '',
                popup: {
                    isVisible: false,
                },
                exist: false,
                checked: false,
            }
        },
        methods: {
            validatePQ(){
                this.$refs.validator.validate().then((res) => {
                    if (res) {
                        const data = {
                            Fname: this.Fname,
                            Lname: this.Lname,
                            DOB: this.DOB,
                            passportNo: this.PassportNo,
                            salutaion: this.salutation,
                            email: this.email
                        };
                        checkPQexistencebyEmail(data).then(
                            res => {
                                if(res.exist === false){
                                    // this.createNewForm();
                                    this.checked = true;
                                }
                                else if(res.exist === true){
                                    this.popup.isVisible = true;
                                    this.message = res.message;
                                }
                            }
                        )
                    }
                })
            },
            createNewForm() {
                this.popup.isVisible = false;
                const data = {
                    Fname: this.Fname,
                    Lname: this.Lname,
                    DOB: this.DOB,
                    PassportNo: this.PassportNo,
                    salutation: this.salutation,
                    email: this.email
                };
                this.$emit('onCreateNew', data)
            },
            onSelectDOB(date) {
                this.DOB = date;
            },
            sendRequest() {
                // const data = {
                //     Fname: this.Fname,
                //     Lname: this.Lname,
                //     DOB: this.DOB,
                //     PassportNo: this.PassportNo
                // };
                // checkIfPQExist(data).then(res => {
                //     this.exist = res.exist;
                //     if(this.exist){
                //         this.popup.isVisible = true;
                //         this.message = res.message
                //     }else{
                        // this.createNewForm();
                //     }
                // })
            },
            backToList() {
                this.popup.isVisible = false;
                this.$router.push({ path: '/pq-forms' })
            },
            validateData() {
                this.errors = [];
                if (!this.DOB) {
                    this.errors.push('dob')
                }
                this.$refs.validator.validate().then((res) => {
                    if (res && this.errors.length === 0) {
                        // this.sendRequest();
                        this.createNewForm();
                    }
                });
            }
        }
    }
</script>

<style lang="scss" module>
    .note {
        margin-bottom: 10px;
        font-size: 13px;
        p {
            margin-bottom: 5px;
        }
    }
</style>
