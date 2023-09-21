<template>
  <div
    id="kt_quick_unPlanningVessel"
    ref="kt_quick_unPlanningVessel"
    class="offcanvas offcanvas-right pt-10 pl-5 pr-5"
  >
    <BlockUI v-if="loading" :message="msg">
      <i class="fa fa-spinner fa-spin fa-2x fa-fw"></i>
    </BlockUI>

    <!--begin::Header-->
    <div
      class="
        offcanvas-header
        d-flex
        align-items-center
        justify-content-between
        pb-5
      "
    >
      <h3 class="font-weight-bolder m-0">
        Unplanned Vessels
      </h3>
      <a
        href="#"
        class="btn btn-xs btn-icon btn-light btn-hover-primary"
        id="kt_quick_unPlanningVessel_close"
      >
        <i class="ki ki-close icon-xs text-muted"></i>
      </a>
    </div>

    <div class="row">
      <div class="col-12 pt-2 pl-2 pr-2 m-0">
        <button
          v-if="activeAutoPlanning == true"
          @click="modalShowAutoPlanOptions = !modalShowAutoPlanOptions"
          class="btn btn-outline-primary btn-sm btn-sm w-100"
        >
          Auto Berth Planning
        </button>
      </div>
    </div>

    <div>
      <b-input-group class="mt-3" size="sm">
        <b-form-input v-model="searchText"></b-form-input>
        <b-input-group-append>
          <b-button @click="RefreshUnPlannedVessels" variant="info"
            >Find</b-button
          >
        </b-input-group-append>
      </b-input-group>
    </div>

    <b-row>
      <b-col class="pt-5">Plan Date</b-col>
    </b-row>

    <div class="row">
      <div class="col-6 pt-2 pl-2 pr-2 m-0">
        <date-picker
          v-model="planStartDate"
          name="planStartDate"
          type="date"
          placeholder="Choose Date"
          format="YYYY/MM/DD HH:mm"
          value-type="format"
          class="filterplandate"
        ></date-picker>
      </div>
      <div class="col-6 pt-2 pl-2 pr-2 m-0">
        <date-picker
          v-model="planEndDate"
          name="planEndDate"
          type="date"
          placeholder="Choose Date"
          format="YYYY/MM/DD HH:mm"
          value-type="format"
          class="filterplandate"
        ></date-picker>
      </div>
    </div>

    <!-- <div class="row">
      <div class="col-12 pt-2 pl-2 pr-2 m-0">
        <button
          v-if="standalone == true && activeAutoPlanning==true"
          @click="autoPlanning()"
          class="btn btn-outline-primary btn-sm btn-sm w-100"
        >
          Auto Plan
        </button>
      </div>
    </div> -->

    <!-- <b-row>
      <b-col class="my-1">
         
      </b-col>
       <b-col class="my-1">
         
      </b-col>
    </b-row> -->

    <b-row>
      <!-- sm="7" md="6" -->
      <b-col class="my-1">
        <b-pagination
          v-model="currentPage"
          :total-rows="TotalItems"
          :per-page="perPage"
          align="fill"
          size="sm"
          class="my-0 pt-5"
        >
        </b-pagination>
      </b-col>
    </b-row>
    <!-- perfect-scrollbar -->
    <div
      class="offcanvas-content scroll"
      style="max-height: 60vh; position: relative"
    >
      <div class="card card-custom card-stretch gutter-b">
        <div
          class="card-body pt-2"
          style="padding-right: 15px !important; padding-left: 15px !important"
        >
          <b-table
            :items="modelItems"
            :fields="fields"
            :busy="isBusy"
            responsive="sm"
            borderless
            :small="false"
            thead-class="d-none"
          >
            <template #table-busy>
              <div class="text-center text-danger my-2">
                <b-spinner class="align-middle"></b-spinner>
                <strong>Loading...</strong>
              </div>
            </template>
            <template #cell(voyageId)="row">
              <div class="card card-custom card-stretch">
                <div
                  @dragstart="UnplannedVessel_DragStart($event, row.value)"
                  @dragend="UnplannedVessel_DragEnd()"
                  draggable="true"
                  class="card-body555 d-flex flex-column vesselbox"
                  style="
                    width: 292px;
                    margin: auto;
                    padding: 1.4em;
                    border: 1px solid #ebedf3;
                    border-radius: 0.42rem;
                    background-color: #f3f3f2;
                  "
                >
                  <div
                    class="
                      d-flex
                      flex-wrap
                      align-items-center
                      justify-content-between
                      w-100
                    "
                  >
                    <div class="d-flex flex-column align-items-cente py-2 w-45">
                      <label
                        class="
                          checkbox
                          checkbox-outline
                          checkbox-outline-2x
                          checkbox-primary
                        "
                      >
                        <label
                          class="text-dark-85 font-weight-bolder pl-1"
                          style="font-size: 12px; margin-top: 5px"
                        >
                          {{ row.item.vesselName }}&nbsp;({{
                            row.item.voyageNoIn
                          }}/ {{ row.item.voyageNoOut }})
                        </label>
                      </label>
                    </div>
                    <button
                      @click="autoPlan(row.item)"
                      class="btn btn-outline-primary btn-sm btn-sm"
                      style="width: 80px; height: 25px; line-height: 10px"
                    >
                      Auto Plan
                    </button>
                  </div>
                  <div
                    class="
                      d-flex
                      flex-wrap
                      align-items-center
                      justify-content-between
                      w-100
                    "
                  >
                    <div class="d-flex flex-column align-items-cente py-2 w-45">
                      <img
                        draggable="false"
                        class="UnplannedVessel_VesselType"
                        :src="getvesseltypesrc(row.item.vesselTypeId)"
                      />
                    </div>
                    <span class="text-dark-65 font-weight-bold font-size-sm">
                      <span
                        class="label label-inline font-weight-bold mb-2 mt-3"
                        :class="getvoyagestatus(row.item.voyageStatusId)"
                      >
                        {{ row.item.voyageStatus }}
                      </span>
                      <br />

                      <span
                        class="voyagetooltip"
                        data-container="body"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="ETA"
                      >
                        {{ row.item.eta | formatDateWithTime }}
                      </span>
                      <br />
                      <span
                        class="voyagetooltip"
                        data-container="body"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="ETD"
                      >
                        {{ row.item.etd | formatDateWithTime }}
                      </span>
                      <br />
                      <span
                        class="voyagetooltip"
                        data-container="body"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="anchorage"
                      >
                        {{ row.item.anchorageInDate | formatDateWithTime }}
                      </span>
                    </span>
                  </div>
                  <div>
                    <p
                      style="font-size: 10px"
                      class="
                        voyagetooltip
                        text-left text-dark-85
                        font-weight-boldest font-size-sm
                        mb-0
                      "
                      data-container="body"
                      data-toggle="tooltip"
                      data-placement="bottom"
                      title="LOA - Line(Agent)"
                    >
                      <!-- {{ row.item.nationalityUNCode }} -->
                      <img
                        :src="getflagsrc(row.item.nationalityUNCode)"
                        style="max-height: 20px; max-width: 25px"
                      />

                      {{ row.item.loa }} (m) - {{ row.item.vesselLine }} ({{
                        row.item.vesselAgent
                      }})
                    </p>
                  </div>
                  <!-- {{ row.item.vesselName }} -->
                </div>
              </div>
            </template>
          </b-table>
        </div>
      </div>
    </div>

    <div class="offcanvas-footer">
      <b-row>
        <!-- sm="7" md="6" -->
        <b-col class="my-1">
          <b-pagination
            v-model="currentPage"
            :total-rows="TotalItems"
            :per-page="perPage"
            align="fill"
            size="sm"
            class="my-0 pt-5"
          >
          </b-pagination>
        </b-col>
      </b-row>
    </div>

    <b-modal
      id="modalPlan"
      ref="modalplan"
      :title="Plan_Title"
      size="lg"
      hide-footer
      centered
    >
      <b-container fluid>
        <Plan
          ref="refPlan"
          :voyageId="Plan_voyageId"
          :callbackPlan="RefreshChartPlan"
          v-if="Plan_voyageId != undefined && Plan_voyageId != null"
        ></Plan>
      </b-container>
    </b-modal>

    <b-modal
      id="modalAutoPlanOptions"
      ref="modalAutoPlanOptions"
      title="Plan Options"
      size="sm"
      v-model="modalShowAutoPlanOptions"
      hide-footer
      centered
    >
      <b-container>
        <!-- fluid -->
        <div class="px-0 py-0 pt-0">
          <!-- <div class="form-group row">
            <div class="col-lg-12">
              <b-form-checkbox v-model="AllowReplan" switch
                >Allow Replan</b-form-checkbox
              >
            </div>
          </div> -->

          <div class="form-group row">
            <div class="col-lg-12">
              <label>Plan Type</label>

              <div class="d-flex justify-content-between mb-0">
                <div class="p-0">Tight</div>
                <div class="p-0">Scattered</div>
              </div>

              <b-form-input
                class="form-control"
                v-model.trim="PlanType"
                type="range"
                min="0"
                max="10"
                step="0.1"
              ></b-form-input>
              <span>{{ PlanType }}</span>
            </div>
          </div>
          <div class="form-group row">
            <div class="col-lg-12">
              <b-form-checkbox v-model="AllowReplan" switch
                >Allow Replan</b-form-checkbox
              >
            </div>
          </div>
        </div>
        <button
          @click="autoPlanning()"
          class="
            btn btn-outline-primary
            font-weight-bold
            btn-sm
            mr-2
            Mybtn1-primary
            Mybtn-size1
           w-100"
        >
          <!-- <i class="fas fa-project-diagram"></i> -->
          Generate Plan
        </button>
      </b-container>
    </b-modal>
  </div>
