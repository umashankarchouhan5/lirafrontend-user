<template>
    <div :class="$style.login">
        <div :class="$style.wrapper">
            <div :class="$style.logo">
                <img v-if="companyLogo" :src="companyLogo" alt="Company Logo"/>
            </div>
            <ValidationObserver v-slot="{ passes }">
                <form :class="$style.form" @submit.prevent="passes(login)">
                    <FormRow>
                        <InputText
                                v-model="email"
                                focused
                                label="Email Address"
                                rules="required"
                        />
                    </FormRow>
                    <FormRow>
                        <InputText
                                v-model="password"
                                label="Password"
                                rules="required"
                                type="password"
                        />
                    </FormRow>
                    <Recaptcha :class="$style.recaptchaCenter" :captchaReset="captchaReset"></Recaptcha>
                    <FormRow>
                        <div :class="$style.button">
                            <FormButton type="info" button-type="submit" size="big" :fullWidth="true" @click="passes(login)">Sign In</FormButton>
                        </div>
                    </FormRow>
                </form>
            </ValidationObserver>

            <div :class="$style.links">
                <router-link to="/register" :class="$style.new">New to FSA</router-link>
                <router-link to="/forgotPassword" :class="$style.forgot">Forgot Password?</router-link>
            </div>
            <div :class="$style.logoBottom">
                <img src="../../../assets/images/lira-logo-web.png" alt="Lira Logo"/>
            </div>
        </div>
        <Footer/>
        <Popup title="Information" :value="warningModal.visible" @close="() => showWarningModal(false)">
            {{ warningModal.message }}
            <div slot="footer">
                <FormButton v-if="warningModal.buttons.confirm" type="success" @click="confirmForceLogin">Confirm
                </FormButton>
                <FormButton v-if="warningModal.buttons.cancel" @click="() => showWarningModal(false)">Cancel
                </FormButton>
            </div>
        </Popup>
    </div>
</template>

<script>

    import { loginRequest, getLogo, logoutRequest } from "./loginActions";
    import Auth from 'Utils/auth'
    import { ValidationObserver } from 'vee-validate'
    import Ajax from 'Utils/ajax'
    import {mapMutations} from 'vuex';
    import Footer from "Components/layout/Footer";
    import Recaptcha from "Components/recaptcha/Recaptcha";

    export default {
        name: "Login",
        data() {
            return {
                email: "",
                password: "",
                errors: [],
                msgContent: "",
                isModalVisible: false,
                companyLogo: '',
                captchaReset: false,
                warningModal: {
                    visible: false,
                    message: '',
                    buttons: {
                        ok: true,
                        confirm: false,
                        cancel: false
                    }
                },
                force_login: false,
            };
        },
        components: {
            Footer,
            ValidationObserver,
            Recaptcha
        },
        computed: {
            userData() {
                return this.$store.state.user.user;
            },
        },
        created() {
            getLogo().then(res => {
                this.companyLogo = res.data;
            });
            this.logout();
        },
        // mounted() {
        //     setTimeout(() => {
        //         const speak = (msg) => {
        //             const sp = new SpeechSynthesisUtterance(msg);
        //             let voices = window.speechSynthesis.getVoices();            
        //             [sp.voice] = [voices[12]];
        //             window.speechSynthesis.speak(sp);
        //         }
        //         speak('Welcome to Lira')
        //     }, 10000)
        // } ,
        methods: {
            ...mapMutations([
                'setUser',
            ]),
            login() {
                const {email, password, force_login} = this;
                loginRequest({
                    email,
                    password,
                    force_login,
                    recaptchaToken : this.$store.state.common.recaptchaToken
                }).then(
                        res =>{this.handleSuccess(res)},
                        err =>{
                            this.captchaReset = true;
                        }
                    )
                    .catch(this.handleError);
            },
            showWarningModal(value){
                this.warningModal.visible = value;
            },
            handleSuccess(response) {
                if (typeof response.force_flag !== 'undefined' && response.force_flag==1) {
                    this.warningModal.message = response.message;
                    this.warningModal.buttons.confirm = true;
                    this.warningModal.buttons.cancel = true;
                    this.showWarningModal(true);
                } else {
                    Auth.logUser(response);
                    Ajax.setToken(Auth.getUserToken());
                    this.$store.commit('removeRecaptcha');
                    if(localStorage.savedRoute){
                        var url =  JSON.parse(localStorage.getItem('savedRoute')).url;
                        localStorage.removeItem('savedRoute')
                        this.$router.push(url)
                    }else{
                        this.$router.push({'path': '/dashboard'})
                    }
                }
            },
            confirmForceLogin(){
                this.force_login = true;
                this.login();
                this.showWarningModal(false);
            },
            logout(){
                if(localStorage.userData){
                    logoutRequest().then(
                        res => {
                            
                            if(localStorage.timeOfNewRefresh){
                                localStorage.removeItem('timeOfNewRefresh');
                            }
                            Auth.logoutUser();
                            Ajax.removeToken();

                        },
                        err => {
                            
                            if(localStorage.timeOfNewRefresh){
                                localStorage.removeItem('timeOfNewRefresh');
                            }
                            Auth.logoutUser();
                            Ajax.removeToken();
                        }
                    )
                }
                if(!localStorage.userData && this.userData !== null){
                    Auth.logoutUser();
                    Ajax.removeToken();
                }
            },
        }
    }
</script>

<style module lang="scss">
    .form {
        padding: 0 15px;
    }
    .links {
        display: flex;
        margin-top: -15px;
    }
    .new {
        color: #37a0cf;
        font-size: 14px;
    }
    .forgot {
        margin-left: auto;
        font-size: 13px;
        color: #919496;
    }
    .button {
        padding-top: 5px;
    }
    .login {
        background: #9ac2d2 url("../../../assets/images/login-bg-v1.jpg") 0 14% no-repeat;
        background-size: cover;
        height: auto;
        min-height: 100vh;
    }

    .formInput {
        margin-bottom: 20px;
    }

    .wrapper {
        width: 330px;
        background: rgba(245, 246, 249, 0.87);
        margin-left: 30px;
        padding: 20px;
        position: absolute;
        bottom: 0;
        top: 0;
        box-shadow: 0 5px 4px rgba(0, 0, 0, 0.24);
    }

    .logo {
        margin: 50px 0 35px;

        > img {
            display: block;
            margin: 0 auto;
        }
    }

    .logoBottom {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 55px;

        img {
            max-width: 90px;
            display: block;
            margin: 0 auto;
        }
    }
    .recaptchaCenter{
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        margin-bottom: 10px;
        padding: 0px 10px;
        & iframe{
            transform: scale(0.9);
        }
        & #rc-anchor-container{
            transform: scale(0.94);
        }
    }
    
</style>
