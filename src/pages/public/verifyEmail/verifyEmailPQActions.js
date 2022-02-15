import Ajax from "Utils/ajax";

export const VerifyEmailPQ = (data,token) => Ajax.post("webuser/verifyEmailPQ",data,{ Authorization: token });