<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-66">
        <form>
          <md-card>
            <md-card-header :data-background-color="dataBackgroundColor">
              <h4 class="title">Login</h4>
            </md-card-header>

            <md-card-content>
              <div class="md-layout">
                <div class="md-layout-item md-small-size-100">
                  <md-field class="md-form-group">
                    <md-icon>face</md-icon>
                    <label>User Name</label>
                    <md-input v-model="username" type="text"></md-input>
                  </md-field>
                  <md-field class="md-form-group">
                    <md-icon>lock_outline</md-icon>
                    <label>Password</label>
                    <md-input v-model="password" type="password"></md-input>
                  </md-field>
                  <md-button @click="authenticate" class="md-raised md-success">Login</md-button>
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
import axios from 'axios';
import Vue from "vue";

export default {
  name: "login-form",
  props: {
    dataBackgroundColor: {
      type: String,
      default: "green"
    }
  },
  data() {
    return {
      username: null,
      password: null,
      loggedIn: false
    };
  },
  computed: {
    loggingIn() {
      return this.$store.state.authentication.status.loggingIn;
    },
    missingUserName: function() {
      Vue.$log.debug("Enter");
      return this.username == null;
    },
    missingPassword: function() {
      return this.password == null;
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
    authenticate() {
      Vue.$log.debug("Enter");

      const { username, password } = this;
      const { dispatch } = this.$store;

      if (this.missingUserName) {
        Vue.$log.debug("Missing Username");
        this.notifyVue('warning', 'Username is required');
      }
      if (this.missingPassword) {
        this.notifyVue('warning', 'Password is required');
      }

      if (username && password) {
        dispatch('authentication/login', { username, password });
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
