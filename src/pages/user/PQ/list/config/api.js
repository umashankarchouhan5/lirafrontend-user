import Ajax from "Utils/ajax";

export const getList = (data) => Ajax.post('pqform/getPQlistwithAssessment', data);

export const submitForAssessment = (data) => Ajax.post('pqform/submitPQfitrequest', data);

export const fetchPQPosition = () => Ajax.get('pqform/fetchPQposition');
 

export const validatePQpwd = (data) => Ajax.post('pqform/validatePQpwd',data);

export const associateFreePQ = (data) => Ajax.post('pqform/associateFreePQ',data);