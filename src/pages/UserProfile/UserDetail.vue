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
  <div class="md-layout">
      <md-card class="md-card-profile">
    <div class="md-card-avatar">
      <img class="img" :src="cardUserImage" />
    </div>

    <md-card-content>
      <h4 class="card-title">{{ user.displayName }}</h4>
      <div class="md-layout" md-alignment="left">
        <div class="md-layout-item md-size-100">
          <nav-tabs-card>
            <template slot="content">
              <md-tabs class="md-success" md-alignment="left">
                <user-card :user="user" v-on:update-user="updateUser"></user-card>
                <edit-user-form-keys data-background-color="green" :user="user" v-on:update-user="updateUser"> </edit-user-form-keys>
              </md-tabs>
            </template>
          </nav-tabs-card>
        </div>
      </div>
    </md-card-content>
  </md-card>
  </div>
</template>

<script>
import { UserCard } from "@/pages";
import { EditUserFormKeys } from "@/pages";
import { NavTabsCard } from "@/components";
import Vue from "vue";

export default {
  components: {
    NavTabsCard,
    UserCard,
    EditUserFormKeys
  },
  props: {
    cardUserImage: {
      type: String,
      default: require("@/assets/img/faces/person.png")
    },
  },
  computed: {
    user() {
      Vue.$log.debug("In userDetail");
      Vue.$log.debug(this.$route.params.id);
      var user = this.$store.state.authentication.user;
      var new_user = user;
      var memberOfs = [];
      if ("memberOfs" in user) {
        user.memberOfs.forEach(element => {
          var u = {};
          if (typeof(element) != 'object') {
            u.dn = element;
            u.cn = element.split(',')[0].split('=')[1];
            memberOfs.push(u);
          } else {
            u.dn = element.dn;
            u.cn = element.cn;
            memberOfs.push(u);
          }
        });
      }
      new_user.memberOfs = memberOfs;
      return new_user;
    }
  },
  methods: {
    updateUser(changes) {
      Vue.$log.debug("Enter");
      var userId = this.$route.params.id;
      Vue.$log.debug("userId: " + userId);
      Vue.$log.debug("changes: " + JSON.stringify(changes));
      var user = {};
      user.id = userId;
      user.changes = changes;
      this.$store.dispatch("authentication/updateUser", { user });
      this.$store.dispatch("userStore/updateUser", { user });
    }
  }
};
</script>
