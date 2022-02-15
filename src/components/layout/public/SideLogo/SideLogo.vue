<template>
    <div class="col-sm-3">
        <div :class="$style.logo">
            <img v-if="companyLogo" :src="companyLogo" alt="Company Logo"/>
        </div>
    </div>
</template>

<script>
import { getLogo } from "./SideLogoAction";
export default {
    data(){
        return{
            companyLogo: ''
        }
    },
    created(){
        getLogo().then(res => {
            this.companyLogo = res.data;
        });
    }
}
</script>
<style lang="scss" module>
    .logo {
        margin: 50px 0 35px;

        > img {
            display: block;
            margin: 0 auto;
        }
    }
</style>