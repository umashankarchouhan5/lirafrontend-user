import Ajax from 'Utils/ajax';

export const incorporateTicket = (data) => Ajax.post('namereservation/incorporatenew', data);

export const fetchFees = (data) => Ajax.post(`webuser/FetchFees`, data);

export const preProcessTicket = (data) => Ajax.post(`webuser/WebPreProcessTicket`, data);

export const payLater = (data) => Ajax.post(`webuser/PayLater`, data);



