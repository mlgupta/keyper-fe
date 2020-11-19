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
  <md-tab id="tab-home" md-label="Host">
    <form novalidate @submit.prevent="update">
      <div class="md-layout md-gutter">
        <div class="md-layout-item md-size-100">
          <md-field>
            <label>Name (disabled)</label>
            <md-input :value="host.cn" disabled></md-input>
          </md-field>
        </div>
        <div class="md-layout-item md-size-100">
          <md-field maxlength="5">
            <label>Description</label>
            <md-textarea
              :value="host.description"
              @input="handleChange($event, 'description')"
              :disabled="sending"
            ></md-textarea>
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
        <div class="md-layout-item md-size-50">
          <md-field maxlength="5" :class="getValidationClass('duration')">
            <label>Cert Validity</label>
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
        <div class="md-layout-item md-size-100 text-right">
          <md-button
            class="md-raised md-default"
            v-on:click="cancel"
            >cancel</md-button
          >
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
  between
} from "vuelidate/lib/validators";

export default {
  name: "edit-host-form",
  mixins: [validationMixin],
  props: {
    dataBackgroundColor: {
      type: String,
      default: ""
    },
    host: {
      type: Object
    },
    users: {
      type: Array
    },
    owners: {
      type: Array
    }
  },
  data() {
    return {
      changes: {},
      value: this.host.owners,
      principal: [],
      duration: this.host.duration,
      durationUnit: this.host.durationUnit,
      sending: false
    };
  },
  validations: {
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
    if (this.host.hasOwnProperty("principal")) {
      this.principal = this.host.principal;
    } else {
      this.principal = [];
    }
    if (this.host.hasOwnProperty("durationUnit")) {
      this.durationUnit = this.host.durationUnit;
    } else {
      this.durationUnit = "Days";
    }
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
      Vue.$log.debug("event: " + JSON.stringify(e));
      if (id === "owners") {
        this.value = e;
      }
      if (id === "duration") {
        this.changes["durationUnit"] = this.durationUnit;
      }
      if (id === "durationUnit") {
        this.changes["duration"] = this.duration;
      }
      Vue.$log.debug("id: " + id);
      this.changes[id] = e;
      Vue.$log.debug(JSON.stringify(this.changes));
    },
    handleSelect(e) {
      Vue.$log.debug(e);
    },
    update() {
      Vue.$log.debug("Enter");

      this.$v.$touch();

      if (this.$v.$invalid) {
        Vue.$log.debug("Validation Errors");
      } else {
        if (JSON.stringify(this.changes) == JSON.stringify({})) {
          Vue.$log.debug("No changes. Ignore click");
        } else {
          this.sending = true;
          this.$emit("update-host", this.changes);
          this.sending = false;
        }
      }
    },
    cancel() {
      Vue.$log.debug("Enter");
      this.$emit("cancel-update-host");
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