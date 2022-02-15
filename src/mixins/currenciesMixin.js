import { getCurrencies } from 'Pages/master/masterActions'

export default {
    computed: {
        currenciesList() {
            return this.$store.state.common.currencies
        }
    },
    created() {
        if (this.currenciesList.length === 0) {
            this.fetchCurrencies()
        }
    },
    methods: {
        fetchCurrencies() {
            getCurrencies().then(this.handleSuccessCurrencies)
        },
        handleSuccessCurrencies(response) {
            this.$store.commit('setCurrencies', response.data)
        }
    }
};



