<template>
  <div>
    <BlockUI v-if="loading" :message="msg">
      <i class="fa fa-spinner fa-spin fa-2x fa-fw"></i>
    </BlockUI>
    <vue-confirm-dialog></vue-confirm-dialog>

    <div class="d-flex flex-row-reverse bd-highlight">
      <div class="p-2 bd-highlight">
        <button
          @click="GenerateConcept()"
          class="btn btn-outline-primary font-weight-bold btn-sm mx-2 Mybtn1-primary Mybtn-size1"
          type="submit"
        >
          <i class="fas fa-save "></i>Save
        </button>
      </div>
    </div>
    <div style="max-height: 40vh;overflow: auto;">
      <b-table
        striped
        hover
        :items="autoPlanningListModel"
        :fields="fields"
        :busy.sync="loading"
        sort-icon-left
        responsive="sm"
        fixed
      >
        <template #head(planId)>
          <!-- <div class="text-nowrap">#</div> -->
          <label class="checkbox checkbox-outline checkbox-primary">
            <input type="checkbox" v-model="ItemSelectAll" />
            <span class="mr-2"></span>Select All
          </label>
        </template>

        <template #head(totalPlan)>
          Plan
        </template>

        <template #cell(planId)="row">
          <label class="checkbox checkbox-outline checkbox-primary">
            <input type="checkbox" v-model="row.item.itemSelected" />
            <span class="mr-2"></span>{{ row.value }}
          </label>
        </template>

        <!-- <template #cell(totalPlan)="row">
            {{ row.item.totalPlaned }} / {{ row.value }}
          </template> -->

        <template #cell(Plan(s))="row">
          <button
            @click="ShowPlans(row)"
            class="btn btn-outline-primary btn-sm btn-sm  font-weight-bold  55mx-2 Mybtn1-primary55 Mybtn-size1"
            type="submit"
          >
            <!-- Plan(s) -->
            {{ row.item.totalPlaned }} / {{ row.item.totalPlan }}
          </button>
        </template>
      </b-table>
    </div>
    <b-modal
      id="planModalList"
      size="xl"
      hide-footer
      v-model="modalShowPlanList"
      centered
      title
      content-class="shadow"
      header-class=" pb-8 ribbon ribbon-clip ribbon-left"
    >
      <template #modal-title>
        <div class="ribbon-target" style="top: 12px">
          <span class="ribbon-inner bg-success" />
          <span class="font-weight-bolder font-size-sm">Plan(s)</span>
        </div>
      </template>

      <div style="max-height: 40vh;overflow: auto;">
        <b-table
          striped
          hover
          :items="plans"
          :fields="planFields"
          :busy.sync="loading"
          sort-icon-left
          responsive="sm"
          fixed
        >
          <template #cell(voyageIn)="row">
            ({{ row.value }}/{{ row.item.voyageOut }})
          </template>

          <template #cell(startPosition)="row">
            {{ row.value }}-{{ row.item.endPosition }}
          </template>

          <template #cell(hasPlan)="row">
            <div v-show="row.value === false">
              <b-badge variant="danger">No</b-badge>
            </div>

            <div v-show="row.value === true">
              <b-badge variant="success">Yes</b-badge>
            </div>
          </template>
        </b-table>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { AddAutoPlantoConcept } from "@/core/services/store/concept.module";
import { mapGetters } from "vuex";
export default {
  inject: ["showErrors", "showSuccess", "showWarning", "isStandalone"],

  props: ["autoPlanningListModel", "fncCreateAutoPlanningListCallBack"],

  data() {
    return {
      msg: "Please Wait ...",
      loading: false,
      standalone: this.isStandalone,
      fields: [
        // { key: "itemSelected", sortable: false, label: "" },
        { key: "planId", sortable: false, label: "#" },
        { key: "title", sortable: false },
        { key: "totalLeeway", sortable: false, class: 'text-center' },
        { key: "leewaySTD", sortable: false, class: 'text-center' },
        { key: "ranking", sortable: false , class: 'text-center'},
        // { key: "totalPlan", sortable: false },
        { key: "Plan(s)", sortable: false, class: 'text-center' },
      ],
      planFields: [
        { key: "vesselName", sortable: false, label: "Vessel" },
        { key: "voyageIn", sortable: false, label: "Voyage (In/Out)" },
        { key: "startBollard", sortable: false, label: "Start Bollard", class: 'text-center' },
        { key: "endBollard", sortable: false, label: "End Bollard", class: 'text-center' },
        { key: "startPosition", sortable: false, label: "Start-End(Pos)", class: 'text-center' },
        // { key: "endPosition", sortable: false, label: "End Position" },
        { key: "leeway", sortable: false, label: "Leeway", class: 'text-center' },
        { key: "hasPlan", sortable: false, label: "Plan", class: 'text-center' },
      ],
      modalShowPlanList: false,
      plans: null,
      ItemSelectAll: true,
    };
  },
  computed: {
    ...mapGetters([
      "AddAutoPlantoConcept",
      "getConceptChartErrors",
      "getConceptChartMessages",
      "getAddAutoPlantoConceptResultConceptNames",
      "getAddAutoPlantoConcept",
    ]),
  },
  mounted() {},
  methods: {
    ShowPlans(row) {
      this.modalShowPlanList = true;
      // alert(row.item.id);
      //debugger;
      var model = this.autoPlanningListModel.find(
        (r) => r.planId === row.item.planId
      );

      this.plans = model.plans;
    },

    GenerateConcept() {
      var model = this.autoPlanningListModel.filter(
        (r) => r.itemSelected === true
      );

      if (model.length == 0) {
        this.showWarning([
          {
            messageText: "plan not selected",
          },
        ]);
        return false;
      }

      // try {
      //   var model20 = model.filter(
      //     (r) => r.plans.filter((k) => k.hasPlan == true).length > 0
      //   );
      //   alert(model20);
      // } catch (err) {
      //   alert(err.message);
      // }

      var model2 = model.filter(
        (r) => r.plans.filter((k) => k.hasPlan == true).length > 0
      );

      if (model2.length == 0) {
        this.showWarning([
          {
            messageText: "there is no plan",
          },
        ]);
        return false;
      }
      this.loading = true;

      this.$store.dispatch(AddAutoPlantoConcept, model2).then(() => {
        const errors = this.getConceptChartErrors;
        this.loading = false;
        if (errors.length > 0) {
          this.showErrors(errors);
        } else {
          const result = this.getAddAutoPlantoConcept;
          const conceptNames = this.getAddAutoPlantoConceptResultConceptNames;
          this.fncCreateAutoPlanningListCallBack(result, conceptNames);
        }
      });
    },
  },
  watch: {
    ItemSelectAll: function(val) {
      this.autoPlanningListModel.map((r) => (r.itemSelected = val));
    },
  },
};
</script>

<style scoped>
::v-deep .black {
  color: #000 !important;
}
</style>
