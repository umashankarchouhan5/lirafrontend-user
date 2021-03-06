import Vue from "vue";
import VueRouter from "vue-router";

import beforeEach from "./hooks/beforeEach";
import routes from "./routes";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes,
});

router.beforeEach(beforeEach);

export default router;
