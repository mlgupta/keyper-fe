<template>
  <div>
    <div>
    <md-table v-model="groups" :table-header-color="tableHeaderColor" @md-selected="onSelect" md-sort="cn" md-sort-order="asc" md-card> 
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
            md-content="Are you sure, you want to delete the selected group(s)?"
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
        <md-table-cell md-label="Members">
          <v-clamp autoresize :max-lines="1"> {{ item.members }} </v-clamp> 
        </md-table-cell>
      </md-table-row>
    </md-table>
    </div>    
  </div>
</template>

<script>
import Vue from "vue";
import VClamp from 'vue-clamp'

export default {
  name: "groups-table",
  components: {
    VClamp
  },
  props: {
    tableHeaderColor: {
      type: String,
      default: ""
    },
    groups: {
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
    },getAlternateLabel (count) {
      let plural = ''
      if (count > 1) {
        plural = 's'
      }
      return `${count} group${plural} selected`
    },
    add () {
      Vue.$log.debug("Enter");      
      this.$router.push({name: 'AddGroup'});
    },
    del () {
      Vue.$log.debug("Enter");

      if (JSON.stringify(this.selected) == JSON.stringify([])) {
        Vue.$log.debug("No changes. Ignore click");
      }
      else {
        this.$emit('delete-group', this.selected);
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
