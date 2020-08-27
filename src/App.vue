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
