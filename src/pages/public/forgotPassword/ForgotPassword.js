import Ajax from "Utils/ajax";

export const ForgotPassword = (data) => Ajax.post("webuser/checkUser",data);