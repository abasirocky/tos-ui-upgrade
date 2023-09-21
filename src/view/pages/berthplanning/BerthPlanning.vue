<template>
  <div
    id="div1"
    class="column 99h-100 w-100 p-0 m-0"
    style="height: calc(100% - 7px)"
  >
    <vue-confirm-dialog></vue-confirm-dialog>

    <div id="context-menu">
      <VesselTimeLine ref="VesselTimeLine1"></VesselTimeLine>

      <!--begin::Navigation-->
      <!-- style="display: none" -->
      <ul class="navi navi-hover" >
        <li
          style="white-space: nowrap"
          v-if="this.getActiveConcept.type != 'Concept' && standalone == true"
          class="navi-item"
          @click="showSOF()"
        >
          <a href="#" class="navi-link">
            <span class="navi-icon">
              <i class="flaticon-calendar-with-a-clock-time-tools"></i>
            </span>
            <span class="navi-text">SOF</span>
          </a>
        </li>

        <li class="navi-item" @click="ShowVoyageInfo()">
          <a href="#" class="navi-link">
            <span class="navi-icon">
              <i class="flaticon2-list-3"></i>
            </span>
            <span class="navi-text">Details</span>
          </a>
        </li>

        <li
          style="white-space: nowrap"
          v-if="
            this.getActiveConcept.type != 'Concept' &&
            standalone == true &&
            IsDeletePlan == true
          "
          class="navi-item"
          @click="deleteSOFPlan()"
        >
          <a href="#" class="navi-link">
            <span class="navi-icon">
              <i class="flaticon-delete"></i>
            </span>
            <span class="navi-text">Delete Plan</span>
          </a>
        </li>

        <li
          v-if="
            this.getActiveConcept.type === 'Concept' &&
            standalone == true &&
            IsDeleteConceptItemPlan == true
          "
          class="navi-item"
          @click="DeleteConceptItem()"
        >
          <a href="#" class="navi-link">
            <span class="navi-icon">
              <i class="flaticon-delete"></i>
            </span>
            <span class="navi-text">Delete</span>
          </a>
        </li>
      </ul>
      <!--end::Navigation-->
    </div>

    <div class="subheader px-2 py-2 py-lg-4 subheader-solid mySubheader" id="toolbar">
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
          <h5 class="font-weight-bolder text-dark mb-0">Berth View</h5>
          <div
            class="
              subheader-separator subheader-separator-ver
              mt-2
              mb-2
              ml-4
              mr-0
              bg-gray-100
            "
          ></div>
          <!--begin::Port-->
          
          <!--begin::Concept-->
          <b-dropdown
            variant="outline-primary999"
            class="m-2"
            @show="clickActivePlan"
          >
            <template v-slot:button-content>
              <i :class="getActiveConcept.icon"></i>
              <span class="ml-3">{{ getActiveConcept.text }}</span>
            </template>

            <b-dropdown-item-button
              v-for="item in conceptMenus"
              :key="item.id"
              @click="changeConcept(item)"
            >
              <i :class="item.icon"></i>
              <span class="ml-3">{{ item.text }}</span>
            </b-dropdown-item-button>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item-button @click="ShowConceptList">
              <i class="flaticon2-layers text-warning999"></i>
              <span class="ml-3">Concepts ...</span>
            </b-dropdown-item-button>
          </b-dropdown>
        </div>

        <!--begin::Toolbar-->
        <div class="d-flex align-items-center">
          <a
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
          <!--begin::Actions-->
          <div class="d-flex align-items-center pr-0">
            <b-dropdown variant="outline-primary btn-sm" size="sm" class="m-2">
              <template v-slot:button-content>
                <i class="flaticon2-indent-dots text-primary"></i>
                <span class="">Actions</span>
              </template>
              <b-dropdown-item-button>
                <div id="chkEnableLinewindow" class="pl-0">
                  <b-form-checkbox v-model="EnableLinewindow" switch
                    >Line Windows</b-form-checkbox
                  >
                </div>
              </b-dropdown-item-button>
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-item-button
                v-if="getActiveConcept.type == 'Concept'"
                @click="SaveAsCurrent"
              >
                <inline-svg
                  class="saab-icon-14"
                  fill="#24A148"
                  src="media/svg/saab/Save.svg"
                />
                <span class="ml-3">Save As Current Plan</span>
              </b-dropdown-item-button>
              <b-dropdown-item-button @click="SaveAsConcept">
                <inline-svg
                  class="saab-icon-14"
                  fill="#24A148"
                  src="media/svg/saab/Save.svg"
                />
                <span class="ml-3">Save As Concept</span>
              </b-dropdown-item-button>
            </b-dropdown>
          </div>
        </div>

        <!--end::Toolbar-->
      </div>
    </div>

    <div
      id="divBerthView"
      v-show="showdivfoot"
      class="col-12 p-0 m-0"
      style="margin: 0px auto; height: 95%; overflow: hidden"
    ></div>

    <b-modal
      id="modalMessage"
      size="xl"
      hide-footer
      title="Message"
      @hide="hideMessageModal"
    >
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
                  v-show="
                    item.isSuccessful &&
                    item.message[0].messageType == 'Information'
                  "
                  class="label label-inline label-success font-weight-bold"
                  >Successful</span
                >
                <span
                  v-show="
                    item.isSuccessful &&
                    item.message[0].messageType == 'Warning'
                  "
                  class="label label-inline label-warning font-weight-bold"
                  >Warning</span
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
    <b-modal id="conceptModal" hide-footer>
      <template #modal-header="{ close }">
        <span>
          <b-button size="sm" variant="outline-light-none" @click="close()">
            <i class="fa fa-times"></i>
          </b-button>
          <label>New Concept</label>
        </span>
        <span>
          <b-button
            size="sm"
            variant="primary"
            @click="NextSaveConcept()"
            class="mr-2"
            type="submit"
          >
            Next
          </b-button>
          <b-button size="sm" variant="outline-primary" @click="close">
            Cancel
          </b-button>
        </span>
      </template>
      <div class="form-group">
        <b-row class="my-4">
          <b-col sm="3" offset-sm="1">
            <label for="input-none">Concept Name</label>
          </b-col>
          <b-col sm="7">
            <b-form-input
              class="form-control"
              autofocus
              id="conceptName"
              v-model="conceptName"
              type="text"
              name="conceptName"
              placeholder="Enter concept name"
            ></b-form-input>
          </b-col>
        </b-row>
      </div>
      <div class="form-group">
        <b-row class="my-4">
          <b-col sm="3" offset-sm="1"> </b-col>
          <b-col sm="7">
            <b-form-checkbox
              size="lg"
              id="checkbox-1"
              v-model="saveWithConceptItems"
              name="checkbox-1"
            >
              Include Voyages
            </b-form-checkbox>
          </b-col>
        </b-row>
      </div>
    </b-modal>
    <b-modal id="conceptModalList" size="lg" hide-footer>
      <template #modal-header="{ close }">
        <span>
          <b-button size="sm" variant="outline-light-none" @click="close()">
            <i class="fa fa-times"></i>
          </b-button>
          <label>Concept List</label>
        </span>
      </template>
      <ConceptList :terminalId="terminalId"></ConceptList>
    </b-modal>

    <b-modal
      id="modalSOF"
      ref="modalsof"
      size="xl"
      hide-footer
      title="Statement of Facts (SOF)"
      @hide="hideSOFModal"
      v-model="modalShowSOF"
    >
      <VoyageSOF
        v-show="modalShowSOF"
        :voyageId="voyageId"
        :terminalId="terminalId"
        ref="voyagesof"
      ></VoyageSOF>
    </b-modal>

    <b-modal
      id="modalSOFSVG"
      ref="modalsofsvg"
      title=""
      v-model="modalShowSOFSVG"
      size="lg"
      hide-footer
      centered
      content-class="shadow"
      header-class=" pb-8 ribbon ribbon-clip ribbon-left"
      body-class="pt-3"
    >
      <template #modal-title>
        <div class="ribbon-target" style="top: 12px">
          <span class="ribbon-inner bg-warning"></span>
          <span class="font-weight-bolder font-size-sm">
            {{ ScheduleItem.vessel.name }}</span
          >
          <span
            class="pl-2 font-weight-bold font-size-sm"
            style="color: #5a5959"
            >{{ ScheduleItem.voyageNoIn }}/{{ ScheduleItem.voyageNoOut }}</span
          >
        </div>
      </template>

      <VesselTimeLine
        v-show="modalShowSOFSVG"
        ref="VesselTimeLine1"
        :mUpdateScheduleByVoyageId="UpdateScheduleByVoyageId"
        :mUpdateScheduleBerthSideByVoyageId="UpdateScheduleBerthSideByVoyageId"
        :mDeleteScheduleByVoyageId="DeleteScheduleByVoyageId"
      ></VesselTimeLine>
    </b-modal>

    <KTStickyToolbar
      ref="StickyToolbar"
      :berthmodel="BerthChartModel"
      :berthPlanView="BerthPlanView"
      :currentDate="currentDate"
      :load_fdate="load_fdate"
      :load_tdate="load_tdate"
      :add_berthplanview_schedules="Add_BerthPlanView_Schedules"
      :AutoPlan="AutoPlan"
      :RefreshSetting="RefreshSetting"
      :berthUserSetting="BerthUserSetting"
      v-if="load_fdate"
    ></KTStickyToolbar>
    <KTQuickVesselProperty ref="quickVesselProperty"></KTQuickVesselProperty>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { berthmaker } from "@/assets/js/berthschedule/berthschedule.js";
