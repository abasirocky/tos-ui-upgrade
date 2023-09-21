<template>
  <div>
    <BlockUI v-if="loading" :message="msg">
      <i class="fa fa-spinner fa-spin fa-2x fa-fw"></i>
    </BlockUI>

    <b-form
      class="form"
      @submit.stop.prevent="onSubmit"
      v-if="voyagesofmodel != undefined && voyagesofmodel != null"
    >
      <div>
        <div class="row">
          <div class="col-md-6">
            <b-form-group
              id="input-group-2"
              label="Start Bollard"
              label-for="input-2"
            >
              <model-select
                :options="bollards"
                v-model="startBollard"
                placeholder="select item"
                :class="{
                  'form-group--error': $v.startBollard.$error,
                }"
              >
              </model-select>
              <b-row>
                <b-col>
                  <b-form-invalid-feedback
                    :state="
                      $v.startBollard.$dirty ? !$v.startBollard.$anyError : null
                    "
                    v-if="!$v.startBollard.required"
                  >
                    Field is required
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>
            </b-form-group>
          </div>
          <div class="col-md-6">
            <b-form-group
              id="input-group-2"
              label="End Bollard"
              label-for="input-2"
            >
              <model-select
                :options="bollards"
                v-model="endBollard"
                placeholder="select item"
                :class="{
                  'form-group--error': $v.endBollard.$error,
                }"
              >
              </model-select>
              <b-row>
                <b-col>
                  <b-form-invalid-feedback
                    :state="
                      $v.endBollard.$dirty ? !$v.endBollard.$anyError : null
                    "
                    v-if="!$v.endBollard.required"
                  >
                    Field is required
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>
            </b-form-group>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <b-form-group
              id="input-group-2"
              label="Start Date"
              label-for="input-2"
            >
              <date-picker
                v-model="voyagesofmodel.startDate"
                name="voyagesofmodel.startDate"
                type="datetime"
                placeholder="Choose Date"
                format="YYYY/MM/DD HH:mm"
                value-type="format"
                :class="{
                  'form-group--error': $v.voyagesofmodel.startDate.$error,
                }"
              ></date-picker>
              <b-row>
                <b-col>
                  <b-form-invalid-feedback
                    :state="
                      $v.voyagesofmodel.startDate.$dirty
                        ? !$v.voyagesofmodel.startDate.$anyError
                        : null
                    "
                    v-if="!$v.voyagesofmodel.startDate.required"
                  >
                    Field is required
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>
            </b-form-group>
          </div>
          <div class="col-md-6">
            <b-form-group
              id="input-group-2"
              label="End Date"
              label-for="input-2"
            >
              <date-picker
                v-model="voyagesofmodel.endDate"
                name="voyagesofmodel.endDate"
                type="datetime"
                placeholder="Choose Date"
                format="YYYY/MM/DD HH:mm"
                value-type="format"
                :class="{
                  'form-group--error': $v.voyagesofmodel.endDate.$error,
                }"
              ></date-picker>
              <b-row>
                <b-col>
                  <b-form-invalid-feedback
                    :state="
                      $v.voyagesofmodel.endDate.$dirty
                        ? !$v.voyagesofmodel.endDate.$anyError
                        : null
                    "
                    v-if="!$v.voyagesofmodel.endDate.required"
                  >
                    Field is required
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>
            </b-form-group>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <b-form-group
              id="input-group-2"
              label="Berth Side"
              label-for="input-2"
            >
              <model-select
                :options="berthSides"
                v-model="berthSide"
                placeholder="select item"
                :class="{
                  'form-group--error': $v.berthSide.$error,
                }"
              >
              </model-select>
              <b-row>
                <b-col>
                  <b-form-invalid-feedback
                    :state="
                      $v.berthSide.$dirty ? !$v.berthSide.$anyError : null
                    "
                    v-if="!$v.berthSide.required"
                  >
                    Field is required
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>
            </b-form-group>
          </div>
        </div>
        <hr />
        <button class="btn btn-primary mx-2 mr-3" type="submit">
          <inline-svg
            class="saab-icon-14"
            fill="#24A148"
            src="media/svg/saab/Save.svg"
          />
          Save
        </button>
      </div>

      <!-- <b-card no-body>
        <div class="card card-custom 555gutter-b  " style="height:100%;">
          <div class="card-header  pr-0 pl-5">
            <h3 class="card-title text-dark-75 font-weight-bolder font-size-h5">
              Plan
            </h3>
            <div class="card-toolbar">
              <div class="example-tools justify-content-center">
               
                <button class="btn btn-primary mx-2 mr-3" type="submit">
                  <inline-svg
                    class="saab-icon-14"
                    fill="#24A148"
                    src="media/svg/saab/Save.svg"
                  />
                  Save
                </button>
              </div>
            </div>
          </div>
        ssssss
        </div>
      </b-card> -->
    </b-form>
  </div>
