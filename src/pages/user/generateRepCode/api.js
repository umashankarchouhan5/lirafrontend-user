import Ajax from "Utils/ajax";

export const generateRepCode = () => Ajax.get('webuser/generateRepCode');
