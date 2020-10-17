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
            <md-input v-model="mail" type="email" @input="handleChange($event, 'mail')" :disabled="sending"></md-input>
            <span class="md-error" v-if="!$v.mail.required">Email is required</span>
            <span class="md-error" v-else-if="!$v.mail.minlength">Invalid Email</span>
          </md-field>
        </div>
        <div class="md-layout-item md-small-size-100 md-size-50">
          <md-field>
            <label>First Name</label>
            <md-input :value="user.givenName" type="text" @input="handleChange($event, 'givenName')"></md-input>
          </md-field>
        </div>
        <div class="md-layout-item md-small-size-100 md-size-50">
          <md-field>
            <label>Last Name</label>
            <md-input :value="user.sn" type="text" @input="handleChange($event, 'sn')"></md-input>
          </md-field>
        </div>
        <div class="md-layout-item md-small-size-100 md-size-100">
          <md-field>
            <label>Display name</label>
            <md-input :value="user.displayName" type="text" @input="handleChange($event, 'displayName')"></md-input>
          </md-field>
        </div>
        <div class="md-layout-item md-small-size-100 md-size-50">
          <md-field :class="getValidationClass('userPassword')">
            <label>Password</label>
            <md-input v-model="userPassword" type="password" @input="handleChange($event, 'userPassword')" :disabled="sending"></md-input>
            <span class="md-error" v-if="!$v.userPassword.required">Password is required</span>
            <span class="md-error" v-else-if="!$v.userPassword.minlength">Invalid Password</span>
          </md-field>
        </div>
        <div class="md-layout-item md-small-size-100 md-size-50">
          <md-field :class="getValidationClass('confirmPassword')">
            <label>Confirm Password</label>
            <md-input v-model="confirmPassword" @input="handleChange($event, 'confirmPassword')" type="password" :disabled="sending"></md-input>
            <span class="md-error" v-if="!$v.confirmPassword.sameAs">Passwords must be same</span>
          </md-field>
        </div>
        <div class="md-layout-item md-size-100 text-right">
          <md-button type="submit" class="md-raised md-success" :disabled="sending">Update</md-button>
        </div>
      </div>
    </form>
  </md-tab>
</template>
<script>
import Vue from "vue";
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength, email, sameAs } from "vuelidate/lib/validators";

export default {
  name: "user-card",
  components: {
  },
  mixins: [validationMixin],
  props: {
    user: {
      type: Object
    }
  },
  validations: {
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
    }
  },
  data() {
    return {
      changes: {},
      mail: this.user.mail,
      userPassword: "*****",
      confirmPassword: "*****",
      value: this.user.memberOfs,
      sending: false
    };
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
  created () {
    this.$store.dispatch("alert/clear");
  },
  methods: {
    getValidationClass(fieldName) {
      Vue.$log.debug("Enter");
      Vue.$log.debug("fieldName: " + fieldName);

      const field = this.$v[fieldName];
      Vue.$log.debug("field: " + JSON.stringify(field));
      Vue.$log.debug("md-invalid: " + field.$invalid && field.$dirty);

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    handleChange(e, id) {
      Vue.$log.debug("event: " + e);
      Vue.$log.debug("id: " + id);
      if (id === "groups") {
        this.value = e;
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
<style></style>
