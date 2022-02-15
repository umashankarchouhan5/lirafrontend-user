import Ajax from 'Utils/ajax';

export const requestByWebUser = (data) => Ajax.post('company/requestByWebuser',data);

export const generateProcessTicket = (data) => Ajax.post('webuser/generateProcessTicket',data); 

export const getTicket = (data) => Ajax.post('webuser/tasks/get/data', data);

export const getEntityType = (data) => Ajax.post('list/entitytypebyprocess', data);

