import { PROCESS_ID,REFERENCE_ID } from 'Config/localStorageKeys'

export default {
    state: {
        countries: [],
        currencies: [],
        jurisdictions: [],
        signUpPurposes: [],
        currentProcessId: null,
        currentReferenceId: null,
        identificationTypes: [],
        qualificationTypes: [],
        isMenuCollapsed: false,
        recaptchaToken: '',
        allUploaded: false,
        additionalUploaded: false,
        optionalUploaded: false,
        isLoading: false,
        isCountryLoading: false,
        userDefinedStep: null,
    },
    mutations: {
        setUserDefinedStep(state,value){
            state.userDefinedStep = value;
        },
        setCountryLoading(state,value){
            state.isCountryLoading = value;
        },
        collapseMenu(state, value) {
            state.isMenuCollapsed = value;
        },
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
        setReferenceId(state, id) {
            state.currentReferenceId = +id;
        },
        setIdentificationType(state, identificationTypes) {
            state.identificationTypes = identificationTypes;
        },
        setQualificationTypes(state, qualificationTypes) {
            state.qualificationTypes = qualificationTypes;
        },
        setRecaptcha(state,recaptchaToken){
            state.recaptchaToken = recaptchaToken;
        },
        removeRecaptcha(state){
            state.recaptchaToken = ''
        },
        checkAllUploaded(state,val){
            state.allUploaded = val;
        },
        checkAdditionalUploaded(state,val){
            state.additionalUploaded = val;
        },
        checkOptionalUploaded(state,val){
            state.optionalUploaded = val;
        },
        setIsLoading(state,val){
            state.isLoading = val;
        },
    },
    actions: {
        setProcessId({ commit, state }, id) {
            localStorage.setItem(PROCESS_ID, id);
            sessionStorage.setItem(PROCESS_ID, id);
            commit('setProcessId', id);
        },
        setReferenceId({ commit, state }, id) {
            sessionStorage.setItem(REFERENCE_ID, id);
            commit('setReferenceId', id);
        },
    }
}

