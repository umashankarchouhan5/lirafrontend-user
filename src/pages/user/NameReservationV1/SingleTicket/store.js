export default {
    state: {
        countries: [],
        currencies: [],
        jurisdictions: [],
        signUpPurposes: [],
        currentProcessId: null,
        identificationTypes: [],
        qualificationTypes: []
    },
    mutations: {
        setCountries(state, countries) {
            state.countries = countries;
        },
        setJurisdictions(state, jurisdictions) {
            state.jurisdictions = jurisdictions;
        },
        setCurrencies(state, currencies) {
            state.currencies = currencies;
        },
        setSignUpPurposes(state, signUpPurposes) {
            state.signUpPurposes = signUpPurposes;
        },
        setProcessId(state, id) {
            state.currentProcessId = +id;
        },
        setIdentificationType(state, identificationTypes) {
            state.identificationTypes = identificationTypes;
        },
        setQualificationTypes(state, qualificationTypes) {
            state.qualificationTypes = qualificationTypes;
        },
    },
    actions: {
        setProcessId({ commit, state }, id) {
            localStorage.setItem(PROCESS_ID, id);
            commit('setProcessId', id);
        },
    }
}




