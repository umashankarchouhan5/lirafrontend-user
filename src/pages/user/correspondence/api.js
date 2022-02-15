import Ajax from "Utils/ajax";

//export const getCompanyStatus = () => Ajax.get('list/getCompanyStatusList/131'); // later

export const getEntityType = (data) => Ajax.post('list/entitytype', data);

export const getCompanies = () => Ajax.get('list/getcompanies');

export const searchICSPTypes = () => Ajax.get('misc/icsplist');

export const getCorrespondenceList = (data) => Ajax.post('list/getCorrespondencelist', data);