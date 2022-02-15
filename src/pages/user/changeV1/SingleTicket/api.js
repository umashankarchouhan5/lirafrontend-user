import Ajax from 'Utils/ajax';

export const getExcludedCompany = (data) => Ajax.post('company/searchCompanyExclude',data); 

export const generateProcessTicket = (data) => Ajax.post('webuser/generateProcessTicket',data); 
 
export const getPcWeb = (data) => Ajax.post('webuser/tasks/ticket/getpcweb',data); 

export const generateInvoice = (data) => Ajax.post('webuser/GenerateTicketInvoice',data);

export const getTicket = (data) => Ajax.post('webuser/tasks/get/data', data);

export const searchICSPTypes = (data) => Ajax.post('misc/icsplist', data);

export const changeType = (data) => Ajax.get('list/fetchChangeProcesses/30', data);

export const changeTicket = (data) => Ajax.post('company/changeRequest', data);

export const getApprovedNames = (data) => Ajax.post('list/getApprovedNames', data);

export const fetchFees = (data) => Ajax.post('webuser/FetchFees', data);

export const preProcessTicket = (data) => Ajax.post('webuser/WebPreProcessTicket', data);

export const payLater = (data) => Ajax.post('webuser/PayLater', data);
 
export const getPeople = (data) => Ajax.post('list/FetchPeople', data);

export const getchangePeopleRequestList = (data) => Ajax.post('company/getchangePeopleRequestList', data);

export const changePeople = (data) => Ajax.post('company/changePeopleRequest', data);



