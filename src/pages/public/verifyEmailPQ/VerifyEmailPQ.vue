<template>
    <FormWrapper>
        <PageTitle title="My PQ Email Update"  slot="title" />

        <FormRow>
            <Loader v-if="isLoading" />
            <!-- <SideLogo></SideLogo> -->
            <centerBlock v-if="verifyingEmail">
                <p v-if="!notValid">Verifying. Please Wait ...</p>
                <p v-if="notValid">This is not a valid link.</p>
                <FormButton v-if="notValid" type="success" @click="goToLogin" >Go to Login</FormButton>

            </centerBlock>
            <centerBlock v-else>
                <ValidationObserver ref="validator" >
                    <p>Please enter the email address you wish to be your new primary email address.</p>
                    <InputText type="email" v-model="newEmail" rules="required|email" label="New Email Address" :readonly="readonly" />
                </ValidationObserver>
                <br />
                <FormButton type="success" @click="submitEmail" >Submit</FormButton>
            </centerBlock>
        </FormRow>
        <Popup :value="successModal.visible" title="Success" type="success" :closable="false" :mask-closable="false" @close="() => successModal.visible = false">
            <p>{{ successModal.message }}</p>
            <FormButton  slot="footer" @click="goToLogin" left-icon="md-arrow-round-back">Go to Login</FormButton>
        </Popup>
    </FormWrapper>
</template>
<script>
    import FormWrapper from 'Components/form/FormWrapper';
    import PageTitle from 'Components/layout/PageTitle';
    import { updatePqEmail, verifyEmailPQ } from './api';
    // import SideLogo from "Components/layout/public/SideLogo/SideLogo";
    import loadingMixin from 'Mixins/loadingMixin';
    import Loader from 'Components/layout/Loader';
    import Ajax from 'Utils/ajax'
    import Auth from 'Utils/auth'
    import { ValidationObserver } from 'vee-validate'

    export default {
        name: 'VerifyEmailPQ',
        mixins: [loadingMixin],
        components:{
            FormWrapper,
            PageTitle,
            Loader,
            // SideLogo,
            ValidationObserver
        },
        data(){
            return{
                id:'',
                token:'',
                time:'',
                email: '',
                verifyingEmail: true,
                newEmail: '',
                successModal: {
                    visible: false,
                    message: ''
                },
                readonly: false,
                notValid: false,
            }
        },
        computed: {
            
            userData() {
                return this.$store.state.user.user;
            },
        },
        created(){
            this.id = this.$route.query.id;
            this.token = this.$route.query.token;
            this.time = this.$route.query.time;
            this.email = this.$route.query.email;
            this.verifyEmail();

            if(this.userData !== null){
                Auth.logoutUser();
                Ajax.removeToken();
                this.$router.go();
            }
        },
        methods:{
            goToLogin() {
                this.successModal.visible = false;
                setTimeout(() => this.$router.push('/login'),200);
            },
            submitEmail() {
                this.$refs.validator.validate().then(results => {
                    if(results){
                        updatePqEmail({email: this.newEmail,pq_id: this.id}, this.token).then(
                            res => {
                                this.readonly = true;
                                this.successModal.message = "Your email has been changed successfully. Please use this same email to login to your account."
                                this.successModal.visible = true;
                            }
                        )
                    }
                })
            },
            verifyEmail(){
                this.showLoader();
                const { id,token,time,email } = this;
                verifyEmailPQ({ id, time, email },token)
                    .then(this.handleSuccess)
                    .catch(this.handleError);
            },
            handleSuccess(response){
                this.verifyingEmail = false
                this.hideLoader();
            },
            handleError(err){
                this.hideLoader();
                this.notValid = true;
                // this.$router.push('/login');
            }
        }
    }
</script>