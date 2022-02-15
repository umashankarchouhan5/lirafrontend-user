import Ajax from "Utils/ajax";

export const createNewForm = (data) => Ajax.post('webuser/draftRequest', data);

export const CSLPCCRequest = (data) => Ajax.post('webuser/CSLPCCRequest', data);

export const getTaskDataRequest = (data) => Ajax.post('webuser/getwebusertaskdata', data);

export const generateInvoice = (data) => Ajax.post('webuser/GenerateTicketInvoice',data);

export const addUpdateCSLPCCActivityData = (data) => Ajax.post('webuser/addUpdateCSLPCCActivityData',data);

export const fetchPQPosition = (data) => Ajax.post('pqform/fetchPQPositionByType', data);

export const getCSLPCCRequestpeople = (data) => Ajax.post('webuser/getCSLPCCRequestpeople', data);

export const fetchPerson = (data) => Ajax.post('webuser/fetchPerson', data);

export const addUpdatePerson = (data) => Ajax.post('webuser/addUpdatePerson', data);

export const BeneficialOwner = (data) => Ajax.post('webuser/BeneficialOwner', data);

export const assignCSLPCCPosition = (data) => Ajax.post('webuser/assignCSLPCCPosition', data);

export const removeCSLPCCPosition = (data) => Ajax.post('webuser/removeCSLPCCPosition', data);

export const checkCSLPCCAssignedPeople = (data) => Ajax.post('webuser/checkCSLPCCAssignedPeople', data);

export const getFilteredData = (data) => Ajax.post('list/fetchGenericWebUserTask', data);

export const getStatuses = (data) => Ajax.post('list/fetchWebFilterStatusList', data);

