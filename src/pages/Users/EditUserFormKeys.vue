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
  <!-- User Keys -->
  <md-tab id="tab-keys" md-label="SSH Keys">
    <div class="md-layout-item md-size-100">
      <div class="md-layout-item md-size 100">
        <add-user-key-modal
          :hosts="memberOfs"
          :user="user"
          :modalError="modalError"
          class="text-right"
        ></add-user-key-modal>
      </div>
      <div v-if="hasKeys">
        <md-table v-model="sshPublicKeys">
          <md-table-row>
            <md-table-head>ID</md-table-head>
            <md-table-head>Name</md-table-head>
            <md-table-head>Key Fingerprint</md-table-head>
            <md-table-head>Expiration</md-table-head>
            <md-table-head>Hosts</md-table-head>
          </md-table-row>
          <md-table-row v-for="item in sshPublicKeys" :key="item.keyid">
            <md-table-cell md-label="Name">{{ item.keyid }}</md-table-cell>
            <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>
            <md-table-cell>
              <v-clamp autoresize :max-lines="1">{{
                item.fingerprint
              }}</v-clamp>
            </md-table-cell>
            <md-table-cell md-label="Expiration">{{
              dateExpire(item.dateExpire)
            }}</md-table-cell>
            <md-table-cell md-label="Hosts">{{
              displayHosts(item.hostGroups)
            }}</md-table-cell>
            <md-table-cell>
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
          md-icon="vpn_key"
          md-label="Add Key"
          md-description="Add key for the user."
        >
          <add-user-key-modal
            :hosts="memberOfs"
            :user="user"
            :modalError="modalError"
            class="text-right"
          >
          </add-user-key-modal>
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
import { AddUserKeyModal } from "@/components";

export default {
  name: "edit-user-form-keys",
  components: {
    VClamp,
    AddUserKeyModal
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
      changes: {},
      memberOfs: this.user.memberOfs,
      accountLocked: this.user.accountLocked,
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
      if (this.user.hasOwnProperty('sshPublicKeys')) {
        if (this.user.sshPublicKeys.length > 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    sshPublicKeys() {
      var sshPublicKeys = [];
      sshPublicKeys = this.user.sshPublicKeys;
      if (sshPublicKeys.filter(d => d.hasOwnProperty('keyid')) == 0) {
        var i = 0;
        sshPublicKeys.forEach(element => {
          element.keyid = i;
          ++i;
        });
      }
      return sshPublicKeys;
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
  },
  methods: {
    displayHosts: function(hosts) {
      var displayHost = hosts
        .map(val => val.split(",")[0].split("=")[1])
        .join(", ");
      return displayHost;
    },
    dateExpire: function(date) {
      Vue.$log.debug(date);
      var year = date.substring(0, 4);
      var month = date.substring(4, 6);
      var day = date.substring(6, 8);
      var displayDate = month + "/" + day + "/" + year;
      return displayDate;
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
      changes.sshPublicKeys = this.sshPublicKeys.filter(
        key => key.keyid === delKeyId
      );
      var user = {};
      user.id = this.user.cn;
      user.changes = changes;
      this.$store.dispatch("userStore/updateUser", { user });

      if (this.user.cn == this.$store.state.authentication.user.cn) {
        this.$store.dispatch("authentication/updateUser", { user });
      }
    }
  }
};
</script>
