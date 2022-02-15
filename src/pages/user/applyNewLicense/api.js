import Ajax from "Utils/ajax";

export const fetchSignUpPurposes = () => Ajax.get("list/fetchSignUpPurposes");

export const fetchUrlsByRegPurpose = (data) => Ajax.get(`list/fetchUrlsByRegPurpose/${data.regPurpose_id}`);