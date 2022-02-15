import Ajax from "Utils/ajax";

export const getEntityType = (data) => Ajax.post('list/entitytypebyprocess', data);

export const getStatuses = (data) => Ajax.post('list/fetchFilterStatusList', data);

export const getList = (data) => Ajax.post('namereservation/v1/getapprovedlist', data);

export const getEntityById = (id) => Ajax.get(`namereservation/getdetails/${id}`);

export const getPcWeb = (data) => Ajax.post('webuser/tasks/ticket/getpcweb',data); 