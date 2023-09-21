<template>
    <div>
      <BlockUI v-if="loading" :message="msg">
        <i class="fa fa-spinner fa-spin fa-2x fa-fw"></i>
      </BlockUI>
  
      <div class="row">
        <div class="col-lg-8">
          <b-tabs
            pills
            card
            vertical
            nav-wrapper-class="w-40"
            content-class="mt-0"
            active-tab-class="p-0"
          >
            <b-tab
              @click="SOF_GetETA"
              title-item-class="font-size-h6 font-weight-bold"
              title="ETA"
              active
              ><b-card-text>
                <VoyageSOFETA
                  :voyagesofmodel="voyageSOF_ETA"
                  :updateVoyageProperty="VoyageProperty"
                  v-if="voyageSOF_ETA != undefined && voyageSOF_ETA != null"
                ></VoyageSOFETA> </b-card-text
            ></b-tab>
            <b-tab
              @click="SOF_GetAnchorage"
              title-item-class="font-size-h6 font-weight-bold"
              title="anchorage"
              ><b-card-text>
                <SOFAnchorageIn
                  :voyagesofmodel="voyageSOF_AnchorageIn"
                  :updateVoyageProperty="VoyageProperty"
                  v-if="
                    voyageSOF_AnchorageIn != undefined &&
                      voyageSOF_AnchorageIn != null
                  "
                ></SOFAnchorageIn></b-card-text
            ></b-tab>
            <b-tab
              @click="SOF_GetBerth"
              title-item-class="font-size-h6 font-weight-bold"
              title="Berth"
              ><b-card-text>
                <SOFBerth
                  :voyageId="Berth_voyageId"
                  :terminalId="Berth_terminalId"
                  :updateVoyageProperty="VoyageProperty"
                  v-if="Berth_voyageId != undefined && Berth_voyageId != null"
                ></SOFBerth> </b-card-text
            ></b-tab>
            <b-tab
              @click="SOF_GetAnchorageOut"
              title-item-class="font-size-h6 font-weight-bold"
              title="Full Away"
              ><b-card-text>
                <SOFAnchorageOut
                  :voyagesofmodel="voyageSOF_AnchorageOut"
                  :updateVoyageProperty="VoyageProperty"
                  v-if="
                    voyageSOF_AnchorageOut != undefined &&
                      voyageSOF_AnchorageOut != null
                  "
                ></SOFAnchorageOut> </b-card-text
            ></b-tab>
          </b-tabs>
        </div>
        <div class="col-lg-4">
          <b-card no-body>
            <b-card-body
              class=" d-flex flex-column pt-5 pl-3 pr-3"
              style="max-height: 400px;overflow:auto;overflow-x:hidden;"
            >
              <VesselProperty2
                :SOFActive="false"
                :model="voyageInfo"
                v-if="voyageInfo != undefined && voyageInfo != null"
                ref="vesselProperty"
              ></VesselProperty2>
            </b-card-body>
          </b-card>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapGetters } from "vuex";
  import { GETVoyageProperty } from "@/core/services/store/berthplanning.module";
  import {
    GET_VoyageSOF_ETA,
    GET_VoyageSOF_AnchorageIn,
    GET_VoyageSOF_AnchorageOut,
    // GET_VoyageSOF_Plan,
  } from "@/core/services/store/voyagesof.module";
  import VoyageSOFETA from "@/components/SOF_ETA.vue";
  import SOFAnchorageIn from "@/components/SOF_AnchorageIn.vue";
  import SOFAnchorageOut from "@/components/SOF_AnchorageOut.vue";
  import SOFBerth from "@/components/SOF_Berth.vue";
  export default {
    name: "SOF",
    components: {
      VoyageSOFETA,
      SOFAnchorageIn,
      SOFAnchorageOut,
      SOFBerth,
      VesselProperty2: () =>
        import("@/view/pages/berthplanning/VesselProperty.vue"),
    },
    inject: ["showErrors", "showSuccess"],
    data() {
      return {
        loading: false,
        msg: "Please Wait ...",
        model: "",
        voyageInfo: null,
        voyageSOF_ETA: null,
        voyageSOF_AnchorageIn: null,
        voyageSOF_AnchorageOut: null,
        Plan_voyageId: null,
        Berth_voyageId: null,
        Berth_terminalId: null,
      };
    },
    props: {
      voyageId: Number,
      terminalId: Number,
    },
    computed: {
      ...mapGetters([
        "getVoyageSOFETA",
        "getVoyageSOFAnchorageIn",
        "getVoyageSOFAnchorageOut",
        "getVoyageSOFPlan",
        "getVoyageSOFBerth",
        "getVoyageSOFErrors",
        "getVoyageSOFMessages",
        "getVoyagePropery",
        "getBerthChartErrors",
        "getBerthChartMessages",
      ]),
    },
    mounted() {
      this.loading = true;
      const vm = this;
  
      this.VoyageProperty(() => {
        vm.SOF_GetETA();
        vm.loading = false;
      });
  
      // this.VoyageProperty().then(
      //   function() {
      //     vm.SOF_GetETA();
      //   },
      //   function(failureFunc) {
      //     
      //     vm.loading = false;
      //   }
      // );
    },
    methods: {
      VoyageProperty(callback) {
        const vm = this;
        const state = {
          VoyageId: parseInt(vm.voyageId),
        };
        vm.$store.dispatch(GETVoyageProperty, state).then(() => {
          const errors = vm.getBerthChartErrors;
          if (errors.length > 0) {
            vm.showErrors(errors);
          } else {
            var model = vm.getVoyagePropery;
            vm.voyageInfo = model;
          }
          if (callback) {
            callback();
          }
        });
      },
  
      // VoyageProperty() {
      //   const vm = this;
      //   let promise1 = new Promise(function(resolve, reject) {
      //     const state = {
      //       VoyageId: parseInt(vm.voyageId),
      //     };
      //     vm.$store.dispatch(GETVoyageProperty, state).then(() => {
      //       const errors = vm.getBerthChartErrors;
      //       if (errors.length > 0) {
      //         vm.showErrors(errors);
      //         reject("failed");
      //       } else {
      //         var model = vm.getVoyagePropery;
      //         vm.voyageInfo = model;
      //         resolve("success");
      //       }
      //     });
      //   });
      //   return promise1;
      // },
  
      SOF_GetETA() {
        this.voyageSOF_ETA = null;
        this.$nextTick(() => {
          this.loading = true;
          const state = {
            voyageId: parseInt(this.voyageId),
          };
          this.$store.dispatch(GET_VoyageSOF_ETA, state).then(() => {
            const errors = this.getVoyageSOFErrors;
            if (errors.length > 0) {
              this.showErrors(errors);
              this.loading = false;
            } else {
              var model = this.getVoyageSOFETA;
              this.voyageSOF_ETA = model;
              this.loading = false;
            }
          });
        });
      },
      SOF_GetPlan() {
        this.Plan_voyageId = null;
        this.$nextTick(() => {
          this.Plan_voyageId = this.voyageId;
        });
      },
      SOF_GetBerth() {
        this.Berth_voyageId = null;
        this.$nextTick(() => {
          this.Berth_voyageId = this.voyageId;
  
          this.Berth_terminalId = this.terminalId;
        });
      },
      SOF_GetAnchorage() {
        this.voyageSOF_AnchorageIn = null;
        this.$nextTick(() => {
          this.loading = true;
          const state = {
            voyageId: parseInt(this.voyageId),
          };
          this.$store.dispatch(GET_VoyageSOF_AnchorageIn, state).then(() => {
            const errors = this.getVoyageSOFErrors;
            if (errors.length > 0) {
              this.showErrors(errors);
              this.loading = false;
            } else {
              var model = this.getVoyageSOFAnchorageIn;
              this.voyageSOF_AnchorageIn = model;
              this.loading = false;
            }
          });
        });
      },
      SOF_GetAnchorageOut() {
        this.voyageSOF_AnchorageOut = null;
        this.$nextTick(() => {
          this.loading = true;
          const state = {
            voyageId: parseInt(this.voyageId),
          };
          this.$store.dispatch(GET_VoyageSOF_AnchorageOut, state).then(() => {
            const errors = this.getVoyageSOFErrors;
            if (errors.length > 0) {
              this.showErrors(errors);
              this.loading = false;
            } else {
              var model = this.getVoyageSOFAnchorageOut;
              this.voyageSOF_AnchorageOut = model;
              this.loading = false;
            }
          });
        });
      },
    },
  };
  </script>
  