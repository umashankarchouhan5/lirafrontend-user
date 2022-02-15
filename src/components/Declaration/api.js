import Ajax from 'Utils/ajax';

export const fetchDeclaration = (data) => Ajax.post(`list/FetchDeclaration`, data);

export const addDeclaration = (data) => Ajax.post(`webuser/AddDeclaration`, data);


