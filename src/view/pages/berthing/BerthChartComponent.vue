<template>
  <scrolly
    v-if="dataModel"
    class="foo h-100 w-100"
    ref="scrolly"
    @scrollchange="scrollchange"
  >
    <scrolly-viewport v-dragscroll>
      <div
        @drop="drop"
        @dragover="allowDrop"
        id="BerthChartParent"
        ref="BerthChartParent"
        class="BerthChartParent"
        style="cursor: grab"
        contenteditable="false"
        @keyup="keyCheck"
      >
        <svg
          @click="svgClick"
          style="overflow: none; pointer-events: fill; user-select: none"
          id="BerthChartSvg"
          ref="BerthChartSvg"
          v-if="berths"
          :width="vw * fw + leftOffset"
          :height="daysCaptions.length * rowHeight"
          :viewBox="
            getViewBox(
              0,
              0,
              (vw * fw + leftOffset) * zoom,
              daysCaptions.length * rowHeight * zoom
            )
          "
        >
          <defs>
            <pattern
              x="0"
              y="0"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
              id="pattern01"
              viewBox="0 0 10 10"
            >
              <path
                d="M10-5-10,15M15,0,0,15M0-5-20,15"
                fill="none"
                stroke="#999"
                style="stroke-width: 2"
              />
            </pattern>
            <filter id="f1" x="0" y="0" width="102%" height="100%">
              <feOffset result="offOut" in="SourceGraphic" dx="20" dy="20" />
              <feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" />
              <feBlend in="SourceGraphic" in2="blurOut" mode="multiply" />
            </filter>
            <filter id="feblur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <g id="berthtop">
              <g v-for="berth in berths" :key="berth.id">
                <rect
                  class="BerthContent"
                  :key="berth.id"
                  :x="berth.x * fw"
                  :width="berth.length * fw"
                  :height="berthH"
                />

                <rect
                  class="BerthBox"
                  :key="berth.id"
                  :x="berth.x * fw + 0.5"
                  :width="berth.length * fw - 0.5"
                  :height="berthH * 0.6"
                />
                <g
                  :transform="
                    getTranslate(fw * (berth.x + berth.length / 2), berthH * 0.3)
                  "
                >
                  <text alignment-baseline="middle" class="BerthName">
                    {{ berth.name }}
                  </text>
                </g>
                <line
                  :x1="fw * (berth.x + berth.length)"
                  :y1="berthH"
                  :x2="fw * (berth.x + berth.length)"
                  :y2="(daysCaptions.length - 1) * rowHeight"
                  class="dash"
                />
                <g id="bolards" v-for="bolrad in berth.bollards" :key="bolrad.id">
                  <circle
                    :cx="fw * (berth.x + bolrad.distance)"
                    :cy="berthH - 5"
                    r="3"
                    stroke-width="0"
                    class="BollardCircle"
                  />
                  <text
                    :x="fw * (berth.x + bolrad.distance)"
                    :y="berthH - 12"
                    class="BollardName"
                    alignment-baseline="bottom"
                  >
                    {{ bolrad.name }}
                  </text>
                  <!-- <line
                :x1="fw * (berth.x + bolrad.distance)"
                :y1="berthH"
                :x2="fw * (berth.x + bolrad.distance)"
                :y2="(daysCaptions.length - 1) * rowHeight"
                class="dash"
                  />-->
                </g>
              </g>
              <line x1="0" :y1="berthH - 5" :x2="vw * fw" :y2="berthH - 5" class="dash" />
            </g>
          </defs>
          <!-- Start ROWS -->
          <g
            v-for="(item, index) in daysCaptions"
            :key="'rows' + index"
            :transform="getTranslate(0, berthH + index * rowHeight)"
          >
            <!--Start Rows 8Houre Part-->
            <g
              v-for="n in 3"
              :key="'hour' + n"
              :transform="getTranslate(leftOffset, ((n - 1) * rowHeight) / 3)"
            >
              <rect
                :width="vw * fw"
                :height="(rowHeight * n) / 3"
                :class="getDayCss(n + index)"
              />
            </g>
            <!--End Rows 8Houre Part-->
            <line :x1="0" :y1="0" :x2="fw * vw" :y2="0" class="lineH" />
          </g>
          <!-- End ROWS -->

          <!-- Start Berth Breaks-->
          <g
            v-for="(item, index) in berthBreaks"
            :key="'Breaks' + index"
            :transform="getTranslate(leftOffset + item.x * fw, berthH)"
            style="pointer-events: all"
          >
            <rect
              :width="berthBreaksWidth * fw"
              :height="daysCaptions.length * rowHeight + berthH"
              class="Berthbreak"
            />
          </g>
          <!-- End Berth Breaks-->

          <!-- Start Right Slide-->
          <!-- <g 
        v-for="(item, index) in daysCaptions"
        :key="'rc' + index"
        :transform="
          getTranslate(
            scrollLeft + viewWidth - 24,
            berthH + (index + 1) * rowHeight
          ) + ' rotate(270)'
        "
      >
        <rect class="LeftDateCss" :width="rowHeight" height="24" />
        <text
          :x="rowHeight / 2"
          y="12"
          alignment-baseline="middle"
          text-anchor="middle"
          font-weight="bold"
          font-size="0.7em"
          fill="#fff"
          font-family="Calibri"
        >
          {{ item.caption }}
        </text>
          </g>-->
          <!-- End Right Slide-->
          <!-- Start NoneWorkingZone -->
          <g
            v-for="layer in noneWorkingZone"
            :key="layer.Id"
            :transform="getTranslate(layer.x, layer.y)"
            :id="layer.Id"
            v-bind:style="{ display: layer.visible ? 'inline' : 'none' }"
          >
            <rect
              :width="layer.w"
              :height="layer.h"
              class="noneWorkingZone"
              v-bind:class="{ selected: layer.selected }"
            />
            <text
              :x="layer.w / 2"
              :y="layer.h / 4"
              fill="#000"
              alignment-baseline="middle"
              text-anchor="middle "
              font-weight="bold"
              font-size="1.2rem"
              font-family="Calibri"
            >
              NoneWorkingZone
            </text>
            <image
              :x="layer.w / 2 - 50"
              :y="layer.h / 2"
              :href="
                layer.reason === 'Maintenance'
                  ? '/media/berthschedule/maintenance.png'
                  : '/media/berthschedule/none-working.png'
              "
              width="100"
              height="100"
            />
          </g>
          <!-- End NoneWorkingZone -->

          <!-- Start LineWindows -->
          <g
            v-for="layer in layers.filter((r) => r.objectType === 'lineWindows')"
            :key="layer.Id"
            :transform="getTranslate(layer.x, layer.y)"
            :id="layer.Id"
          >
            <g :transform="getTranslate(0, 0)">
              <foreignObject
                :width="layer.w"
                :height="layer.h"
                @click="layer_mousedown($event, layer)"
              >
                <line-window
                  ref="linewindowComponents"
                  :layer="layer"
                  v-if="layer.schedule && layer.objectType == 'lineWindows'"
                  @clickLineWindowData="windowLineclickData"
                  @clickdeleteWindow="deleteLineWindowclick"
                  @openLockClick="openLockClick($event, layer)"
                />
              </foreignObject>
            </g>
          </g>
          <!-- End LineWindows -->

          <!-- Start Ship -->
          <g
            v-for="layer in layers.filter((r) => r.objectType === 'ship')"
            :key="layer.Id"
            :transform="getTranslate(layer.x, layer.y)"
            :id="layer.Id"
            v-bind:style="{ display: layer.visible ? 'inline' : 'none' }"
          >
            <rect
              y="5"
              :width="layer.marginLeft"
              :height="layer.h - 10"
              fill="url(#pattern01)"
            />
            <rect
              y="5"
              :x="layer.w - layer.marginRight"
              :width="layer.marginRight"
              :height="layer.h - 10"
              fill="url(#pattern01)"
            />
            <rect
              rx="10"
              ry="10"
              :x="layer.marginLeft"
              :width="layer.w - (layer.marginLeft + layer.marginRight)"
              :height="layer.h"
              class="ship"
              v-bind:class="{ selected: layer.selected }"
            />

            <!-- <text
              :x="layer.w / 2"
              :y="layer.h / 2"
              fill="#000"
              alignment-baseline="middle"
              text-anchor="middle "
              font-weight="bold"
              font-size="1.2rem"
              font-family="Calibri"
            >
              {{ layer.schedule.vessel.name }}/ {{ layer.schedule.id }}
            </text>-->
            <g :transform="getTranslate(layer.marginLeft, 0)">
              <foreignObject
                :width="layer.w - (layer.marginLeft + layer.marginRight)"
                :height="layer.h"
                @click="layer_mousedown($event, layer)"
              >
                <voyage-view
                  ref="voyageComponents"
                  v-if="layer.schedule && layer.objectType == 'ship'"
                  @clickData="voyageclickData"
                  @deleteSchedule="deleteSchedule"
                  @openLockClick="openLockClick($event, layer)"
                  :layer="layer"
                />
              </foreignObject>
            </g>
          </g>

          <g
            v-for="grip in grips"
            :key="'mygrip' + grip.id"
            :id="grip.id"
            :transform="getTranslate(grip.x, grip.y)"
          >
            <!-- <rect
              v-if="grip.visible"
              :width="10"
              :height="10"
              class="grip "
              style="cursor: s-resize"
              v-bind:class="{ selected: grip.selected }"
            />-->
            <!-- <rect
              v-if="grip.visible"
              :width="10"
              :height="10"
              class=""
              style="cursor: s-resize"
              
            />-->

            <g v-if="grip.visible" class="ChangeItemHeight">
              <path data-v-598bd184 d="M0 -12 L-7 -5     L7 -5    Z" />
              <rect
                data-v-598bd184
                x="-4"
                y="-4"
                rx="0"
                ry="0"
                width="8"
                height="7"
                style="opacity: 0.7"
              />
              <path data-v-598bd184 d="M0 11 L-7 4 L7 4    Z" />
            </g>
          </g>
          <path
            v-for="(data, index) in pathConfilicts"
            :key="'A' + index"
            :d="data"
            class="confilict"
          />
          <!-- End Ship -->

          <!-- Start Help Lines -->

          <line
            v-if="selectObject"
            :x1="0"
            :y1="selectObject.y"
            :x2="selectObject.x"
            :y2="selectObject.y"
            class="helpLine"
          />
          <line
            v-if="selectObject"
            :x1="0"
            :y1="selectObject.y + selectObject.h"
            :x2="selectObject.x"
            :y2="selectObject.y + selectObject.h"
            class="helpLine"
          />
          <g
            v-if="selectObject"
            :transform="getTranslate(selectObject.x - 5, selectObject.y + 10)"
          >
            <text
              alignment-baseline="middle"
              text-anchor="end "
              font-weight="bold"
              font-size="0.8em"
              fill="#000"
              font-family="Calibri"
            >
              {{ selectObject.y1text }}
            </text>
          </g>
          <g
            v-if="selectObject"
            :transform="
              getTranslate(selectObject.x - 5, selectObject.y + selectObject.h - 5)
            "
          >
            <text
              alignment-baseline="middle"
              text-anchor="end "
              font-weight="bold"
              font-size="0.8em"
              fill="#000"
              font-family="Calibri"
            >
              {{ selectObject.y2text }}
            </text>
          </g>
          <g
            v-if="selectObject"
            :transform="getTranslate(selectObject.x, selectObject.y - 22)"
          >
            <!-- <g fill="rgba(199, 24, 24, 0.651)">
              <rect x="-10" y="0" width="20" height="2" />
              <rect x="0" y="0" width="2" height="20" />
            </g>-->

            <g class="BollardIcon">
              <!-- <rect x="-10" y="0" width="23" height="3" rx="2" ry="2" />
              <rect x="0" y="0" width="3" height="20" rx="2" ry="2" />-->

              <rect x="-10" y="8" width="18" height="3" rx="2" ry="2" />
              <rect x="-7" y="10" width="12" height="10" rx="2" ry="2" />
            </g>

            <text
              y="3"
              x="0"
              alignment-baseline="middle"
              text-anchor="middle "
              font-weight="bold"
              font-size="0.8em"
              fill="#000"
              font-family="Calibri"
            >
              {{ selectObject.startbolard.name }}
            </text>
          </g>
          <g
            v-if="selectObject"
            :transform="
              getTranslate(selectObject.x + selectObject.w, selectObject.y - 22)
            "
          >
            <!-- <g fill="rgba(199, 24, 24, 0.651)">
              <rect x="-10" y="0" width="20" height="2" />
              <rect x="0" y="0" width="2" height="20" />
            </g>-->

            <g class="BollardIcon">
              <!-- <rect x="-10" y="0" width="23" height="3" rx="2" ry="2" />
              <rect x="0" y="0" width="3" height="20" rx="2" ry="2" />-->
              <rect x="-10" y="8" width="18" height="3" rx="2" ry="2" />
              <rect x="-7" y="10" width="12" height="10" rx="2" ry="2" />
            </g>

            <text
              y="3"
              x="0"
              alignment-baseline="middle"
              text-anchor="middle "
              font-weight="bold"
              font-size="0.8em"
              fill="#000"
              font-family="Calibri"
            >
              {{ selectObject.endbolard.name }}
            </text>
          </g>
          <!--Lock X-->

          <g
            v-if="selectObject"
            :transform="
              getTranslate(selectObject.x + selectObject.w / 2, selectObject.y - 26)
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              width="70px"
              height="24px"
              viewBox="0 0 70 24"
              version="1.1"
              @click="SelectXAxias"
              style="cursor: default"
            >
              <g>
                <path
                  v-if="canMoveX"
                  stroke-width="0"
                  class="UnLockXY"
                  d="M15.6274517,4.55882251 L14.4693753,6.2959371 C13.9280401,5.51296885 13.0239252,5 12,5 C10.3431458,5 9,6.34314575 9,8 L9,10 L14,10 L17,10 L18,10 C19.1045695,10 20,10.8954305 20,12 L20,18 C20,19.1045695 19.1045695,20 18,20 L6,20 C4.8954305,20 4,19.1045695 4,18 L4,12 C4,10.8954305 4.8954305,10 6,10 L7,10 L7,8 C7,5.23857625 9.23857625,3 12,3 C13.4280904,3 14.7163444,3.59871093 15.6274517,4.55882251 Z"
                />
                <path
                  v-if="!canMoveX"
                  stroke-width="0"
                  class="LockXY"
                  d="M7,10 L7,8 C7,5.23857625 9.23857625,3 12,3 C14.7614237,3 17,5.23857625 17,8 L17,10 L18,10 C19.1045695,10 20,10.8954305 20,12 L20,18 C20,19.1045695 19.1045695,20 18,20 L6,20 C4.8954305,20 4,19.1045695 4,18 L4,12 C4,10.8954305 4.8954305,10 6,10 L7,10 Z M12,5 C10.3431458,5 9,6.34314575 9,8 L9,10 L15,10 L15,8 C15,6.34314575 13.6568542,5 12,5 Z"
                />
              </g>

              <text
                x="22"
                y="17"
                font-weight="bold"
                font-size="0.8em"
                fill="#000"
                font-family="Calibri"
              >
                X Lock
              </text>
            </svg>
          </g>

          <!--Lock Y-->
          <g
            v-if="selectObject"
            :transform="
              getTranslate(
                selectObject.x + selectObject.w,
                selectObject.y + selectObject.h / 2
              )
            "
            style="cursor: default"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              width="70px"
              height="24px"
              viewBox="0 0 70 24"
              version="1.1"
              @click="SelectYAxias"
              style="cursor: default"
            >
              <g>
                <path
                  v-if="canMoveY"
                  stroke-width="0"
                  class="UnLockXY"
                  d="M15.6274517,4.55882251 L14.4693753,6.2959371 C13.9280401,5.51296885 13.0239252,5 12,5 C10.3431458,5 9,6.34314575 9,8 L9,10 L14,10 L17,10 
              L18,10 C19.1045695,10 20,10.8954305 20,12 L20,18 C20,19.1045695 19.1045695,20 18,20 L6,20 C4.8954305,20 4,19.1045695 4,18 L4,12 
              C4,10.8954305 4.8954305,10 6,10 L7,10 L7,8 C7,5.23857625 9.23857625,3 12,3 C13.4280904,3 14.7163444,3.59871093 15.6274517,4.55882251 Z"
                />
                <path
                  v-if="!canMoveY"
                  stroke-width="0"
                  class="LockXY"
                  d="M7,10 L7,8 C7,5.23857625 9.23857625,3 12,3 C14.7614237,3 17,5.23857625 17,8 L17,10 L18,10 C19.1045695,10 20,10.8954305 20,12 L20,18 
              C20,19.1045695 19.1045695,20 18,20 L6,20 C4.8954305,20 4,19.1045695 4,18 L4,12 C4,10.8954305 4.8954305,10 6,10 L7,10 Z M12,5 
              C10.3431458,5 9,6.34314575 9,8 L9,10 L15,10 L15,8 C15,6.34314575 13.6568542,5 12,5 Z"
                />
              </g>

              <text
                x="22"
                y="17"
                font-weight="bold"
                font-size="0.8em"
                fill="#000"
                font-family="Calibri"
              >
                Y Lock
              </text>
            </svg>
          </g>
          <!-- End Help Lines -->

          <!-- Start Top Berths-->
          <use
            xlink:href="#berthtop"
            :transform="getTranslate(leftOffset, scrollTop * zoom)"
          />
          <!-- End Top Berths-->

          <!--Start Left Side-->
          <g
            v-for="(item, index) in daysCaptions"
            :key="'leftside' + index"
            :transform="getTranslate(scrollLeft * zoom, berthH + index * rowHeight)"
          >
            <rect class="LeftSide" :width="leftOffset" :height="rowHeight" />
            <g
              v-for="h in 24"
              :key="'recthoure' + h"
              :transform="
                getTranslate(
                  leftOffset - rowHeight / 24 - 1,
                  0.5 + ((h - 1) * rowHeight) / 24
                )
              "
            >
              <rect
                :height="rowHeight / 24 - 0.5"
                :width="rowHeight / 24"
                class="LeftSideTime"
              />
            </g>

            <text
              :x="leftOffset - rowHeight / 24 - 5"
              y="12"
              class="LeftSideName"
              alignment-baseline="middle"
            >
              {{ item.caption }}
            </text>
          </g>
          <g :transform="getTranslate(scrollLeft * zoom, scrollTop * zoom)">
            <!-- <defs>
              <linearGradient id="TitleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#a0c4d3;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#cfdfe5;stop-opacity:1" />
              </linearGradient>
            </defs>-->

            <!-- <rect :width="leftOffset" :height="berthH" fill="red" /> -->

            <rect :width="leftOffset + 1" :height="berthH + 1" fill="#c0d6df" />
            <rect :width="leftOffset + 1" :height="berthH * 0.6" fill="#a0c4d3" />
            <foreignObject :width="leftOffset" :height="berthH">
              <div class="TitleContent" contenteditable="false">
                <!-- <div
                  class="TitleDate"
                >{{ titleDate }}<br>{{ titleYear }}</div>-->

                <div class="TitleDate">
                  <div>{{ titleDate }}</div>
                  <div>{{ titleYear }}</div>
                </div>

                <!-- <a class="btn btn-icon btn-light-primary">
                  <img style="margin: auto" src="/media/chart/calender.svg" />
                </a>-->
              </div>
            </foreignObject>
          </g>

          <!--End Left Side-->
        </svg>
      </div>
    </scrolly-viewport>

    <scrolly-bar axis="y"></scrolly-bar>
    <scrolly-bar axis="x"></scrolly-bar>
  </scrolly>
