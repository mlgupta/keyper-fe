<template>
  <div>
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>Add Key</md-dialog-title>

      <div>
        <form novalidate @submit.prevent="add">
          <div class="md-layout-item md-size-100">
            <md-field maxlength="5">
              <label>Key</label>              
              <md-textarea v-model="userkey.key" required></md-textarea>
            </md-field>            
            <md-field maxlength="5">
              <label>Valid For (days)</label>              
              <md-input v-model="userkey.duration" required></md-input>
            </md-field>
            <md-field>
              <label>Hosts</label>
              <multiselect v-model="userkey.hostGroups" :options="hosts" label="cn" track-by="dn" :multiple="true" :searchable="true" :hide-selected="true" placeholder="Select Hosts">                    
              </multiselect>
            </md-field>
          </div>  
          <md-dialog-actions>
            <md-button class="md-secondary" @click="showDialog = false">Close</md-button>
            <md-button type="submit" class="md-raised md-success">Add</md-button>
          </md-dialog-actions>
        </form>
      </div>      
    </md-dialog>
    <md-button class="md-raised md-success" @click="showDialog = true"><md-icon>add</md-icon>Add</md-button>
  </div>
</template>

<script>
  import Vue from "vue";
  import Multiselect from 'vue-multiselect';
  export default {
    name: 'add-user-key-modal',
    components: {
      Multiselect
    },
    props: {
      hosts: {
        type: Array
      },
      user: {
        type: Object
      }
    },
    data() {
      return {
        showDialog: false,
        userkey: {
          key: null,
          duration: null,
          hostGroups: []
        },
        sending: false
      }
    },
    methods: {
      add() {        
        Vue.$log.debug("Add Key");
        Vue.$log.debug(this.user.cn);
        Vue.$log.debug(this.userkey);
        var now = new Date(); 
        now.setDate(now.getDate() + parseInt(this.userkey.duration));
        var dateExpire = now.toISOString().slice(0,10).replace(/-/g,"");
        var hosts = this.userkey.hostGroups.map(val => val.dn);
        var key = {};
        key.key = this.userkey.key;
        key.hostGroups = hosts;
        key.dateExpire = dateExpire;
        var sshKeys_arr = []
        if ("sshPublicKeys" in this.user){
          sshKeys_arr = this.user.sshPublicKeys
        }
        sshKeys_arr.push(key);
        var sshKeys = {}
        sshKeys.sshPublicKeys = sshKeys_arr;
        var user = {};
        user.id = this.user.cn;
        user.changes = sshKeys;
        this.$store.dispatch('userStore/updateUser', { user } );
        this.showDialog = false;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .md-dialog  {
    // max-width: 768px;
  }
</style>