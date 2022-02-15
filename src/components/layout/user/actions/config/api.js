import Ajax from "Utils/ajax";

// export const getActions = (data) =>Ajax.post('webuser/ReviewActionWeb',data);
export const getActions = (data) =>Ajax.post('webuser/ReviewFSAActionWeb',data);

export const markDone = (data) => Ajax.post('webuser/ActionDoneByWebuser',data);

