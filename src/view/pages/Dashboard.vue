<template>
  <div class="MyContent">
    <div class="subheader MySubheader px-2 py-2 py-lg-4 subheader-solid" id="toolbar">
      <div
        class="
          container-fluid
          d-flex
          align-items-center
          justify-content-between
          flex-wrap flex-sm-nowrap
        "
      >
        <div class="d-flex align-items-center flex-wrap mr-2">
          <h5 class="font-weight-bolder text-dark mb-0 MySubHeaderTitle">Dashboard</h5>

          <div
            class="
              subheader-separator subheader-separator-ver
              mt-2
              mb-2
              ml-4
              mr-4
              bg-gray-100
            "
          ></div>

          <div class="">
            <!-- DropDownListFor -->
            <model-select :options="getPorts" v-model="selectport" placeholder="select item" class="Mydropdown"> </model-select>
          </div>
        </div>

        <b-col class="d-flex flex-row-reverse">
          <div class="pt-2 pb-2 pl-3 pr-3 m-0 MyDashboardDate">
            <span class="font-weight-boldest mr-1">
              <i class="far fa-calendar-alt text-primary"></i>
            </span>
            <span class="font-weight-boldest"> {{ currentDate }}</span>
          </div>

          <div>
            <button type="button" @click="refresh" class="btn btn-outline-primary font-weight-bold btn-sm mx-4 Mybtn1-primary Mybtn-size1">
              <i class="fas fa-sync-alt"></i>
              REFRESH
            </button>
          </div>
        </b-col>
      </div>
    </div>

    <b-row>
      <b-col cols="12" xs="12" sm="6" md="4">
        <VesselCallChart class="height999" :portid="portid"></VesselCallChart>
      </b-col>
      <b-col cols="12" xs="12" sm="6" md="4">
        <VesselCallChartState class="height999" :portid="portid"></VesselCallChartState>
      </b-col>

      <b-col cols="12" xs="12" sm="6" md="4">
        <KPIView class="height999" :portid="portid" v-if="portid != '0'"></KPIView>
      </b-col>
    </b-row>

    <VOYAGELIST :portId="portid" v-if="portid != '0'"></VOYAGELIST>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import VesselCallChart from "@/view/pages/dashboard/VesselCallChart.vue";
import VesselCallChartState from "@/view/pages/dashboard/VesselCallChartState.vue";
import KPIView from "@/view/pages/dashboard/KPIView.vue";
import { GET_PORTS_DASHBOARD } from "@/core/services/store/dashboard.module";
import VOYAGELIST from "@/view/pages/dashboard/voyageView.vue";

export default {
  created() {},
  name: "dashboard",
  inject: ["showErrors", "showSuccess"],
  components: {
    VesselCallChart,
    VesselCallChartState,
    KPIView,
    VOYAGELIST,
  },
  data: () => {
    return {
      loading: false,
      selectport: null,
      duration: "Y",
      portid: "0",
      currentDate: "",
    };
  },
  computed: {
    ...mapGetters(["getPorts", "getDashboardErrors", "getDashboardMessages"]),
  },
  watch: {
    selectport: function(item) {
      this.portid = item ? item.value : "0";

      this.refresh();
    },
  },

  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Dashboard" }]);
    this.loadport();
    this.getCurrentDate();
  },
  methods: {
    refresh() {
      this.portid = "0";
      this.$nextTick(() => {
        // this.portid = Number(this.selectport.value);
        this.portid = this.selectport.value;
      });
    },
    loadport() {
      this.loading = true;
      this.$store.dispatch(GET_PORTS_DASHBOARD, {}).then(() => {
        this.loading = false;
        const errors = this.getDashboardErrors;
        if (errors.length > 0) {
          this.showErrors(errors);
        } else {
          const messages = this.getDashboardMessages;
          this.showSuccess(messages);
          const ports = this.getPorts;
          this.selectport = ports[0];
        }
      });
    },
    getCurrentDate() {
      this.currentDate = new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate();
    },
  },
};
</script>
<style scoped>
@media (max-width: 600px) {
  .MyDashboardDate {
    display: none !important;
  }
}
</style>
