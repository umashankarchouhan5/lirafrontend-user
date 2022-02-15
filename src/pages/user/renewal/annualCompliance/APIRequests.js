import Ajax from "Utils/ajax";


export const generateInvoice = (data) => Ajax.post('webuser/GenerateTicketInvoice',data);

export const validateICSPInitial = (data) => Ajax.post('webuser/validateICSPInitial', data);

export const fetchInstructions = (data) => Ajax.post('list/fetchInstructions', data);

export const getTaskDataRequest = (data) => Ajax.post('webuser/getwebusertaskdata', data);

export const createNewForm = (data) => Ajax.post('pqform/DraftRequestCompliance', data);

export const addUpdateAddressRequest = (data) => Ajax.post('webuser/addUpdateAddress', data);

export const getProcessDocument = (process_id) => Ajax.post(`webuser/getProcessDocument`, { process_id });

export const generateProcessTicket = (data) => Ajax.post('webuser/generateProcessTicket', data);

export const getComplianceDataById = (data) => Ajax.post('pqform/getComplianceDataById', data);

export const fetchComplianceFormForYear = (data) => Ajax.post('pqform/fetchComplianceFormForYear', data);

export const getStatuses = (data) => Ajax.post('list/fetchWebFilterStatusList', data);

export const uploadDoc = (data) => Ajax.post('pqform/ComplianceStore', data);
   
export const addUpdateComplianceData = (data) => Ajax.post('pqform/addUpdateComplianceData', data);

export const fetchNextComplianceSubmissionDue = (data) => Ajax.post('webuser/fetchNextComplianceSubmissionDue', data);
 