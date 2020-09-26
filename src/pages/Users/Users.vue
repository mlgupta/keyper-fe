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
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">Users</h4>
            <p class="category"></p>
          </md-card-header>
          <md-card-content>
            <users-table table-header-color="green" :users="users" v-on:delete-user="deleteUser"></users-table>
          </md-card-content>
          <md-card-actions :class="'md-alignment-space-between'">
            <div>
              <p class="card-category">Showing {{from+1}} to {{endOfPage(to, userCount)}} of {{userCount}} entries</p>
            </div>
            <paginate 
              :page-count="pageCount"
              :click-handler="paginate"
              :prev-text="'<<'"
              :next-text="'>>'"
              :container-class="'pagination pagination-no-border pagination-success pagination-primary list-nobull'">
            </paginate>
            <div>
              <div class="md-layout md-gutter">
                <div class="md-layout-item">
                  <md-field>
                    <label for="perPage">Per Page</label>
                    <md-select v-model="perPage">
                      <md-option value="20">20</md-option>
                      <md-option value="50">50</md-option>
                      <md-option value="100">100</md-option>
                    </md-select>
                  </md-field>
                </div>
              </div>
            </div>
          </md-card-actions>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import { UsersTable } from "@/components";
import Vue from "vue";

export default {
  components: {
    UsersTable
  },
  data() {
    return {
      page: 1,
      perPage: 20,
      from: 0,
      to: 0
    }
  },
  computed: {
    user() {
      return this.$store.state.authentication.user;
    },
    users() {
      Vue.$log.debug("Get users from store. From: " + this.from + " to: " + this.to);
      return this.$store.state.userStore.all.slice(this.from, this.to);
    },
    pageCount() {
      Vue.$log.debug("Here in pageCount");
      //return Math.ceil(this.$store.getters["userStore/getUserCount"]/this.perPage);
      return Math.ceil(this.userCount/this.perPage);
    },
    userCount() {
      Vue.$log.debug("Here in userCount");
      return this.$store.state.userStore.all.length;
    },
  },
  watch: {
    perPage() {
      Vue.$log.debug("perPage changed");
      this.paginate(1);
    }
  },
  created() {
    this.$store.dispatch("userStore/getUsers");
    this.$store.dispatch("groupStore/getGroups");
    this.$store.dispatch("hostStore/getHosts");

    this.to = this.perPage;
  },
  methods: {
    deleteUser(userList) {
      Vue.$log.debug("Enter");
      Vue.$log.debug("userList: " + JSON.stringify(userList));

      userList.forEach(element => {
        var userDel = {};
        userDel.cn = element;
        Vue.$log.debug("element to del: " + JSON.stringify(userDel));
        this.$store.dispatch("userStore/deleteUser", { userDel });
      });
    },
    paginate(pageNum) {
      this.page = pageNum;
      this.from = (this.page * this.perPage) - this.perPage;
      this.to = (this.page * this.perPage);
    },
    endOfPage(to, userCount) {
      var endOfPage = to;
      if (to > userCount) {
        endOfPage = userCount;
      }
      return endOfPage;
    }
  }
};
</script>
<style>
.list-nobull {
  list-style-type: none; 
}
.list-nobull > li {
  display: inline;
}
</style>