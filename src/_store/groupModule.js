import { groupService } from '../_helpers';
import Vue from "vue";

export const groupStore = {
    namespaced: true,
    state: {
        all: []
    },
    getters: {
        getGroupById: (state) => (id) => {
            Vue.$log.debug("In getGroupbyID: " + id);
            return state.all.find(group => group.cn.trim() === id.trim());
        }
    },
    actions: {        
        getGroups({ dispatch, commit }) {
            commit('getGroups');

            groupService.getGroups()
                .then(
                    groups => commit('getGroupsSuccess', groups),
                    error => {
                        commit('getGroupsFailure', error)
                        dispatch('alert/danger', "Error getting Group List", { root: true });
                    }
                );
        },
        updateGroup({ dispatch, commit }, { group }) {
            Vue.$log.debug("In updateGroup: " + JSON.stringify(group));
            groupService.updateGroup(group)
                .then(
                    upd_group => {
                        commit('updateGroupSuccess', upd_group);
                        dispatch('alert/success', "Group Saved", { root: true });
                    },
                    error => {
                        commit('updateGroupFailure', error)
                        dispatch('alert/danger', "Update Group Error", { root: true });
                    }
                );
        },
        deleteGroup({ dispatch, commit }, { groupDel }) {
            Vue.$log.debug("In deleteGroup: " + JSON.stringify(groupDel));
            groupService.deleteGroup(groupDel.cn)
                .then(
                    group => {
                        commit('deleteGroupSuccess', group);
                        dispatch('alert/success', "Group(s) Deleted", { root: true });
                    },
                    error => {
                        commit('deleteGroupFailure', error)
                        dispatch('alert/danger', "Delete Group Error", { root: true });
                    }

                );
        },
        addGroup({ dispatch, commit }, { group }) {
            Vue.$log.debug("Enter");
            Vue.$log.debug("group: " + JSON.stringify(group));
            groupService.createGroup(group)
                .then(
                    add_group => {
                        commit('createGroupSuccess', add_group)
                        dispatch('alert/success', "Group Added", { root: true });
                    },
                    error => {
                        commit('createGroupFailure', error);
                        dispatch('alert/danger', "Add Group Error", { root: true });
                    }

                );
        },
        resetState({ commit }) {
            commit('resetGroups');
        },
    },

    mutations: {        
        getGroups(state) {
            Vue.$log.debug("getGroups Enter")
            state.all = [];
        },
        getGroupsSuccess(state, groups) {
            Vue.$log.debug("getGroupsSuccess Enter");
            state.all =  groups ;
        },
        getGroupsFailure(state, error) {
            Vue.$log.debug("getGroupsFailure Enter");

            state.all = { error };
        },
        updateGroupSuccess(state, group) {
            Vue.$log.debug("updateGroupsSuccess Enter");
            Vue.$log.debug("group: " + JSON.stringify(group));
            const index = state.all.findIndex((stateGroup) => stateGroup.cn === group.cn);
            state.all[index] = group.changes;
        },
        updateGroupFailure(state, error) {
            Vue.$log.error("updateGroupsFailure Enter")
        },
        deleteGroupSuccess(state, group) {
            Vue.$log.debug("deleteGroupsSuccess Enter");
            Vue.$log.debug("group: " + group);
            var groupDelCn = group.split(":")[1].trim();
            Vue.$log.debug("groupDelCn: " + groupDelCn);

            const index = state.all.findIndex((stateGroup) => stateGroup.cn === groupDelCn);
            Vue.$log.debug("index: " + index);

            if (index > -1 ) {
                state.all.splice(index,1);
            } 
        },
        deleteGroupFailure(state, error) {
            Vue.$log.error("updateGroupsFailure Enter")
        },
        createGroupSuccess(state, group) {
            Vue.$log.debug("Enter");
            Vue.$log.debug("group: " + JSON.stringify(group));
            state.all.push(group);
        },
        createGroupFailure(state, error) {
            Vue.$log.error("Enter");
        },
        resetGroups(state) {
            Vue.$log.debug("Enter");
            state.all = [];
        },
    }
}