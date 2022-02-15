<template>
    <div>
        <FormRow>
            <SideLogo></SideLogo>
            <div class="col-sm-9">
                <FormWrapper>
                    <PageTitle title="Create Password" slot="title" @close="closePopup"/>
                    <CenterBlock>
                        <ValidationObserver ref="validator" tag="div">
                            <FormRow>
                                <div class="col-sm-12">
                                    <div :class="$style.listDiv">
                                        <p>Please enter and confirm the password you would like to use. Your password should meet the following criteria:</p>
                                        <ul>
                                            <li>It must be between 8 to 16 characters</li>
                                            <li>It must contain one of the following types of characters:
                                                <ol>
                                                    <li>Uppercase letter</li>
                                                    <li>Numeral</li>
                                                    <li>Non-alphanumeric characters ( $ % & ' * + , - . / ! # : [ ( &gt; = &lt; ) ] ; ? @ ^ _ ` { | } ~ )</li>
                                                </ol>
                                            </li>
                                            <li>It cannot have spaces</li>
                                        </ul>
                                    </div>
                                </div>
                            </FormRow>
                            <FormRow>
                                <div class="col-sm-6 ">
                                    <InputText type="password" label="New Password" :rules="{ required: true, regex: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!#$%&'()*+,-./:;<=>?@[\]^_`{|}~]).+$/ ,min: 8, max: 16}"  v-model="new_password" vid="password"/>
                                </div>
                            </FormRow>
                            <FormRow>
                                <div class="col-sm-6 ">
                                    <InputText type="password" label="Confirm New Password" v-model="new_password_confirm" rules="required|confirmed:password" />
                                </div>
                            </FormRow>
                        </ValidationObserver>
                        <Recaptcha :class="$style.recaptchaCenter"></Recaptcha>
                        <FormRow>
                            <div class="col-sm-6">
                                <FormButton type="success" @click="submit">Create Password</FormButton>
                            </div>
                        </FormRow>
                    </CenterBlock>
                    <Popup :value="isPopupVisible" title="Success" type="success">
                        {{ message }}
                        <FormButton slot="footer" @click="closePopup">Ok</FormButton>
                    </Popup>
                    <br>
                </FormWrapper>
            </div>
        </FormRow>
    </div>
</template>
<script>
    import SideLogo from "Components/layout/public/SideLogo/SideLogo";
    import { ValidationObserver } from "vee-validate";
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import { setPassword } from "./createPassword";
    import Recaptcha from "Components/recaptcha/Recaptcha";
    import Ajax from 'Utils/ajax'
    import Auth from 'Utils/auth'

    export default {
        name:'createPassword',
        components:{
            SideLogo,
            ValidationObserver,
            FormWrapper,
            PageTitle,
            Recaptcha,
        },
        data(){
            return{
                new_password: '',
                new_password_confirm: '',
                message: 'Password created successfully.',
                isPopupVisible: false,
                id: '',
            }
        },
        computed: {
            
            userData() {
                return this.$store.state.user.user;
            },
        },
        created(){
            this.id = localStorage.getItem('setPasswordId');
            if(this.userData !== null){
                Auth.logoutUser();
                Ajax.removeToken();
                this.$router.go();
            }
        },
        methods:{
            resetValues() {
                this.new_password = '';
                this.new_password_confirm = '',
                this.message = '';
            },
            closePopup() {
                this.resetValues();
                this.isPopupVisible = false;
                this.$router.push({'path':'login'});
            },
            async submit() {
                const result = await this.$refs.validator.validate();
                if (result) {
                    await setPassword({
                        id: this.id,
                        password: this.new_password,
                        recaptchaToken:this.$store.state.common.recaptchaToken 
                    }).then((result)=>{
                        this.message = result.message;
                        this.isPopupVisible = true;
                        localStorage.removeItem('setPasswordId')
                    });
                }
            }
        }
    }
</script>
<style lang="scss" module>
    .changePasswordText{
        text-align: justify;
        font-weight: 400;
        margin-bottom: 50px;
        font-size: 14px;
        line-height: 20px;
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
    .listDiv {
        ul {
            margin-left: 20px;
        }
        ol {
            list-style: inside;
            list-style-type: circle;
        }
    }
</style>