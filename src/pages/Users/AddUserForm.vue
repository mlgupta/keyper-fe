<template>
  <form>
    <md-card>
      <md-card-header :data-background-color="dataBackgroundColor">
        <h4 class="title">Add User</h4>
        <p class="category"></p>
      </md-card-header>

      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>User Name</label>
              <md-input v-model="user.cn"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>Email Address</label>
              <md-input  v-model="user.mail" type="email"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>First Name</label>
              <md-input v-model="user.givenName" type="text"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>Last Name</label>
              <md-input v-model="user.sn" type="text"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field>
              <label>Display name</label>
              <md-input v-model="user.displayName" type="text"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>Password</label>
              <md-input v-model="user.userPassword" type="password"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>Confirm Password</label>
              <md-input v-model="confirmPassword" type="password"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-size-100">
            <md-field maxlength="5">
              <label>About Me</label>
              <md-textarea ></md-textarea>
            </md-field>
          </div>
          <div class="md-layout-item md-size-100 text-right">
            <md-button class="md-raised md-success" @click="add">Add</md-button>
          </div>
        </div>
      </md-card-content>
    </md-card>
  </form>
</template>
<script>
import Vue from "vue";

export default {
  name: "add-user-form",
  props: {
    dataBackgroundColor: {
      type: String,
      default: ""
    },
  },
  data() {
    return {
      confirmPassword: null,
      user: {
        cn: null,
        mail: null,
        givenName: null,
        sn: null,
        displayName: null,
        userPassword: null
      }
    };
  },
  computed: {
    alert() {
      return this.$store.state.alert;
    },
    alertMsg() {
      return this.$store.state.alert.message;
    },
  },
  watch: {
    alertMsg(newAlert) {
      Vue.$log.debug("Enter in AddUserForm");
      Vue.$log.debug("Alert Type: " + this.alert.type);

      if (this.alert.type == null) {
        Vue.$log.debug("Nothing in alert");
      }
      else {
        if (this.alert.type == 'success') {
          this.confirmPassword = null;
          this.user.cn = null;
          this.user.mail = null;
          this.user.givenName = null;
          this.user.sn = null;
          this.user.displayName = null;
          this.user.userPassword = null;
        }
        this.notifyVue(this.alert.type, this.alert.message);
        this.$store.dispatch('alert/clear');
      }
    }
  },
  created () {
    this.$store.dispatch('alert/clear');
  },
  methods: {
    add() {
      Vue.$log.debug("Enter");

      if (JSON.stringify(this.user) == JSON.stringify({})) {
        Vue.$log.debug("Empty user. Ignore click");
      }
      else {
        this.$emit('add-user', this.user);
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
<style></style>
