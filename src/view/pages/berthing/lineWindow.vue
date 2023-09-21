<template>
  <div v-if="model" class="Parent d-flex align-items-start99 flex-column" :class="isReadonly == true ? 'ParentBlink BlinkParent' : ''" :title="isLockIcon == false ? 'press ctrl + mouse click' : ''" contenteditable="false">
    <div class="Header">
      <div class="d-flex justify-content-between">
        <div class="TopLeft">
          <div class="d-flex justify-content-start">
            <div class="StartDate BoxItem pl-2 pr-2" :class="[isReadonly == true ? 'BoxItemBlink BlinkBox' : '', startDate_OutofRange == true ? 'startDateOutofRange' : '']">{{ startDate_Day }}, {{ startDate_Time }}</div>

            <div class="Bollard BoxItem pl-2 pr-2 ml-1" :class="isReadonly == true ? 'BoxItemBlink BlinkBox' : ''">
              {{ model.schedule.StartBollardName }} -
              {{ model.schedule.endBollardName }}
            </div>
          </div>
        </div>
        <div class="TopCenter"></div>
        <div class="TopRight">
          <div v-if="isReadonly == false" class="d-flex justify-content-end">
            <div v-if="isOutofRange" class="d-flex justify-content-end mt-1 ml-1 mr-1 CursorHelp">
              <i class="fas fa-exclamation-triangle CursorHelp" title="out of range" style="color: #ff6a00"></i>
            </div>

            <div @click="deleteItem" class="d-flex justify-content-end mt-1 ml-1 mr-1 CursorPointer">
              <i class="fas fa-trash-alt Icon-Menu CursorPointer" title="delete Item"></i>
            </div>

            <div @click="showPattern" class="d-flex justify-content-end mt-1 ml-1 mr-1 CursorPointer">
              <i class="far fa-list-alt999 far fa-clock Icon-Menu CursorPointer" title="Recurrence Pattern"></i>
            </div>

            <div class="d-flex justify-content-end mt-1 ml-1 mr-2" @click="isLockIcon == false ? openLockMove() : null" :title="isLockIcon == true ? 'locked' : 'click to move item '" :class="isLockIcon == true ? 'CursorHelp' : 'CursorPointer'">
              <i :class="[layer.selected == true ? 'LayerSelected' : '', isLockIcon == true ? 'fas fa-lock' : 'fas fa-thumbtack', isLockIcon == true ? 'CursorHelp' : 'CursorPointer']" style="color: #3e3d3c"></i>
            </div>
          </div>

          <div v-if="isReadonly == true" class="d-flex justify-content-end">
            <div class="Window BoxItem pl-2 pr-2 ml-1" :class="isReadonly == true ? 'BoxItemBlink BlinkBox' : ''">
              Window
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="divBackgroundBody">
      <div class="pt-0 pl-2 pt-1 pb-1 pr-2 pb-0">
        <div class="d-flex justify-content-between mb-1">
          <div class="symbol symbol-40 flex-shrink-0">
            <div class="symbol-label" :style="styleObjectLineLogo2"></div>
          </div>
        </div>
      </div>

      <div class="p-0 Body2">
        <div class="d-flex justify-content-between mb-1">
          <div class="font-weight-boldest pr-1 pl-1 shippingLine">
            {{ model.schedule.lineName }}
          </div>
        </div>
      </div>

      <div class="p-0 Body2">
        <div class="d-flex justify-content-between mb-1">
          <div class="font-weight-boldest pr-1 pl-1 lineService">{{ model.schedule.companyLineServiceName }} -{{ model.schedule.length }} -{{ planDuration }}</div>
        </div>
      </div>

      <div class="p-0 Body2">
        <div class="d-flex flex-row mb-1">
          <div class="font-weight-boldest pr-1 pl-1 mr-2 lineServiceDuration" title="duration">{{ planDuration }}</div>
           <div class="font-weight-boldest pr-1 pl-1 lineServiceLength" title="length">{{ model.schedule.length }} m</div>
        </div>
      </div>
      <!-- <div class="p-0 Body2">
        <div class="d-flex justify-content-between mb-1">
          <div class="font-weight-boldest pr-1 pl-1 lineServiceLength" title="length" >{{ model.schedule.length }} m</div>
        </div>
      </div> -->


      <div class="pt-0 pl-2 pt-2 pr-2 pb-0">
        <div class="d-flex justify-content-between mb-1">
          <transition name="bounce">
            <p v-if="showInfo" style="font-weight: bold; color: #373532">
              {{ model.schedule.companyLineServiceDescription }}
            </p>
          </transition>
        </div>
      </div>
    </div>

    <div class="mt-auto Footer">
      <div class="d-flex justify-content-between">
        <div class="BottonLeft EndDate BoxItem pl-2 pr-2" :class="isReadonly == true ? 'BoxItemBlink BlinkBox' : ''">{{ endDate_Day }}, {{ endDate_Time }}</div>
        <div class="BottonCenter"></div>
        <div class="BottonRight">
          <div class="d-flex justify-content-end">
            <div class="d-flex justify-content-end mr-1">
              <div class="BoxItemInfo p-0" title="decription" @click="showInfo = !showInfo">
                <i class="fas fa-info"></i>
              </div>
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
  name: "lineWindow",
  components: {},
    mixins: [ConvertTime],
  props: {
    layer: Object,
  },
  emits: ["clickdeleteWindow", "clickLineWindowData", "openLockClick"],
  data: () => {
    return {
      model: null,
      startDate_Day: null,
      startDate_Time: null,
      endDate_Day: null,
      endDate_Time: null,
      styleObjectLineLogo: null,
      styleObjectLineLogo2: null,
      showInfo: false,
      isReadonly: false,
      isOutofRange: false,
      isLockIcon: false,
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
        // debugger;
        //
      },
    },
  },
  methods: {
    updateView() {
      this.isLockIcon = this.model.schedule.moveLocked == true || this.model.schedule.isOutofRange == true ? true : false;
      this.isOutofRange = this.model.schedule.isOutofRange;
      this.startDate_OutofRange = false;
      // this.startDate_Day =
      //   moment(this.model.schedule.startDate).format("DD") +
      //   " " +
      //   moment(this.model.schedule.startDate).format("MMM");

      // this.startDate_Time = moment(this.model.schedule.startDate).format(
      //   "HH:mm"
      // );

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

      const planDurationMilliseconds = new Date(this.Tdate).getTime() - new Date(this.Fdate).getTime();
      this.planDuration = this.GetPlanDuration(planDurationMilliseconds / 60000);

      const vm = this;
      try {
        var img = new Image();
        img.src = this.model.schedule.image; // 'data:image/png;base64,iVBORw0K...' + this.image;
        img.onload = function() {
          const imgWidth = img.naturalWidth;
          const imgHeight = img.naturalHeight;
          let backgroundSize = "";
          if (imgWidth > vm.model.w || imgHeight > vm.model.h - 36) {
            backgroundSize = "contain";
          } else {
            backgroundSize = "auto";
          }

          vm.styleObjectLineLogo = {
            "background-image": "url(" + vm.model.schedule.image + ")",
            "background-repeat": "no-repeat",
            "background-size": backgroundSize,
            "background-position": "center",
            "background-origin": "content-box",
            height: "100%",
          };

          vm.styleObjectLineLogo2 = {
            "background-image": "url(" + vm.model.schedule.image + ")",
            "background-size": "contain",
          };
        };
      } catch (ex) {
        //console.error(ex);
      }

      this.isReadonly = this.model.schedule.readonly;
    },
    updateModel(val) {
      
   
      this.model.schedule = val;
        
      this.updateView();
      this.$forceUpdate();
    },
    showPattern() {
      const me = this;
      // this.$emit("clickData", me);
      this.$emit("clickLineWindowData", me);
    },
    deleteItem() {
      this.$emit("clickdeleteWindow", this.model.schedule);
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
  border: 2px solid #0a59a5;
  background-color: #e3e3e1;
}
.ParentBlink {
  animation-name: BlinkParent;
  animation-duration: 1s;
  animation-iteration-count: infinite;
}

@keyframes BlinkParent {
  from {
    border: 2px solid #0a59a5;
    background-color: #e6e6dc;
  }
  to {
    border: 2px solid #3491e9;
    background-color: #ffffff;
  }
}

.BoxItem {
  background-color: #0a59a5;
  /* animation-name: BlinkBox;
  animation-duration: 1s;
    animation-iteration-count: infinite; */
}

.BoxItemBlink {
  animation-name: BlinkBox;
  animation-duration: 1s;
  animation-iteration-count: infinite;
}
@keyframes BlinkBox {
  from {
    background-color: #0a59a5;
  }
  to {
    background-color: #3491e9;
  }
}

.BoxItemInfo {
  background-color: #6a6a68;
  color: #ffffff;
  border-radius: 8px;
  min-width: 15px;
  text-align: center;
  max-height: 15px;
  cursor: help;
}
.BoxItemInfo > i {
  color: #ffffff;
  font-size: 10px;
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
.Window {
  color: #ffffff;
  border-bottom-left-radius: 5px;
}

/* @keyframes BlinkWindowBox {
  from { background-color: #0a59a5}
  to { background-color: #3491e9}
} 

.BoxItemWindow {
  background-color: #0a59a5;
  animation-name: BlinkWindowBox;
  animation-duration: 1s;
    animation-iteration-count: infinite;
} */

.EndDate {
  color: #ffffff;
  border-top-right-radius: 5px;
}

.ItemStatus {
  color: #ffffff;
  border-top-left-radius: 5px;
}
.lineService {
  background-color: #ed991c;
  color: #262625;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
}
.lineServiceDuration {
  background-color: #ed991c;
  color: #262625;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
}
.lineServiceLength {
  background-color: #ed991c;
  color: #262625;
  border-radius: 3px;
  border-radius: 3px;
}


.shippingLine {
  background-color: #706f6f;
  color: #ffffff;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
}

.Icon-Menu {
  color: #373532 !important;
}

.Icon-Menu:hover {
  color: #373532 !important;
  /* cursor: help !important; */
}

.lineLogo {
  width: 40px;
  height: 40px;
}

/* @keyframes blink {  
  0% { color: red; border: 3px solid red; }
  100% { color: black; }
}
@-webkit-keyframes blink {
  0% { color: red; border: 3px solid red; }
  100% { color: black; }
}
.blink {
  -webkit-animation: blink 1s linear infinite;
  -moz-animation: blink 1s linear infinite;
  animation: blink 1s linear infinite;
}  */

.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}

.startDateOutofRange {
  text-decoration: line-through;
  color: #ff6a00;
}
.LayerSelected {
  transform: rotate(45deg);
}
</style>
