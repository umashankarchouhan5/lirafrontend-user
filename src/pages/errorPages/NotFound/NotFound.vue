<template>
    <FormWrapper >
        <div :class="$style.notFoundRow">
            <div class="col-sm-6">
                
                <div :class="$style.logo">
                    <img v-if="companyLogo" :src="companyLogo" alt="Company Logo"/>
                </div>
            </div>
            <div class="col-sm-6">
                <h1>Not Found</h1>
                <br />
                <h4>Go Back to <span v-if="userData !== null">Dashboard</span><span v-else>Login</span> &nbsp; &nbsp;
                
                    <FormButton style="margin-top: 5px" type="primary" @click="goToHome" :rounded="true">
                        <Icon type="ios-home" />
                    </FormButton>
                </h4>
            </div>
        </div >
    </FormWrapper>
</template>

<script>

    import FormWrapper from 'Components/form/FormWrapper';
    import { getLogo } from "./api";

    export default {
        name: "NotFound",
        data() {
            return {
                text: '',
                companyLogo: ''
            }
        },
        components: {
            FormWrapper,
        },
        computed: {
            userData() {
                return this.$store.state.user.user
            }
        },
        created(){
            getLogo().then(res => {
                this.companyLogo = res.data;
            });
        },
        methods:{
            goToHome(){
                this.$router.push({path: this.userData === null ? '/login' : '/dashboard'});
            }
        }

    }
</script>

<style module lang="scss">
    .notFoundRow{
        // height: calc(100vh - 80px);
        display: flex;
        align-items: center;
        justify-content: center;
        width: calc(100vw - 100px);
        h1{
            text-transform: uppercase;
            letter-spacing: 2px;
        }
    }
    .logo {
        margin: 50px 0 30px;

        > img {
            display: block;
            margin: 0 auto;
        }
    }
</style>