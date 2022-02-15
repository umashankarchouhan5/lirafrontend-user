export default {
    state: {
        user: null,
        generatedInvoice: [],
        selectedCompany: null,
        pcWeb: null,
        changeEntityType: null,
        renewalData:[],
        multiplePayment:[],
        multiIdString: null,
        checkAnnual: false,
        csp_id: null,
        pqGenerationFormIds: [ 700, 701, 704, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 3001, 4001, 2011, 2012, 2013 ],
        checkRod: false,
        rodInvoice: null,
    },
    mutations: {
        setRodInvoice(state,data) {
            state.rodInvoice = data;
        },
        setCheckRod(state,data) {
            state.checkRod = data;
        },
        setChangeEntityType(state,data){
            state.changeEntityType = data;
        },
        setPcWeb(state,data){
            state.pcWeb = data;
        },
        setCompany(state,data){
            state.selectedCompany = data;
        },
        setUser(state, user) {
            state.user = user;
        },
        removeUser(state) {
            state.user = null;
        },
        updateUser(state, data) {
            state.user = { 
                ...state.user,
                ...data
            }
        },
        setGeneratedInvoice(state,data) {
            state.generatedInvoice = data;
        },
        setRenewalData(state,data) {
            state.renewalData = data;
        },
        setMultiplePayment(state,data){
            state.multiplePayment = data;
        },
        setMultiIdString(state,data){
            state.multiIdString = data;
        },
        setCheckAnnual(state,data){
            state.checkAnnual = data;
        },
        setCspId(state,data){
            state.csp_id = data;
        }
    }
}