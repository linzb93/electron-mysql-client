import { createRouter, createWebHashHistory } from "vue-router";

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: () => import("./views/login/index.vue"),
    },
    {
      path: "/home",
      component: () => import("./views/home/index.vue"),
    },
  ],
});
