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
        <h4 class="title">Add Group</h4>
        <p class="category"></p>
      </md-card-header>
      <md-card-content>
        <div class="md-layout md-gutter">
          <div class="md-layout-item md-size-100">
            <md-field :class="getValidationClass('cn')">
              <label>Name</label>
              <md-input v-model="group.cn" :disabled="sending"></md-input>
              <span class="md-error" v-if="!$v.group.cn.required">Group name is required</span>
              <span class="md-error" v-else-if="!$v.group.cn.minlength">Invalid Group Name</span>
            </md-field>
          </div>
          <div class="md-layout-item md-size-100">
            <md-field maxlength="5" :class="getValidationClass('description')">
              <label>Description</label>
              <md-textarea v-model="group.description"></md-textarea>
              <span class="md-error" v-if="!$v.group.description.required">Description is required</span>
              <span class="md-error" v-else-if="!$v.group.description.minlength">Invalid Description</span>
              <span class="md-error" v-else-if="!$v.group.description.maxlength">Invalid Description</span>
            </md-field>
          </div>
          <div class="md-layout-item md-size-100">
            <md-field>
              <label>User Members</label>
              <multiselect v-model="group.members" :options="users" label="cn" track-by="dn" :multiple="true" :searchable="true" :hide-selected="true" placeholder="Select Members">
              </multiselect>
            </md-field>
          </div>
          <div class="md-layout-item md-size-100">
            <md-field>
              <label>Host Members</label>
              <multiselect v-model="group.hosts" :options="hosts" label="cn" track-by="dn" :multiple="true" :searchable="true" :hide-selected="true" placeholder="Select Hosts">
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
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import Multiselect from "vue-multiselect";

export default {
  components: {
    Multiselect
  },
  name: "add-group-form",
  mixins: [validationMixin],
  props: {
    dataBackgroundColor: {
      type: String,
      default: ""
    },
    users: {
      type: Array
    },
    hosts: {
      type: Array
    }
  },
  data() {
    return {
      group: {
        cn: null,
        description: null,
        members: [],
        hosts: []
      },
      sending: false
    };
  },
  validations: {
    group: {
      cn: {
        required,
        minLength: minLength(3)
      },
      description: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(1000)
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
      Vue.$log.debug("Enter in AddGroupForm");
      Vue.$log.debug("Alert Type: " + this.alert.type);

      if (this.alert.type == null) {
        Vue.$log.debug("Nothing in alert");
      } else {
        if (this.alert.type == "success") {
          this.group.cn = null;
          this.group.description = null;
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

      const field = this.$v.group[fieldName];
      Vue.$log.debug("field: " + JSON.stringify(field));
      Vue.$log.debug("md-invalid: " + field.$invalid && field.$dirty);

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    add() {
      Vue.$log.debug("Enter");

      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.sending = true;
        this.$emit("add-group", this.group);
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
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>