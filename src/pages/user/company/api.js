import Ajax from "Utils/ajax";

export const getCompanyStatus = () => Ajax.get('list/getCompanyStatusList/101');  //Changed from 131 to 101 :Vivek

export const getICSP = (id) => Ajax.get(`misc/icsplist`);

// export const getEntityType = (data) => Ajax.post('list/entitytype', data);

export const getCompanies = (data) => Ajax.post('list/getcompanylist', data);

export const getEntityType = (data) => Ajax.post('list/entitytypebyprocess', data);
