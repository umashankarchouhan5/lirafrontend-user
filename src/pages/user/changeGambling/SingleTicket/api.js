import Ajax from 'Utils/ajax';

export const getExcludedCompany = (data) => Ajax.post('company/searchCompanyExclude',data); 

export const generateProcessTicket = (data) => Ajax.post('webuser/generateProcessTicket',data); 
 
export const getPcWeb = (data) => Ajax.post('webuser/tasks/ticket/getpcweb',data); 

export const generateInvoice = (data) => Ajax.post('webuser/GenerateTicketInvoice',data);

export const getTicket = (data) => Ajax.post('webuser/tasks/get/data', data);

export const changeType = (data) => Ajax.get('list/fetchChangeProcesses/35', data);

export const changeTicket = (data) => Ajax.post('webuser/LicenseeChangeRequest', data);

export const fetchFees = (data) => Ajax.post('webuser/FetchFees', data);

export const preProcessTicket = (data) => Ajax.post('webuser/WebPreProcessTicket', data);

export const payLater = (data) => Ajax.post('webuser/PayLater', data);
 
export const fetchICSPLicenseList = (data) => Ajax.post('list/fetchICSPLicenseList', data);

export const fetchLicenseeData = (data) => Ajax.post('webuser/fetchLicenseeData', data);




