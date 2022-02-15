import Ajax from "Utils/ajax";

export const VerifyEmail = (data,token) => Ajax.post("webuser/verifyEmail",data,{ Authorization: token });