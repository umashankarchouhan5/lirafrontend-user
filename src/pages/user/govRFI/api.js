import Ajax from "Utils/ajax";

export const getRFIType = () => Ajax.get('list/fetchDefinitionChildrenByName/RFIType');

export const getRFINature = () => Ajax.get('list/fetchDefinitionChildrenByName/RFINature');

export const rfiRequest = (data) => Ajax.post('webuser/RFIrequest',data);
  
export const generateProcessTicket = (data) => Ajax.post('webuser/generateProcessTicket',data); 