import Vue from "vue";

class Event {
  constructor(vue) {
    this.vue = new Vue();
  }
  fire(name, callback) {
    this.vue.$emit(name, callback);
  }
  subscribe(name, callback) {
    this.vue.$on(name, callback);
  }
  unsubscribe(name, callback) {
    this.vue.$off(name, callback);
  }
}

export default new Event(Vue);
