import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate"

import { alert } from './alertModule';
import { authentication } from './authModule';
import { userStore } from './userModule';

Vue.use(Vuex);

export const store = new Vuex.Store({
    modules: {
        alert,
        authentication,
        userStore
    },
    plugins: [createPersistedState()]
});