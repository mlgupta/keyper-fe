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
import { hostService } from '../_helpers';
import Vue from "vue";

export const hostStore = {
    namespaced: true,
    state: {
        all: []
    },
    getters: {
        getHostById: (state) => (id) => {
            Vue.$log.debug("In gethostbyID: " + id);
            return state.all.find(host => host.cn === id);
        },
    },
    actions: {
        getHosts({ dispatch, commit }) {
            commit('getHosts');

            hostService.getHosts()
                .then(
                    hosts =>  {
                        commit('getHostsSuccess', hosts);
                        commit('sortHosts', 'cn');
                    },
                    error => {
                        commit('getHostsFailure', error)
                        dispatch('alert/danger', "Error getting Host List", { root: true });
                    }
                );
        },
        updateHost({ dispatch, commit }, { host }) {
            Vue.$log.debug("In updatehost: " + JSON.stringify(host));
            hostService.updateHost(host)
                .then(
                    upd_host => {
                        commit('updateHostSuccess', upd_host);
                        dispatch('alert/success', "Host Saved", { root: true });
                    },
                    error => {
                        commit('updateHostFailure', error)
                        dispatch('alert/danger', "Update Host Error", { root: true });
                    }
                );
        },
        deleteHost({ dispatch, commit }, { hostDel }) {
            Vue.$log.debug("In deleteHost: " + JSON.stringify(hostDel));
            hostService.deleteHost(hostDel.cn)
                .then(
                    host => {
                        commit('deleteHostSuccess', host);
                        dispatch('alert/success', "Host(s) Deleted", { root: true });
                        dispatch('getHosts');
                    },
                    error => {
                        commit('deleteHostFailure', error)
                        dispatch('alert/danger', "Delete Host Error", { root: true });
                    }

                );
        },
        addHost({ dispatch, commit }, { host }) {
            Vue.$log.debug("Enter");
            Vue.$log.debug("host: " + JSON.stringify(host));
            hostService.createHost(host)
                .then(
                    add_host => {
                        commit('createHostSuccess', add_host)
                        dispatch('alert/success', "Host Added", { root: true });
                        dispatch('getHosts');
                    },
                    error => {
                        commit('createHostFailure', error);
                        dispatch('alert/danger', "Add Host Error", { root: true });
                    }

                );
        },
        resetState({ commit }) {
            commit('resetHosts');
        },
    },

    mutations: {
        getHosts(state) {
            Vue.$log.debug("getHosts Enter")
            state.all = [];
        },
        getHostsSuccess(state, hosts) {
            Vue.$log.debug("getHostsSuccess Enter")
            state.all =  hosts ;
        },
        getHostsFailure(state, error) {
            Vue.$log.debug("getHostsFailure Enter")

            state.all = { error };
        },
        updateHostSuccess(state, host) {
            Vue.$log.debug("updateHostsSuccess Enter");
            Vue.$log.debug("host: " + JSON.stringify(host));
            const index = state.all.findIndex((stateHost) => stateHost.cn === host.cn);
            state.all[index] = host.changes;
        },
        updateHostFailure(state, error) {
            Vue.$log.error("updateHostsFailure Enter")
        },
        deleteHostSuccess(state, host) {
            Vue.$log.debug("deleteHostsSuccess Enter");
            Vue.$log.debug("host: " + host);
            var hostDelCn = host.split(":")[1].trim();
            Vue.$log.debug("hostDelCn: " + hostDelCn);

            const index = state.all.findIndex((stateHost) => stateHost.cn === hostDelCn);
            Vue.$log.debug("index: " + index);

            if (index > -1 ) {
                state.all.splice(index,1);
            } 
        },
        deleteHostFailure(state, error) {
            Vue.$log.error("updateHostsFailure Enter")
        },
        createHostSuccess(state, host) {
            Vue.$log.debug("Enter");
            Vue.$log.debug("host: " + JSON.stringify(host));
            state.all.push(host);
        },
        createHostFailure(state, error) {
            Vue.$log.error("Enter")
        },
        resetHosts(state) {
            Vue.$log.debug("Enter")
            state.all = [];
        },
        sortHosts(state, sortKey) {
            Vue.$log.debug("Enter sortGroups");
            
            const hosts = state.all;
            hosts.sort((a,b) => {
                let compare = 0;
                if (a[sortKey] > b[sortKey]) {
                    compare = 1;
                } else if (a[sortKey] < b[sortKey]) {
                    compare = -1;
                }
                return compare;
            });
            state.all = hosts;
        }
    }
}