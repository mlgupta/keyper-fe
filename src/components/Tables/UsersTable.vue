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
  <div>
    <div>
    <md-table v-model="users" :table-header-color="tableHeaderColor" @md-selected="onSelect" md-card> 
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
            md-content="Are you sure, you want to delete the selected user(s)?"
            md-confirm-text="Yes"
            md-cancel-text="No"
            @md-confirm="del" />
          <md-button class="md-raised md-danger" @click="active = true"><md-icon>delete</md-icon>Delete</md-button>
        </div>
      </md-table-toolbar>

      <md-table-row slot="md-table-row" slot-scope="{ item }" md-selectable="multiple" md-auto-select>
        <md-table-cell md-label="User Name" md-sort-by="cn"><router-link :to="{ path: item.cn }" append>{{ item.cn }}</router-link></md-table-cell>
        <md-table-cell md-label="Email" md-sort-by="mail">{{ item.mail }}</md-table-cell>
        <md-table-cell md-label="First Name" md-sort-by="givenName">{{ item.givenName }}</md-table-cell>
        <md-table-cell md-label="Last Name" md-sort-by="sn">{{ item.sn }}</md-table-cell>
        <md-table-cell md-label="Groups">
          <md-chip v-for="item in item.memberOfs" :key="item">
            {{groupName(item)}}
          </md-chip>
        </md-table-cell>
      </md-table-row>
    </md-table>    
    </div>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  name: "users-table",
  props: {
    tableHeaderColor: {
      type: String,
      default: ""
    },
    users: {
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
    groupName(group_name) {
      return group_name.split(',')[0].split('=')[1];
    },
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
      return `${count} user${plural} selected`
    },
    add () {
      Vue.$log.debug("Enter");

      this.$router.push({name: 'AddUser'});
    },
    del () {
      Vue.$log.debug("Enter");

      if (JSON.stringify(this.selected) == JSON.stringify([])) {
        Vue.$log.debug("No changes. Ignore click");
      }
      else {
        this.$emit('delete-user', this.selected);
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