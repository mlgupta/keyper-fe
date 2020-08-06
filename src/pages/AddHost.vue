<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-66">
        <add-host-form data-background-color="green" v-on:add-host="addHost" :users="users"> </add-host-form>
      </div>
      <div class="md-layout-item md-medium-size-100 md-size-33">
      </div>
    </div>
  </div>
</template>

<script>
import { AddHostForm } from "@/pages";
import Vue from "vue";

export default {
  components: {
    AddHostForm
  },
  computed: {
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
    addHost(host) {
        Vue.$log.debug("Enter");        
        if (host.owners != []){
          host.owners = host.owners.map(val => val.dn);
        }
        Vue.$log.debug("host: " + JSON.stringify(host));
        this.$store.dispatch('hostStore/addHost', { host } );
        this.$router.push("/admin/hosts");
    },
  }
};
</script>
