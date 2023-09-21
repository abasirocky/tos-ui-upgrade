<template>
  <div>
    <BlockUI v-if="loading" :message="msg">
      <i class="fa fa-spinner fa-spin fa-2x fa-fw"></i>
    </BlockUI>
    <vue-confirm-dialog></vue-confirm-dialog>

    <b-table @sort-changed="sortingChanged" striped hover :items="ConseptListModel" :fields="fields" :busy.sync="loading"
      sort-icon-left responsive="sm" fixed>
      <template #cell(active)="row">
        <span v-if="row.value" class="badge badge-success"> Active </span>
        <span v-if="!row.value" class="badge badge-danger"> Disable </span>
      </template>

      <!-- <template #cell(id)="row">
        <button
          @click="Item_Click(row)"
          class="btn btn-outline-primary btn-sm btn-sm  font-weight-bold  55mx-2 Mybtn1-primary55 Mybtn-size1"
          type="submit"
        >
          click
        </button>
      </template> -->

      <template #cell(actions)="row">
        <b-dropdown variant="outline-light-none" no-caret>
          <template #button-content>
            <b>. . .</b>
          </template>

          <b-dropdown-item>
            <b-button size="sm" variant="outline-dark-none " class="black" @click="Item_Click(row)">
              <i class="flaticon-eye"></i>
              View
            </b-button>
          </b-dropdown-item>

          <b-dropdown-item>
            <b-button size="sm" variant="outline-dark-none " class="black" @click="ChangeSatus(row)">
              <i v-if="!row.item.active" class="flaticon-edit"></i>
              <i v-if="row.item.active" class="flaticon-edit"></i>
              <span v-if="!row.item.active">Active</span>
              <span v-if="row.item.active">Disable</span>
            </b-button>
          </b-dropdown-item>

          <b-dropdown-item>
            <b-button size="sm" variant="outline-dark-none " class="black" @click="deleteItem(row)">
              <i class="flaticon-delete"></i>
              Delete
            </b-button>
          </b-dropdown-item>
          <b-dropdown-item>
            <b-button size="sm" variant="outline-dark-none " class="black" @click="deleteBatchItem(row)">
              <i class="flaticon-delete"></i>
              Delete Batch Plan
            </b-button>
          </b-dropdown-item>
        </b-dropdown>
      </template>
    </b-table>
    <b-row>
      <b-col sm="7" md="6" class="my-1">
        <b-pagination v-model="currentPage" :total-rows="ConseptListTotalItems" :per-page="10" align="fill" size="sm"
          class="my-0" first-text="First" prev-text="Prev" next-text="Next" last-text="Last" first-number last-number>
          <!-- <template #prev-text
            ><span class="text-info" style="font-weight: bold"
              >Prev</span
            ></template
          > -->
          <!-- <template #next-text
            ><span class="text-info" style="font-weight: bold"
              >Next</span
            ></template -->
          >
        </b-pagination>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import {
  GETConceptList,
  UPDATEConceptActive,
  Delete_Concept,
  Delete_BatchConcept,
} from "@/core/services/store/concept.module";
import { mapGetters } from "vuex";
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";

export default {
  inject: ["showErrors", "showSuccess", "isStandalone"],

  props: [
    "terminalId",
    "fncConceptListSelectItemCallBack",
    "fncConceptListDeleteItemCallBack",
  ],

  data() {
    return {
      msg: "Please Wait ...",
      loading: false,
      currentPage: 1,
      perPage: 10,

      fields: [
        { key: "id", sortable: true, label: "#" },
        { key: "name", sortable: true },
        {
          key: "totalPlan",
          sortable: true,
          label: "Plan",
          class: "text-center",
        },
        {
          key: "totalLeeway",
          sortable: true,
          label: "Leeway",
          class: "text-center",
        },
        {
          key: "leewaySTD",
          sortable: true,
          label: "Leeway STD",
          class: "text-center",
        },
        // { key: "batchId", sortable: true, label: "Batch" },
        { key: "active", sortable: true },
        { key: "actions", sortable: false },
      ],
      items: [],
      sortBy: "id",
      direction: 2,
      filter: null,
      filters: [],
      standalone: this.isStandalone,

      ConseptListModel: [],
      ConseptListTotalItems: 0,

    };
  },

  watch: {
    currentPage: function () {
      this.getdata();
    },
    filter: function () {
      this.getdata();
    },

    // if (this.$route.path !== path) this.$router.push(path)
    $route: function (to) {
      if (to.query.filter) {
        this.$bvModal.show("filterModal");

        this.$router.replace({
          path: "list",
          query: {
            filter: false,
          },
        });
      }
    },
  },
  computed: {
    ...mapGetters(["getConceptChartErrors"]),
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Country" }]);
    this.getdata();
  },
  methods: {
    ChangeSatus(row) {
      const state = {
        ConceptId: row.item.id,
        Active: !row.item.active,
      };
      this.$store.dispatch(UPDATEConceptActive, state).then(() => {
        this.loading = false;

        const errors = this.getConceptChartErrors;
        this.showErrors(errors);
        this.getdata();
        //if (row.item.active) {
        this.fncConceptListDeleteItemCallBack();
        //}
      });
    },
    sortingChanged(ctx) {
      if (ctx.sortBy != "") {
        this.sortBy = ctx.sortBy;
        this.direction = ctx.sortDesc ? 2 : 1;
        this.getdata();
      }
    },
    getdata() {
      let state = {
        pageNo: this.currentPage,
        rowPerPage: this.perPage,
        sorts: [{ sortBy: this.sortBy, direction: this.direction }],
        terminalId: Number(this.terminalId),
      };
      if (this.filter) {
        this.filters = [];
        // if (this.filter.name != null && this.filter.name != "") {
        //   this.filters.push({
        //     key: "name",
        //     value: this.filter.name,
        //     operatorType: 7,
        //   });
        // }

        state = {
          pageNo: this.currentPage,
          rowPerPage: this.perPage,
          terminalId: this.terminalId,
          sorts: [{ sortBy: this.sortBy, direction: this.direction }],
          filters: this.filters,
        };
      }
      this.loading = true;
      this.$store.dispatch(GETConceptList, state).then((res) => {
        this.loading = false;
        const errors = this.getConceptChartErrors;
        this.showErrors(errors);


        this.ConseptListModel = res.data.data;
        this.ConseptListTotalItems = res.data.totalCount;


      });
    },
    deleteItem(row) {
      const state = {
        ConceptId: row.item.id,
        rowVersion: row.item.rowVersion,
      };
      this.$store.dispatch(Delete_Concept, state).then(() => {
        this.loading = false;

        const errors = this.getConceptChartErrors;
        this.showErrors(errors);
        this.getdata();
        this.fncConceptListDeleteItemCallBack();
      });
    },
    deleteBatchItem(row) {
      const state = {
        BatchId: row.item.batchId,
        // rowVersion: row.item.rowVersion,
      };
      this.$store.dispatch(Delete_BatchConcept, state).then(() => {
        this.loading = false;

        const errors = this.getConceptChartErrors;
        this.showErrors(errors);
        this.getdata();
        this.fncConceptListDeleteItemCallBack();
      });
    },
    Item_Click(row) {
      this.fncConceptListSelectItemCallBack(row.item);
    },
  },
};
</script>

<style scoped>
::v-deep .black {
  color: #000 !important;
}
</style>
