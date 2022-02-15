import { fetchInvoice, fetchMultipleInvoice } from '../api';
export default {
    state: {
        invoice: [],
        currency:'',
    },
    actions:{
        getInvoice({commit},data){
            fetchMultipleInvoice(data).then((res) => {
                    const currency = res.data[0][0].currency;
                    // const invoice = res.data[0];
                    const invoice = res.data;
                    commit('setInvoice',invoice);
                    localStorage.setItem('invoiceData',JSON.stringify(invoice));
                    sessionStorage.setItem('invoiceData',JSON.stringify(invoice));
                    commit('setCurrency',currency);
                })
        },
        getMultipleInvoice({commit},data){
            commit('setInvoice',data);
            commit('setCurrency',data.currency);
        }
    },
    mutations: {
        setInvoice(state, invoice) {
            state.invoice = invoice;     
        },
        setCurrency(state, currency) {
            state.currency = currency;     
        },
    }
}