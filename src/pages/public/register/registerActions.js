import Ajax from "Utils/ajax";

export const fetchSignUpPurposes = () => Ajax.get("list/fetchSignUpPurposes");

export const createUser = (data) => Ajax.post("webuser/createuser", data);

export const verifyOTPRequest = (data) => Ajax.post("webuser/verifySignUpOTP", data);

export const resendOTPRequest = (data) => Ajax.post("webuser/resendOTP", data);

export const deleteUserFromSignUp = (data) => Ajax.get(`webuser/deleteuserfromSignUp/${data.id}/${data.addressId}`, data);

export const fetchExternalCategoryByRegPurpos = (data) => Ajax.get(`list/fetchExternalCategoryByRegPurpose/${data.regPurpose_id}`);

export const checkSso = (data) => Ajax.post(`webuser/checkSso`,data);

