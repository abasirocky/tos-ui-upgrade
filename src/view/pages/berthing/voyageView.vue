<template>
  <div v-if="model" class="Parent d-flex align-items-start99 flex-column" :class="getClassStatus(model.schedule.voyage.VoyageStatusId)" :title="isLockIcon == false ? 'press ctrl + mouse click' : ''" contenteditable="false">
    <div class="Header">
      <div class="d-flex justify-content-between">
        <div class="TopLeft">
          <div class="d-flex justify-content-start">
            <div class="StartDate pl-2 pr-2" :class="[getClassStartDate(model.schedule.voyage.VoyageStatusId), startDate_OutofRange == true ? 'startDateOutofRange' : '']">{{ startDate_Day }}, {{ startDate_Time }}</div>

            <div class="Bollard pl-2 pr-2 ml-1" :class="getClassStartDate(model.schedule.voyage.VoyageStatusId)">
              {{ model.schedule.StartBollardName }}
              <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="30px" viewBox="0 0 240 109" style="enable-background: new 0 0 240 109" :class="berthsideStyleRotate" class="Icon-Berthside" xml:space="preserve">
                <path class="Icon-Berthside" :title="berthsideName" d="M0.5,0.5v78c0,0.6,0.4,1,1,1h166l69.8-38.3c1.4-0.8,1.4-2.7,0-3.5L168.5-0.5H1.5C0.9-0.5,0.5-0.1,0.5,0.5z" />
                <title>{{ berthsideName }}</title>
              </svg>

              {{ model.schedule.endBollardName }}
            </div>
          </div>
        </div>
        <div class="TopCenter"></div>
        <div class="TopRight">
          <div class="d-flex justify-content-end">
            <div v-if="isOutofRange" class="d-flex justify-content-end mt-1 ml-1 mr-1 CursorHelp">
              <i class="fas fa-exclamation-triangle CursorHelp" title="out of range" style="color: #ff6a00"></i>
            </div>

            <div v-if="model.schedule.IsPlan" @click="deletePlan" class="d-flex justify-content-end mt-1 ml-1 mr-1 CursorPointer">
              <i class="fas fa-trash-alt CursorPointer" title="delete plan" :class="getClassMenu1(model.schedule.voyage.VoyageStatusId)"></i>
            </div>

            <div @click="showVoyageSOF" class="d-flex justify-content-end mt-1 ml-1 mr-1 CursorPointer">
              <i class="fas fa-bars CursorPointer" title="more info" :class="getClassMenu1(model.schedule.voyage.VoyageStatusId)"></i>
            </div>

            <div class="d-flex justify-content-end mt-1 ml-1 mr-2" @click="isLockIcon == false ? openLockMove() : null" :title="isLockIcon == true ? 'locked' : 'click to move item '" :class="isLockIcon == true ? 'CursorHelp' : 'CursorPointer'">
              <i :class="[layer.selected == true ? 'LayerSelected' : '', isLockIcon == true ? 'fas fa-lock' : 'fas fa-thumbtack', isLockIcon == true ? 'CursorHelp' : 'CursorPointer']" style="color: #3e3d3c"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pt-0 pl-2 pb-1 Body">
      <div class="d-flex justify-content-between mb-1">
        <div class="font-weight-boldest">{{ model.schedule.vessel.name }} ({{ model.schedule.voyage.voyageNoIn }} / {{ model.schedule.voyage.voyageNoOut }})</div>
      </div>
    </div>

    <!-- {{ model.schedule.voyage.marginLeft}}
{{ model.schedule.voyage.marginRight}}
{{ model.schedule.vessel.loa}} -->

    <!-- <div class="pt-0 pl-2 pb-1 Body">
      <div class="d-flex justify-content-between mb-1">
        <div class="font-weight-boldest">
          Length (Safty Clearance) : {{ model.schedule.vessel.loa }} ({{
            model.schedule.voyage.marginLeft
          }}
          + {{ model.schedule.voyage.marginRight }}) meter
        </div>
      </div>
    </div> -->

    <div class="p-0 Body2">
      <div class="d-flex justify-content-between mb-1">
        <div class="font-weight-boldest pr-1 pl-1 shippingLine">
          {{ model.schedule.voyage.shippingLine }}
        </div>
      </div>
    </div>

    <div class="pt-0 pl-2 pt-2 pr-2 pb-0 BodyTiming">
      <div class="d-flex justify-content-between mb-1">
        <svg @click="showVoyageSOF" :width="timingWidth" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 392 34" style="enable-background: new 0 0 392 34" xml:space="preserve">
          <g>
            <path id="Step1-Body" class="styleStep1_Body" d="M63.1,0H2C0.9,0,0,0.9,0,2v30c0,1.1,0.9,2,2,2h61.1L68,17L63.1,0z" />
            <text id="Step1-Date" transform="translate(34, 12) " alignment-baseline="middle" text-anchor="middle" class="styleStepFont9">
              {{ stepETA_Date }}
            </text>
            <text id="Step1-Time" transform="translate(34, 24) " alignment-baseline="middle" text-anchor="middle" class="styleStepFont9">
              {{ stepETA_Time }}
            </text>
            <title>ETA</title>
          </g>

          <g>
            <polygon id="Step2-Body" :class="Step2Disable == true ? 'styleStepDisable_Body' : 'styleStep2_Body'" points="129.1,0 65.1,0 70,17 65.1,34 129.1,34 134,17 " />
            <text id="Step2-Date" transform="translate(100, 12) " alignment-baseline="middle" text-anchor="middle" class="styleStepFont9">
              {{ stepAnchorage_Date }}
            </text>
            <text id="Step2-Time" transform="translate(100, 24) " alignment-baseline="middle" text-anchor="middle" class="styleStepFont9">
              {{ stepAnchorage_Time }}
            </text>
            <title>anchorage Date</title>
          </g>

          <g>
            <polygon id="Step3-Body" :class="Step3Disable == true ? 'styleStepDisable_Body' : 'styleStep3_Body'" points="195.1,0 131.1,0 136,17 131.1,34 195.1,34 200,17 " />
            <text id="Step3-Date" transform="translate(166, 12) " alignment-baseline="middle" text-anchor="middle" class="styleStepFont9">
              {{ stepBerth_Date }}
            </text>
            <text id="Step3-Time" transform="translate(166, 24) " alignment-baseline="middle" text-anchor="middle" class="styleStepFont9">
              {{ stepBerth_Time }}
            </text>
            <title>Berth Date</title>
          </g>

          <g>
            <polygon id="Step6-Body" :class="Step4Disable == true ? 'styleStepDisable_Body' : 'styleStep4_Body'" points="261.1,0 197.1,0 202,17 197.1,34 261.1,34 266,17 " />
            <text id="Step6-Date" transform="translate(232, 12) " alignment-baseline="middle" text-anchor="middle" class="styleStepFont9">
              {{ stepUnberth_Date }}
            </text>
            <text id="Step6-Time" transform="translate(232, 24) " alignment-baseline="middle" text-anchor="middle" class="styleStepFont9">
              {{ stepUnberth_Time }}
            </text>
            <title>Unberth Date</title>
          </g>
          <g>
            <polygon id="Step7-Body" :class="Step5Disable == true ? 'styleStepDisable_Body' : 'styleStep5_Body'" points="327.1,0 263.1,0 268,17 263.1,34 327.1,34 332,17 " />
            <text id="Step7-Date" transform="translate(298, 12) " alignment-baseline="middle" text-anchor="middle" class="styleStepFont9">
              {{ stepFullaway_Date }}
            </text>
            <text id="Step7-Time" transform="translate(298, 24) " alignment-baseline="middle" text-anchor="middle" class="styleStepFont9">
              {{ stepFullaway_Time }}
            </text>
            <title>fullaway</title>
          </g>

          <g>
            <path id="Step8-Body" class="styleStep6_Body" d="M329.1,0l4.9,17l-4.9,17H390c1.1,0,2-0.9,2-2V2c0-1.1-0.9-2-2-2H329.1z" />
            <text id="Step8-Date" transform="translate(364, 12) " alignment-baseline="middle" text-anchor="middle" class="styleStepFont9">
              {{ stepETD_Date }}
            </text>
            <text id="Step8-Time" transform="translate(364, 24) " alignment-baseline="middle" text-anchor="middle" class="styleStepFont9">
              {{ stepETD_Time }}
            </text>
            <title>ETD</title>
          </g>
        </svg>
      </div>
    </div>

    <div class="pt-0 pl-2 pt-2 pr-2 pb-0 BodyInfo">
      <div class="d-flex justify-content-between  mb-3">
        <div class="">
          <span title="duration" class="font-weight-boldest"> <i class="fas fa-history  pr-1" :class="getClassMenu1(model.schedule.voyage.VoyageStatusId)"></i>{{ planDuration }} </span>
        </div>

        <div class="">
          <span title="length" class="font-weight-boldest"><i class="fas fa-text-width  pr-1" :class="getClassMenu1(model.schedule.voyage.VoyageStatusId)"></i>{{ model.schedule.vessel.loa + model.schedule.voyage.marginLeft + model.schedule.voyage.marginRight }} m</span>
        </div>
      </div>

      <!-- <div class="d-flex justify-content-between mb-1">
        <div class="font-weight-boldest">
          <span title="length"
            ><i class="fas fa-text-width text-danger pr-1"></i
            >{{
              model.schedule.vessel.loa +
                model.schedule.voyage.marginLeft +
                model.schedule.voyage.marginRight
            }}
            m</span
          >
          <span title="duration" class="pl-2">
            <i class="fas fa-history text-danger pr-1"></i>{{ planDuration }}
          </span>
        </div>
      </div> -->
    </div>

    <div class="mt-auto Footer">
      <!-- <div class="pt-0 pl-2 pb-1 Body">
        <div class="d-flex justify-content-between mb-1">
          <div class="font-weight-boldest">
            LOA (Safty Clearance) : {{ model.schedule.vessel.loa }} ({{
              model.schedule.voyage.marginLeft
            }}
            + {{ model.schedule.voyage.marginRight }}) meter
          </div>
        </div>
      </div> -->

      <div v-if="model.schedule.lineServiceName != ''" class="d-flex justify-content-between">
        <div class="BottonLeft font-weight-boldest pb-1 pl-2 pr-2">
          {{ model.schedule.lineServiceName }}
        </div>
      </div>

      <div class="d-flex justify-content-between">
        <!-- <div
          class="BottonLeft EndDate pl-2 pr-2"
          :class="getClassStartDate(model.schedule.voyage.VoyageStatusId)"
        >
          {{ endDate_Day }}, {{ endDate_Time }}
        </div> -->

        <div class="BottonLeft">
          <div class="d-flex justify-content-start">
            <div class="EndDate pl-2 pr-2" :class="[getClassStartDate(model.schedule.voyage.VoyageStatusId)]">{{ endDate_Day }}, {{ endDate_Time }}</div>

            <!-- <div
              class="PlanDuration pl-2 pr-2 ml-1"
              :class="getClassStartDate(model.schedule.voyage.VoyageStatusId)"
              title="Duration"
            >
              {{ planDuration }}
            </div> -->
          </div>
        </div>

        <div class="BottonCenter"></div>
        <div class="BottonRight">
          <div class="d-flex justify-content-start">
            <div class="VoyageStatus pl-2 pr-2" :class="getClassStartDate(model.schedule.voyage.VoyageStatusId)">
              {{ model.schedule.voyage.VoyageStatus }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { ConvertTime } from "@/mixins.ts";
export default {
  name: "voyageView",
  components: {},
  mixins: [ConvertTime],
  props: {
    layer: Object,
  },
  emits: ["clickData", "deleteSchedule", "openLockClick"],
  data: () => {
    return {
      model: null,

      // voyageStatus : [
      //   { id: 1, classname: "ParentETA ParentETA_bg" },
      //   { id: 2, classname: "ParentAnchorage ParentAnchorage_bg" },
      //   { id: 3, classname: "ParentBerth ParentBerth_bg" },
      //   { id: 4, classname: "ParentUnberth ParentUnberth_bg" },
      //   { id: 5, classname: "ParentFullaway ParentFullaway_bg" },
      // ],
      startDate_Day: null,
      startDate_Time: null,
      endDate_Day: null,
      endDate_Time: null,
      berthsideStyleRotate: null,
      timingWidth: "",

      stepETA_Date: null,
      stepETA_Time: null,
      stepETA_EPT: null,

      stepAnchorage_Date: null,
      stepAnchorage_Time: null,
      stepAnchorage_PortTime: null,

      stepBerth_Date: null,
      stepBerth_Time: null,
      stepBerth_BerthTime: null,

      stepUnberth_Date: null,
      stepUnberth_Time: null,

      stepFullaway_Date: null,
      stepFullaway_Time: null,

      stepETD_Date: null,
      stepETD_Time: null,

      Step2Disable: false,
      Step3Disable: false,
      Step4Disable: false,
      Step5Disable: false,

      isLockIcon: false,
      isOutofRange: false,
      startDate_OutofRange: false,

      Fdate: null,
      Tdate: null,
      planDuration: null,
    };
  },
  mounted() {
    // this.model = this.layer;
    // this.updateView();
  },
  watch: {
    layer: {
      immediate: true,
      handler(value) {
        this.model = value;
        this.updateView();
        // if (value.selected) {
        //   console.log("watch work", value.selected);
        // }
      },
    },
  },

  methods: {
    updateView() {
      this.timingWidth = this.model.w.toString() + "px";

      this.isLockIcon = this.model.schedule.moveLocked == true || this.model.schedule.isOutofRange == true ? true : false;
      this.isOutofRange = this.model.schedule.isOutofRange;
      this.startDate_OutofRange = false;

      if (this.model.schedule.isOutofRange == true && this.model.schedule.startDateOriginal != null) {
        this.startDate_Day = moment(this.model.schedule.startDateOriginal).format("DD") + " " + moment(this.model.schedule.startDateOriginal).format("MMM");
        this.startDate_Time = moment(this.model.schedule.startDateOriginal).format("HH:mm");
        this.startDate_OutofRange = true;
        this.Fdate = this.model.schedule.startDateOriginal;
      } else {
        this.startDate_Day = moment(this.model.schedule.startDate).format("DD") + " " + moment(this.model.schedule.startDate).format("MMM");
        this.startDate_Time = moment(this.model.schedule.startDate).format("HH:mm");
        this.Fdate = this.model.schedule.startDate;
      }

      this.endDate_Day = moment(this.model.schedule.endDate).format("DD") + " " + moment(this.model.schedule.endDate).format("MMM");
      this.endDate_Time = moment(this.model.schedule.endDate).format("HH:mm");

      this.Tdate = this.model.schedule.endDate;

      //planDuration
      const planDurationMilliseconds = new Date(this.Tdate).getTime() - new Date(this.Fdate).getTime();
      this.planDuration = this.GetPlanDuration(planDurationMilliseconds / 60000);

      this.berthsideName = this.model.schedule.voyage.side.toUpperCase() === "PORT" ? "Port Side" : "Starboard";
      this.berthsideStyleRotate = this.model.schedule.voyage.side.toUpperCase() === "PORT" ? "" : "berthsideStarboard";

      this.stepETA_Date = moment(this.model.schedule.voyage.ETA).format("ll");
      this.stepETA_Time = moment(this.model.schedule.voyage.ETA).format("HH:mm");
      this.stepETA_EPT = this.model.schedule.voyage.EPT ?? "";

      if (this.model.schedule.voyage.anchorage != "") {
        this.stepAnchorage_Date = moment(this.model.schedule.voyage.anchorage).format("ll");
        this.stepAnchorage_Time = moment(this.model.schedule.voyage.anchorage).format("HH:mm");
        this.Step2Disable = false;
        this.stepAnchorage_PortTime = this.model.schedule.voyage.PortTime ?? "";
      } else {
        this.Step2Disable = true;
        this.stepAnchorage_Date = "";
        this.stepAnchorage_Time = "";
        this.stepAnchorage_PortTime = "";
      }

      if (this.model.schedule.voyage.berthDate != "") {
        this.Step3Disable = false;
        this.stepBerth_Date = moment(this.model.schedule.voyage.berthDate).format("ll");
        this.stepBerth_Time = moment(this.model.schedule.voyage.berthDate).format("HH:mm");
        this.stepBerth_BerthTime = this.model.schedule.voyage.berthTime ?? "";
      } else {
        this.Step3Disable = true;
        this.stepBerth_Date = "";
        this.stepBerth_Time = "";
        this.stepBerth_BerthTime = "";
      }

      if (this.model.schedule.voyage.unberthDate != "") {
        this.activeStep = "Unberth";
        this.activeStepHeaderStyle = "styleStep6_Header";
        this.Step4Disable = false;
        this.stepUnberth_Date = moment(this.model.schedule.voyage.unberthDate).format("ll");
        this.stepUnberth_Time = moment(this.model.schedule.voyage.unberthDate).format("HH:mm");
      } else {
        this.Step4Disable = true;
        this.stepUnberth_Date = "";
        this.stepUnberth_Time = "";
      }

      if (this.model.schedule.voyage.fullaway != "") {
        this.Step5Disable = false;
        this.stepFullaway_Date = moment(this.model.schedule.voyage.fullaway).format("ll");
        this.stepFullaway_Time = moment(this.model.schedule.voyage.fullaway).format("HH:mm");
      } else {
        this.Step5Disable = true;
        this.stepFullaway_Date = "";
        this.stepFullaway_Time = "";
      }

      this.stepETD_Date = moment(this.model.schedule.voyage.ETD).format("ll");
      this.stepETD_Time = moment(this.model.schedule.voyage.ETD).format("HH:mm");
    },
    updateModel(val) {
      this.model.schedule = val;
      this.updateView();
      this.$forceUpdate();
    },
    showVoyageSOF() {
      const me = this;
      this.$emit("clickData", me);
    },

    getClassStatus: (a) => {
      const voyageStatus = [
        { id: 1, classname: "ParentETA" },
        { id: 2, classname: "ParentAnchorage" },
        { id: 3, classname: "ParentBerth" },
        { id: 4, classname: "ParentUnberth" },
        { id: 5, classname: "ParentFullaway" },
      ];
      return voyageStatus[Number(a) - 1].classname;
    },

    getClassStartDate: (a) => {
      const voyageStatus = [
        { id: 1, classname: "StartDateETA" },
        { id: 2, classname: "StartDateAnchorage" },
        { id: 3, classname: "StartDateBerth" },
        { id: 4, classname: "StartDateUnberth" },
        { id: 5, classname: "StartDateFullaway" },
      ];
      return voyageStatus[Number(a) - 1].classname;
    },
    getClassMenu1: (a) => {
      const voyageStatus = [
        { id: 1, classname: "Icon-Menu1_ETA" },
        { id: 2, classname: "Icon-Menu1_Anchorage" },
        { id: 3, classname: "Icon-Menu1_Berth" },
        { id: 4, classname: "Icon-Menu1_Unberth" },
        { id: 5, classname: "Icon-Menu1_Fullaway" },
      ];
      return voyageStatus[Number(a) - 1].classname;
    },

    getClassiconInfo: (a) => {
      const voyageStatus = [
        { id: 1, classname: "iconInfo_ETA" },
        { id: 2, classname: "iconInfo_Anchorage" },
        { id: 3, classname: "iconInfo_Berth" },
        { id: 4, classname: "iconInfo_Unberth" },
        { id: 5, classname: "iconInfo_Fullaway" },
      ];
      return voyageStatus[Number(a) - 1].classname;
    },

    deletePlan() {
      this.$emit("deleteSchedule", this.model.schedule);
    },
    openLockMove() {
      this.$emit("openLockClick", this.model.schedule);
    },
  },
};
</script>

<style scoped>
.Parent {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  font-size: 11px;
  color: #373532;
}
.iconInfo {
  font-size: 15px;
}

.ParentETA {
  border: 2px solid #0b467e;
  background-color: rgb(19, 113, 201, 0.4);
}

.ParentAnchorage {
  border: 2px solid #225d64;
  background-color: rgb(46, 119, 128, 0.4);
}
.ParentBerth {
  border: 2px solid #0e6b3b;
  background-color: rgb(22, 177, 97, 0.4);
}
.ParentUnberth {
  border: 2px solid #b43c14;
  background-color: rgb(216, 86, 44, 0.4);
}
.ParentFullaway {
  border: 2px solid #ac7817;
  background-color: rgb(250, 182, 55, 0.4);
}

.StartDate {
  color: #ffffff;
  border-bottom-right-radius: 5px;
}
.Bollard {
  color: #ffffff;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
.PlanDuration {
  color: #ffffff;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.EndDate {
  color: #ffffff;
  border-top-right-radius: 5px;
}

.VoyageStatus {
  color: #ffffff;
  border-top-left-radius: 5px;
}

.StartDateETA {
  background-color: #0b467e;
}

.StartDateAnchorage {
  background-color: #225d64;
}
.StartDateBerth {
  background-color: #0e6b3b;
}
.StartDateUnberth {
  background-color: #b43c14;
}
.StartDateFullaway {
  background-color: #ac7817;
}

.Icon-Menu1_ETA {
  color: #0b467e !important;
}

.Icon-Menu1_ETA:hover {
  color: #373532 !important;
}

.Icon-Menu1_Anchorage {
  color: #225d64 !important;
}
.Icon-Menu1_Anchorage:hover {
  color: #373532 !important;
}
.Icon-Menu1_Berth {
  color: #0e6b3b !important;
}
.Icon-Menu1_Berth:hover {
  color: #373532 !important;
}

.Icon-Menu1_Unberth {
  color: #b43c14 !important;
}
.Icon-Menu1_Unberth:hover {
  color: #373532 !important;
}

.Icon-Menu1_Fullaway {
  color: #ac7817 !important;
}
.Icon-Menu1_Fullaway:hover {
  color: #373532 !important;
}

.iconInfo_ETA {
  color: #0b467e;
}
.iconInfo_Anchorage {
  color: #225d64;
}
.iconInfo_Berth {
  color: #0e6b3b;
}
.iconInfo_Unberth {
  color: #b43c14;
}
.iconInfo_Fullaway {
  color: #ac7817;
}

.Icon-Berthside {
  fill: #d1d1ce;
}
.Icon-Berthside:hover {
  color: #d3912f !important;
  cursor: help !important;
}

.berthsideStarboard {
  transform: scale(-1, 1);
}

.shippingLine {
  background-color: #4e4c49;
  color: #ffffff;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
}
/* Disable */
.styleStepDisable_Body {
  fill: #747373;
  opacity: 0.5;
}

.styleStepFont9 {
  fill: #ffffff;
  font-size: 9px;
}
/* Step1 */
.styleStep1_Body {
  fill: #1371c9;
  opacity: 0.8;
}

/* Step2 */
.styleStep2_Body {
  fill: #2e7780;
  opacity: 0.8;
}

/* Step3 */
.styleStep3_Body {
  fill: #1ea35e;
  opacity: 0.8;
}

/* Step4 */
.styleStep4_Body {
  fill: #d8562c;
  opacity: 0.8;
}

/* Step5 */
.styleStep5_Body {
  fill: #fab637;
  opacity: 0.8;
}

/* Step6 */
.styleStep6_Body {
  fill: #1765ae;
  opacity: 0.8;
}

.startDateOutofRange {
  text-decoration: line-through;
  color: #ff6a00;
}

.LayerSelected {
  transform: rotate(45deg);
}
</style>
