<template>
  <div>
    <!-- begin::Sticky Toolbar -->
    <ul class="sticky-toolbar nav flex-column pl-2 pr-2 pt-3 pb-3 mt-4">
      <li v-b-tooltip.hover.left="'Zoom in'" class="nav-item mb-2">
        <a
          @click="ZoomIn_Click()"
          class="btn btn-sm btn-icon btn-bg-light btn-text-primary"
          :class="{ disabled: isDisabledZoomIn }"
        >
          <svg
            class="saab-icon-14"
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
          >
            <path
              fill="none"
              stroke="#004C97"
              stroke-width="3"
              stroke-miterlimit="10"
              d="M0 7.5h15M7.5 15V0"
            />
          </svg>
        </a>
      </li>
      <li v-b-tooltip.hover.left="'Zoom out'" class="nav-item mb-2">
        <a
          @click="ZoomOut_Click()"
          class="btn btn-sm btn-icon btn-bg-light btn-text-primary"
          :class="{ disabled: isDisabledZoomOut }"
        >
          <svg
            class="saab-icon-14"
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
          >
            <path
              fill="none"
              stroke="#004C97"
              stroke-width="3"
              stroke-miterlimit="10"
              d="M0 7.5h15"
            />
          </svg>
        </a>
      </li>
      <li
        id="kt_quick_unPlanningLine_toggle222"
        v-b-tooltip.hover.left="'Vessel Line Services'"
        class="nav-item mb-2"
        @click="ShowUnPlannedLines"
      >
        <a href="#" class="btn btn-sm btn-icon btn-bg-light btn-text-primary">
          <inline-svg
            class="saab-icon-14"
            fill="#DA291C"
            src="media/svg/saab/Box-Shipping.svg"
          />
        </a>
      </li>

      <li
        id="kt_quick_setting_toggle222"
        v-b-tooltip.hover.left="'Setting'"
        class="nav-item mb-2"
        @click="ShowSetting"
        style="display: none"
      >
        <a href="#" class="btn btn-sm btn-icon btn-bg-light btn-text-primary">
          <inline-svg
            class="saab-icon-14"
            fill="#24A148"
            src="media/svg/saab/Settings.svg"
          />
        </a>
      </li>
    </ul>

    <KTQuickSetting
      ref="quickSetting"
      :RefreshSetting="RefreshSetting"
      :model="modelSetting"
      @updateusersetting="UpdateUserSetting"
    ></KTQuickSetting>

    <KTQuickUnPlanningLine
      ref="quickUnPlanningLine"
      :berthchartFilterDate="berthchartFilterDate"
      :add_berthplanview_schedules="add_berthplanview_schedules"
    ></KTQuickUnPlanningLine>
  </div>
</template>

<script>
import KTQuickSetting from "@/view/pages/linewindowplanning/QuickSetting.vue";
import KTQuickUnPlanningLine from "@/view/pages/linewindowplanning/QuickUnPlanningLine.vue";
import { mapGetters } from "vuex";

export default {
  name: "KTStickyToolbar",
  inject: ["showErrors", "showSuccess"],
  components: {
    KTQuickSetting,
    KTQuickUnPlanningLine,
  },
  data: function () {
    return {
      isDisabledZoomIn: false,
      isDisabledZoomOut: false,
      zoom: 1,
      modelSetting: null,
    };
  },
  emits: ["zoonIn", "zoomOut"],
  props: {
    berthmodel: Array,
    berthPlanView: Object,
    berthchartFilterDate: Array,
    add_berthplanview_schedules: Function,
    RefreshSetting: Function,
    berthUserSetting: Object,
  },
  computed: {
    ...mapGetters(["getLineWindowChartErrors", "getLineWindowChartMessages"]),
  },
  mounted() {
    this.zoom = 1; // this.berthPlanView.configuration.zoom;
    const objsetting = this.$refs.quickSetting;
    objsetting.initquickSetting();
  },
  methods: {
    UpdateUserSetting(val) {
      this.modelSetting = val;
    },
    ZoomIn_Click() {
      this.$emit("zoomIn");
    },
    ZoomOut_Click() {
      this.$emit("zoomOut");
    },
    ShowUnPlannedLines() {
      const objquickUnPlanningLine = this.$refs.quickUnPlanningLine;

      objquickUnPlanningLine.FindUnPlannedLine();
      objquickUnPlanningLine.initquickUnPlanningLine();
      objquickUnPlanningLine.openOffcanvas();
    },
    ShowSetting() {
      const objsetting = this.$refs.quickSetting;
      let datasetting = JSON.parse(JSON.stringify(this.berthUserSetting));
      this.modelSetting = datasetting;
      this.$nextTick(() => {
        objsetting.openOffcanvas();
      });
    },
  },
  watch: {
    zoom: function (value) {
      this.isDisabledZoomIn = false;
      this.isDisabledZoomOut = false;
      if (value <= 0.2) {
        this.isDisabledZoomOut = true;
      }
      if (value >= 2.0) {
        this.isDisabledZoomIn = true;
      }
    },
  },
};
</script>
