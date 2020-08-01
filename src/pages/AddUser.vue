<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-66">
        <add-user-form data-background-color="green" v-on:add-user="addUser"> </add-user-form>
      </div>
      <div class="md-layout-item md-medium-size-100 md-size-33">
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
  methods: {
    addUser(user) {
        Vue.$log.debug("Enter");
        Vue.$log.debug("user: " + JSON.stringify(user));
        this.$store.dispatch('userStore/addUser', { user } );
    },
  }
};
</script>
