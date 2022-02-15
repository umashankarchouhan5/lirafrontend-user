import Ajax from "Utils/ajax";

export const getFilteredData = (data) => Ajax.post('list/fetchGenericWebUserTask', data);

// export const getTasks = (data) => Ajax.post('list/fetchAllWebUserTask', data);

export const getStatuses = (data) => Ajax.post('list/fetchWebFilterStatusList', data);

export const getEntityType = (data) => Ajax.post('list/entitytype', data);

export const getProcesses = (id) => Ajax.get(`list/fetchAllProcessesByProcessType/${id}`);

export const getProcessTypes = () => Ajax.get('list/fetchDefinitionChildrenByName/ProcessType');

export const deleteApi = (data) => Ajax.post('webuser/tasks/delete', data);
