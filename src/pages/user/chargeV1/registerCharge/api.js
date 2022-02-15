import Ajax from 'Utils/ajax';

export const chargeReferenceSearch = (data) => Ajax.post('webuser/chargeReferenceSearch',data); 

export const ChargeRequest = (data) => Ajax.post('webuser/chargeRequest',data); 

export const ChargeList = () => Ajax.post('list/chargeType'); 

export const generateProcessTicket = (data) => Ajax.post('webuser/generateProcessTicket',data); 
 
export const getPcWeb = (data) => Ajax.post('webuser/tasks/ticket/getpcweb',data); 

export const generateInvoice = (data) => Ajax.post('webuser/GenerateTicketInvoice',data);

export const getTicket = (data) => Ajax.post('webuser/tasks/get/data', data);

export const chargeRegister = (data) => Ajax.post('webuser/chargeRegister',data); 
 