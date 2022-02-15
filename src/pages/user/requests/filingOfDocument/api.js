import Ajax from 'Utils/ajax';

export const getEntityType = (data) => Ajax.post('list/entitytypebyprocess', data);

export const requestbyWebuser = (data) => Ajax.post('company/requestByWebuser ', data);

export const getCertifiedDoc = (data) => Ajax.post('webuser/getCertifiedDoc', data);

export const generateProcessTicket = (data) => Ajax.post('webuser/generateProcessTicket',data); 

export const createNewForm = (data) => Ajax.post('webuser/draftRequest', data);