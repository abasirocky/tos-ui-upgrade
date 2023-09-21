<template>
  <div
    id="kt_quick_vesselProperty"
    ref="kt_quick_vesselProperty"
    class="offcanvas offcanvas-right p-5"
  >
    <div
      class="
        offcanvas-header
        d-flex
        align-items-center
        justify-content-between"
    >
      <div class="d-flex flex-column text-left"></div>
      <a
        href="#"
        class="btn btn-xs btn-icon btn-light btn-hover-primary"
        id="kt_quick_vesselProperty_close"
      >
        <i class="ki ki-close icon-xs text-muted"></i>
      </a>
    </div>

    <VesselProperty
      :model="model"
      :SOFActive="true"
      :callback_RefreshChart="refreshParentChart"
      v-if="model != undefined && model != null"
      ref="vesselProperty"
    ></VesselProperty>
  </div>
</template>

<style lang="scss" scoped>
#kt_quick_vesselProperty {
  overflow: hidden;
}
</style>

<script>
import KTLayoutQuickVesselProperty from "@/assets/js/berthschedule/quick-vesselProperty.js";
import KTOffcanvas from "@/assets/js/components/offcanvas.js";
import { EnumColors } from "@/mixins.ts";
import VesselProperty from "@/view/pages/linewindowplanning/VesselProperty.vue";

export default {
  name: "KTQuickVesselProperty",
  mixins: [EnumColors],
  components: {
    VesselProperty,
  },
  data() {
    return {
      model: null,
    };
  },
  props: {
    inputdata: Object,
    callback_RefreshChart: Function,
  },
  mounted() {
    // this.model = this.inputdata;
    KTLayoutQuickVesselProperty.init(this.$refs["kt_quick_vesselProperty"]);
  },
  methods: {
    SetData(obj) {
      this.model = obj;
    },
    refreshParentChart() {
      this.$parent.Refresh_Click();
    },
    closeOffcanvas() {
      new KTOffcanvas(KTLayoutQuickVesselProperty.getElement()).hide();
    },

    initquickvesselProperty() {
      KTLayoutQuickVesselProperty.init(this.$refs["kt_quick_vesselProperty"]);
    },
    openOffcanvas() {
      new KTOffcanvas(KTLayoutQuickVesselProperty.getElement()).show();
    },
  },
};
</script>
