import Ajax from 'Utils/ajax';

export const incorporatepeople = (data) => Ajax.post('company/incorporatepeople',data);

export const generateInvoice = (data) => Ajax.post('webuser/GenerateTicketInvoice',data);

export const incorporateTicket = (data) => Ajax.post('namereservation/incorporatenew', data);

export const fetchFees = (data) => Ajax.post(`webuser/FetchFees`, data);

export const preProcessTicket = (data) => Ajax.post(`webuser/WebPreProcessTicket`, data);

export const payLater = (data) => Ajax.post(`webuser/PayLater`, data);

export const getPcWeb = (data) => Ajax.post('webuser/tasks/ticket/getpcweb',data); 


