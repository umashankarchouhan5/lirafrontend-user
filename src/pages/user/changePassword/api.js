import Ajax from 'Utils/ajax';

export const changePassword = (data) => Ajax.post("webuser/change_password", data);




