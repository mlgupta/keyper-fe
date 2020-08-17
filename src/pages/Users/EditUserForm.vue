<template>  
  <div class="md-layout">
    <div class="md-layout-item md-size-100">
      <nav-tabs-card>
        <template slot='content'>
          <span class="md-nav-tabs-title">Edit:</span>
          <md-tabs class='md-success' md-alignment='left'>
            <md-tab id='tab-home' md-label='User'>  
              <form>
                <div class="md-layout">                  
                  <div class="md-layout-item md-size-100">              
                    <label>Account Status:   </label>
                    <md-icon v-if="user.accountLocked" title='Locked'>lock</md-icon>
                    <md-icon v-else title='UnLocked'>lock_open</md-icon>
                    <md-field>                                        
                      <md-switch v-model="user.accountLocked" @change="value => handleChange(value, 'accountLocked')"></md-switch>                      
                    </md-field>
                  </div>
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
                  <div class="md-layout-item md-size-100">
                      <label>Groups</label>
                      <md-field>                  
                          <multiselect :value=value @input="handleChange($event, 'groups')" :options="groups" label="cn" track-by="dn" :multiple="true" :searchable="true" :hide-selected="true" placeholder="Select Groups">
                          </multiselect>
                      </md-field>
                  </div>                  
                  <div class="md-layout-item md-size-100 text-right">
                    <md-button class="md-raised md-success" @click="update">Update</md-button>
                  </div>
                </div>                                
              </form>  
            </md-tab>

            <!-- User Keys -->
            <md-tab id='tab-keys' md-label='SSH Keys'>  
              <div class="md-layout-item md-size-100">                   
                    <div class="md-layout-item md-size 100">                                          
                      <add-user-key-modal :hosts="value" :user="user" class="text-right"> </add-user-key-modal>
                    </div>
                    <div v-if="hasKeys">
                      <md-table v-model="user.sshPublicKeys">       
                        <md-table-row>
                          <md-table-head>Key</md-table-head>
                          <md-table-head>Expiration</md-table-head>
                          <md-table-head>Hosts</md-table-head>
                        </md-table-row>    
                        <md-table-row v-for="item in user.sshPublicKeys" :key="item">
                          <md-table-cell>
                            <v-clamp autoresize :max-lines="1"> {{item.key}} </v-clamp>
                          </md-table-cell>
                          <md-table-cell md-label="Expiration"> {{dateExpire(item.dateExpire)}} </md-table-cell>
                          <md-table-cell md-label='Hosts'> {{displayHosts(item.hostGroups)}} </md-table-cell>
                          <md-table-cell>
                            <md-button class='md-just-icon md-simple md-danger' @click="del(item.key)">
                              <md-icon>close</md-icon>
                              <md-tooltip md-direction='top'>Delete Key</md-tooltip>
                            </md-button>
                          </md-table-cell>
                        </md-table-row>                        
                      </md-table>      
                    </div>  
                    <div v-else>
                      <md-empty-state
                        md-icon="vpn_key"
                        md-label="Add Key"
                        md-description="Add key for the user.">
                        <add-user-key-modal :hosts="value" :user="user" class="text-right"> </add-user-key-modal>
                      </md-empty-state>
                    </div>              
                  </div>
            </md-tab>
          </md-tabs>
        </template>
      </nav-tabs-card>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { validationMixin } from 'vuelidate';
import { required, minLength, maxLength } from 'vuelidate/lib/validators';
import VClamp from 'vue-clamp';
import Multiselect from 'vue-multiselect';
import { AddUserKeyModal } from "@/components";
import { NavTabsCard } from '@/components'


export default {
  name: "edit-user-form",
  components: {
    VClamp,
    Multiselect,
    AddUserKeyModal,
    NavTabsCard
  },
  mixins: [validationMixin],
  props: {
    dataBackgroundColor: {
      type: String,
      default: ""
    },
    user: {
      type: Object
    },
    groups: {
      type: Array
    },
    hosts: {
      type: Array
    }

  },
  data() {
    return {
      changes: {},
      password: null,
      confirmPassword: null,
      value: this.user.memberOfs
    };
  },
  computed: {    
    alert() {
      return this.$store.state.alert;
    },
    alertMsg() {
      return this.$store.state.alert.message;
    },
    hasKeys() {
      if ("sshPublicKeys" in this.user){
        if (this.user.sshPublicKeys.length > 0){
          return true;
        }else {
          return false;
        }
      }else {
        return false;
      }
    }
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
    displayHosts: function(hosts){
      var displayHost = hosts.map(val => val.split(',')[0].split('=')[1]).join(', ');
      return displayHost
    },
    dateExpire: function(date) {      
      Vue.$log.debug(date);
      var year = date.substring(0, 4);
      var month = date.substring(4, 6);
      var day = date.substring(6,8);
      var displayDate = month + '/' + day + "/" + year;
      return displayDate
    },
    handleChange(e, id) {
      Vue.$log.debug("event: " + e);
      Vue.$log.debug("id: " + id);
      if (id === 'groups'){
        this.value = e;
      }
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
    },
    del(delKey) {
      Vue.$log.debug(delKey);
      var keys = this.user.sshPublicKeys;
      keys = keys.filter(key => key.key !== delKey)
      this.user.sshPublicKeys = keys;
      var changes = {}
      changes.sshPublicKeys = this.user.sshPublicKeys;
      var user = {}
      user.id = this.user.cn;
      user.changes = changes;
      this.$store.dispatch('userStore/updateUser', { user } );
    } 
  }
};
</script>
