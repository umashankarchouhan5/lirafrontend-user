import Ajax from "Utils/ajax";

export const setPasswordPQ = (data) => Ajax.post("pqform/changePasswordPQ",data);