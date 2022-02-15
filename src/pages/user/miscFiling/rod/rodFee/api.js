import Ajax from 'Utils/ajax';

export const getRODFeeData = (data) => Ajax.post('company/getRODFeeData',data);

export const GenerateTicketInvoice = (data) => Ajax.post('webuser/GenerateTicketInvoice',data);