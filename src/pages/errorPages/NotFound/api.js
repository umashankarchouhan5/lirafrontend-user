import Ajax from "Utils/ajax";

export const getLogo = (data) => Ajax.post('configs/getCompanyLogo', data, { Authorization: 'Lira' });