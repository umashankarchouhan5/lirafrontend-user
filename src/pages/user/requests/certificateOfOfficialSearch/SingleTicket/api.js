import Ajax from 'Utils/ajax';

export const requestByWebUser = (data) => Ajax.post('company/requestByWebuser',data);

export const generateProcessTicket = (data) => Ajax.post('webuser/generateProcessTicket',data); 
 
export const getPcWeb = (data) => Ajax.post('webuser/tasks/ticket/getpcweb',data); 

export const generateInvoice = (data) => Ajax.post('webuser/GenerateTicketInvoice',data);

export const getTicket = (data) => Ajax.post('webuser/tasks/get/data', data);

// export const getEntityType = () => Ajax.get('list/getSubEntity');

export const getEntityType = (data) => Ajax.post('list/entitytypebyprocess', data);