</template>

<script lang="js">
import { dragscroll } from "vue-dragscroll";
//import { Scrolly, ScrollyViewport, ScrollyBar } from 'vue-scrolly';
//import { Scrolly, ScrollyViewport, ScrollyBar } from '@/src/srcolly/index';

import moment from "moment";
import Panzoom from "@panzoom/panzoom";
import * as turf from "@turf/turf";
import voyageView from "./voyageView.vue";
import lineWindow from "./lineWindow.vue";

export default {

  name: "BerthChartComponent",
  components: {
    // Scrolly,
    // ScrollyViewport,
    // ScrollyBar,
    voyageView,
    lineWindow
  },
  directives: {
    dragscroll,


  },
  props: ["Mode"],
  emits: ["dropScheduleItem", "clickData", "deleteSchedule", "clickLineWindowData", "clickdeleteWindow"]
  ,
  data: () => {
    return {
      dataModel: null,
      fw: 3, //Fact for Chart Width
      vw: 0, // Max Chart Width
      rowHeight: 200, //is Fixed
      berthH: 55, //Berth Height
      berthBreaksWidth: 5,
      berths: [],
      bolards: [],
      layers: [],
      daysCaptions: [],
      grips: [],
      berthBreaks: [],
      noneWorkingZone: [],
      lineWindows: [],
      //Scroll Change
      scrollTop: 0,
      scrollLeft: 0,
      viewWidth: 0,
      leftOffset: 90,
      //Zoom
      zoom: 1,
      //Pan
      panzoom: null,
      panzoom_grip: null,
      panzoom_parent: null,
      gripMoveing: false,
      selectObject: null,
      pathConfilicts: [],
      startDate: Date,
      canMoveX: true,
      canMoveY: true,
      scrollLayout: null,
      forceScroll: false,
      forceScrollDate: null

    };
  },

  mounted() {
    // setTimeout(() => {
    //   this.onChartResize();
    // }, 200);
    //window.addEventListener("resize", this.onChartResize, true);
    window.addEventListener("scroll", this.onChartScroll, true);
    // window.addEventListener("keyup", this.keyCheck, true);
  },
  beforeDestroy() {
    // window.removeEventListener("keyup", this.keyCheck, true);
    //window.removeEventListener("resize", this.onChartResize, true);
    window.removeEventListener("scroll", this.onChartScroll, true);
  },
  computed: {
    titleDate: function () {

      if (this.startDate) {
        return `${moment(this.startDate).format("DD MMM")} - ${moment(this.endDate).format("DD MMM")}`.toUpperCase();
      }
      return "";
    },
    titleYear: function () {

      if (this.startDate) {
        const StartYear = moment(this.startDate).format("YYYY");
        const EndYear = moment(this.endDate).format("YYYY");
        if (Number(StartYear) == Number(EndYear)) {
          return StartYear;
        }
        else {
          return `${StartYear} - ${EndYear}`;
        }

      }
      return "";
    }
  },
  methods: {
    // setForceScrollDate(date){
    //     this.forceScroll=true;
    //     this.forceScrollDate=date;

    //   },
    //   getEndofRender() {
    //       const scrolly=this.$refs.scrolly;
    //         
    //     if (this.forceScroll && scrolly && this.scrollLayout) {
    //       this.forceScroll=false;
    //        // this.$forceUpdate();
    //       this.scrollToDate(this.forceScrollDate);
    //       this.$forceUpdate();
    //     }
    //     return "";
    //   },
    scrollToDate(date, bolardid) {

      const y = this.dateToy(date);
      let x = this.leftOffset;
      if (bolardid) {
        x = this.bolardTox(bolardid);
      }
      this.scrollTOXY(x, y);
    },
    scrollToVoyageId(voyageid) {
      const layer = this.layers.find(
        (layer) =>
          layer.schedule.voyage.voyageId === voyageid
      );
      if (layer) {
        this.scrollToLayer(layer);
      }
    },

    scrollToLayer(layer) {
      this.scrollTOXY(layer.x, layer.y);
    },
    scrollTOXY(x, y) {
      const scrolly = this.$refs.scrolly;
      let scrollTop = 0;
      let scrollLeft = 0;
      if (this.scrollLayout) {
        scrollTop = this.scrollLayout.y.scrollTop;
        scrollLeft = this.scrollLayout.x.scrollLeft;

      }
      scrolly.refreshScrollLayout((x - this.leftOffset) / this.zoom - scrollLeft - 5, (y - this.berthH) / this.zoom - scrollTop - 5);

    },
    scrollchange(scrollLayout) {

      this.scrollLayout = scrollLayout;



    },
    // gotoPosition() {
    //   const findlayer = this.layers[0];
    //   
    //   const scrolly = this.$refs.scrolly;
    //   scrolly.refreshScrollLayout(0, this.rowHeight);



    // },
    findNextBerthLeft() {
      const scrollLeft = (5 + this.scrollLayout.x.scrollLeft) / this.fw;

      const finds = this.berths.filter(b => b.x < scrollLeft);
      if (finds.length === 0 || finds.length === this.berths.length)
        return this.berths[1].x * this.fw;

      if (scrollLeft - finds[finds.length - 1].x > 10) {
        const ef = finds[finds.length - 1].length - (scrollLeft - finds[finds.length - 1].x);
        return ef * this.fw;
      } else {
        const df = finds[finds.length - 1].length;
        return df * this.fw;
      }



    },
    findBeforeBerthLeft() {

      const scrollLeft = this.scrollLayout.x.scrollLeft / this.fw;

      const finds = this.berths.filter(b => b.x < scrollLeft);
      if (finds.length < 1 || finds.length === this.berths.length)
        return 0;
      const df = this.berths[finds.length].x - this.berths[finds.length - 1].x;
      return -this.fw * df;
    },
    deleteSchedule(schedule) {
      this.$emit("deleteSchedule", schedule);
      // this.gotoPosition(schedule);

    },

    deleteLineWindowclick(schedule) {
      this.$emit("clickdeleteWindow", schedule);

    },
    SelectClick(eventDate) {
      this.$nextTick(() => {
        this.layer_mousedown(eventDate.event, eventDate.layer);
      });

    },
    voyageclickData(data) {

      this.$emit("clickData", data);
    },
    openLockClick(data, layer) {
      if (layer.selected == false) {
        this.layer_mousedown({ ctrlKey: true }, layer);
      }
      else {
        this.UnSelectLayer(layer);
        // this.layer_mousedown(event, layer);
      }
    },
    


    windowLineclickData(data) {
      this.$emit("clickLineWindowData", data);
    },

    allowDrop(ev) {


      if (ev.srcElement.id === "BerthChartSvg") {

        ev.preventDefault();

      }


    },
    drop(event) {


      const offsetX = event.dataTransfer.getData("offsetX");
      const offsetY = event.dataTransfer.getData("offsetY");
      const rect = event.srcElement.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const topleftX = x - offsetX;
      const topleftY = y - offsetY;
      const startBollard = this.xToBolard(topleftX * this.zoom);
      const startDatePlan = this.yToDate(topleftY * this.zoom);
      const data = {
        startBollard,
        startDatePlan,
        event

      };
      this.$emit('dropScheduleItem', data);
    },
    getMaxHeight() {
      return this.daysCaptions.length * this.rowHeight + this.berthH;
    },
    getTransform(x, y) {
      return (
        "cursor: move; user-select: none; touch-action: none; transform-origin: 0px 0px; transition: none 0s ease 0s; transform: scale(1) translate(" +
        x +
        ", " +
        y +
        ");"
      );
      //return "transition: none 0s ease 0s;transform:scale(1) translate(" + x + "," + y + ");";
    },
    SelectXAxias() {
      if (!this.selectObject.layer.canMove) {
        this.canMoveX = false;
        return;
      }

      if (this.selectObject) {
        this.canMoveX = !this.canMoveX;
      }
    },
    SelectYAxias() {
      if (!this.selectObject.layer.canMove) {
        this.canMoveY = false;
        return;
      }
      if (this.selectObject) {
        this.canMoveY = !this.canMoveY;
      }
    },
    //Key Press Esc UnSelect Layer
    keyCheck(e) {


      if (e.keyCode === 27) {
        if (this.selectObject) {
          this.UnSelectLayer(this.selectObject.layer);
        }
      }
      if (e.code === "KeyA") {

        this.zoomIn();

      }
      if (e.code === "KeyZ") {
        this.zoomOut();
      }
      if (e.code === "KeyS") {
        if (this.rowHeight < 500) {
          this.rowHeight += 20;
          this.renderData(this.dataModel);
        }
      }
      if (e.code === "KeyX") {
        if (this.rowHeight > 40) {
          this.rowHeight -= 20;
          this.renderData(this.dataModel);
        }
      }
      if (e.code === "KeyQ") {
        if (this.fw < 12) {
          this.fw += 0.5;
          this.renderData(this.dataModel);
        }
      }
      if (e.code === "KeyW") {
        if (this.fw > 2) {
          this.fw -= 0.5;
          this.renderData(this.dataModel);
        }
      }

      if (e.code === "ArrowUp") {
        const scrolly = this.$refs.scrolly;
        scrolly.refreshScrollLayout(0, -this.rowHeight);
      }
      if (e.code === "ArrowDown") {
        const scrolly = this.$refs.scrolly;
        scrolly.refreshScrollLayout(0, this.rowHeight);
      }
      if (e.code === "ArrowLeft") {
        const scrolly = this.$refs.scrolly;
        const dx = this.findBeforeBerthLeft();

        scrolly.refreshScrollLayout(dx, 0);
      }
      if (e.code === "ArrowRight") {
        const scrolly = this.$refs.scrolly;
        const dx = this.findNextBerthLeft();
        scrolly.refreshScrollLayout(dx, 0);
      }
      //ArrowRight
      if (e.code === "KeyF4") {
        this.gotoPosition();
      }

    },
    zoomIn() {
      this.zoom += -0.2;
      if (this.zoom < 0.1) {
        this.zoom = 0.1;
      }
    },
    zoomOut() {
      if (this.zoom < 20) {
        this.zoom += 0.2;
      }
    },
    ChangeBollardScale(val) {
      this.fw = val;
      if (this.dataModel) {
        this.renderData(this.dataModel);
      }
    },
    ChangeTimeScale(val) {
      this.rowHeight = val;
      if (this.dataModel) {
        this.renderData(this.dataModel);
      }

    },
    svgClick(event) {

      if (this.gripMoveing) return;
      if (event.pointerType !== "mouse") return;
      if (event.srcElement.id == "BerthChartSvg") {
        if (this.selectObject) {
          this.UnSelectLayer(this.selectObject.layer);
        }
      }
    },

    getTranslateGrip(layer) {
      const x = layer.x + layer.w / 2;
      const y = layer.y + layer.h;

      return "Translate(" + x + "," + y + ")";
    },
    Transform(elem, trans) {
      if (!this.panzoom) return;
      const selectLayer = this.layers.find((y) => y.Id === elem.id);

      if (trans.x === 0 && trans.y === 0) {
        trans.x = selectLayer.x;
        trans.y = selectLayer.y;
      }
      let newX = trans.x;
      let newY = trans.y;
      if (!this.canMoveX) {
        newX = selectLayer.x;
      }
      if (!this.canMoveY) {
        newY = selectLayer.y;
      }
      // Control left side
      if (this.canMoveX) {
        const x0 = this.leftOffset + this.fw * this.bolards[0].x;
        if (newX < x0) {
          newX = x0;
        }
      }

      const rectnew = {
        x: newX,
        y: newY,
        w: selectLayer.w,
        h: selectLayer.h,
        Id: elem.id,
        objectType: selectLayer.objectType
      };
      this.conflictCheck(rectnew);

      this.panzoom.setStyle(
        "transform",
        `scale(${trans.scale}) translate(${newX}px, ${newY}px)`
      );

      // if (this.selectObject.canMoveX) {
      //   newX = selectLayer.x;
      // }
      // if (this.selectObject.canMoveY) {
      //   newY = selectLayer.y;
      // }

      this.selectObject = {
        layer: selectLayer,
        x: newX,
        y: newY,
        h: selectLayer.h,
        w: selectLayer.w,
        y1text: moment(this.yToDate(newY)).format("ddd, MMM DD HH:mm"),
        y2text: moment(this.yToDate(newY + selectLayer.h)).format(
          "ddd, MMM DD HH:mm"
        ),
        dt: this.deltaY(newY, newY + selectLayer.h),
        startbolard: this.xToBolard(newX),
        endbolard: this.xToBolard(newX + selectLayer.w),
      };


    },
    bolardTox(bolardid) {
      const bolardx = this.bolards.find(b => b.id === bolardid).x;
      return this.fw * bolardx + this.leftOffset;
    },
    xToBolard(x) {
      const bolrads = this.bolards.filter(
        (b) => b.x <= (x - this.leftOffset) / this.fw
      );

      const last = bolrads[bolrads.length - 1];
      return last;
    },
    yToDate(y) {
      //y=rowHeigh * (d1-d2)/(1000*3600*24)+BerthH ;
      const deltaDate = ((y - this.berthH) * (1000 * 3600 * 24)) / this.rowHeight;
      return new Date(this.startDate.getTime() + deltaDate);
    },
    deltaY(y1, y2) {
      const def = this.yToDate(y2).getTime() - this.yToDate(y1).getTime();
      const h = def / (1000 * 3600);
      if (h > 24) {
        let d = h - 24 * Math.floor(h / 24);
        return `${Math.floor(h / 24)} day ${Math.floor(d)} hour`;
      } else {
        return `${Math.floor(h)} hour`;
      }
    },

    dateToy(date) {
      const days =
        Math.abs(date.getTime() - this.startDate.getTime()) / (1000 * 3600 * 24); //off days
      return days * this.rowHeight + this.berthH;
    },

    roundMinutes(date) {
      date.setHours(date.getHours() + Math.round(date.getMinutes() / 60));
      date.setMinutes(0, 0, 0); // Resets also seconds and milliseconds

      return date;
    },

    setPanZoom(layer) {
      const elem = document.getElementById(layer.Id);

      const me = this;

      this.panzoom = Panzoom(elem, {
        startX: layer.x,
        startY: layer.y,
        setTransform: (a, b) => {
          if (me.panzoom) me.Transform(a, b);
        },
      });
      // this.panzoom.bind();
      //disableXAxis  const me = this;
      elem.addEventListener("panzoomstart", () => {
        me.grips.forEach((g) => (g.visible = false));
        me.selectObject = {
          layer: layer,
          x: layer.x,
          y: layer.y,
          h: layer.h,
          w: layer.w,
          y1text: moment(me.yToDate(layer.y)).format("ddd, MMM DD HH:mm"),
          y2text: moment(me.yToDate(layer.y + layer.h)).format(
            "ddd, MMM DD HH:mm"
          ),
          startbolard: me.xToBolard(layer.x),
          endbolard: me.xToBolard(layer.x + layer.w),
        };
      });
      elem.addEventListener("panzoomend", (event) => {
        const x = event["detail"]["x"];
        const y = event["detail"]["y"];
        const id = event.target["id"];




          me.UpdateLayerPosition(id, x, y);
          me.MoveGrip(id, x, y);



      });
    },
    UpdateLayerPosition(id, x, y) {
      const layer = this.layers.find((y) => y.Id === id);

      if (this.canMoveY) {
        const newDate = this.roundMinutes(this.yToDate(y));
        y = this.dateToy(newDate);
        layer.y = y;
      }

      // const x0 = (x - this.leftOffset) / this.fw;
      //Move to line bolard
      if (this.canMoveX) {
        layer.x = x;
        //  const beforBolards = this.bolards.filter((r) => r.x <= x0);
        //  const bolardx = beforBolards[beforBolards.length - 1].x;
        //layer.x = bolardx * this.fw + this.leftOffset;
      }
       this.updateModel(layer);
      if(this.panzoom){
     this.panzoom.pan(layer.x, layer.y, { animate: true });}
     else{
       alert("panzoom null ");
     }
      const me = this;
      setTimeout(() => {
        me.MoveGrip(id, layer.x, layer.y);
      });


    },
    updateModel(layer) {

      if (layer.objectType === "ship") {

        const schedule = this.dataModel.schedules.find(sh => Number(sh.voyage.voyageId) ===Number(layer.schedule.voyage.voyageId));

        if(schedule){
        schedule.startBollardId = this.xToBolard(layer.x).id;
        schedule.endBollardId = this.xToBolard(layer.x + layer.w).id;
        schedule.startDate = this.yToDate(layer.y);
        schedule.endDate = this.yToDate(layer.y + layer.h);

        const end = this.bolards.find(b => b.id === schedule.endBollardId);
        schedule.endBollardName = end.name;
        const start = this.bolards.find(b => b.id === schedule.startBollardId);
        schedule.StartBollardName = start.name;
        }else{
          console.error("Can not found schedule =>",layer.schedule.voyage.voyageId)
        }



      }

      if (layer.objectType === "lineWindows") {
        const schedule = this.dataModel.lineWindows.find(sh => sh.id === layer.schedule.id);
        schedule.startBollardId = this.xToBolard(layer.x).id;
        schedule.endBollardId = this.xToBolard(layer.x + layer.w).id;
        schedule.startDate = this.yToDate(layer.y);
        schedule.endDate = this.yToDate(layer.y + layer.h);
        schedule.IsAllowSave = true;
         const end = this.bolards.find(b => b.id === schedule.endBollardId);
        schedule.endBollardName = end.name;
        const start = this.bolards.find(b => b.id === schedule.startBollardId);
        schedule.StartBollardName = start.name;

      }

      if(this.$refs.voyageComponents){
      this.$refs.voyageComponents.forEach(c => {
         
        if (c.model) {
          if (c.model.Id === layer.Id) {
            if (c.updateModel)
              c.updateModel(layer.schedule);
          }
        }
      })
      }
      //linewindowComponents
         if(this.$refs.linewindowComponents){

       this.$refs.linewindowComponents.forEach(c => {
      
        if (c.model) {
          if (c.model.Id === layer.Id) {
             if (c.updateModel){
                 
                c.updateModel(layer.schedule);
             }
          }
        }
      })
         }




    },
    MoveGrip(id, x, y) {
      const grip = this.grips.find((g) => g.link === id);
      const layer = this.layers.find((y) => y.Id === id);
      grip.x = x + layer.w / 2 - grip.w / 2;
      grip.y = y + layer.h;
      if (layer.canTimeMove) {
        grip.visible = true;
      } else {
        grip.visible = false;

      }

      if (this.panzoom_grip) {
        this.panzoom_grip.pan(grip.x, grip.y, { animate: false });
      }
    },
    setGripPanZoom(grip) {
      if (this.panzoom_grip != null) {
        this.panzoom_grip.destroy();
        this.panzoom_grip = null;
      }
      // const elem = this.BerthChartSvg.querySelector("#" + grip.id) as HTMLElement;
      const elem = document.getElementById(grip.id);
      const me = this;

      this.panzoom_grip = Panzoom(elem, {
        startX: grip.x,
        startY: grip.y,
        setTransform: (a, b) => {
          me.TransformGrip(a, b);
        },
      });
      this.panzoom_grip.bind();
      //disableXAxis
      elem.addEventListener("panzoomstart", () => {
        me.gripMoveing = true;
      });
      elem.addEventListener("panzoomend", (event) => {
        me.grips.forEach((g) => (g.visible = true));

        const x = event["detail"]["x"];
        const y = event["detail"]["y"];
        this.resizeLayer(elem.id, x, y);

        //if click svg pass
        setTimeout(() => {
          this.gripMoveing = false;
        }, 200);


      });
    },
    TransformGrip(elem, trans) {
      if (trans.x === 0 && trans.y === 0) {
        return;
      }
      const grip = this.grips.find((g) => g.id == elem.id);
      if (this.gripMoveing) {
        const layer = this.layers.find((y) => y.Id === grip.link);
        const y = trans.y;
        const deltah = y - (layer.y + layer.h);
        layer.h = layer.h + deltah;

        if (this.selectObject) {
          this.selectObject.h = layer.h;
          this.selectObject.y2text = moment(this.yToDate(trans.y)).format(
            "ddd, MMM DD HH:mm"
          );

        }
      }
      if(this.panzoom_grip)
      this.panzoom_grip.setStyle(
        "transform",
        `scale(${trans.scale}) translate(${grip.x}px, ${trans.y}px)`
      );
    },
    resizeLayer(id, x, y) {
      this.grips.forEach((g) => (g.visible = false));

      const grip = this.grips.find((g) => g.id === id);
      const layer = this.layers.find((y) => y.Id === grip.link);
      const deltah = y - (layer.y + layer.h);
      layer.h = layer.h + deltah;
      grip.visible = true;

      this.updateModel(layer);

    },

    getDataModel() {

      return this.dataModel;
    },

    // onChartResize() {
    //   // const el = this.BerthChartParent; //.querySelector("#BerthChartParent");
    //   // if (el) {
    //   //   this.viewWidth = el.clientWidth;
    //   // }
    // },
    onChartScroll(e) {
      if (e.srcElement.className === "scrolly-viewport") {
        const parent = e.srcElement;


        const scrollTop = parent.scrollTop;
        const scrollLeft = parent.scrollLeft;
        //   this.viewWidth = parent.clientWidth; //- (20 * 1) / this.devicePixelRatio;
        this.scrollTop = Math.round(scrollTop);
        this.scrollLeft = Math.round(scrollLeft);
      }

    },

    clearData() {
      this.layers.forEach(layer=>{

         const el= document.getElementById(layer.Id);
         el.attributeStyleMap.clear()
         //obj.removeAttribute('style')


      })


      if (this.selectObject) {
        this.UnSelectLayer();
        this.selectObject=null;
      }
      if (this.panzoom_grip != null) {
        this.panzoom_grip.destroy();
        this.panzoom_grip = null;
      }
      if (this.panzoom) {
        this.panzoom.resetStyle();
        this.panzoom.destroy();
        this.panzoom = null;
      }
      this.berths = [];
      this.bolards = [];
      this.berthBreaks = [];
      this.daysCaptions = [];
      this.layers = [];
      this.noneWorkingZone = [];
      this.grips = [];

    },
    renderData(res, option) {
      //const me = this;
      //Set Options
      if (option) {
        this.rowHeight = option.timeScale;
        this.fw = option.bollardScale;
      }

      this.clearData();
      this.$forceUpdate();
      this.renderInnerData(res);
      this.$forceUpdate();
      // this.$nextTick(() => {
      //   me.renderInnerData(res);
      // });





    },
    renderInnerData(res) {

      this.dataModel = res;
      let s = 0;
      const day1 = new Date(res.startDate);
      const day2 = new Date(res.endDate);
      this.startDate = day1;
      this.endDate = day2;
      const daycount =
        Math.abs(day2.getTime() - day1.getTime()) / (1000 * 3600 * 24);

      for (let i = 0; i < res.berths.length; i++) {
        const berth = res.berths[i];
        berth["x"] = s;
        s = s + berth.length;
        if (!berth.connected) {
          this.berthBreaks.push({
            x: s - this.berthBreaksWidth / 2,
            berth: berth,
          });
        }
        berth.bollards.forEach((b) => {
          b["x"] = berth["x"] + b.distance;
          b["berthId"] = berth.id;
          this.bolards.push(b);
        });
        this.berths.push(berth);
      }

      this.vw = s;

      for (let i = 0; i < daycount; i++) {
        const newDay = new Date(day1.getTime() + i * (1000 * 3600 * 24));
        //newDay.setDate(day1.getDate() + i);

        this.daysCaptions.push({
          row: i + 1,
          date: newDay,
          caption: moment(newDay).format("ddd, MMM DD"),
        });
      }
   //noneWorkingZone
        this.dataModel.schedule_NoneWorkingZone.forEach((item) => {
        //const layer = new Layer(item, day1);
        const layer = {};
        layer.schedule = item;
        const startBolard = this.bolards.find(
          (b) => Number(b.id) === Number(item.startBollardId)
        );
        const endBolard = this.bolards.find(
          (b) => Number(b.id) === Number(item.endBollardId)
        );
        layer.x = this.leftOffset + this.fw * startBolard["x"];

        layer.w = (endBolard["x"] - startBolard["x"]) * this.fw;
        const startdate = new Date(item.startDate);
        const enddate = new Date(item.endDate);
        const startY =
          Math.abs(startdate.getTime() - day1.getTime()) / (1000 * 3600 * 24);
        const EndY =
          Math.abs(enddate.getTime() - day1.getTime()) / (1000 * 3600 * 24);
        layer.y = startY * this.rowHeight + this.berthH;
        layer.h = (EndY - startY) * this.rowHeight;
        layer.Id = "NoneWorkingZone" + this.noneWorkingZone.length;
        layer.objectType = "NoneWorkingZone";
        layer.canMove = false;
        layer.canSelect = false;
        layer.visible = true;
        this.noneWorkingZone.push(layer);
      });
   //schedules
      for(let i=0;i<this.dataModel.schedules.length;i++){
        const item=this.dataModel.schedules[i];
        //const layer = new Layer(item, day1);
        const layer = {};
        layer.schedule = item;

        const startBolard = this.bolards.find(
          (b) => Number(b.id) === Number(item.startBollardId)
        );

        layer.x = this.leftOffset + this.fw * startBolard["x"];
        layer.w = (item.voyage.marginLeft + item.voyage.marginRight + Number(item.vessel.loa)) * this.fw;
        // if (item.voyage.side === "Port") {
        //   layer.marginLeft = item.voyage.marginLeft * this.fw;
        //   layer.marginRight = item.voyage.marginRight * this.fw;
        // } else {
        //   layer.marginRight = item.voyage.marginLeft * this.fw;
        //   layer.marginLeft = item.voyage.marginRight * this.fw;
        // }
         layer.marginLeft = item.voyage.marginLeft * this.fw;
          layer.marginRight = item.voyage.marginRight * this.fw;
        const startdate = new Date(item.startDate);
        const enddate = new Date(item.endDate);
        const startY =
          Math.abs(startdate.getTime() - day1.getTime()) / (1000 * 3600 * 24);
        const EndY =
          Math.abs(enddate.getTime() - day1.getTime()) / (1000 * 3600 * 24);
        layer.y = startY * this.rowHeight + this.berthH;
        layer.h = (EndY - startY) * this.rowHeight;

        layer.tag = item.voyage.voyageId;

        layer.Id = "layer" + this.layers.length;
        layer.objectType = "ship";

        layer.canMove = !item.moveLocked;
        layer.canTimeMove = !item.moveTimeLocked;
        if (layer.canMove === false && layer.canTimeMove === false) {
          layer.canSelect = false;
        } else {
          layer.canSelect = true;
        }

        layer.selected = false;
        layer.visible = true;
        layer.Bottomgrip = {
          x: layer.x + layer.w / 2,
          y: layer.y + layer.w / 2,
          w: 10,
          h: 10,
          objectType: "grip",
          visible: false,
          link: layer.Id,
          id: layer.Id + "_grip",
        };





        if (EndY - startY>=0) {
          this.layers.push(layer);
        }

      }
//lineWindows
    if(this.dataModel.lineWindows){
      for(let i=0;i<this.dataModel.lineWindows.length;i++)
           {
               const item=this.dataModel.lineWindows[i];
        //const layer = new Layer(item, day1);
        const layer = {};
        layer.schedule = item;
        const startBolard = this.bolards.find(
          (b) => Number(b.id) === Number(item.startBollardId)
        );
        const endBolard = this.bolards.find(
          (b) => Number(b.id) === Number(item.endBollardId)
        );
        layer.x = this.leftOffset + this.fw * startBolard["x"];

        layer.w = (endBolard["x"] - startBolard["x"]) * this.fw;
        const startdate = new Date(item.startDate);
        const enddate = new Date(item.endDate);
        const startY =
          Math.abs(startdate.getTime() - day1.getTime()) / (1000 * 3600 * 24);
        const EndY =
          Math.abs(enddate.getTime() - day1.getTime()) / (1000 * 3600 * 24);
        layer.y = startY * this.rowHeight + this.berthH;
        layer.h = (EndY - startY) * this.rowHeight;
        layer.Id = "lineWindows" + this.layers.length;
        layer.objectType = "lineWindows";

        layer.canMove = !item.moveLocked;
        layer.canTimeMove = !item.moveTimeLocked;
        if (layer.canMove === false && layer.canTimeMove === false) {
          layer.canSelect = false;
        } else {
          layer.canSelect = true;
        }

        layer.selected = false;
        layer.visible = true;
        layer.Bottomgrip = {
          x: layer.x + layer.w / 2,
          y: layer.y + layer.w / 2,
          w: 10,
          h: 10,
          objectType: "grip",
          visible: false,
          link: layer.Id,
          id: layer.Id + "_grip",
        };
        if (EndY - startY > 0) {
          this.layers.push(layer)
        }

      } ;
      }

      this.grips = this.layers.map((r) => r.Bottomgrip);








    },
    showLineWindows(res) {
      const day1 = new Date(this.startDate);
      this.lineWindows = res;
      const newArrayLayesr = [];
      res.forEach((item) => {
        //const layer = new Layer(item, day1);
        const layer = {};
        layer.schedule = item;
        const startBolard = this.bolards.find(
          (b) => Number(b.id) === Number(item.startBollardId)
        );
        const endBolard = this.bolards.find(
          (b) => Number(b.id) === Number(item.endBollardId)
        );
        layer.x = this.leftOffset + this.fw * startBolard["x"];

        layer.w = (endBolard["x"] - startBolard["x"]) * this.fw;
        const startdate = new Date(item.startDate);
        const enddate = new Date(item.endDate);
        const startY =
          Math.abs(startdate.getTime() - day1.getTime()) / (1000 * 3600 * 24);
        const EndY =
          Math.abs(enddate.getTime() - day1.getTime()) / (1000 * 3600 * 24);
        layer.y = startY * this.rowHeight + this.berthH;
        layer.h = (EndY - startY) * this.rowHeight;
        layer.Id = "lineWindows" + newArrayLayesr.length;
        layer.objectType = "lineWindows";

        layer.canMove = !item.moveLocked;
        layer.canTimeMove = !item.moveTimeLocked;
        if (layer.canMove === false && layer.canTimeMove === false) {
          layer.canSelect = false;
        } else {
          layer.canSelect = true;
        }

        layer.visible = true;
        layer.Bottomgrip = {
          x: layer.x + layer.w / 2,
          y: layer.y + layer.w / 2,
          w: 10,
          h: 10,
          objectType: "grip",
          visible: false,
          link: layer.Id,
          id: layer.Id + "_grip",
        };
        if (EndY - startY > 0) {
          newArrayLayesr.push(layer)
        }

      });
      this.layers = newArrayLayesr.concat(this.layers);
      this.grips = this.layers.map((r) => r.Bottomgrip);
    },
    removeLineWindows() {
      this.layers = this.layers.filter(y => y.objectType !== "lineWindows");
    },

    getLineWindows() {
      return this.dataModel.lineWindows;
    },

    getTranslate(x, y) {
      return "translate(" + x + "," + y + ")";
    },
    getViewBox(x, y, w, h) {
      return `${x} ${y} ${w} ${h}`;
    },
    getDayCss(index) {
      if (Math.floor(index / 2) == index / 2) return "days1";
      else return "days2";
    },

    fakeGroup() {
      const items = [
        {
          id: "layer1",
          x: 400,
          y: 400,
          w: 200,
          h: 200,
          objectType: "ship",
          canMove: false,
          selected: false,
          visible: true,
        },
        {
          id: "layer2",
          x: 700,
          y: 200,
          w: 200,
          h: 200,
          objectType: "ship",
          canMove: false,
          selected: false,
          visible: true,
        },
        {
          id: "layer3",
          x: 1000,
          y: 400,
          w: 200,
          h: 200,
          objectType: "ship",
          canMove: false,
          selected: false,
          visible: true,
        },
      ];
      return items;
    }
    ,
    layer_mousedown(event, layer) {

      if (!event.ctrlKey) return;
      const se = this.layers.find((y) => y.selected === true);
      //layer.visible = false;
      if (se && se.Id !== layer.Id) {
        this.UnSelectLayer(se);
        setTimeout(() => {
          this.layer_mousedown(event, layer);
        });
        return;
      }
      if (event.ctrlKey && layer.canSelect) {
        this.SelectLayer(layer);
      } else {
        this.UnSelectLayer(layer);
      }
      // setTimeout(() => {
      //   layer.visible = true;
      // });
    },
    SelectLayer(layer) {

      this.layers.forEach((g) => (g.selected = false));
      layer.selected = true;
      this.grips.forEach((g) => (g.visible = false));

      const grip = this.grips.find((g) => g.link == layer.Id);
      grip.x = layer.x + layer.w / 2;
      grip.y = layer.y + layer.h;

      if (layer.canMove) {
        this.canMoveX = true;
        this.canMoveY = true;
      } else {
        this.canMoveX = false;
        this.canMoveY = false;


      }

      this.setPanZoom(layer);
      if (layer.canTimeMove) {
        grip.visible = true;
        this.SelectGrip(grip);
      } else {
        grip.visible = false;
      }

      layer.selected = true;

      this.layers.forEach((g) => {
        if (g.Id === layer.Id) {
          g.selected = true;
        } else {
          g.selected = false;
        }
      });

   


    }
    ,
    UnSelectLayer(layer) {
      this.selectObject = null;
      const grip = this.grips.find((g) => g.link == layer.Id);
      grip.x = layer.x + layer.w / 2;
      grip.y = layer.y + layer.h;
      grip.visible = false;

      if (this.panzoom) {

        this.panzoom.resetStyle();
        this.panzoom.destroy();
        this.panzoom = null;
      }
      this.UnSelectGrip(grip);
      layer.selected = false;
      this.selectObject = null;
      
    },
    SelectGrip(grip) {


      this.grips.forEach((g) => (g.selected = false));
      grip.selected = true;

      this.setGripPanZoom(grip);

    },
    UnSelectGrip(grip) {
      if (this.panzoom_grip) {
        this.panzoom_grip.resetStyle();
        this.panzoom_grip.destroy();
        this.panzoom_grip = null;
      }
      grip.selected = false;

    },
    conflictCheck(selectLayer) {
      this.pathConfilicts = [];
      let layers = []
      if (selectLayer.objectType === 'ship') {
        layers = this.layers.filter((y) => y.Id !== selectLayer.Id && y.objectType === 'ship');
      }

      if (selectLayer.objectType === 'lineWindows') {
        layers = this.layers.filter((y) => y.Id !== selectLayer.Id && y.objectType === 'lineWindows');

      }


      layers.forEach((item) => {
        const path = this.conflictPath(selectLayer, item);
        if (path) {
          this.pathConfilicts.push(path);

          // console.log(
          //   "pathConfilicts layers",
          //   this.pathConfilicts,
          //   item,
          //   selectLayer.Id,
          //   selectLayer.h
          // );
        }
      });
      //Check Breakiing
      this.berthBreaks.forEach((item) => {
        const breakingitem = {
          x: item.x * this.fw + this.leftOffset,
          y: this.berthH,
          w: this.berthBreaksWidth * this.fw,
          h: this.daysCaptions.length * this.rowHeight + this.berthH,
        };

        const path = this.conflictPath(selectLayer, breakingitem);
        if (path) {
          this.pathConfilicts.push(path);

        }
      });

      //Check noneWorkingZone
      this.noneWorkingZone.forEach((item) => {
        const path = this.conflictPath(selectLayer, item);
        if (path) {
          this.pathConfilicts.push(path);

        }
      });
    },

    conflictPath(selectLayer, layer) {
      const poly1 = turf.polygon(
        [
          [
            [selectLayer.x, selectLayer.y],
            [selectLayer.x + selectLayer.w, selectLayer.y],
            [selectLayer.x + selectLayer.w, selectLayer.y + selectLayer.h],
            [selectLayer.x, selectLayer.y + selectLayer.h],
            [selectLayer.x, selectLayer.y],
          ],
        ],
        {
          fill: "#F00",
          "fill-opacity": 0.1,
        }
      );
      const poly2 = turf.polygon(
        [
          [
            [layer.x, layer.y],
            [layer.x + layer.w, layer.y],
            [layer.x + layer.w, layer.y + layer.h],
            [layer.x, layer.y + layer.h],
            [layer.x, layer.y],
          ],
        ],
        {
          fill: "#F00",
          "fill-opacity": 0.1,
        }
      );

      const difference = turf.intersect(poly1, poly2);
      if (
        difference &&
        difference.geometry.coordinates &&
        difference.geometry.coordinates[0].length > 3
      ) {
        const points = difference.geometry.coordinates[0];
        let path = "M" + points[0][0] + " " + points[0][1];
        for (let i = 1; i < points.length; i++) {
          //const x = points[i][0];
          path += `L${points[i][0]} ${points[i][1]}`;
        }
        return path;
      }
      return null;
    },
  }
}
</script>
<style scoped>
.BerthChartParent {
  width: 100%;
  height: 100%;

  /* left: 100px; */
  /* position: absolute; */
  /* padding-left: 10px;

  padding-right: 10px; */
}
/* path {
  fill: yellow;
  stroke: black;
  stroke-width: 8px;
  stroke-linecap: round;
  stroke-linejoin: round;
  pointer-events: none;
} */

