<template>
  <div id="kt_quick_legend" ref="kt_quick_legend" class="offcanvas offcanvas-right p-10">
    <!--begin::Header-->
    <div class=" offcanvas-header d-flex align-items-center justify-content-between pb-5 ">
     

      <h3 class="font-weight-bolder m-0">
        Legend
        <br />
        <small class="text-muted font-size-sm ml-2">Voyage Status Colors Guide</small>
      </h3>
      <a href="#" class="btn btn-xs btn-icon btn-light btn-hover-primary" id="kt_quick_legend_close">
        <i class="ki ki-close icon-xs text-muted"></i>
      </a>
    </div>
    <!--end::Header-->

    <!--begin::Content-->
    <!-- <perfect-scrollbar class="offcanvas-content pr-5 mr-n5 scroll" style="max-height: 90vh; position: relative"></perfect-scrollbar> -->
      <!-- <div class="separator separator-dashed mt-8 mb-5"></div> -->

      <div class="card mt-5" style="border-color:#90b0bd">
        <div class="card-body p-5">
          <div class="d-flex align-items-center ">
            <span class="bullet bullet-bar  bg-primary bg-ArrivalNotice align-self-stretch mx-4"></span>
            <div class="d-flex flex-column flex-grow-1">
              <span href="#" class="text-dark-75 text-primary text-ArrivalNotice font-weight-bold font-size-lg mb-1">Arrival Notice </span>
            </div>
          </div>

          <div class="d-flex align-items-center mt-5">
            <span class="bullet bullet-bar  bg-danger bg-anchorage align-self-stretch mx-4"></span>
            <div class="d-flex flex-column flex-grow-1">
              <span href="#" class="text-dark-75 text-danger text-anchorage font-weight-bold font-size-lg mb-1">anchorage</span>
            </div>
          </div>

          <div class="d-flex align-items-center mt-5">
            <span class="bullet bullet-bar  bg-success bg-Berth align-self-stretch mx-4"></span>
            <div class="d-flex flex-column flex-grow-1">
              <span class="text-dark-75 text-success text-Berth font-weight-bold font-size-lg mb-1">Alongside</span>
            </div>
          </div>

          <div class="d-flex align-items-center mt-5">
            <span class="bullet bullet-bar  bg-warning bg-Unberth align-self-stretch mx-4"></span>
            <div class="d-flex flex-column flex-grow-1">
              <span class="text-dark-75 text-warning text-Unberth font-weight-bold font-size-lg mb-1">Unberthed</span>
            </div>
          </div>

          <div class="d-flex align-items-center mt-5">
            <span class="bullet bullet-bar  bg-warning bg-fullaway align-self-stretch mx-4"></span>
            <div class="d-flex flex-column flex-grow-1">
              <span class="text-dark-75 text-warning text-fullaway font-weight-bold font-size-lg mb-1">Departed</span>
            </div>
          </div>
        </div>
      </div>
    
    <!--end::Content-->
  </div>
</template>

<style lang="scss" scoped>
#kt_quick_legend {
  overflow: hidden;
}
</style>

<script>
import KTLayoutQuickLegend from "@/assets/js/berthschedule/quick-legend.js";
import KTOffcanvas from "@/assets/js/components/offcanvas.js";

export default {
  name: "KTQuickLegend",
  data() {
    return {};
  },
  mounted() {
    // Init Quick User Panel
    KTLayoutQuickLegend.init(this.$refs["kt_quick_legend"]);
  },
  methods: {
    closeOffcanvas() {
      new KTOffcanvas(KTLayoutQuickLegend.getElement()).hide();
    },
  },
};
</script>
