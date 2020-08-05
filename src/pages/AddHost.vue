<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-66">
        <add-host-form data-background-color="green" v-on:add-host="addHost"> </add-host-form>
      </div>
      <div class="md-layout-item md-medium-size-100 md-size-33">
      </div>
    </div>
  </div>
</template>

<script>
import { AddHostForm } from "@/pages";
import Vue from "vue";

export default {
  components: {
    AddHostForm
  },
  methods: {
    addHost(host) {
        Vue.$log.debug("Enter");
        Vue.$log.debug("host: " + JSON.stringify(host));
        this.$store.dispatch('hostStore/addHost', { host } );
    },
  }
};
</script>
