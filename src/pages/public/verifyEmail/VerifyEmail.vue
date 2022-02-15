<template>
    <FormRow>
        <Loader v-if="isLoading" />
        <SideLogo></SideLogo>
        <centerBlock>
            <p>Verifying Email. Please Wait ...</p>
        </centerBlock>
    </FormRow>
</template>
<script>
    import { VerifyEmail } from './verifyEmailActions';
    import SideLogo from "Components/layout/public/SideLogo/SideLogo";
    import loadingMixin from 'Mixins/loadingMixin';
    import Loader from 'Components/layout/Loader';
    import Ajax from 'Utils/ajax'
    import Auth from 'Utils/auth'

    export default {
        name: 'verifyEmail',
        mixins: [loadingMixin],
        components:{
            Loader,
            SideLogo
        },
        data(){
            return{
                id:'',
                token:'',
                code:''
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
            this.code = this.$route.query.code;
            this.verifyEmail();

            if(this.userData !== null){
                Auth.logoutUser();
                Ajax.removeToken();
                this.$router.go();
            }
        },
        methods:{
            verifyEmail(){
                this.showLoader();
                const {id,token,code} = this;
                VerifyEmail({id,code},token)
                    .then(this.handleSuccess)
                    .catch(this.handleError);
            },
            handleSuccess(response){
                localStorage.setItem("setPasswordId",response.data.id);
                this.$router.push({'path':'/createPassword'})
            },
            handleError(err){
                this.hideLoader();
                this.$router.push('/login');
            }
        }
    }
</script>