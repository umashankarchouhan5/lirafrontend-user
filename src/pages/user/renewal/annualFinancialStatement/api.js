import Ajax from 'Utils/ajax';

export const fetchSample = (data) => Ajax.post('webuser/fetchSample',data);

export const excelReturnUpload = (data) => Ajax.post('webuser/excelReturnUpload',data);

export const fetchNextExcelReturnDue = (data) => Ajax.post('webuser/fetchNextExcelReturnDue',data);

export const fetchICSPLicenseList = (data) => Ajax.post('list/fetchICSPLicenseList', data);
