<template>
  <div
    id="kt_quick_setting"
    ref="kt_quick_setting"
    class="offcanvas offcanvas-right pt-5 pb-10 pl-5 pr-5"
  >
    <BlockUI v-if="loading" :message="msg">
      <i class="fa fa-spinner fa-spin fa-2x fa-fw"></i>
    </BlockUI>

    <b-row>
      <b-col class="d-flex">
        <inline-svg
          fill="#24A148"
          style="height: 3.4rem !important"
          src="media/svg/saab/Settings.svg"
        />

        <label class="font-weight-bolder font-size-h3 mt-3 ml-3 d-flex"
          >Setting
          <div>
            <b-dropdown
              right
              text="Right align"
              variant="outline-light-none"
              class="m-0"
              no-caret
            >
              <template #button-content>
                <i class="ki ki-bold-more-hor"></i>
              </template>
              <b-dropdown-item href="#" @click="ApplySetting"
                >Apply</b-dropdown-item
              >
              <b-dropdown-item href="#" @click="SaveSetting"
                >Save & Apply</b-dropdown-item
              >
              <b-dropdown-item href="#" @click="ResetSetting"
                >Reset Setting</b-dropdown-item
              >
            </b-dropdown>
          </div>
        </label>
      </b-col>

      <b-col class="d-flex flex-row-reverse">
        <a
          href="#"
          class="btn btn-xs btn-icon btn-light btn-hover-primary"
          id="kt_quick_setting_close"
        >
          <i class="ki ki-close icon-xs text-muted"></i>
        </a>
      </b-col>
    </b-row>

    <div class="offcanvas-content" v-if="model != undefined && model != null">
      <!--begin::Wrapper-->
      <div class="offcanvas-wrapper mb-5 scroll-pull">
        <div class="card card-custom card-stretch gutter-b">
          <perfect-scrollbar
            class="offcanvas-content   scroll"
            style="max-height: 90vh; position: relative"
          >
            <div
              class="card card-custom gutter-b 1111gutter-t example5 example-compact55"
              style="margin-top:10px !important"
            >
              <div
                class="card-body  pl-5 pr-7 mt-3"
                style="padding: 0px; background-color: #fcfcfd;"
              >
                <div class="form-group row sliderMargin">
                  <div class="col-lg-12">
                    <label>Pixel Per Metter</label>
                    <b-form-input
                      class="form-control"
                      v-model.trim="model.configuration.pixelPerMeter"
                      type="range"
                      min="1"
                      max="12"
                      step="1"
                    ></b-form-input>
                    <span>{{ model.configuration.pixelPerMeter }}</span>
                  </div>
                </div>
                <div class="form-group row sliderMargin">
                  <div class="col-lg-12">
                    <label>Pixel Per Hour</label>
                    <b-form-input
                      class="form-control"
                      v-model.trim="model.configuration.pixelPerHour"
                      type="range"
                      min="2"
                      max="40"
                      step="1"
                    ></b-form-input>
                    <span>{{ model.configuration.pixelPerHour }}</span>
                  </div>
                </div>
                <div class="form-group999 row">
                  <div class="col-lg-4">
                    <label>Background</label>
                    <input
                      v-model="model.configuration.backgroundColor"
                      class="form-control ColorPickerBox"
                      type="color"
                    />
                  </div>
                  <!-- <div class="col-lg-4">
                    <label>Time Grid</label>
                    <input
                      v-model="model.configuration.timeGridColor"
                      class="form-control ColorPickerBox"
                      type="color"
                    />
                  </div> -->
                  <div class="col-lg-4">
                    <label>Bollard Grid</label>
                    <input
                      v-model="model.configuration.bollardGridColor"
                      class="form-control ColorPickerBox"
                      type="color"
                    />
                  </div>
                </div>

                <div
                  class="separator separator-dashed my-4 SeparatorList"
                ></div>
                <h3 class="font-size-lg text-dark font-weight-bolder mb-6">
                  Corner Box :
                </h3>
                <div class="form-group row sliderMargin">
                  <div class="col-lg-12">
                    <label>Border Thickness</label>

                    <b-form-input
                      class="form-control"
                      v-model.trim="
                        model.configuration.cornerBoxBorderThickness
                      "
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                    ></b-form-input>
                    <span>{{
                      model.configuration.cornerBoxBorderThickness
                    }}</span>
                  </div>
                </div>
                <div class="form-group888 row">
                  <div class="col-lg-4">
                    <label>Foreground</label>
                    <input
                      v-model="model.configuration.cornerBoxForegroundColor"
                      class="form-control ColorPickerBox"
                      type="color"
                    />
                  </div>
                  <div class="col-lg-4">
                    <label>Background</label>
                    <input
                      v-model="model.configuration.cornerBoxBackgroundColor"
                      class="form-control ColorPickerBox"
                      type="color"
                    />
                  </div>
                  <div class="col-lg-4">
                    <label>Border</label>
                    <input
                      v-model="model.configuration.cornerBoxBorderColor"
                      class="form-control ColorPickerBox"
                      type="color"
                    />
                  </div>
                </div>

                <div
                  class="separator separator-dashed my-4 SeparatorList"
                ></div>
                <h3 class="font-size-lg text-dark font-weight-bolder mb-6">
                  Time Line :
                </h3>
                <div class="form-group row sliderMargin">
                  <div class="col-lg-12">
                    <label>Border Thickness</label>

                    <b-form-input
                      class="form-control"
                      v-model.trim="model.configuration.timeLineBorderThickness"
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                    ></b-form-input>
                    <span>{{
                      model.configuration.timeLineBorderThickness
                    }}</span>
                  </div>
                </div>
                <div class="form-group999 row">
                  <div class="col-lg-4">
                    <label>Foreground</label>
                    <input
                      v-model="model.configuration.timeLineForegroundColor"
                      class="form-control ColorPickerBox"
                      type="color"
                    />
                  </div>
                  <div class="col-lg-4">
                    <label>Background</label>
                    <input
                      v-model="model.configuration.timeLineBackgroundColor"
                      class="form-control ColorPickerBox"
                      type="color"
                    />
                  </div>
                  <div class="col-lg-4">
                    <label>Border</label>
                    <input
                      v-model="model.configuration.timeLineBorderColor"
                      class="form-control ColorPickerBox"
                      type="color"
                    />
                  </div>
                </div>

                <div
                  class="separator separator-dashed my-4 SeparatorList"
                ></div>
                <h3 class="font-size-lg text-dark font-weight-bolder mb-6">
                  Start of Day :
                </h3>
                <div class="form-group999 row">
                  <div class="col-lg-4">
                    <label>Foreground</label>
                    <input
                      v-model="
                        model.configuration.timeLineStartOfDayForegroundColor
                      "
                      class="form-control ColorPickerBox"
                      type="color"
                    />
                  </div>
                  <div class="col-lg-4">
                    <label>Background</label>
                    <input
                      v-model="
                        model.configuration.timeLineStartOfDayBackgroundColor
                      "
                      class="form-control ColorPickerBox"
                      type="color"
                    />
                  </div>
                </div>

  <div
                  class="separator separator-dashed my-4 SeparatorList"
                ></div>
                <h3 class="font-size-lg text-dark font-weight-bolder mb-6">
                  Hour :
                </h3>
                <div class="form-group999 row">
                  <div class="col-lg-4">
                    <label>Foreground</label>
                    <input
                      v-model="model.configuration.timeLineHourForegroundColor"
                      class="form-control ColorPickerBox"
                      type="color"
                    />
                  </div>
                  <div class="col-lg-4">
                    <label>Background</label>
                    <input
                      v-model="model.configuration.timeLineHourBackgroundColor"
                      class="form-control ColorPickerBox"
                      type="color"
                    />
                  </div>
                </div>



                <div
                  class="separator separator-dashed my-4 SeparatorList"
                ></div>
                <h3 class="font-size-lg text-dark font-weight-bolder mb-6">
                  Berth :
                </h3>
                <div class="form-group row sliderMargin">
                  <div class="col-lg-12">
                    <label>Border Thickness</label>

                    <b-form-input
                      class="form-control"
                      v-model.trim="model.berth.borderThickness"
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                    ></b-form-input>
                    <span>{{ model.berth.borderThickness }}</span>
                  </div>
                </div>

                <div class="form-group777 row">
                  <div class="col-lg-4">
                    <label>Foreground</label>
                    <input
                      v-model="model.berth.foregroundColor"
                      class="form-control ColorPickerBox"
                      type="color"
                    />
                  </div>
                  <div class="col-lg-4">
                    <label>Background</label>
                    <input
                      v-model="model.berth.backgroundColor"
                      class="form-control ColorPickerBox"
                      type="color"
                    />
                  </div>
                  <div class="col-lg-4">
                    <label>Border</label>
                    <input
                      v-model="model.berth.borderColor"
                      class="form-control ColorPickerBox"
                      type="color"
                    />
                  </div>
                </div>

                <div
                  class="separator separator-dashed my-4 SeparatorList"
                ></div>
                <h3 class="font-size-lg text-dark font-weight-bolder mb-6">
                  Bollard :
                </h3>
                <div class="form-group999 row sliderMargin">
                  <div class="col-lg-12">
                    <label>Border Thickness</label>
                    <b-form-input
                      class="form-control"
                      v-model.trim="model.bollard.borderThickness"
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                    ></b-form-input>
                    <span>{{ model.bollard.borderThickness }}</span>
                  </div>
                </div>
                <div class="form-group row">
                  <div class="col-lg-4">
                    <label>Background</label>
                    <input
                      v-model="model.bollard.backgroundColor"
                      class="form-control ColorPickerBox"
                      type="color"
                    />
                  </div>
                  <div class="col-lg-4">
                    <label>Border</label>
                    <input
                      v-model="model.bollard.borderColor"
                      class="form-control ColorPickerBox"
                      type="color"
                    />
                  </div>
                </div>
              </div>
            </div>
          </perfect-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#kt_quick_setting {
  overflow: hidden;
}
</style>

