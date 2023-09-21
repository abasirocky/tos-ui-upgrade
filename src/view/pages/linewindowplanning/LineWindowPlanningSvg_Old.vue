<template>
  <div class="row h-100 w-100 p-0 m-0">
    <BlockUI v-if="loading" :message="msg">
      <i class="fa fa-spinner fa-spin fa-2x fa-fw"></i>
    </BlockUI>
    <vue-confirm-dialog></vue-confirm-dialog>

    <div class="subheader px-0 subheader-solid MySubheader" id="toolbar">
      <div
        class="container-fluid d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap"
      >
        <div class="d-flex align-items-center flex-wrap mr-2">
          <h5 class="font-weight-bolder text-dark mb-0 mr-1 MySubHeaderTitle">Line Window</h5>
          <div class="subheader-separator subheader-separator-ver mt-2 mb-2 ml-4 mr-4 bg-gray-100"></div>
          <ul class="breadcrumb breadcrumb-transparent breadcrumb-dot font-weight-bold p-0 my-2">
            <span class="text-muted">{{ FilterDockText }}</span>
          </ul>

          <div class="subheader-separator subheader-separator-ver mt-2 mb-2 ml-4 mr-0 bg-gray-100"></div>
        </div>

        <!--begin::Toolbar-->
        <div class="d-flex align-items-center">
          <!-- Start Refresh -->
          <button
            type="button"
            @click="Refresh_Click"
            class="btn btn-outline-primary font-weight-bold btn-sm mr-2 Mybtn1-primary Mybtn-size1"
          >
            <i class="fas fa-sync-alt"></i>
            <span class="hideButtonTitle">REFRESH</span>
          </button>
          <!-- end Refresh -->

          <!-- Start Filter -->
          <button
            @click="modalShowFilter = true"
            type="button"
            class="btn btn-outline-primary font-weight-bold btn-sm mr-2 Mybtn1-primary Mybtn-size1"
          >
            <i class="fa fa-filter icon-sm"></i>
            <span class="hideButtonTitle">FILTER</span>
          </button>
          <!-- End Filter -->

          <!-- start Save -->

          <button
            @click="Save_Click"
            type="button"
            class="btn btn-outline-primary font-weight-bold btn-sm mr-2 Mybtn1-primary Mybtn-size1"
          >
            <i class="fas fa-save"></i>
            <span class="hideButtonTitle">SAVE</span>
          </button>
          <!-- end Save -->
        </div>

        <!--end::Toolbar-->
      </div>
    </div>

    <div
      id="divBerthView"
      v-show="false"
      class="col-12 p-0 m-0 h-100"
      style="margin: 0px auto; overflow: hidden"
    ></div>
    <div class="col-12 p-0 m-0 h-100" style="margin: 0px auto; overflow: hidden">
      <BerthChartComponent
        ref="berthChart"
        @dropScheduleItem="dropScheduleItem"
        @clickLineWindowData="bertChartClickData"
        @clickdeleteWindow="DeleteItem"
        :Mode="'LineWindow'"
      ></BerthChartComponent>
    </div>

    <b-modal id="modalMessage" size="xl" hide-footer title="Message">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Description</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in modalMessageData" v-bind:key="item">
              <td
                class="text-left text-dark-85 font-weight-bolder"
              >{{ item.message[0].messageText }}</td>

              <td class="text-left">
                <div v-for="(itemmsg, index) in item.message" v-bind:key="itemmsg">
                  <div v-show="index > 0">{{ itemmsg.messageText }}</div>
                </div>
              </td>
              <td>
                <span
                  v-show="item.isSuccessful"
                  class="label label-inline label-success font-weight-bold"
                >Successful</span>
                <span
                  v-show="!item.isSuccessful"
                  class="label label-inline label-danger font-weight-bold"
                >Failed</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </b-modal>

    <!-- modalShowPattern
    title="Recurrence Pattern"-->
    <b-modal
      id="windowPatternModal"
      v-model="modalShowPattern"
      @hide="Refresh_Click"
      size="lg"
      header-class=" pb-8 ribbon ribbon-clip ribbon-left"
      body-class="pt-3"
      hide-footer
      centered
      title
    >
      <template #modal-title>
        <div v-if="currentPatternData" class="ribbon-target" style="top: 12px">
          <span class="ribbon-inner bg-warning" />
          <span class="font-weight-bolder font-size-sm">
            {{
              currentPatternData.companyLineServiceName
            }}
          </span>
        </div>
      </template>

      <WindowPattern :lineWindowId="lineWindowId" modalId="windowPatternModal" ref="windowPattern"></WindowPattern>
    </b-modal>

    <!-- Start Modal Filter -->
    <b-modal
      id="modalFilter"
      ref="modalFilter"
      title
      v-model="modalShowFilter"
      size="lg"
      dialog-class="filterModalSize"
      hide-footer
      centered
      content-class="shadow"
      header-class=" pb-8 ribbon ribbon-clip ribbon-left"
      body-class="pt-3"
    >
      <template #modal-title>
        <div class="ribbon-target" style="top: 12px">
          <span class="ribbon-inner bg-warning" />
          <span class="font-weight-bolder font-size-sm">Filter</span>
        </div>
      </template>
      <b-form-group label="Port" label-for="treeDock" @submit.stop.prevent>
        <!-- <treeselect id="treeDock" :normalizer="normalizer" :options="docks" v-model="dock" :multiple="false" placeholder="Select your item(s)..."> </treeselect> -->

        <model-select :options="docks" v-model="dock" placeholder="select item"></model-select>
      </b-form-group>

      <b-form-group label="Date" label-for="currentDate">
        <!-- <date-picker v-model="currentDate" name="currentDate" type="date" placeholder="Choose Date" format="YYYY/MM/DD" value-type="format" class="filterdate"></date-picker>
        -->

        <date-picker
          v-model="filterDatetime"
          type="datetime"
          range
          placeholder="Select datetime range"
          format="YYYY/MM/DD HH:mm"
          value-type="format"
        ></date-picker>
      </b-form-group>

      <div style="text-align: right">
        <button
          @click="modalShowFilter = false"
          class="btn btn-outline-primary font-weight-bold btn-sm mx-2 Mybtn1-primary Mybtn-size1"
        >
          <i class="fas fa-times"></i>
          CLOSE
        </button>

        <button
          @click="Refresh_Click"
          class="btn btn-outline-primary font-weight-bold btn-sm mx-2 Mybtn1-primary Mybtn-size1"
        >
          <i class="fas fa-check"></i>
          APPLY
        </button>
      </div>
    </b-modal>
    <!-- End Modal Filter -->

    <KTStickyToolbar
      ref="StickyToolbar"
      @zoomIn="zoomIn"
      @zoomOut="zoomOut"
      :berthmodel="BerthChartModel999"
      :berthPlanView="BerthPlanView"
      :berthchartFilterDate="filterDatetime"
      :add_berthplanview_schedules="Add_BerthPlanView_Schedules"
      :RefreshSetting="RefreshSetting"
      :berthUserSetting="BerthUserSetting"
      v-if="filterDatetime"
    ></KTStickyToolbar>
    <KTQuickVesselProperty ref="quickVesselProperty"></KTQuickVesselProperty>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import KTStickyToolbar from "@/view/pages/linewindowplanning/StickyToolbar.vue";