</template>

<script>
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import moment from "moment";
import { required } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import {
  GET_VoyageSOF_Plan,
  GET_VoyageSOF_AllBollard,
  GET_VoyageSOF_AllBerthSide,
  AddOrUpdate_VoyageSOF_Plan,
  GET_VoyageSOF_EndBollard,
} from "@/core/services/store/voyagesof.module";
import { mapGetters } from "vuex";

export default {
  mixins: [validationMixin],
  name: "Plan",
  components: {
    DatePicker,
  },
  inject: ["showErrors", "showSuccess"],
  data() {
    return {
      loading: false,
      msg: "Please Wait ...",
      bollards: [],
      berthSides: [],
      voyagesofmodel: null,
      startBollard: "",
      endBollard: "",
      berthSide: "",
    };
  },
  validations: {
    voyagesofmodel: {
      startDate: { required },
      endDate: { required },
    },
    startBollard: { required },
    endBollard: { required },
    berthSide: { required },
  },
  props: {
    // voyagesofmodel: Object,
    voyageId: Number,
    callback: Function,
    refresh: Function,
    // removeUnvesselplanfromModel: Function,
    callbackPlan: Function,
  },
  computed: {
    ...mapGetters([
      "getVoyageSOFPlan",
      "getVoyageSOFAllBollard",
      "getVoyageSOFAllBerthSide",
      "getVoyageSOFEndBollard",
      "getVoyageSOFErrors",
      "getVoyageSOFMessages",
    ]),
  },

  mounted() {
    this.getInit();
  },

  methods: {
    getInit() {
      this.loading = true;
      const vm = this;

      this.GetAllBollards().then(
        function() {
          vm.GetAllBerthSide().then(
            function() {
              vm.SOF_GetPlan().then(
                function() {
                  vm.loading = false;
                },
                function() {
                  //console.log(failureFunc);
                  vm.loading = false;
                }
              );
            },
            function() {
              //console.log(failureFunc);
              vm.loading = false;
            }
          );
        },
        function() {
         // console.log(failureFunc);
          vm.loading = false;
        }
      );
    },
    onSubmit() {
      this.$v.$touch();
      if (this.$v.$anyError) {
        return;
      }

      this.$confirm({
        message: `Are you sure?`,
        button: {
          no: "No",
          yes: "Yes",
        },
        callback: (confirm) => {
          if (confirm) {
            const vm = this;
            this.loading = true;
            let state = this.voyagesofmodel;
            state.startDate = moment(state.startDate).format(
              "YYYY-MM-DDTHH:mm:ss"
            );
            state.endDate = moment(state.endDate).format("YYYY-MM-DDTHH:mm:ss");

            state.startBollardId = Number(vm.startBollard);
            state.endBollardId = Number(vm.endBollard);
            state.berthSide = Number(vm.berthSide);

            vm.$store.dispatch(AddOrUpdate_VoyageSOF_Plan, state).then(() => {
              vm.voyagesofmodel.startDate = moment(
                vm.voyagesofmodel.startDate
              ).format("YYYY/MM/DD HH:mm");

              vm.voyagesofmodel.endDate = moment(
                vm.voyagesofmodel.endDate
              ).format("YYYY/MM/DD HH:mm");

              const errors = vm.getVoyageSOFErrors;
              if (errors.length > 0) {
                vm.showErrors(errors);
                vm.loading = false;
              } else {
                vm.showSuccess(vm.getVoyageSOFMessages);

                //1- hide modal
                vm.$bvModal.hide("modalPlan");
                //2- remove from model/add to chart
                vm.callbackPlan(vm.voyagesofmodel.voyageId);
                vm.loading = false;
              }
            });
          }
        },
      });
    },

    SOF_GetPlan() {
      const vm = this;
      let promise1 = new Promise(function(resolve, reject) {
        const state = {
          voyageId: parseInt(vm.voyageId),
        };
        vm.$store.dispatch(GET_VoyageSOF_Plan, state).then(() => {
          const errors = vm.getVoyageSOFErrors;
          if (errors.length > 0) {
            vm.showErrors(errors);
            reject("failed");
          } else {
            vm.voyagesofmodel = vm.getVoyageSOFPlan;

            vm.voyagesofmodel.startDate = moment(
              vm.voyagesofmodel.startDate
            ).format("YYYY/MM/DD HH:mm");

            vm.voyagesofmodel.endDate = moment(
              vm.voyagesofmodel.endDate
            ).format("YYYY/MM/DD HH:mm");

            vm.startBollard = vm.bollards.find(
              (r) => r.value === String(vm.voyagesofmodel.startBollardId)
            );

            vm.endBollard = vm.bollards.find(
              (r) => r.value === String(vm.voyagesofmodel.endBollardId)
            );

            vm.berthSide = vm.berthSides.find(
              (r) => r.value === String(vm.voyagesofmodel.berthSide)
            );

            resolve("success");
          }
        });
      });
      return promise1;
    },
    GetAllBollards() {
      const vm = this;
      let promise1 = new Promise(function(resolve, reject) {
        const state = {
          voyageId: parseInt(vm.voyageId),
        };
        vm.$store.dispatch(GET_VoyageSOF_AllBollard, state).then(() => {
          const errors = vm.getVoyageSOFErrors;
          if (errors.length > 0) {
            vm.showErrors(errors);
            reject("failed");
          } else {
            vm.bollards = vm.getVoyageSOFAllBollard;
            resolve("success");
          }
        });
      });
      return promise1;
    },
    GetAllBerthSide() {
      const vm = this;
      let promise1 = new Promise(function(resolve, reject) {
        const state = {
          voyageId: parseInt(vm.voyageId),
        };
        vm.$store.dispatch(GET_VoyageSOF_AllBerthSide, state).then(() => {
          const errors = vm.getVoyageSOFErrors;
          if (errors.length > 0) {
            vm.showErrors(errors);
            reject("failed");
          } else {
            vm.berthSides = vm.getVoyageSOFAllBerthSide;
            resolve("success");
          }
        });
      });
      return promise1;
    },
  },
  watch: {
    startBollard: function(item) {
      if (item) {
        const startBollardId = Number(item);
        const state = {
          voyageId: parseInt(this.voyageId),
          startBollardId: parseInt(startBollardId),
        };

        this.$store.dispatch(GET_VoyageSOF_EndBollard, state).then(() => {
          const errors = this.getVoyageSOFErrors;
          if (errors.length > 0) {
            this.showErrors(errors);
          } else {
            const endBollardId = this.getVoyageSOFEndBollard;

            this.endBollard = this.bollards.find(
              (r) => r.value === String(endBollardId)
            );
          }
        });
      }
    },
  },
};
</script>
