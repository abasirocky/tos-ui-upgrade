<template>
  <div
    v-if="mScheduleItem"
    style="width: 400px; height: 252px; background-color: #fff; display: block"
  >
    <div class="card card-custom" style="box-shadow: #504f4f 0px 2px 20px 0px">
      <div class="card-header pl-3 pr-3" style="min-height: 40px">
        <h6
          class="card-title font-weight-bolder text-dark"
          @click="ShowVoyageInfo"
        >
          <i class="fas fa-info-circle text-info pr-3"></i>
          <span class="font-weight-bolder font-size-sm">
            {{ mScheduleItem.vessel.name }}</span
          >
          <span class="text-muted pl-2 font-weight-bold font-size-sm"
            >{{ mScheduleItem.voyageNoIn }}/{{
              mScheduleItem.voyageNoOut
            }}</span
          >
        </h6>
        <div class="card-toolbar">
          <span
            class="svg-icon svg-icon-danger svg-icon-2x"
            style="cursor: pointer"
            @click="Delete_Plan()"
          >
            <svg
              v-if="mScheduleItem.IsPlan"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              version="1.1"
            >
              <title>Delete Plan</title>
              <g
                id="trash"
                stroke="none"
                stroke-width="1"
                fill="none"
                fill-rule="evenodd"
              >
                <rect x="0" y="0" width="24" height="24" />
                <path
                  d="M6,8 L18,8 L17.106535,19.6150447 C17.04642,20.3965405 16.3947578,21 15.6109533,21 L8.38904671,21 C7.60524225,21 6.95358004,20.3965405 6.89346498,19.6150447 L6,8 Z M8,10 L8.45438229,14.0894406 L15.5517885,14.0339036 L16,10 L8,10 Z"
                  fill="#000000"
                  fill-rule="nonzero"
                />
                <path
                  d="M14,4.5 L14,3.5 C14,3.22385763 13.7761424,3 13.5,3 L10.5,3 C10.2238576,3 10,3.22385763 10,3.5 L10,4.5 L5.5,4.5 C5.22385763,4.5 5,4.72385763 5,5 L5,5.5 C5,5.77614237 5.22385763,6 5.5,6 L18.5,6 C18.7761424,6 19,5.77614237 19,5.5 L19,5 C19,4.72385763 18.7761424,4.5 18.5,4.5 L14,4.5 Z"
                  fill="#000000"
                  opacity="0.8"
                />
              </g>
            </svg>
          </span>
        </div>
      </div>
      <b-overlay :show="showOverlay" rounded="sm" variant="info" opacity="0.4">
        <div class="card-body p-0">
          <div class="d-flex align-items-center p-0">
            <div class="d-flex flex-column flex-grow-1 m-0">
              <svg
                v-if="mScheduleItem"
                height="63px"
                width="400px"
                viewBox="0 0 630 100"
                style="background-color: snow"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <!-- change berth side -->
                <g
                  style="cursor: pointer"
                  @click="ReplaceSide()"
                  transform="translate(550,30) scale(1.8)"
                  stroke="none"
                  stroke-width="1"
                  fill="none"
                  fill-rule="evenodd"
                >
                  <title>Click to change side</title>
                  <rect
                    class="gSelect"
                    x="0"
                    y="0"
                    rx="3"
                    ry="3"
                    width="24"
                    height="24"
                    fill="#fff"
                  />
                  <rect
                    fill="#425671"
                    opacity="0.3"
                    transform="translate(13.000000, 6.000000) rotate(-450.000000) translate(-13.000000, -6.000000) "
                    x="12"
                    y="8.8817842e-16"
                    width="2"
                    height="12"
                    rx="1"
                  />
                  <path
                    d="M9.79289322,3.79289322 C10.1834175,3.40236893 10.8165825,3.40236893 11.2071068,3.79289322 C11.5976311,
                  4.18341751 11.5976311,4.81658249 11.2071068,5.20710678 L8.20710678,8.20710678 C7.81658249,8.59763107 
                  7.18341751,8.59763107 6.79289322,8.20710678 L3.79289322,5.20710678 C3.40236893,4.81658249 3.40236893,4.18341751 
                  3.79289322,3.79289322 C4.18341751,3.40236893 4.81658249,3.40236893 5.20710678,3.79289322 L7.5,6.08578644 L9.79289322,3.79289322 Z"
                    fill="#425671"
                    fill-rule="nonzero"
                    transform="translate(7.500000, 6.000000) rotate(-270.000000) translate(-7.500000, -6.000000) "
                  />
                  <rect
                    fill="#425671"
                    opacity="0.3"
                    transform="translate(11.000000, 18.000000) scale(1, -1) rotate(90.000000) translate(-11.000000, -18.000000) "
                    x="10"
                    y="12"
                    width="2"
                    height="12"
                    rx="1"
                  />
                  <path
                    d="M18.7928932,15.7928932 C19.1834175,15.4023689 19.8165825,15.4023689 20.2071068,15.7928932 C20.5976311,16.1834175 
                  20.5976311,16.8165825 20.2071068,17.2071068 L17.2071068,20.2071068 C16.8165825,20.5976311 16.1834175,20.5976311 
                  15.7928932,20.2071068 L12.7928932,17.2071068 C12.4023689,16.8165825 12.4023689,16.1834175 12.7928932,15.7928932 
                  C13.1834175,15.4023689 13.8165825,15.4023689 14.2071068,15.7928932 L16.5,18.0857864 L18.7928932,15.7928932 Z"
                    fill="#425671"
                    fill-rule="nonzero"
                    transform="translate(16.500000, 18.000000) scale(1, -1) rotate(270.000000) translate(-16.500000, -18.000000) "
                  />
                </g>

                <!-- change berth side -->

                <!--Caption -->
                <g transform="translate(300,23) " fill="#444">
                  <text
                    alignment-baseline="middle"
                    text-anchor="middle"
                    font-weight="bold"
                    font-size="small"
                  >
                    {{ mScheduleItem.berthName }}
                  </text>
                </g>
                <!--Caption -->
                <!--Start Bolard-->
                <g transform=" translate(225,50) " fill="#444">
                  <text
                    alignment-baseline="middle"
                    text-anchor="end"
                    font-weight="bold"
                    font-size="small"
                  >
                    {{ mScheduleItem.StartBollardName }}
                  </text>
                </g>
                <!--Start Bolard-->
                <!--End Bolard-->
                <g transform="translate(400,50) " fill="#444">
                  <text
                    alignment-baseline="middle"
                    text-anchor="start"
                    font-weight="bold"
                    font-size="small"
                  >
                    {{ mScheduleItem.endBollardName }}
                  </text>
                </g>
                <!--End Bolard-->
                <!--End LOA-->
                <g transform="translate(380,80) " fill="#777">
                  <text
                    alignment-baseline="middle"
                    text-anchor="start"
                    font-weight="bold"
                    font-size="small"
                  >
                    Draft: {{ mScheduleItem.vessel.LOA }}
                  </text>
                </g>
                <!--End LOA-->
                <!--End length-->
                <g transform="translate(225,80) " fill="#777">
                  <text
                    alignment-baseline="middle"
                    text-anchor="end"
                    font-weight="bold"
                    font-size="small"
                  >
                    LOA: {{ mScheduleItem.vessel.length }}
                  </text>
                </g>
                <!--End length-->
                <!--Berth Side -->
                <use
                  :xlink:href="shipSideUrl"
                  transform=" translate(155,35) scale(0.5,0.3)"
                >
                  <title>Click Change Side</title>
                </use>
                <!--Berth Side -->
              </svg>
            </div>
          </div>

          <div class="d-flex align-items-center p-0">
            <div class="d-flex flex-column flex-grow-1 mb-2">
              <svg
                @click="hideContextForm"
                height="126px"
                width="100%"
                viewBox="0 0 630 200"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <defs>
                  <rect
                    id="rect1"
                    x="0"
                    y="0"
                    rx="2"
                    ry="2"
                    width="10"
                    height="10"
                    style="stroke: #fee; stroke-width: 1; opacity: 1"
                  />

                  <linearGradient id="FlagOn" gradientTransform="rotate(45)">
                    <stop offset="20%" stop-color="#42B534" />
                    <stop offset="90%" stop-color="#1EFB03" />
                  </linearGradient>
                  <linearGradient id="FlagOff" gradientTransform="rotate(45)">
                    <stop offset="20%" stop-color="#F30707" />
                    <stop offset="90%" stop-color="#F30707" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 0 L25 100 L0 200 L600 200 L625 100 L600 0"
                  style="fill: #425671; stroke: #c5dad5; stroke-width: 0"
                />
                <g transform="translate(100,25)">
                  <path
                    d="M0 0 L25 75 L0 150 L400 150 L425 75 L400 0"
                    style="fill: #c5dad5; stroke: #c5dad5; stroke-width: 0"
                  />
                </g>
                <g transform="translate(200,50)">
                  <path
                    d="M0 0 L25 50 L0 100 L200 100 L225 50 L200 0"
                    style="fill: #fee0a4; stroke: #c5dad5; stroke-width: 0"
                  />
                </g>
                <path
                  d="M0 200 L600 200 L606.25 175 L6.25 175"
                  style="fill: #eee; stroke: #c5dad5; stroke-width: 1"
                />

                <path
                  d="M6.25 175 L606.25 175 L612.5 150 L12.5 150 "
                  style="fill: #eee; stroke: #c5dad5; stroke-width: 1"
                />

                <path
                  d="M25 100 L625 100"
                  style="stroke: #222; stroke-width: 1"
                />

                <g transform="translate(60,90)" fill="#fff">
                  <text alignment-baseline="middle" text-anchor="middle">
                    ETA
                  </text>
                  <text
                    y="35"
                    alignme
                    nt-baseline="middle"
                    text-anchor="middle"
                  >
                    {{ eta }}
                  </text>
                </g>
                <g transform="translate(168,90)" fill="#000">
                  <a>
                    <text alignment-baseline="middle" text-anchor="middle">
                      anchorage
                    </text>
                    <text
                      y="35"
                      alignment-baseline="middle"
                      text-anchor="middle"
                      @mouseup="showContextForm($event, 2)"
                      style="cursor: pointer"
                    >
                      {{
                        anchorage !== "" ? anchorage : status === 1 ? "SET" : ""
                      }}
                    </text>
                  </a>
                </g>
                <g transform="translate(260,90)" fill="#000">
                  <text alignment-baseline="middle" text-anchor="middle">
                    Berth
                  </text>
                  <text
                    y="35"
                    alignment-baseline="middle"
                    text-anchor="middle"
                    style="cursor: pointer"
                    @mouseup="showContextForm($event, 3)"
                  >
                    {{ Berth !== "" ? Berth : status === 2 ? "SET" : "" }}
                  </text>
                </g>

                <g transform="translate(360,90)" fill="#000">
                  <text alignment-baseline="middle" text-anchor="middle">
                    UnBerth
                  </text>
                  <text
                    y="35"
                    alignment-baseline="middle"
                    text-anchor="middle"
                    style="cursor: pointer"
                    @mouseup="showContextForm($event, 4)"
                  >
                    {{ unBerth !== "" ? unBerth : status === 3 ? "SET" : "" }}
                  </text>
                </g>
                <g transform="translate(466,90)" fill="#000">
                  <text alignment-baseline="middle" text-anchor="middle">
                    fullaway
                  </text>
                  <text
                    y="35"
                    alignment-baseline="middle"
                    text-anchor="middle"
                    style="cursor: pointer"
                    :class="{ enabled: fullaway !== '' }"
                    @mouseup="showContextForm($event, 5)"
                  >
                    {{ fullaway !== "" ? fullaway : status === 4 ? "SET" : "" }}
                  </text>
                </g>
                <g transform="translate(560,90)" fill="#fff">
                  <text alignment-baseline="middle" text-anchor="middle">
                    ETD
                  </text>
                  <text y="35" alignment-baseline="middle" text-anchor="middle">
                    {{ ETD }}
                  </text>
                </g>

                <g transform="translate(300,64)" fill="#000">
                  <text v-if="berthTime" class="timestyle">
                    {{ berthTime }}
                  </text>
                </g>

                <g transform="translate(300,40)" fill="#000">
                  <text v-if="PortTime" class="timestyle">
                    {{ PortTime }}
                  </text>
                </g>
                <g transform="translate(300,15)" fill="#fff">
                  <text class="timestyle">
                    {{ EPT }}
                  </text>
                </g>

                <use
                  id="eta-status"
                  x="55"
                  y="68"
                  xlink:href="#rect1"
                  :fill="status > 0 ? 'url(#FlagOn)' : 'url(#FlagOff)'"
                />
                <use
                  id="anchorage-status"
                  x="155"
                  y="68"
                  xlink:href="#rect1"
                  :fill="status > 1 ? 'url(#FlagOn)' : 'url(#FlagOff)'"
                />
                <use
                  id="berth-status"
                  x="255"
                  y="68"
                  xlink:href="#rect1"
                  :fill="status > 2 ? 'url(#FlagOn)' : 'url(#FlagOff)'"
                />
                <use
                  id="unberth-status"
                  x="355"
                  y="68"
                  xlink:href="#rect1"
                  :fill="status > 3 ? 'url(#FlagOn)' : 'url(#FlagOff)'"
                />
                <use
                  id="fullaway-status"
                  x="455"
                  y="68"
                  xlink:href="#rect1"
                  :fill="status > 4 ? 'url(#FlagOn)' : 'url(#FlagOff)'"
                />
                <use
                  id="etd-status"
                  x="555"
                  y="68"
                  xlink:href="#rect1"
                  :fill="status > 5 ? 'url(#FlagOn)' : 'url(#FlagOff)'"
                />

                <line
                  v-for="(item, i) in lines"
                  :key="'L' + i"
                  :x1="item.start[0]"
                  :y1="item.start[1]"
                  :x2="item.end[0]"
                  :y2="item.end[1]"
                  stroke="#999"
                />

                <g
                  v-for="(item, index) in textpoints"
                  :key="index"
                  :transform="item.translate"
                  fill="#000"
                >
                  <text alignment-baseline="middle" text-anchor="middle">
                    {{ item.text }}
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>
        <template #overlay>
          <div class="text-center">
            <b-icon
              class="text-danger"
              icon="stopwatch"
              font-scale="3"
              animation="cylon"
            ></b-icon>
            <p class="text-danger font-weight-bolder">Please wait...</p>
          </div>
        </template>
      </b-overlay>
    </div>

    <div id="context-from">
      <b-form>
        <b-form-group label="Date" label-for="currentDate">
          <date-picker
            v-model="currentDate"
            name="currentDate"
            type="datetime"
            placeholder="Choose Date"
            format="YYYY/MM/DD HH:mm"
            value-type="format"
            class="filterdate"
          ></date-picker>
        </b-form-group>
        <b-button variant="primary" size="sm" @click="btnok">Apply</b-button>
        <b-button
          v-if="status === menuId"
          variant="danger"
          @click="btnClear"
          size="sm"
          class="ml-2"
          >Clear</b-button
        >
        <b-button variant="default" @click="btnclose" size="sm" class="ml-2"
          >Close</b-button
        >
      </b-form>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import {
  Update_VoyageSOF_AnchorageIn,
  AddOrUpdate_VoyageSOF_Berth,
  Delete_VoyageSOF_Berth,
  Update_VoyageSOF_AnchorageOut,
  Update_BerthSideByVoyageId,
  Delete_VoyageSOF_Plan,
} from "@/core/services/store/voyagesof.module";
import { mapGetters } from "vuex";

