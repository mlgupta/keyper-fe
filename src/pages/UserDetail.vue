<template>
  <div class='md-layout'>
    <user-card :user="user" v-on:update-user="updateUser"></user-card>
  </div>  
</template>

<script>
// import { EditUserForm } from "@/pages";
import {UserCard} from "@/pages"
import Vue from "vue";

export default {
  components: {
    // EditUserForm
    UserCard
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
