import Ajax from 'Utils/ajax';

export const verifyEmailPQ = (data,token) => Ajax.post('webuser/verifyEmailPQ',data,{ Authorization: token }); 

export const updatePqEmail = (data,token) => Ajax.post('webuser/updatePqEmail',data, {Authorization: token}); 