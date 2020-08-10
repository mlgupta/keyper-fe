<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-66">
        <edit-group-form data-background-color="green" :group="group" :users="users" v-on:update-group="updateGroup"> </edit-group-form>
      </div>
      <div class="md-layout-item md-medium-size-100 md-size-33">
      </div>
    </div>
  </div>
</template>

<script>
import { EditGroupForm } from "@/pages";
import Vue from "vue";

export default {
  components: {
    EditGroupForm
  },
  computed: {
    group() {
      Vue.$log.debug("Here in one group");
      Vue.$log.debug(this.$route.params.id);
      var group = this.$store.getters['groupStore/getGroupById'](this.$route.params.id);
      var members = []   
      var hosts = []   
      // debugger
      Vue.$log.debug(group);
      var new_group = group
      if ("members" in group){                
        group.members.forEach(element => {          
          var member = {};
          if (typeof(element) != 'object'){
            Vue.$log.debug(element);            
            member.dn = element;
            member.cn = element.split(',')[0].split('=')[1];
            members.push(member)               
          }else {
            member.dn = element.dn;
            member.cn = element.cn;
            members.push(member);
          }
        });        
      }
      new_group.members = members;      
      // Vue.$log.debug(group);
      return new_group;
    },
    users() {
          Vue.$log.debug("getting list of users")
          var all_users = this.$store.state.userStore.all;
          Vue.$log.debug(all_users);
          var options = []
          var users_arr = []
          all_users.forEach(element => {
            var user = {};
            user.cn = element.cn;
            user.dn = element.dn;
            users_arr.push(user)
          });
          // all_users = all_users.map(val => {val.dn, val.cn} );
          var all_hosts = this.$store.state.hostStore.all;
          Vue.$log.debug(all_hosts);
          var hosts_arr = []
          all_hosts.forEach(element => {
            var host = {};
            host.cn = element.cn;
            host.dn = element.dn;
            hosts_arr.push(host)
          });
          var option = {}
          option.ou = 'users'
          option.items = users_arr
          options.push(option)
          var option1 = {}
          option1.ou = 'hosts'
          option1.items = hosts_arr
          options.push(option1)
          return options;
      }    
  },
  methods: {
    updateGroup(changes) {
        Vue.$log.debug("Enter");
        var groupId = this.$route.params.id;
        Vue.$log.debug("userId: " + groupId);
        Vue.$log.debug("changes: " + JSON.stringify(changes));
        var group={};
        group.cn = groupId;        
        if("members" in changes){
          changes.members = changes.members.map(val => val.dn);
        }            
        group.changes = changes;
        this.$store.dispatch('groupStore/updateGroup', { group } );
        this.$router.push("/admin/groups");
    }
  }
};
</script>
