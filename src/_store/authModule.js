import { authService } from '../_helpers';
import { router } from '../_helpers';
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
                        router.push('/admin/users');
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
        }
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
        logout(state) {
            state.status = {};
            state.user = null;
        },
    }
}