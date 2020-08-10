import VueRouter from "vue-router";
import Vue from "vue";
import { isValidJwt } from "../_helpers";

import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";
import LoginLayout from "@/pages/Layout/LoginLayout.vue";

import Dashboard from "@/pages/Dashboard.vue";
import Login from "@/pages/Login.vue";
import Logout from "@/pages/Logout.vue";
import Users from "@/pages/Users.vue";
import AddUser from "@/pages/AddUser.vue";
import User from "@/pages/User.vue";
import Hosts from "@/pages/Hosts.vue";
import Host from "@/pages/Host.vue";
import AddHost from "@/pages/AddHost.vue";
import Groups from "@/pages/Groups.vue";
import Group from "@/pages/Group.vue";
import AddGroup from "@/pages/AddGroup.vue";

const routes = [
  {
    path: "/",
    component: LoginLayout,
    //redirect: "/login",
    children: [
      {
        path: "login",
        name: "Login",
        component: Login
      },
      {
        path: "logout",
        name: "Logout",
        component: Logout
      }

    ]
  },
  {
    path: "/admin",
    component: DashboardLayout,
    redirect: "/admin/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard
      },
      {
        path: "adduser",
        name: "AddUser",
        component: AddUser
      },
      {
        path: "users",
        name: "Users",
        component: Users
      },
      {
        path: "users/:id",
        name: "User",
        component: User
      },
      {
        path: "hosts",
        name: "Hosts",
        component: Hosts
      },
      {
        path: "hosts/:id",
        name: "Host",
        component: Host
      },
      {
        path: "addhost",
        name: "AddHost",
        component: AddHost
      },
      {
        path: "groups",
        name: "Groups",
        component: Groups
      },
      {
        path: "groups/:id",
        name: "Group",
        component: Group
      },
      {
        path: "addgroup",
        name: "AddGroup",
        component: AddGroup
      }
    ]
  }
];

// configure router
export const router = new VueRouter({
  mode: 'history',
  routes, // short for routes: routes
  linkExactActiveClass: "nav-item active"
});

//export default routes;

router.beforeEach((to, from, next) => {
  // Redirect to login page if not logged in
  Vue.$log.debug("Enter");

  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');

  if (authRequired) {
    if (loggedIn) {
      const user = JSON.parse(loggedIn);

      const jwt = user.access_token;
    
      Vue.$log.debug("JWT: " + jwt);
    
      if (isValidJwt(jwt)) {
        if (to.path === '/') {
          next("/admin/dashboard");
        }
        else {
          next();
        }
      }
      else {
        Vue.$log.debug("JWT Token Expired");
        return next('/login');
      }
    }
    else {
      return next('/login');
    }
  }
  else {
    next();
  }
})



