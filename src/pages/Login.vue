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
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-66">
        <form novalidate @submit.prevent="authenticate">
          <md-card>
            <md-card-header :data-background-color="dataBackgroundColor">
              <h4 class="title">Login</h4>
            </md-card-header>

            <md-card-content>
              <div class="md-layout">
                <div class="md-layout-item md-small-size-100">
                  <md-field class="md-form-group" :class="getValidationClass('username')">
                    <md-icon>face</md-icon>
                    <label>User Name</label>
                    <md-input v-model="form.username" type="text" autocomplete="username" :disabled="sending"></md-input>
                    <span class="md-error" v-if="!$v.form.username.required">Username is required</span>
                    <span class="md-error" v-else-if="!$v.form.username.minlength">Invalid Username</span>
                  </md-field>
                  <md-field class="md-form-group" :class="getValidationClass('password')">
                    <md-icon>lock_outline</md-icon>
                    <label>Password</label>
                    <md-input v-model="form.password" type="password" autocomplete="password" :disabled="sending"></md-input>
                    <span class="md-error" v-if="!$v.form.password.required">Password is required</span>
                    <span class="md-error" v-else-if="!$v.form.password.minlength">Invalid Password</span>
                  </md-field>
                  <md-button type="submit" class="md-raised md-success" :disabled="sending">Login</md-button>
                </div>
              </div>
            </md-card-content>
          </md-card>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { validationMixin } from 'vuelidate';
import { required, minLength, maxLength } from 'vuelidate/lib/validators';

export default {
  name: "login-form",
  mixins: [validationMixin],
  props: {
    dataBackgroundColor: {
      type: String,
      default: "green"
    }
  },
  data() {
    return {
      form: {
        username: null,
        password: null
      },
      loggedIn: false,
      sending: false
    };
  },
  validations: {
    form: {
      username: {
        required,
        minLength: minLength(3)
      },
      password: {
        required,
        minLength: minLength(3)
      }
    }
  },
  computed: {
    loggingIn() {
      return this.$store.state.authentication.status.loggingIn;
    },
    missingUserName: function() {
      Vue.$log.debug("Enter");
      return this.form.username == null;
    },
    missingPassword: function() {
      return this.form.password == null;
    },
    alert() {
      return this.$store.state.alert;
    },
    alertMsg() {
      return this.$store.state.alert.message;
    },

  },
  watch: {
    alertMsg(newAlert) {
      Vue.$log.debug("Enter Login alert");

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
    this.$store.dispatch('authentication/logout');
    this.$store.dispatch('alert/clear');
  },
  methods: {
    getValidationClass (fieldName) {
      Vue.$log.debug("Enter");
      Vue.$log.debug("fieldName: " + fieldName);

      const field = this.$v.form[fieldName];
      Vue.$log.debug("field: " + JSON.stringify(field));
      Vue.$log.debug("md-invalid: " + field.$invalid && field.$dirty);

      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    },
    authenticate() {
      Vue.$log.debug("Enter");

      const { username, password } = this.form;
      const { dispatch } = this.$store;

      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.sending = true;
        dispatch('authentication/login', { username, password });
        this.sending = false
      }
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
