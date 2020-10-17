<template>
  <div>
  <md-button
    class="md-just-icon md-simple"
    @click="openModal()"
  >
    <md-icon>launch</md-icon>
    <md-tooltip md-direction="top">Show Certificate</md-tooltip>
  </md-button>

 <div>
  <md-dialog :md-active.sync="active">
    <md-dialog-title>{{ title }}</md-dialog-title>
      <md-dialog-content>
        <div class="wordwrap">
              <p>{{ body }}</p>
        </div>
      </md-dialog-content>
        <md-dialog-actions>
          <md-button class="md-secondary" @click="closeModal"
            >Close</md-button
          >
        </md-dialog-actions>
  </md-dialog>
 </div>
  </div>
</template>

<script>
export default {
  name: "modal",
  props: {
    title: {
      type: String
    },
    body: {
      type: String
    },
  },
  data() {
    return {
      active: false
    }
  },
  computed: {
  },
  methods: {
    closeModal: function() {
      this.active = false;
      this.$emit("close-modal");
    },
    openModal: function() {
      this.active = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.md-dialog  {
  max-width: auto;
}

.wordwrap
{
    white-space: -moz-pre-wrap !important;  /* Mozilla, since 1999 */
    white-space: -webkit-pre-wrap;          /* Chrome & Safari */ 
    white-space: -pre-wrap;                 /* Opera 4-6 */
    white-space: -o-pre-wrap;               /* Opera 7 */
    white-space: pre-wrap;                  /* CSS3 */
    word-wrap: break-word;                  /* Internet Explorer 5.5+ */
    word-break: break-all;
    white-space: normal;} 
</style>