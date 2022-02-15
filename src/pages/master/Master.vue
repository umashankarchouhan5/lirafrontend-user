<template>
    <div v-if="isUserLogged && $route.name !== 'home'">
        <LicenseSelect v-if="userData !== null && userData.sso && userData.sso == 1 && showLicenseSelection == true && userData.icsp_id && userData.icsp_id !== null && userData.LastLicense_id == null" @licenseSelected="changeLicenseSelection" selectOnSingle />
        <PageUser v-else>
            <router-view />
            <Footer auth/>
        </PageUser>
    </div>
    <div v-else>
        <PagePublic>
            <router-view />
            <Footer />
        </PagePublic>
    </div>
</template>

<script>

    import Auth from 'Utils/auth'
    import PagePublic from "Components/layout/public/Page";
    import PageUser from "Components/layout/user/Page";
    import Footer from "Components/layout/Footer";
    import LicenseSelect from './LicenseComponent'

    export default {
        name: "Master",
        components: {
            PagePublic,
            PageUser,
            Footer,
            LicenseSelect,
        },
        data() {
            return {
                showLicenseSelection: true
            }
        },
        computed: {
            isUserLogged() {
                return Auth.isUserLogged();
            },
            userData() {
                return this.$store.state.user.user;
            },
        },
        created(){
            if(this.$route.name === 'home' && localStorage.userData === undefined){
                this.$router.push('/login')
            }
            if(this.$route.name === 'home' && localStorage.userData){
                this.$router.push('/dashboard')
            }
        },
        methods: {
            changeLicenseSelection(val) {
                this.showLicenseSelection = !val;
            }
        }
    }
</script>