import Ajax from 'Utils/ajax';

export const fetchPaymentMode = () => Ajax.post(`list/fetchpaymentmode`);

export const TransactionStatus = (data) => Ajax.post(`webuser/transactionStatus`,data);

export const PaymentConfirmation = (data) => Ajax.post(`webuser/PaymentConfirmation`, data);

export const totalPayAmount = (data) => Ajax.post(`webuser/totalPayAmount`, data);

export const fetchInvoice = (data) => Ajax.post(`webuser/FetchInvoice`, data);

export const updateInvoice = (data) => Ajax.post(`webuser/UpdatePaidInvoicesWallet`,data);

export const fetchFees = (data) => Ajax.post(`webuser/FetchFees`, data);

export const preProcessTicket = (data) => Ajax.post(`webuser/WebPreProcessTicket`, data);

export const payLater = (data) => Ajax.post(`webuser/PayLater`, data);

export const payMultipleInvoicesWallet = (data) => Ajax.post(`webuser/PayMultipleInvoicesWallet`, data);

export const generateProcessTicket = (data) => Ajax.post('webuser/generateProcessTicket',data); 

export const fetchMultipleInvoice = (data) => Ajax.post(`webuser/FetchMultipleInvoice`,data);
 
export const fetchPQTicketByProcessReference = (data) => Ajax.post(`pqform/fetchPQTicketByProcessReference`,data);
