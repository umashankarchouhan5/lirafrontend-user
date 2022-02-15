import Ajax from 'Utils/ajax';

export const getPcWeb = (data) => Ajax.post('webuser/tasks/ticket/getpcweb',data); 

export const searchICSPTypes = () => Ajax.get('misc/icsplist');

export const getApprovedNames = (data) => Ajax.post('list/getApprovedNames', data);
 
export const getPeople = (data) => Ajax.post('list/FetchPeople', data);

export const getchangePeopleRequestList = (data) => Ajax.post('company/GetRODChangePeopleRequestList', data);

export const RODPeople = (data) => Ajax.post('company/RODchangePeopleRequest', data);

export const fetchRODDirector = (data) => Ajax.post('company/getROD',data);

export const fetchRODDirectorType = () => Ajax.post('list/fetchRODDirectorType');

export const generateProcessTicket = (data) => Ajax.post('webuser/generateProcessTicket',data); 



