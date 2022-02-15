import Ajax from "Utils/ajax";

export const getStatuses = (data) => Ajax.post('list/fetchFilterStatusList', data);

export const getList = (data) => Ajax.post('namereservation/v1/getlist', data);

export const createNewForm = (data) => Ajax.post('webuser/draftRequest', data);

