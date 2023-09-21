<template>
  <div class="row 99h-100 w-100 p-0 m-0" style="height: calc(100% - 7px)">
    <BlockUI v-if="loading" :message="msg">
      <i class="fa fa-spinner fa-spin fa-2x fa-fw"></i>
    </BlockUI>
    <vue-confirm-dialog></vue-confirm-dialog>

    <div class="subheader px-2 py-2 py-lg-4 subheader-solid" id="toolbar">
      <form method="POST" id="frmPage">
        <div
          class="
            container-fluid
            d-flex
            align-items-center
            justify-content-between
            flex-wrap flex-sm-nowrap
          "
        >
          <div class="d-flex align-items-center flex-wrap mr-2">
            <h5 class="font-weight-bolder text-dark mb-0">Line Window</h5>

            <div
              class="
                subheader-separator subheader-separator-ver
                mt-2
                mb-2
                ml-4
                mr-4
                bg-gray-100
              "
            ></div>

            <div class="">
              <model-select
                :options="docks"
                v-model="dock"
                placeholder="select item"
              >
              </model-select>
            </div>

            <div
              class="
                subheader-separator subheader-separator-ver
                mt-2
                mb-2
                ml-4
                mr-4
                bg-gray-100
              "
            ></div>

            <date-picker
              v-model="filterDatetime"
              type="datetime"
              range
              placeholder="Select datetime range"
              format="YYYY/MM/DD HH:mm"
              value-type="format"
            ></date-picker>
          </div>

          <!--begin::Toolbar-->
          <div class="d-flex align-items-center">
            <a
              href="#"
              @click="Refresh_Click"
              class="btn btn-outline-primary font-weight-bold btn-sm mx-2"
            >
              <inline-svg
                class="saab-icon-14"
                fill="#24A148"
                src="media/svg/saab/Refresh.svg"
              />

              Refresh
            </a>

            <a
              href="#"
              @click="Save_Click"
              class="btn btn-outline-primary font-weight-bold btn-sm"
            >
              <inline-svg
                class="saab-icon-14"
                fill="#24A148"
                src="media/svg/saab/Save.svg"
              />

              Save
            </a>
          </div>

          <!--end::Toolbar-->
        </div>
      </form>
    </div>

    <!-- <div
      id="divBerthView"
      v-show="showdivfoot"
      style="width: 100%; height: 100%; margin: 0px auto; overflow: hidden"
    ></div> -->

    <div
      id="divBerthView"
      v-show="showdivfoot"
      class="col-12 p-0 m-0 h-100"
      style="margin: 0px auto; overflow: hidden"
    ></div>

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
              <td class="text-left text-dark-85 font-weight-bolder">
                {{ item.message[0].messageText }}
              </td>

              <td class="text-left">
                <div
                  v-for="(itemmsg, index) in item.message"
                  v-bind:key="itemmsg"
                >
                  <div v-show="index > 0">{{ itemmsg.messageText }}</div>
                </div>
              </td>
              <td>
                <span
                  v-show="item.isSuccessful"
                  class="label label-inline label-success font-weight-bold"
                  >Successful</span
                >
                <span
                  v-show="!item.isSuccessful"
                  class="label label-inline label-danger font-weight-bold"
                  >Failed</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </b-modal>

    <b-modal
      id="windowPatternModal"
      @hide="Refresh_Click"
      size="lg"
      title="Recurrence Pattern"
      hide-footer
    >
      <WindowPattern
        :lineWindowId="lineWindowId"
        modalId="windowPatternModal"
        ref="windowPattern"
      ></WindowPattern>
    </b-modal>

    <KTStickyToolbar
      ref="StickyToolbar"
      :berthmodel="BerthChartModel"
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
import { berthmaker } from "@/assets/js/berthschedule/berthschedule.js";
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
export default {
  components: {
    KTStickyToolbar,
    KTQuickVesselProperty,
    DatePicker,
    WindowPattern,
  },
  inject: ["showErrors", "showSuccess"],
  mixins: [ImageSRC],
  data: function () {
    return {
      msg: "Please Wait ...",
      loading: false,
      modalMessageData: [],
      showdivfoot: false,
      BerthChartModel: null,
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
      // windowPatternModalId:'windowPatternModal',
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

      objstore.dispatch(GETLineWindowChart, state).then(() => {
        const errors = this.getLineWindowChartErrors;
        if (errors.length > 0) {
          this.showErrors(errors);
          vm.loading = false;
        } else {
          this.showdivfoot = true;
          this.$nextTick(() => {
            var model = this.getLineWindowChart;
            this.CreateBerthChartModel(model);
            this.RenderChart();
          });

          vm.loading = false;
        }
      });
    },
    RenderChart() {
      var vm = this;
      //vm.loading = true;
      const objstore = this.$store;
      const divBerthView = document.getElementById("divBerthView");
      if (this.BerthPlanView) {
        this.BerthPlanView.configuration = this.BerthChartConfiguration;
        this.BerthPlanView.schedules = this.BerthChartModel;
        this.BerthPlanView.refresh();
        setTimeout(() => {
          const fromDate = moment(this.filterDatetime[0]);
          const toDate = moment(this.filterDatetime[1]);
          const x =
            Number(
              (new Date(toDate).getTime() - new Date(fromDate).getTime()) / 2
            ) + 1;
          const y = new Date(new Date(fromDate).getTime() + x);

          this.BerthPlanView.scrollTo(y);
        }, 500);
      } else {
        this.BerthPlanView = berthmaker.build(
          this.BerthChartConfiguration,
          this.BerthChartModel
        );

        divBerthView.innerHTML = "";
        divBerthView.appendChild(this.BerthPlanView.view);
      }

      var bp = this.BerthPlanView;

      var objcanvas = divBerthView.querySelector("canvas");
      // objcanvas.style.height = "100%";
      // objcanvas.style.width = "100%";
      objcanvas.ondragover = function (event) {
        event.preventDefault();
      };

      objcanvas.ondrop = function (event) {
        var offsetX = event.dataTransfer.getData("offsetX");
        var offsetY = event.dataTransfer.getData("offsetY");

        const rect = this.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        var topleftX = x - offsetX;
        var topleftY = y - offsetY;

        var zoom = vm.BerthPlanView.configuration.zoom;
        var topleftX2 = topleftX / zoom;
        var topleftY2 = topleftY / zoom;

        var startBollardId = bp.getNearestBollardId(topleftX2);
        var startDatePlan = bp.getNearestTime(topleftY2);
        const startDate = moment(startDatePlan).format("YYYY-MM-DDTHH:mm:ss");

        if (
          startDatePlan < bp.configuration.timeLine.startDate ||
          startDatePlan > bp.configuration.timeLine.endDate
        ) {
          vm.showErrors([{ messageText: "you can not plan this position" }]);
        }

        event.preventDefault();
        vm.loading = true;
        var companyLineServiceId = event.dataTransfer.getData(
          "companyLineServiceId"
        );
        const MyData = {
          terminalId: Number(vm.dock.value),
          companyLineServiceId: Number(companyLineServiceId),
          startBollardId: Number(startBollardId),
          startDate: startDate,
        };

        objstore.dispatch(ADDLineWindowPlanByStartPosition, MyData).then(() => {
          const errors = vm.getLineWindowChartErrors;
          if (errors.length > 0) {
            vm.showErrors(errors);
            vm.loading = false;
          } else {
            var model = vm.getLineWindowPlanbyStartPosition;
            vm.Add_BerthPlanView_Schedules(model);
            vm.loading = false;
          }
        });
      };
    },

    CreateBerthChartModel(model) {
      this.BerthChartModel = null;
      this.BerthUserSetting = model.setting;

      this.BerthChartBerths = model.berths;
      this.BerthChartStartDate = model.startDate;
      this.BerthChartEndDate = model.endDate;

      //Data
      let Schedules = [];

      for (let i = 0; i < model.schedule_NoneWorkingZone.length; i++) {
        let itemSchedule = model.schedule_NoneWorkingZone[i];
        const Schedule = this.Create_BerthPlanView_Schedule(itemSchedule);

        Schedules.push(Schedule);
      }
      this.BerthChartModel = Schedules;
      this.MapSettingToChartconfig();
    },
    MapSettingToChartconfig() {
      const vm = this;
      let Berths = [];
      for (let i = 0; i < this.BerthChartBerths.length; i++) {
        let itemBerth = this.BerthChartBerths[i];
        let Bollards = [];
        for (let j = 0; j < itemBerth.bollards.length; j++) {
          let itemBollard = itemBerth.bollards[j];
          let Bollard = {
            id: itemBollard.id,
            name: itemBollard.name,
            backgroundColor:
              this.prefixColor +
              this.BerthUserSetting.bollard.backgroundColor.replace("#", ""),
            borderColor:
              this.prefixColor +
              this.BerthUserSetting.bollard.borderColor.replace("#", ""),
            borderThickness: Number(
              this.BerthUserSetting.bollard.borderThickness
            ),
            distance: itemBollard.distance,
          };
          Bollards.push(Bollard);
        }
        let Berth = {
          name: itemBerth.name,
          length: itemBerth.length,
          foregroundColor:
            this.prefixColor +
            this.BerthUserSetting.berth.foregroundColor.replace("#", ""),
          backgroundColor:
            this.prefixColor +
            this.BerthUserSetting.berth.backgroundColor.replace("#", ""),
          borderColor:
            this.prefixColor +
            this.BerthUserSetting.berth.borderColor.replace("#", ""),
          borderThickness: Number(this.BerthUserSetting.berth.borderThickness),
          connected: itemBerth.connected,
          bollards: Bollards,
        };
        Berths.push(Berth);
      }

      const Assets = [];
      if (this.BerthChartModel != null && this.BerthChartModel != undefined) {
        for (let i = 0; i < this.BerthChartModel.length; i++) {
          const Schedule = this.BerthChartModel[i];
          var find = Assets.filter((r) => r == Schedule.image);
          if (find.length == 0) {
            Assets.push(Schedule.image);
          }
        }
      }

      //Config/Berth/Bollard
      let Configuration = {
        backgroundColor:
          this.prefixColor +
          this.BerthUserSetting.configuration.backgroundColor.replace("#", ""),
        zoom: 1,
        // assetRoot: "./media/berthschedule",
        resizeTo: document.getElementById("divBerthView"),
        spriteSheet: "./media/berthschedule/spritesheet.json",
        assets: Assets,
        timeLine: {
          pixelPerHour: Number(
            this.BerthUserSetting.configuration.pixelPerHour
          ),
          startDate: new Date(this.BerthChartStartDate),
          endDate: new Date(this.BerthChartEndDate),
          // timeGridColor:
          //   this.prefixColor +
          //   this.BerthUserSetting.configuration.timeGridColor.replace("#", ""),
          backgroundColor:
            this.prefixColor +
            this.BerthUserSetting.configuration.timeLineBackgroundColor.replace(
              "#",
              ""
            ),
          foregroundColor:
            this.prefixColor +
            this.BerthUserSetting.configuration.timeLineForegroundColor.replace(
              "#",
              ""
            ),
          borderThickness: Number(
            this.BerthUserSetting.configuration.timeLineBorderThickness
          ),
          borderColor:
            this.prefixColor +
            this.BerthUserSetting.configuration.timeLineBorderColor.replace(
              "#",
              ""
            ),
          startOfDay: {
            backgroundColor:
              this.prefixColor +
              this.BerthUserSetting.configuration.timeLineStartOfDayBackgroundColor.replace(
                "#",
                ""
              ),
            foregroundColor:
              this.prefixColor +
              this.BerthUserSetting.configuration.timeLineStartOfDayForegroundColor.replace(
                "#",
                ""
              ),
          },
          hour: {
            backgroundColor:
              this.prefixColor +
              this.BerthUserSetting.configuration.timeLineHourBackgroundColor.replace(
                "#",
                ""
              ),
            foregroundColor:
              this.prefixColor +
              this.BerthUserSetting.configuration.timeLineHourForegroundColor.replace(
                "#",
                ""
              ),
          },
          // weekdaysOnly: false,
          dateLocale: "en-US",
          dateFormat: "DayMonth", // 'Weekday' | 'DayMonth' | 'Full'
        },
        cornerBox: {
          backgroundColor:
            this.prefixColor +
            this.BerthUserSetting.configuration.cornerBoxBackgroundColor.replace(
              "#",
              ""
            ),
          foregroundColor:
            this.prefixColor +
            this.BerthUserSetting.configuration.cornerBoxForegroundColor.replace(
              "#",
              ""
            ),
          borderThickness: Number(
            this.BerthUserSetting.configuration.cornerBoxBorderThickness
          ),
          borderColor:
            this.prefixColor +
            this.BerthUserSetting.configuration.cornerBoxBorderColor.replace(
              "#",
              ""
            ),
        },
        quay: {
          pixelPerMeter: Number(
            this.BerthUserSetting.configuration.pixelPerMeter
          ),
          bollardGridColor:
            this.prefixColor +
            this.BerthUserSetting.configuration.bollardGridColor.replace(
              "#",
              ""
            ),
          showTitle: true,
          showDistance: false,
          berthEndColor: 0xd7b100,
          berths: Berths,
        },
        onLoadingComplete: function () {
          // Loading is completed here
          const fromDate = moment(vm.filterDatetime[0]);
          const toDate = moment(vm.filterDatetime[1]);

          const x =
            Number(
              (new Date(toDate).getTime() - new Date(fromDate).getTime()) / 2
            ) + 1;
          const y = new Date(new Date(fromDate).getTime() + x);

          vm.BerthPlanView.scrollTo(y);

          // const divBerthView = document.getElementById("divBerthView");
          // var objcanvas = divBerthView.querySelector("canvas");
          // objcanvas.style.height = "100%";
          // objcanvas.style.width = "100%";
        },
      };
      this.BerthChartConfiguration = Configuration;
    },
    RefreshSetting(model) {
      this.BerthUserSetting = model;
      this.MapSettingToChartconfig();
      this.BerthPlanView.configuration = this.BerthChartConfiguration;
      this.BerthPlanView.refresh();
    },
    Save_Click() {
      var Schedules = this.BerthPlanView.schedules;
      var Model = [];
      for (var i = 0; i < Schedules.length; i++) {
        var item = Schedules[i];
        if (item.IsAllowSave == true) {
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
    Add_BerthPlanView_Schedules(itemSchedule) {
      const Schedule = this.Create_BerthPlanView_Schedule(itemSchedule);
      this.BerthPlanView.configuration.assets.push(Schedule.image);
      this.BerthPlanView.schedules.push(Schedule);
      this.BerthPlanView.refresh();
    },

    Create_BerthPlanView_Schedule(itemSchedule) {
      const vm = this;

      const Schedule = {
        name: itemSchedule.name,
        rowVersion: itemSchedule.rowVersion,
        companyLineServiceId: itemSchedule.companyLineServiceId,
        IsMaintenance: true,
        moveLocked: false, //itemSchedule.moveLocked,
        operationTimeLocked: false, // itemSchedule.operationTimeLocked,
        IsAllowSave: true, // itemSchedule.isAllowSave,
        zIndex: 5,
        backgroundColor: itemSchedule.backgroundColor,
        foregroundColor: itemSchedule.foregroundColor,
        borderColor: itemSchedule.borderColor,
        borderThickness: itemSchedule.borderThickness,
        description: itemSchedule.description,
        startBollardId: itemSchedule.startBollardId,
        endBollardId: itemSchedule.endBollardId,
        startDate: new Date(itemSchedule.startDate),
        endDate: new Date(itemSchedule.endDate),
        reason: itemSchedule.reason,
        //image: itemSchedule.image,
        image:
          itemSchedule.companyId == "0"
            ? "./media/berthschedule/ShippingLineDefault.png"
            : vm.getCompanyImage(itemSchedule.companyId),
        eventHandler: function (eventName, source) {
          vm.ShowWindowPattern(eventName, source);
        },
      };

      return Schedule;
    },

    ShowWindowPattern(eventName, source) {
      eventName = eventName + "";
      this.$bvModal.show("windowPatternModal");
      this.lineWindowId = Number(source.name);
    },

    DeleteLineWindow(eventName, source) {
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
                //this.getdata();
                this.RemoveItemFromChart(source.name);
              }
            });
            //end
          }
        },
      });
    },
    RemoveItemFromChart(id) {
      this.BerthPlanView.schedules = this.BerthPlanView.schedules.filter(
        (r) => r.name != id
      );
      this.BerthPlanView.refresh();
    },
  },
};
</script>

<style>
#divBerthView {
  width: 100%;
  /* height: 73vh; */
  height: 80vh;
  margin: 0px auto;
  /* position: static;  */
  overflow: hidden;
}

/* #divBerthView {
  width: 100%;
  height: 73vh;
  margin: 0px auto;
  position: static; 
} */

/* #divBerthView {
  margin: 0;
  padding: 0;
  overflow-x: scroll;
  overflow-y: scroll;
} */
.filterdate {
  width: 100%;
}
</style>
