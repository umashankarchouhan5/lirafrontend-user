import { TransactionStatus, fetchPQTicketByProcessReference } from 'Components/layout/user/payment/api'

export default {
    computed:{
        pqGenerationFormIds() {
            return this.$store.state.user.pqGenerationFormIds;
        }
    },
    watch:{
        // ticket(val){
        //     var path = localStorage.getItem('pathToReturn');
        //     var invoiceId = localStorage.getItem('invoice_idstring');
        //     var tblCCBeforePosting_id = localStorage.getItem('tblCCBeforePosting_id');
        //     if( val.invoice_id && path){
        //         setTimeout(() =>{
        //             this.changeStep().then(this.fetchPaymentData(invoiceId, tblCCBeforePosting_id));

        //         },300);
        //     }
        // }
    },
    mounted(){ 
        var path = localStorage.getItem('pathToReturn');
        var invoiceId = localStorage.getItem('invoice_idstring');
        var tblCCBeforePosting_id = localStorage.getItem('tblCCBeforePosting_id');
        if(localStorage.cc_process_id){
            var ccProcessId = localStorage.getItem('cc_process_id');
            ccProcessId = JSON.parse(ccProcessId)
        }
        if(path && path !== null && tblCCBeforePosting_id && tblCCBeforePosting_id !== null){
            var self = this;
            setTimeout(() =>{
                if( 
                    (self.processId !== undefined && self.processId !== null && self.pqGenerationFormIds.indexOf(self.processId) !== -1) 
                    || 
                    (self.currentProcessId !== undefined && self.currentProcessId !== null && self.pqGenerationFormIds.indexOf(self.currentProcessId) !== -1) 
                    ||
                    (ccProcessId && ccProcessId != null && self.pqGenerationFormIds.indexOf(ccProcessId) !== -1)
                )
                {
                    // const processId = self.currentProcessId !== undefined ? self.currentProcessId : self.processId;
                    if( self.currentProcessId ){
                        var processIdToSent = self.currentProcessId;
                        self.fetchPQAndPaymentData(invoiceId, tblCCBeforePosting_id, processIdToSent)
                    }
                    else if(self.processId){
                        var processIdToSent = self.processId;
                        self.fetchPQAndPaymentData(invoiceId, tblCCBeforePosting_id, processIdToSent)
                    }
                    else{
                        var processIdToSent = ccProcessId
                        this.fetchPQAndPaymentData(invoiceId, tblCCBeforePosting_id, processIdToSent)
                    }
                    // this.fetchPQAndPaymentData(invoiceId, tblCCBeforePosting_id, processId)
                }
                else{
                    this.fetchPaymentData(invoiceId, tblCCBeforePosting_id)

                }
            },500)
        }
    },
    methods: {
        async changeStep(){
            if(this.steps){
                this.setActiveStep(this.steps.length);
            }
        },
        fetchPaymentData(id, tblCCBeforePosting_id) {
            var self = this;
            TransactionStatus({invoice_id: id, tblCCBeforePosting_id: tblCCBeforePosting_id}).then(
                res => {
                    if(res.data.transaction_status === 'ACCEPT'){
                        self.modals.success.step = 4;
                        self.modals.success.message = res.data.message;
                        self.modals.success.isVisible = true;
                    }else{
                        self.modals.failure.step = 1;
                        self.modals.failure.message = res.data.message;
                        self.modals.failure.isVisible = true;
                    }
                    localStorage.removeItem('pathToReturn');
                    localStorage.removeItem('invoice_id');
                    localStorage.removeItem('tblCCBeforePosting_id');
                    localStorage.removeItem('cc_process_id');
                },
                err =>{
                    localStorage.removeItem('pathToReturn');
                    localStorage.removeItem('invoice_id');
                    localStorage.removeItem('tblCCBeforePosting_id');
                    localStorage.removeItem('cc_process_id');
                }
            )
        },
        fetchPQAndPaymentData(id, tblCCBeforePosting_id, processIdToSent) {
            Promise.all( [
                fetchPQTicketByProcessReference({ process_id: processIdToSent, reference_id: parseInt(this.$route.params.id)}),
                TransactionStatus({invoice_id: id, tblCCBeforePosting_id: tblCCBeforePosting_id})
            ]).then(this.handlePQAndPaymentData, this.handlePQAndPaymentyError)
        },
        handlePQAndPaymentData(response){
            this.pqData = response[0].data;
            var res = response[1];
            var self = this;
            if(res.data.transaction_status === 'ACCEPT'){
                self.modals.success.step = 4;
                self.modals.success.message = res.data.message;
                self.modals.success.isVisible = true;
            }else{
                self.modals.failure.step = 1;
                self.modals.failure.message = res.data.message;
                self.modals.failure.isVisible = true;
            }
            localStorage.removeItem('pathToReturn');
            localStorage.removeItem('invoice_id');
            localStorage.removeItem('tblCCBeforePosting_id');
            localStorage.removeItem('cc_process_id');
        },
        handlePQAndPaymentyError(err){ 
            localStorage.removeItem('pathToReturn');
            localStorage.removeItem('invoice_id');
            localStorage.removeItem('tblCCBeforePosting_id');
            localStorage.removeItem('cc_process_id');

        }
    }
}