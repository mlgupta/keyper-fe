<template>
  <div class="wrapper">
    <notifications></notifications>

    <div class="main-panel">


      <dashboard-content> </dashboard-content>

      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>

<script>
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";

export default {
  components: {
    DashboardContent,
    ContentFooter
  },
  data() {
    return {
      sidebarBackground: "green",
      sidebarBackgroundImage: require("@/assets/img/sidebar-2.jpg")
    };
  }
};
</script>
