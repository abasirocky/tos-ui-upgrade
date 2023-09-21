import Vue from "vue";
import Router, { createRouter, createWebHashHistory } from "vue-router";
import jwtService from "@/core/services/jwt.service";



export const router = createRouter({
  history: createWebHashHistory('/'),
  routes: [
    {
      path: '/vessel-profile/:id',
      name: 'vessel profile',
      component: () => import ("@/view/pages/vesselProfile/vesselProfile.vue")
    },
    {
      path: "/custom-error",
      name: "error",
      component: () => import("@/view/pages/error/Error.vue"),
      children: [
        {
          path: "error-1",
          name: "error-1",
          component: () => import("@/view/pages/error/Error-1.vue"),
        },
        {
          path: "error-2",
          name: "error-2",
          component: () => import("@/view/pages/error/Error-2.vue"),
        }, 
        {
          path: "error-3",
          name: "error-3",
          component: () => import("@/view/pages/error/Error-3.vue"),
        },
        {
          path: "error-4",
          name: "error-4",
          component: () => import("@/view/pages/error/Error-4.vue"),
        },
        {
          path: "error-5",
          name: "error-5",
          component: () => import("@/view/pages/error/Error-5.vue"),
        },
        {
          path: "error-6",
          name: "error-6",
          component: () => import("@/view/pages/error/Error-6.vue"),
        },
      ],
    },
    {
      path: "/berthplanningSVG",
      name: "berthplanningSVG",
      component: () =>
        import("@/view/pages/berthplanning/BerthPlanningSVG.vue"),
    },
    {
      path: "/berthmonitoring",
      name: "berthmonitoring",
      component: () =>
        import("@/view/pages/berthmonitoring/BerthMonitoring.vue"),
    },
    {
      path: "*",
      redirect: "/404",
    },
    {
      // the 404 route, when none of the above matches
      path: "/404",
      name: "404",
      component: () => import("@/view/pages/error/Error-1.vue"),
    },
  ],
});
