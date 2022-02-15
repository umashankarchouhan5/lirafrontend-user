import Ajax from 'Utils/ajax';

export const getTicket = (data) => Ajax.post('webuser/tasks/get/data', data);

export const rejectedDocuments = (data) => Ajax.post('webuser/tasks/get/rejectedDocuments  ', data);

export const fetchCommentLog = (data) => Ajax.post(`webuser/commentLog`, data);

export const getAdditionalDocuments = (data) => Ajax.post(`webuser/getAdditionalDocument`, data);

export const submitRFIResponse = (data) => Ajax.post(`webuser/submitRFIResponse`, data);

export const uploadFile = (data) => Ajax.post(`webuser/file/upload`, data, { 'Content-Type': 'multipart/form-data' });

export const uploadFileAdditional = (data) => Ajax.post(`webuser/additionalfile/upload`, data, { 'Content-Type': 'multipart/form-data' });

export const deleteAdditionalDocument  = (data) => Ajax.post(`webuser/deleteAdditionalDocument `, data);