import KTStickyToolbar from "@/view/pages/berthplanning/StickyToolbar.vue";
import KTQuickVesselProperty from "@/view/pages/berthplanning/QuickVesselProperty.vue";
import VoyageSOF from "@/components/SOF.vue";
import moment from "moment";
import { ImageSRC, NumberFormat } from "@/mixins.ts";
import VesselTimeLine from "./VesselTimeLine.vue";
import DatePicker from "vue2-datepicker";
import ConceptList from "./ConceptList.vue";
import "vue2-datepicker/index.css";
import {
  GETConceptChart,
  UPDATEConceptChart,
  ADDConceptChart,
  GETConceptList,
  ADDConceptItemByStartPosition,
  Delete_ConceptItem,
  AutoConceptPlan,
} from "@/core/services/store/concept.module";
import {
  GETVoyageProperty,
  GETBerthChart,
  GETBerthInit,
  ADDPlanByStartPosition,
  UPDATEBerthChart,
  AutoVoyageBerthPlan,
  GETBerthChartLineWindow,
  ADDConceptAsCurrentPlan,
  GetBerthChartScheduleByVoyageId,
} from "@/core/services/store/berthplanning.module";
import { Delete_VoyageSOF_Plan } from "@/core/services/store/voyagesof.module";
export default {
  components: {
    KTStickyToolbar,
    KTQuickVesselProperty,
    DatePicker,
    ConceptList,
    VesselTimeLine,
    VoyageSOF,
  },
  inject: ["showErrors", "showSuccess", "showWarning", "isStandalone"],
  mixins: [ImageSRC, NumberFormat],
  data: function () {
    return {
      svgDataObject: {
        eta: "ok",
      },
      msg: "Please Wait ...",
      loading: false,
      modalMessageData: [],
      conceptList: [],
      conceptMenus: [
        {
          text: "Current Plan",
          id: 0,
          type: "Real",
          icon: "flaticon-eye text-success",
          active: true,
        },
      ],
      conceptName: "",
      voyageId: 0,
      conceptItem: null,
      saveWithConceptItems: true,
      showdivfoot: false,
      EnableLinewindow: false,
      isCloseable: false,
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
      terminalId: 0,
      treevalue: null,
      currentDate: "",
      Title: "Current Plan",
      FilterDockText: "",
      FilterDateText: "",
      standalone: this.isStandalone,
      perioud: 21,
      loadDay: 7,
      LoadingPartial: false,
      load_fdate: null,
      load_tdate: null,
      modalShowSOF: false,
      IsDeletePlan: false,
      IsDeleteConceptItemPlan: false,
      ScheduleItem: null,
      modalShowSOFSVG: false,
    };
  },

  computed: {
    currentDateStr: function () {
      return moment(this.currentDate).format("DD MMM");
    },
    fromDate: function () {
      const td = new Date(
        moment(this.currentDate).format("YYYY-MM-DDTHH:mm:ss")
      );
      return moment(this.addDays(td, -this.perioud)).format(
        "YYYY-MM-DDTHH:mm:ss"
      );
    },
    toDate: function () {
      const td = new Date(
        moment(this.currentDate).format("YYYY-MM-DDTHH:mm:ss")
      );
      return moment(this.addDays(td, this.perioud)).format(
        "YYYY-MM-DDTHH:mm:ss"
      );
    },
    getActiveConcept: function () {
      return this.conceptMenus.find((item) => item.active === true);
    },
    ...mapGetters([
      "getBerthChartInit",
      "getBerthChart",
      "getVoyagePropery",
      "getPlanbyStartPosition",
      "getUpdateBerthChart",
      "getAutoVoyageBerthPlan",
      "getBerthChartErrors",
      "getBerthChartMessages",
      "getBerthChartLineWindow",
      "getConseptList",
      "getConceptChartErrors",
      "getConceptChart",
      "getUpdateConceptChart",
      "getAddConceptChart",
      "getAddConceptResultId",
      "getADDConceptAsCurrentPlan",
      "getConceptItembyStartPosition",
      "getAutoConceptPlan",
      "getVoyageSOFErrors",
      "getVoyageSOFMessages",
      "getberthchartschedulebyvoyageid",
    ]),
  },
  mounted() {
    this.getInit();
    this.$root.$on("bv::modal::hide", (bvEvent, modalId) => {
      if (modalId === "conceptModalList") {
        this.get_ConceptList(() => {
          this.Refresh_Click();
        });
      }
    });
  },

  methods: {
    clickActivePlan() {
      this.hideContextMenu();
    },
    showSOF() {
      this.hideContextMenu();
      this.modalShowSOF = true;
    },
    hideSOFModal() {
      this.Refresh_Click();
    },
    deleteSOFPlan() {
      this.$confirm({
        message: `Are you sure?`,
        button: {
          no: "No",
          yes: "Yes",
        },
        callback: (confirm) => {
          if (confirm) {
            this.hideContextMenu();
            const vm = this;
            vm.loading = true;
            const state = {
              id: this.ScheduleItem.id,
              rowVersion: this.ScheduleItem.rowVersion,
            };

            this.$store.dispatch(Delete_VoyageSOF_Plan, state).then(() => {
              const errors = this.getVoyageSOFErrors;
              if (errors.length > 0) {
                this.showErrors(errors);
                this.loading = false;
              } else {
                vm.showSuccess(this.getVoyageSOFMessages);
                vm.BerthPlanView.schedules =
                  this.BerthPlanView.schedules.filter(
                    (r) => r.name != this.ScheduleItem.name
                  );

                vm.BerthPlanView.refresh();
                vm.loading = false;
              }
            });
          }
        },
      });
    },
    getInit() {
      this.$store.dispatch(GETBerthInit).then(() => {
        const errors = this.getBerthChartErrors;
        if (errors.length > 0) {
          this.showErrors(errors);
        } else {
          var model = this.getBerthChartInit;
          let currentDate = new Date(model.currentDate);
          const cdate = moment(currentDate).format("YYYY/MM/DD");
          var LocalStorage_FilterDatetime = this.getLocalStorageDateTime();
          if (LocalStorage_FilterDatetime != null) {
            this.currentDate = LocalStorage_FilterDatetime.value;
          } else {
            this.currentDate = cdate;
          }
          this.docks = model.ports;
          if (this.docks.length > 0) {
            if (this.standalone && !this.dock) {
              this.dock = [this.docks[0].id];
              this.get_ConceptList();
              this.Refresh_Click();
            }
          }
        }
      });
    },
    applay_click() {
      this.get_ConceptList();
      this.Refresh_Click();
      this.closeFilter();
    },
    get_ConceptList(callback) {
      const filters = [
        {
          key: "active",
          value: true,
          operatorType: 1,
        },
      ];
      const state = {
        pageNo: 1,
        rowPerPage: 5,
        terminalId: Number(this.terminal.id),
        sorts: [{ sortBy: "Id", direction: 2 }],
        filters,
      };
      this.$store.dispatch(GETConceptList, state).then(() => {
        const errors = this.getConceptChartErrors;
        if (errors && errors.length > 0) {
          this.showErrors(errors);
        } else {
          this.conceptList = this.getConseptList;
          this.conceptMenus = [
            {
              text: "Current Plan",
              id: 0,
              type: "Real",
              icon: "flaticon2-correct text-success",
              active: true,
            },
          ];
          this.conceptList.items.forEach((c) => {
            this.conceptMenus.push({
              text: c.name,
              id: c.id,
              type: "Concept",
              icon: "flaticon-star text-warning",
              active: false,
            });
          });
        }
        if (callback) {
          callback();
        }
      });
    },

    //Refresh
    Refresh_Click() {
      if (this.dock == null) {
        this.showErrors([{ messageText: "Select a item" }]);
        return false;
      }

      if (this.loading) {
        return false;
      }

      this.EnableLinewindow = false;

      var vm = this;
      vm.loading = true;
      const objstore = this.$store;
      this.setLocalStorageDateTime(this.currentDate);

      const state = {
        fromDate: this.fromDate,
        toDate: this.toDate,
        terminalId: Number(this.dock),
        Id: this.getActiveConcept.id,
        startChartDate: this.fromDate,
        endChartDate: this.toDate,
        isPartialLoad: false,
      };
      this.terminalId = Number(this.dock);
      this.load_fdate = this.fromDate;
      this.load_tdate = this.toDate;

      const findDock = this.docks.find((i) => i.id == this.dock);

      this.FilterDockText = findDock.label;
      // this.FilterDateText = "[" + this.fromDateStr + "," + this.toDateStr + "]";
      this.FilterDateText = "[" + this.currentDateStr + "]";

      let fnAdrees = GETBerthChart;
      if (this.getActiveConcept.type === "Concept") {
        fnAdrees = GETConceptChart;
      }

      objstore.dispatch(fnAdrees, state).then(() => {
        let errors;
        if (this.getActiveConcept.type === "Concept") {
          errors = this.getConceptChartErrors;
        } else {
          errors = this.getBerthChartErrors;
        }

        if (errors.length > 0) {
          this.showErrors(errors);
          vm.loading = false;
        } else {
          this.showdivfoot = true;
          let model;

          if (this.getActiveConcept.type === "Concept") {
            model = this.getConceptChart;

            this.load_fdate = model.startDate;
            this.load_tdate = model.endDate;
          } else {
            model = this.getBerthChart;
          }

          //
          this.$nextTick(() => {
            this.CreateBerthChartModel(model);
            this.RenderChart();
          });

          vm.loading = false;
        }
      });
    },
    CreateBerthChartModel(model) {
      // var vm = this;
      this.BerthChartModel = null;
      this.BerthUserSetting = model.setting;

      this.BerthChartBerths = model.berths;
      this.BerthChartStartDate = model.startDate;
      this.BerthChartEndDate = model.endDate;

      if (this.getActiveConcept.type == "Concept") {
        const fdate = moment(this.BerthChartStartDate).format(
          "YYYY/MM/DD HH:mm"
        );
        const tdate = moment(this.BerthChartEndDate).format("YYYY/MM/DD HH:mm");
        //this.currentDate = [fdate, tdate];

        this.FilterDateText =
          "[" +
          moment(fdate).format("DD MMM") +
          "," +
          moment(tdate).format("DD MMM") +
          "]";
      }

      const Schedules = this.CreateBerthChartModel_Schedules(model);

      this.BerthChartModel = Schedules;
      this.MapSettingToChartconfig();
    },

    CreateBerthChartModel_Schedules(model) {
      // const vm = this;
      let Schedules = [];

      for (let i = 0; i < model.schedules.length; i++) {
        let itemSchedule = model.schedules[i];
        const Schedule = this.Create_BerthPlanView_Schedule(itemSchedule);
        Schedules.push(Schedule);
      }

      for (let i = 0; i < model.schedule_NoneWorkingZone.length; i++) {
        let itemSchedule = model.schedule_NoneWorkingZone[i];

        if (
          new Date(itemSchedule.startDate).getTime() <
          new Date(this.load_fdate).getTime()
        ) {
          itemSchedule.startDate = this.load_fdate;
        }

        if (
          new Date(itemSchedule.endDate).getTime() >
          new Date(this.load_tdate).getTime()
        ) {
          itemSchedule.endDate = this.load_tdate;
        }

        let Schedule = {
          id: itemSchedule.id,
          name: itemSchedule.name,
          IsMaintenance: true,
          moveLocked: true,
          operationTimeLocked: true,
          IsAllowSave: false,
          zIndex: 5,
          hideMenu: true,
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
          image:
            itemSchedule.reason == "Maintenance"
              ? "./media/berthschedule/maintenance.png"
              : "./media/berthschedule/none-working.png",
          eventHandler: function () {},
        };

        Schedules.push(Schedule);
      }

      return Schedules;
    },
    RenderChart() {
      var vm = this;
      const objstore = this.$store;

      const divBerthView = document.getElementById("divBerthView");
      if (this.BerthPlanView) {
        this.BerthPlanView.configuration = this.BerthChartConfiguration;
        this.BerthPlanView.schedules = this.BerthChartModel;
        this.BerthPlanView.refresh();
        setTimeout(() => {
          this.BerthPlanView.scrollTo(new Date(vm.currentDate));
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

      objcanvas.onclick = function () {
        setTimeout(() => {
          var contextMenu = document.getElementById("context-menu");
          contextMenu.classList.remove("visible");
        }, 100);
      };

      objcanvas.ondragover = function (event) {
        event.preventDefault();
      };

      objcanvas.ondrop = function (event) {
        var voyageId = event.dataTransfer.getData("voyageId");
        var terminalId = event.dataTransfer.getData("terminalId");
        const conceptId = event.dataTransfer.getData("conceptId");
        if (voyageId == null || voyageId == undefined || voyageId == 0) {
          return false;
        }

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
        // var voyageId = event.dataTransfer.getData("voyageId");
        // var terminalId = event.dataTransfer.getData("terminalId");
        // const conceptId = event.dataTransfer.getData("conceptId");
        const MyData = {
          terminalId: Number(terminalId),
          voyageId: Number(voyageId),
          startBollardId: Number(startBollardId),
          startDate: startDate,
          conceptId: Number(conceptId),
        };
        let adressfn = ADDPlanByStartPosition;
        if (vm.getActiveConcept.type == "Concept") {
          adressfn = ADDConceptItemByStartPosition;
        }
        objstore.dispatch(adressfn, MyData).then(() => {
          vm.loading = false;
          let errors;
          if (vm.getActiveConcept.type == "Concept") {
            errors = vm.getConceptChartErrors;
          } else {
            errors = vm.getBerthChartErrors;
          }

          if (errors.length > 0) {
            vm.showErrors(errors);
          } else {
            let model;
            if (vm.getActiveConcept.type == "Concept") {
              model = vm.getConceptItembyStartPosition;
            } else {
              model = vm.getPlanbyStartPosition;
            }
            vm.Add_BerthPlanView_Schedules(model);

            var msg = vm.getBerthChartMessages;
            if (msg.length > 0) {
              vm.showWarning(msg);
            }

            var stickyToolbar = vm.$refs.StickyToolbar;
            var quickUnPlanningVessel =
              stickyToolbar.$refs.quickUnPlanningVessel;
            quickUnPlanningVessel.removeFromModel(voyageId);
            vm.loading = false;
          }
        });
      };
    },

    Add_BerthPlanView_Schedules(itemSchedule) {
      let Schedule = this.Create_BerthPlanView_Schedule(itemSchedule);
      this.BerthPlanView.schedules.push(Schedule);
      this.BerthPlanView.refresh();
    },

    Create_BerthPlanView_Schedule(itemSchedule) {
      const vm = this;

      if (vm.getActiveConcept.type != "Concept") {
        itemSchedule = this.UpdateOutofFrame(itemSchedule);
      }

      let Operation = "";

      if (itemSchedule.vessel.vesselType == "ContainerShip") {
        let totalMove =
          Number(itemSchedule.voyageDetail.d20) +
          Number(itemSchedule.voyageDetail.d40) +
          Number(itemSchedule.voyageDetail.d45) +
          Number(itemSchedule.voyageDetail.l20) +
          Number(itemSchedule.voyageDetail.l40) +
          Number(itemSchedule.voyageDetail.l45) +
          Number(itemSchedule.voyageDetail.r20) +
          Number(itemSchedule.voyageDetail.r40) +
          Number(itemSchedule.voyageDetail.r45);

        Operation = "total move(s) " + this.NumberWithCommas(totalMove);
      } else {
        if (itemSchedule.voyageDetail.tonnage > 0) {
          Operation =
            this.NumberWithCommas(itemSchedule.voyageDetail.tonnage) + " tons";
        }
      }

      const Schedule = {
        id: itemSchedule.id,
        name: itemSchedule.name,
        rowVersion: itemSchedule.rowVersion,
        VoyageId: itemSchedule.voyageId,
        ConceptId: itemSchedule.conceptId,
        IsPlan: itemSchedule.isPlan,
        IsMaintenance: false,
        IsAllowSave: itemSchedule.isAllowSave,
        moveLocked: itemSchedule.moveLocked,
        operationTimeLocked: itemSchedule.operationTimeLocked,
        zIndex: 5,
        margin: itemSchedule.marginLeft,
        shippingLine: itemSchedule.lineName,
        agentName: itemSchedule.agentName,
        operations: Operation, //'15000 tons',ContainerShip
        D20: Number(itemSchedule.voyageDetail.d20),
        D40: Number(itemSchedule.voyageDetail.d40),
        D45: Number(itemSchedule.voyageDetail.d45),
        L20: Number(itemSchedule.voyageDetail.l20),
        L40: Number(itemSchedule.voyageDetail.l40),
        L45: Number(itemSchedule.voyageDetail.l45),
        R20: Number(itemSchedule.voyageDetail.r20),
        R40: Number(itemSchedule.voyageDetail.r40),
        R45: Number(itemSchedule.voyageDetail.r45),

        backgroundColor: itemSchedule.backgroundColor,
        foregroundColor: itemSchedule.foregroundColor,
        borderColor: itemSchedule.borderColor,
        borderThickness: itemSchedule.borderThickness,
        description: itemSchedule.description,
        startBollardId: itemSchedule.startBollardId,
        endBollardId: itemSchedule.endBollardId,
        startDate: new Date(itemSchedule.startDate),
        endDate: new Date(itemSchedule.endDate),
        voyageNoIn: itemSchedule.voyageNoIn,
        voyageNoOut: itemSchedule.voyageNoOut,
        side: itemSchedule.side,
        berthName: itemSchedule.berthName,
        plannedPortTime_PPT: itemSchedule.plannedPortTime_PPT,
        voyageBerthPlanId: itemSchedule.voyageBerthPlanId,
        voyageBerthPlanRowVersion: itemSchedule.voyageBerthPlanRowVersion,
        lineServiceName: itemSchedule.lineServiceName,
        IsMARKS: itemSchedule.isMARKS,
        VesselCallUpdateCount: itemSchedule.vesselCallUpdateCount,
        InboundHandlingUid: itemSchedule.inboundHandlingUid,
        InboundHandlingUpdateCount: itemSchedule.inboundHandlingUpdateCount,
        OutboundHandlingUid: itemSchedule.outboundHandlingUid,
        OutboundHandlingUpdateCount: itemSchedule.outboundHandlingUpdateCount,

        ETA: itemSchedule.eta,
        anchorage: itemSchedule.anchorage,
        berthDate: itemSchedule.berthDate,
        startOperation: itemSchedule.startOperation,
        endOperation: itemSchedule.endOperation,
        unberthDate: itemSchedule.unberthDate,
        fullaway: itemSchedule.fullaway,
        ETD: itemSchedule.etd,
        EPT: itemSchedule.ept,
        PortTime: itemSchedule.portTime,
        operationTime: itemSchedule.startLoadOperationDate,
        berthTime: itemSchedule.berthTime,
        VoyageStatusId: itemSchedule.voyageStatusId,
        VoyageStatus: itemSchedule.voyageStatus,
        StartBollardName: itemSchedule.startBollardName,
        endBollardName: itemSchedule.endBollardName,

        vessel: {
          id: itemSchedule.vessel.id,
          name: itemSchedule.vessel.name,
          foregroundColor: itemSchedule.vessel.foregroundColor,
          borderColor: itemSchedule.vessel.borderColor,
          length: itemSchedule.vessel.loa,
          LOA: itemSchedule.vessel.lenght,
          nationality: itemSchedule.vessel.nationality,
          vesselType: itemSchedule.vessel.vesselType,
          vesselTypeId: itemSchedule.vessel.vesselTypeId,
        },
        eventHandler: vm.eventHandlerMenu,
      };

      return Schedule;
    },

    UpdateScheduleByVoyageId(voyageId, callback) {
      var vm = this;
      const objstore = this.$store;
      const state = {
        VoyageId: Number(voyageId),
      };

      objstore.dispatch(GetBerthChartScheduleByVoyageId, state).then(() => {
        const errors = this.getBerthChartErrors;
        if (errors.length > 0) {
          this.showErrors(errors);
          callback(null);
        } else {
          this.hideContextMenu();
          var itemSchedule = this.getberthchartschedulebyvoyageid;
          itemSchedule = vm.Create_BerthPlanView_Schedule(itemSchedule);

          const startDate = new Date(itemSchedule.startDate);
          const endDate = new Date(itemSchedule.endDate);

          const load_fdate = new Date(this.load_fdate);
          const load_tdate = new Date(this.load_tdate);

          vm.BerthPlanView.schedules = this.BerthPlanView.schedules.filter(
            (r) => r.VoyageId != itemSchedule.VoyageId
          );

          if (
            (startDate >= load_fdate && startDate <= load_tdate) ||
            (endDate >= load_fdate && endDate <= load_tdate)
          ) {
            //AddToChart
            vm.BerthPlanView.schedules.push(itemSchedule);

            vm.BerthPlanView.scrollTo(new Date(itemSchedule.startDate));
          }
          vm.BerthPlanView.refresh();
          callback(itemSchedule);
        }
      });
    },

    UpdateScheduleBerthSideByVoyageId(voyageId, BerthSide) {
      //this.loading = true;
      var itemSchedule = this.BerthPlanView.schedules.find(
        (r) => r.VoyageId == voyageId
      );
      itemSchedule.side = BerthSide == 1 ? "Port" : "Starboard";
      this.BerthPlanView.refresh();
      //this.loading = false;
      return itemSchedule;
    },
    DeleteScheduleByVoyageId(voyageId) {
      //this.loading = true;
      //this.hideContextMenu();
      this.modalShowSOFSVG = false;
      this.BerthPlanView.schedules = this.BerthPlanView.schedules.filter(
        (r) => r.VoyageId != voyageId
      );
      this.BerthPlanView.refresh();
      //this.loading = false;
    },

    UpdateOutofFrame(itemSchedule) {
      if (
        new Date(itemSchedule.startDate).getTime() <
          new Date(this.load_fdate).getTime() ||
        new Date(itemSchedule.endDate).getTime() >
          new Date(this.load_tdate).getTime()
      ) {
        if (
          new Date(itemSchedule.startDate).getTime() <
          new Date(this.load_fdate).getTime()
        ) {
          itemSchedule.startDate = this.load_fdate;
        }

        if (
          new Date(itemSchedule.endDate).getTime() >
          new Date(this.load_tdate).getTime()
        ) {
          itemSchedule.endDate = this.load_tdate;
        }

        itemSchedule.moveLocked = true;
        itemSchedule.operationTimeLocked = true;
        itemSchedule.IsAllowSave = false;
      }
      return itemSchedule;
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
      //Config/Berth/Bollard
      let Configuration = {
        backgroundColor:
          this.prefixColor +
          this.BerthUserSetting.configuration.backgroundColor.replace("#", ""),
        zoom: 1,
        resizeTo: document.getElementById("divBerthView"),
        spriteSheet: "./media/berthschedule/spritesheet.json",
        assets: [
          "./media/berthschedule/none-working.png",
          "./media/berthschedule/maintenance.png",
        ],
        // Hide vertical scroll bar for continuous scrolling
        hideVerticalScroll: false,
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
          // bollardGridColor:0xDF1C1C,
          berthEndColor: 0xd7b100,
          showTitle: true,
          showDistance: false,
          //berthEndColor: 0xff9999,
          berths: Berths,
        },
        onscroll: function (event) {
          if (
            vm.BerthPlanView &&
            vm.getActiveConcept.type != "Concept" &&
            vm.LoadingPartial == false &&
            event.deltaY != 0
          ) {
            vm.hideContextMenu();
            vm.hideContextForm();

            //Scroll Down
            if (
              event.visibleEndTime.getTime() + 86400000 >
                vm.BerthPlanView.configuration.timeLine.endDate.getTime() &&
              event.deltaY < 0
            ) {
              vm.LoadPartialchart(true);
              // console.log("Down");
            }
            //Scroll Up
            else if (
              event.visibleStartTime.getTime() - 86400000 <
                vm.BerthPlanView.configuration.timeLine.startDate.getTime() &&
              event.deltaY > 0
            ) {
              vm.LoadPartialchart(false);
              //console.log("Up");
            }
          }
        },
        onLoadingComplete: function () {
          // Loading is completed here
          vm.BerthPlanView.scrollTo(new Date(vm.currentDate));
        },
      };

      this.BerthChartConfiguration = Configuration;
    },
    LoadPartialchart(scrollDown) {
      const vm = this;
      vm.LoadingPartial = true;
      vm.EnableLinewindow = false;
      vm.loading = true;
      const objstore = vm.$store;

      const startChartDate = moment(
        vm.BerthPlanView.configuration.timeLine.startDate
      ).format("YYYY-MM-DDTHH:mm:ss");
      const endChartDate = moment(
        vm.BerthPlanView.configuration.timeLine.endDate
      ).format("YYYY-MM-DDTHH:mm:ss");
      let fromDate;
      let toDate;
      let loadFromServer = false;

      if (scrollDown) {
        fromDate = moment(
          vm.BerthPlanView.configuration.timeLine.endDate
        ).format("YYYY-MM-DDTHH:mm:ss");
        const td = new Date(
          moment(vm.BerthPlanView.configuration.timeLine.endDate).format(
            "YYYY-MM-DDTHH:mm:ss"
          )
        );
        toDate = moment(vm.addDays(td, vm.loadDay)).format(
          "YYYY-MM-DDTHH:mm:ss"
        );

        if (new Date(toDate).getTime() > new Date(this.load_tdate).getTime()) {
          loadFromServer = true;
          this.load_tdate = toDate;
        }
      } else {
        toDate = moment(
          vm.BerthPlanView.configuration.timeLine.startDate
        ).format("YYYY-MM-DDTHH:mm:ss");
        const fd = new Date(
          moment(vm.BerthPlanView.configuration.timeLine.startDate).format(
            "YYYY-MM-DDTHH:mm:ss"
          )
        );
        fromDate = moment(vm.addDays(fd, -vm.loadDay)).format(
          "YYYY-MM-DDTHH:mm:ss"
        );

        if (
          new Date(fromDate).getTime() < new Date(this.load_fdate).getTime()
        ) {
          loadFromServer = true;
          this.load_fdate = fromDate;
        }
      }

      if (loadFromServer) {
        const state = {
          fromDate: fromDate,
          toDate: toDate,
          terminalId: Number(vm.dock),
          startChartDate: startChartDate,
          endChartDate: endChartDate,
          isPartialLoad: true,
        };

        objstore.dispatch(GETBerthChart, state).then(() => {
          const errors = vm.getBerthChartErrors;

          if (errors.length > 0) {
            vm.showErrors(errors);
            vm.loading = false;
          } else {
            const model = vm.getBerthChart;
            let Schedules = vm.CreateBerthChartModel_Schedules(model);

            Schedules.forEach((item) => {
              let find = false;
              for (let i = 0; i < vm.BerthPlanView.schedules.length; i++) {
                let itemChart = vm.BerthPlanView.schedules[i];
                if (String(itemChart.VoyageId) === String(item.VoyageId)) {
                  find = true;
                  vm.BerthPlanView.schedules[i] = item;
                  break;
                }
              }

              if (find == false) {
                vm.BerthPlanView.schedules.push(item);
              }
            });

            if (scrollDown) {
              const fd_New = new Date(
                moment(
                  vm.BerthPlanView.configuration.timeLine.startDate
                ).format("YYYY-MM-DDTHH:mm:ss")
              );

              let fromDate_New = moment(vm.addDays(fd_New, vm.loadDay)).format(
                "YYYY-MM-DDTHH:mm:ss"
              );

              vm.BerthPlanView.configuration.timeLine.startDate = new Date(
                fromDate_New
              );

              vm.BerthPlanView.configuration.timeLine.endDate = new Date(
                toDate
              );
            } else {
              const td_New = new Date(
                moment(vm.BerthPlanView.configuration.timeLine.endDate).format(
                  "YYYY-MM-DDTHH:mm:ss"
                )
              );

              let toDate_New = moment(vm.addDays(td_New, -vm.loadDay)).format(
                "YYYY-MM-DDTHH:mm:ss"
              );

              vm.BerthPlanView.configuration.timeLine.endDate = new Date(
                toDate_New
              );

              vm.BerthPlanView.configuration.timeLine.startDate = new Date(
                fromDate
              );
            }

            vm.BerthPlanView.refresh();

            vm.LoadingPartial = false;
            vm.loading = false;
          }
        });
      } else {
        if (scrollDown) {
          const fd_New = new Date(
            moment(vm.BerthPlanView.configuration.timeLine.startDate).format(
              "YYYY-MM-DDTHH:mm:ss"
            )
          );

          let fromDate_New = moment(vm.addDays(fd_New, vm.loadDay)).format(
            "YYYY-MM-DDTHH:mm:ss"
          );

          vm.BerthPlanView.configuration.timeLine.startDate = new Date(
            fromDate_New
          );

          vm.BerthPlanView.configuration.timeLine.endDate = new Date(toDate);
        } else {
          const td_New = new Date(
            moment(vm.BerthPlanView.configuration.timeLine.endDate).format(
              "YYYY-MM-DDTHH:mm:ss"
            )
          );

          let toDate_New = moment(vm.addDays(td_New, -vm.loadDay)).format(
            "YYYY-MM-DDTHH:mm:ss"
          );

          vm.BerthPlanView.configuration.timeLine.endDate = new Date(
            toDate_New
          );

          vm.BerthPlanView.configuration.timeLine.startDate = new Date(
            fromDate
          );
        }
        vm.BerthPlanView.refresh();

        vm.LoadingPartial = false;
        vm.loading = false;
      }

      //end
    },
    Add_BerthPlanView_LineWindow(model) {
      model.forEach((itemSchedule) => {
        let Schedule = {
          IsLineWindow: true,
          id: itemSchedule.id,
          name: itemSchedule.name,
          rowVersion: itemSchedule.rowVersion,
          companyLineServiceId: itemSchedule.companyLineServiceId,
          IsMaintenance: true,
          moveLocked: true,
          operationTimeLocked: true,
          skipCheck: true,
          zIndex: 1,
          hideMenu: true,
          IsAllowSave: false,

          //  hideBollards: true,
          //         hideStartTime: true,
          //         hideEndTime: true,
          //         hideDescription: true,

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
          // image: itemSchedule.image,
          image:
            itemSchedule.companyId == "0"
              ? "./media/berthschedule/ShippingLineDefault.png"
              : this.getCompanyImage(itemSchedule.companyId),
          eventHandler: function () {},
        };
        var find = this.BerthPlanView.configuration.assets.filter(
          (r) => r == Schedule.image
        );

        if (find.length == 0) {
          this.BerthPlanView.configuration.assets.push(Schedule.image);
        }

        this.BerthPlanView.schedules.push(Schedule);
      });

      this.BerthPlanView.refresh();
    },

    AutoPlan(param) {
      this.loading = true;
      var vm = this;
      const objstore = this.$store;

      let fnAdrees = AutoVoyageBerthPlan;
      if (this.getActiveConcept.type === "Concept") {
        fnAdrees = AutoConceptPlan;
      }

      const MyData = {
        terminalId: Number(param.DockId),
        voyageId: Number(param.VoyageId),
        lineId: Number(param.VesselLineId),
        chartStartDate: param.planStartDate,
        chartEndDate: param.planEndDate,
        conceptId: Number(this.getActiveConcept.id),
      };

      objstore.dispatch(fnAdrees, MyData).then(() => {
        let errors;
        if (this.getActiveConcept.type === "Concept") {
          errors = this.getConceptChartErrors;
        } else {
          errors = this.getBerthChartErrors;
        }

        if (errors.length > 0) {
          vm.showErrors(errors);
          vm.loading = false;
        } else {
          let model;
          if (this.getActiveConcept.type === "Concept") {
            model = vm.getAutoConceptPlan;
          } else {
            model = vm.getAutoVoyageBerthPlan;
          }

          vm.Add_BerthPlanView_Schedules(model);

          var msg = vm.getBerthChartMessages;
          if (msg.length > 0) {
            vm.showWarning(msg);
          }

          var stickyToolbar = vm.$refs.StickyToolbar;
          var quickUnPlanningVessel = stickyToolbar.$refs.quickUnPlanningVessel;
          quickUnPlanningVessel.removeFromModel(param.VoyageId);
          vm.loading = false;
        }
      });
    },
    eventHandlerMenu(event, call) {
      this.voyageId = parseInt(call.VoyageId);
      this.conceptItem = {
        Id: parseInt(call.id),
        rowVersion: call.rowVersion,
      };
      this.ScheduleItem = this.BerthPlanView.schedules.find(
        (r) => r.name === call.name
      );

      const isConcept = this.getActiveConcept.type === "Concept" ? true : false;

      if (isConcept == false) {
        this.modalShowSOFSVG = true;
      }
      // this.modalShowSOFSVG = true;

      this.$nextTick(() => {
        if (isConcept == false) {
          const VesselTimeLine1 = this.$refs.VesselTimeLine1;
          if (VesselTimeLine1.refreshData) {
            VesselTimeLine1.refreshData(this.ScheduleItem, this.voyageId);
          }
        }

        // if (call.IsPlan == true) {
        //   this.IsDeletePlan = true;
        // } else {
        //   this.IsDeletePlan = false;
        // }

        if (isConcept == true && call.IsPlan == true) {
          this.IsDeleteConceptItemPlan = true;
        } else {
          this.IsDeleteConceptItemPlan = false;
        }
      });
      if (isConcept == true) {
        var contextMenu = document.getElementById("context-menu");
        var _a = event.data.originalEvent,
          mouseX = _a.clientX - 10,
          mouseY = _a.clientY - 10;
        var _b = this.normalizePosition(mouseX, mouseY),
          normalizedX = _b.normalizedX, // 200 for view center
          normalizedY = _b.normalizedY;
        contextMenu.style.top = normalizedY + "px";
        contextMenu.style.left = normalizedX + "px";
        contextMenu.classList.add("visible");
      }
    },
    normalizePosition(mouseX, mouseY) {
      var scope = document.querySelector("body");
      var contextMenu = document.getElementById("context-menu");
      // ? compute what is the mouse position relative to the container element (scope)
      var _a = scope.getBoundingClientRect(),
        scopeOffsetX = _a.left,
        scopeOffsetY = _a.top;
      scopeOffsetX = scopeOffsetX < 0 ? 0 : scopeOffsetX;
      scopeOffsetY = scopeOffsetY < 0 ? 0 : scopeOffsetY;
      var scopeX = mouseX - scopeOffsetX;
      var scopeY = mouseY - scopeOffsetY;
      // ? check if the element will go out of bounds
      var outOfBoundsOnX = scopeX + contextMenu.clientWidth > scope.clientWidth;
      var outOfBoundsOnY =
        scopeY + contextMenu.clientHeight > scope.clientHeight;
      var normalizedX = mouseX;
      var normalizedY = mouseY;
      // ? normalize on X
      if (outOfBoundsOnX) {
        normalizedX =
          scopeOffsetX + scope.clientWidth - contextMenu.clientWidth;
      }
      // ? normalize on Y
      if (outOfBoundsOnY) {
        normalizedY =
          scopeOffsetY + scope.clientHeight - contextMenu.clientHeight;
      }
      return { normalizedX: normalizedX, normalizedY: normalizedY };
    },
    RefreshSetting(model) {
      this.BerthUserSetting = model;
      this.MapSettingToChartconfig();
      this.BerthPlanView.configuration = this.BerthChartConfiguration;
      this.BerthPlanView.refresh();
    },

    //Save
    Save_Click() {
      this.EnableLinewindow = false;
      var Schedules = this.BerthPlanView.schedules;
      var Model = [];
      for (var i = 0; i < Schedules.length; i++) {
        var item = Schedules[i];
        if (item.IsAllowSave == true && item.IsLineWindow != true) {
          var obj = {
            id: item.id,
            // id: item.name,
            VoyageId: item.VoyageId,
            ConceptId: item.ConceptId,
            IsPlan: item.IsPlan,
            StartBollardId: item.startBollardId,
            EndBollardId: item.endBollardId,
            StartDate: moment(item.startDate).format("YYYY-MM-DDTHH:mm:ss"),
            EndDate: moment(item.endDate).format("YYYY-MM-DDTHH:mm:ss"),

            IsMARKS: item.isMARKS,
            VesselCallUpdateCount: item.VesselCallUpdateCount,
            InboundHandlingUid: item.InboundHandlingUid,
            InboundHandlingUpdateCount: item.InboundHandlingUpdateCount,
            OutboundHandlingUid: item.OutboundHandlingUid,
            OutboundHandlingUpdateCount: item.OutboundHandlingUpdateCount,
            side: item.side,
          };
          Model.push(obj);
        }
      }

      if (Model.length == 0 && this.getActiveConcept.type != "Concept") {
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
              // terminalId: Number(this.dock.id),
              terminalId: Number(this.dock),
              model: Model,
              ConceptId: Number(this.getActiveConcept.id),
            };

            this.loading = true;
            let fnAdrees = UPDATEBerthChart;
            if (this.getActiveConcept.type === "Concept") {
              fnAdrees = UPDATEConceptChart;
            }
            this.$store.dispatch(fnAdrees, state).then(() => {
              let errors;
              if (this.getActiveConcept.type === "Concept") {
                errors = this.getConceptChartErrors;
              } else {
                errors = this.getBerthChartErrors;
              }

              if (errors.length > 0) {
                this.showErrors(errors);
                this.loading = false;
              } else {
                let result;
                if (this.getActiveConcept.type === "Concept") {
                  result = this.getUpdateConceptChart;
                } else {
                  result = this.getUpdateBerthChart;
                }

                this.modalMessageData = result;
                this.loading = false;
                this.$bvModal.show("modalMessage");
              }
            });
          }
        },
      });
    },
    SaveAsCurrent() {
      this.EnableLinewindow = false;
      var Schedules = this.BerthPlanView.schedules;
      var Model = [];
      for (var i = 0; i < Schedules.length; i++) {
        var item = Schedules[i];
        if (
          item.IsAllowSave == true &&
          item.IsPlan == true &&
          item.IsLineWindow != true
        ) {
          var obj = {
            id: item.id,
            VoyageId: item.VoyageId,
            ConceptId: item.ConceptId,
            IsPlan: item.IsPlan,
            StartBollardId: item.startBollardId,
            EndBollardId: item.endBollardId,
            StartDate: moment(item.startDate).format("YYYY-MM-DDTHH:mm:ss"),
            EndDate: moment(item.endDate).format("YYYY-MM-DDTHH:mm:ss"),
            IsMARKS: item.isMARKS,
            VesselCallUpdateCount: item.VesselCallUpdateCount,
            InboundHandlingUid: item.InboundHandlingUid,
            InboundHandlingUpdateCount: item.InboundHandlingUpdateCount,
            OutboundHandlingUid: item.OutboundHandlingUid,
            OutboundHandlingUpdateCount: item.OutboundHandlingUpdateCount,
            side: item.side,
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
              terminalId: Number(this.dock),
              model: Model,
              ConceptId: Number(this.getActiveConcept.id),
            };
            this.loading = true;
            this.$store.dispatch(ADDConceptAsCurrentPlan, state).then(() => {
              const errors = this.getBerthChartErrors;
              if (errors.length > 0) {
                this.showErrors(errors);
                this.loading = false;
              } else {
                const result = this.getADDConceptAsCurrentPlan;
                this.modalMessageData = result;
                this.loading = false;
                this.$bvModal.show("modalMessage");
              }
            });
          }
        },
      });
    },

    SaveAsConcept() {
      this.$bvModal.show("conceptModal");
    },
    NextSaveConcept() {
      this.$bvModal.hide("conceptModal");
      this.EnableLinewindow = false;
      var Schedules = this.BerthPlanView.schedules;
      var Model = [];
      for (var i = 0; i < Schedules.length; i++) {
        var item = Schedules[i];
        if (
          item.IsAllowSave == true &&
          item.IsPlan == true &&
          item.IsLineWindow != true
        ) {
          var obj = {
            id: item.id,
            VoyageId: item.VoyageId,
            ConceptId: item.ConceptId,
            IsPlan: item.IsPlan,
            StartBollardId: item.startBollardId,
            EndBollardId: item.endBollardId,
            StartDate: moment(item.startDate).format("YYYY-MM-DDTHH:mm:ss"),
            EndDate: moment(item.endDate).format("YYYY-MM-DDTHH:mm:ss"),

            IsMARKS: item.isMARKS,
            VesselCallUpdateCount: item.VesselCallUpdateCount,
            InboundHandlingUid: item.InboundHandlingUid,
            InboundHandlingUpdateCount: item.InboundHandlingUpdateCount,
            OutboundHandlingUid: item.OutboundHandlingUid,
            OutboundHandlingUpdateCount: item.OutboundHandlingUpdateCount,
            side: item.side,
          };
          Model.push(obj);
        }
      }
      const state = {
        terminalId: Number(this.dock),
        model: Model,
        ConceptName: this.conceptName,
        StartDate: this.load_fdate,
        EndDate: this.load_tdate,
        saveWithConceptItems: this.saveWithConceptItems,
      };

      this.loading = true;

      this.$store.dispatch(ADDConceptChart, state).then(() => {
        const errors = this.getConceptChartErrors;
        this.loading = false;
        if (errors.length > 0) {
          this.showErrors(errors);
        } else {
          const result = this.getAddConceptChart;
          const id = this.getAddConceptResultId;
          this.modalMessageData = result;
          this.$bvModal.show("modalMessage");
          const me = this;
          this.get_ConceptList(() => {
            me.conceptMenus.forEach((r) => {
              if (Number(r.id) === Number(id)) {
                r.active = true;
              } else {
                r.active = false;
              }
            });

            me.Refresh_Click();
          });
        }
      });
    },
    //Delete
    DeleteConceptItem() {
      this.hideContextMenu();
      const state = {
        conceptItemId: this.conceptItem.Id,
        rowVersion: this.conceptItem.rowVersion,
      };
      this.loading = true;
      this.$store.dispatch(Delete_ConceptItem, state).then(() => {
        this.loading = false;
        const errors = this.getConceptChartErrors;
        if (errors.lenght > 0) {
          this.showErrors(errors);
        } else {
          this.BerthPlanView.schedules = this.BerthPlanView.schedules.filter(
            (r) => r.id != this.conceptItem.Id
          );
          this.BerthPlanView.refresh();
        }
      });
    },

    //Other Function
    hideContextMenu(e) {
      const contextMenu = document.getElementById("context-menu");
      if (contextMenu) {
        if (e) {
          if (e.target.offsetParent != contextMenu) {
            contextMenu.classList.remove("visible");
          }
        } else {
          contextMenu.classList.remove("visible");
        }
      }
    },
    hideContextForm(e) {
      const contextMenu = document.getElementById("context-from");
      if (contextMenu) {
        if (e) {
          if (e.target.offsetParent != contextMenu) {
            contextMenu.classList.remove("visible");
          }
        } else {
          contextMenu.classList.remove("visible");
        }
      }
    },

    changeConcept(item) {
      this.conceptMenus.forEach((c) => {
        if (c.id === item.id) c.active = true;
        else c.active = false;
      });

      this.closeFilter();
      this.Refresh_Click();
    },
    setLocalStorageDateTime(filterDatetime) {
      if (this.getActiveConcept.type === "Concept") {
        return false;
      }

      var obj = window.localStorage.getItem("BerthChartDateTime");
      var mydata = {
        value: filterDatetime,
        expiredate: new Date().getTime(),
      };

      if (obj != null) {
        localStorage.removeItem("BerthChartDateTime");
      }

      localStorage.setItem("BerthChartDateTime", JSON.stringify(mydata));
    },
    getLocalStorageDateTime() {
      var obj = window.localStorage.getItem("BerthChartDateTime");
      if (obj != null) {
        var model = JSON.parse(obj);
        // two mins - (1000 * 60 * 20) would be 20 mins
        // var expiryTime = new Date().getTime() - 1000 * 60 * 2;
        var expiryTime = new Date().getTime() - 1000 * 60 * 120;
        if (model.expiredate && parseInt(model.expiredate) < expiryTime) {
          return null;
        } else {
          return model;
        }
      } else {
        return null;
      }
    },
    ShowVoyageInfo() {
      let source = { VoyageId: this.voyageId };
      this.ShowVesselProperty("eventName", source);
      setTimeout(function () {
        const contextMenu = document.getElementById("context-menu");
        contextMenu.classList.remove("visible");
      });
    },
    ShowConceptList() {
      this.$bvModal.show("conceptModalList");
    },
    hideMessageModal() {
      //this.Refresh_Click();
    },
    closeFilter() {
      this.isCloseable = true;
      this.$refs.dropdown.hide();
    },
    normalizer(node) {
      if (node.children == null || node.children == "null") {
        delete node.children;
      }
    },
    handleFilterHide(bvEvent) {
      if (!this.isCloseable) {
        bvEvent.preventDefault();
      } else {
        this.$refs.dropdown.hide();
      }
    },
    ShowVesselProperty(eventName, source) {
      eventName = eventName + " ";
      this.loading = true;
      const objquickVesselProperty = this.$refs.quickVesselProperty;
      const state = {
        VoyageId: parseInt(source.VoyageId),
      };
      this.$store.dispatch(GETVoyageProperty, state).then(() => {
        const errors = this.getBerthChartErrors;
        if (errors.length > 0) {
          this.showErrors(errors);
        } else {
          var model = this.getVoyagePropery;
          let data = JSON.parse(JSON.stringify(model));
          objquickVesselProperty.SetData(data, Number(this.dock));
          objquickVesselProperty.openOffcanvas();
        }
      });
      this.loading = false;
    },
    addDays(date, days) {
      var result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    },
  },

  watch: {
    EnableLinewindow: function (val) {
      if (val) {
        if (this.dock == null || this.BerthPlanView == null) {
          this.showErrors([{ messageText: "Select a item" }]);
          return false;
        }

        if (this.loading) {
          return false;
        }
        var vm = this;
        vm.loading = true;
        const objstore = this.$store;
        this.setLocalStorageDateTime(this.currentDate);
        const state = {
          chartStartDate: this.load_fdate,
          chartEndDate: this.load_tdate,
          terminalId: Number(this.dock),
        };

        objstore.dispatch(GETBerthChartLineWindow, state).then(() => {
          const errors = this.getBerthChartErrors;
          if (errors.length > 0) {
            this.showErrors(errors);
            vm.loading = false;
          } else {
            var model = this.getBerthChartLineWindow;
            this.Add_BerthPlanView_LineWindow(model);
            vm.loading = false;
          }
        });
      } else {
        const findlinewindow = this.BerthPlanView.schedules.filter(
          (r) => r.IsLineWindow == true
        );

        findlinewindow.forEach((item) => {
          this.BerthPlanView.configuration.assets =
            this.BerthPlanView.configuration.assets.filter(
              (r) => r != item.image
            );
        });

        this.BerthPlanView.schedules = this.BerthPlanView.schedules.filter(
          (r) => r.IsLineWindow != true
        );

        this.BerthPlanView.refresh();
      }
    },
  },
};
</script>

<style scoped>
#context-menu {
  position: fixed;

  z-index: 10000;
  min-width: 408px;
  padding-left: 4px;
  padding-right: 4px;
  background-color: transparent;

  border-radius: 5px;
  transform: scale(0);
  transform-origin: top left;
}
.navi-item {
  background-color: #ffff;
}
#context-menu.visible {
  transform: scale(1);
  transition: transform 100ms ease-in-out;
}

#context-menu .item {
  padding: 8px 10px;
  font-size: 15px;
  color: #000000;
  font-weight: bold;
  cursor: pointer;
  border-radius: inherit;
  background-color: #fff;
}

#context-menu .item:hover {
  background: #343434;
}

#context-menu > .navi .navi-item .navi-link {
  color: #3f4254;
  font-weight: bold;
}
#context-menu > .navi {
  width: calc(100% - 24px) !important;
  margin-inline-start: 2px !important;
}

.currentplan {
  font-weight: 900;
}
.filterdate {
  width: 100%;
}
</style>
