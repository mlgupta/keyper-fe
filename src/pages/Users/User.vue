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
        <div class="md-layout">
          <div class="md-layout-item md-size-100">
            <nav-tabs-card>
              <template slot="content">
                <span class="md-nav-tabs-title">Edit:</span>
                  <md-tabs class="md-success" md-alignment="left">
                    <edit-user-form data-background-color="green" :user="user" :groups="groups" :hosts="hosts" v-on:update-user="updateUser"> </edit-user-form>
                    <edit-user-form-keys data-background-color="green" :user="user" v-on:update-user="updateUser"> </edit-user-form-keys>
                    <edit-user-form-certs data-background-color="green" :user="user" v-on:update-user="updateUser"> </edit-user-form-certs>
                  </md-tabs>
              </template>
            </nav-tabs-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EditUserForm } from "@/pages";
import { EditUserFormKeys } from "@/pages";
import { EditUserFormCerts } from "@/pages";
import { NavTabsCard } from "@/components";
import Vue from "vue";

export default {
  components: {
    NavTabsCard,
    EditUserForm,
    EditUserFormKeys,
    EditUserFormCerts
  },
  computed: {
    user() {
      Vue.$log.debug("Here in one User");
      Vue.$log.debug(this.$route.params.id);
      var user = this.$store.getters["userStore/getUserById"](this.$route.params.id);
      Vue.$log.debug(JSON.stringify(user));
      //var new_user = user;
      var memberOfs = [];
      if ("memberOfs" in user) {
        user.memberOfs.forEach(element => {
          var u = {};
          if (typeof(element) != "object") {
            u.dn = element;
            u.cn = element.split(",")[0].split("=")[1];
            memberOfs.push(u);
          } else {
            u.dn = element.dn;
            u.cn = element.cn;
            memberOfs.push(u);
          }
        });
      }
      user.memberOfs = memberOfs;
      return user;
    },
    groups() {
      var all_groups = this.$store.state.groupStore.all;
      var groups_arr = [];
      all_groups.forEach(element => {
        var group = {};
        group.cn = element.cn;
        group.dn = element.dn;
        groups_arr.push(group);
      });
      return groups_arr;
    },
    hosts() {
      Vue.$log.debug("getting list of hosts");
      var all_hosts = this.$store.state.hostStore.all;
      Vue.$log.debug(all_hosts);
      var hosts_arr = [];
      all_hosts.forEach(element => {
        var host = {};
        host.cn = element.cn;
        host.dn = element.dn;
        hosts_arr.push(host);
      });
      return hosts_arr;
    }
  },
  methods: {
    updateUser(changes) {
      Vue.$log.debug("Enter");
      var userId = this.$route.params.id;
      Vue.$log.debug("userId: " + userId);
      Vue.$log.debug("changes: " + JSON.stringify(changes));
      if ("memberOfs" in changes) {
        changes.memberOfs = changes.memberOfs.map(val => val.dn);
      }
      var user = {};
      user.id = userId;
      user.changes = changes;
      this.$store.dispatch("userStore/updateUser", { user });
      Vue.nextTick();
      //this.$router.push("/admin/users");
    }
  }
};
</script>
