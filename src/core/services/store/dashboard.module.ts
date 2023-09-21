import ApiService from "@/core/services/api.service";

// action types
export const GET_PORTS_DASHBOARD = "getportsdashboard";
export const GET_VESSELCALBYCATAGORY_DASHBOARD = "getvesselcallbycatagory";
export const GET_VESSELCALBYSTATE_DASHBOARD = "getvesselcallbystate";
export const GET_KPIVIEW_DASHBOARD = "getdashboardkpiview";
export const GETVOYAGEVIEW = "getvoyageview";
// mutation typesrows
export const SET_PORTS_DASHBOARD_RESULT = "setdashboardportsresult";
export const SET_VESSELCALBYCATAGORY_DASHBOARD_RESULT =
  "setdashboardvesselcatagoryeresult";
export const SET_VESSELCALBYSTATE_DASHBOARD_RESULT =
  "setdashboardvesselstateresult";
export const SET_KPIVIEW_DASHBOARD_RESULT = "setdashboardkpiviewresult";
export const SET_DASHBOARDERROR = "setdashboarderror";
export const SET_VOYAGEVIEW = "setvoyageview";
const state = {
  errors: [],
  ports: [],
  vesselcallbycategoryview: null,
  vesselcallbystatusview: null,
  kpiview: null,
  //voyageview: [],
  messages: [],
  totalItems: 0,
  items: [],
  currentPage: 1,
};

const getters = {
  getPorts: () => state.ports,
  getDashboardErrors: () => state.errors,
  getDashboardMessages: () => state.messages,
  getvesselcallbycategoryview: () => state.vesselcallbycategoryview,
  getvesselcallbystatusview: () => state.vesselcallbystatusview,
  getKpiview: () => state.kpiview,
  //getvoyageview: () => state.voyageview
  getVoyageViewRows(state) {
    return state.items;
  },
  getVoyageViewRowsCount() {
    return state.totalItems;
  },
};

const actions = {
  [GET_PORTS_DASHBOARD](context) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/definition/Dashboard/getports")
        .then(({ data }) => {
          context.commit(SET_PORTS_DASHBOARD_RESULT, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_DASHBOARDERROR, response.data.errors);
        });
    });
  },
  [GET_VESSELCALBYCATAGORY_DASHBOARD](context, params) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData(
        `/definition/Dashboard/vesselcallbycategoryview?duration=${params.duration}&portid=${params.portid}`
      )
        .then(({ data }) => {
          context.commit(SET_VESSELCALBYCATAGORY_DASHBOARD_RESULT, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_DASHBOARDERROR, response.data.errors);
        });
    });
  },
  [GET_VESSELCALBYSTATE_DASHBOARD](context, params) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData(
        `/definition/Dashboard/vesselcallbystatusview?duration=${params.duration}&portid=${params.portid}`
      )
        .then(({ data }) => {
          context.commit(SET_VESSELCALBYSTATE_DASHBOARD_RESULT, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_DASHBOARDERROR, response.data.errors);
        });
    });
  },
  [GET_KPIVIEW_DASHBOARD](context, params) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData(
        `/definition/Dashboard/kpiview?duration=${params.duration}&portid=${params.portid}`
      )
        .then(({ data }) => {
          context.commit(SET_KPIVIEW_DASHBOARD_RESULT, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_DASHBOARDERROR, response.data.errors);
        });
    });
  },
  [GETVOYAGEVIEW](context, state) {
    let queryStr = `PageNo=${state.pageNo}&RowPerPage=${state.rowPerPage}&portId=${state.portId}`;
 if (state.sorts)
   state.sorts.forEach((item) => {
     queryStr += `&sorts[sortBy]=${item.sortBy}&sorts[direction]=${item.direction}`;
   });
 if (state.filters)
   state.filters.forEach((item) => {
     queryStr += `&filters[key]=${item.key}&filters[value]=${item.value}&filters[operatorType]=${item.operatorType}`;
   });
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/definition/Dashboard/voyageview?" + queryStr)
        .then(({ data }) => {
          context.commit(SET_VOYAGEVIEW, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_DASHBOARDERROR, response.data.errors);
        });
    });
  },
};

const mutations = {
  [SET_DASHBOARDERROR](state, error) {
    state.errors = error;
  },
  [SET_PORTS_DASHBOARD_RESULT](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.messages = apiResult.message;
      state.errors = [];
      state.ports = apiResult.data;
    } else {
      state.errors = apiResult.message;
      state.messages = [];
      state.ports = [];
    }
  },
  [SET_VESSELCALBYCATAGORY_DASHBOARD_RESULT](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.messages = apiResult.message;
      state.errors = [];
      state.vesselcallbycategoryview = apiResult.data;
    } else {
      state.errors = apiResult.message;
      state.messages = [];
      state.vesselcallbycategoryview = [];
    }
  },
  [SET_VESSELCALBYSTATE_DASHBOARD_RESULT](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.messages = apiResult.message;
      state.errors = [];
      state.vesselcallbystatusview = apiResult.data;
    } else {
      state.errors = apiResult.message;
      state.messages = [];
      state.vesselcallbystatusview = [];
    }
  },
  [SET_KPIVIEW_DASHBOARD_RESULT](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.messages = apiResult.message;
      state.errors = [];
      state.kpiview = apiResult.data;
    } else {
      state.errors = apiResult.message;
      state.messages = [];
      state.kpiview = [];
    }
  },
  [SET_VOYAGEVIEW](state, apiResult) {
    state.apiResult = apiResult;
    if (apiResult.isSuccessful) {
      state.items = apiResult.data.items;
      state.totalItems = apiResult.data.totalItems;
      state.currentPage = apiResult.data.currentPage;
      state.errors = [];
    } else {
      state.totalItems = 0;
      state.errors = apiResult.message;
    }
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
