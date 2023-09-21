<template>
   <div
    id="BerthChartParent"
    ref="BerthChartParent"
    class="BerthChartParent"
    style="cursor: grab"
    v-dragscroll
    
  >
    <div class="help-keys">
      <table>
        <tr>
          <td>Select</td>
          <td>[Ctrl] + Click</td>
        </tr>
        <tr>
          <td>Zoom</td>
          <td>Key [A], [Z]</td>
        </tr>
      </table>
    </div>
    <svg
      @click="svgClick"
      style="overflow: scroll; pointer-events: fill; user-select: none"
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
          ></path>
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
              fill="#E4ECEF"
              stroke="#C3CDCF"
              stroke-width="1"
              :key="berth.id"
              :x="berth.x * fw"
              :width="berth.length * fw"
              :height="berthH"
            />

            <rect
              fill="#B5C9D2"
              :key="berth.id"
              :x="berth.x * fw + 0.5"
              :width="berth.length * fw - 0.5"
              :height="berthH * 0.4"
            />
            <g
              :transform="
                getTranslate(fw * (berth.x + berth.length / 2), berthH * 0.2)
              "
              fill="#444"
            >
              <text
                alignment-baseline="middle"
                text-anchor="middle"
                font-weight="600"
                font-size="1em"
                fill="#214951"
                font-family="Calibri"
              >
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
                stroke="#999"
                stroke-width="0"
                fill="#214951"
              />
              <text
                :x="fw * (berth.x + bolrad.distance)"
                :y="berthH - 12"
                alignment-baseline="bottom"
                text-anchor="middle"
                font-weight="bold"
                font-size="0.8em"
                fill="#214951"
                font-family="Calibri"
              >
                {{ bolrad.name }}
              </text>
              <!-- <line
                :x1="fw * (berth.x + bolrad.distance)"
                :y1="berthH"
                :x2="fw * (berth.x + bolrad.distance)"
                :y2="(daysCaptions.length - 1) * rowHeight"
                class="dash"
              /> -->
            </g>
          </g>
          <line
            x1="0"
            :y1="berthH - 5"
            :x2="vw * fw"
            :y2="berthH - 5"
            class="dash"
          />
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
      </g> -->
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
          :y="layer.h / 2"
          fill="#000"
          alignment-baseline="middle"
          text-anchor="middle "
          font-weight="bold"
          font-size="1.2rem"
          font-family="Calibri"
        >
          NoneWorkingZone
        </text>
      </g>
      <!-- End NoneWorkingZone -->
      <!-- Start Ship -->
      <g
        v-for="layer in layers"
        :key="layer.Id"
        :transform="getTranslate(layer.x, layer.y)"
        :id="layer.Id"
        @mouseup="layer_mousedown($event, layer)"
        v-bind:style="{ display: layer.visible ? 'inline' : 'none' }"
      >
        <rect
          y="5"
          :width="layer.margin"
          :height="layer.h - 10"
          fill="url(#pattern01)"
        />
        <rect
          rx="10"
          ry="10"
          :x="layer.margin"
          :width="layer.w - 2 * layer.margin"
          :height="layer.h"
          class="ship"
          v-bind:class="{ selected: layer.selected }"
        />
        <rect
          y="5"
          :x="layer.w - layer.margin"
          :width="layer.margin"
          :height="layer.h - 10"
          fill="url(#pattern01)"
        />

        <text
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
        </text>
      </g>

      <g
        v-for="grip in grips"
        :key="grip.id"
        :id="grip.id"
        :transform="getTranslate(grip.x, grip.y)"
      >
        <rect
          v-if="grip.visible"
          :width="10"
          :height="10"
          class="grip"
          style="cursor: s-resize"
          v-bind:class="{ selected: grip.selected }"
        ></rect>
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
        :transform="getTranslate(selectObject.x - 5, selectObject.y - 5)"
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
        <g fill="rgba(199, 24, 24, 0.651)">
          <rect x="-10" y="0" width="20" height="2" />
          <rect x="0" y="0" width="2" height="20" />
        </g>
        <text
          y="-5"
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
        <g fill="rgba(199, 24, 24, 0.651)">
          <rect x="-10" y="0" width="20" height="2" />
          <rect x="0" y="0" width="2" height="20" />
        </g>
        <text
          y="-5"
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
              d="M15.6274517,4.55882251 L14.4693753,6.2959371 C13.9280401,5.51296885 13.0239252,5 12,5 C10.3431458,5 9,6.34314575 9,8 L9,10 L14,10 L17,10 L18,10 C19.1045695,10 20,10.8954305 20,12 L20,18 C20,19.1045695 19.1045695,20 18,20 L6,20 C4.8954305,20 4,19.1045695 4,18 L4,12 C4,10.8954305 4.8954305,10 6,10 L7,10 L7,8 C7,5.23857625 9.23857625,3 12,3 C13.4280904,3 14.7163444,3.59871093 15.6274517,4.55882251 Z"
              fill="#999"
            />
            <path
              v-if="!canMoveX"
              stroke-width="0"
              fill="#999"
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
              d="M15.6274517,4.55882251 L14.4693753,6.2959371 C13.9280401,5.51296885 13.0239252,5 12,5 C10.3431458,5 9,6.34314575 9,8 L9,10 L14,10 L17,10 L18,10 C19.1045695,10 20,10.8954305 20,12 L20,18 C20,19.1045695 19.1045695,20 18,20 L6,20 C4.8954305,20 4,19.1045695 4,18 L4,12 C4,10.8954305 4.8954305,10 6,10 L7,10 L7,8 C7,5.23857625 9.23857625,3 12,3 C13.4280904,3 14.7163444,3.59871093 15.6274517,4.55882251 Z"
              fill="#999"
            />
            <path
              v-if="!canMoveY"
              stroke-width="0"
              fill="#999"
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
            Y Lock
          </text>
        </svg>
      </g>
      <!-- End Help Lines -->

      <!-- Start Top Berths-->
      <use
        xlink:href="#berthtop"
        :transform="getTranslate(leftOffset, scrollTop * zoom)"
      ></use>
      <!-- End Top Berths-->

      <!--Start Left Side-->
      <g
        v-for="(item, index) in daysCaptions"
        :key="'leftside' + index"
        :transform="getTranslate(scrollLeft * zoom, berthH + index * rowHeight)"
      >
        <rect class="leftcss" :width="leftOffset" :height="rowHeight"></rect>
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
            fill="#7DD160"
          />
        </g>

        <text
          :x="leftOffset - rowHeight / 24 - 5"
          y="12"
          alignment-baseline="middle"
          text-anchor="end "
          font-weight="bold"
          font-size="0.8em"
          fill="#000"
          font-family="Calibri"
        >
          {{ item.caption }}
        </text>
      </g>
      <g :transform="getTranslate(scrollLeft * zoom, scrollTop * zoom)">
        <rect :width="leftOffset" :height="berthH" fill="snow" />
        <foreignObject :width="leftOffset" :height="berthH">
          <div
            style="
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              backhround-color: snow;
            "
          >
            <code
              style="
                margin-bottom: 4px;
                margin-top: 8px;
                font-size: 0.9em;
                color: #0f4f6b;
                font-weight: bold;
              "
              >20Dec-5Nov</code
            >
            <a class="btn btn-icon btn-light-primary">
              <img style="margin: auto" src="/images/calender.svg" />
            </a>
          </div>
        </foreignObject>
      </g>

      <!--End Left Side-->
    </svg>
  </div>
