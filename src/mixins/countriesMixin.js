import { getCountries } from 'Pages/master/masterActions'

export default {
    computed: {
        isCountryLoading(){
            return this.$store.state.common.isCountryLoading;
        },
        countriesList() {
            return this.$store.state.common.countries
        }
    },
    created() {
        if (this.countriesList.length === 0 && this.isCountryLoading === false) {
            this.fetchCountries()
        }
    },
    methods: {
        fetchCountries() {
            this.$store.commit('setCountryLoading', true);
            getCountries().then(this.handleSuccess)
        },
        handleSuccess(response) {
            this.$store.commit('setCountryLoading', false);
            this.$store.commit('setCountries', response.data)
        }
    }
};



