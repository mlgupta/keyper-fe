<template>
  <div>   
    <div v-if="hasHosts">
      <md-table v-model="hosts" :table-header-color="tableHeaderColor" @md-selected="onSelect" md-sort="cn" md-sort-order="asc" md-card md-fixed-header> 
        <md-table-toolbar>
          <div class="md-layout-item md-size-100 text-right">   
            <md-button class="md-raised md-success" @click="add"><md-icon>add</md-icon>Add</md-button>
          </div>        
        </md-table-toolbar>
        <md-table-toolbar slot="md-table-alternate-header" slot-scope="{ count }" class="md-danger">
          <div class="md-toolbar-section-start">{{ getAlternateLabel(count) }}</div>
          <div class="md-toolbar-section-end">
            <md-dialog-confirm
              :md-active.sync="active"
              md-content="Are you sure, you want to delete the selected host(s)?"
              md-confirm-text="Yes"
              md-cancel-text="No"
              @md-confirm="del" />
            <md-button class="md-raised md-danger" @click="active = true"><md-icon>delete</md-icon>Delete</md-button>
          </div>
        </md-table-toolbar>
        
          <md-table-row slot="md-table-row" slot-scope="{ item }" md-selectable="multiple" md-auto-select>
            <md-table-cell md-label="Name" md-sort-by="cn"><router-link :to="{ path: item.cn }" append>{{ item.cn }}</router-link></md-table-cell>
            <md-table-cell md-label="Description">
              <v-clamp autoresize :max-lines="1"> {{ item.description }} </v-clamp>
            </md-table-cell>
            <md-table-cell md-label="Member Of">
              <md-chip v-for="item in item.memberOfs" :key="item"> {{item}}</md-chip>
            </md-table-cell>
          </md-table-row>                       
      </md-table>
    </div>
    <div v-else>
      <md-empty-state
        md-icon="computer"
        md-label="Add your first host."
        md-description=" ">
        <md-button class="md-raised md-success" @click="add"><md-icon>add</md-icon>Add</md-button>
      </md-empty-state>   
    </div>
    
  </div>
</template>

<script>
import Vue from "vue";
import VClamp from 'vue-clamp'

export default {
  name: "hosts-table",
  components: {
    VClamp
  },
  props: {
    tableHeaderColor: {
      type: String,
      default: ""
    },
    hosts: {
      type: Array
    }
  },
  data() {
    return {
      selected: [],
      active: false
    };
  },
  computed: {
    alert() {
      return this.$store.state.alert;
    },
    alertMsg() {
      return this.$store.state.alert.message;
    },
    hasHosts() {
      if (this.hosts.length > 0){
        return true;
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
    onSelect (items) {
      this.selected = []
      items.forEach(element => {
      this.selected.push(element.cn);
      });
    },
    getAlternateLabel (count) {
      let plural = ''
      if (count > 1) {
        plural = 's'
      }
      return `${count} host${plural} selected`
    },
    add () {
      Vue.$log.debug("Enter");
      this.$router.push({name: 'AddHost'});
    },
    del () {
      Vue.$log.debug("Enter");
      if (JSON.stringify(this.selected) == JSON.stringify([])) {
        Vue.$log.debug("No changes. Ignore click");
      }
      else {
        Vue.$log.debug(this.selected)
        this.$emit('delete-host', this.selected);
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

<style lang="scss" scoped>
  .md-table + .md-table {
    margin-top: 1px
  }
</style>