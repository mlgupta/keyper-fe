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
  <div>
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title class="md-success">Add Key</md-dialog-title>
      <md-dialog-content>
        <div>
          <form novalidate @submit.prevent="add">
            <div class="md-layout-item md-size-100">
              <md-field maxlength="5" :class="getValidationClass('name')">
                <label>Name</label>              
                <md-input v-model="userkey.name" :disabled="sending"></md-input>
                <span class="md-error" v-if="!$v.userkey.name.required">Name is required</span>
                <span class="md-error" v-else-if="!$v.userkey.name.minlength">Invalid Name</span>
                <span class="md-error" v-else-if="!$v.userkey.name.maxlength">Invalid Name</span>
              </md-field>
              <md-field maxlength="5" :class="getValidationClass('key')">
                <label>Key</label>              
                <md-textarea v-model="userkey.key" @input="fingerprint()" :disabled="sending"></md-textarea>
                <md-icon>vpn_key</md-icon>
                <span class="md-error" v-if="!$v.userkey.key.required">Key is required</span>
                <span class="md-error" v-else-if="!$v.userkey.key.validKey">Invalid Key</span>
              </md-field>            
              <md-field maxlength="5" :class="getValidationClass('duration')">
                <label>Valid For (days)</label>              
                <md-input v-model="userkey.duration" :disabled="sending"></md-input>
                <span class="md-error" v-if="!$v.userkey.duration.required">Duration is required</span>
                <span class="md-error" v-else-if="!$v.userkey.duration.between">Duration must be between 30 and 360 days</span>
              </md-field>
              <md-field>
                <label>Hosts</label>
                <multiselect v-model="userkey.hostGroups" :options="hosts" label="cn" track-by="dn" :multiple="true" :searchable="true" :hide-selected="true" placeholder="Select Hosts">                    
                </multiselect>
              </md-field>
            </div>  
            <md-dialog-actions>
              <md-button class="md-secondary" @click="showDialog = false">Close</md-button>
              <md-button type="submit" class="md-raised md-success" :disabled="sending">Add</md-button>
            </md-dialog-actions>
          </form>
        </div> 
      </md-dialog-content>     
    </md-dialog>
    <md-button class="md-raised md-success" @click="showDialog = true"><md-icon>add</md-icon>Add</md-button>
  </div>
</template>

<script>
  import Vue from "vue";
  import { validationMixin } from "vuelidate";
  import { required, minLength, maxLength, between } from "vuelidate/lib/validators";
  import Multiselect from 'vue-multiselect';
  import SSH from "greenlock-ssh-fingerprint";

  const validKey = (key) => {
        if (!key || 0 === key.length) {
          return true;
        }
        else {
          var fp = "";
          try {
            SSH.fingerprint({ pub: key })
              .then(
                fing => {
                  fp = fing.fingerprint;
                  Vue.$log.debug("Fingerprint: " + fp);
                }
              );
              return true;
          } catch (e) {
              Vue.$log.error("Fingerprint Error ");
              return false;
          }
        }
  }

  export default {
    name: 'add-user-key-modal',
    mixins: [validationMixin],
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
          hostGroups: [],
          fingerprint: null,
          name: null
        },
        sending: false
      }
    },
    validations: {
      userkey: {
        name: {
          required,
          minLength: minLength(2),
          maxLength: maxLength(50),
        },
        key: {
          required,
          validKey
        },
        duration: {
          required,
          between: between(20, 360)
        }
      }
    },
    computed: {
      alert() {
        return this.$store.state.alert;
      },
      alertMsg() {
        return this.$store.state.alert.message;
      }
    },
    watch: {
      alertMsg(newAlert) {
        Vue.$log.debug("Enter in AddUserKey");
        Vue.$log.debug("Alert Type: " + this.alert.type);

        if (this.alert.type == null) {
          Vue.$log.debug("Nothing in alert");
        } else {
          if (this.alert.type == "success") {
            this.userkey.name = null;
            this.userkey.key = null;
            this.userkey.duration = null;
            this.userkey.hostGroups = [];
          }
          this.notifyVue(this.alert.type, this.alert.message);
          this.$store.dispatch("alert/clear");
        }
      }
    },
    created() {
      this.$store.dispatch("alert/clear");
    },
    methods: {
      getValidationClass(fieldName) {
        Vue.$log.debug("Enter");
        Vue.$log.debug("fieldName: " + fieldName);

        const field = this.$v.userkey[fieldName];
        Vue.$log.debug("field: " + JSON.stringify(field));
        Vue.$log.debug("md-invalid: " + field.$invalid && field.$dirty);

        if (field) {
          return {
            "md-invalid": field.$invalid && field.$dirty
          };
        }
      },
      fingerprint() {
        Vue.$log.debug("Enter fingerprint");

        var fp = "";
        try {
          SSH.fingerprint({ pub: this.userkey.key })
            .then(
              fing => {
                fp = fing.fingerprint;
                Vue.$log.debug("Fingerprint: " + fp);
                this.userkey.fingerprint = fp;
              }
            );
            return true;
        } catch (e) {
            Vue.$log.error("Fingerprint Error ");
        }
      },
      add() {        
        Vue.$log.debug("Enter Add Key");

        Vue.$log.debug(this.user.cn);
        Vue.$log.debug(this.userkey);

        this.$v.$touch();

        if (this.$v.$invalid) {
          Vue.$log.debug("Validation Errors");
        } else {
          var now = new Date(); 
          now.setDate(now.getDate() + parseInt(this.userkey.duration));
          var dateExpire = now.toISOString().slice(0,10).replace(/-/g,"");
          var hosts = this.userkey.hostGroups.map(val => val.dn);
          var key = {};
          key.name = this.userkey.name;
          key.key = this.userkey.key;
          key.fingerprint = this.userkey.fingerprint;
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
          user.cn = this.user.cn;
          user.id = this.user.cn;
          user.changes = sshKeys;
          
          this.sending = true;

          this.$store.dispatch('userStore/updateUser', { user } );
          this.showDialog = false;

          this.sending = false;
          // this.$router.push("/admin/users/"+user.id);
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .md-dialog  {
    max-width: auto;
  }
</style>