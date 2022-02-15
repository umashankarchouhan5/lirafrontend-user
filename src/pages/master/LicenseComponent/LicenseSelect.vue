<template>
    <div :class="$style.body">
        <h1> Select License </h1>
        <div :class="$style.flexbox">
            <div v-for="(license,index) in licenses" :key="index" :class="$style.licenseStyle" @click="selectLicense(license)">
                <h3>{{license.LicenseType}}</h3>
                <hr :class="$style.hrStyle" />
                <h4>{{license.CompanyName}}</h4>
            </div>
        </div>
        <div :class="$style.logoutButton">
            <FormButton type="primary" @click="logout" v-if="!cancelButton">Logout </FormButton>
            <FormButton type="primary" @click="cancel" v-else>Cancel </FormButton>
        </div>
    </div>
</template>

<script>
    import { fetchICSPLicenseList, saveLastLicenseId } from '../masterActions';
    export default {
        name:'LicenseSelect',
        props: {
            cancelButton: {
                type: Boolean,
                default: false,
            },
            selectOnSingle: {
                type: Boolean,
                default: false,
            }
        },
        data() {
            return {
                licenses: [],
            }
        },
        computed: {
            userData() {
                return this.$store.state.user.user;
            },
        },
        created() {
            this.fetchLicense();
        },
        methods: {
            cancel() {
                this.$emit('licenseSelected', true);
            },
            selectLicense(license) {
                var user = JSON.parse(localStorage.getItem('userData'))
                user.license_id = license.license_id;
                user.license_name = license.CompanyName
                user.ExternalUserCategory_id = license.externalCategory_id;
                user.LastLicense_id = license.license_id;
                localStorage.setItem('userData',JSON.stringify(user));
                this.$store.commit('setUser', user);
                this.$emit('licenseSelected', true);
                saveLastLicenseId({LastLicense_id: license.license_id}).then(
                    res => {
                        setTimeout(() => {
                            this.$router.go();
                        } ,200)
                    },
                    err => {
                        setTimeout(() => {
                            this.$router.go();
                        } ,200)
                    }
                )
                
                
            },
            logout() {
                this.$router.push('/login');
            },
            fetchLicense() {
                fetchICSPLicenseList({ICSP_id: this.userData.icsp_id}).then(
                    res => {
                        this.licenses = res.data[0];
                        if(this.selectOnSingle == true){
                            if(this.licenses.length == 1){
                                this.selectLicense(this.licenses[0]);
                            }
                        }
                    }
                )
            },
        }
        
    }
</script>

<style lang="scss" module>
    .body {
        width: 100vw;
        height: 100vh;
        background: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        z-index: 99;
        position: fixed;
        left: 0;
        top: 0;
    }
    .logoutButton {
        margin: 30px;
    }
    .flexbox {
        display: flex;
        width: 100%;
        justify-content: center;
        margin: 20px;
    }
    .licenseStyle {
        width: 180px;
        height: 160px;
        box-shadow: 0px 7px 20px rgba(0,0,0,0.2);
        border-radius: 8px;
        background: #2c6fdb;
        color: #ffffff;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        padding: 20px;
        margin: 15px;
        text-align: center;
        cursor: pointer;
        animation: fadeInUp 0.2s ease-in forwards;
        opacity: 0;
        h3 {
            letter-spacing: 2px;
        }
        h4{
            letter-spacing: 1.5px;
        }
        // &:nth-child(1){
        //     animation-delay: 0.3s;
        // }
        &:nth-child(2){
            animation-delay: 0.2s;
        }
        &:nth-child(3){
            animation-delay: 0.4s;
        }
        &:nth-child(4){
            animation-delay: 0.6s;
        }
        &:nth-child(5){
            animation-delay: 0.8s;
        }
        &:nth-child(6){
            animation-delay: 1s;
        }
    }
    @-webkit-keyframes fadeInUp {
        0% {
            opacity: 0;
            -webkit-transform: translateY(20px);
        }

        100% {
            opacity: 1;
            -webkit-transform: translateY(0);
        }
    }

    @-moz-keyframes fadeInUp {
        0% {
            opacity: 0;
            -moz-transform: translateY(20px);
        }

        100% {
            opacity: 1;
            -moz-transform: translateY(0);
        }
    }

    @-o-keyframes fadeInUp {
        0% {
            opacity: 0;
            -o-transform: translateY(20px);
        }

        100% {
            opacity: 1;
            -o-transform: translateY(0);
        }
    }

    @keyframes fadeInUp {
        0% {
            opacity: 0;
            transform: translateY(20px);
        }

        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }
    .hrStyle {
        width: 100%;
        background: #ffffff;
        margin: 5px 0px;
        border: 1px solid #ffffff;
    }
</style>