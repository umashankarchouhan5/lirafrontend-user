import Ajax from "Utils/ajax";

export const getFilteredData = (data) => Ajax.post('list/fetchGenericWebUserTask', data);

export const getStatuses = (data) => Ajax.post('list/fetchFilterStatusList', data);

export const getEntityType = (data) => Ajax.post('list/entitytypebyprocess', data);