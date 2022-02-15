import Ajax from 'Utils/ajax';

export const fetchDelinquentList = (data) => Ajax.post("list/fetchDelinquentList",data);

export const getEntityType = (data) => Ajax.post('list/entitytypebyprocess', data);

export const annualRenewalRequest = (data) => Ajax.post('company/AnnualRenewalRequest', data);

export const generateProcessTicket = (data) => Ajax.post('webuser/generateProcessTicket',data); 