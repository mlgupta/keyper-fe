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
    <user-card :user="user" v-on:update-user="updateUser"></user-card>
  </div>
</template>

<script>
import { UserCard } from "@/pages";
import Vue from "vue";

export default {
  components: {
    UserCard
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
