import Ajax from "Utils/ajax";

export const getICSPforCompany = (data) => Ajax.post('company/getICSPforCompany',data);

export const getExcludedCompany = (data) => Ajax.post('company/searchCompanyExclude',data); 

export const getCompany = (data) => Ajax.post('list/getcompanysearch', data);

export const getEntityType = (data) => Ajax.post('list/entitytypebyprocess', data);
