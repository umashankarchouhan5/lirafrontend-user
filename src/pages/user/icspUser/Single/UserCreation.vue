<template>
    <ValidationObserver ref="observer" v-slot="{ passes }">

        <PageTitle :title="$route.params.id ? 'Edit User' : 'User Creation'" slot="title" />
        <FormRow>
            <!-- <SideLogo></SideLogo> -->
            <div class="col-sm-3"></div>
            <div class="col-sm-9">
                <div :class="$style.register" v-if="!emailSent">

                    <FormRow>
                        <div class="col-sm-2">
                            <Salutation v-model="form.salutation"></Salutation>
                        </div>
                        <div class="col-sm-5">
                            <InputText label="First Name"
                                v-model="form.Fname"
                                vid="Fname"
                                rules="required" />

                        </div>
                        <div class="col-sm-5">
                            <InputText label="Last Name"
                                rules="required"
                                v-model="form.Lname" />
                        </div>
                    </FormRow>

                    <FormRow>
                        <div class="col-sm-6">
                            <InputTel v-model="form.Mobile" 
                                label="Mobile Number"
                                rules="required"
                                vid="Mobile"
                                />
                        </div>
                        <div class="col-sm-6" >
                            <InputText label="Email ID"
                                vid="email"
                                v-model="form.email"
                                :readonly="$route.params.id"
                                rules="required|email" />
                        </div>
                    </FormRow>

                    <div :class="$style.button">
                        <ButtonGroup>
                            <FormButton type="success" v-if="!$route.params.id" @click="passes(formSubmit)">Create User</FormButton>
                            <FormButton type="success" v-if="$route.params.id" @click="passes(formSubmit)">Save</FormButton>
                            <FormButton type="info"  @click="() => backToList()">Cancel</FormButton>
                        </ButtonGroup>
                    </div>
                    <div :class="$style.clearFix"></div>
                </div>

                <div v-else>
                    <div>
                        <div :class="$style.registerSuccess">
                            <img src="../../../../assets/images/successfull.png" alt="Successfull" />
                            <div>
                                <h4>An email has been sent to your registered email address. Please click on the verification link included in the email to activate your account. In case you haven't received the email, request you to check the spam folder.</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FormRow>
        <TermsAndCondition v-model="terms"></TermsAndCondition>

        <Popup :value="successModal.visible" :title="successModal.title" type="success" :closable="false" :maskable="false" @close="() => successModal.visible = false">
            <div>
                {{ successModal.message }}
            </div>
            <div slot="footer">
                <FormButton @click="() => backToList()">Back to List</FormButton>
            </div>
        </Popup>
        <Popup :value="warningModal.visible" :title="warningModal.title" type="info" @close="() => warningModal.visible = false">
            <div>
                {{ warningModal.message }}
            </div>
            <div slot="footer">
                <FormButton @click="() => warningModal.visible = false">Close</FormButton>
            </div>
        </Popup>
        
    </ValidationObserver>
    
</template>

