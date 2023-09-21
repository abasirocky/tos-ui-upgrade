import Vue from "vue";
import { ModelSelect, MultiSelect } from "vue-search-select";
import "vue-search-select/dist/VueSearchSelect.css";

Vue.use(ModelSelect, MultiSelect);
Vue.component("model-select", ModelSelect);
Vue.component("multi-select", MultiSelect);