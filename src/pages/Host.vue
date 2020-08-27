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
      <div class="md-layout-item md-medium-size-100 md-size-66">
        <edit-host-form data-background-color="green" :host="host" :users="users" v-on:update-host="updateHost"> </edit-host-form>
      </div>
      <div class="md-layout-item md-medium-size-100 md-size-33">
      </div>
    </div>
  </div>
</template>

<script>
import { EditHostForm } from "@/pages";
import Vue from "vue";

export default {
  components: {
    EditHostForm
  },
  computed: {
    host() {
      Vue.$log.debug("Here in one host");
      Vue.$log.debug(this.$route.params.id);
      var host = this.$store.getters['hostStore/getHostById'](this.$route.params.id);
      var owners = []      
      if ("owners" in host && host.owners != []){                
        host.owners.forEach(element => {                  
          var owner = {};
          if (typeof(element) != 'object'){
            owner.dn = element
            owner.cn = element.split(',')[0].split('=')[1]
            owners.push(owner)
          }else {
            owner.dn = element.dn;
            owner.cn = element.cn;
            owners.push(owner)
          }
        });        
      }
      host.owners = owners;
      Vue.$log.debug(host.owners);
      return host;
    },
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
    updateHost(changes) {
        Vue.$log.debug("Enter");
        var hostId = this.$route.params.id;
        Vue.$log.debug("userId: " + hostId);
        Vue.$log.debug("changes: " + JSON.stringify(changes));
        var host={};
        host.cn = hostId;
        if("owners" in changes){
          changes.owners = changes.owners.map(val => val.dn);
        }
        host.changes = changes;
        this.$store.dispatch('hostStore/updateHost', { host } );
        this.$router.push("/admin/hosts");
    }
  }
};
</script>
