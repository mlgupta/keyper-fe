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
  </div>
</template>
<script>
export default {
  name: "logout-form",
  created() {
    this.$store.dispatch("userStore/resetState");
    this.$store.dispatch("groupStore/resetState");
    this.$store.dispatch("hostStore/resetState");
    this.$store.dispatch("authentication/logout");
    this.$router.push({ name: "Login" });
  },
  methods: {
  }
};
</script>
