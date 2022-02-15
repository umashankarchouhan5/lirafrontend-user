import Ajax from "Utils/ajax";

export const loginRequest = data => Ajax.post("webuser/login", data);

export const getLogo = (data) => Ajax.post('configs/getCompanyLogo', data, { Authorization: 'Lira' });

export const logoutRequest = data => Ajax.post("webuser/logout", data);


