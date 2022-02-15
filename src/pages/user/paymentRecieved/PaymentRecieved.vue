<template>
    <div>
        <Loader v-if="isLoading" />
        <div :class="$style.container"></div>
    </div>
</template>
<script>
    
    import loadingMixin from 'Mixins/loadingMixin';
    import Loader from 'Components/layout/Loader';

    export default {
        name:'PaymentRecieved',
        mixins: [loadingMixin],
        components: {
            Loader
        },
        created(){
            this.showLoader();
            var url = localStorage.getItem('pathToReturn');
            if(url){
                this.$router.push(url);
            }else{
                this.$router.push('/dashboard');
            }
        }
    }
</script>

<style lang="scss" module>
    .container{
        min-height: calc(100vh - 80px);
    }
</style>