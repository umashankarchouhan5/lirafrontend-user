import Ajax from "Utils/ajax";

export const getEntityType = (data) => Ajax.post('list/entitytypebyprocess', data);

export const getStatuses = (data) => Ajax.post('list/fetchFilterStatusList', data);

export const getChangeList = (data) => Ajax.post('list/getChangeRequestList', data);

export const getFilteredData = (data) => Ajax.post('list/fetchGenericWebUserTask', data);