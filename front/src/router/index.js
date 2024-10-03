import Vue from "vue";
import VueRouter from "vue-router";
import jwt_decode from "jwt-decode";
import HomeView from "@/views/HomeView.vue";
import AdminDashboard from "@/views/AdminDashboard.vue";
import UserDashboard from "@/views/UserDashboard.vue";
import RegisterView from "@/views/RegisterView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },

  {
    path: "/admin",
    name: "AdminDashboard",
    component: AdminDashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/user",
    name: "UserDashboard",
    component: UserDashboard,
    meta: { requiresAuth: true },
  },

  {
    path: "/register",
    name: "Register",
    component: RegisterView,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.path === "/") {
    localStorage.removeItem("token");
  }
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        jwt_decode(token);
        next();
      } catch (error) {
        next({ name: "Home" });
      }
    } else {
      next({ name: "Home" });
    }
  } else {
    next();
  }
});

export default router;
