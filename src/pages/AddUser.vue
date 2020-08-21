<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-100">
        <add-user-form data-background-color="green" v-on:add-user="addUser" :groups="groups"></add-user-form>
      </div>
    </div>
  </div>
</template>

<script>
import { AddUserForm } from "@/pages";
import Vue from "vue";

export default {
  components: {
    AddUserForm
  },
  computed: {
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
    }
  },
  methods: {
    addUser(user) {
      Vue.$log.debug("Enter");
      Vue.$log.debug("user: " + JSON.stringify(user));
      if (user.memberOfs != []){
        user.memberOfs = user.memberOfs.map(val => val.dn);
      }
      this.$store.dispatch("userStore/addUser", { user });
      this.$router.push("/admin/users");
    }
  }
};
</script>
