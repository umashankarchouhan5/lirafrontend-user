import Ajax from "Utils/ajax";

export const createIcspWebuser = (data) => Ajax.post('webuser/createIcspWebuser',data);

export const getIcspWebuserList = (data) => Ajax.post('webuser/getIcspWebuserList',data);

export const deleteIcspWebuser = (data) => Ajax.post('webuser/deleteIcspWebuser', data);

export const fetchSignUpPurposes = () => Ajax.get("list/fetchSignUpPurposes");
