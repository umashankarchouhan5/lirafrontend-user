import Ajax from "Utils/ajax";

export const cessationRequest = (data) => Ajax.post('webuser/cessationRequest', data);

export const generateProcessTicket = (data) => Ajax.post('webuser/generateProcessTicket',data);

export const getTicket = (data) => Ajax.post('webuser/tasks/get/data', data);

export const getStrikeOffReason = (data) => Ajax.post('list/getStrikeOffReason', data);

export const fetchICSPLicenseList = (data) => Ajax.post('list/fetchICSPLicenseList', data);

export const fetchInstructions = (data) => Ajax.post('list/fetchInstructions', data);