</template>

<script lang="js">
import { dragscroll } from "vue-dragscroll";
import axios from "axios";
import moment from "moment";
import Panzoom from "@panzoom/panzoom";
import * as turf from "@turf/turf";
import Layer from "@/types/BerthChart/2D/Layer";
import { Data } from "@/types/BerthChart/ChartApiResult";
export default {
  data: () => {
    return {
      fw: 4, //Fact for Chart Width
      vw: 0, // Max Chart Width
      rowHeight: 200, //is Fixed
      berthH: 60, //Berth Height
      berthBreaksWidth: 5,
      berths: [],
      bolards: [],
      layers: [],
      daysCaptions: [],
      grips: [],
      berthBreaks: [],
      noneWorkingZone: [],
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
    };
  },
  mounted(){
       this.init();  
  },
  methods:{

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
 
  
  SelectXAxias(e) {
    if (this.selectObject) {
      this.canMoveX = !this.canMoveX;
    }
  },
  SelectYAxias(e) {
    if (this.selectObject) {
      this.canMoveY = !this.canMoveY;
    }
  },
  //Key Press Esc UnSelect Layer
  keyCheck(e) {
    if (e.keyCode === 27) {
      const se = this.layers.find((y) => y.selected === true);
      if (se) {
        this.UnSelectLayer(se);
      }
    }
    if (e.code === "KeyA") {
      if (this.zoom > 1) {
        this.zoom += -0.3;
      }
    }
    if (e.code === "KeyZ") {
      if (this.zoom < 20) {
        this.zoom += 0.3;
      }
    }
  },
  svgClick(event) {
    //nearestViewportElement test
    if (this.gripMoveing) return;
    
    if (event.pointerType !== "mouse") return;

    if (!event.srcElement.nearestViewportElement) {
      const se = this.layers.find((y) => y.selected === true);
      if (se) {
        this.UnSelectLayer(se);
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener("keyup", this.keyCheck, true);
    window.removeEventListener("resize", this.onChartResize, true);
    window.removeEventListener("scroll", this.onChartScroll, true);
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
  setPanZoom_Parent() {
    const elem = document.getElementById("BerthChartSvg");
    const me = this;
    this.panzoom_parent = Panzoom(elem, { disablePan: true });
    elem.parentElement.addEventListener(
      "wheel",
      this.panzoom_parent.zoomWithWheel
    );
  },
  setPanZoom(layer) {
    const elem =document.getElementById(layer.Id)  

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
    elem.addEventListener("panzoomstart", (event) => {
      me.grips.forEach((g) => (g.visible = false));
      this.selectObject = {
        x: layer.x,
        y: layer.y,
        h: layer.h,
        w: layer.w,
        y1text: moment(this.yToDate(layer.y)).format("ddd, MMM DD HH:mm"),
        y2text: moment(this.yToDate(layer.y + layer.h)).format(
          "ddd, MMM DD HH:mm"
        ),
        startbolard: this.xToBolard(layer.x),
        endbolard: this.xToBolard(layer.x + layer.w),
      };
    });
    elem.addEventListener("panzoomend", (event) => {
      const x = event["detail"]["x"];
      const y = event["detail"]["y"];
      const id = event.target["id"];
      setTimeout(() => {
        this.UpdateLayerPosition(id, x, y);
        this.MoveGrip(id, x, y);
      });

      
    });
  },
  UpdateLayerPosition(id, x, y) {
    const layer = this.layers.find((y) => y.Id === id);

    if (this.canMoveY) {
      const newDate = this.roundMinutes(this.yToDate(y));
      y = this.dateToy(newDate);
      layer.y = y;
    }

    const x0 = (x - this.leftOffset) / this.fw;
    //Move to line bolard
    if (this.canMoveX) {
      layer.x = x;
      const beforBolards = this.bolards.filter((r) => r.x <= x0);
      const bolardx = beforBolards[beforBolards.length - 1].x;
      //layer.x = bolardx * this.fw + this.leftOffset;
    }
    this.panzoom.pan(layer.x, layer.y, { animate: true });
    setTimeout(() => {
      this.MoveGrip(id, layer.x, layer.y);
    });
  },
  MoveGrip(id, x, y) {
    const grip = this.grips.find((g) => g.link === id);
    const layer = this.layers.find((y) => y.Id === id);
    grip.x = x + layer.w / 2 - grip.w / 2;
    grip.y = y + layer.h;
    grip.visible = true;
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
    const elem =document.getElementById( grip.id)  
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
    elem.addEventListener("panzoomstart", (event) => {
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

    const layer = this.layers.find((y) => y.Id === grip.link);
    const y = trans.y;

    const deltah = y - (layer.y + layer.h);
    layer.h = layer.h + deltah;

    this.selectObject.h = layer.h;
    this.selectObject.y2text = moment(this.yToDate(y + layer.h)).format(
      "ddd, MMM DD HH:mm"
    );
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
  },

  init() {
    axios.get("json/chart/data.json").then((response) => {
      const result = response.data;
      
      this.renderData(result.data);
    });

    setTimeout(() => {
      this.onChartResize();
    }, 200);
    window.addEventListener("resize", this.onChartResize, true);
    window.addEventListener("scroll", this.onChartScroll, true);
  },
  onChartResize() {
    const el = this.BerthChartParent; //.querySelector("#BerthChartParent");
    if (el) {
      this.viewWidth = el.clientWidth;
    }
  },
  onChartScroll(e) {
    const parent = e.srcElement ;
    const scrollTop = parent.scrollTop;
    const scrollLeft = parent.scrollLeft;
    this.viewWidth = parent.clientWidth; //- (20 * 1) / this.devicePixelRatio;
    this.scrollTop = Math.round(scrollTop);
    this.scrollLeft = Math.round(scrollLeft);
  },

  renderData(res) {
    let s = 0;
    const day1 = new Date(res.startDate);
    const day2 = new Date(res.endDate);
    this.startDate = day1;
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

    this.layers = [];
    res.schedules.forEach((item) => {
      let margin = 10;
      if (item.vessel["length"]) {
        margin = Number(item.vessel["length"]);
      }

      const layer = new Layer(item, day1);
      const startBolard = this.bolards.find(
        (b) => Number(b.id) === Number(item.startBollardId)
      );

      layer.x = this.leftOffset + this.fw * startBolard["x"];
      layer.w = (margin + Number(item.vessel.loa)) * this.fw;
      const startdate = new Date(item.startDate);
      const enddate = new Date(item.endDate);
      const startY =
        Math.abs(startdate.getTime() - day1.getTime()) / (1000 * 3600 * 24);
      const EndY =
        Math.abs(enddate.getTime() - day1.getTime()) / (1000 * 3600 * 24);
      layer.y = startY * this.rowHeight + this.berthH;
      layer.h = (EndY - startY) * this.rowHeight;

      layer.Id = "layer" + this.layers.length;
      layer.objectType = "ship";
      layer.canMove = true;
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
      layer.margin = margin * this.fw;

      this.layers.push(layer);
    });
    this.grips = this.layers.map((r) => r.Bottomgrip);
    // this.layers.forEach((r) => {
    //   r["link"] = r.Id;
    //   r.id = r.Id + "_grip";
    //   r["objectType"] = "grip";
    //   r.x = r.x + r.w / 2;
    //   r.y = r.y + r.h;
    //   r.w = 10;
    //   r.h = 10;
    //   r["visible"] = false;
    //   return r;
    // });
    //noneWorkingZone
    //schedule_NoneWorkingZone
    res.schedule_NoneWorkingZone.forEach((item) => {
      const layer = new Layer(item, day1);
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
    if (event.ctrlKey && layer.canMove) {
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
    grip.visible = true;

    this.canMoveX = true;
    this.canMoveY = true;
    this.setPanZoom(layer);
    this.SelectGrip(grip);

    
  }
,
  UnSelectLayer(layer) {
    this.selectObject = null;
    const grip = this.grips.find((g) => g.link == layer.Id);
    grip.x = layer.x + layer.w / 2;
    grip.y = layer.y + layer.h;
    grip.visible = false;
    this.UnSelectGrip(grip);
    if (this.panzoom) {
      this.panzoom.resetStyle();
      this.panzoom.destroy();
      this.panzoom = null;
    }
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
      this.panzoom_grip.destroy();
      this.panzoom_grip = null;
    }
    grip.selected = false;
    
  },
  conflictCheck(selectLayer) {
    this.pathConfilicts = [];
    const layers = this.layers.filter((y) => y.Id !== selectLayer.Id);

    layers.forEach((item) => {
      const path = this.conflictPath(selectLayer, item);
      if (path) {
        this.pathConfilicts.push(path);

        console.log(
          "pathConfilicts layers",
          this.pathConfilicts,
          item,
          selectLayer.Id,
          selectLayer.h
        );
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
        const x = points[i][0];
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
  overflow: auto;
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

rect:hover {
  /* outline: 1px solid red; */
  filter: drop-shadow(4px 4px 4px rgb(172, 178, 182));
}

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
.ship {
  /* fill: rgb(98, 109, 214); */
  fill: rgba(226, 121, 121, 0.438);
  opacity: 0.8;
  stroke: #999;
  stroke-width: 1px;
  stroke-linecap: round;
  stroke-linejoin: round;

  pointer-events: fill;
}
.noneWorkingZone {
  fill: rgb(179, 184, 185);
  opacity: 0.7;
  stroke: #999;
  stroke-width: 1px;
  stroke-linecap: round;
  stroke-linejoin: round;
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

.leftcss {
  fill: rgb(210, 225, 231);
  opacity: 0.7;
  stroke: rgba(172, 188, 195, 0.856);
  stroke-width: 1px;
  stroke-linecap: round;
  stroke-linejoin: round;
  pointer-events: none;
  filter: drop-shadow(2px 2px 2px rgba(176, 187, 192, 0.876));
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
  stroke: rgba(199, 24, 24, 0.651);
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
</style>   