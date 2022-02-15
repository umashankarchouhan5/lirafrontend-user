import Ajax from 'Utils/ajax';

export const importexportROD = (data) => Ajax.post('company/importexportROD2',data);

export const requestByWebUser = (data) => Ajax.post('company/requestByWebuser',data);

export const getExcludedCompany = (data) => Ajax.post('company/searchCompanyExclude',data); 

export const generateProcessTicket = (data) => Ajax.post('webuser/generateProcessTicket',data); 
 
export const getPcWeb = (data) => Ajax.post('webuser/tasks/ticket/getpcweb',data); 


export const getTicket = (data) => Ajax.post('webuser/tasks/get/data', data);

export const getApprovedNames = (data) => Ajax.post('list/getApprovedNames', data);
 
export const getPeople = (data) => Ajax.post('list/FetchPeople', data);

export const getchangePeopleRequestList = (data) => Ajax.post('company/GetRODChangePeopleRequestList', data);

export const changePeople = (data) => Ajax.post('company/RODchangePeopleRequest', data);

export const fetchRODDirector = (data) => Ajax.post('company/getROD',data);

export const fetchRODDirectorType = () => Ajax.post('list/fetchRODDirectorType');

export const fetchRodSample = () => Ajax.get('webuser/fetchRodSample');



