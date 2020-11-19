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
  <form>
    <md-card>
      <md-card-header :data-background-color="dataBackgroundColor">
        <h4 class="title">Edit Group</h4>
        <p class="category"></p>
      </md-card-header>

      <md-card-content>
        <div class="md-layout md-gutter">
          <div class="md-layout-item md-size-100">
            <md-field>
              <label>Name (disabled)</label>
              <md-input :value="group.cn" disabled></md-input>              
            </md-field>
          </div>      
          <div class="md-layout-item md-size-100">
            <md-field maxlength="5">
              <label>Description</label>
              <md-textarea :value="group.description" @input="handleChange($event, 'description')"></md-textarea>
            </md-field>
          </div>    
          <div class="md-layout-item md-size-100">
              <md-field>
                  <label>Members</label>
                  <multiselect :value="selectedMembers" @input="handleChange($event, 'members')" :options="users" label="cn" track-by="dn" :multiple="true" :searchable="true" :hide-selected="true" placeholder="Select Group Members">                    
                  </multiselect>                  
              </md-field>
          </div> 
          <div class="md-layout-item md-size-100">
              <md-field>
                  <label>Hosts</label>
                  <multiselect :value="selectedHosts" @input="handleChange($event, 'hosts')" :options="hosts" label="cn" track-by="dn" :multiple="true" :searchable="true" :hide-selected="true" placeholder="Select Group Hosts">                    
                  </multiselect>                  
              </md-field>
          </div>                   
          <div class="md-layout-item md-size-100 text-right">
            <md-button
              class="md-raised md-default"
              v-on:click="cancel"
              >cancel</md-button
            >
            <md-button class="md-raised md-success" @click="update">Update</md-button>
          </div>
        </div>
      </md-card-content>
    </md-card>
  </form>
</template>
<script>
import Vue from "vue";
import { validationMixin } from 'vuelidate';
import { required, minLength, maxLength } from 'vuelidate/lib/validators';
import Multiselect from 'vue-multiselect';

export default {
  components: {
    Multiselect
  },
  name: "edit-group-form",
  mixins: [validationMixin],  
  props: {
    dataBackgroundColor: {
      type: String,
      default: ""
    },
    group: {
        type: Object
    },
    users: {
      type: Array
    },
    hosts: {
      type: Array
    }
  },  
  data() {
    return {      
      changes: {},
      selectedMembers: this.group.members,
      selectedHosts: this.group.hosts
    }
  },  
  computed: {
    alert() {
      return this.$store.state.alert;
    },
    alertMsg() {
      return this.$store.state.alert.message;
    },
  },
  watch: {
    alertMsg(newAlert) {
      Vue.$log.debug("Enter");
      Vue.$log.debug("Alert Type: " + this.alert.type);

      if (this.alert.type == null) {
        Vue.$log.debug("Nothing in alert");
      }
      else {
        this.notifyVue(this.alert.type, this.alert.message);
        this.$store.dispatch('alert/clear');
      }
    }
  },
  created () {
    this.$store.dispatch('alert/clear');
  },
  methods: {
    handleChange(e, id) {
      Vue.$log.debug("event: " + JSON.stringify(e));    
      if (id === 'members'){
        this.selectedMembers = e;
        e = e.concat(this.selectedHosts);
      }
      if (id === 'hosts'){
        this.selectedHosts = e;
        e = e.concat(this.selectedMembers);
        id = 'members'
      }      
      this.changes[id] = e;
      Vue.$log.debug(JSON.stringify(this.changes));
    },
    handleSelect(e) {
      Vue.$log.debug(e)
      
    },
    update() {
      Vue.$log.debug("Enter");
      if (JSON.stringify(this.changes) == JSON.stringify({})) {
        Vue.$log.debug("No changes. Ignore click");
      }
      else {
        this.$emit('update-group', this.changes);
      }
    },
    cancel() {
      Vue.$log.debug("Enter");
      this.$emit("cancel-update-group");
    },
    notifyVue(type, msg) {
      Vue.$log.debug("Enter");

      this.$notify({
        message:
          msg,
        horizontalAlign: 'center',
        verticalAlign: 'top',
        type: type
      });
    }
  }
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>