<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">Users</h4>
            <p class="category"></p>
          </md-card-header>
          <md-card-content>
            <users-table table-header-color="green" :users="users" v-on:delete-user="deleteUser"></users-table>
          </md-card-content>
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
  computed: {
    user() {
      return this.$store.state.authentication.user;
    },
    users() {
      Vue.$log.debug("Here in users");
      Vue.$log.debug(JSON.stringify(this.$store.state.userStore.all));
      this.$nextTick(function () {
        console.log(this.$el.textContent) // => 'updated'
      })
      return this.$store.state.userStore.all;
    }
  },
  created() {
    this.$store.dispatch('userStore/getUsers');
  },
  methods: {
    deleteUser(userList) {
      Vue.$log.debug("Enter");
      Vue.$log.debug("userList: " + JSON.stringify(userList));

      userList.forEach(element => {
        var userDel = {};
        userDel.cn = element;
        Vue.$log.debug("element to del: " + JSON.stringify(userDel) );
        this.$store.dispatch('userStore/deleteUser', { userDel } );
      });


    }
  }
};
</script>