export default {
  name: "VesselTimeLine",
  components: {
    DatePicker,
  },
  inject: ["showErrors", "showSuccess"],
  data: () => {
    return {
      shipSideUrl: "",
      lines: [],
      textpoints: [],
      currentDate: null,
      isCloseable: false,
      status: 0,
      menuId: 0,
      mVoyageId: 0,
      mScheduleItem: null,
      startMonth: "",
      startWeek: "",
      endWeek: "",
      EPT: "",
      berthTime: null,
      PortTime: null,
      anchorage: "",
      Berth: null,
      unBerth: null,
      fullaway: null,
      ETD: null,
      eta: null,
      showOverlay: false,
    };
  },
  mounted() {
    if (this.mScheduleItem) {
      this.hideContextForm();
    }
  },
  computed: {
    ...mapGetters(["getVoyageSOFErrors", "getVoyageSOFMessages"]),
  },

  methods: {
    onClickOutside(event) {
      this.hideContextForm(event);
    },

    Delete_Plan() {
      this.Delete_Planfn(() => {
        this.$parent.DeleteScheduleByVoyageId(this.mVoyageId);
      });
    },
    ShowVoyageInfo() {
      this.$parent.ShowVoyageInfo(this.mVoyageId);
    },
    getShipSideUrl() {
      const url =
        process.env.BASE_URL + "media/svg/saab/shipsiderotate.svg#shipside";
      return url;
    },
    appendValue(id, value) {
      switch (id) {
        case 2:
          this.mScheduleItem.anchorage = value;
          break;
        case 3:
          this.mScheduleItem.berthDate = value;
          break;
        case 4:
          this.mScheduleItem.unberthDate = value;
          break;
        case 5:
          this.mScheduleItem.fullaway = value;
          break;
      }
    },
    btnClear() {
      if (this.status != this.menuId) {
        return;
      }

      this.hideContextForm();
      this.appendValue(this.menuId, "");
      const me = this;
      const parent = me.$parent;
      const callback = () => {
        me.showOverlay = false;
        parent.UpdateScheduleByVoyageId(me.mVoyageId);
      };
      this.showOverlay = true;

      switch (this.menuId) {
        case 2:
          this.Change_Anchorage("clear", callback);
          break;
        case 3:
          this.Delete_Berth(callback);
          break;
        case 4:
          this.Delete_UnBerth(callback);
          break;
        case 5:
          this.Delete_Fullaway(callback);
      }
      // this.status = this.status - 1;
    },
    btnok() {
      this.hideContextForm();
      // this.appendValue(this.menuId, this.currentDate);
      const me = this;
      const parent = me.$parent;
      const callback = () => {
        me.showOverlay = false;
        parent.UpdateScheduleByVoyageId(me.mVoyageId);
      };

      switch (this.menuId) {
        case 2:
          this.Change_Anchorage("", callback);
          break;
        case 3:
          if (this.currentDate <= this.mScheduleItem.anchorage) {
            this.showErrors([
              { messageText: "Berth Date must be larger anchorage Date " },
            ]);
          } else {
            this.Change_Berth(callback);
          }
          break;
        case 4:
          if (this.currentDate <= this.mScheduleItem.berthDate) {
            this.showErrors([
              { messageText: "Berth Date must be larger Berth Date " },
            ]);
          } else {
            this.Change_UnBerth(callback);
          }
          break;
        case 5:
          this.Change_Fullaway(callback);
          break;
      }

      // this.updateComponent(this.mScheduleItem);
    },
    btnclose() {
      this.hideContextForm();
    },
    showContextForm(event, id) {
      if (!(id === this.status || id === this.status + 1)) {
        return;
      }
      this.menuId = id;
      if (id === this.status) {
        switch (id) {
          case 2:
            this.currentDate = this.mScheduleItem.anchorage;
            break;
          case 3:
            this.currentDate = this.mScheduleItem.berthDate;
            break;
          case 4:
            this.currentDate = this.mScheduleItem.unberthDate;
            break;
          case 5:
            this.currentDate = this.mScheduleItem.fullaway;
            break;
        }
      } else {
        this.currentDate = null;
      }

      var scope = document.querySelector("body");
      var contextMenu = document.getElementById("context-from");

      var divBerthView = document.getElementById("divBerthView");
      var objcanvas = divBerthView.querySelector("canvas");
      contextMenu.remove();

      scope.appendChild(contextMenu);
      const menuWidth = contextMenu.offsetWidth;
      const menuHeight = contextMenu.offsetHeight;

      if (menuWidth + event.pageX >= window.innerWidth) {
        contextMenu.style.left = event.pageX - menuWidth + 2 + "px";
      } else {
        contextMenu.style.left = event.pageX - 2 + "px";
      }

      if (menuHeight + event.pageY >= window.innerHeight) {
        contextMenu.style.top = event.pageY - menuHeight + 2 + "px";
      } else {
        contextMenu.style.top = event.pageY - 2 + "px";
      }

      setTimeout(function () {
        contextMenu.classList.add("visible");
      });

      const vm = this;
      setTimeout(function () {
        objcanvas.addEventListener("click", vm.hideContextForm);
        // scope.onclick = function (e) {
        //   vm.hideContextForm(e);
        // };
      }, 150);
    },
    hideContextForm(e) {
      const contextMenu = document.getElementById("context-from");
      if (e) {
        if (e.target.offsetParent != contextMenu) {
          contextMenu.classList.remove("visible");
        }
      } else {
         contextMenu.classList.remove("visible");
      }
    },

    updateComponent(model) {
      this.mScheduleItem = model;
      this.status = Number(model.VoyageStatusId);
      if (this.mScheduleItem.side.toUpperCase() === "PORT") {
        this.shipSideUrl =
          process.env.BASE_URL + "media/svg/saab/shipside.svg#shipside";
      } else {
        this.shipSideUrl =
          process.env.BASE_URL + "media/svg/saab/shipsiderotate.svg#shipside";
      }

      
      this.eta = moment(model.ETA).format("HH:mm");

      if (model.anchorage != "") {
        this.anchorage = moment(model.anchorage).format("HH:mm");
      } else {
        this.anchorage = "";
      }
      this.Berth = model.berthDate
        ? moment(model.berthDate).format("HH:mm")
        : "";
      this.unBerth = model.unberthDate
        ? moment(model.unberthDate).format("HH:mm")
        : "";

      this.fullaway =
        model.fullaway != "" ? moment(model.fullaway).format("HH:mm") : "";
      this.ETD = model.ETD ? moment(model.ETD).format("HH:mm") : "";

      /// WEEK-MONTH

      this.EPT = model.EPT ?? "";
      this.berthTime = model.berthTime;
      this.PortTime = model.PortTime;
    },
    refreshData(newModel, newvoyageid) {
      this.mScheduleItem = newModel;
      this.mVoyageId = newvoyageid;
      // this.getTest();
      this.calcDraw();
      
      this.updateComponent(this.mScheduleItem);
    },

    Change_Anchorage(mode, callback) {
      const state = {
        VoyageId: this.mVoyageId,
        anchorageInDate:
          mode === "clear"
            ? null
            : moment(this.currentDate).format("YYYY-MM-DDTHH:mm:ss"),
      };
      this.showOverlay = true;
      this.$store.dispatch(Update_VoyageSOF_AnchorageIn, state).then(() => {
        this.showOverlay = false;
        const errors = this.getVoyageSOFErrors;
        if (errors.length > 0) {
          this.showErrors(errors);
        } else {
          callback();
        }
      });
    },
    ReplaceSide() {
      const me = this;
      const parent = me.$parent;
      const berthSide =
        this.mScheduleItem.side.toUpperCase() === "PORT" ? 2 : 1;
      this.showOverlay = true;
      const callback = () => {
        me.showOverlay = false;
        me.mScheduleItem = parent.UpdateScheduleBerthSideByVoyageId(
          me.mVoyageId,
          berthSide
        );
        me.updateComponent(me.mScheduleItem);
      };
      this.Change_Side(berthSide, callback);
    },
    Change_Side(berthSide, callback) {
      let state = {
        VoyageId: this.mVoyageId,
        berthSide: berthSide,
        rowVersion: this.mScheduleItem.rowVersion,
      };
      this.showOverlay = true;
      this.$store.dispatch(Update_BerthSideByVoyageId, state).then(() => {
        this.showOverlay = false;
        const errors = this.getVoyageSOFErrors;
        if (errors.length > 0) {
          this.showErrors(errors);
        } else {
          callback();
        }
      });
    },

    Change_Berth(callback) {
      let VoyageBerthId = 0;
      if (this.mScheduleItem.berthDate !== "") {
        VoyageBerthId = this.mScheduleItem.id;
      }

      let state = {
        VoyageId: this.mVoyageId,
        berthDate: moment(this.currentDate).format("YYYY-MM-DDTHH:mm:ss"),
        endBollardId: Number(this.mScheduleItem.endBollardId),
        startBollardId: Number(this.mScheduleItem.startBollardId),
        berthSide: this.mScheduleItem.side === "PORT" ? 1 : 2,
        rowVersion: this.mScheduleItem.rowVersion,
        VoyageBerthId: VoyageBerthId,
      };
      this.showOverlay = true;
      this.$store.dispatch(AddOrUpdate_VoyageSOF_Berth, state).then(() => {
        this.showOverlay = false;
        const errors = this.getVoyageSOFErrors;
        if (errors.length > 0) {
          this.showErrors(errors);
        } else {
          callback();
        }
      });
    },
    Change_UnBerth(callback) {
      let state = {
        VoyageId: this.mVoyageId,
        berthDate: moment(this.mScheduleItem.berthDate).format(
          "YYYY-MM-DDTHH:mm:ss"
        ),
        unberthDate: moment(this.currentDate).format("YYYY-MM-DDTHH:mm:ss"),
        endBollardId: Number(this.mScheduleItem.endBollardId),
        startBollardId: Number(this.mScheduleItem.startBollardId),
        berthSide: this.mScheduleItem.side === "PORT" ? 1 : 2,
        rowVersion: this.mScheduleItem.rowVersion,
        VoyageBerthId: this.mScheduleItem.id,
      };
      this.showOverlay = true;
      this.$store.dispatch(AddOrUpdate_VoyageSOF_Berth, state).then(() => {
        this.showOverlay = false;
        const errors = this.getVoyageSOFErrors;
        if (errors.length > 0) {
          this.showErrors(errors);
        } else {
          callback();
        }
      });
    },
    Delete_Planfn(callback) {
      const state = {
        id: this.mScheduleItem.id,
        rowVersion: this.mScheduleItem.rowVersion,
      };
      this.showOverlay = true;
      this.$store.dispatch(Delete_VoyageSOF_Plan, state).then(() => {
        this.showOverlay = false;
        const errors = this.getVoyageSOFErrors;
        if (errors.length > 0) {
          this.showErrors(errors);
        } else {
          callback();
        }
      });
    },
    Delete_Berth(callback) {
      const state = {
        id: this.mScheduleItem.id,
        rowVersion: this.mScheduleItem.rowVersion,
      };
      this.showOverlay = true;
      this.$store.dispatch(Delete_VoyageSOF_Berth, state).then(() => {
        this.showOverlay = false;
        const errors = this.getVoyageSOFErrors;
        if (errors.length > 0) {
          this.showErrors(errors);
        } else {
          callback();
        }
      });
    },
    Delete_UnBerth(callback) {
      let state = {
        VoyageId: this.mVoyageId,
        berthDate: moment(this.mScheduleItem.berthDate).format(
          "YYYY-MM-DDTHH:mm:ss"
        ),
        unberthDate: null,
        endBollardId: Number(this.mScheduleItem.endBollardId),
        startBollardId: Number(this.mScheduleItem.startBollardId),
        berthSide: this.mScheduleItem.side === "PORT" ? 1 : 2,
        rowVersion: this.mScheduleItem.rowVersion,
        VoyageBerthId: this.mScheduleItem.id,
      };
      this.showOverlay = true;
      this.$store.dispatch(AddOrUpdate_VoyageSOF_Berth, state).then(() => {
        this.showOverlay = false;
        const errors = this.getVoyageSOFErrors;
        if (errors.length > 0) {
          this.showErrors(errors);
        } else {
          callback();
        }
      });
    },
    Change_Fullaway(callback) {
      const state = {
        VoyageId: this.mVoyageId,
        anchorageOutDate: moment(this.currentDate).format(
          "YYYY-MM-DDTHH:mm:ss"
        ),
      };
      this.showOverlay = true;
      this.$store.dispatch(Update_VoyageSOF_AnchorageOut, state).then(() => {
        this.showOverlay = false;
        const errors = this.getVoyageSOFErrors;
        if (errors.length > 0) {
          this.showErrors(errors);
        } else {
          callback();
        }
      });
    },
    Delete_Fullaway(callback) {
      const state = {
        VoyageId: this.mVoyageId,
        anchorageOutDate: null,
      };
      this.showOverlay = true;
      this.$store.dispatch(Update_VoyageSOF_AnchorageOut, state).then(() => {
        this.showOverlay = false;
        const errors = this.getVoyageSOFErrors;
        if (errors.length > 0) {
          this.showErrors(errors);
        } else {
          callback();
        }
      });
    },
    calcDraw() {
      /// For Years
      const years = this.mergeYear();
      const lines = [];
      const txtpoints = [];
      let startx = 6.25;
      for (let i = 0; i < years.length; i++) {
        startx = years[i].width * 100 + startx;
        lines.push({
          start: [startx, 175],
          end: [startx, 200],
        });
      }
      if (lines.length > 0) {
        const txtX = lines[0].start[0] / 2;
        const txtY = (200 + 175) / 2;

        txtpoints.push({
          translate: `translate(${txtX},${txtY})`,
          text: years[0].value,
        });
        for (let i = 1; i < lines.length; i++) {
          const txtX =
            lines[i - 1].start[0] +
            (lines[i].start[0] - lines[i - 1].start[0]) / 2;
          const txtY = (200 + 175) / 2;
          txtpoints.push({
            translate: `translate(${txtX},${txtY})`,
            text: years[i].value,
          });
        }
        //remove last line
        lines.pop(lines[lines.length - 1]);
      }

      // For Daye
      const days = this.mergeDaysLeft();
      const daylines = [];

      startx = 6.25;
      for (let i = 0; i < days.length; i++) {
        startx = days[i].width * 100 + startx;
        daylines.push({
          start: [startx, 150],
          end: [startx, 175],
        });
      }
      if (daylines.length > 0) {
        const txtX = daylines[0].start[0] / 2;
        const txtY = (150 + 175) / 2;
        txtpoints.push({
          translate: `translate(${txtX},${txtY})`,
          text: days[0].value,
        });
        for (let i = 1; i < daylines.length; i++) {
          const txtX =
            daylines[i - 1].start[0] +
            (daylines[i].start[0] - daylines[i - 1].start[0]) / 2;
          const txtY = (150 + 175) / 2;
          txtpoints.push({
            translate: `translate(${txtX},${txtY})`,
            text: days[i].value,
          });
        }
        //remove last line
        daylines.pop(daylines[daylines.length - 1]);
      }

      this.lines = lines.concat(daylines);
      this.textpoints = txtpoints;

      
      
    },
    mergeYear() {
      const objectProps = [
        "ETA",
        "anchorage",
        "berthDate",
        "unberthDate",
        "fullaway",
        "ETD",
      ];

      let arrayObject = objectProps.map((name) => {
        const value =
          this.mScheduleItem[name] === ""
            ? ""
            : moment(this.mScheduleItem[name]).format("MMM YYYY");
        return { name, value, width: 1, del: false };
      });

      return this.mergeArayyObject(arrayObject);
    },

    mergeDaysLeft() {
      const objectProps = [
        "ETA",
        "anchorage",
        "berthDate",
        "unberthDate",
        "fullaway",
        "ETD",
      ];

      let arrayObject = objectProps.map((name) => {
        const value =
          this.mScheduleItem[name] === ""
            ? ""
            : moment(this.mScheduleItem[name]).format("DD");
        return { name, value, width: 1, del: false };
      });

      return this.mergeArayyObject(arrayObject);
    },
    mergeDaysRight() {
      const objectProps = ["unberthDate", "fullaway", "ETD"];
      let arrayObject = objectProps.map((name) => {
        const value =
          this.mScheduleItem[name] === ""
            ? ""
            : moment(this.mScheduleItem[name]).format("DD");
        return { name, value, width: 1, del: false };
      });
      return this.mergeArayyObject(arrayObject);
    },
    mergeArayyObject(arrayObject) {
      let del = 0;
      for (let i = 1; i < arrayObject.length; i++) {
        if (
          arrayObject[i].value === arrayObject[i - 1].value ||
          arrayObject[i].value === ""
        ) {
          arrayObject[i].del = true;
          for (let j = i - 1; j >= 0; j--) {
            if (arrayObject[j].del == false) {
              arrayObject[j].width += arrayObject[i].width;
              break;
            }
          }

          del++;
        }
      }
      arrayObject = arrayObject.filter((r) => r.del === false);
      if (del === 0) return arrayObject;
      else return this.mergeArayyObject(arrayObject);
    },
    getTest() {
      this.mScheduleItem.ETA = "2021/11/01 00:00";
      this.mScheduleItem.anchorage = "2021/11/02 06:00";
      this.mScheduleItem.berthDate = "2021/11/02 08:00";
      this.mScheduleItem.unberthDate = "2021/11/05 18:00";
      this.mScheduleItem.fullaway = "2021/11/05 20:00";
      this.mScheduleItem.ETD = "2021/11/05 12:00";
    },
    getTest1() {
      this.mScheduleItem.ETA = "2020/12/28 00:00";
      this.mScheduleItem.anchorage = "2020/12/29 06:00";
      this.mScheduleItem.berthDate = "2020/12/29 08:00";
      this.mScheduleItem.unberthDate = "2021/01/05 18:00";
      this.mScheduleItem.fullaway = "2021/01/05 20:00";
      this.mScheduleItem.ETD = "2021/01/05 12:00";
    },
  },
};

