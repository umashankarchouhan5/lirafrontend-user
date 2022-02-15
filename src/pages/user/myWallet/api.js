import Ajax from "Utils/ajax";

export const getWebuserWallet = (data) => Ajax.post('webuser/getWebuserWallet',data);
export const totalPayAmountForWallet = (data) => Ajax.post('webuser/totalPayAmountForWallet',data);
export const PaymentConfirmation = (data) => Ajax.post('webuser/PaymentConfirmation',data);
export const fetchClientLedger = (data) => Ajax.post('webuser/fetchClientLedger',data);
export const exportWalletTransactionHistory = (data) => Ajax.post('webuser/exportWalletTransactionHistory',data);
export const checkWalletBalance = (data) => Ajax.post('webuser/checkWalletBalance',data);
export const addLowBalanceThreshold = (data) => Ajax.post('webuser/addLowBalanceThreshold',data);
export const getLicenseThreshold = (data) => Ajax.post('webuser/getLicenseThreshold',data);