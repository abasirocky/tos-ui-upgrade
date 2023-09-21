<template>
  <!-- style="height: calc(100% - 7px)" --> 
  <div id="div1" class="row h-100 w-100 p-0 m-0">
    <BlockUI v-if="loading" :message="msg">
      <i class="fa fa-spinner fa-spin fa-2x fa-fw"></i>
    </BlockUI>
    <vue-confirm-dialog></vue-confirm-dialog>

    <div class="subheader px-0 subheader-solid MySubheader" id="toolbar">
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
          <h5 class="font-weight-bolder text-dark mb-0 mr-1 MySubHeaderTitle">
            Berth View
          </h5>
 

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

          <ul
            class="
              breadcrumb breadcrumb-transparent breadcrumb-dot
              font-weight-bold
              p-0
              my-2
            "
          >
            <span class="text-muted">{{ FilterDockText }}</span>
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

            <span class="text-muted">{{ getActiveConcept.text }}</span>
          </ul>
        </div>

        <!--begin::Toolbar-->
        <div class="d-flex align-items-center">
          <!-- Start Find -->
          <button
            type="button"
            @click="ShowFindItem"
            class="
              btn
              font-weight-bold
              btn-sm
              mr-2
              p-0
              Mybtn-size1
              MySettingButton
            "
          >
            <i class="fas fa-search" title="find"></i>
          </button>
          <!-- End Find -->
          <!-- Start Setting -->
          <button
            type="button"
            @click="sidebarShowSetting = !sidebarShowSetting"
            class="
              btn
              font-weight-bold
              btn-sm
              mr-2
              p-0
              Mybtn-size1
              MySettingButton
            "
          >
            <i class="fas fa-sliders-h" title="setting"></i>
            <span class="sr-only" title="setting">Setting</span>
          </button>

          <!-- End Setting -->

          <!-- Start Refresh -->
          <button
            type="button"
            @click="Refresh_Click"
            class="
              btn btn-outline-primary
              font-weight-bold
              btn-sm
              mr-2
              Mybtn1-primary
              Mybtn-size1
            "
          >
            <i class="fas fa-sync-alt"></i>
            <span class="hideButtonTitle">REFRESH</span>
          </button>
          <!-- end Refresh -->
          <!-- start Current/Concept Plan/ -->
          <div class="d-flex align-items-center pr-0 mr-2">
            <b-dropdown
              split
              variant="outline-primary btn-sm Mybtn1-primary Mybtn-size1"
              size="sm"
              class="m-0 resizeWidthMobile"
              @show="clickActivePlan"
              style="min-width: 153px"
            >
              <template v-slot:button-content>
                <i
                  :class="
                    getActiveConcept.type == 'Concept'
                      ? 'far fa-window-restore'
                      : 'fas fa-list'
                  "
                ></i>
                <span
                  class="hideButtonTitle"
                  v-html="
                    getActiveConcept.type == 'Concept'
                      ? 'CONCEPT'
                      : 'CURRENT PLAN'
                  "
                  >---</span
                >
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
          <!-- end Current/Concept Plan/ -->

          <!-- Start Filter -->
          <button
            @click="modalShowFilter = true"
            :disabled="this.getActiveConcept.type === 'Concept'"
            type="button"
            class="
              btn btn-outline-primary
              font-weight-bold
              btn-sm
              mr-2
              Mybtn1-primary
              Mybtn-size1
            "
          >
            <i class="fa fa-filter icon-sm"></i>
            <span class="hideButtonTitle">FILTER</span>
          </button>
          <!-- End Filter -->

          <!-- start Save -->
          <div class="d-flex align-items-center pr-0">
            <b-dropdown
              split
              variant="outline-primary btn-sm Mybtn1-primary Mybtn-size1"
              size="sm"
              class="m-0"
              @click="Save_Click"
            >
              <template v-slot:button-content>
                <i class="fas fa-save"></i>
                <span class="hideButtonTitle">SAVE</span>
              </template>
              <b-dropdown-item-button
                v-if="getActiveConcept.type == 'Concept'"
                @click="SaveAsCurrent"
                class="saveMenu"
              >
                <i class="fas fa-save"></i>
                <span class="ml-3">Save As Current Plan</span>
              </b-dropdown-item-button>
              <b-dropdown-item-button @click="SaveAsConcept" class="saveMenu">
                <i class="fas fa-save"></i>
                <span class="ml-3">Save As Concept</span>
              </b-dropdown-item-button>
            </b-dropdown>
          </div>
          <!-- end Save -->
        </div>

        <!--end::Toolbar-->
      </div>
    </div>

    <div
      class="col-12 p-0 m-0 h-100"
      style="margin: 0px auto; overflow: hidden"
    >
      <BerthChartComponent
        ref="berthChart"
        @dropScheduleItem="dropScheduleItem"
        @clickData="bertChartClickData"
        @deleteSchedule="deleteSchedule"
      ></BerthChartComponent>
    </div>

    <!-- Start Modal Filter -->
    <b-modal
      id="modalFilter"
      ref="modalFilter"
      title
      v-model="modalShowFilter"
      size="sm"
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
        <treeselect
          id="treeDock"
          :normalizer="normalizer"
          :options="docks"
          v-model="dock"
          :multiple="false"
          placeholder="Select your item(s)..."
        ></treeselect>
      </b-form-group>

      <b-form-group label="Date" label-for="currentDate">
        <date-picker
          v-model="currentDate"
          name="currentDate"
          type="date"
          placeholder="Choose Date"
          format="YYYY/MM/DD"
          value-type="format"
          class="filterdate"
        ></date-picker>
      </b-form-group>
      <div style="text-align: right">
        <button
          @click="modalShowFilter = false"
          class="
            btn btn-outline-primary
            font-weight-bold
            btn-sm
            mx-2
            Mybtn1-primary
            Mybtn-size1
          "
        >
          <i class="fas fa-times"></i>
          CLOSE
        </button>

        <button
          @click="applay_click"
          class="
            btn btn-outline-primary
            font-weight-bold
            btn-sm
            mx-2
            Mybtn1-primary
            Mybtn-size1
          "
        >
          <i class="fas fa-check"></i>
          APPLY
        </button>
      </div>
    </b-modal>
    <!-- End Modal Filter -->

    <!-- Start Modal Message -->
    <b-modal
      id="modalMessage"
      size="xl"
      centered
      hide-footer
      title
      content-class="shadow"
      header-class=" pb-8 ribbon ribbon-clip ribbon-left"
      v-model="modalShowMessage"
    >
      <template #modal-title>
        <div class="ribbon-target" style="top: 12px">
          <span class="ribbon-inner bg-warning" />
          <span class="font-weight-bolder font-size-sm">Result</span>
        </div>
      </template>

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
    <!-- End Modal Message -->

    <!-- body-class="pt-3" -->
    <!-- Start Modal Concept -->
    <b-modal
      id="conceptModal"
      hide-footer
      size="sm"
      centered
      title
      content-class="shadow"
      header-class=" pb-8 ribbon ribbon-clip ribbon-left"
      v-model="modalShowConcept"
    >
      <template #modal-title>
        <div class="ribbon-target" style="top: 12px">
          <span class="ribbon-inner bg-warning" />
          <span class="font-weight-bolder font-size-sm">New Concept</span>
        </div>
      </template>

      <b-group label="Concept Name" label-for="conceptname">
        <b-form-input
          class="form-control form-group mb-0"
          autofocus
          maxlength="40"
          id="conceptname"
          v-model.trim="$v.conceptName.$model"
          type="text"
          name="conceptName"
          placeholder="Enter concept name"
          :state="$v.conceptName.$dirty ? !$v.conceptName.$anyError : null"
        ></b-form-input>

        <b-row>
          <b-col>
            <b-form-invalid-feedback
              :state="$v.conceptName.$dirty ? !$v.conceptName.$anyError : null"
              v-if="!$v.conceptName.required"
              >Field is required</b-form-invalid-feedback
            >
          </b-col>
        </b-row>
      </b-group>

      <b-group label label-for="chkIncludeVoyage">
        <b-form-checkbox
          size="lg"
          id="chkIncludeVoyage"
          v-model="saveWithConceptItems"
          name="checkbox-1"
          class="form-group pt-3"
          >Include Voyages</b-form-checkbox
        >
      </b-group>

      <div style="text-align: right">
        <button
          @click="modalShowConcept = false"
          class="
            btn btn-outline-primary
            font-weight-bold
            btn-sm
            mx-2
            Mybtn1-primary
            Mybtn-size1
          "
        >
          <i class="fas fa-times"></i>
          CLOSE
        </button>

        <button
          @click="NextSaveConcept()"
          class="
            btn btn-outline-primary
            font-weight-bold
            btn-sm
            mx-2
            Mybtn1-primary
            Mybtn-size1
          "
          type="submit"
        >
          NEXT
          <i class="fas fa-angle-double-right"></i>
        </button>
      </div>
    </b-modal>
    <!-- End Modal Concept -->

    <!-- Start Modal Concept List -->
    <b-modal
      id="conceptModalList"
      size="lg"
      hide-footer
      v-model="modalShowConceptList"
      centered
      title
      content-class="shadow"
      header-class=" pb-8 ribbon ribbon-clip ribbon-left"
    >
      <template #modal-title>
        <div class="ribbon-target" style="top: 12px">
          <span class="ribbon-inner bg-warning" />
          <span class="font-weight-bolder font-size-sm">Concept List</span>
        </div>
      </template>

      <ConceptList :terminalId="dock"></ConceptList>
    </b-modal>
    <!-- End Modal Concept List -->

    <!-- Start Modal SOF -->
    <b-modal
      id="modalSOFSVG1"
      ref="modalsofsvg1"
      title
      v-model="modalShowSOFSVG"
      size="lg"
      hide-footer
      centered
      content-class="shadow"
      header-class=" pb-8 ribbon ribbon-clip ribbon-left"
      body-class="pt-3"
    >
      <template #modal-title>
        <div v-if="currentSvgData" class="ribbon-target" style="top: 12px">
          <span class="ribbon-inner bg-warning" />
          <span class="font-weight-bolder font-size-sm">{{
            currentSvgData.vessel.name
          }}</span>
          <span
            class="pl-2 font-weight-bold font-size-sm"
            style="color: #5a5959"
            >{{ currentSvgData.voyage.voyageNoIn }}/{{
              currentSvgData.voyage.voyageNoOut
            }}</span
          >
        </div>
      </template>

      <!-- :ScheduleItem="currentSvgData" -->
      <VesselTimeLineSVG
        :VoyageId="currentSvgDataVoyageId"
        :ConceptId="currentSvgDataConceptId"
        :isReadOnly="VesselTimeLineIsReadOnly"
        :isConcept="VesselTimeLineIsConcept"
        v-show="modalShowSOFSVG"
        :mUpdateScheduleByVoyageId="UpdateScheduleByVoyageId"
        :mGetScheduleByVoyageId="GetScheduleByVoyageId"
        :mGetConceptItemByVoyageIdConceptId="GetConceptItemByVoyageIdConceptId"
        :mUpdateScheduleBerthSideByVoyageId="UpdateScheduleBerthSideByVoyageId"
        :mDeleteScheduleByVoyageId="DeleteScheduleByVoyageId"
      ></VesselTimeLineSVG>
    </b-modal>
    <!-- End Modal SOF -->

    <!-- start setting sidebar -->
    <b-sidebar
      v-model="sidebarShowSetting"
      title="Sidebar"
      right
      shadow
      z-index="99999"
      header
      footer
    >
      <template #header>
        <button
          @click="sidebarShowSetting = false"
          type="button"
          aria-label="Close"
          class="close text-dark"
        >
          <i class="fas fa-times"></i>
        </button>
        <strong class="font-weight-bolder font-size-h3">
          SETTING
          <i class="fas fa-sliders-h fa-1x pl-3 text-success"></i>
        </strong>
      </template>

      <div class="px-5 py-2 pt-10">
        <!-- <b-form-checkbox v-model="EnableLinewindow" switch
          >Show Line Window</b-form-checkbox
        > -->

        <div class="form-group row">
          <div class="col-lg-12">
            <b-form-checkbox v-model="EnableLinewindow" switch
              >Show Line Window</b-form-checkbox
            >
          </div>
        </div>

        <div class="form-group row">
          <div class="col-lg-12">
            <label>Bollard Scale</label>
            <b-form-input
              class="form-control"
              v-model.trim="BollardScale"
              type="range"
              min="2"
              max="40"
              step="1"
            ></b-form-input>
            <span>{{ BollardScale }}</span>
          </div>
        </div>

        <div class="form-group row">
          <div class="col-lg-12">
            <label>Time Scale</label>
            <b-form-input
              class="form-control"
              v-model.trim="TimeScale"
              type="range"
              min="2"
              max="40"
              step="1"
            ></b-form-input>
            <span>{{ TimeScale }}</span>
          </div>
        </div>
      </div>
    </b-sidebar>
    <!-- end setting sidebar -->

    <!-- start Find sidebar -->
    <b-sidebar
      v-model="sidebarShowFind"
      title="Sidebar"
      right
      backdrop
      shadow
      z-index="99999"
      header
      footer
    >
      <template #header>
        <button
          @click="sidebarShowFind = false"
          type="button"
          aria-label="Close"
          class="close text-dark"
        >
          <i class="fas fa-times"></i>
        </button>
        <strong class="font-weight-bolder font-size-h3">
          Find
          <i class="fas fa-search fa-1x pl-3 text-success"></i>
        </strong>
      </template>

      <div class="m-5">
        <b-input-group class="mt-0" size="sm">
          <b-form-input v-model="findChartItemText"></b-form-input>
          <b-input-group-append>
            <b-button variant="info" @click="FindChartItem()">Find</b-button>
          </b-input-group-append>
        </b-input-group>
      </div>

      <div
        v-for="(Item, index) in modelFindChartItems"
        class="my-2 field"
        :key="index"
        style="user-select: none; cursor: pointer"
        @click="findChartItemClick(Item)"
      >
        <div
          class="alert alert-primary ml-5 mr-5"
          :class="getvoyagestatusAlert(Item.voyage.VoyageStatusId)"
          role="alert"
        >
          <i class="fas fa-ship"></i>
          {{ Item.vessel.name }}&nbsp;({{ Item.voyage.voyageNoIn }}/
          {{ Item.voyage.voyageNoOut }})
        </div>
      </div>
    </b-sidebar>

    <!-- end Find sidebar -->

    <KTStickyToolbar
      ref="StickyToolbar"
      @zoomIn="zoomIn"
      @zoomOut="zoomOut"
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
import VesselTimeLineSVG from "./VesselTimeLine_SVG.vue";
import { mapGetters } from "vuex";
import KTStickyToolbar from "@/view/pages/berthplanning/StickyToolbar.vue";
import KTQuickVesselProperty from "@/view/pages/berthplanning/QuickVesselProperty.vue";
import moment from "moment";
import { ImageSRC, NumberFormat, EnumColors } from "@/mixins.ts";
import DatePicker from "vue2-datepicker";
import ConceptList from "./ConceptList.vue";
import "vue2-datepicker/index.css";
import BerthChartComponent from "@/view/pages/berthing/BerthChartComponent.vue";
import { required } from "vuelidate/lib/validators";