import KTQuickVesselProperty from "@/view/pages/linewindowplanning/QuickVesselProperty.vue";
import moment from "moment";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import WindowPattern from "@/view/pages/definitions/lineWindow/LinewindowPattern.vue";
import {
  GETLineWindowChart,
  GETLineWindowInit,
  ADDLineWindowPlanByStartPosition,
  UPDATELineWindowChart,
} from "@/core/services/store/linewindowplanning.module";

import { DELETELINEWINDOWLIST } from "@/core/services/store/lineWindow.module";
import { ImageSRC } from "@/mixins.ts";
import BerthChartComponent from "@/view/pages/berthing/BerthChartComponent.vue";
export default {
  components: {
    KTStickyToolbar,
    KTQuickVesselProperty,
    DatePicker,
    WindowPattern,
    BerthChartComponent,
  },
  inject: ["showErrors", "showSuccess"],
  mixins: [ImageSRC],
  data: function () {
    return {
      BerthChartModel999: null,
      msg: "Please Wait ...",
      loading: false,
      modalMessageData: [],
      showdivfoot: false,
      BerthChartConfiguration: null,
      BerthChartBerths: null,
      BerthChartStartDate: "",
      BerthChartEndDate: "",
      BerthPlanView: null,
      BerthUserSetting: null,
      prefixColor: "0x",
      docks: [],
      dock: null,
      filterDatetime: null,
      lineWindowId: 0,
      modalShowPattern: false,
      currentPatternData: null,
      modalShowFilter: false,
      FilterDockText: "",
    };
  },
  computed: {
    ...mapGetters([
      "getLineWindowChartInit",
      "getLineWindowChart",
      "getLineWindowErrors",
      "getLineWindowMessages",
      "getLineWindowPlanbyStartPosition",
      "getUpdateLineWindowChart",
      "getLineWindowChartErrors",
      "getLineWindowChartMessages",
    ]),
  },
  mounted() {
    this.getInit();
  },
  methods: {
    zoomIn() {
      const berthchart = this.$refs.berthChart;
      berthchart.zoomIn();
    },
    zoomOut() {
      const berthchart = this.$refs.berthChart;
      berthchart.zoomOut();
    },
    DeleteItem(schedule) {
      this.$confirm({
        message: `Are you sure to delete?`,
        button: {
          no: "No",
          yes: "Yes",
        },
        callback: (confirm) => {
          if (confirm) {
            this.loading = true;
            const body = {
              Id: schedule.lineWindowId,
              rowVersion: schedule.rowVersion,
            };
            this.$store.dispatch(DELETELINEWINDOWLIST, body).then(() => {
              this.loading = false;
              const errors = this.getLineWindowErrors;
              if (errors.length > 0) {
                this.showErrors(errors);
              } else {
                const messages = this.getLineWindowMessages;
                this.showSuccess(messages);
                this.RemoveItemFromChart(schedule.lineWindowId);
              }
            });
          }
        },
      });
    },

    dropScheduleItem(data) {
      const vm = this;
      const berthchart = this.$refs.berthChart;
      const startBollardId = data.startBollard.id;
      const startDatePlan = data.startDatePlan;
      const startDate = moment(startDatePlan).format("YYYY-MM-DDTHH:mm:ss");
      // if (
      event.preventDefault();
      vm.loading = true;
      var companyLineServiceId = data.event.dataTransfer.getData(
        "companyLineServiceId"
      );
      const MyData = {
        terminalId: Number(vm.dock.value),
        companyLineServiceId: Number(companyLineServiceId),
        startBollardId: Number(startBollardId),
        startDate: startDate,
      };
      const objstore = this.$store;
      objstore.dispatch(ADDLineWindowPlanByStartPosition, MyData).then(() => {
        const errors = vm.getLineWindowChartErrors;
        if (errors.length > 0) {
          vm.showErrors(errors);
          vm.loading = false;
        } else {
          var model = vm.getLineWindowPlanbyStartPosition;
          let Schedule = vm.Add_BerthPlanView_Schedules(model);
          const lines = this.getChartLinewindowModel();
          lines.push(Schedule);
          berthchart.showLineWindows(lines);

          vm.loading = false;
        }
      });
    },
    bertChartClickData(data) {
      this.currentPatternData = data._data.model.schedule;
      this.modalShowPattern = true;
      this.lineWindowId = Number(this.currentPatternData.lineWindowId);
    },

    getInit() {
      this.$store.dispatch(GETLineWindowInit).then(() => {
        const errors = this.getLineWindowChartErrors;
        if (errors.length > 0) {
          this.showErrors(errors);
        } else {
          var model = this.getLineWindowChartInit;
          let fromDate = new Date(model.fromDate);
          const fdate = moment(fromDate).format("YYYY/MM/DD HH:mm");
          let toDate = new Date(model.toDate);
          const tdate = moment(toDate).format("YYYY/MM/DD HH:mm");
          this.filterDatetime = [fdate, tdate];

          this.docks = model.ports;
          if (this.docks.length > 0) {
            this.dock = this.docks[0];
            this.Refresh_Click();
          }
        }
      });
    },
    Refresh_Click() {
      if (this.loading) {
        return false;
      }
      var vm = this;
      this.modalShowFilter = false;
      vm.loading = true;
      const objstore = this.$store;
      const fromDate = moment(this.filterDatetime[0]);
      const fdate = moment(fromDate).format("YYYY-MM-DDTHH:mm:ss");
      const toDate = moment(this.filterDatetime[1]);
      const tdate = moment(toDate).format("YYYY-MM-DDTHH:mm:ss");
      const state = {
        fromDate: fdate,
        toDate: tdate,
        terminalId: Number(this.dock.value),
      };

      //  const findDock = this.docks.find((i) => i.id == this.dock);
      this.FilterDockText = this.dock.text;

      objstore.dispatch(GETLineWindowChart, state).then(() => {
        const errors = this.getLineWindowChartErrors;
        if (errors.length > 0) {
          vm.showErrors(errors);
          vm.loading = false;
        } else {
          vm.showdivfoot = true;
          vm.$nextTick(() => {
            var model = vm.getLineWindowChart;
            vm.RenderChart(model);
          });

          vm.loading = false;
        }
      });
    },
    RenderChart(model) {
      const BerthChartModel = {
        startDate: model.startDate,
        endDate: model.endDate,
        berths: model.berths,
        schedules: [],
        schedule_NoneWorkingZone: [],
      };
      const lineWindows = [];
      model.schedule_NoneWorkingZone.forEach((itemSchedule) => {
        let Schedule = this.Add_BerthPlanView_Schedules(itemSchedule);
        lineWindows.push(Schedule);
      });
      this.setChartModel(BerthChartModel, lineWindows);
    },
    Add_BerthPlanView_Schedules(itemSchedule) {
      let Schedule = {
        id: itemSchedule.id,
        name: itemSchedule.name,
        lineWindowId: itemSchedule.lineWindowId,
        rowVersion: itemSchedule.rowVersion,
        companyLineServiceId: itemSchedule.companyLineServiceId,
        moveLocked: false,
        moveTimeLocked: false,
        description: itemSchedule.description,
        lineName: itemSchedule.lineName,
        companyLineServiceName: itemSchedule.companyLineServiceName,
        companyLineServiceDescription:
          itemSchedule.companyLineServiceDescription,
        startBollardId: itemSchedule.startBollardId,
        endBollardId: itemSchedule.endBollardId,
        startDate: new Date(itemSchedule.startDate),
        endDate: new Date(itemSchedule.endDate),
        StartBollardName: itemSchedule.startBollardName,
        endBollardName: itemSchedule.endBollardName,
        readonly: false,
        image:
          itemSchedule.companyId == "0"
            ? "./media/berthschedule/ShippingLineDefault.png"
            : this.getCompanyImage(itemSchedule.companyId),
      };
      return Schedule;
    },
    Save_Click() {
      var Schedules = this.getChartLinewindowModel();
      var Model = [];
      for (var i = 0; i < Schedules.length; i++) {
        var item = Schedules[i];

        var obj = {
          id: item.name,
          CompanyLineServiceId: item.companyLineServiceId,
          StartBollardId: item.startBollardId,
          EndBollardId: item.endBollardId,
          StartDate: moment(item.startDate).format("YYYY-MM-DDTHH:mm:ss"),
          EndDate: moment(item.endDate).format("YYYY-MM-DDTHH:mm:ss"),
        };
        Model.push(obj);
      }

      if (Model.length == 0) {
        this.showErrors([{ messageText: "No data to save" }]);
        return false;
      }

      this.$confirm({
        message: `Are you sure?`,
        button: {
          no: "No",
          yes: "Yes",
        },
        callback: (confirm) => {
          if (confirm) {
            const state = {
              terminalId: Number(this.dock.value),
              model: Model,
            };
            this.loading = true;
            this.$store.dispatch(UPDATELineWindowChart, state).then(() => {
              const errors = this.getLineWindowChartErrors;
              if (errors.length > 0) {
                this.showErrors(errors);
                this.loading = false;
              } else {
                let result = this.getUpdateLineWindowChart;
                this.modalMessageData = result;
                this.loading = false;
                this.$bvModal.show("modalMessage");
              }
            });
          }
        },
      });
    },

    DeleteLineWindow9999(eventName, source) {
      this.$confirm({
        message: `Are you sure to delete?`,
        button: {
          no: "No",
          yes: "Yes",
        },
        callback: (confirm) => {
          if (confirm) {
            eventName = "";
            this.loading = true;
            const body = {
              Id: source.name,
              rowVersion: source.rowVersion,
            };
            this.$store.dispatch(DELETELINEWINDOWLIST, body).then(() => {
              this.loading = false;
              const errors = this.getLineWindowErrors;
              if (errors.length > 0) {
                this.showErrors(errors);
              } else {
                const messages = this.getLineWindowMessages;
                this.showSuccess(messages);
                this.RemoveItemFromChart(source.name);
              }
            });
            //end
          }
        },
      });
    },
    RemoveItemFromChart(id) {
      let lineWindows = this.getChartLinewindowModel();
      const chartModel = this.getChartModel();
      lineWindows = lineWindows.filter((r) => r.lineWindowId != id);
      this.setChartModel(chartModel, lineWindows);
    },

    getChartModel() {
      const berthchart = this.$refs.berthChart;
      const dataModel = berthchart.getDataModel();
      return dataModel;
    },
    getChartLinewindowModel() {
      const berthchart = this.$refs.berthChart;
      const linewindowModel = berthchart.getLineWindows();
      return linewindowModel;
    },
    setChartModel(BerthChartModel, lineWindows) {
      const berthchart = this.$refs.berthChart;
      berthchart.renderData(BerthChartModel);
      this.$nextTick(() => {
        berthchart.showLineWindows(lineWindows);
      });
    },

    RefreshSetting(model) {
      console.log(model);
    },
  },
};
</script>

<style>
#divBerthView9999 {
  width: 100%;
  height: 80vh;
  margin: 0px auto;
  overflow: hidden;
}

.filterdate {
  width: 100%;
}

.filterModalSize {
  max-width: 400px;
}

@media (max-width: 600px) {
  .hideButtonTitle {
    display: none !important;
  }
}

@media (max-width: 600px) {
  .MySubheader {
    padding: 0px 15px 10px 15px;
  }
}

@media (max-width: 600px) {
  .subheader.subheader-solid {
    margin-bottom: 0px;
  }
}
</style>