</template>

<style lang="scss" scoped>
#kt_quick_unPlanningVessel {
  overflow: hidden;
}
</style>

<script>
import KTLayoutQuickUnPlanningVessel from "@/assets/js/berthschedule/quick-unPlanningVessel.js";
import KTOffcanvas from "@/assets/js/components/offcanvas.js";
import { EnumColors, ImageSRC } from "@/mixins.ts";
import DatePicker from "vue2-datepicker";
import {
  GETUnplannedVessel,
  GetChartPlanByVoyageId,
  // AutoVoyageBerthPlan,
} from "@/core/services/store/berthplanning.module";

import { GETConceptUnplannedVessel } from "@/core/services/store/concept.module";
import { mapGetters } from "vuex";
import moment from "moment";
import Plan from "@/view/pages/berthplanning/Plan.vue";

export default {
  name: "KTQuickunPlanningVessel",
  mixins: [EnumColors, ImageSRC],
  inject: ["showErrors", "showSuccess", "isStandalone"],
  components: {
    Plan,
    DatePicker,
  },
  data() {
    return {
      msg: "Please Wait ...",
      loading: false,
      standalone: this.isStandalone,
      // model: [],
      terminalId: 0,
      conceptId: 0,

      Plan_voyageId: null,
      Plan_Title: "",

      isBusy: false,
      currentPage: 1,
      perPage: 4,
      fields: [{ key: "voyageId", sortable: true, label: "" }],
      // items: [],
      sortBy: "VoyageId",
      direction: 1,

      modelItems: [],
      TotalItems: 0,
      searchText: "",
      planStartDate: "",
      planEndDate: "",
      modalShowAutoPlanOptions: false,
      AllowReplan: false,
      PlanType: 2,
    };
  },
  mounted() {
    // Init Quick User Panel
    KTLayoutQuickUnPlanningVessel.init(this.$refs["kt_quick_unPlanningVessel"]);
    this.planStartDate = moment(this.load_fdate).format("YYYY/MM/DD HH:mm");
    this.planEndDate = moment(this.load_tdate).format("YYYY/MM/DD HH:mm");
  },
  computed: {
    fromDate: function() {
      const td = new Date(
        moment(this.currentDate).format("YYYY-MM-DDTHH:mm:ss")
      );
      return moment(this.addDays(td, -7)).format("YYYY-MM-DDTHH:mm:ss");
    },
    toDate: function() {
      const td = new Date(
        moment(this.currentDate).format("YYYY-MM-DDTHH:mm:ss")
      );
      return moment(this.addDays(td, 7)).format("YYYY-MM-DDTHH:mm:ss");
    },
    ...mapGetters([
      // "getUnplannedVessel",

      "getUnplannedVessel_TotalItems",
      "getUnplannedVessel_Items",
      "getUnplannedVessel_CurrentPage",

      "getchartplanbyVoyageId",
      "getAutoVoyageBerthPlan",
      "getBerthChartErrors",
      "getBerthChartMessages",
      "getConceptChartErrors",
      "getConceptUnplannedVessel_Items",
      "getConceptUnplannedVessel_TotalItems",
    ]),
  },

  props: {
    currentDate: String,
    load_fdate: String,
    load_tdate: String,
    add_berthplanview_schedules: Function,
    AutoPlan: Function,
    AutoPlanning: Function,
    activeAutoPlanning: Boolean,
  },

  methods: {
    RefreshUnPlannedVessels() {
      this.isBusy = true;

      var filter = [];
      if (this.searchText.trim() != "") {
        filter = [
          { key: "vesselname", value: this.searchText.trim(), operatorType: 7 },
        ];
      }

      const state = {
        pageNo: this.currentPage,
        rowPerPage: this.perPage,
        sorts: [{ sortBy: this.sortBy, direction: this.direction }],
        filters: filter,
        terminalId: this.terminalId,
        conceptId: this.conceptId,
      };

      if (this.conceptId === 0) {
        this.$store.dispatch(GETUnplannedVessel, state).then(() => {
          //this.loading = false;
          this.isBusy = false;
          const errors = this.getBerthChartErrors;
          if (errors.length > 0) {
            this.showErrors(errors);
          } else {
            this.modelItems = this.getUnplannedVessel_Items;
            this.TotalItems = this.getUnplannedVessel_TotalItems;
          }
        });
      } else {
        this.$store.dispatch(GETConceptUnplannedVessel, state).then(() => {
          //this.loading = false;
          this.isBusy = false;
          const errors = this.getConceptChartErrors;
          if (errors.length > 0) {
            this.showErrors(errors);
          } else {
            this.modelItems = this.getConceptUnplannedVessel_Items;
            this.TotalItems = this.getConceptUnplannedVessel_TotalItems;
          }
        });
      }
    },
    UnplannedVessel_DragStart(event, voyageId) {
      document.querySelector(".offcanvas-overlay").style.visibility = "hidden";
      event.dataTransfer.setData("divVoyagePlanId", event.target.id);

      event.dataTransfer.setData("terminalId", this.terminalId);
      event.dataTransfer.setData("voyageId", voyageId);
      event.dataTransfer.setData("conceptId", this.conceptId);
      event.dataTransfer.setData("offsetX", event.offsetX);
      event.dataTransfer.setData("offsetY", event.offsetY);
    },
    UnplannedVessel_DragEnd() {
      document.querySelector(".offcanvas-overlay").style.visibility = "visible"; //visible
    },
    removeFromModel(voyageId) {
      this.modelItems = this.modelItems.filter((r) => r.voyageId != voyageId);
    },
    showPlan(item) {
      this.Plan_Title =
        "Plan : " +
        item.vesselName +
        " (" +
        item.voyageNoIn +
        "/" +
        item.voyageNoOut +
        ")";

      this.$bvModal.show("modalPlan");

      this.Plan_voyageId = null;
      this.$nextTick(() => {
        this.Plan_voyageId = item.voyageId;
      });
      // this.$bvModal.show("modalPlan");
    },

    autoPlan(item) {
      var param = {
        TerminalId: this.terminalId,
        VoyageId: item.voyageId,
        VesselLineId: item.vesselLineId,
        currentDate: this.currentDate,
        planStartDate: this.planStartDate,
        planEndDate: this.planEndDate,
      };

      this.AutoPlan(param);
    },

    // showAutoPlanOptions() {
    //   this.modalShowAutoPlanOptions = true;
    // },

    autoPlanning() {
      this.modalShowAutoPlanOptions = false;
      var param = {
        terminalId: this.terminalId,
        currentDate: this.currentDate,
        planStartDate: this.planStartDate,
        planEndDate: this.planEndDate,
        allowReplan:this.AllowReplan,
        planType:this.PlanType,
      };

      this.AutoPlanning(param);
    },

    RefreshChartPlan(voyageId) {
      this.removeFromModel(voyageId);

      const filterFromDate = this.fromDate;
      const filterToDate = this.toDate;

      var vm = this;
      vm.loading = true;
      const objstore = this.$store;
      const state = {
        VoyageId: Number(voyageId),
      };

      objstore.dispatch(GetChartPlanByVoyageId, state).then(() => {
        const errors = this.getBerthChartErrors;
        if (errors.length > 0) {
          this.showErrors(errors);
          vm.loading = false;
        } else {
          this.showdivfoot = true;
          var model = this.getchartplanbyVoyageId;
          var startDate = new Date(model.startDate);
          var endDate = new Date(model.endDate);
          if (startDate >= filterFromDate && endDate <= filterToDate) {
            //AddToChart
            vm.add_berthplanview_schedules(model);
          }

          vm.loading = false;
        }
      });
    },

    closeOffcanvas() {
      new KTOffcanvas(KTLayoutQuickUnPlanningVessel.getElement()).hide();
    },
    initquickUnPlanningVessel() {
      KTLayoutQuickUnPlanningVessel.init(
        this.$refs["kt_quick_unPlanningVessel"]
      );
    },

    openOffcanvas() {
      new KTOffcanvas(KTLayoutQuickUnPlanningVessel.getElement()).show();
    },
  },
  watch: {
    currentPage: function() {
      this.RefreshUnPlannedVessels();
    },

    load_fdate: function() {
      this.planStartDate = moment(this.load_fdate).format("YYYY/MM/DD HH:mm");
    },
    load_tdate: function() {
      this.planEndDate = moment(this.load_tdate).format("YYYY/MM/DD HH:mm");
    },
  },
};
</script>
<style>
.UnplannedVessel_VesselType {
  max-width: 150px;
}

.vesselbox {
  border: 2px solid #919191 !important;
  background-color: #ffffff !important;
  padding: 10px !important;
  cursor: move;
  padding-top: 1px !important;
}
.vesselbox:hover {
  background-color: #eeedee !important;
  border: 2px solid #666 !important;
}
.filterplandate {
  width: 100%;
}
/* .filterplandate .ui-datepicker{
 font-size:10px;
} */
</style>
