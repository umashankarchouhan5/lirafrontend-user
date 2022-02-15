import Ajax from 'Utils/ajax';

export const generateProcessTicket = (data) => Ajax.post('webuser/generateProcessTicket',data); 
 
export const getPcWeb = (data) => Ajax.post('webuser/tasks/ticket/getpcweb',data); 

export const generateInvoice = (data) => Ajax.post('webuser/GenerateTicketInvoice',data);

export const getTicket = (data) => Ajax.post('webuser/tasks/get/data', data);

export const changeType = (data) => Ajax.get('list/fetchChangeProcesses/31', data);

export const changeTicket = (data) => Ajax.post('company/ICSPchangeRequest', data);

export const preProcessTicket = (data) => Ajax.post('webuser/WebPreProcessTicket', data);
 
export const getPeople = (data) => Ajax.post('list/FetchPeople', data);

export const getchangePeopleRequestList = (data) => Ajax.post('company/getchangePeopleRequestList', data);

export const changePeople = (data) => Ajax.post('company/ICSPchangePeopleRequest', data);


// export const CSPManagerialStaff = (data) => Ajax.post('company/ICSPManagerialStaff', data);

export const getPersonDetails = (data) => Ajax.post('webuser/fetchPerson', data);

export const fetchPQPosition = (data) => Ajax.post('pqform/fetchPQPositionByType', data);
// export const fetchPQPosition = (data) => Ajax.post('pqform/fetchPQPositionByProcess', data);

export const fetchICSPLicenseList = (data) => Ajax.post('list/fetchICSPLicenseList', data);

export const addUpdateCSLPCCActivityData = (data) => Ajax.post('webuser/addUpdateCSLPCCActivityData',data);

export const getCSLPCCRequestpeople = (data) => Ajax.post('webuser/getCSLPCCRequestpeople', data);

export const fetchPerson = (data) => Ajax.post('webuser/fetchPerson', data);

export const addUpdatePerson = (data) => Ajax.post('webuser/addUpdatePerson', data);

export const BeneficialOwner = (data) => Ajax.post('webuser/BeneficialOwner', data);

export const assignCSLPCCPosition = (data) => Ajax.post('webuser/assignCSLPCCPosition', data);

export const removeCSLPCCPosition = (data) => Ajax.post('webuser/removeCSLPCCPosition', data);

