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
        <add-host-form data-background-color="green" v-on:add-host="addHost" :users="users" > </add-host-form>
      </div>
    </div>
  </div>
</template>

<script>
import { AddHostForm } from "@/pages";
import Vue from "vue";

export default {
  components: {
    AddHostForm
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
          // all_users = all_users.map(val => {val.dn, val.cn} );
          return users_arr;
      }
  },
  methods: {
    addHost(host) {

        Vue.$log.debug("Enter");
        /*
        if (host.owners != []){
          host.owners = host.owners.map(val => val.dn);
        }
        */
        Vue.$log.debug("host: " + JSON.stringify(host));
        this.$store.dispatch('hostStore/addHost', { host } );
        this.$router.push({ name: "Hosts" });
    },
  }
};
</script>
