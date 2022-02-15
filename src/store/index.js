import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import menu from "./modules/menu";
import common from "./modules/common";
import invoice from "Components/layout/user/payment/store/invoice";
import notification from 'Components/layout/user/notificationStore';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    user,
    menu,
    common,
    invoice,
    notification
  }
});
