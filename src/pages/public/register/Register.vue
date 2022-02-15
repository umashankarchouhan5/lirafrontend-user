<template>
    <ValidationObserver ref="observer" v-slot="{ passes }">

        <PageTitle title="New User Registration" slot="title" :link="`/helpPublicPage/51`"/>
        <FormRow>
            <SideLogo></SideLogo>
            <div class="col-sm-9">
                <div :class="$style.register" >
                    <h4>Welcome to the user registration page of the FSA. Please create your account by registering your details below. By creating an account, you shall be able to submit licence applications with the FSA. For additional information on the types of licences that can be applied for, please click here. </h4>

                    <FormRow>
                        <div class="col-sm-2">
                            <!-- <FormSelect
                                    :items="['Mr', 'Mrs','Dr']"
                                    label="Title"
                                    v-model="form.salutation" /> -->
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
                        <div class="col-sm-9">
                            <InputText v-model="form.company"
                                    label="Company Name"
                                    :disabled="form.NA"
                                    :rules="!form.NA ? 'required' : ''" />
                        </div>
                        <div class="col-sm-3">
                            <FormCheckbox v-model="form.NA" :class="$style.na" :disabled="showPurposeMessage.isVisible">
                                Not Applicable
                            </FormCheckbox>
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
                        <!-- <div class="col-sm-6">
                            <InputTel  v-model="form.MobileValidated"
                                        label="Confirm Mobile Number"
                                        rules="required|confirmed:Mobile" />
                        </div> -->
                    </FormRow>

                    <FormRow>
                        <div class="col-sm-6">
                            <InputText label="Email ID"
                                    vid="email"
                                    v-model="form.email"
                                    rules="required|email" />
                        </div>
                        <div class="col-sm-6">
                            <InputText label="Confirm Your Email ID"
                                    v-model="form.emailValidated"
                                    rules="required|email|confirmed:email" />
                        </div>
                    </FormRow>

                    <FormRow>
                        <div class="col-sm-6">
                            <InputText label="Address Line 1"
                                    v-model="form.Address1"
                                    rules="required"/>
                        </div>
                        <div class="col-sm-6">
                            <InputText label="Address Line 2"
                                    v-model="form.Address2" />
                        </div>
                    </FormRow>

                    <FormRow>
                        <div class="col-sm-4">
                            <InputText label="City"
                                    v-model="form.City"
                                    rules="required" />
                        </div>
                        <div class="col-sm-4">
                            <InputText label="State"
                                    v-model="form.State"
                                     />
                        </div>
                        <div class="col-sm-4">
                            <InputText label="Zip"
                                    v-model.number="form.Zip" />
                        </div>
                    </FormRow>
                    <FormRow>
                        <div class="col-sm-6">
                            <FormSelect v-model="form.Country_id"
                                :items="countriesList"
                                item-value="id"
                                item-name="Name"
                                label="Select Country"
                                rules="required" />
                        </div>
                    </FormRow>

                    <FormRow v-if="!sso ||  sso == 0 || sso == null">
                        <div class="col-sm-6">
                            <FormSelect v-model="form.regPurpose_id"
                                :items="signUpPurposes"
                                item-value="id"
                                item-name="DisplayName"
                                label="Select Purpose"
                                rules="required"
                                :clearable="false"
                            />
                        </div>
                        <div class="col-sm-6" v-if="form.regPurpose_id !== null && externalCategories.length > 0">
                            <FormSelect v-model="form.externalUserCategory_id"
                                        :items="externalCategories"
                                        item-value="id"
                                        item-name="DisplayName"
                                        label="Please Choose"
                                        rules="required" />
                            <!-- <div :class="$style.showPurposeMessage" v-if="showPurposeMessage.isVisible">{{showPurposeMessage.message}}</div> -->
                        </div>
                    </FormRow>

                    <!-- <FormRow>
                        <div class="col-sm-12">
                            <InputTextArea label="Tell us Briefly About Yourself" v-model="form.BriefProfile" rows="3" maxlength="250" />
                        </div>
                    </FormRow> -->
                    <div :class="$style.agreement">
                        <FormCheckbox
                                :rules="{ required: { allowFalse: false } }"
                                name="register_accept_terms"
                                v-model="form.isTermAccepted">
                            <span>I agree to the</span> 
                            <a @click="terms.success.isVisible = true">
                            Terms and Conditions
                            </a>
                        </FormCheckbox>
                    </div>
                    <Recaptcha :class="$style.recaptchaCenter"></Recaptcha>

                    <div :class="$style.button">
                        <FormButton type="info" @click="passes(formSubmit)">Sign Up</FormButton>
                    </div>

                    <div :class="$style.account">
                        Already have an Account? <router-link to="/login">Click here to Login</router-link>
                    </div>
                    <div :class="$style.clearFix"></div>
                </div>

                <!-- <div v-else>
                    <div>
                        <div :class="$style.registerSuccess">
                            <img src="../../../assets/images/successfull.png" alt="Successfull" />
                            <div>
                                <h4>An email has been sent to your registered email address. Please click on the verification link included in the email to activate your account. In case you haven't received the email, request you to check the spam folder.</h4>
                            </div>
                        </div>
                    </div>
                </div> -->
            </div>
        </FormRow>

        <TermsAndCondition v-model="terms"></TermsAndCondition> 

        <Popup :value="emailSent" title="Sign Up Successful!" type="success" :mask-closable="false" :closable="false">
             <div :class="$style.registerSuccess">
                <!-- <img src="../../../assets/images/successfull.png" alt="Successfull" /> -->
                <div>
                    <h4>Thank you for registering on the FSA platform.</h4>
                    <h4>An email has been sent to your registered email address.  Please verify your email to complete the registration process.</h4>
                </div>
            </div>
            <FormButton slot="footer" @click="gotoLogin()" >Goto Login</FormButton>
        </Popup>

        <Popup :value="otp.isModalVisible" title="Sign Up Successful!" type="success">
            <div :class="$style.otpModal">
                <p>One Time Password has been sent to your number,  please enter the same here to login. Valid for 10 minutes.</p>
                <span class="text-danger" v-if="resentOTP && !invalidOTP">
                <span  class="invalid-feedback">An OTP has been resent to your mobile number.</span>
            </span>
                <InputText v-model="MobileOTP" label="Enter OTP here." maxlength="4" minlength="4" />
            </div>
            <div :class="$style.otpModalFooter" slot="footer">
                <FormButton type="success" @click="verifyOTP">Submit</FormButton>
                <p>Didn't receive the OTP?  <a @click.prevent="resendOTP">Resend OTP</a> </p>
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
    import { fetchSignUpPurposes, createUser, verifyOTPRequest, resendOTPRequest, deleteUserFromSignUp, fetchExternalCategoryByRegPurpos, checkSso } from "./registerActions";
    import { ValidationObserver } from "vee-validate";
    import SideLogo from "Components/layout/public/SideLogo/SideLogo";
    import Recaptcha from "Components/recaptcha/Recaptcha";
    import TermsAndCondition from "Components/modal/TermsAndCondition";
    import loadingMixin from 'Mixins/loadingMixin';
    import Ajax from 'Utils/ajax'
    import Auth from 'Utils/auth'

    export default {
        name: "Register",
        mixins: [countriesMixin,loadingMixin],
        components: {
            PageTitle,
            InputTel,
            ValidationObserver,
            SideLogo,
            Recaptcha,
            Salutation,
            TermsAndCondition
        },
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
                    emailValidated: '',
                    isTermAccepted: false,
                    regPurpose_id: null,
                    externalUserCategory_id: '',
                    NA: false,
                    Address1:'',
                    Address2: '',
                    City: '',
                    State: '',
                    Zip: '',
                    Country_id: '',
                    Countries: '',
                    RegistrationPurposes: '',
                    onSubmitError: false,
                    recaptchaToken: '',
                },
                externalCategories: [],
                warningModal: {
                    visible: false,
                    title: '',
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
                },
                companyRequiredArray: [ 10, 162, 165, 167, 168, 170, 171, 172, 173, 176, 177, 178, 180, 181, 182, 184, 186, 188, 189, 190, 191, 192, 193, ],
                sso: null
            }
        },
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
            if(this.userData !== null){
                Auth.logoutUser();
                Ajax.removeToken();
                this.$router.go();
            }
            checkSso().then(
                res => {
                    this.sso = res.data
                }
            )
        },
        watch:{
            'form.regPurpose_id': function(val){
                if(val !== null && val !== undefined){
                    this.externalCategories = [];
                    this.form.externalUserCategory_id = null;
                    this.fetchExternal();
                }
                else{
                    this.form.externalUserCategory_id = null;
                }
            },
            'form.externalUserCategory_id': function(val){
                if(this.companyRequiredArray.indexOf(val) !== -1){
                    this.form.NA = false;
                    this.showPurposeMessage.isVisible = true;
                    this.showPurposeMessage.message = 'Company Name must be filled for this purpose.'
                }
                else{
                    this.showPurposeMessage.isVisible = false;
                }
            }
        },
        methods: {
            gotoLogin(){
                this.emailSent = false;
                setTimeout(() => {
                    this.$router.push('/login')
                },200)
            },
            resetForm() {
                this.form = {
                    id: '',
                    Fname: '',
                    Lname: '',
                    salutation: '',
                    company: '',
                    Address_id: '',
                    Mobile: '',
                    email: '',
                    emailValidated: '',
                    isTermAccepted: false,
                    regPurpose_id: null,
                    externalUserCategory_id: '',
                    NA: false,
                    Address1:'',
                    Address2: '',
                    City: '',
                    State: '',
                    Zip: '',
                    Country_id: '',
                    Countries: '',
                    RegistrationPurposes: '',
                    onSubmitError: false,
                    recaptchaToken: '',
                }
            },
            fetchExternal(){
                this.showLoader();
                fetchExternalCategoryByRegPurpos({regPurpose_id: this.form.regPurpose_id}).then(
                    res => {
                        this.externalCategories = res.data;
                        this.hideLoader();
                    }
                )
            },
            formSubmit() {
                this.form.recaptchaToken = this.$store.state.common.recaptchaToken
                createUser(this.form).then(this.handleResponse)
            },
            handleResponse(response) {
                let data = response;
                if(+data.code === 201){
                    this.id = data.user.id;
                    this.Address_id = data.address.id;
                    if(data.otp == true){
                        this.otp.isModalVisible = true;
                    }else{
                        this.emailSent = true;
                        this.resetForm();
                    }
                    // 
                    this.userCreated = true;
                    // setTimeout( () => this.refresh(), 600000 );
                } else if ( data.code === 409 ){
                    this.msgContent = data.message;
                    //const options = { title: "Duplicate Data", size: 'sm'}
                    //loader.hide();
                } else if ( data.code === 500 ) {
                    //this.msgContent = data.message;
                    //const options = {title: "Invalid Data", size: 'sm'}
                }
            },
            verifyOTP(){
                const data = { id: this.id, otp: this.MobileOTP };
                verifyOTPRequest(data)
                    .then(res => {
                        if(+res.code === 201){
                            this.emailSent = true;
                            this.otp.isModalVisible = false;
                        }else if( +res.code === 409 ){
                            this.OTPvalidation = true;
                            this.invalidOTP = true;
                        }
                        else if ( ++res.code === 400 ){
                            //this.msgContent = data.message;
                            //const options = {title: "Limit Exceeded", size: 'sm'}
                            //this.$dialogs.alert(this.msgContent, options).then(res => {window.location.href = '/';})
                        }
                        else if( +res.code === 401 ){
                            /*this.dismissModal();
                            loader.hide();
                            this.msgContent = data.message;
                            const options = {title: "Session expired", size: 'sm'}
                            this.$dialogs.alert(this.msgContent, options)
                                .then(res => {
                                    window.location.href = '/';
                                })*/
                        }else if( +res.code == 500 ) {
                            /*loader.hide();
                            this.dismissModal();
                            this.msgContent = data.message;
                            const options = {title: "Invalid Data", size: 'sm'}
                            this.$dialogs.alert(this.msgContent, options)
                                .then(res => {
                                    window.location.href = '/';
                                })*/
                        }
                    })
                    .catch(e => {
                        /*this.msgContent = 'Something went wrong.';
                        const options = {title: "Catch", size: 'sm'}
                        this.$dialogs.alert(this.msgContent, options)
                        loader.hide();*/
                    })
            },
            resendOTP(){
                const data = { id: this.id };
                resendOTPRequest(data)
                    .then(res => {
                        if(+res.code === 201){
                            this.resentOTP = true;
                            // setTimeout( () => this.refresh(), 60000);
                            loader.hide();
                        }else if(+res.code === 400 ){
                            /*this.msgContent = data.message;
                            const options = {title: "Limit Exceeded", size: 'sm'}
                            this.$dialogs.alert(this.msgContent, options)
                                .then(res => {
                                    window.location.href = '/';
                                })*/
                        }
                        else if(+res.code === 401 ){
                            /*loader.hide();
                            this.msgContent = data.message;
                            const options = {title: "Session expired", size: 'sm'}
                            this.$dialogs.alert(this.msgContent, options)
                                .then(res => {
                                    window.location.href = '/';
                                })*/
                        }else if(+res.code === 500 ) {
                           /* this.dismissModal();
                            loader.hide();
                            this.msgContent = data.message;
                            const options = {title: "Invalid Data", size: 'sm'}
                            this.$dialogs.alert(this.msgContent, options)*/
                        }
                    })
                    .catch(e => {
                        /*this.msgContent = 'Something went wrong.';
                        const options = {title: "Catch", size: 'sm'}
                        this.$dialogs.alert(this.msgContent, options)
                        loader.hide();*/
                    })
            },
            refresh(){
                const data = { id: this.id, addressId: this.Address_id }
                deleteUserFromSignUp(data)
                    .then(res => {
                        if(res.status === true){
                            /*this.msgContent = 'The OTP has expired. Register again';
                            const options = {title: "OTP timeout", size: 'sm'}
                            this.$dialogs.alert(this.msgContent, options)
                                .then(res => {
                                    window.location.href = '/';
                                })*/
                        }
                    })
                    .catch(e => {
                        /*this.msgContent = 'Something went wrong.';
                        const options = {title: "Catch", size: 'sm'}
                        this.$dialogs.alert(this.msgContent, options)
                        loader.hide();*/
                    })
            }
        }
    };
</script>

<style lang="scss" module>
    .recaptchaCenter{
        display: flex;
        justify-content: flex-start;
        margin-bottom: 20px;
        padding: 0px 7px ;
        margin-left: -10px;
        & iframe{
            transform: scale(0.98);
        }
        & #rc-anchor-container{
            transform: scale(0.94);
        }
    }
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
            // text-align: center;
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
    .otpModal {
        p {
            margin-bottom: 15px;
        }
    }
    .otpModalFooter {
        display: flex;
        align-items: center;
        p {
            margin-left: 20px
        }
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
