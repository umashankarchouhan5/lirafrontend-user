import Ajax from "Utils/ajax";


export const getGenericUserTask = (data) => Ajax.post('list/fetchGenericWebUserTask', data);

export const getEntityType = (data) => Ajax.post('list/entitytypebyprocess', data);

export const getStatuses = (data) => Ajax.post('list/fetchFilterStatusList', data);

export const getList = (data) => Ajax.post('namereservation/v1/getlist', data);

export const getEntityById = (id) => Ajax.get(`namereservation/getdetails/${id}`);

export const deleteEntityByIds = (data) => Ajax.post(`namereservation/multipledelete`, data);

export const addEntity = (data) => Ajax.post(`namereservation/create`, data, { 'Content-Type': 'multipart/form-data' });

export const updateEntity = (data) => Ajax.post(`namereservation/updatedetails`, data, { 'Content-Type': 'multipart/form-data' });

export const submitPending = (data) => Ajax.post('namereservation/pendingtosubmit', data);

export const bulkUploadFiles = (data, config) => Ajax.post('namereservation/importexcel', data, { 'Content-Type': 'multipart/form-data' }, config);

export const resubmitTicket = (data) => Ajax.post('namereservation/resubmitticket', data);

export const bulkUploadFilesEntity = (data, config) => Ajax.post('namereservation/importexcelSingleEntityType', data, { 'Content-Type': 'multipart/form-data' }, config);

export const getPcWeb = (data) => Ajax.post('webuser/tasks/ticket/getpcweb',data); 

export const processNamereservation = (data) => Ajax.post('namereservation/processNamereservation',data); 