// anchorage: "2021/11/06 18:00"
// berthDate: "2021/11/06 18:00"
// berthTime: "30 Hour"
// ConceptId: null
// EPT: "41 Hour"
// ETA: "2021/08/16 11:30"
// ETD: "2021/08/18 05:10"
// endBollardName: "B09"
// fullaway: "2021/11/09 00:00"
// InboundHandlingUid: 0
// InboundHandlingUpdateCount: 0
// IsAllowSave: false
// IsMARKS: false
// IsMaintenance: false
// IsPlan: false
// OutboundHandlingUid: 0
// OutboundHandlingUpdateCount: 0
// PortTime: "54 Hour"
// StartBollardName: "B02"
// unberthDate: "2021/11/08 00:00"
// VesselCallUpdateCount: 0
// VoyageId: "1011"
// VoyageStatus: "Departed"
// VoyageStatusId: "5"
// backgroundColor: "0xE0B2DD"
// borderColor: "0x7C0097"
// borderThickness: 1
// description: "Departed"
// endBollardId: (...)
// endDate: Tue Nov 09 2021 00:00:00 GMT+0330 (Iran Standard Time)
// eventHandler: ƒ ()
// foregroundColor: "0x000000"
// hasError: false
// moveLocked: true
// name: "36"
// operationTimeLocked: true
// rowVersion: "AAAAAAACGz4="
// side: "Port"
// startBollardId: "2"
// startDate: Sat Nov 06 2021 18:00:00 GMT+0330 (Iran Standard Time)
// vessel: Object
// voyageNoIn: "023W"
// voyageNoOut: "023E"
</script>

