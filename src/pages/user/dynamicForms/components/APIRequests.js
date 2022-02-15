import Ajax from "Utils/ajax";

export const generateInvoice = (data) => Ajax.post('webuser/GenerateTicketInvoice',data);

export const validateICSPInitial = (data) => Ajax.post('webuser/validateICSPInitial', data);

export const fetchInstructions = (data) => Ajax.post('list/fetchInstructions', data);

export const getTaskDataRequest = (data) => Ajax.post('webuser/getwebusertaskdata', data);

export const createNewForm = (data) => Ajax.post('webuser/draftRequestDynamic', data);

export const addUpdateAddressRequest = (data) => Ajax.post('webuser/addUpdateAddress', data);

export const getProcessDocument = (process_id) => Ajax.post(`webuser/getProcessDocument`, { process_id });

export const generateProcessTicket = (data) => Ajax.post('webuser/generateProcessTicket', data);

export const getDynamicDatabyID = (data) => Ajax.post('webuser/getDynamicDatabyID', data);

export const fetchComplianceFormForYear = (data) => Ajax.post('pqform/fetchComplianceFormForYear', data);

export const getStatuses = (data) => Ajax.post('list/fetchWebFilterStatusList', data);

export const uploadDoc = (data) => Ajax.post('webuser/DynamicStore', data);
   
export const addUpdateDynamicData = (data) => Ajax.post('webuser/addUpdateDynamicData', data);

//People Assignments

export const getLicenseRequestpeople = (data) => Ajax.post('webuser/getLicenseRequestpeople', data);

export const checkLicenseAssignedPeople = (data) => Ajax.post('webuser/checkLicenseAssignedPeople', data);

export const assignLicenseePosition = (data) => Ajax.post('webuser/assignLicenseePosition', data);

export const fetchPQPositionByProcess = (data) => Ajax.post('pqform/fetchPQPositionByProcess', data);

export const generatePQfit = (data) => Ajax.post('pqform/generatePQfit', data);

export const removeLicenseePosition = (data) => Ajax.post('webuser/removeLicenseePosition', data);

//People Assignment End

export const fetchLicenseApplicantCompany = (data) => Ajax.post('company/fetchLicenseApplicantCompany', data);

export const validateNinsertCompany = (data) => Ajax.post('company/validateNinsertCompany', data);

export const generateSecuritiesPDF = (data) => Ajax.post('webuser/generateSecuritiesPDF', data);

export const getPQPositionTypeForLicenseApp = (data) => Ajax.post('pqform/getPQPositionTypeForLicenseApp', data);

//Representative Code 
export const attachLicenseToRep = (data) => Ajax.post('webuser/attachLicenseToRep', data);

export const fetchAttachedLicenseToRep = (data) => Ajax.post('list/attachedLicenseToRep', data);

//Documents
export const getTaskDocuments = (data) => Ajax.post(`webuser/tasks/get/documents`, data);


