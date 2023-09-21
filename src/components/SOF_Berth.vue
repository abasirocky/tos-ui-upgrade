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
        <b-card no-body>
          <div class="card card-custom 555gutter-b" style="height: 100%">
            <div class="card-header pr-0 pl-5">
              <h3 class="card-title text-dark-75 font-weight-bolder font-size-h5">
                Berth
              </h3>
              <div class="card-toolbar">
                <div class="example-tools justify-content-center">
                  <button
                    @click="deleteSOFBerth"
                    class="
                      btn btn-outline-danger
                      font-weight-bold
                      btn-sm
                      mx-2
                      Mybtn1-danger
                      Mybtn-size1
                    "
                    type="button"
                  >
                    <i class="fas fa-trash-alt"></i>
                    DELETE
                  </button>
  
                  <button
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
                    <i class="fas fa-save"></i>
                    SAVE
                  </button>
                </div>
              </div>
            </div>
            <div class="card-body">
              <!-- Start Dock -->
  
              <div class="row" v-if="terminalId == null || terminalId == 0">
                <div class="col-md-12">
                  <b-form-group id="input-group-2" label="Dock">
                    <treeselect
                      id="treeDock"
                      :normalizer="normalizer"
                      :options="docks"
                      v-model="dock"
                      :multiple="false"
                      placeholder="Select your item(s)..."
                      :disabled="IsBollardDisabled"
                    >
                    </treeselect>
                  </b-form-group>
                </div>
              </div>
  
              <!-- end Dock -->
  
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
                        'form-group--error': $v.startBollard.value.$error,
                      }"
                      :isDisabled="IsBollardDisabled"
                    >
                    </model-select>
                    <b-row>
                      <b-col>
                        <b-form-invalid-feedback
                          :state="
                            $v.startBollard.value.$dirty
                              ? !$v.startBollard.value.$anyError
                              : null
                          "
                          v-if="!$v.startBollard.value.required"
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
                        'form-group--error': $v.endBollard.value.$error,
                      }"
                      :isDisabled="true"
                    >
                    </model-select>
  
                    <b-row>
                      <b-col>
                        <b-form-invalid-feedback
                          :state="
                            $v.endBollard.value.$dirty
                              ? !$v.endBollard.value.$anyError
                              : null
                          "
                          v-if="!$v.endBollard.value.required"
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
                        'form-group--error': $v.berthSide.value.$error,
                      }"
                    >
                    </model-select>
                    <b-row>
                      <b-col>
                        <b-form-invalid-feedback
                          :state="
                            $v.berthSide.value.$dirty
                              ? !$v.berthSide.value.$anyError
                              : null
                          "
                          v-if="!$v.berthSide.value.required"
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
                    label="Berth Date"
                    label-for="input-2"
                  >
                    <date-picker
                      v-model="voyagesofmodel.berthDate"
                      name="voyagesofmodel.berthDate"
                      type="datetime"
                      placeholder="Choose Date"
                      format="YYYY/MM/DD HH:mm"
                      value-type="format"
                      :class="{
                        'form-group--error': $v.voyagesofmodel.berthDate.$error,
                      }"
                    ></date-picker>
                    <b-row>
                      <b-col>
                        <b-form-invalid-feedback
                          :state="
                            $v.voyagesofmodel.berthDate.$dirty
                              ? !$v.voyagesofmodel.berthDate.$anyError
                              : null
                          "
                          v-if="!$v.voyagesofmodel.berthDate.required"
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
                    label="Start Operation"
                    label-for="input-2"
                  >
                    <date-picker
                      v-model="voyagesofmodel.startOperation"
                      name="voyagesofmodel.startOperation"
                      type="datetime"
                      placeholder="Choose Date"
                      format="YYYY/MM/DD HH:mm"
                      value-type="format"
                    ></date-picker>
                  </b-form-group>
                </div>
                <div class="col-md-6">
                  <b-form-group
                    id="input-group-2"
                    label="End Operation"
                    label-for="input-2"
                  >
                    <date-picker
                      v-model="voyagesofmodel.endOperation"
                      name="voyagesofmodel.endOperation"
                      type="datetime"
                      placeholder="Choose Date"
                      format="YYYY/MM/DD HH:mm"
                      value-type="format"
                    ></date-picker>
                  </b-form-group>
                </div>
              </div>
  
              <div class="row">
                <div class="col-md-6">
                  <b-form-group
                    id="input-group-2"
                    label="Unberth Date"
                    label-for="input-group-2"
                  >
                    <date-picker
                      v-model="voyagesofmodel.unberthDate"
                      name="voyagesofmodel.unberthDate"
                      type="datetime"
                      placeholder="Choose Date"
                      format="YYYY/MM/DD HH:mm"
                      value-type="format"
                    ></date-picker>
                  </b-form-group>
                </div>
              </div>
            </div>
          </div>
        </b-card>
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
    GET_VoyageSOF_Berth,
    GET_VoyageSOF_AllBollard,
    GET_VoyageSOF_AllBerthSide,
    AddOrUpdate_VoyageSOF_Berth,
    Delete_VoyageSOF_Berth,
    GET_VoyageSOF_EndBollard,
  } from "@/core/services/store/voyagesof.module";
  
  //GETAllDocks
  import { GETAllDocksByVoyageId } from "@/core/services/store/terminal.module";
  
  import { mapGetters } from "vuex";
  
  export default {
    mixins: [validationMixin],
    name: "SOFBerth",
    components: {
      DatePicker,
    },
    inject: ["showErrors", "showSuccess", "isStandalone"],
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
        IsBollardDisabled: false,
        docks: [],
        dock: null,
        standalone: this.isStandalone,
      };
    },
    validations: {
      voyagesofmodel: {
        berthDate: { required },
      },
      startBollard: {
        text: { required },
        value: { required },
      },
      endBollard: {
        text: { required },
        value: { required },
      },
      berthSide: {
        text: { required },
        value: { required },
      },
    },
    props: {
      voyageId: Number,
      updateVoyageProperty: Function,
      refresh: Function,
      terminalId: Number,
    },
    computed: {
      ...mapGetters([
        "getVoyageSOFBerth",
        "getVoyageSOFAllBollard",
        "getVoyageSOFAllBerthSide",
        "getVoyageSOFEndBollard",
        "getVoyageSOFErrors",
        "getVoyageSOFMessages",
        "getAllDocksByVoyageId",
        "getDockErrors",
        "getDockMessages",
      ]),
    },
  
    mounted() {
      this.getInit();
    },
  
    methods: {
      getInit() {
        this.loading = true;
        this.GetAllDocksByVoyageId(() => {
          this.GetAllBollards(() => {
            this.GetAllBerthSide(() => {
              this.SOF_GetBerth(() => {
                this.loading = false;
              });
            });
          });
        });
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
              let state = JSON.parse(JSON.stringify(this.voyagesofmodel));
              state.berthDate = moment(state.berthDate).format(
                "YYYY-MM-DDTHH:mm:ss"
              );
              if (state.unberthDate != null) {
                state.unberthDate = moment(state.unberthDate).format(
                  "YYYY-MM-DDTHH:mm:ss"
                );
              }
  
              if (state.startOperation != null) {
                state.startOperation = moment(state.startOperation).format(
                  "YYYY-MM-DDTHH:mm:ss"
                );
              }
              if (state.endOperation != null) {
                state.endOperation = moment(state.endOperation).format(
                  "YYYY-MM-DDTHH:mm:ss"
                );
              }
  
              state.startBollardId = Number(this.startBollard.value);
              state.endBollardId = Number(this.endBollard.value);
              state.berthSide = Number(this.berthSide.value);
  
              this.$store
                .dispatch(AddOrUpdate_VoyageSOF_Berth, state)
                .then(() => {
                  vm.voyagesofmodel.berthDate = moment(
                    this.voyagesofmodel.berthDate
                  ).format("YYYY/MM/DD HH:mm");
  
                  if (this.voyagesofmodel.unberthDate != null) {
                    vm.voyagesofmodel.unberthDate = moment(
                      this.voyagesofmodel.unberthDate
                    ).format("YYYY/MM/DD HH:mm");
                  }
  
                  const errors = this.getVoyageSOFErrors;
                  if (errors.length > 0) {
                    this.showErrors(errors);
                    this.loading = false;
                  } else {
                    vm.showSuccess(this.getVoyageSOFMessages);
                    //Update VoyageProperty
  
                    vm.updateVoyageProperty(() => {
                      vm.SOF_GetBerth(() => {
                        vm.loading = false;
                      });
                    });
  
                    // vm.updateVoyageProperty().then(
                    //   function() {
                    //     vm.SOF_GetBerth(() => {
                    //       vm.loading = false;
                    //     });
                    //   },
                    //   function() {
                    //     vm.loading = false;
                    //   }
                    // );
                  }
                });
            }
          },
        });
      },
      deleteSOFBerth() {
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
                id: this.voyagesofmodel.voyageBerthId,
                rowVersion: this.voyagesofmodel.rowVersion,
              };
              this.$store.dispatch(Delete_VoyageSOF_Berth, state).then(() => {
                const errors = this.getVoyageSOFErrors;
                if (errors.length > 0) {
                  this.showErrors(errors);
                  this.loading = false;
                } else {
                  vm.showSuccess(this.getVoyageSOFMessages);
                  //Update VoyageProperty
  
                  vm.updateVoyageProperty(() => {
                    vm.SOF_GetBerth(() => {
                      vm.loading = false;
                    });
                  });
  
                  // vm.updateVoyageProperty().then(
                  //   function() {
                  //     vm.SOF_GetBerth(() => {
                  //       vm.loading = false;
                  //     });
                  //   },
                  //   function() {
                  //     vm.loading = false;
                  //   }
                  // );
                }
              });
            }
          },
        });
      },
  
      SOF_GetBerth(callback) {
        const state = {
          voyageId: parseInt(this.voyageId),
        };
        this.$store.dispatch(GET_VoyageSOF_Berth, state).then(() => {
          const errors = this.getVoyageSOFErrors;
          if (errors.length > 0) {
            this.showErrors(errors);
          } else {
            this.voyagesofmodel = this.getVoyageSOFBerth;
  
            
  
            if (this.voyagesofmodel.voyageBerthId > 0) {
              this.IsBollardDisabled = true;
            } else {
              this.IsBollardDisabled = false;
            }
  
            var myDate = new Date("0001-01-01T00:00:00Z");
  
            if (
              new Date(this.voyagesofmodel.berthDate).getFullYear() !=
              myDate.getFullYear()
            ) {
              this.voyagesofmodel.berthDate = moment(
                this.voyagesofmodel.berthDate
              ).format("YYYY/MM/DD HH:mm");
            } else {
              this.voyagesofmodel.berthDate = "";
            }
  
            if (this.voyagesofmodel.unberthDate != null) {
              this.voyagesofmodel.unberthDate = moment(
                this.voyagesofmodel.unberthDate
              ).format("YYYY/MM/DD HH:mm");
            }
  
            if (this.voyagesofmodel.startOperation != null) {
              this.voyagesofmodel.startOperation = moment(
                this.voyagesofmodel.startOperation
              ).format("YYYY/MM/DD HH:mm");
            }
  
            if (this.voyagesofmodel.endOperation != null) {
              this.voyagesofmodel.endOperation = moment(
                this.voyagesofmodel.endOperation
              ).format("YYYY/MM/DD HH:mm");
            }
  
            if (
              this.voyagesofmodel.startBollardId != null &&
              this.voyagesofmodel.startBollardId != 0
            ) {
              this.startBollard = this.bollards.find(
                (r) => r.value === String(this.voyagesofmodel.startBollardId)
              );
            } else {
              this.startBollard = { text: "", value: "" };
            }
            if (
              this.voyagesofmodel.endBollardId != null &&
              this.voyagesofmodel.endBollardId != 0
            ) {
              this.endBollard = this.bollards.find(
                (r) => r.value === String(this.voyagesofmodel.endBollardId)
              );
            } else {
              this.endBollard = { text: "", value: "" };
            }
            if (this.voyagesofmodel.berthSide != 0) {
              this.berthSide = this.berthSides.find(
                (r) => r.value === String(this.voyagesofmodel.berthSide)
              );
            } else {
              this.berthSide = { text: "", value: "" };
            }
            callback();
          }
        });
      },
  
      GetAllBollards(callback) {
        const state = {
          voyageId: parseInt(this.voyageId),
          terminalId: parseInt(this.dock),
        };
        this.$store.dispatch(GET_VoyageSOF_AllBollard, state).then(() => {
          const errors = this.getVoyageSOFErrors;
          if (errors.length > 0) {
            this.showErrors(errors);
          } else {
            this.bollards = this.getVoyageSOFAllBollard;
            if (callback) {
              callback();
            }
          }
        });
      },
  
      GetAllDocksByVoyageId(callback) {
        const state = {
          voyageid: parseInt(this.voyageId),
        };
  
        this.$store.dispatch(GETAllDocksByVoyageId, state).then(() => {
          const errors = this.getDockErrors;
          if (errors.length > 0) {
            this.showErrors(errors);
          } else {
            const result = this.getAllDocksByVoyageId;
            this.docks = result;
  
            if (this.docks.length > 0) {
              if (this.standalone && !this.dock) {
                if (this.terminalId != null && this.terminalId != 0) {
                  this.dock = this.terminalId;
                } else {
                  this.dock = [this.docks[0].id];
                }
              }
            }
            callback();
          }
        });
      },
  
      GetAllBerthSide(callback) {
        const state = {
          voyageId: parseInt(this.voyageId),
        };
        this.$store.dispatch(GET_VoyageSOF_AllBerthSide, state).then(() => {
          const errors = this.getVoyageSOFErrors;
          if (errors.length > 0) {
            this.showErrors(errors);
          } else {
            this.berthSides = this.getVoyageSOFAllBerthSide;
            callback();
          }
        });
      },
  
      normalizer(node) {
        if (node.children == null || node.children == "null") {
          delete node.children;
        }
      },
    },
    watch: {
      startBollard: function(item) {
        if (item && item.value != "") {
          const startBollardId = Number(item.value);
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
  
      dock: function(item) {
        if (item && item != "") {
          if (!this.loading) {
            this.GetAllBollards();
          }
        }
      },
    },
  };
  </script>
  @/core/services/store/terminal.module