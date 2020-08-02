<template>
  <div>
  </div>
</template>
<script>
export default {
  name: "logout-form",
  created () {
    this.$store.dispatch('userStore/resetState');
    this.$store.dispatch('authentication/logout');
    this.$router.push({name: 'Login'});
  },
  methods: {
  }
};
</script>
