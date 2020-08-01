import Vue from "vue";

export function notifyVue(type, msg) {
    Vue.$notify({
      message:
        msg,
      horizontalAlign: 'center',
      verticalAlign: 'top',
      type: type
    });
  } 
