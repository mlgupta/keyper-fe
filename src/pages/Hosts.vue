<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">Hosts</h4>
            <!-- <p class="category">Here is a subtitle for this table</p> -->
          </md-card-header>
          <md-card-content>
            <hosts-table table-header-color="green" :hosts="hosts"></hosts-table>
          </md-card-content>
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
  computed: {
    host() {
      return this.$store.state.authentication.host;
    },
    hosts() {
      Vue.$log.debug("Here in hosts");      
      var hosts_json = this.$store.state.hostStore.all;
      var hosts_arr = []
      hosts_json.forEach(element => {
        var host = {};
        host.cn = element.cn;        
        host.owners = element.owners.map(val => val.split(',')[0].split('=')[1]);
        host.owners = host.owners.join(', ')
        hosts_arr.push(host);
      });
      Vue.$log.debug(hosts_arr)
      // return this.$store.state.hostStore.all;
      return hosts_arr;
    }
  },
  created() {
    this.$store.dispatch('hostStore/getHosts');
  },
  methods: {
    deleteHost(hostList) {
      Vue.$log.debug("Enter");
      Vue.$log.debug("hostList: " + JSON.stringify(hostList));

      hostList.forEach(element => {
        var hostDel = {};
        hostDel.cn = element;
        Vue.$log.debug("element to del: " + JSON.stringify(hostDel) );
        this.$store.dispatch('hostStore/deleteHost', { hostDel } );
      });


    }
  }
};
</script>
