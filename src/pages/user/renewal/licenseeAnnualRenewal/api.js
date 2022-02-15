import Ajax from 'Utils/ajax';

export const annualLicenseRenewalRequest  = (data) => Ajax.post('webuser/annualLicenseRenewalRequest ',data);

export const getNextAnnualLicenseRenewal = (data) => Ajax.post('webuser/getNextAnnualLicenseRenewal',data);

export const generateProcessTicket = (data) => Ajax.post('webuser/generateProcessTicket',data); 

export const generateInvoice = (data) => Ajax.post('webuser/GenerateTicketInvoice',data);

export const fetchNextExcelReturnDue = (data) => Ajax.post('webuser/fetchNextExcelReturnDue',data);

export const fetchICSPLicenseList = (data) => Ajax.post('list/fetchICSPLicenseList', data);
