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
        id="kt_quick_unPlanningVessel_toggle222"
        v-b-tooltip.hover.left="'Unplanned Vessels'"
        class="nav-item mb-2"
        @click="ShowUnPlannedVessels"
      >
        <a href="#" class="btn btn-sm btn-icon btn-bg-light btn-text-primary">
          <inline-svg
            class="saab-icon-14"
            fill="#DA291C"
            src="media/svg/saab/ship.svg"
          />
        </a>
      </li>

      <li
        id="kt_quick_legend_toggle"
        v-b-tooltip.hover.left="'Legend'"
        class="nav-item mb-2"
      >
        <a href="#" class="btn btn-sm btn-icon btn-bg-light btn-text-primary">
          <inline-svg
            class="saab-icon-14"
            fill="#FAB900"
            src="media/svg/saab/Drawing-Class.svg"
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

    <KTQuickLegend></KTQuickLegend>

    <KTQuickSetting
      ref="quickSetting"
      :RefreshSetting="RefreshSetting"
      :model="modelSetting"
      @updateusersetting="UpdateUserSetting"
    ></KTQuickSetting>

    <KTQuickUnPlanningVessel
      ref="quickUnPlanningVessel"
      :currentDate="currentDate"
      :load_fdate="load_fdate"
      :load_tdate="load_tdate"
      :add_berthplanview_schedules="add_berthplanview_schedules"
      :AutoPlan="AutoPlan"
    ></KTQuickUnPlanningVessel>
  </div>
</template>

<script>
import KTQuickLegend from "@/view/pages/berthplanning/QuickLegend.vue";
import KTQuickSetting from "@/view/pages/berthplanning/QuickSetting.vue";
import KTQuickUnPlanningVessel from "@/view/pages/berthplanning/QuickUnPlanningVessel.vue";
// import { GETUnplannedVessel } from "@/core/services/store/berthplanning.module";
import { mapGetters } from "vuex";

export default {
  name: "KTStickyToolbar",
  inject: ["showErrors", "showSuccess"],
  components: {
    KTQuickLegend,
    KTQuickSetting,
    KTQuickUnPlanningVessel,
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

    currentDate: String,
    load_fdate: String,
    load_tdate: String,
    add_berthplanview_schedules: Function,
    AutoPlan: Function,
    RefreshSetting: Function,
    berthUserSetting: Object,
  },
  computed: {
    ...mapGetters([
      // "getUnplannedVessel",
      "getBerthChartErrors",
      "getBerthChartMessages",
    ]),
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
    ShowUnPlannedVessels() {
      const objquickUnPlanningVessel = this.$refs.quickUnPlanningVessel;
      this.loading = true;

      objquickUnPlanningVessel.currentDate = this.$parent.currentDate;
      objquickUnPlanningVessel.conceptId = Number(
        this.$parent.getActiveConcept.id
      );
      objquickUnPlanningVessel.terminalId = Number(this.$parent.dock);
      objquickUnPlanningVessel.RefreshUnPlannedVessels();
      objquickUnPlanningVessel.initquickUnPlanningVessel();
      objquickUnPlanningVessel.openOffcanvas();

      // const state = { terminalId: Number(this.$parent.dock) };
      // this.$store.dispatch(GETUnplannedVessel, state).then(() => {
      //   this.loading = false;
      //   const errors = this.getBerthChartErrors;
      //   if (errors.length > 0) {
      //     this.showErrors(errors);
      //   } else {
      //     var model = this.getUnplannedVessel;

      //     objquickUnPlanningVessel.model = model;
      //     objquickUnPlanningVessel.terminalId = Number(this.$parent.dock);
      //     objquickUnPlanningVessel.initquickUnPlanningVessel();

      //     objquickUnPlanningVessel.openOffcanvas();
      //   }
      // });
    },
    ShowSetting() {
      const objsetting = this.$refs.quickSetting;
      let datasetting = JSON.parse(JSON.stringify(this.berthUserSetting));
      this.modelSetting = datasetting;
      // objsetting.model = datasetting;

      this.$nextTick(() => {
        // objsetting.initquickSetting();
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
