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
  <form novalidate @submit.prevent="add">
    <md-card>
      <md-card-header :data-background-color="dataBackgroundColor">
        <h4 class="title">Add User</h4>
        <p class="category"></p>
      </md-card-header>

      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field :class="getValidationClass('cn')">
              <label>User Name</label>
              <md-input v-model="user.cn" :disabled="sending"></md-input>
              <span class="md-error" v-if="!$v.user.cn.required">Username is required</span>
              <span class="md-error" v-else-if="!$v.user.cn.minlength">Invalid Username</span>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field :class="getValidationClass('mail')">
              <label>Email Address</label>
              <md-input  v-model="user.mail" type="email" :disabled="sending"></md-input>
              <span class="md-error" v-if="!$v.user.mail.required">Email is required</span>
              <span class="md-error" v-else-if="!$v.user.mail.minlength">Invalid Email</span>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>First Name</label>
              <md-input v-model="user.givenName" @input="displayName()" type="text" :disabled="sending"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field :class="getValidationClass('sn')">
              <label>Last Name</label>
              <md-input v-model="user.sn" @input="displayName()" type="text" :disabled="sending"></md-input>
              <span class="md-error" v-if="!$v.user.sn.required">Lastname is required</span>
              <span class="md-error" v-else-if="!$v.user.sn.minlength">Invalid Lastname</span>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field>
              <label>Display name</label>
              <md-input v-model="user.displayName" :value="displayName" type="text" :disabled="sending"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field :class="getValidationClass('userPassword')">
              <label>Password</label>
              <md-input v-model="user.userPassword" type="password" :disabled="sending"></md-input>
              <span class="md-error" v-if="!$v.user.userPassword.required">Password is required</span>
              <span class="md-error" v-else-if="!$v.user.userPassword.minlength">Invalid Password</span>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field :class="getValidationClass('confirmPassword')">
              <label>Confirm Password</label>
              <md-input v-model="user.confirmPassword" type="password" :disabled="sending"></md-input>
              <span class="md-error" v-if="!$v.user.confirmPassword.required">Confirm Password is required</span>
              <span class="md-error" v-else-if="!$v.user.confirmPassword.sameAs">Passwords must be same</span>
            </md-field>
          </div>
          <div class="md-layout-item md-size-100">
            <md-field>
                <label>Groups</label>
                <multiselect v-model="user.memberOfs" :options="groups" label="cn" track-by="dn" :multiple="true" :searchable="true" :hide-selected="true" placeholder="Select Groups">
                </multiselect>
            </md-field>
          </div>
          <div class="md-layout-item md-size-100 text-right">
            <md-button type="submit" class="md-raised md-success" :disabled="sending">Add</md-button>
          </div>
        </div>
      </md-card-content>
    </md-card>
  </form>
</template>
<script>
import Vue from "vue";
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength, email, sameAs } from "vuelidate/lib/validators";
import Multiselect from "vue-multiselect";

export default {
  components: {
    Multiselect
  },
  name: "add-user-form",
  mixins: [validationMixin],
  props: {
    dataBackgroundColor: {
      type: String,
      default: ""
    },
    groups: {
      type: Array
    }
  },
  data() {
    return {
      user: {
        cn: null,
        mail: null,
        givenName: null,
        sn: null,
        displayName: null,
        userPassword: null,
        confirmPassword: null,
        memberOfs: [],
        sshPublicKeys: []
      },
      sending: false
    };
  },
  validations: {
    user: {
      cn: {
        required,
        minLength: minLength(3)
      },
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
        required,
        minLength: minLength(3)
      },
      confirmPassword: {
        required,
        minLength: minLength(3),
        sameAsPassword: sameAs("userPassword")
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
      Vue.$log.debug("Enter in AddUserForm");
      Vue.$log.debug("Alert Type: " + this.alert.type);

      if (this.alert.type == null) {
        Vue.$log.debug("Nothing in alert");
      } else {
        if (this.alert.type == "success") {
          this.user.confirmPassword = null;
          this.user.cn = null;
          this.user.mail = null;
          this.user.givenName = null;
          this.user.sn = null;
          this.user.displayName = null;
          this.user.userPassword = null;
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

      const field = this.$v.user[fieldName];
      Vue.$log.debug("field: " + JSON.stringify(field));
      Vue.$log.debug("md-invalid: " + field.$invalid && field.$dirty);

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    displayName() {
      var fn = this.user.givenName === null ? "" : this.user.givenName;
      var ln = this.user.sn === null ? "" : this.user.sn;
      this.user.displayName = fn + " " + ln;
    },
    add() {
      Vue.$log.debug("Enter");

      this.$v.$touch();

      if (this.$v.$invalid) {
        Vue.$log.debug("Validation Errors");
      } else {
        this.sending = true;
        this.$emit("add-user", this.user);
        this.sending = false;
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
