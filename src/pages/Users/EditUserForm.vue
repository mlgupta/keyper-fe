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
  <md-tab id="tab-home" md-label="User">
    <form novalidate @submit.prevent="update">
      <div class="md-layout">
        <div class="md-layout-item md-small-size-100 md-size-50">
          <md-field>
            <label>User Name (disabled)</label>
            <md-input :value="user.cn" disabled></md-input>
          </md-field>
        </div>
        <div class="md-layout-item md-small-size-100 md-size-50">
          <md-field :class="getValidationClass('mail')">
            <label>Email Address</label>
            <md-input
              v-model="mail"
              type="email"
              @input="handleChange($event, 'mail')"
              :disabled="sending"
            ></md-input>
            <span class="md-error" v-if="!$v.mail.required"
              >Email is required</span
            >
            <span class="md-error" v-else-if="!$v.mail.minlength"
              >Invalid Email</span
            >
          </md-field>
        </div>
        <div class="md-layout-item md-small-size-100 md-size-50">
          <md-field>
            <label>First Name</label>
            <md-input
              :value="user.givenName"
              type="text"
              @input="handleChange($event, 'givenName')"
            ></md-input>
          </md-field>
        </div>
        <div class="md-layout-item md-small-size-100 md-size-50">
          <md-field :class="getValidationClass('sn')">
            <label>Last Name</label>
            <md-input
              v-model="sn"
              type="text"
              @input="handleChange($event, 'sn')"
            ></md-input>
            <span class="md-error" v-if="!$v.sn.required"
              >Lastname is required</span
            >
            <span class="md-error" v-else-if="!$v.sn.minlength"
              >Invalid Lastname</span
            >
          </md-field>
        </div>
        <div class="md-layout-item md-small-size-100 md-size-100">
          <md-field>
            <label>Display name</label>
            <md-input
              :value="user.displayName"
              type="text"
              @input="handleChange($event, 'displayName')"
            ></md-input>
          </md-field>
        </div>
        <div class="md-layout-item md-small-size-100 md-size-100">
          <md-field :class="getValidationClass('principal')">
            <md-chips
              v-model="principal"
              :disabled="sending"
              :md-auto-insert="true"
              md-placeholder="Principal"
              @input="handleChange($event, 'principal')"
            ></md-chips>
            <span class="md-error" v-if="!$v.principal.required"
              >Principal is required</span
            >
          </md-field>
        </div>
        <div class="md-layout-item md-small-size-100 md-size-50">
          <md-field :class="getValidationClass('userPassword')">
            <label>Password</label>
            <md-input
              v-model="userPassword"
              @input="handleChange($event, 'userPassword')"
              type="password"
              :disabled="sending"
            ></md-input>
            <span class="md-error" v-if="!$v.userPassword.required"
              >Password is required</span
            >
            <span class="md-error" v-else-if="!$v.userPassword.minlength"
              >Invalid Password</span
            >
          </md-field>
        </div>
        <div class="md-layout-item md-small-size-100 md-size-50">
          <md-field :class="getValidationClass('confirmPassword')">
            <label>Confirm Password</label>
            <md-input
              v-model="confirmPassword"
              @input="handleChange($event, 'confirmPassword')"
              type="password"
              :disabled="sending"
            ></md-input>
            <span class="md-error" v-if="!$v.confirmPassword.sameAs"
              >Passwords must be same</span
            >
          </md-field>
        </div>
        <div class="md-layout-item md-size-100">
          <label>Groups</label>
          <md-field>
            <multiselect
              :value="memberOfs"
              @input="handleChange($event, 'memberOfs')"
              :options="groups"
              label="cn"
              track-by="dn"
              :multiple="true"
              :searchable="true"
              :hide-selected="true"
              placeholder="Select Groups"
            >
            </multiselect>
          </md-field>
        </div>
        <div class="md-layout-item md-size-50">
          <md-field maxlength="5" :class="getValidationClass('duration')">
            <label>Cert/Key Validity Duration</label>
            <md-input
              v-model="duration"
              :disabled="sending"
              @input="handleChange($event, 'duration')"
            ></md-input>
            <span class="md-error" v-if="!$v.duration.required"
              >Duration is required</span
            >
            <span class="md-error" v-else-if="!$v.duration.between"
              >Duration must be between 1 and 500</span
            >
          </md-field>
        </div>
        <div class="md-layout-item md-size-50">
          <md-field>
            <label for="durationUnit">Hours/Days/Weeks</label>
            <md-select
              v-model="durationUnit"
              name="durationUnit"
              id="DurationUnits"
              @input="handleChange($event, 'durationUnit')"
            >
              <md-option value="Hours">Hours</md-option>
              <md-option value="Days">Days</md-option>
              <md-option value="Weeks">Weeks</md-option>
            </md-select>
          </md-field>
        </div>
        <div class="md-layout-item md-small-size-100 md-size-50">
          <md-switch
            v-model="accountLocked"
            @change="value => handleChange(value, 'accountLocked')"
          >
            <div v-if="accountLocked">
              Account is Locked
              <md-icon title="Locked">lock</md-icon>
            </div>
            <div v-else>
              Account is Active
              <md-icon title="UnLocked">lock_open</md-icon>
            </div>
          </md-switch>
        </div>
        <div class="md-layout-item md-size-100 text-right">
          <md-button
            type="submit"
            class="md-raised md-success"
            :disabled="sending"
            >Update</md-button
          >
        </div>
      </div>
    </form>
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
  sameAs,
  between
} from "vuelidate/lib/validators";
import Multiselect from "vue-multiselect";

export default {
  name: "edit-user-form",
  components: {
    Multiselect
  },
  mixins: [validationMixin],
  props: {
    dataBackgroundColor: {
      type: String,
      default: ""
    },
    user: {
      type: Object
    },
    groups: {
      type: Array
    },
    hosts: {
      type: Array
    }
  },
  data() {
    return {
      changes: {},
      userPassword: "*****",
      confirmPassword: "*****",
      sn: this.user.sn,
      mail: this.user.mail,
      memberOfs: this.user.memberOfs,
      accountLocked: this.user.accountLocked,
      principal: [],
      duration: this.user.duration,
      durationUnit: this.user.durationUnit,
      sending: false
    };
  },
  validations: {
    sn: {
      required,
      minLength: minLength(1)
    },
    mail: {
      required,
      email,
      minLength: minLength(3)
    },
    userPassword: {
      minLength: minLength(3)
    },
    confirmPassword: {
      sameAsPassword: sameAs("userPassword")
    },
    principal: {
      required
    },
    duration: {
      required,
      between: between(1, 500)
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
    if (this.user.hasOwnProperty('principal')) {
      this.principal = this.user.principal;
    }
    else {
      this.principal = [];
    }
    if (this.user.hasOwnProperty('durationUnit')) {
      this.durationUnit = this.user.durationUnit;
    }
    else {
      this.durationUnit = 'Days';
    }
  },
  methods: {
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
    handleChange(e, id) {
      Vue.$log.debug("event: " + e);
      Vue.$log.debug("id: " + id);
      if (id === "memberOfs") {
        this.memberOfs = e;
      }
      if (id === "duration") {
        this.changes["durationUnit"] = this.durationUnit;
      }
      if (id === "durationUnit") {
        this.changes["duration"] = this.duration;
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
          this.$emit("update-user", this.changes);
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
    }
  }
};
</script>
