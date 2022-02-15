import Ajax from "Utils/ajax";

export const getLegalEntitiesList = (data) => Ajax.post('company/getLegalEntities',data);

export const createEntity = (data) => Ajax.post('company/createLegalEntity',data);
