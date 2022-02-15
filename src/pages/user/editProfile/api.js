import Ajax from 'Utils/ajax';

export const fetchSignUpPurposes = () => Ajax.get("list/fetchSignUpPurposes");

export const fetchUser = (data) => Ajax.post("webuser/userdetails", data);

export const updateUser = (data) => Ajax.post("webuser/updatedetails", data);

