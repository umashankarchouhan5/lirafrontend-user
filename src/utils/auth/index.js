import store from '../../store'

class Auth {
    constructor() {
        this.isLogged = false;
        this.user = null;
    }
    isUserLogged() {
        return this.isLogged;
    }
    logUser(data) {
        // localStorage.setItem('userData', JSON.stringify(data));
        localStorage.setItem('userData',JSON.stringify(data));
        this.user = data;
        store.commit('setUser', data);
        this.isLogged = true;
    }
    checkUser() {
        const data = localStorage.getItem('userData');
        if (data) {
            this.logUser(JSON.parse(data))
        }
    }
    getUserToken() {
        if (this.isLogged) {
            return this.user.token;
        }
    }
    logoutUser() {
        localStorage.removeItem('userData');
        if(localStorage.personData){
            localStorage.removeItem('personData');
        }
        if(localStorage.invoice_idstring){
            localStorage.removeItem("invoice_idstring");
        }
        if(localStorage.formCheck){
            localStorage.removeItem("formCheck");
        }
        if(localStorage.invoiceData){
            localStorage.removeItem("invoiceData");
        }
        if(localStorage.Data){
            localStorage.removeItem("Data");
        }
        
        if(localStorage.pathToReturn){
            localStorage.removeItem("pathToReturn");
        }
        store.commit('removeUser');
        this.user = null;
        this.isLogged = false;
    }
}

export default new Auth();
