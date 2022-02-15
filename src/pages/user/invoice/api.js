import Ajax from "Utils/ajax";

export const getProcessTypes = () => Ajax.get('list/fetchDefinitionChildrenByName/ProcessType');

export const getProcesses = (id) => Ajax.get(`list/fetchAllProcessesByProcessType/${id}`);

export const getEntityType = (data) => Ajax.post('list/entitytype', data);

export const getCompanies = () => Ajax.get('list/getcompanies');

export const getInvoiceStatus = () => Ajax.post('list/fetchInvoiceStatus'); 

export const getInvoiceDetails = (data) => Ajax.post('webuser/FetchInvoice', data);

export const getInvoiceList = (data) => Ajax.post('list/getInvoiceList', data);

export const updateInvoice = (data) => Ajax.post(`webuser/UpdatePaidInvoices`,data);

export const generateAnnualRenewalInvoice = (data) => Ajax.post(`webuser/GenerateAnnualRenewalInvoice`,data);

export const fetchMultipleInvoice = (data) => Ajax.post(`webuser/FetchMultipleInvoice`,data);

export const fetchReceiptByInvoiceId = (data) => Ajax.post(`webuser/fetchReceiptByInvoiceId`,data);

export const exportInvoices = (data) => Ajax.post(`webuser/exportInvoices`,data);