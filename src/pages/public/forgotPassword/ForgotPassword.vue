<template>
    <div>
        <PageTitle title="Forgot Password"/>
        <FormRow :class="$style.formRow">
            <SideLogo></SideLogo>
            <div class="col-sm-9">
                <div :class="$style.form">
                    <h3>
                        Please enter the email  address you provided when you registered your login, and we'll email you your username and a link to reset the password. 
                    </h3>
                        
                    <h3>
                        If you still cannot access site after receiving  your username and reset link, then please contact customer support.
                    </h3>
                    <div :class="$style.clearFix"></div>
                    <ValidationObserver ref="observer" tag="div" v-slot="{ passes }">
                        <FormRow>
                            <div class="col-sm-6">
                                <InputText label="Registered Email ID" v-model="email" rules="required|email"/>
                            </div>
                        </FormRow>
                        <Recaptcha :class="$style.recaptchaCenter"></Recaptcha>
                        <div :class="$style.button">
                            <FormButton type="info" @click="passes(submitEmail)">Submit</FormButton>
                        </div>
                    </ValidationObserver>
                    
                </div>
            </div>
            <Popup :value="isPopupVisible" title="Success" type="success">
                {{ message }}
                <FormButton slot="footer" @click="closePopup">Ok</FormButton>
            </Popup>
        </FormRow>
    </div>
</template>

<script>

    import PageTitle from "Components/layout/PageTitle";
    import SideLogo from "Components/layout/public/SideLogo/SideLogo";
    import { ValidationObserver } from "vee-validate";
    import { ForgotPassword } from "./ForgotPassword";
    import Recaptcha from "Components/recaptcha/Recaptcha";
    import Ajax from 'Utils/ajax'
    import Auth from 'Utils/auth'
    
    export default {
        name: "ForgotPassword",
        
        components: {
            PageTitle,
            SideLogo,
            ValidationObserver,
            Recaptcha,
        },

        data(){
            return{
                email: "",
                isPopupVisible: false,   
                message:'',
            }
        },
        computed: {
            
            userData() {
                return this.$store.state.user.user;
            },
        },
        created(){
            if(this.userData !== null){
                Auth.logoutUser();
                Ajax.removeToken();
                this.$router.go();
            }
        },
        methods:{
            submitEmail(){
                const { email } = this;
                ForgotPassword({ email,recaptchaToken:this.$store.state.common.recaptchaToken })
                    .then(this.handleSuccess)
                    .catch(this.handleError);
            },
            handleSuccess(response){
                this.message = "We've sent Verifying email to your email.";
                this.isPopupVisible = true;
            },
            closePopup() {
                this.resetValues();
                this.isPopupVisible = false;
                this.$router.push({'path':'login'});
            },
            resetValues() {
                this.old_password = '';
                this.new_password = '';
                this.message = '';
            },
        }
        
    };
</script>

<style lang="scss" module>
    
    .form {
        margin-top: 100px;
        h3{
            margin: 0px 0px 20px;
            font-weight: 400;
            color: #000000;
            font-size: 14px;
            line-height: 20px;
        }
    }
    .recaptchaCenter{
        display: flex;
        justify-content: flex-start;
        margin-bottom: 10px;
        padding: 0px 10px ;
        & iframe{
            transform: scale(0.98);
        }
        & #rc-anchor-container{
            transform: scale(0.94);
        }
    }
    
    .button {
        padding-top: 20px;
    }
    .clearFix{
        clear: both;
        padding: 30px;
    }
</style>
