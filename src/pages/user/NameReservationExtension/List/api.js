import Ajax from "Utils/ajax";  

export const generateInvoice = (data) => Ajax.post('webuser/GenerateTicketInvoice',data);

export const checkExtend = (data) => Ajax.post('namereservation/Extend', data);

export const getEntityType = (data) => Ajax.post('list/entitytypebyprocess', data);

export const getStatuses = (data) => Ajax.post('list/fetchFilterStatusList', data);

export const getList = (data) => Ajax.post('namereservation/v1/getapprovedlist', data);

export const getEntityById = (id) => Ajax.get(`namereservation/getdetails/${id}`);

export const deleteEntityByIds = (data) => Ajax.post(`namereservation/multipledelete`, data);

export const addEntity = (data) => Ajax.post(`namereservation/create`, data, { 'Content-Type': 'multipart/form-data' });

export const updateEntity = (data) => Ajax.post(`namereservation/updatedetails`, data, { 'Content-Type': 'multipart/form-data' });

export const submitPending = (data) => Ajax.post('namereservation/pendingtosubmit', data);

export const bulkUploadFiles = (data, config) => Ajax.post('namereservation/importexcel', data, { 'Content-Type': 'multipart/form-data' }, config);

export const resubmitTicket = (data) => Ajax.post('namereservation/resubmitticket', data);
  
export const nameRelease = (data) => Ajax.post('namereservation/NameRelease', data);

export const generateProcessTicket = (data) => Ajax.post('webuser/generateProcessTicket',data); 