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
        <edit-group-form data-background-color="green" :group="group" :users="users" :hosts="hosts" v-on:update-group="updateGroup"> </edit-group-form>
      </div>
      
    </div>
  </div>
</template>

<script>
import { EditGroupForm } from "@/pages";
import Vue from "vue";

export default {
  components: {
    EditGroupForm
  },
  computed: {
    group() {
      Vue.$log.debug("Here in one group");
      Vue.$log.debug(this.$route.params.id);
      var group = this.$store.getters['groupStore/getGroupById'](this.$route.params.id);
      var members = []   
      var hosts = []  
      var ou 
      var host
      // debugger
      Vue.$log.debug(group);
      var new_group = group
      if ("members" in group){                
        group.members.forEach(element => {          
          var member = {};  
          host = {};        
          if (typeof(element) != 'object'){            
            ou = element.split(',')[1].split('=')[1];
            if (ou === "people") {
              Vue.$log.debug(element);            
              member.dn = element;
              member.cn = element.split(',')[0].split('=')[1];
              members.push(member)               
            }else {
              host.dn = element;
              host.cn = element.split(',')[0].split('=')[1];
              hosts.push(host)
            }
          }else {            
            ou = element.dn.split(',')[1].split('=')[1];
            if (ou === 'people'){ 
              member.dn = element.dn;
              member.cn = element.cn;
              members.push(member);
            }else {
              host.dn = element.dn;
              host.cn = element.cn;
              hosts.push(host);
            }
          }
        });        
      }
      if ("hosts" in group){
        group.hosts.forEach(element => {
          host = {}
          host.dn = element.dn;
          host.cn = element.cn;
          hosts.push(host);
        });
      }
      new_group.members = members;      
      new_group.hosts = hosts;
      // Vue.$log.debug(group);
      return new_group;
    },
    users() {
          Vue.$log.debug("getting list of users")
          var all_users = this.$store.state.userStore.all;
          Vue.$log.debug(all_users);
          var options = []
          var users_arr = []
          all_users.forEach(element => {
            var user = {};
            user.cn = element.cn;
            user.dn = element.dn;
            users_arr.push(user)
          });
          // all_users = all_users.map(val => {val.dn, val.cn} );
          return users_arr;
      },
      hosts() {          
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
    updateGroup(changes) {
        Vue.$log.debug("Enter");
        var groupId = this.$route.params.id;
        Vue.$log.debug("userId: " + groupId);
        Vue.$log.debug("changes: " + JSON.stringify(changes));
        var group={};
        group.cn = groupId;        
        if("members" in changes){
          changes.members = changes.members.map(val => val.dn);
        }            
        group.changes = changes;
        this.$store.dispatch('groupStore/updateGroup', { group } );
        this.$router.push("/admin/groups");
    }
  }
};
</script>
