<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-100">
        <edit-user-form data-background-color="green" :user="user" :groups="groups" :hosts="hosts" v-on:update-user="updateUser"> </edit-user-form>
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
      var user = this.$store.getters['userStore/getUserById'](this.$route.params.id);
      var new_user = user;
      var memberOfs = []
      if("memberOfs" in user){
        user.memberOfs.forEach(element => {
          var u = {}
          if(typeof(element) != 'object'){
            u.dn = element;
            u.cn = element.split(',')[0].split('=')[1];
            memberOfs.push(u);
          }else{
            u.dn = element.dn;
            u.cn = element.cn;
            memberOfs.push(u);
          }
        });        
      }
      new_user.memberOfs = memberOfs;
      return new_user;
    },
    groups() {
      var all_groups = this.$store.state.groupStore.all;
      var groups_arr = [];
      all_groups.forEach(element => {
        var group = {}
        group.cn = element.cn;
        group.dn = element.dn;
        groups_arr.push(group);
      });
      return groups_arr;
    },
    hosts() {
      Vue.$log.debug("getting list of hosts")
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
    updateUser(changes) {
        Vue.$log.debug("Enter");
        var userId = this.$route.params.id;
        Vue.$log.debug("userId: " + userId);
        Vue.$log.debug("changes: " + JSON.stringify(changes));
        var user={};
        user.id = userId;
        user.changes = changes;
        this.$store.dispatch('userStore/updateUser', { user } );
        this.$router.push("/admin/users");
    }
  }
};
</script>
