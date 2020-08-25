import { authService } from '@/_helpers';
import { router } from '@/_helpers';
import Vue from "vue";

const user = JSON.parse(localStorage.getItem('user'));
const initialState = user ? { status: {loggedIn: true }, user } : { status: {}, user: null };

export const authentication = {
    namespaced: true,
    state: initialState,
    actions: {
        login({ dispatch, commit }, {username, password }) {
            commit('loginRequest', { username });

            authService.login(username, password)
                .then(
                    user => {
                        Vue.$log.debug("Login succesful");
                        commit('loginSuccess', user);
                        Vue.$log.debug("JWT Refresh Interval: " + process.env.VUE_APP_JWT_REFRESH_INTERVAL);
                        var intervalId = setInterval(function() {
                            dispatch('refreshJWT')
                                .then(response => {
                                    Vue.$log.debug("JWT Token Refreshed");
                                }, error => {
                                    Vue.$log.debug("Error refreshing token, sending user to login");
                                    dispatch('logout');
                                });
                            }, process.env.VUE_APP_JWT_REFRESH_INTERVAL);
                        commit('setIntervalSuccess', { intervalId: intervalId });
                    router.push({ name: "Home" });
                    },
                    error => {
                        Vue.$log.debug("Login Error: " + error);
                        commit('loginFailure', error);
                        dispatch('alert/error', error, { root: true });
                    }
                );
        },
        logout({ commit }) {
            authService.logout();
            commit('logout');
        },
        refreshJWT({ dispatch, commit }) {
            authService.refreshJWT()
                .then(
                    access_token => {
                        Vue.$log.debug("refresh JWT succesful");
                        commit('refreshJWTSuccess', access_token);
                        return access_token;
                    },
                    error => {
                        Vue.$log.error("JWT Refresh Error: " + error);
                        commit('refreshJWTFailure', error);
                        dispatch('authentication/logout');
                        dispatch('alert/error', error, { root: true });
                    }
                );
        },
        updateUser({ dispatch, commit }, { user }) {
            Vue.$log.debug("In updateUser authModule: " + JSON.stringify(user));
            commit('updateUserSuccess', user)
        },
    },
    mutations: {
        loginRequest(state, user) {
            state.status = { loggedIn: true };
            state.user = user;
        },
        loginSuccess(state, user) {
            state.status = { loggedIn: true };
            state.user = user;
        },
        loginFailure(state) {
            state.status = {};
            state.user = null;
        },
        setIntervalSuccess(state, interval) {
            state.status.intervalId =  interval.intervalId ;
        },
        logout(state) {
            Vue.$log.debug("Clearing interval");
            clearInterval(state.status.intervalId);
            Vue.$log.debug("Clearing state");
            state.status = {};
            state.user = null;
        },
        refreshJWTSuccess(state, access_token) {
            state.status.loggedIn =  true ;
            state.user.access_token = access_token;
        },
        refreshJWTFailure(state) {
            state.status = {};
            state.user = null;
        },
        updateUserSuccess(state, user) {
            Vue.$log.debug("authmodule updateUsersSuccess Enter");
            Vue.$log.debug("user: " + JSON.stringify(user));

            var changes = user.changes;

            for (let key in changes) {
                state.user[key] = changes[key];
            }
        },
    }
};