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
      <div class="md-layout-item md-medium-size-100 md-size-100">
        <add-group-form data-background-color="green" v-on:add-group="addGroup" :users="users" :hosts="hosts"> </add-group-form>
      </div>
      
    </div>
  </div>
</template>

<script>
import { AddGroupForm } from "@/pages";
import Vue from "vue";

export default {
  components: {
    AddGroupForm
  },
  computed: {
      users() {
          Vue.$log.debug("getting list of users")
          var all_users = this.$store.state.userStore.all;
          Vue.$log.debug(all_users);
          var users_arr = []
          all_users.forEach(element => {
            var user = {};
            user.cn = element.cn;
            user.dn = element.dn;
            users_arr.push(user)
          });
          
          return users_arr;
      },
      hosts() {
          Vue.$log.debug("getting list of hosts")
          var all_hosts = this.$store.state.hostStore.all;
          Vue.$log.debug(all_hosts);
          var hosts_arr = []
          all_hosts.forEach(element => {
            var host = {};
            host.cn = element.cn;
            host.dn = element.dn;
            hosts_arr.push(host)
          });
          
          return hosts_arr;
      }
  },
  methods: {
    addGroup(group) {
        Vue.$log.debug("Enter");        
        if (group.members != []){
          group.members = group.members.map(val => val.dn);
        }
        
        if (group.hosts != []){
          group.hosts = group.hosts.map(val => val.dn);
          group.members = group.members.concat(group.hosts)
        }        
        delete group.hosts        
        Vue.$log.debug("group: " + JSON.stringify(group));
        this.$store.dispatch('groupStore/addGroup', { group } );
        this.$router.push("/admin/groups");
    },
  }
};
</script>
