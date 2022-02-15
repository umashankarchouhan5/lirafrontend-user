import Ajax from "Utils/ajax";

export const removePosition = (data) => Ajax.post('webuser/removePosition',data);

export const addUpdateAddressRequest = (data) => Ajax.post('webuser/addUpdateAddress', data);

export const addUpdatePersonRequest = (data = null) => Ajax.post('webuser/addUpdateICSPPerson', data);

export const assignPosition = (data = null) => Ajax.post('webuser/assignPosition', data);

export const fetchICSPCompanyList = (data) => Ajax.post('list/fetchICSPCompanyList', data);

export const ICSPRequestRecordRequest = (data = null) => Ajax.post('webuser/addUpdateICSPRecord', data);

export const delICSPRecordRequest = (data = null) => Ajax.post('delICSPRecord', data);

export const getICSPRequestPeople = (data = null) => Ajax.post('webuser/getICSPRequestpeople', data);

export const getICSPOperationType = () => Ajax.get(`list/ICSPOperationType`);

export const fetchMultipleFields = (data = null) => Ajax.post(`webuser/getICSPRequestrecord`, data);

export const getProcessDocument = (process_id) => Ajax.post(`webuser/getProcessDocument`, { process_id });

// export const fetchPQPosition = (data) => Ajax.post('pqform/fetchPQPositionByType', data);
export const fetchPQPosition = (data) => Ajax.post('pqform/fetchPQPositionByProcess', data);

export const searchForPQ = (data) => Ajax.post('pqform/fetchPQSearch', data);

export const getPersonDetails = (data) => Ajax.post('webuser/fetchPerson', data);

export const validateNinsertCompany = (data) => Ajax.post('company/validateNinsertCompany', data);

export const fetchWebuserCompany  = (data) => Ajax.post('company/fetchWebuserCompany ', data);