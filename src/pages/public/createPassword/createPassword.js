import Ajax from "Utils/ajax";

export const setPassword = (data) => Ajax.post("webuser/setPassword",data);