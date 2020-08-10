<template>
  <form>
    <md-card>
      <md-card-header :data-background-color="dataBackgroundColor">
        <h4 class="title">Edit Host</h4>
        <p class="category"></p>
      </md-card-header>

      <md-card-content>
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
              <md-textarea :value="host.description" @input="handleChange($event, 'description')"></md-textarea>
            </md-field>
          </div>    
          <div class="md-layout-item md-size-100">
              <md-field>
                  <label>Owners</label>
                  <multiselect :value="value" @input="handleChange($event, 'owners')" :options="users" label="cn" track-by="dn" :multiple="true" :searchable="true" :hide-selected="true" placeholder="Select Owners">                    
                  </multiselect>                  
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
import { validationMixin } from 'vuelidate';
import { required, minLength, maxLength } from 'vuelidate/lib/validators';
import Multiselect from 'vue-multiselect';

export default {
  components: {
    Multiselect
  },
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
      value: this.host.owners
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
      Vue.$log.debug("Enter");
      Vue.$log.debug("Alert Type: " + this.alert.type);

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
    this.$store.dispatch('alert/clear');
  },
  methods: {
    handleChange(e, id) {
      Vue.$log.debug("event: " + JSON.stringify(e));    
      if (id === 'owners'){
        this.value = e  
      }
      Vue.$log.debug("id: " + id);
      this.changes[id] = e;
      Vue.$log.debug(JSON.stringify(this.changes));
    },
    handleSelect(e) {
      Vue.$log.debug(e)
      
    },
    update() {
      Vue.$log.debug("Enter");
      if (JSON.stringify(this.changes) == JSON.stringify({})) {
        Vue.$log.debug("No changes. Ignore click");
      }
      else {
        this.$emit('update-host', this.changes);
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