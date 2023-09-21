<template>
  <div style="height: 100%">
    <BlockUI v-if="this.isLoading" :message="msg">
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
            Berth Monitoring
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

          <span class="text-muted mb-0 mr-1">
            {{ FilterTerminalText }}
          </span>

          
        </div>

        <div class="d-flex gap-1">
        <!--begin::Toolbar-->

        
          <!-- Start Filter -->
          <button
            @click="modalShowFilter = true"
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
            FILTER
          </button>
          <!-- End Filter -->
        
        
        
        <div class="d-flex align-items-center">
          <!-- Start Refresh -->
          <button
            type="button"
            @click="RefreshHandler"
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
            REFRESH
          </button>
          <!-- end Refresh -->
          <!-- Start Filter -->
          <!-- End Filter -->
        </div>


        </div>

        <!--end::Toolbar-->
      </div>
    </div>

    <!-- Start Modal Filter -->
    <b-modal
      id="modalFilter"
      ref="modalFilter"
      title
      v-model="modalShowFilter"
      size="lg"
      hide-footer
      centered
      content-class="shadow"
      header-class=" pb-8 ribbon ribbon-clip ribbon-left"
      body-class="pt-3"
    >
      <template #modal-title>
        <div class="ribbon-target" style="top: 12px">
          <span class="ribbon-inner bg-warning" ></span>
          <span class="font-weight-bolder font-size-sm">Filter</span>
        </div>
      </template>
      <b-form-group label="Port" label-for="treeTerminal" @submit.stop.prevent>
        <treeselect
          :options="terminals"
          :value='terminal'
          @select="terminalSelectHandler"
          :multiple="false"
          placeholder="Select your item(s)..."
        >
        </treeselect>
      </b-form-group>

    </b-modal>
    <!-- End Modal Filter -->


    <div
      style="height: 95%;width: 100%; overflow-y: hidden; padding: 0"
    >
    <YardView :styleMap='styleMap' :terminals='terminals' :terminalId='terminalId' :terminal='terminal' :key='this.isPageRefreshing' />
  </div>

    <!-- Start Modal SOF -->
    <b-modal
      id="modalSOFSVG1"
      ref="modalsofsvg1"
      title
      v-model="modalShowSOFSVG"
      size="xl"
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
        :isReadOnly="true"
        :isConcept="false"
        :VoyageId="currentSvgDataVoyageId"
        :ConceptId="null"
        v-show="modalShowSOFSVG"
        :mUpdateScheduleByVoyageId="null"
        :mGetScheduleByVoyageId="GetScheduleByVoyageId"
        :mGetConceptItemByVoyageIdConceptId="null"
        :mUpdateScheduleBerthSideByVoyageId="null"
        :mDeleteScheduleByVoyageId="null"
      ></VesselTimeLineSVG>
    </b-modal>
    <!-- End Modal SOF -->
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";

import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import VesselTimeLineSVG from "../berthplanning/VesselTimeLine_SVG.vue";
import YardView from "@/components/YardView.vue";
import { NumberFormat } from "@/mixins.ts";
import {
  GETBerthInit,
  GetBerthChartScheduleByVoyageId,
} from "@/core/services/store/berthplanning.module";
import { GETSETTIONID } from "@/core/services/store/legacy-bridge.module";