/* rect:hover {
  filter: drop-shadow(4px 4px 4px rgb(172, 178, 182));
} */

.cssberth {
  fill: rgb(136, 138, 139);
  opacity: 0.4;
  stroke: black;
  stroke-width: 1px;
  stroke-linecap: round;
  stroke-linejoin: round;
  pointer-events: none;
}
.days1 {
  fill: #eff2f5;
  opacity: 0.7;
  stroke: #999;
  stroke-width: 0px;
  stroke-linecap: round;
  stroke-linejoin: round;
  pointer-events: none;
}
.days2 {
  fill: #fff;
  opacity: 0.7;
  stroke: #999;
  stroke-width: 0px;
  stroke-linecap: round;
  stroke-linejoin: round;
  pointer-events: none;
}

.noneWorkingZone {
  fill: rgb(179, 184, 185);
  opacity: 0.7;
  stroke: #999;
  stroke-width: 1px;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.lineWindows {
  fill: rgba(123, 217, 236, 0.417);
  opacity: 0.9;
  stroke: rgb(21, 156, 209);
  stroke-width: 1px;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ship {
  /* fill: rgb(98, 109, 214); */
  /* fill: rgba(226, 121, 121, 0.438); */
  fill: none;
  opacity: 0.8;
  stroke: #999;
  stroke-width: 0px;
  stroke-linecap: round;
  stroke-linejoin: round;

  pointer-events: fill;
}
.selected {
  fill: #b5c9d2;
  opacity: 0.7;
  stroke: rgb(121, 9, 9);
  stroke-width: 0px;
  stroke-linecap: round;
  stroke-linejoin: round;

  pointer-events: all;
}
.grip {
  fill: rgb(52, 93, 206);
  opacity: 0.7;
  stroke: #999;
  stroke-width: 1px;
  stroke-linecap: round;
  stroke-linejoin: round;
  pointer-events: fill;
}
.confilict {
  fill: rgb(223, 190, 44);
  opacity: 0.7;
  stroke: #999;
  stroke-width: 1px;
  stroke-linecap: round;
  stroke-linejoin: round;

  pointer-events: all;
}

.dash {
  stroke: #214951;
  stroke-dasharray: 1, 9;
  stroke-width: 1px;
}
.lineH {
  stroke: #eee;
  stroke-width: 1px;
}
.helpLine {
  stroke: #d61818;
  stroke-dasharray: 8, 5;
  stroke-width: 2px;
}
.LeftDateCss {
  fill: #0f4f6b;
  opacity: 0.8;
  stroke: rgba(243, 243, 255, 0.904);
  stroke-width: 0.5px;
  stroke-linecap: round;
  stroke-linejoin: round;
  pointer-events: none;
  /* filter: drop-shadow(2px 2px 2px rgba(176, 187, 192, 0.876)); */
}
.symbol {
  display: inline-block;
  flex-shrink: 0;

  position: relative;
  border-radius: 0.475rem;
  border: 1px solid rgb(155, 150, 150);
}
.btn.btn-light-primary {
  color: rgb(223, 219, 219);
  border-color: #6b9db8;
  background-color: #ddeaf0;
  border: 1px solid #a1b6c0;
}
.btn.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  height: calc(0.9rem + 0.9rem);
  width: calc(1.5em + 1.5rem + 2px);
}

.btn {
  outline: 0 !important;
  border-radius: 0.3rem;
}
.grab-bing {
  cursor: -webkit-grab;
  cursor: -moz-grab;
  cursor: -o-grab;
  cursor: grab;
}
.Berthbreak {
  fill: rgb(181 201 210);
}

.grab-bing:active {
  cursor: -webkit-grabbing;
  cursor: -moz-grabbing;
  cursor: -o-grabbing;
  cursor: grabbing;
}
.help-keys {
  position: absolute;
  padding: 4px;
  bottom: 10px;
  right: 10px;
  z-index: 10;
  border: 1px outset #bbbbbb;
  font-family: "Segoe UI", Tahoma, Verdana, sans-serif;
  font-size: 0.8em;
  background-color: #2f3742;
  color: white;
}
.help-keys td {
  padding-right: 3px;
}
/* .scrolly.foo .scrolly-bar:before {
  background: rgb(33, 109, 207);
} */

.BerthName {
  text-anchor: middle;
  font-weight: 600;
  font-size: 1.2em;
  fill: #214951;
  font-family: "Calibri";
}
.BerthBox {
  fill: #a0c4d3;
}
.BerthContent {
  fill: #c0d6df;
  stroke: #c3cdcf;
  stroke-width: 1;
}
.BollardName {
  text-anchor: middle;
  font-weight: bold;
  font-size: 0.8em;
  fill: #214951;
  font-family: "Calibri";
}
.BollardCircle {
  stroke: #999;
  stroke-width: 0;
  fill: #2b7787;
}

.LeftSide {
  fill: #c0d6df;
  opacity: 0.7;
  stroke: rgba(172, 188, 195, 0.856);
  stroke-width: 1px;
  stroke-linecap: round;
  stroke-linejoin: round;
  pointer-events: none;
  filter: drop-shadow(2px 2px 2px rgba(176, 187, 192, 0.876));
}
.LeftSideName {
  text-anchor: end;
  font-weight: bold;
  font-size: 1em;
  fill: #214951;
  font-family: Calibri;
}
.LeftSideTime {
  fill: #3b7e9b;
}
.scrolly.foo .scrolly-bar:before {
  background: #c9c6c6 !important;
}
.scrolly-bar.axis-y {
  width: 22px;
}
.scrolly-bar.axis-x {
  height: 22px;
}

.scrolly-bar:before {
  border-radius: 2px;
}

.TitleDate {
  font-size: 9px;
  color: #0f4f6b;
  font-weight: bold;
  text-align: center;
  padding: 5px;
  border-radius: 5px;
  background-color: #3b7e9b;
  color: #ffffff;
}
.TitleContent {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: auto;
}

.BollardIcon {
  /* fill: #706f6f; */
  fill: #d61818;
}

/* .BollardIcon:first-child {
  fill: #d61818 !important;
} */

.LockXY {
  fill: #3e3d3c;
}
.LockXY:hover {
  cursor: pointer;
}
.UnLockXY {
  fill: #60605f;
}
.UnLockXY:hover {
  cursor: pointer;
}

.ChangeItemHeight {
  fill: #373532;
  cursor: s-resize;
}
</style>
