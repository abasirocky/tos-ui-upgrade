<template>
    <div>
      <BlockUI v-if="loading" :message="msg">
        <i class="fa fa-spinner fa-spin fa-2x fa-fw"></i>
      </BlockUI>
  
      <b-form class="form" @submit.stop.prevent="onSubmit">
        <b-card no-body>
          <div class="card card-custom 555gutter-b" style="height: 100%">
            <div class="card-header pr-0 pl-5">
              <h3 class="card-title text-dark-75 font-weight-bolder font-size-h5">
                ETA
              </h3>
              <div class="card-toolbar">
                <div class="example-tools justify-content-center">
                  <button
                    class="btn btn-outline-primary font-weight-bold btn-sm mx-2 Mybtn1-primary Mybtn-size1"
                    type="submit"
                  >
                    <i class="fas fa-save "></i>
                    SAVE
                  </button>
                </div>
              </div>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-12">
                  <b-form-group
                    id="input-group-2"
                    label="ETA"
                    label-for="input-2"
                  >
                    <date-picker
                      v-model="voyagesofmodel.eta"
                      name="voyagesofmodel.eta"
                      type="datetime"
                      placeholder="Choose Date"
                      format="YYYY/MM/DD HH:mm"
                      value-type="format"
                      :class="{
                        'form-group--error': $v.voyagesofmodel.eta.$error,
                      }"
                    ></date-picker>
                    <b-row>
                      <b-col>
                        <b-form-invalid-feedback
                          :state="
                            $v.voyagesofmodel.eta.$dirty
                              ? !$v.voyagesofmodel.eta.$anyError
                              : null
                          "
                          v-if="!$v.voyagesofmodel.eta.required"
                        >
                          Field is required
                        </b-form-invalid-feedback>
                      </b-col>
                    </b-row>
                  </b-form-group>
                </div>
              </div>
  
              <div class="row">
                <div class="col-md-12">
                  <b-form-group
                    id="input-group-2"
                    label="EOT"
                    label-for="input-2"
                  >
                    <span>{{ GetOperationTime(voyagesofmodel.eot) }}</span>
                    <b-form-input
                      class="form-control"
                      id="eot"
                      v-model.trim="$v.voyagesofmodel.eot.$model"
                      type="range"
                      min="60"
                      max="10080"
                      step="1"
                      name="eot"
                      :state="
                        $v.voyagesofmodel.eot.$dirty
                          ? !$v.voyagesofmodel.eot.$anyError
                          : null
                      "
                    ></b-form-input>
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
  import { required, numeric, between } from "vuelidate/lib/validators";
  import { validationMixin } from "vuelidate";
  import { Update_VoyageSOF_ETA } from "@/core/services/store/voyagesof.module";
  import { mapGetters } from "vuex";
  import { ConvertTime } from "@/mixins.ts";
  export default {
    mixins: [validationMixin, ConvertTime],
    name: "SOFETA",
    components: {
      DatePicker,
    },
    inject: ["showErrors", "showSuccess"],
    data() {
      return {
        loading: false,
        msg: "Please Wait ...",
      };
    },
    validations: {
      voyagesofmodel: {
        eta: { required },
        eot: { required, numeric, between: between(60, 10080) },
      },
    },
    props: {
      voyagesofmodel: Object,
      updateVoyageProperty: Function,
    },
    computed: {
      ...mapGetters(["getVoyageSOFErrors", "getVoyageSOFMessages"]),
    },
    mounted() {
      this.voyagesofmodel.eta = moment(this.voyagesofmodel.eta).format(
        "YYYY/MM/DD HH:mm"
      );
    },
    methods: {
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
              state.eta = moment(state.eta).format("YYYY-MM-DDTHH:mm:ss");
  
              this.$store.dispatch(Update_VoyageSOF_ETA, state).then(() => {
                vm.voyagesofmodel.eta = moment(this.voyagesofmodel.eta).format(
                  "YYYY/MM/DD HH:mm"
                );
                const errors = vm.getVoyageSOFErrors;
                if (errors.length > 0) {
                  vm.showErrors(errors);
                  vm.loading = false;
                } else {
                  vm.showSuccess(this.getVoyageSOFMessages);
  
                  vm.updateVoyageProperty(() => {
                    vm.loading = false;
                  });
  
                  // vm.updateVoyageProperty().then(
                  //   function() {
                  //     vm.loading = false;
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
    },
  };
  </script>
  