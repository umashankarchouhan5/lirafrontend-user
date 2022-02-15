import Ajax from 'Utils/ajax';

export const createDraft = (data) => Ajax.post('webuser/draftRequest', data);

export const submitForm = (data) => Ajax.post('webuser/fileComplaint', data);

export const uploadDocument = (data) => Ajax.post('webuser/ComplaintStore', data);

export const generateProcessTicket = (data) => Ajax.post('webuser/generateProcessTicket', data);

export const fetchInstructions = (data) => Ajax.post('list/fetchInstructions', data);

export const deleteAdditionalDocument  = (data) => Ajax.post(`webuser/deleteAdditionalDocument `, data);