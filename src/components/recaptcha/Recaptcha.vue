<template>
    <div>
        <FormRow >
            <div class="col-sm-12">
            <vue-recaptcha :sitekey="siteKey" 
                :loadRecaptchaScript="true"                       
                ref="recaptcha"
                @verify="onCaptchaVerified"
                @expired="onCaptchaExpired"
                >
            </vue-recaptcha>
            </div>
        </FormRow>
        <p class=" text-danger" v-if="expireData.status">{{expireData.message}}</p>
    </div>
</template>
<script>

import VueRecaptcha from 'vue-recaptcha';
import config from 'Config/base';
// import loadingMixin from 'Mixins/loadingMixin';

export default {
    name:'Recaptcha',
    // mixins: [loadingMixin],
    components:{
        VueRecaptcha
    },
    props:{
        captchaReset: Boolean,
    },
    data(){
        return{
            recaptchaToken:'',
            siteKey: config.SITEKEY,
            expireData:{
                status: false,
                message : ""
            }
        }
    },
    watch:{
        captchaReset(val){
            if(val === true){
                this.onCaptchaExpired();
            }
        }
    },
    // created(){
    //     this.showLoader()
    //     // this.siteKey = config.SITEKEY
    // },
    // mounted(){
    //     this.hideLoader()
    // },
    methods:{
        onCaptchaVerified(response){
            this.$store.commit('setRecaptcha', response);
            this.expireData.status = false;
        },
        onCaptchaExpired: function () {
            this.$refs.recaptcha.reset();
            this.expireData.status = true;
            this.expireData.message = "This captcha has been expired. Please submit it again."
        },
    }
}
</script>
