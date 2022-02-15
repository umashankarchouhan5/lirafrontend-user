

export default {
    state: {
        TicketRef: null,
        parent_id: null,
        process_id: null,
    },
    mutations: {
        setTicketRef(state, value) {
            state.TicketRef = value;
        },
        setParentAndSubProcess(state,value){
            state.parent_id = value.processtype;
            state.process_id = value.process_id;
        }
    },
    actions: {
        setTicketReference({ commit }, TicketReference) {
            commit('setTicketRef', TicketReference);
        },
        setParent({commit},data){
            commit('setParentAndSubProcess',data)

        }
    }
}

