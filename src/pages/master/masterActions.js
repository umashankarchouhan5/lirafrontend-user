import Ajax from "Utils/ajax";

export const getCountries = () => Ajax.get("public/fetchAllCountriesforSignup");

export const getCurrencies = () => Ajax.get("list/fetchCurrencies");

export const getJurisdictions = () => Ajax.get("list/fetchjurisdictions");

export const uploadFile = (data) => Ajax.post(`webuser/file/upload`, data, { 'Content-Type': 'multipart/form-data' });

export const uploadFileAdditional = (data) => Ajax.post(`webuser/additionalfile/upload`, data, { 'Content-Type': 'multipart/form-data' });

export const getAddressById = (address_id) => Ajax.post(`webuser/getaddress`, { address_id });

export const addUpdateAddressRequest = (data) => Ajax.post('webuser/addUpdateAddress', data);

export const getEntityList = () => Ajax.get('misc/entitylist');

export const getTicket = (data) => Ajax.post('webuser/tasks/get/data', data);

export const refreshToken = () => Ajax.get("list/refreshToken");

export const logoutRequest = data => Ajax.post("admin/logout", data);

export const getPcWeb = (data) => Ajax.post('webuser/tasks/ticket/getpcweb',data); 

//fetch license
export const fetchICSPLicenseList = (data) => Ajax.post('list/fetchICSPLicenseList', data);

export const saveLastLicenseId = (data) => Ajax.post('webuser/saveLastLicenseId', data);