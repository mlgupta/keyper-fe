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
              <md-input v-model="user.givenName" type="text" :disabled="sending"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field>
              <label>Last Name</label>
              <md-input v-model="user.sn" type="text" :disabled="sending"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field>
              <label>Display name</label>
              <md-input v-model="user.displayName" type="text" :disabled="sending"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-50">
            <md-field :class="getValidationClass('userPassword')">
              <label>Password</label>
              <md-input v-model="user.userPassword" type="password" :disabled="sending"></md-input>
              <span class="md-error" v-if="!$v.user.userPassword.required">Username is required</span>
              <span class="md-error" v-else-if="!$v.user.userPassword.minlength">Invalid Username</span>
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
                  <label>Owners</label>
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
import { validationMixin } from 'vuelidate';
import { required, minLength, maxLength, email, sameAs } from 'vuelidate/lib/validators';
import Multiselect from 'vue-multiselect';

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
      confirmPassword: null,
      user: {
        cn: null,
        mail: null,
        givenName: null,
        sn: null,
        displayName: null,
        userPassword: null,
        confirmPassword: null,
        memberOfs: []
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
        sameAsPassword: sameAs('userPassword')
      }
    },
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
      getValidationClass (fieldName) {
      Vue.$log.debug("Enter");
      Vue.$log.debug("fieldName: " + fieldName);

      const field = this.$v.user[fieldName];
      Vue.$log.debug("field: " + JSON.stringify(field));
      Vue.$log.debug("md-invalid: " + field.$invalid && field.$dirty);

      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    },
    add() {
      Vue.$log.debug("Enter");

      this.$v.$touch();

      if (this.$v.$invalid) {
        Vue.$log.debug("Validation Errors");
      }
      else {
        this.sending = true;
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
