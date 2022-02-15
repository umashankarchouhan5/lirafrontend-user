import Ajax from 'Utils/ajax'; 

export const generateProcessTicket = (data) => Ajax.post('webuser/generateProcessTicket',data); 
 
export const getPcWeb = (data) => Ajax.post('webuser/tasks/ticket/getpcweb',data); 

export const generateInvoice = (data) => Ajax.post('webuser/GenerateTicketInvoice',data);

export const getTicket = (data) => Ajax.post('webuser/tasks/get/data', data);

export const changeType = (data) => Ajax.get('list/fetchChangeProcesses/32', data);

export const changeTicket = (data) => Ajax.post('company/ICSPchangeRequest', data);

export const getApprovedNames = (data) => Ajax.post('list/getApprovedNames', data);

export const fetchFees = (data) => Ajax.post('webuser/FetchFees', data);

export const preProcessTicket = (data) => Ajax.post('webuser/WebPreProcessTicket', data);

export const payLater = (data) => Ajax.post('webuser/PayLater', data);
 
export const getPeople = (data) => Ajax.post('list/FetchPeople', data);

export const getchangePeopleRequestList = (data) => Ajax.post('company/getchangePeopleRequestList', data);

export const changePeople = (data) => Ajax.post('company/ICSPchangePeopleRequest', data);

export const CSPManagerialStaff = (data) => Ajax.post('company/licenseeManagerialStaff', data);

// export const CSPManagerialStaff = (data) => Ajax.post('company/ICSPManagerialStaff', data);

export const getPersonDetails = (data) => Ajax.post('webuser/fetchPerson', data);

export const addUpdatePerson = (data) => Ajax.post('webuser/addUpdatePerson', data);

// export const fetchPQPosition = (data) => Ajax.post('pqform/fetchPQPositionByType', data);
export const fetchPQPosition = (data) => Ajax.post('pqform/fetchPQPositionByProcess', data);

export const searchForPQ = (data) => Ajax.post('pqform/fetchPQSearch', data);

export const fetchICSPLicenseList = (data) => Ajax.post('list/fetchICSPLicenseList', data);

export const generatePQfit = (data) => Ajax.post('pqform/generatePQfit', data);