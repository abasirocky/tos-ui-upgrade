<template>
  <YardView
    ref="yardview1"
    v-on:clickobject="clickobject"
    v-on:loadcomplete="loadcomplete"
    :terminal="$props.terminal"
    :terminalId="$props.terminalId"
    :terminals="$props.terminals"
    :styleMap="styleMap"
  />
</template>

<script lang="js">
import YardView from "./components/YardView.vue";
 
export default {
  name: "AppYardView",
  emits: ["clickobject", "loadcomplete"],
  props: ["yardstyle", "terminalId", "terminal", "terminals"],
  watch: {
    yardstyle(val) {
      this.styleMap = val;
    },
  },
  data() {
    return {
      styleMap: "height:100%;overflow-y: hidden",
    };
  },

  components: {
    YardView,
  },
  methods: {
    clickobject(ev) {
      this.$emit("clickobject", ev);
    },
    loadcomplete(ev) {
      this.$emit("loadcomplete", ev);
    },
    mapResize() {
      const yard = this.$refs.yardview1;
      yard.mapResize();
    },
    rePaintMap(terminalId, renderQuality) {
      const yard = this.$refs.yardview1;
      yard.rePaintMap(terminalId, renderQuality);
    },
  },
  mounted() {
    console.log('yardviewcomp', this.$props.terminalId, this.$props.terminal, this.$props.terminals );
  }
};
</script>

<style>
html,
body {
  height: 100%; /*both html and body*/
}
body {
  margin: 0; /*reset default margin*/
}

#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* #map {
  width: 100%;
  height: 100vh;
  overflow-y: hidden;
} */
 
.mapboxgl-control-container {
    display: none !important;
}
</style>
