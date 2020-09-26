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
import axios from "axios";
import Vue from "vue";
import { refreshAuthHeader } from './auth_header';
import { getUserClaims } from "@/_helpers";

export const authService = {
    login,
    logout,
    refreshJWT
};

function login(username, password) {
    return axios.post(process.env.VUE_APP_API_URL + "/login", {
        username: username,
        password: password
      })
        .then(response => {
            const user = response.data;
            if (user.access_token) {
                user.role = getUserClaims(user.access_token);
                Vue.$log.debug("Saving user data to local storage");
                localStorage.setItem('user', JSON.stringify(user));
            }
            return user;
        })
        .catch(err => {
            Vue.$log.error("Login Failure: ");

            var error = '';

            if (err.response) {
                Vue.$log.error("err.response: " + JSON.stringify(err.response));
                error = err.response.data.msg;
            }
            else if (err.request) {
                Vue.$log.error("err.request: " + err.request);
                error = err.request;
            }
            else {
                Vue.$log.error("err.message: " + err.message);
                error = err.message;
            }
            Vue.$log.debug("error: " + error);
            return Promise.reject(error);
        });
}

function logout() {
    localStorage.removeItem('user');
}

function refreshJWT() {
    Vue.$log.debug("Enter");

    const config = {
        headers: refreshAuthHeader()
    }
    Vue.$log.debug("Getting JWT Refresh Token");
    return axios.post(process.env.VUE_APP_API_URL + "/refresh", {}, config)
        .then(response => {
            Vue.$log.debug("Got new Refresh Token");
            const user = JSON.parse(localStorage.getItem('user'));

            const access_token = response.data.access_token;
            if (access_token) {
                user.access_token = access_token;
                user.role = getUserClaims(user.access_token);
                Vue.$log.debug("Saving user data to local storage");
                localStorage.setItem('user', JSON.stringify(user));
            }
            return access_token;
        })
        .catch(err => {
            Vue.$log.error("refresh JWT Failure: ");

            var error = '';

            if (err.response) {
                Vue.$log.error("err.response: " + JSON.stringify(err.response));
                error = err.response.data.msg;
            }
            else if (err.request) {
                Vue.$log.error("err.request: " + err.request);
                error = err.request;
            }
            else {
                Vue.$log.error("err.message: " + err.message);
                error = err.message;
            }
            Vue.$log.debug("error: " + error);
            return Promise.reject(error);
        });
   /*
   const response = await axios.post(process.env.VUE_APP_API_URL + "/refresh", {}, config);
   Vue.$log.debug("Got new Refresh Token");
   const user = JSON.parse(localStorage.getItem('user'));

   const access_token = response.data.access_token;
   if (access_token) {
       user.access_token = access_token;
       Vue.$log.debug("Saving user data to local storage");
       localStorage.setItem('user', JSON.stringify(user));
   }
   return access_token;
   */
}

