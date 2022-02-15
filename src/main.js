import Vue from "vue";
import VCharts from 'v-charts'
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "./styles/iview.less";
import "./styles/common.scss";

import Ajax from 'Utils/ajax'
import Auth from 'Utils/auth'
import Event from 'Utils/event'
import config from './config/base';
import eventsConfig from './config/events';
import DateUtil from 'Utils/dateUtil';
import './app/globalComponents';
import './app/validations';
import IdleVue from 'idle-vue'
import { RefreshTime } from "./config/defaultData";

// https://v-charts.js.org/#/en/bar
Vue.use(VCharts)

DateUtil.setFormat(config.dateFormat);
DateUtil.setFormatWithTime(config.dateFormatWithTime);
DateUtil.setFormatWithSlash(config.dateFormatWithSlash);
DateUtil.setFormatWithTime(config.timeFormat);
DateUtil.setFormatDateRange(config.dateRangeFormat);

Ajax.setRequestFail((data, isRequestStackEmpty) => {
  Event.fire(eventsConfig.requestError, data);
  if (isRequestStackEmpty) {
    Event.fire(eventsConfig.loading, false)
  }
});

Ajax.setRequestStart((isRequestStackEmpty) => {
  if (isRequestStackEmpty) {
    Event.fire(eventsConfig.loading, true)
  }
});

Ajax.setRequestDone((isRequestStackEmpty,data) => {
  if (isRequestStackEmpty) {
    Event.fire(eventsConfig.loading, false);
    if(data.can !== undefined && data.can === 0){
      Event.fire(eventsConfig.unauthorize, true)
    }
  }
});

Auth.checkUser();
Ajax.setBaseUrl(config.apiUrl);

if (Auth.isUserLogged()) {
  Ajax.setToken(Auth.getUserToken());
}

Vue.config.productionTip = false;

const eventsHub = new Vue();
Vue.use(IdleVue, {
  eventEmitter: eventsHub,
  store,
  idleTime: RefreshTime,
  startAtIdle: false,
})

new Vue({
  router,
  store,
  onIdle() {
    Event.fire('idleState', true);
  },
  onActive() {
    Event.fire('idleState', false);
  },
  render: h => h(App)
}).$mount("#app");