import {
  GETConceptChart,
  UPDATEConceptChart,
  ADDConceptChart,
  GETConceptList,
  ADDConceptItemByStartPosition,
  Delete_ConceptItem,
  AutoConceptPlan,
  GetConceptItemByVoyageId,
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
    BerthChartComponent,
    VesselTimeLineSVG,
  },
  inject: ["showErrors", "showSuccess", "showWarning", "isStandalone"],
  mixins: [ImageSRC, NumberFormat, EnumColors],
  data: function() {
    return {
      currentSvgData: null,
      currentSvgDataVoyageId: 0,
      currentSvgDataConceptId: 0,
      currentSvgComponent: null,
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
      // isCloseable: false,
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
      modalShowFilter: false,
      modalShowMessage: false,
      modalShowConcept: false,
      modalShowConceptList: false,
      sidebarShowSetting: false,
      sidebarShowFind: false,
      VesselTimeLineIsReadOnly: false,
      VesselTimeLineIsConcept: false,

      modelFindChartItems: [],
      findChartItemText: "",
      BollardScale: 0,
      TimeScale: 0,
    };
  },

  computed: {
    currentDateStr: function() {
      return moment(this.currentDate).format("DD MMM");
    },
    fromDate: function() {
      const td = new Date(
        moment(this.currentDate).format("YYYY-MM-DDTHH:mm:ss")
      );
      return moment(this.addDays(td, -this.perioud)).format(
        "YYYY-MM-DDTHH:mm:ss"
      );
    },
    toDate: function() {
      const td = new Date(
        moment(this.currentDate).format("YYYY-MM-DDTHH:mm:ss")
      );
      return moment(this.addDays(td, this.perioud)).format(
        "YYYY-MM-DDTHH:mm:ss"
      );
    },
    getActiveConcept: function() {
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
      "getconceptitembyVoyageId",
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
    findChartItemClick(item) {
      const berthchart = this.$refs.berthChart;
      const layer = berthchart.layers.find(
        (layer) => layer.schedule.id === item.id
      );

      if (layer) {
        berthchart.scrollToLayer(layer);
      }
    },
    zoomIn() {
      const berthchart = this.$refs.berthChart;
      berthchart.zoomIn();
    },
    zoomOut() {
      const berthchart = this.$refs.berthChart;
      berthchart.zoomOut();
    },
    deleteSchedule(schedule) {
      if (schedule.isConcept) {
        this.DeleteConceptItem(schedule);
      } else {
        this.deleteSOFPlan(schedule);
      }
    },
    bertChartClickData(data) {
      this.currentSvgComponent = data;
      this.currentSvgData = data._data.model.schedule;
      this.currentSvgDataVoyageId = Number(
        data._data.model.schedule.voyage.voyageId
      );
      this.currentSvgDataConceptId = Number(this.getActiveConcept.id);

      if (this.getActiveConcept.type == "Concept") {
        this.VesselTimeLineIsReadOnly = false;
        this.VesselTimeLineIsConcept = true;
      } else {
        this.VesselTimeLineIsReadOnly = false;
        this.VesselTimeLineIsConcept = false;
      }

      this.modalShowSOFSVG = true;
    },
    dropScheduleItem(data) {
      const voyageId = data.event.dataTransfer.getData("voyageId");
      const terminalId = data.event.dataTransfer.getData("terminalId");
      const conceptId = data.event.dataTransfer.getData("conceptId");
      if (voyageId == null || voyageId == undefined || voyageId == 0) {
        return false;
      }
      const vm = this;
      const startBollardId = data.startBollard.id;
      const startDatePlan = data.startDatePlan;
      const startDate = moment(startDatePlan).format("YYYY-MM-DDTHH:mm:ss");
      // if (
      //   startDatePlan < bp.configuration.timeLine.startDate ||
      //   startDatePlan > bp.configuration.timeLine.endDate
      // ) {
      //   vm.showErrors([{ messageText: "you can not plan this position" }]);
      // }

      const chartModel = this.getChartModel();
      if (
        startDatePlan < chartModel.startDate ||
        startDatePlan > chartModel.endDate
      ) {
        vm.showErrors([
          {
            messageText: "you can not plan this position",
          },
        ]);
      }

      data.event.preventDefault();
      vm.loading = true;
      const objstore = this.$store;
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
          var quickUnPlanningVessel = stickyToolbar.$refs.quickUnPlanningVessel;
          quickUnPlanningVessel.removeFromModel(voyageId);
          vm.loading = false;
        }
      });
    },
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

    deleteSOFPlan(schedule) {
      this.$confirm({
        message: `Are you sure?`,
        button: {
          no: "No",
          yes: "Yes",
        },
        callback: (confirm) => {
          if (confirm) {
            const vm = this;

            vm.loading = true;
            const state = {
              id: schedule.id,
              rowVersion: schedule.rowVersion,
            };

            this.$store.dispatch(Delete_VoyageSOF_Plan, state).then(() => {
              const errors = this.getVoyageSOFErrors;
              if (errors.length > 0) {
                this.showErrors(errors);
                this.loading = false;
              } else {
                vm.showSuccess(this.getVoyageSOFMessages);

                const dataModel = vm.getChartModel();
                dataModel.schedules = dataModel.schedules.filter(
                  (r) => r.voyage.voyageId != schedule.voyage.voyageId
                );
                vm.setChartModel(dataModel);
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
      this.modalShowFilter = false;
      // this.closeFilter();
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
        terminalId: Number(this.dock),
        sorts: [
          {
            sortBy: "Id",
            direction: 2,
          },
        ],
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

    Refresh_Click() {
      if (this.dock == null) {
        this.showErrors([
          {
            messageText: "Select a item",
          },
        ]);
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

          this.$nextTick(() => {
            this.CreateModelAndRenderBerthChart(model);
          });
          vm.loading = false;
        }
      });
    },

    CreateModelAndRenderBerthChart(model) {
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

        this.FilterDateText =
          "[" +
          moment(fdate).format("DD MMM") +
          "," +
          moment(tdate).format("DD MMM") +
          "]";
      }

      let Schedules = [];
      for (let i = 0; i < model.schedules.length; i++) {
        let itemSchedule = model.schedules[i];
        const Schedule = this.Create_BerthPlanView_ScheduleSVG(itemSchedule);
        Schedules.push(Schedule);
      }

      const BerthChartModel = {
        startDate: model.startDate,
        endDate: model.endDate,
        berths: model.berths,
        schedules: Schedules,
        schedule_NoneWorkingZone: model.schedule_NoneWorkingZone,
      };

      this.setChartModel(BerthChartModel);
    },

    Add_BerthPlanView_Schedules(itemSchedule) {
      let Schedule = this.Create_BerthPlanView_ScheduleSVG(itemSchedule);
      const dataModel = this.getChartModel();
      dataModel.schedules.push(Schedule);
      this.setChartModel(dataModel);
    },

    getChartModel() {
      const berthchart = this.$refs.berthChart;
      const dataModel = berthchart.getDataModel();
      return dataModel;
    },
    setChartModel(BerthChartModel) {
      const berthchart = this.$refs.berthChart;
      berthchart.renderData(BerthChartModel);
    },

    Create_BerthPlanView_ScheduleSVG(itemSchedule) {
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
        rowVersion: itemSchedule.rowVersion,
        ConceptId: itemSchedule.conceptId,
        isConcept: itemSchedule.isConcept,
        // voyageBerthPlanId: itemSchedule.voyageBerthPlanId,
        // voyageBerthPlanRowVersion: itemSchedule.voyageBerthPlanRowVersion,
        IsPlan: itemSchedule.isPlan,
        IsAllowSave: itemSchedule.isAllowSave,
        moveLocked: itemSchedule.moveLocked,
        moveTimeLocked: itemSchedule.moveTimeLocked,
        isOutofRange:
          itemSchedule.isOutofRange == undefined ||
          itemSchedule.isOutofRange == null
            ? false
            : itemSchedule.isOutofRange,

        startDateOriginal:
          itemSchedule.startDateOriginal == undefined ||
          itemSchedule.startDateOriginal == null
            ? null
            : itemSchedule.startDateOriginal,

        startBollardId: itemSchedule.startBollardId,
        endBollardId: itemSchedule.endBollardId,
        StartBollardName: itemSchedule.startBollardName,
        endBollardName: itemSchedule.endBollardName,
        startDate: new Date(itemSchedule.startDate),
        endDate: new Date(itemSchedule.endDate),
        berthName: itemSchedule.berthName,
        description: itemSchedule.description,
        lineServiceName: itemSchedule.lineServiceName,
        voyage: {
          voyageId: itemSchedule.voyageId,
          voyageNoIn: itemSchedule.voyageNoIn,
          voyageNoOut: itemSchedule.voyageNoOut,
          VoyageStatusId: itemSchedule.voyageStatusId,
          VoyageStatus: itemSchedule.voyageStatus,
          side: itemSchedule.side,
          marginLeft: itemSchedule.marginLeft,
          marginRight: itemSchedule.marginRight,
          shippingLine: itemSchedule.lineName,
          agentName: itemSchedule.agentName,
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
        },
        vessel: {
          id: itemSchedule.vessel.id,
          name: itemSchedule.vessel.name,
          draft: itemSchedule.vessel.draft,
          loa: itemSchedule.vessel.loa,
          nationality: itemSchedule.vessel.nationality,
          vesselType: itemSchedule.vessel.vesselType,
          vesselTypeId: itemSchedule.vessel.vesselTypeId,
        },
        voyageDetails: {
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
        },
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
          var itemSchedule = this.getberthchartschedulebyvoyageid;
          itemSchedule = vm.Create_BerthPlanView_ScheduleSVG(itemSchedule);

          const startDate = new Date(itemSchedule.startDate);
          const endDate = new Date(itemSchedule.endDate);

          const load_fdate = new Date(this.load_fdate);
          const load_tdate = new Date(this.load_tdate);

          const dataModel = this.getChartModel();

          dataModel.schedules = dataModel.schedules.filter(
            (r) => r.voyage.voyageId != itemSchedule.voyage.voyageId
          );

          if (
            (startDate >= load_fdate && startDate <= load_tdate) ||
            (endDate >= load_fdate && endDate <= load_tdate)
          ) {
            //AddToChart
            dataModel.schedules.push(itemSchedule);
            //vm.BerthPlanView.scrollTo(new Date(itemSchedule.startDate));
          }

          //berthchart.renderData(dataModel);
          // this.currentSvgComponent.updateModel(itemSchedule);
          this.setChartModel(dataModel);
          callback(itemSchedule);
        }
      });
    },

    GetScheduleByVoyageId(voyageId, callback) {
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
          var itemSchedule = this.getberthchartschedulebyvoyageid;
          itemSchedule = vm.Create_BerthPlanView_ScheduleSVG(itemSchedule);
          callback(itemSchedule);
        }
      });
    },

    GetConceptItemByVoyageIdConceptId(voyageId, conceptId, callback) {
      var vm = this;
      const objstore = this.$store;
      const state = {
        VoyageId: Number(voyageId),
        conceptId: Number(conceptId),
      };

      objstore.dispatch(GetConceptItemByVoyageId, state).then(() => {
        const errors = this.getConceptChartErrors;
        if (errors.length > 0) {
          this.showErrors(errors);
          callback(null);
        } else {
          var itemSchedule = this.getconceptitembyVoyageId;
          itemSchedule = vm.Create_BerthPlanView_ScheduleSVG(itemSchedule);
          callback(itemSchedule);
        }
      });
    },

    UpdateScheduleBerthSideByVoyageId(voyageId, BerthSide) {
      const dataModel = this.getChartModel();
      var itemSchedule = dataModel.schedules.find(
        (r) => r.voyage.voyageId == voyageId
      );
      itemSchedule.voyage.side = BerthSide == 1 ? "Port" : "Starboard";
      this.setChartModel(dataModel);
      return itemSchedule;
    },
    DeleteScheduleByVoyageId(voyageId) {
      this.modalShowSOFSVG = false;

      const dataModel = this.getChartModel();

      dataModel.schedules = dataModel.schedules.filter(
        (r) => r.voyage.voyageId != voyageId
      );

      this.setChartModel(dataModel);
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
          itemSchedule.startDateOriginal = itemSchedule.startDate;
          itemSchedule.startDate = this.load_fdate;
        }

        if (
          new Date(itemSchedule.endDate).getTime() >
          new Date(this.load_tdate).getTime()
        ) {
          itemSchedule.endDate = this.load_tdate;
        }

        itemSchedule.moveLocked = true;
        itemSchedule.moveTimeLocked = true;
        itemSchedule.IsAllowSave = false;
        itemSchedule.isOutofRange = true;
      }
      return itemSchedule;
    },

    RemovwLineWindows() {
      const berthchart = this.$refs.berthChart;
      berthchart.removeLineWindows();
    },

    Add_BerthPlanView_LineWindow(model) {
      const lineWindows = [];
      model.forEach((itemSchedule) => {
        const Schedule = this.Add_BerthPlanView_LineWindowItem(itemSchedule);
        lineWindows.push(Schedule);
      });

      const berthchart = this.$refs.berthChart;
      berthchart.showLineWindows(lineWindows);
    },

    Add_BerthPlanView_LineWindowItem(itemSchedule) {
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
        readonly: true,
        image:
          itemSchedule.companyId == "0"
            ? "./media/berthschedule/ShippingLineDefault.png"
            : this.getCompanyImage(itemSchedule.companyId),
      };
      return Schedule;
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
    eventHandlerMenu999999(event, call) {
      this.voyageId = parseInt(call.VoyageId);
      this.conceptItem = {
        Id: parseInt(call.id),
        rowVersion: call.rowVersion,
      };
      this.ScheduleItem = this.BerthPlanView.schedules.find(
        (r) => r.name === call.name
      );

      this.modalShowSOFSVG = true;

      this.$nextTick(() => {
        if (call.IsPlan == true) {
          this.IsDeletePlan = true;
        } else {
          this.IsDeletePlan = false;
        }

        if (this.getActiveConcept.type === "Concept" && call.IsPlan == true) {
          this.IsDeleteConceptItemPlan = true;
        } else {
          this.IsDeleteConceptItemPlan = false;
        }
      });

      // var contextMenu = document.getElementById("context-menu");
      // var _a = event.data.originalEvent,
      //   mouseX = _a.clientX - 10,
      //   mouseY = _a.clientY - 10;
      // var _b = this.normalizePosition(mouseX, mouseY),
      //   normalizedX = _b.normalizedX, // 200 for view center
      //   normalizedY = _b.normalizedY;
      // contextMenu.style.top = normalizedY + "px";
      // contextMenu.style.left = normalizedX + "px";
      // contextMenu.classList.add("visible");
    },
    normalizePosition9999(mouseX, mouseY) {
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
      return {
        normalizedX: normalizedX,
        normalizedY: normalizedY,
      };
    },
    RefreshSetting(model) {
      this.BerthUserSetting = model;
      this.BerthPlanView.configuration = this.BerthChartConfiguration;
      this.BerthPlanView.refresh();
    },

    //Save

    Save_Click() {
      this.EnableLinewindow = false;
      const dataModel = this.getChartModel();
      var Schedules = dataModel.schedules;

      var Model = [];
      for (var i = 0; i < Schedules.length; i++) {
        var item = Schedules[i];
        if (item.IsAllowSave == true) {
          var obj = {
            id: item.id,
            // id: item.name,
            VoyageId: item.voyage.voyageId,
            ConceptId: item.ConceptId,
            IsPlan: item.IsPlan,
            StartBollardId: item.startBollardId,
            EndBollardId: item.endBollardId,
            StartDate: moment(item.startDate).format("YYYY-MM-DDTHH:mm:ss"),
            EndDate: moment(item.endDate).format("YYYY-MM-DDTHH:mm:ss"),

            // IsMARKS: item.isMARKS,
            // VesselCallUpdateCount: item.VesselCallUpdateCount,
            // InboundHandlingUid: item.InboundHandlingUid,
            // InboundHandlingUpdateCount: item.InboundHandlingUpdateCount,
            // OutboundHandlingUid: item.OutboundHandlingUid,
            // OutboundHandlingUpdateCount: item.OutboundHandlingUpdateCount,
            side: item.voyage.side,
          };
          Model.push(obj);
        }
      }

      if (Model.length == 0 && this.getActiveConcept.type != "Concept") {
        this.showErrors([
          {
            messageText: "No data to save",
          },
        ]);
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
                // this.$bvModal.show("modalMessage");
                this.modalShowMessage = true;
              }
            });
          }
        },
      });
    },

    SaveAsCurrent() {
      this.EnableLinewindow = false;
      const dataModel = this.getChartModel();
      var Schedules = dataModel.schedules;
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
            VoyageId: item.voyage.voyageId,
            ConceptId: item.ConceptId,
            IsPlan: item.IsPlan,
            StartBollardId: item.startBollardId,
            EndBollardId: item.endBollardId,
            StartDate: moment(item.startDate).format("YYYY-MM-DDTHH:mm:ss"),
            EndDate: moment(item.endDate).format("YYYY-MM-DDTHH:mm:ss"),
            // IsMARKS: item.isMARKS,
            // VesselCallUpdateCount: item.VesselCallUpdateCount,
            // InboundHandlingUid: item.InboundHandlingUid,
            // InboundHandlingUpdateCount: item.InboundHandlingUpdateCount,
            // OutboundHandlingUid: item.OutboundHandlingUid,
            // OutboundHandlingUpdateCount: item.OutboundHandlingUpdateCount,
            side: item.voyage.side,
          };
          Model.push(obj);
        }
      }

      if (Model.length == 0) {
        this.showErrors([
          {
            messageText: "No data to save",
          },
        ]);
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
                // this.$bvModal.show("modalMessage");
                this.modalShowMessage = true;
              }
            });
          }
        },
      });
    },

    SaveAsConcept() {
      // this.$bvModal.show("conceptModal");
      this.modalShowConcept = true;
    },
    NextSaveConcept() {
      this.$v.$touch();

      if (this.$v.$anyError) {
        return;
      }

      // this.$bvModal.hide("conceptModal");
      this.modalShowConcept = false;
      this.EnableLinewindow = false;

      const dataModel = this.getChartModel();
      var Schedules = dataModel.schedules;
      // var Schedules = this.BerthPlanView.schedules;
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
            VoyageId: item.voyage.voyageId,
            ConceptId: item.ConceptId,
            IsPlan: item.IsPlan,
            StartBollardId: item.startBollardId,
            EndBollardId: item.endBollardId,
            StartDate: moment(item.startDate).format("YYYY-MM-DDTHH:mm:ss"),
            EndDate: moment(item.endDate).format("YYYY-MM-DDTHH:mm:ss"),

            // IsMARKS: item.isMARKS,
            // VesselCallUpdateCount: item.VesselCallUpdateCount,
            // InboundHandlingUid: item.InboundHandlingUid,
            // InboundHandlingUpdateCount: item.InboundHandlingUpdateCount,
            // OutboundHandlingUid: item.OutboundHandlingUid,
            // OutboundHandlingUpdateCount: item.OutboundHandlingUpdateCount,
            side: item.voyage.side,
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
          // this.$bvModal.show("modalMessage");
          this.modalShowMessage = true;
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
    DeleteConceptItem(schedule) {
      const state = {
        conceptItemId: schedule.id,
        rowVersion: schedule.rowVersion,
      };
      this.loading = true;
      this.$store.dispatch(Delete_ConceptItem, state).then(() => {
        this.loading = false;
        const errors = this.getConceptChartErrors;
        if (errors.lenght > 0) {
          this.showErrors(errors);
        } else {
          //  this.BerthPlanView.schedules = this.BerthPlanView.schedules.filter(
          //     (r) => r.id != this.conceptItem.Id
          //   );
          //   this.BerthPlanView.refresh();
          const dataModel = this.getChartModel();

          dataModel.schedules = dataModel.schedules.filter(
            (r) => r.id != schedule.id
          );

          this.setChartModel(dataModel);
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

      //this.closeFilter();
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
      let source = {
        VoyageId: this.voyageId,
      };
      this.ShowVesselProperty("eventName", source);
      setTimeout(function() {
        const contextMenu = document.getElementById("context-menu");
        contextMenu.classList.remove("visible");
      });
    },
    ShowConceptList() {
      // this.$bvModal.show("conceptModalList");
      this.modalShowConceptList = true;
    },
    // hideMessageModal() {
    //   //this.Refresh_Click();
    // },
    // closeFilter() {
    //   this.isCloseable = true;
    //   this.$refs.dropdown.hide();
    // },
    normalizer(node) {
      if (node.children == null || node.children == "null") {
        delete node.children;
      }
    },
    // handleFilterHide(bvEvent) {
    //   if (!this.isCloseable) {
    //     bvEvent.preventDefault();
    //   } else {
    //     this.$refs.dropdown.hide();
    //   }
    // },
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

    ShowFindItem() {
      this.sidebarShowFind = true;
      this.FindChartItem();
    },
    FindChartItem() {
      const dataModel = this.getChartModel();
      this.modelFindChartItems = dataModel.schedules.filter(
        (r) =>
          r.vessel.name
            .trim()
            .toUpperCase()
            .includes(this.findChartItemText.trim().toUpperCase()) ||
          r.voyage.voyageNoIn
            .trim()
            .toUpperCase()
            .includes(this.findChartItemText.trim().toUpperCase()) ||
          r.voyage.voyageNoOut
            .trim()
            .toUpperCase()
            .includes(this.findChartItemText.trim().toUpperCase())
      );
    },
  },

  watch: {
    EnableLinewindow: function(val) {
      if (val) {
        if (this.dock == null) {
          this.showErrors([
            {
              messageText: "Select a item",
            },
          ]);
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
        this.RemovwLineWindows();
      }
    },
  },

  // conceptName
  validations: {
    conceptName: {
      required,
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

.saveMenu > .dropdown-item > i {
  color: #024c93;
}
.saveMenu > .dropdown-item > span {
  font-size: 11px;
  font-weight: bold;
}

@media (max-width: 1036px) {
  .hideButtonTitle {
    display: none !important;
  }
}
@media (max-width: 1036px) {
  .resizeWidthMobile {
    min-width: unset !important;
  }
}

@media (max-width: 600px) {
  .MySubheader {
    padding: 0px 15px 10px 15px;
  }
}

@media (max-width: 991.98px) {
  .MySubheader {
    padding: 0px 15px 10px 15px;
  }
}

@media (max-width: 600px) {
  .subheader.subheader-solid {
    margin-bottom: 0px;
  }
}

@media (max-width: 991.98px) {
  .subheader.subheader-solid {
    margin-bottom: 0px;
  }
}

.voyageFindItem {
  border: 2px solid #919191 !important;
  background-color: #ffffff !important;
  cursor: hand;
}
.voyageFindItem:hover {
  background-color: #eeedee !important;
  border: 2px solid #666 !important;
}
</style>
