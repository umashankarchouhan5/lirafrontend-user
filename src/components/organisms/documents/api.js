import Ajax from 'Utils/ajax';

export const uploadFile = (data) => Ajax.post(`webuser/file/upload`, data, { 'Content-Type': 'multipart/form-data' });

export const uploadFileAdditional = (data) => Ajax.post(`webuser/additionalfile/upload`, data, { 'Content-Type': 'multipart/form-data' });

export const getTaskDocuments = (data) => Ajax.post(`webuser/tasks/get/documents`, data);

export const deleteAdditionalDocument  = (data) => Ajax.post(`webuser/deleteAdditionalDocument `, data);