<script>
import KTLayoutQuickSetting from "@/assets/js/berthschedule/quick-setting.js";
import KTOffcanvas from "@/assets/js/components/offcanvas.js";
import {
  GETUserSetting,
  AddorUpdateUserSetting,
  DeleteUserSetting,
} from "@/core/services/store/usersetting.module";
import { mapGetters } from "vuex";

export default {
  name: "KTQuickSetting",
  inject: ["showErrors", "showSuccess"],
  data() {
    return {
      msg: "Please Wait ...",
      loading: false,
      // model: Object,
      prefixColor: "0x",
      usersettingmodel: Object,
    };
  },
  computed: {
    ...mapGetters([
      "getUserSetting",
      "getLineWindowChartErrors",
      "getLineWindowChartMessages",
    ]),
  },
  props: {
    RefreshSetting: Function,
    model: Object,
  },
  mounted() {
    // Init Quick User Panel
    // KTLayoutQuickSetting.init(this.$refs["kt_quick_setting"]);
  },
  methods: {
    closeOffcanvas() {
      new KTOffcanvas(KTLayoutQuickSetting.getElement()).hide();
    },
    initquickSetting() {
      KTLayoutQuickSetting.init(this.$refs["kt_quick_setting"]);
    },
    openOffcanvas() {
      new KTOffcanvas(KTLayoutQuickSetting.getElement()).show();
    },
    ApplySetting() {
      this.RefreshSetting(this.model);
    },
    SaveSetting() {
      const vm = this;
      this.loading = true;
      let state = this.model;

      const MyData = {
        SettingType: 2,
        model: state,
      };

      this.$store.dispatch(AddorUpdateUserSetting, MyData).then(() => {
        const errors = vm.getLineWindowChartErrors;
        if (errors.length > 0) {
          vm.showErrors(errors);
          vm.loading = false;
        } else {
          vm.showSuccess(this.getLineWindowChartMessages);
          //this.model = state;
          this.$nextTick(() => {
            vm.ApplySetting();
            vm.loading = false;
          });
        }
      });
    },
    ResetSetting() {
      const vm = this;
      vm.loading = true;
      const MyData = {
        SettingType: 2,
      };
      this.$store.dispatch(DeleteUserSetting, MyData).then(() => {
        const errors = this.getLineWindowChartErrors;
        if (errors.length > 0) {
          this.showErrors(errors);
          this.loading = false;
        } else {
          vm.showSuccess(this.getLineWindowChartMessages);
          vm.GetSetting().then(
            function() {
              vm.$nextTick(() => {
                //vm.ApplySetting();
                vm.RefreshSetting(vm.usersettingmodel);
                //vm.model =vm.usersettingmodel;
                vm.$emit("updateusersetting", vm.usersettingmodel);
                vm.loading = false;
              });
            },
            function() {
              vm.loading = false;
            }
          );
        }
      });
    },
    GetSetting() {
      const vm = this;
      let promise1 = new Promise(function(resolve, reject) {
        const MyData = {
          SettingType: 2,
        };

        vm.$store.dispatch(GETUserSetting, MyData).then(() => {
          const errors = vm.getLineWindowChartErrors;
          if (errors.length > 0) {
            vm.showErrors(errors);
            reject("failed");
          } else {
            // vm.model = vm.getUserSetting;

            vm.usersettingmodel = vm.getUserSetting;
            //let data = vm.getUserSetting;
            // vm.$emit("updateusersetting", data);

            vm.$nextTick(() => {
              resolve("success");
            });
          }
        });
      });
      return promise1;
    },
  },
};
</script>
<style scoped>
.SeparatorList {
  border-bottom: 1px dashed #d6d6d6 !important;
}
</style>
