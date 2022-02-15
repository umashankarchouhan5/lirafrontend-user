import Ajax from 'Utils/ajax';

export const getNotification = (data) => Ajax.post("list/FetchNotificationWeb",data);

export const getNotificationCount = () => Ajax.post("webuser/getNotificationCountWeb");

export const readNotificationWeb = (data) => Ajax.post("webuser/ReadNotificationWeb",data);

export const ticketToProcess = (data) => Ajax.post("webuser/TicketToProcess",data);