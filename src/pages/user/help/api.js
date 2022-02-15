import Ajax from "Utils/ajax";

export const getHelpText = (data) => Ajax.post('webuser/processhelptext', data);
