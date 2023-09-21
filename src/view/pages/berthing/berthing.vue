<template>
  <div style="height: 600px" class="container-fluid">
    <BerthChartComponent ref="berthChart"></BerthChartComponent>
  </div>
</template>

<script >
import BerthChartComponent from "./BerthChartComponent.vue";
import axios from "axios";
export default {
  components: {
    BerthChartComponent,
  },
  data: () => {
    return {
      datamodel: null,
    };
  },
  mounted() {
    this.appdendModel();
  },
  methods: {
    appdendModel() {
      axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;
      axios.get("/json/chart/data.json").then((response) => {
        const result = response.data;

        const berthchart = this.$refs.berthChart;
        
        berthchart.renderData(result.data);
      });
    },
  },
};
</script>

  