<style scoped >
.enbaled {
  cursor: pointer;
  color: green;
  font-weight: 900;
}
.filterdate {
  width: 100%;
}
#context-from {
  top: 0;
  left: 0;

  position: absolute;
  z-index: 10000;
  min-width: 408px;
  padding-left: 4px;
  padding-right: 4px;
  background-color: #fff;

  border-radius: 5px;
  transform: scale(0);
  transform-origin: top left;
}
.navi-item {
  background-color: #ffff;
}
#context-from.visible {
  transform: scale(1);
  transition: transform 100ms ease-in-out;
}

#context-from .item {
  padding: 8px 10px;
  font-size: 15px;
  color: #000000;
  font-weight: bold;
  cursor: pointer;
  border-radius: inherit;
  background-color: #fff;
}

#context-from .item:hover {
  background: #343434;
}

#context-from > .navi .navi-item .navi-link {
  color: #3f4254;
  font-weight: bold;
}
#context-from > .navi {
  width: calc(100% - 24px) !important;
  margin-inline-start: 2px !important;
}

#CSide:hover {
  fill: #425671;
}
.gSelect:hover {
  fill: skyblue;
}
.timestyle {
  font-size: 0.7em;
  font-weight: bold;
  alignment-baseline: middle;
  text-anchor: middle;
}
</style>
<style>
.mx-datepicker-popup {
  z-index: 50000 !important;
}
</style>