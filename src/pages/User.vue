<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-66">
        <edit-user-form data-background-color="green" :user=user v-on:update-user="updateUser"> </edit-user-form>
      </div>
      <div class="md-layout-item md-medium-size-100 md-size-33">
      </div>
    </div>
  </div>
</template>

<script>
import { EditUserForm } from "@/pages";
import Vue from "vue";

export default {
  components: {
    EditUserForm
  },
  computed: {
    user() {
      Vue.$log.debug("Here in one User");
      Vue.$log.debug(this.$route.params.id);

      return this.$store.getters['userStore/getUserById'](this.$route.params.id)
    }
  },
  methods: {
    updateUser(changes) {
        Vue.$log.debug("Enter");
        var userId = this.$route.params.id;
        Vue.$log.debug("userId: " + userId);
        Vue.$log.debug("changes: " + JSON.stringify(changes));
        var user={};
        user.id = userId;
        user.changes = changes;
        this.$store.dispatch('userStore/updateUser', { user } );
    }
  }
};
</script>
