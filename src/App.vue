<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'app',
  computed: {
    alert() {
      return this.$store.state.alert
    }
  },
  watch: {
    $route(to, from) {
      this.$store.state.alert
    }
  }
};
</script>
