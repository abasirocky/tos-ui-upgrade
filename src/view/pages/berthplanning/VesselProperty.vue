<template>
  <div>
    <!--begin::Header-->
    <div
      class="
        pl-3
        offcanvas-header999
        d-flex
        align-items-center
        justify-content-between999
        pb-5
      "
    >
      <inline-svg
        fill="#24A148"
        style="height: 3.4rem !important"
        src="media/svg/saab/ship.svg"
      />

      <div class="d-flex flex-column text-left pl-5">
        <span class="text-dark-75 font-weight-bolder font-size-h3">{{
          model.vesselName
        }}</span>
        <span
          v-html="model.voyageNo"
          class="text-mutedd text-dark-85 font-size-h5 font-weight-bolder mt-2"
        ></span>
      </div>
    </div>
    <!--end::Header-->
    <!-- <div v-show="SOFActive" class="row mb-1">
      <div class="col-lg-12 mt-1" style="text-align: center">
        <button
          @click="showSOF"
          v-if="standalone == true"
          class="btn btn-outline-primary"
          style="min-width: 120px"
        >
          Statement of Facts (SOF)
        </button>
      </div>
    </div>
    <div v-show="SOFActive" class="separator separator-dashed mt-2 mb-5"></div> -->

    <!--begin::Content-->
    <perfect-scrollbar
      class="offcanvas-content pr-5 mr-n5 scroll"
      style="max-height: 95vh; position: relative"
    >
      <div class="gutter-b pt-2 pl-0 pr-0" style="max-height: 95vh">
        <div class="d-flex mb-3">
          <span class="flex-root font-weight-bolder text-dark-55 font-size-h7"
            >Voyage Status</span
          >
          <span class="flex-root text-dark-90 font-size-h7">
            <span
              v-html="model.voyageStatus"
              class="label label-inline font-weight-bold"
              :class="getvoyagestatus(model.voyageStatusId)"
            ></span>
          </span>
        </div>

        <div class="d-flex mb-3">
          <span class="flex-root font-weight-bolder text-dark-55 font-size-h7"
            >Vessel Type</span
          >
          <span class="flex-root text-dark-90 font-size-h7">
            <span
              v-html="model.vesselType"
              class="label label-inline font-weight-bold"
              :class="getvesseltype(model.vesselTypeId)"
            ></span>
          </span>
        </div>

        <div class="d-flex mb-3">
          <span class="flex-root font-weight-bolder text-dark-55 font-size-h7"
            >Line</span
          >
          <span
            v-html="model.vesselLine"
            class="flex-root text-dark-90 font-size-h7"
          ></span>
        </div>
        <div class="d-flex mb-3">
          <span class="flex-root font-weight-bolder text-dark-55 font-size-h7"
            >Line Agent</span
          >
          <span
            v-html="model.vesselAgent"
            class="flex-root text-dark-90 font-size-h7"
          ></span>
        </div>
        <div class="d-flex mb-3">
          <span class="flex-root font-weight-bolder text-dark-55 font-size-h7"
            >Nationality</span
          >
          <span class="flex-root text-dark-90 font-size-h7">
            <img :src="getflagsrc(model.nationalityUNCode)" width="24px" />
            {{ model.nationality }}
          </span>
        </div>

        <div class="d-flex mb-3">
          <span class="flex-root font-weight-bolder text-dark-55 font-size-h7"
            >Vessel Length</span
          >
          <span class="flex-root text-dark-90 font-size-h7">
            {{ model.loa }} Meter
          </span>
        </div>

        <div class="d-flex mb-3">
          <span class="flex-root font-weight-bolder text-dark-55 font-size-h7"
            >ETA</span
          >
          <span
            :inner-html.prop="model.eta | formatDateWithTime"
            class="flex-root text-dark-90 font-size-h7"
          ></span>
        </div>
        <div class="d-flex mb-3">
          <span class="flex-root font-weight-bolder text-dark-55 font-size-h7"
            >ETD</span
          >
          <span
            :inner-html.prop="model.etd | formatDateWithTime"
            class="flex-root text-dark-90 font-size-h7"
          ></span>
        </div>
        <div class="d-flex mb-3">
          <span class="flex-root font-weight-bolder text-dark-55 font-size-h7"
            >EPT</span
          >
          <span
            v-html="model.ept"
            class="flex-root text-dark-90 font-size-h7"
          ></span>
        </div>

        <div class="d-flex mb-3">
          <span
            class="flex-root font-weight-bolder text-dark-55 font-size-h7"
            style="font-size: smaller"
            >Planned Berth Date (PBT)</span
          >
          <span
            :inner-html.prop="model.plannedBerthDate_PBT | formatDateWithTime"
            class="flex-root text-dark-90 font-size-h7"
          ></span>
        </div>
        <div class="d-flex mb-3">
          <span
            class="flex-root font-weight-bolder text-dark-55 font-size-h7"
            style="font-size: smaller"
            >Planned Unberth Date (PUT)</span
          >
          <span
            :inner-html.prop="model.plannedUnberthDate_PUT | formatDateWithTime"
            class="flex-root text-dark-90 font-size-h7"
          ></span>
        </div>
        <div class="d-flex mb-3">
          <span
            class="flex-root font-weight-bolder text-dark-55 font-size-h7"
            style="font-size: smaller"
            >Planned Port Time (PPT)</span
          >
          <span
            v-html="model.plannedPortTime_PPT"
            class="flex-root text-dark-90 font-size-h7"
          ></span>
        </div>

        <div class="d-flex mb-3">
          <span class="flex-root font-weight-bolder text-dark-55 font-size-h7"
            >anchorage In</span
          >
          <span
            :inner-html.prop="model.anchorageInDate | formatDateWithTime"
            class="flex-root text-dark-90 font-size-h7"
          ></span>
        </div>

        <div class="d-flex mb-3">
          <span class="flex-root font-weight-bolder text-dark-55 font-size-h7"
            >Full Away</span
          >
          <span
            :inner-html.prop="model.anchorageOutDate | formatDateWithTime"
            class="flex-root text-dark-90 font-size-h7"
          ></span>
        </div>
        <div class="d-flex mb-3">
          <span class="flex-root font-weight-bolder text-dark-55 font-size-h7"
            >Port Time</span
          >
          <span
            v-html="model.portTime"
            class="flex-root text-dark-90 font-size-h7"
          ></span>
        </div>




        <div class="d-flex mb-3">
          <span class="flex-root font-weight-bolder text-dark-55 font-size-h7"
            >Berth</span
          >
          <span
            :inner-html.prop="model.berthDate | formatDateWithTime"
            class="flex-root text-dark-90 font-size-h7"
          ></span>
        </div>
        <div class="d-flex mb-3">
          <span class="flex-root font-weight-bolder text-dark-55 font-size-h7"
            >Unberth</span
          >
          <span
            :inner-html.prop="model.unberthDate | formatDateWithTime"
            class="flex-root text-dark-90 font-size-h7"
          ></span>
        </div>
        <div class="d-flex mb-3">
          <span class="flex-root font-weight-bolder text-dark-55 font-size-h7"
            >Berth time</span
          >
          <span
            v-html="model.berthTime"
            class="flex-root text-dark-90 font-size-h7"
          ></span>
        </div>





      <div class="d-flex mb-3">
          <span class="flex-root font-weight-bolder text-dark-55 font-size-h7"
            >Start Operation</span
          >
          <span
            :inner-html.prop="model.startOperation | formatDateWithTime"
            class="flex-root text-dark-90 font-size-h7"
          ></span>
        </div>
        <div class="d-flex mb-3">
          <span class="flex-root font-weight-bolder text-dark-55 font-size-h7"
            >End Operation</span
          >
          <span
            :inner-html.prop="model.endOperation | formatDateWithTime"
            class="flex-root text-dark-90 font-size-h7"
          ></span>
        </div>
        <div class="d-flex mb-3">
          <span class="flex-root font-weight-bolder text-dark-55 font-size-h7"
            >Operation Time</span
          >
          <span
            v-html="model.operationTime"
            class="flex-root text-dark-90 font-size-h7"
          ></span>
        </div> 

        <div class="d-flex mb-3">
          <span class="flex-root font-weight-bolder text-dark-55 font-size-h7"
            >Berth</span
          >
          <span
            v-html="model.berthName"
            class="flex-root text-dark-90 font-size-h7"
          >
          </span>
        </div>
      </div>
    </perfect-scrollbar>
    <!--end::Content-->

    <b-modal
      id="modalSOF"
      ref="modalsof"
      size="xl"
      hide-footer
      title="Statement of Facts (SOF)"
      @hide="hideSOFModal"
    >
      <!-- <VoyageSOF :voyageId="model.voyageId" :terminalId="model.terminalId"></VoyageSOF> -->
    </b-modal>
  </div>
</template>

<script>
import { EnumColors,ImageSRC } from "@/mixins.ts";
// import VoyageSOF from "@/view/pages/definitions/voyagesof/SOF.vue";

export default {
  name: "VesselProperty",
  mixins: [EnumColors,ImageSRC],
  inject: ["isStandalone"],
  components: {
    // VoyageSOF,
  },
  data() {
    return {
      // voyageInfomodel: null,
      standalone: this.isStandalone,
    };
  },
  props: {
    model: Object,
    SOFActive: Boolean,
    callback_RefreshChart: Function,
  },

  mounted() {},
  methods: {
    hideSOFModal() {
      var vm = this;
      if (vm.callback_RefreshChart) {
        vm.loading = true;
        vm.callback_RefreshChart();
        vm.loading = false;
      }
    },
    showSOF() {
      this.$bvModal.show("modalSOF");
    },

  },
};
</script>
