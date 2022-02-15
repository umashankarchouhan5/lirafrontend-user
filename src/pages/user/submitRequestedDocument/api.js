import Ajax from "Utils/ajax";

export const getRegisteredDocumentList = (data) => Ajax.post('list/getRegisteredDocumentList', data);

export const getRegisteredDocumentForTicketReference = (data) => Ajax.post('list/getRegisteredDocumentForTicketReference', data);

export const upload = (data) => Ajax.post('webuser/registerDocument/upload', data);
    