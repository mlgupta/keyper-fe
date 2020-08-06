<template>
  <form novalidate @submit.prevent="add">
    <md-card>
      <md-card-header :data-background-color="dataBackgroundColor">
        <h4 class="title">Add Host</h4>
        <p class="category"></p>
      </md-card-header>

      <md-card-content>
        <div class="md-layout md-gutter">
          <div class="md-layout-item md-size-100">
            <md-field :class="getValidationClass('cn')">
              <label>Name</label>
              <md-input v-model="host.cn" :disabled="sending"></md-input>
              <span class="md-error" v-if="!$v.host.cn.required">Host name is required</span>
              <span class="md-error" v-else-if="!$v.host.cn.minlength">Invalid Host Name</span>
            </md-field>
          </div>      
          <div class="md-layout-item md-size-100">
            <md-field maxlength="5">
              <label>Description</label>
              <md-textarea v-model="host.description"></md-textarea>
            </md-field>
          </div>    
          <div class="md-layout-item md-size-100">
              <md-field>
                  <label>Owners</label>
                  <multiselect v-model="host.owners" :options="users" label="cn" track-by="dn" :multiple="true" :searchable="true" :hide-selected="true" placeholder="Select Owners">                    
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
import { required, minLength, maxLength } from 'vuelidate/lib/validators';
import Multiselect from 'vue-multiselect';

export default {
  components: {
    Multiselect
  },
  name: "add-host-form",
  mixins: [validationMixin],  
  props: {
    dataBackgroundColor: {
      type: String,
      default: ""
    },
    users: {
        type: Array
    }
  },  
  data() {
    return {      
      host: {
        cn: null,
        description: null,        
        owners: []
      },

      sending: false
    };
  },
  validations: {
    host: {
      cn: {
        required,
        minLength: minLength(3)
      }
    }
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
      Vue.$log.debug("Enter in AddHostForm");
      Vue.$log.debug("Alert Type: " + this.alert.type);

      if (this.alert.type == null) {
        Vue.$log.debug("Nothing in alert");
      }
      else {
        if (this.alert.type == 'success') {          
          this.host.cn = null;          
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

      const field = this.$v.host[fieldName];
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

      if (!this.$v.$invalid) {
        this.sending = true;
        this.$emit('add-host', this.host);
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
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>