<script>

    import PageTitle from "Components/layout/PageTitle";
    import InputTel from "Components/form/InputTel";
    import Salutation from "Components/layout/salutation";
    import countriesMixin from "Mixins/countriesMixin";
    import { fetchSignUpPurposes, createIcspWebuser, getIcspWebuserList } from "../api";
    import { ValidationObserver } from "vee-validate";
    // import SideLogo from "Components/layout/public/SideLogo/SideLogo";
    import TermsAndCondition from "Components/modal/TermsAndCondition";

    export default {
        name: "Register",
        data() {
            return {
                companyLogo: '',
                onSubmitError: false,
                form: {
                    id: '',
                    Fname: '',
                    Lname: '',
                    salutation: '',
                    company: '',
                    Address_id: '',
                    Mobile: '',
                    email: '',
                    NA: false,
                    Address1:'',
                    Address2: '',
                    City: '',
                    State: '',
                    Zip: '',
                    Country_id: '',
                    Countries: '',
                    // RegistrationPurposes: '',
                    ICSP_id: null
                },
                warningModal: {
                    visible: false,
                    title: '',
                    message: ''
                },
                successModal: {
                    visible: false,
                    title: 'Success',
                    message: ''
                },
                userCreated: false,
                emailSent: false,
                otp: {
                    isModalVisible: false,
                },
                terms: {
                    success: {
                        isVisible: false,
                        message: ''
                    }
                },
                resentOTP: false,
                invalidOTP: false,
                OTPvalidation: false,
                MobileOTP: '',
                showPurposeMessage: {
                    isVisible: false,
                    message: '',
                }
            }
        },
        mixins: [countriesMixin],
        computed: {
            signUpPurposes() {
                return this.$store.state.common.signUpPurposes;
            },
            userData() {
                return this.$store.state.user.user;
            },
        },
        created() {
            if (this.$store.state.common.signUpPurposes.length === 0) {
                fetchSignUpPurposes().then((response) => {
                    this.$store.commit('setSignUpPurposes', response.data)
                })
            }
            if(this.$route.params.id){
                this.getUserData();
            }
        },
        watch:{
        },
        components: {
            PageTitle,
            InputTel,
            ValidationObserver,
            // SideLogo,
            Salutation,
            TermsAndCondition
        },
        methods: {
            getUserData() {
                getIcspWebuserList({user_id: parseInt(this.$route.params.id)}).then(
                    res => {
                        this.form = res.data[0];
                    }
                )
            },
            formSubmit() {
                
                if(this.$route.params.id){
                    this.form.user_id = parseInt(this.$route.params.id);
                }
                this.form.company =  this.userData.company;
                this.form.Address1 = this.userData.icsp_address[0].address1;
                this.form.Address2 = this.userData.icsp_address[0].address2;
                this.form.Address_id = this.userData.icsp_address[0].address_id;
                this.form.City = this.userData.icsp_address[0].city;
                this.form.State = this.userData.icsp_address[0].state;
                this.form.Zip = this.userData.icsp_address[0].zip;
                this.form.Country_id = this.userData.icsp_address[0].country_id;
                this.form.ICSP_id = this.userData.icsp_id;
                this.form.ExternalUserCategory_id = this.userData.ExternalUserCategory_id;
                createIcspWebuser(this.form).then(this.handleResponse)
            },
            handleResponse(response) {
                let data = response;
                // if(+data.code === 201){
                    this.id = data.user.id;
                    this.Address_id = data.address.id;
                    this.userCreated = true;
                    // this.emailSent = true;
                    this.msgContent = data.message;
                    this.successModal.message = data.message;
                    this.successModal.visible = true;


                // }
            },
            backToList(){
                this.$router.push('/users');
            }
        }
    };
</script>

<style lang="scss" module>
    .registerSuccess {
        text-align: center;
        img {
            display: block;
            margin: 40px auto;
        }
        h1 {
            margin-bottom: 20px;
        }
        h4 {
            margin-bottom: 15px;
            font-weight: 400;
            font-size: 14px;
            line-height: 20px;
        }
    }

    .register {
        padding-top: 30px;
        width: 600px;
        margin: 0 auto 0 0;
        h4 {
            font-weight: 400;
            font-size: 14px;
            line-height: 20px;
            margin-bottom: 25px;
        }
    }

    .na {
        margin-top: 10px;
        display: block;
    }
    .account {
        padding-top: 12px;
    }
    .agreement {
        margin: -10px 0 30px;
    }
    .terms{
        h3{
            margin: 15px 0px;
        }
        p{
            text-align: justify;
        }
    }
    .showPurposeMessage{
        font-size: 11px;
        margin-top: 10px;
        color: #3c8dbc;
    }
    .clearFix{
        clear: both;
        padding: 30px;
    }
</style>
