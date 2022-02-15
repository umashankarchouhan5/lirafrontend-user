import Loader from 'Components/layout/Loader'

export default {
    data() {
        return {
            isLoading: false,
        }
    },
    components: {
        Loader
    },
    computed :{
        // isLoading: {
        //     get(){
                
        //     return this.$store.state.common.isLoading
        //     },
            
        //     set(newValue){
        //         return newValue;
        //     }
        // }
    },
    methods: {
        showLoader() {
            this.isLoading = true;
            // this.$store.commit('setIsLoading',true);
        },
        hideLoader() {
            this.isLoading = false;
            // this.$store.commit('setIsLoading',false);
        },
    }
}


