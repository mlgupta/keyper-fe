/****************************************************************************
*                       Confidentiality Information                         *
*                                                                           *
* This module is the confidential and proprietary information of            *
* DBSentry Corp.; it is not to be copied, reproduced, or transmitted in any *
* form, by any means, in whole or in part, nor is it to be used for any     *
* purpose other than that for which it is expressly provided without the    *
* written permission of DBSentry Corp.                                      *
*                                                                           *
* Copyright (c) 2020-2021 DBSentry Corp.  All Rights Reserved.              *
*                                                                           *
****************************************************************************/
import VueRouter from "vue-router";
import Vue from "vue";
import { store } from '@/_store'
import { isValidJwt, getUserClaims } from "@/_helpers";
import { authService } from '@/_helpers';

import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";
import LoginLayout from "@/pages/Layout/LoginLayout.vue";

// import Dashboard from "@/pages/Dashboard.vue";
import Login from "@/pages/Login.vue";
import Logout from "@/pages/Logout.vue";
import Users from "@/pages/Users/Users.vue";
import AddUser from "@/pages/Users/AddUser.vue";
import User from "@/pages/Users/User.vue";
import Hosts from "@/pages/Hosts/Hosts.vue";
import Host from "@/pages/Hosts/Host.vue";
import AddHost from "@/pages/Hosts/AddHost.vue";
import Groups from "@/pages/Groups/Groups.vue";
import Group from "@/pages/Groups/Group.vue";
import AddGroup from "@/pages/Groups/AddGroup.vue";
// import UserDetail from "@/pages/UserProfile/UserCard.vue";
import UserDetail from "@/pages/UserProfile/UserDetail.vue";
import Unauthorized from "@/pages/Unauthorized.vue";

const Role = {
  Admin: 'keyper_admin',
  User: 'keyper_user'
};

const routes = [
  {
    path: "/",
    component: LoginLayout,
    //meta: { authorize: [] },
    redirect: "/user/home",
    children: [
      {
        path: "login",
        name: "Login",
        component: Login,
        //meta: { authorize: [] }
      },
      {
        path: "logout",
        name: "Logout",
        component: Logout,
        meta: { authorize: [Role.Admin, Role.User] }
      }
    ]
  },
  {
    path: "/user",
    component: DashboardLayout,
    //meta: { authorize: [] },
    children: [
      {
        path: "home",
        name: "Home",
        meta: { authorize: [Role.Admin, Role.User] }
      },
      {
        path: "unauthorized",
        name: "Unauthorized",
        component: Unauthorized,
        //meta: { authorize: [] }
      },
      {
        path: "profile/:id",
        name: "Profile",
        component: UserDetail,
        meta: { authorize: [Role.Admin, Role.User] }
      }
    ]
  },
  {
    path: "/admin",
    component: DashboardLayout,
    redirect: "/admin/users",
    meta: { authorize: [Role.Admin] },
    children: [
      // {
      //   path: "dashboard",
      //   name: "Dashboard",
      //   component: Dashboard
      // },
      {
        path: "adduser",
        name: "AddUser",
        meta: { authorize: [Role.Admin] },
        component: AddUser
      },
      {
        path: "users",
        name: "Users",
        meta: { authorize: [Role.Admin] },
        component: Users
      },
      {
        path: "users/:id",
        name: "User",
        meta: { authorize: [Role.Admin] },
        component: User
      },
      {
        path: "hosts",
        name: "Hosts",
        meta: { authorize: [Role.Admin] },
        component: Hosts
      },
      {
        path: "hosts/:id",
        name: "Host",
        meta: { authorize: [Role.Admin] },
        component: Host
      },
      {
        path: "addhost",
        name: "AddHost",
        meta: { authorize: [Role.Admin] },
        component: AddHost
      },
      {
        path: "groups",
        name: "Groups",
        meta: { authorize: [Role.Admin] },
        component: Groups
      },
      {
        path: "groups/:id",
        name: "Group",
        meta: { authorize: [Role.Admin] },
        component: Group
      },
      {
        path: "addgroup",
        name: "AddGroup",
        meta: { authorize: [Role.Admin] },
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
  const { authorize } = to.meta;

  if (authorize) {
    Vue.$log.debug("URL requires authorization: " + JSON.stringify(authorize));

    if (loggedIn) {
      Vue.$log.debug("User is loggedIn");
      const user = JSON.parse(loggedIn);
      Vue.$log.debug("user: " + JSON.stringify(user));

      const jwt = user.access_token;
    
      Vue.$log.debug("JWT: " + jwt);
    
      if (isValidJwt(jwt)) {
        Vue.$log.debug("JWT is Valid");
        const userRole = getUserClaims(jwt);
        Vue.$log.debug("userRole: " + userRole);

        if (authorize.length && !authorize.includes(userRole)) {
          Vue.$log.debug("User is not authorized to access URL: " + to.path);
          return next({ name: "Unauthorized" });
        } else if (to.path === '/') {
          return next({ name: "Home" });
        } else if (to.path === '/user/home') {
          if (userRole == Role.Admin) {
            Vue.$log.debug("keyper_admin sending user to /admin/users");
            return next({ name: "Users" });
          } else {
            Vue.$log.debug("keyper_user sending user to /user/profile");
            var userGet = {};
            userGet.cn = user.cn;

            store.dispatch('userStore/getUser', { userGet })
              .then(response => {
                return next({ name: "Profile", params: { id: user.cn }});
              }, error => {
              Vue.$log.debug("Error fetching user: " + user.cn);
              return next({ name: "Login" });
            });
          }
        }
      }
      else {
        Vue.$log.debug("JWT Token Expired. Sending user to login");
       return next({ name: "Login" });
      }
    }
    else {
      return next({ name: "Login" });
    }
  }
  next();
})



