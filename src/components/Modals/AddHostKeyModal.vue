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
      <md-dialog-title class="md-success">Add Key</md-dialog-title>
      <md-dialog-content>
        <div>
          <form novalidate @submit.prevent="add">
            <div class="md-layout-item md-size-100">
              <md-field maxlength="5" :class="getValidationClass('name')">
                <label>Name</label>
                <md-input v-model="hostkey.name" :disabled="sending"></md-input>
                <span class="md-error" v-if="!$v.hostkey.name.required"
                  >Name is required</span
                >
                <span class="md-error" v-else-if="!$v.hostkey.name.minlength"
                  >Invalid Name</span
                >
                <span class="md-error" v-else-if="!$v.hostkey.name.maxlength"
                  >Invalid Name</span
                >
              </md-field>
              <md-field maxlength="5" :class="getValidationClass('key')">
                <label>Key</label>
                <md-textarea
                  v-model="hostkey.key"
                  @input="fingerprint()"
                  :disabled="sending"
                ></md-textarea>
                <md-icon>vpn_key</md-icon>
                <span class="md-error" v-if="!$v.hostkey.key.required"
                  >Key is required</span
                >
                <span class="md-error" v-else-if="!$v.hostkey.key.validKey"
                  >Invalid Key</span
                >
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
  name: "add-host-key-modal",
  mixins: [validationMixin],
  components: {},
  props: {
    host: {
      type: Object
    },
    modalError: {
      type: Boolean
    }
  },
  data() {
    return {
      showDialog: false,
      hostkey: {
        key: null,
        fingerprint: null,
        name: null,
      },
      sending: false
    };
  },
  validations: {
    hostkey: {
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
      Vue.$log.debug("Enter in AddHostKeyModal");
      Vue.$log.debug("Alert Type: " + this.alert.type);

      if (this.alert.type == null) {
        Vue.$log.debug("Nothing in alert");
      } else {
        if (this.alert.type == "success") {
          this.hostkey.name = null;
          this.hostkey.key = null;
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

      const field = this.$v.hostkey[fieldName];
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
          this.hostkey.name = null;
          this.hostkey.key = null;
      }
      else {
        Vue.$log.debug("Old Modal Error. Leaving the form asis");
      }
    },
    fingerprint() {
      Vue.$log.debug("Enter fingerprint");

      var fp = "";
      try {
        fprint({ pub: this.hostkey.key }).then(fing => {
          Vue.$log.debug("Fingerprint: " + fing);
          this.hostkey.fingerprint = fing;
        });
        return true;
      } catch (e) {
        Vue.$log.error("Fingerprint Error ");
      }
    },
    add() {
      Vue.$log.debug("Enter Add Key");

      Vue.$log.debug(this.host.cn);
      Vue.$log.debug(this.hostkey);

      this.$v.$touch();

      if (this.$v.$invalid) {
        Vue.$log.debug("Validation Errors");
      } else {
        var key = {};
        key.name = this.hostkey.name;
        key.key = this.hostkey.key;
        key.fingerprint = this.hostkey.fingerprint;
        var sshCerts_arr = [];

        /*
        if (this.host.hasOwnProperty("sshPublicCerts")) {
          if (this.host.sshPublicCerts.length > 0) {
            sshCerts_arr = this.host.sshPublicCerts;
            key.keyid =
              Math.max(...this.host.sshPublicCerts.map(d => d.keyid)) + 1;
          }
        }
        */
        sshCerts_arr.push(key);
        var sshKeys = {};
        sshKeys.sshPublicCerts = sshCerts_arr;
        var host = {};
        host.cn = this.host.cn;
        host.id = this.host.cn;
        host.changes = sshKeys;

        this.sending = true;

        this.$store.dispatch("hostStore/updateHost", { host });
        this.showDialog = false;

        this.sending = false;
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