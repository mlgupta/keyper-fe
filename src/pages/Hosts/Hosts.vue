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
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="green">
            <md-card-header-text> 
              <h4 class="title">Hosts</h4>
            </md-card-header-text>            
          </md-card-header>
          <md-card-content>
            <hosts-table table-header-color="green" :hosts="hosts" v-on:delete-host="deleteHost"></hosts-table>
          </md-card-content>
          <div class="md-card-actions md-alignment-space-between" v-if="hostCount > 0">
            <div>
              <p class="card-category">Showing {{from+1}} to {{endOfPage(to, hostCount)}} of {{hostCount}} entries</p>
            </div>
            <paginate 
              :page-count="pageCount"
              :click-handler="paginate"
              :prev-text="'<<'"
              :next-text="'>>'"
              :container-class="'pagination pagination-no-border pagination-success pagination-primary list-nobull'">
            </paginate>
            <div>
              <div class="md-layout md-gutter">
                <div class="md-layout-item">
                  <md-field>
                    <label for="perPage">Per Page</label>
                    <md-select v-model="perPage">
                      <md-option value="20">20</md-option>
                      <md-option value="50">50</md-option>
                      <md-option value="100">100</md-option>
                    </md-select>
                  </md-field>
                </div>
              </div>
            </div>
          </div>
        </md-card>
      </div>      
    </div>
  </div>
</template>

<script>
import { HostsTable } from "@/components";
import Vue from "vue";

export default {
  components: {    
    HostsTable
  },
  data() {
    return {
      page: 1,
      perPage: 20,
      from: 0,
      to: 0
    }
  },
  computed: {
    host() {
      return this.$store.state.authentication.host;
    },
    hosts() {
      Vue.$log.debug("Get hosts from store. From: " + this.from + " to: " + this.to);

      var hosts_json = this.$store.state.hostStore.all.slice(this.from, this.to);
      var hosts_arr = []
      hosts_json.forEach(element => {
        var host = {};
        host.cn = element.cn;
        if ("description" in element){
          host.description = element.description
        }else {
          host.description = ""
        }
        if ("owners" in element) {
          host.owners = element.owners.map(val => val.split(',')[0].split('=')[1]);
          host.owners = host.owners.join(', ')
        }else {
          host.owners = ''
        }
        if ("memberOfs" in element) {
          host.memberOfs = element.memberOfs.map(val => val.split(',')[0].split('=')[1]);
          // host.memberOfs = host.memberOfs.join(', ')
        }else {
          host.memberOfs = ''
        }      
        
        hosts_arr.push(host);
      });
      Vue.$log.debug(hosts_arr)
      // return this.$store.state.hostStore.all;
      return hosts_arr;
    },
    pageCount() {
      Vue.$log.debug("Here in pageCount");
      return Math.ceil(this.hostCount/this.perPage);
    },
    hostCount() {
      Vue.$log.debug("Here in hostCount");
      return this.$store.state.hostStore.all.length;
    },
  },
  watch: {
    perPage() {
      Vue.$log.debug("perPage changed");
      this.paginate(1);
    }
  },
  created() {
    this.$store.dispatch('hostStore/getHosts');
    this.to = this.perPage;
  },
  methods: {
    deleteHost(hostList) {
      Vue.$log.debug("Enter delete host");
      Vue.$log.debug("hostList: " + JSON.stringify(hostList));

      hostList.forEach(element => {
        var hostDel = {};
        hostDel.cn = element;
        Vue.$log.debug("element to del: " + JSON.stringify(hostDel) );
        this.$store.dispatch('hostStore/deleteHost', { hostDel } );
      });
    },
    paginate(pageNum) {
      this.page = pageNum;
      this.from = (this.page * this.perPage) - this.perPage;
      this.to = (this.page * this.perPage);
    },
    endOfPage(to, hostCount) {
      var endOfPage = to;
      if (to > hostCount) {
        endOfPage = hostCount;
      }
      return endOfPage;
    }
  }
};
</script>
<style>
.list-nobull {
  list-style-type: none; 
}
.list-nobull > li {
  display: inline;
}
</style>
