import Ajax from "Utils/ajax";

export const createNewForm = (data) => Ajax.post('pqform/pqDraftRequest', data);

export const getIdentificationTypes = () => Ajax.get('list/getIdentificationTypes');

export const getQualificationTypes = () => Ajax.get('list/getQualificationTypes');

export const addUpdatePQForm = (data) => Ajax.post('pqform/addUpdatePQForm', data);

export const addUpdatePQFormChecklistData = (data) => Ajax.post('pqform/addUpdatePQFormChecklistData', data);

export const getPQChecklistDataByPQId = (pq_id) => Ajax.post('pqform/getPQChecklistDataByPQId', { pq_id });

export const getPQRecordByPQid = (pq_id) => Ajax.post('pqform/getPQRecordByPQid', { pq_id });

export const getPQformDetails = (data) => Ajax.post('pqform/getPQformDetails', data);

export const addUpdatePQRecord = (data) => Ajax.post('pqform/addUpdatePQRecord', data);

export const uploadDocumentPQ = (data) => Ajax.post('pqform/file/upload', data);

export const generatePqFormPdf = (data) => Ajax.post(`pqform/generatePqFormPdf`, data);

export const checkPQexistencebyEmail = (data) => Ajax.post(`pqform/checkPQexistencebyEmail`, data);

export const getMyPq = (data) => Ajax.post(`pqform/getMyPq`, data);

export const sendPqEmailUpdate = (data) => Ajax.post(`pqform/sendPqEmailUpdate`, data);

export const updatePqPassport = (data) => Ajax.post(`pqform/updatePqPassport`, data);
