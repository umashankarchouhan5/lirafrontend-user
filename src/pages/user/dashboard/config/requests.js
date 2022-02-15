import Ajax from 'Utils/ajax';

export const getDashboard = () => Ajax.post("webuser/getDashboardWeb")

export const updateFinancialYear = (data) => Ajax.post("webuser/updateFinancialYear",data)