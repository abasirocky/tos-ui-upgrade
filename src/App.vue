<template>
  <router-view></router-view>
</template>

<style lang="scss">

</style>

<script>
import Vue from "vue";
export default {
  name: "BerthViewApp",
  props: ["standalone", "fileStorageLocation"],

  provide() {
    return {
      showErrors: (errors) => {
        if (errors && errors.length > 0) {
          Vue.$toast.open({
            message: errors.map((m) => m.messageText).join("...,"),
            type: "error",
            position: "top",
          });
        }
      },
      showSuccess: (messages) => {
        if (messages && messages.length > 0) {
          Vue.$toast.open({
            message: messages.map((m) => m.messageText).join("...,"),
            type: "success",
            position: "top",
          });
        }
      },
      showWarning: (messages) => { 
        if (messages && messages.length > 0) {
          Vue.$toast.open({
            message: messages.map((m) => m.messageText).join("...,"),
            type: "warning",
            position: "top",
          });
        }
      },
      isStandalone: this.standalone,
      fileStorageLocation: this.fileStorageLocation,
    };
  },

  mounted() {
    /**
     * this is to override the layout config using saved data from localStorage
     * remove this to use config only from static json (@/core/config/layout.config.json)
     */
    this.$store.dispatch(OVERRIDE_LAYOUT_CONFIG);
  },
};
</script>
