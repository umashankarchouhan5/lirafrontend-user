import Ajax from 'Utils/ajax';

export const requestByWebUser = (data) => Ajax.post('company/requestByWebuser',data);

export const getExcludedCompany = (data) => Ajax.post('company/searchCompanyExclude',data); 

export const generateProcessTicket = (data) => Ajax.post('webuser/generateProcessTicket',data); 
 
export const getPcWeb = (data) => Ajax.post('webuser/tasks/ticket/getpcweb',data); 

export const generateInvoice = (data) => Ajax.post('webuser/GenerateTicketInvoice',data);

export const getTicket = (data) => Ajax.post('webuser/tasks/get/data', data);

export const getApprovedNames = (data) => Ajax.post('list/getApprovedNames', data);

export const fetchFees = (data) => Ajax.post('webuser/FetchFees', data);

export const payLater = (data) => Ajax.post('webuser/PayLater', data);



