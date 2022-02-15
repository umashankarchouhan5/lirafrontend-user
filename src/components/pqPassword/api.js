import Ajax from "Utils/ajax";

export const validatePQpwd = (data) => Ajax.post('pqform/validatePQpwd',data);
export const pqForgotPassword = (data) => Ajax.post("pqform/pqForgotPassword",data);
