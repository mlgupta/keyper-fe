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
    <md-dialog :md-active.sync="showDialog" @md-opened="opened">
      <md-dialog-title class="md-success">Add Cert</md-dialog-title>
      <md-dialog-content>
        <div>
          <form novalidate @submit.prevent="add">
            <div class="md-layout-item md-size-100">
              <md-field maxlength="5" :class="getValidationClass('name')">
                <label>Name</label>
                <md-input v-model="userkey.name" :disabled="sending"></md-input>
                <span class="md-error" v-if="!$v.userkey.name.required"
                  >Name is required</span
                >
                <span class="md-error" v-else-if="!$v.userkey.name.minlength"
                  >Invalid Name</span
                >
                <span class="md-error" v-else-if="!$v.userkey.name.maxlength"
                  >Invalid Name</span
                >
              </md-field>
              <md-field maxlength="5" :class="getValidationClass('key')">
                <label>Key</label>
                <md-textarea
                  v-model="userkey.key"
                  @input="fingerprint()"
                  :disabled="sending"
                ></md-textarea>
                <md-icon>vpn_key</md-icon>
                <span class="md-error" v-if="!$v.userkey.key.required"
                  >Key is required</span
                >
                <span class="md-error" v-else-if="!$v.userkey.key.validKey"
                  >Invalid Key</span
                >
              </md-field>
              <md-field>
                <label>Hosts</label>
                <multiselect
                  v-model="userkey.hostGroups"
                  :options="hosts"
                  label="cn"
                  track-by="dn"
                  :multiple="true"
                  :searchable="true"
                  :hide-selected="true"
                  placeholder="Select Hosts"
                >
                </multiselect>
              </md-field>
            </div>
            <md-dialog-actions>
              <md-button class="md-secondary" @click="showDialog = false"
                >Close</md-button
              >
              <md-button
                type="submit"
                class="md-raised md-success"
                :disabled="sending"
                >Add</md-button
              >
            </md-dialog-actions>
          </form>
        </div>
      </md-dialog-content>
    </md-dialog>
    <md-button class="md-raised md-success" @click="showDialog = true"
      ><md-icon>add</md-icon>Add</md-button
    >
  </div>
</template>

<script>
import Vue from "vue";
import { validationMixin } from "vuelidate";
import {
  required,
  minLength,
  maxLength,
  between
} from "vuelidate/lib/validators";
import Multiselect from "vue-multiselect";
import { fingerprint as fprint } from "@/_helpers";

const validKey = key => {
  if (!key || 0 === key.length) {
    return true;
  } else {
    var fp = "";
    try {
      fprint({ pub: key }).then(fing => {
        fp = fing;
        Vue.$log.debug("Fingerprint: " + fp);
      });
      return true;
    } catch (e) {
      Vue.$log.error("Fingerprint Error ");
      return false;
    }
  }
};

export default {
  name: "add-user-cert-modal",
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
    },
    modalError: {
      type: Boolean
    }
  },
  data() {
    return {
      showDialog: false,
      userkey: {
        key: null,
        hostGroups: [],
        fingerprint: null,
        name: null
      },
      sending: false
    };
  },
  validations: {
    userkey: {
      name: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(50)
      },
      key: {
        required,
        validKey
      },
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
    opened() {
      Vue.$log.debug("Enter");

      if (!this.modalError) {
          this.userkey.name = null;
          this.userkey.key = null;
          this.userkey.hostGroups = [];
      }
      else {
        Vue.$log.debug("Old Modal Error. Leaving the form asis");
      }
    },
    fingerprint() {
      Vue.$log.debug("Enter fingerprint");

      var fp = "";
      try {
        fprint({ pub: this.userkey.key }).then(fing => {
          Vue.$log.debug("Fingerprint: " + fing);
          this.userkey.fingerprint = fing;
        });
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
        var hosts = this.userkey.hostGroups.map(val => val.dn);
        var key = {};
        key.name = this.userkey.name;
        key.key = this.userkey.key;
        key.fingerprint = this.userkey.fingerprint;
        key.hostGroups = hosts;
        var sshKeys_arr = [];
        /*
        if (this.user.hasOwnProperty("sshPublicCerts")) {
          if (this.user.sshPublicCerts.length > 0) {
            sshKeys_arr = this.user.sshPublicCerts;
            key.keyid =
              Math.max(...this.user.sshPublicCerts.map(d => d.keyid)) + 1;
          }
        }
        */
        sshKeys_arr.push(key);
        var sshKeys = {};
        sshKeys.sshPublicCerts = sshKeys_arr;
        var user = {};
        user.cn = this.user.cn;
        user.id = this.user.cn;
        user.changes = sshKeys;

        this.sending = true;

        this.$store.dispatch("userStore/updateUser", { user });

        if (this.user.cn == this.$store.state.authentication.user.cn) {
          this.$store.dispatch("authentication/updateUser", { user });
        }
        this.showDialog = false;

        this.sending = false;
        // this.$router.push("/admin/users/"+user.id);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.md-dialog {
  max-width: auto;
}
</style>