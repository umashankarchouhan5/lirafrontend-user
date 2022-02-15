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
    import { VerifyEmailPQ } from './verifyEmailPQActions';
    import SideLogo from "Components/layout/public/SideLogo/SideLogo";
    import loadingMixin from 'Mixins/loadingMixin';
    import Loader from 'Components/layout/Loader';
    import Ajax from 'Utils/ajax'
    import Auth from 'Utils/auth'

    export default {
        name: 'VerifyEmailPQ',
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
            this.token = this.$route.query.token;
            this.email = this.$route.query.email;
            this.id = this.$route.query.id;
            this.time = this.$route.query.time;
            this.verifyEmailPQ();

            if(this.userData !== null){
                Auth.logoutUser();
                Ajax.removeToken();
                this.$router.go();
            }
        },
        methods:{
            verifyEmailPQ(){
                this.showLoader();
                const {id,token,email,time} = this;
                VerifyEmailPQ({id,email,time},token)
                    .then(this.handleSuccess)
                    .catch(this.handleError);
            },
            handleSuccess(response){
                localStorage.setItem("setPasswordId",response.data);
                this.$router.push({'path':'/createPasswordPQ'})
            },
            handleError(err){
                this.hideLoader();
                this.$router.push('/login');
            }
        }
    }
</script>