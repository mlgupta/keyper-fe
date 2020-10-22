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
  <!-- Host Certs -->
  <md-tab id="tab-keys" md-label="SSH Certs">
    <div class="md-layout-item md-size-100">
      <div class="md-layout-item md-size 100">
        <add-host-key-modal
          :host="host"
          :modalError="modalError"
          class="text-right"
        ></add-host-key-modal>
      </div>
      <div v-if="hasKeys">
        <md-table v-model="sshPublicCerts">
          <md-table-row>
            <md-table-head>ID</md-table-head>
            <md-table-head>Name</md-table-head>
            <md-table-head>Fingerprint</md-table-head>
            <md-table-head>Expiration</md-table-head>
            <md-table-head>Options</md-table-head>
          </md-table-row>
          <md-table-row v-for="item in sshPublicCerts" :key="item.keyid">
            <md-table-cell md-label="Name">{{ item.keyid }}</md-table-cell>
            <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>
            <md-table-cell>
              <v-clamp autoresize:max-lines="1">{{
                item.fingerprint
              }}</v-clamp>
            </md-table-cell>
            <md-table-cell md-label="Expiration">{{
              dateExpire(item.dateExpire)
            }}</md-table-cell>
            <md-table-cell>
              <md-button
                class="md-just-icon md-simple"
                @click="download(item.cert)"
              >
                <md-icon>get_app</md-icon>
                <md-tooltip md-direction="top">Download Certificate</md-tooltip>
              </md-button>
              <modal
                :title="'Host Certificate'"
                :body = "item.cert"
              ></modal>

              <md-button
                class="md-just-icon md-simple"
                v-if="canCopy"
                @click="copy(item.cert)"
              >
                <md-icon>content_copy</md-icon>
                <md-tooltip md-direction="top">Copy Certificate</md-tooltip>
              </md-button>
              <!--
              <md-button
                class="md-just-icon md-simple"
                @click="renew(item)"
              >
                <md-icon>refresh</md-icon>
                <md-tooltip md-direction="top">Renew Certificate</md-tooltip>
              </md-button>
              -->
              <md-button
                class="md-just-icon md-simple md-danger"
                @click="del(item.keyid)"
              >
                <md-icon>close</md-icon>
                <md-tooltip md-direction="top">Delete Key</md-tooltip>
              </md-button>
            </md-table-cell>
          </md-table-row>
        </md-table>
      </div>
      <div v-else>
        <md-empty-state
          md-icon="verified_user"
          md-label="Add Key"
          md-description="Add public key to generate a certificate for the host."
        >
          <add-host-key-modal
            :host="host"
            :modalError="modalError"
            class="text-right"
          >
          </add-host-key-modal>
        </md-empty-state>
      </div>
    </div>
  </md-tab>
</template>
<script>

import Vue from "vue";
import { validationMixin } from "vuelidate";
import {
  required,
  minLength,
  maxLength,
  email,
  sameAs
} from "vuelidate/lib/validators";
import VClamp from "vue-clamp";
import { AddHostKeyModal } from "@/components";
import { Modal } from "@/components";

export default {
  name: "edit-host-form-certs",
  components: {
    VClamp,
    AddHostKeyModal,
    Modal
  },
  mixins: [validationMixin],
  props: {
    dataBackgroundColor: {
      type: String,
      default: ""
    },
    host: {
      type: Object
    }
  },
  data() {
    return {
      cert: null,
      changes: {},
      memberOfs: {},
      showDialog: false,
      canCopy: false,
      sending: false,
      modalError: false
    };
  },
  validations: {
  },
  computed: {
    alert() {
      return this.$store.state.alert;
    },
    alertMsg() {
      return this.$store.state.alert.message;
    },
    hasKeys() {
      Vue.$log.debug("Enter");
      if (this.host.hasOwnProperty('sshPublicCerts')) {
        if (this.host.sshPublicCerts.length > 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    sshPublicCerts() {
      return this.host.sshPublicCerts;
    }
  },
  watch: {
    alertMsg(newAlert) {
      Vue.$log.debug("Enter");
      Vue.$log.debug("Alert Type: " + this.alert.type);

      if (this.alert.type == null) {
        Vue.$log.debug("Nothing in alert");
      } else {
        if (this.alert.type == "danger") {
          modalError = true;
        }
        else {
          modalError = false;
        }
        this.notifyVue(this.alert.type, this.alert.message);
        this.$store.dispatch("alert/clear");
      }
    }
  },
  created() {
    this.$store.dispatch("alert/clear");
    this.canCopy = !!navigator.clipboard;
  },
  methods: {
    async copy(cert) {
      await navigator.clipboard.writeText(cert);
    },
    getValidationClass(fieldName) {
      Vue.$log.debug("Enter");
      Vue.$log.debug("fieldName: " + fieldName);

      const field = this.$v[fieldName];
      Vue.$log.debug("field: " + JSON.stringify(field));

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    dateExpire: function(date) {
      Vue.$log.debug(date);
      var year = date.substring(0, 4);
      var month = date.substring(4, 6);
      var day = date.substring(6, 8);
      var displayDate = month + "/" + day + "/" + year;
      return displayDate;
    },
    handleChange(e, id) {
      Vue.$log.debug("event: " + e);
      Vue.$log.debug("id: " + id);
      if (id === "memberOfs") {
        this.memberOfs = e;
      }
      this.changes[id] = e;
    },
    update() {
      Vue.$log.debug("Enter");
      Vue.$log.debug("Changes: " + JSON.stringify(this.changes));

      this.$v.$touch();

      if (this.$v.$invalid) {
        Vue.$log.debug("Validation Errors");
      } else {
        if (JSON.stringify(this.changes) == JSON.stringify({})) {
          Vue.$log.debug("No changes. Ignore click");
        } else {
          this.sending = true;
          this.$emit("update-host", this.changes);
          this.sending = false;
        }
      }
    },
    notifyVue(type, msg) {
      Vue.$log.debug("Enter");
      this.$notify({
        message: msg,
        horizontalAlign: "center",
        verticalAlign: "top",
        type: type
      });
    },
    del(delKeyId) {
      Vue.$log.debug(delKeyId);
      var changes = {};
      changes.sshPublicCerts = this.sshPublicCerts.filter(
        key => key.keyid === delKeyId
      );
      var host = {};
      host.id = this.host.cn;
      host.cn = this.host.cn;
      host.changes = changes;
      this.$store.dispatch("hostStore/updateHost", { host });
    },
    renew(hostkey) {
      Vue.$log.debug(renew);

      var key = {};
      //key.keyid = Math.max(...this.host.sshPublicCerts.map(d => d.keyid)) + 1;
      key.name = hostkey.name;
      key.key = hostkey.key;
      key.fingerprint = hostkey.fingerprint;
      var sshCerts_arr = [];

      //sshCerts_arr = this.host.sshPublicCerts;

      sshCerts_arr.push(key);
      var sshKeys = {};
      sshKeys.sshPublicCerts = sshCerts_arr;
      var host = {};
      host.cn = this.host.cn;
      host.id = this.host.cn;
      host.changes = sshKeys;

      this.$store.dispatch("hostStore/updateHost", { host });
    },
    download(cert) {
      Vue.$log.debug("Enter");

      const blob = new Blob([cert], { type: 'plain/text' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'ssh_host_key-cert.pub'
      link.click();
      URL.revokeObjectURL(link.href);
    }
  }
};
</script>
