import Ajax from 'Utils/ajax';

export const getAnnualReturnDueDate  = (data) => Ajax.post('company/GetAnnualReturnDueDate ',data); 

export const generateProcessTicket = (data) => Ajax.post('webuser/generateProcessTicket',data); 
 
export const generateInvoice = (data) => Ajax.post('webuser/GenerateTicketInvoice',data);

export const getTicket = (data) => Ajax.post('webuser/tasks/get/data', data);

export const annualReturnRequest = (data) => Ajax.post('company/AnnualReturnRequest', data);

export const annualReturnExtensionRequest = (data) => Ajax.post('company/AnnualReturnExtensionRequest', data);

export const getCompany = (data) => Ajax.post('list/getcompanysearch', data);

export const annualReturnProcessSelection = (data) => Ajax.post('company/AnnualReturnProcessSelection', data);

export const annualReturnDraftRequest  = (data) => Ajax.post('company/AnnualReturnDraftRequest ', data);

export const fetchInstructions = (data) => Ajax.post('list/fetchInstructions', data);



