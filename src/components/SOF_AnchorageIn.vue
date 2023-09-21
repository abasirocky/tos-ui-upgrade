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
                anchorage
              </h3>
              <div class="card-toolbar">
                <div class="example-tools justify-content-center">
                  <button
                    @click="deleteSOFAnchorage"
                    class="btn btn-outline-danger font-weight-bold btn-sm mx-2 Mybtn1-danger Mybtn-size1"
                    type="button"
                  >
                    <i class="fas fa-trash-alt"></i>
                    DELETE
                  </button>
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
                    label="anchorage:"
                    label-for="input-2"
                  >
                    <date-picker
                      v-model="voyagesofmodel.anchorageInDate"
                      name="voyagesofmodel.anchorageInDate"
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
  import { Update_VoyageSOF_AnchorageIn } from "@/core/services/store/voyagesof.module";
  import { mapGetters } from "vuex";
  
  export default {
    name: "SOFAnchorageIn",
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
    props: {
      voyagesofmodel: Object,
      updateVoyageProperty: Function,
    },
    computed: {
      ...mapGetters(["getVoyageSOFErrors", "getVoyageSOFMessages"]),
    },
    mounted() {
      if (this.voyagesofmodel.anchorageInDate != null) {
        this.voyagesofmodel.anchorageInDate = moment(
          this.voyagesofmodel.anchorageInDate
        ).format("YYYY/MM/DD HH:mm");
      }
    },
    methods: {
      onSubmit() {
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
  
              if (state.anchorageInDate != null) {
                state.anchorageInDate = moment(state.anchorageInDate).format(
                  "YYYY-MM-DDTHH:mm:ss"
                );
              }
  
              this.$store
                .dispatch(Update_VoyageSOF_AnchorageIn, state)
                .then(() => {
                  if (this.voyagesofmodel.anchorageInDate != null) {
                    vm.voyagesofmodel.anchorageInDate = moment(
                      vm.voyagesofmodel.anchorageInDate
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
      deleteSOFAnchorage() {
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
              state.anchorageInDate = null;
              this.$store
                .dispatch(Update_VoyageSOF_AnchorageIn, state)
                .then(() => {
                  const errors = this.getVoyageSOFErrors;
                  if (errors.length > 0) {
                    this.showErrors(errors);
                    this.loading = false;
                  } else {
                    this.voyagesofmodel.anchorageInDate = null;
                    vm.showSuccess(this.getVoyageSOFMessages);
                    //Update VoyageProperty
  
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
  