import Ajax from "Utils/ajax";

export const getList = (data) => Ajax.post('pqform/getPQFitRequestlist', data);

export const submitForAssessment = (data) => Ajax.post('pqform/submitPQfitrequest', data);

export const fetchPQPosition = () => Ajax.get('pqform/fetchPQposition');

export const getCompanyList = (data) => Ajax.post('list/getcompanylist', data);

export const searchForPQ = (data) => Ajax.post('pqform/fetchPQSearch', data);

export const getFilteredData = (data) => Ajax.post('list/fetchGenericWebUserTask', data);

export const getStatuses = (data) => Ajax.post('list/fetchWebFilterStatusList', data);
