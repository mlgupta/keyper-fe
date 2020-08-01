<template>
  <form>
    <md-card>
      <md-card-header :data-background-color="dataBackgroundColor">
        <h4 class="title">Edit User</h4>
        <p class="category"></p>
      </md-card-header>

      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>User Name (disabled)</label>
              <md-input :value="user.cn" disabled></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>Email Address</label>
              <md-input  name="mail" :value="user.mail" type="email" @input="handleChange($event, 'mail')"></md-input>
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
            <md-field>
              <label>Password</label>
              <md-input v-model="password" type="password" @input="handleChange($event, 'password')"></md-input>
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
            <md-button class="md-raised md-success" @click="update">Update</md-button>
          </div>
        </div>
      </md-card-content>
    </md-card>
  </form>
</template>
<script>
import Vue from "vue";

export default {
  name: "edit-user-form",
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
      password: null,
      confirmPassword: null
    };
  },
  methods: {
    handleChange(e, id) {
      Vue.$log.debug("event: " + e);
      Vue.$log.debug("id: " + id);

      this.changes[id] = e;
    },
    update() {
      Vue.$log.debug("Enter");

      if (JSON.stringify(this.changes) == JSON.stringify({})) {
        Vue.$log.debug("No changes. Ignore click");
      }
      else {
        this.$emit('update-user', this.changes);
      }
    }
  }
};
</script>
<style></style>