export default {
  inject: ["showErrors", "showSuccess", "isStandalone"],
  mixins: [NumberFormat],
  components: {
    VesselTimeLineSVG,
    YardView
  },

  data: function() {
    return {
      styleMap: "height:100%;overflow-y: hidden",
      msg: "Please wait ...",
      loading: false,
      yardViewUrl: process.env.VUE_APP_BASE_YARDVIEW, //  "http://localhost:9000",
      apiurl: `${Vue.axios.defaults.baseURL}/system/TerminalMonitoring/getterminalmonitoring`,
      terminals: [],
      terminal: null,
      terminalId: null,
      src: null,
      standalone: this.isStandalone,
      modalShowFilter: false,
      FilterTerminalText: "",

      currentSvgData: null,
      currentSvgDataVoyageId: 0,
      modalShowSOFSVG: false,

      qualites: [
        {
          value: "high",
          text: "High Quality",
          style: "font-size:100px;",
        },
        {
          value: "medium",
          text: "Medium Quality",
        },
        { value: "low", text: "Low Quality" },
      ],
      // quality: "medium",
      quality: "high",
      customAttr: function() {
        return {
          style: "font-size:40px",
        };
      },
    };
  },
  computed: {
    ...mapGetters([
      "getBerthChartInit",
      "getBerthChart",
      "getPlanbyStartPosition",
      "getUpdateBerthChart",
      "getBerthChartErrors",
      "getBerthChartMessages",
      "getberthchartschedulebyvoyageid",
      "getLegacyErrors",
      "getLegacyMessages",
    ]),
    isLoading() {
      return this.$store.state.berthMonitoring.isLoading
    },
    isPageRefreshing() {
      return this.$store.state.berthMonitoring.isPageRefreshing
    }
    
  },
  mounted() {
    this.loading = true;
    // this.yardViewUrl = process.env.VUE_APP_BASE_YARDVIEW;
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Berth Monitoring" }]);
    this.getInit();
    // this.getSessionId();
  },
  watch: {
    terminal: function(val) {
      if (Array.isArray(val)) this.terminalId = val[0];
      else this.terminalId = val;

      // this.src = this.yardViewUrl + this.buildhref(this.terminalId);
    },
    terminalId: function(val) {
      if (Array.isArray(val)) this.terminalId = val[0];
      else this.terminalId = val;
    },
    quality: function(val) {
      this.quality = val;
      // this.src = this.yardViewUrl + this.buildhref(this.dockid);
    },
    $route: function(to) {
      if (to.query.code) {
        if (to.query.code != undefined && to.query.code != "undefined") {
          this.currentSvgDataVoyageId = Number(to.query.code);
          this.modalShowSOFSVG = true;
        }
      }

      if (to.query.complete) {
        this.loading = false;
      }
    },
  },
  methods: {
    terminalSelectHandler(node) {
      this.terminal = node.id
      this.terminalId = node.id
      this.modalShowFilter = false
      this.getTerminalName()
    },
    toggleIsPageRefreshing() {
      this.$store.dispatch('toggleIsPageRefreshing')
    },
    normalizer(node) {
      if (node.children == null || node.children == "null") {
        delete node.children;
      }
    },
    getSessionId() {
     // this.SessionId="184be185-3edc-40d1-bf3d-e8f4ee869604";
      this.$store.dispatch(GETSETTIONID).then((res) => {    
        this.SessionId = res.data;
           const errors = this.getLegacyErrors;
          this.showErrors(errors);     
      });
      return this.SessionId;
    },
    buildhref(terminalId) {
      const apiurl = encodeURI(this.apiurl);
      // this.SessionId = this.getSessionId();
      return `?quality=${
        this.quality
      }&terminalid=${terminalId}&sessionId=${this.SessionId}&apiurl=${apiurl}&pageurl=${
        window.location.href
      }`;
    },

    RefreshHandler() {
      this.getTerminalName()
      this.toggleIsPageRefreshing()
    },
    getTerminalName() {
      const foundTerminal = this.terminals.find((i) => i.id == this.terminalId);
      const newTerminalId = foundTerminal.id
      this.FilterTerminalText = foundTerminal.label;
      if (process.env.NODE_ENV === 'development') {
        console.log('new terminal id:', newTerminalId)
      }
      // this.terminalId = newTerminalId
      this.terminal = newTerminalId
    },
 
    Refresh_Click() {
      this.getTerminalName()

      // this.loading = true;
      this.modalShowFilter = false;
      this.src = "";
      // try {
      //   this.SessionId = this.getSessionId();
      // } catch (error) {
      //   console.error('error setting session id');
      // }
    },
    getInit() {
      this.$store.dispatch(GETBerthInit).then(() => {
        const errors = this.getBerthChartErrors;

        if (errors.length > 0) {
          this.showErrors(errors);
        } else {
          var model = this.getBerthChartInit;
          const terminals = model.ports
          this.terminals = terminals;

          if (terminals.length > 0) {
            // if (this.standalone) {
              this.terminal = [model.terminalId];
              this.terminalId = model.terminalId;
            // }
          }
          this.Refresh_Click();
        }
      });
    },

    GetScheduleByVoyageId(voyageId, callback) {
      // var vm = this;
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
          itemSchedule = this.Create_BerthPlanView_ScheduleSVG(itemSchedule);
          this.currentSvgData = itemSchedule;
          callback(itemSchedule);
        }
      });
    },

    Create_BerthPlanView_ScheduleSVG(itemSchedule) {
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

        startBollardId:
          itemSchedule.startBollardId == "0" ? "" : itemSchedule.startBollardId,
        endBollardId:
          itemSchedule.endBollardId == "0" ? "" : itemSchedule.endBollardId,
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
          startLoadOperation: itemSchedule.startLoadOperation,
          endLoadOperation: itemSchedule.endLoadOperation,
          startDischargeOperation: itemSchedule.startDischargeOperation,
          endDischargeOperation: itemSchedule.endDischargeOperation,
          unberthDate: itemSchedule.unberthDate,
          fullaway: itemSchedule.fullaway,
          ETD: itemSchedule.etd,
          EPT: itemSchedule.ept,
          PortTime: itemSchedule.portTime,
          loadOperationTime: itemSchedule.loadOperationTime,
          dischargeOperationTime: itemSchedule.dischargeOperationTime,
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
  },
};
</script>
