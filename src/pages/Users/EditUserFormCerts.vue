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
  <!-- User Certs -->
  <md-tab id="tab-keys" md-label="SSH Certs">
    <div class="md-layout-item md-size-100">
      <div class="md-layout-item md-size 100">
        <add-user-cert-modal
          :user="user"
          class="text-right"
        ></add-user-cert-modal>
      </div>
      <div v-if="hasKeys">
        <md-table v-model="sshPublicCerts">
          <md-table-row>
            <md-table-head>Name</md-table-head>
            <md-table-head>Fingerprint</md-table-head>
            <md-table-head>Expiration</md-table-head>
            <md-table-head>Principal</md-table-head>
            <md-table-head>Options</md-table-head>
          </md-table-row>
          <md-table-row v-for="item in sshPublicCerts" :key="item.id">
            <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>
            <md-table-cell>
              <v-clamp autoresize :max-lines="1">{{
                item.fingerprint
              }}</v-clamp>
            </md-table-cell>
            <md-table-cell md-label="Expiration">{{
              dateExpire(item.dateExpire)
            }}</md-table-cell>
            <md-table-cell v-if="item.hasOwnProperty('principal')" md-label="Principal">
              {{ item.principal.replace(/,/g, ', ') }}
            </md-table-cell>
            <md-table-cell>
              <md-button
                class="md-just-icon md-simple"
                @click="download(item.cert)"
              >
                <md-icon>get_app</md-icon>
                <md-tooltip md-direction="top">Download Certificate</md-tooltip>
              </md-button>
              <modal
                :title="'user Certificate'"
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
                @click="del(item.key)"
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
          md-icon="vpn_key"
          md-label="Add Key"
          md-description="Add public key for the user."
        >
          <add-user-cert-modal
            :user="user"
            class="text-right"
          >
          </add-user-cert-modal>
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
import { AdduserCertModal } from "@/components";
import { Modal } from "@/components";

export default {
  name: "edit-user-form-certs",
  components: {
    VClamp,
    AdduserCertModal,
    Modal
  },
  mixins: [validationMixin],
  props: {
    dataBackgroundColor: {
      type: String,
      default: ""
    },
    user: {
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
      sending: false
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
      if (this.user.hasOwnProperty('sshPublicCerts')) {
        if (this.user.sshPublicCerts.length > 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    sshPublicCerts() {
      return this.user.sshPublicCerts;
    }
  },
  watch: {
    alertMsg(newAlert) {
      Vue.$log.debug("Enter");
      Vue.$log.debug("Alert Type: " + this.alert.type);

      if (this.alert.type == null) {
        Vue.$log.debug("Nothing in alert");
      } else {
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
    notifyVue(type, msg) {
      Vue.$log.debug("Enter");
      this.$notify({
        message: msg,
        horizontalAlign: "center",
        verticalAlign: "top",
        type: type
      });
    },
    del(delKey) {
      Vue.$log.debug(delKey);
      var changes = {};
      changes.sshPublicCerts = this.sshPublicCerts.filter(
        key => key.key !== delKey
      );
      var user = {};
      user.id = this.user.cn;
      user.cn = this.user.cn;
      user.changes = changes;
      this.$store.dispatch("userStore/updateuser", { user });
    },
    renew(userkey) {
      Vue.$log.debug(renew);

      var key = {};
      key.keyid = Math.max(...this.user.sshPublicCerts.map(d => d.keyid)) + 1;
      key.keytype = 1;
      key.name = userkey.name;
      key.key = userkey.key;
      key.fingerprint = userkey.fingerprint;
      key.dateExpire = dateExpire;
      key.principal = userkey.principal;
      var sshCerts_arr = [];

      sshCerts_arr = this.user.sshPublicCerts;

      sshCerts_arr.push(key);
      var sshKeys = {};
      sshKeys.sshPublicCerts = sshCerts_arr;
      var user = {};
      user.cn = this.user.cn;
      user.id = this.user.cn;
      user.changes = sshKeys;

      this.$store.dispatch("userStore/updateuser", { user });
    },
    download(cert) {
      Vue.$log.debug("Enter");

      const blob = new Blob([cert], { type: 'plain/text' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'ssh_user_key-cert.pub'
      link.click();
      URL.revokeObjectURL(link.href);
    }
  }
};
</script>
