import Vue from "vue";

export const alert = {
    namespaced: true,
    state: {
        type: null,
        message: null
    },
    actions: {
        success({ commit }, message) {
            commit('success', message);
        },
        error({ commit }, message) {
            Vue.$log.debug("Enter");

            commit('error', message);
        },
        clear({ commit }) {
            commit('clear');
        }
    },
    mutations: {
        success(state, message) {
            state.type = 'success';
            state.message = message;
        },
        error(state, message) {
            state.type = 'danger';
            state.message = message;
        },
        clear(state, message) {
            state.type = null;
            state.message = null;
        },
    }
}