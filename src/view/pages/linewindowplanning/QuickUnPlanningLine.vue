<template>
  <div
    id="kt_quick_unPlanningLine"
    ref="kt_quick_unPlanningLine"
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
         Vessel Line Services</h3>
      


      <a
        href="#"
        class="btn btn-xs btn-icon btn-light btn-hover-primary"
        id="kt_quick_unPlanningLine_close"
      >
        <i class="ki ki-close icon-xs text-muted"></i>
      </a>
    </div>

    <div>
      <b-input-group class="mt-3">
        <b-form-input v-model="searchText"></b-form-input>
        <b-input-group-append>
          <b-button @click="FindUnPlannedLine" variant="info">Find</b-button>
        </b-input-group-append>
      </b-input-group>
    </div>

    <b-row>
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

    <div
      class="offcanvas-content scroll"
      style="max-height: 70vh; position: relative"
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
            <template #cell(lineServiceId)="row">
              <div class="card card-custom card-stretch">
                <div
                  @dragstart="UnplannedLine_DragStart($event, row.value)"
                  @dragend="UnplannedLine_DragEnd()"
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
                      justify-content-center
                      w-100
                    "
                  >
                    <div
                      class="d-flex flex-column align-items-center py-1 w-45"
                    >
                      <label
                        class="
                          checkbox
                          checkbox-outline
                          checkbox-outline-2x
                          checkbox-primary
                        "
                      >
                        <label
                          class="
                            text-dark-85
                            font-weight-bolder
                            pl-1
                            font-size-lg
                          "
                          style="margin-top: 5px; text-align: center"
                        >
                          {{ row.item.lineServiceName }}
                          <br />
                          <div class="font-size-sm font-weight-normal">
                            {{ row.item.lineServiceLength }} (Meter),
                            {{ GetOperationTime(row.item.lineServiceDuration) }}
                          </div>
                        </label>
                      </label>
                    </div>
                  </div>
                  <div
                    class="
                      d-flex
                      flex-wrap
                      align-items-center
                      justify-content-center
                      w-100
                    "
                  >
                    <div class="d-flex flex-column align-items-cente py-1 w-45">
                      <img
                        draggable="false"
                        class="UnplannedVessel_VesselType"
                        :src="
                          row.item.imageFileName == null ||
                          row.item.imageFileName == ''
                            ? 'media/berthschedule/ShippingLineDefault.png'
                            : getCompanyImage(row.item.lineId)
                        "
                        style="max-height: 128px"
                      />

                      <!-- row.item.imageFileName -->
                    </div>
                  </div>

                  <div
                    class="
                      voyagetooltip
                      text-center text-dark-85
                      font-weight-boldest font-size-sm
                      mb-0
                    "
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title="Line"
                  >
                    {{ row.item.lineName }}
                  </div>

                  <div
                    class="
                      voyagetooltip
                      text-center text-dark-85
                      font-weight-boldest font-size-sm
                      mb-0
                    "
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title="Agent"
                  >
                    {{ row.item.agentName }}
                  </div>
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
  </div>
</template> 

<style lang="scss" scoped>
#kt_quick_unPlanningLine {
  overflow: hidden;
}
</style>

<script>
import KTLayoutQuickUnPlanningLine from "@/assets/js/linewindowchart/quick-unPlanningLine.js";
import KTOffcanvas from "@/assets/js/components/offcanvas.js";
import { EnumColors, ImageSRC, ConvertTime } from "@/mixins.ts";
import {
  GETUnplannedLines,
  GetChartPlanByVoyageId,
} from "@/core/services/store/linewindowplanning.module";
import { mapGetters } from "vuex";
import moment from "moment";
import Plan from "@/view/pages/linewindowplanning/Plan.vue";

export default {
  name: "KTQuickunPlanningLine",
  mixins: [EnumColors, ImageSRC, ConvertTime],
  inject: ["showErrors", "showSuccess", "isStandalone"],
  components: {
    Plan,
  },
  data() {
    return {
      msg: "Please Wait ...",
      loading: false,
      standalone: this.isStandalone,
      model: [],
      Plan_voyageId: null,
      Plan_Title: "",
      isBusy: false,
      currentPage: 1,
      perPage: 10,
      fields: [{ key: "lineServiceId", sortable: true, label: "" }],
      // items: [],
      sortBy: "LineId",
      direction: 1,

      modelItems: [],
      TotalItems: 0,
      searchText: "",
    };
  },
  mounted() {
    // Init Quick User Panel
    KTLayoutQuickUnPlanningLine.init(this.$refs["kt_quick_unPlanningLine"]);
  },
  computed: {
    ...mapGetters([
      "getUnplannedLine_TotalItems",
      "getUnplannedLine_Items",
      "getUnplannedLine_CurrentPage",
      "getchartplanbyVoyageId",
      "getLineWindowChartErrors",
      "getLineWindowChartMessages",
    ]),
  },
  props: {
    berthchartFilterDate: Array,
    add_berthplanview_schedules: Function,
  },
  methods: {
    FindUnPlannedLine() {
      this.isBusy = true;
      var filter = [];
      if (this.searchText.trim() != "") {
        filter = [
          { key: "linename", value: this.searchText.trim(), operatorType: 7 },
        ];
      }
      const state = {
        pageNo: this.currentPage,
        rowPerPage: this.perPage,
        sorts: [{ sortBy: this.sortBy, direction: this.direction }],
        filters: filter,
      };

      //this.loading = true;
      var vm = this;
      this.$store.dispatch(GETUnplannedLines, state).then(() => {
        //vm.loading = false;
        vm.isBusy = false;
        const errors = vm.getLineWindowChartErrors;
        if (errors.length > 0) {
          vm.showErrors(errors);
        } else {
          vm.modelItems = vm.getUnplannedLine_Items;
          vm.TotalItems = vm.getUnplannedLine_TotalItems;
        }
      });
    },
    UnplannedLine_DragStart(event, companyLineServiceId) {
      document.querySelector(".offcanvas-overlay").style.visibility = "hidden";
      // event.dataTransfer.setData("divVoyagePlanId", event.target.id);
      event.dataTransfer.setData("companyLineServiceId", companyLineServiceId);
      event.dataTransfer.setData("offsetX", event.offsetX);
      event.dataTransfer.setData("offsetY", event.offsetY);
    },
    UnplannedLine_DragEnd() {
      document.querySelector(".offcanvas-overlay").style.visibility = "visible"; //visible
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
    RefreshChartPlan(voyageId) {
      const filterFromDate = moment(this.berthchartFilterDate[0]);
      const filterToDate = moment(this.berthchartFilterDate[1]);

      var vm = this;
      vm.loading = true;
      const objstore = this.$store;
      const state = {
        VoyageId: Number(voyageId),
      };

      objstore.dispatch(GetChartPlanByVoyageId, state).then(() => {
        const errors = this.getLineWindowChartErrors;
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
      new KTOffcanvas(KTLayoutQuickUnPlanningLine.getElement()).hide();
    },
    initquickUnPlanningLine() {
      KTLayoutQuickUnPlanningLine.init(this.$refs["kt_quick_unPlanningLine"]);
    },

    openOffcanvas() {
      new KTOffcanvas(KTLayoutQuickUnPlanningLine.getElement()).show();
    },
  },
  watch: {
    currentPage: function () {
      this.FindUnPlannedLine();
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
</style>
