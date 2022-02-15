import { getJurisdictions } from 'Pages/master/masterActions'

export default {
    computed: {
        jurisdictionsList() {
            return this.$store.state.common.jurisdictions
        }
    },
    created() {
        if (this.jurisdictionsList.length === 0) {
            this.fetchJurisdictions()
        }
    },
    methods: {
        fetchJurisdictions() {
            getJurisdictions().then(this.handleSuccessJurisdictions)
        },
        handleSuccessJurisdictions(response) {
            this.$store.commit('setJurisdictions', response.data)
        }
    }
};



