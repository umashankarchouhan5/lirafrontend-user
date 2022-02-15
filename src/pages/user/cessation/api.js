import Ajax from "Utils/ajax";

export const cessationRequest = (data) => Ajax.post('webuser/cessationRequest', data);

export const generateProcessTicket = (data) => Ajax.post('webuser/generateProcessTicket',data);

export const getTicket = (data) => Ajax.post('webuser/tasks/get/data', data);

export const getFilteredData = (data) => Ajax.post('list/fetchGenericWebUserTask', data);

export const getStatuses = (data) => Ajax.post('list/fetchFilterStatusList', data);

export const getEntityType = (data) => Ajax.post('list/entitytypebyprocess', data);

export const getStrikeOffReason = (data) => Ajax.post('list/getStrikeOffReason', data);

export const generateInvoice = (data) => Ajax.post('webuser/GenerateTicketInvoice',data);

export const getCompanybyStatus = (data) => Ajax.post('list/getCompanybyStatus', data);

export const fetchDissolutionRegisteredCompany = (data) => Ajax.post('company/fetchDissolutionRegisteredCompany', data);

