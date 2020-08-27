<!--
                        Confidentiality Information

  This module is the confidential and proprietary information of
  DBSentry Corp.; it is not to be copied, reproduced, or transmitted in any
  form, by any means, in whole or in part, nor is it to be used for any
  purpose other than that for which it is expressly provided without the
  written permission of DBSentry Corp.

  Copyright (c) 2020-2021 DBSentry Corp.  All Rights Reserved.

-->
<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">Groups</h4>
            <!-- <p class="category">Here is a subtitle for this table</p> -->
          </md-card-header>
          <md-card-content>
            <groups-table table-header-color="green" :groups="groups" v-on:delete-group="deleteGroup"></groups-table>
          </md-card-content>
        </md-card>
      </div>      
    </div>
  </div>
</template>

<script>
import { GroupsTable } from "@/components";
import Vue from "vue";

export default {
  components: {    
    GroupsTable
  },
  computed: {
    group() {
      return this.$store.state.authentication.group;
    },
    groups() {
      Vue.$log.debug("Here in groups");
      // Vue.$log.debug(JSON.stringify(this.$store.state.groupStore.all));
      var groups_json = this.$store.state.groupStore.all;
      var groups_arr = []
      groups_json.forEach(element => {
        var group = {};
        group.cn = element.cn;
        if ("description" in element){
          group.description = element.description;
        }else {
          group.description = "";
        }
        group.members = element.members.map(val => val.split(',')[0].split('=')[1]);
        // group.members = group.members.join(', ')
        groups_arr.push(group);
      });
      Vue.$log.debug(groups_arr)
      // return this.$store.state.groupStore.all;
      return groups_arr;
    }
  },
  created() {
    this.$store.dispatch('groupStore/getGroups');
  },
  methods: {
    deleteGroup(groupList) {
      Vue.$log.debug("Enter");
      Vue.$log.debug("groupList: " + JSON.stringify(groupList));

      groupList.forEach(element => {
        var groupDel = {};
        groupDel.cn = element;
        Vue.$log.debug("element to del: " + JSON.stringify(groupDel) );
        this.$store.dispatch('groupStore/deleteGroup', { groupDel } );
      });


    }
  }
};
</script>
