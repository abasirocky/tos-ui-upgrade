import ApiService from "@/core/services/api.service";

// action types
export const GETBerthInit = "getberthinit"; 
export const GETBerthChart = "getberthchart";
export const GETVoyageProperty = "getvoyageproperty";
export const GETUnplannedVessel = "getunplannedvessel";
export const ADDPlanByStartPosition = "addplanbystartposition";
export const UPDATEBerthChart = "updateberthchart";
export const GetChartPlanByVoyageId = "getchartplanbyVoyageId";
export const AutoVoyageBerthPlan = "autovoyageberthplan";
export const AutoBerthPlan = "autoberthplan";
export const ADDConceptAsCurrentPlan = "addconceptascurrentplan";

export const GETBerthChartLineWindow = "getberthchartlinewindow";
export const GETConcetList = "getConceptList";

export const GetBerthChartScheduleByVoyageId = "getberthchartschedulebyvoyageid";



// mutation types
export const SET_INIT = "setInit";
export const SET_BERTHCHART = "setBerthChart";
export const SET_VOYAGEPROPERTY = "setVoyagePropery";
export const SET_UNPLANNEDVESSEL = "setUnplannedVessel";
export const SET_ADDPLANBYSTARTPOSITION = "setADDPlanByStartPosition";
export const SET_UPDATEBERTHCHART = "setUpdateBerthChart";
export const SET_GetChartPlanByVoyageId = "setgetchartplanbyVoyageId";
export const SET_AutoVoyageBerthPlan = "setAutoVoyageBerthPlan";
export const SET_AutoBerthPlan = "setAutoBerthPlan";
export const SET_GETBerthChartLineWindow = "setGETBerthChartLineWindow";
export const SET_ADDConceptAsCurrentPlan = "setADDConceptAsCurrentPlan";
export const SET_GetBerthChartScheduleByVoyageId = "setgetberthchartschedulebyvoyageid";
export const SET_BERTHCHART_ERROR = "setBerthChartError";

const state = {
  terminalId: null,
  result_init: null,
  result_berthchart: null,
  result_voyagepropery: null,
  // result_unplannedvessel: null,
  result_unplannedvessel_TotalItems: 0,
  result_unplannedvessel_Items: [],
  result_unplannedvessel_CurrentPage: 1,

  result_addplanbystartposition: null,
  result_setUpdateBerthChart: null,
  result_getchartplanbyVoyageId: null,
  result_getberthchartschedulebyvoyageid:null,
  result_autovoyageberthplan: null,
  result_autoberthplan: null,
  result_GetBerthChartLineWindow: null,
  result_getConceptList: null,
  result_setADDConceptAsCurrentPlan: null,
  errors: [],
  messages: [],
};

const getters = {
  getBerthChartInit(state) {
    return state.result_init;
  },
  getBerthChart(state) {
    return state.result_berthchart;
  },
  getVoyagePropery(state) {
    return state.result_voyagepropery;
  },
  // getUnplannedVessel(state) {
  // return state.result_unplannedvessel;
  // },

  getUnplannedVessel_TotalItems(state) {
    return state.result_unplannedvessel_TotalItems;
  },
  getUnplannedVessel_Items(state) {
    return state.result_unplannedvessel_Items;
  },
  getUnplannedVessel_CurrentPage(state) {
    return state.result_unplannedvessel_CurrentPage;
  },

  getPlanbyStartPosition(state) {
    return state.result_addplanbystartposition;
  },
  getUpdateBerthChart(state) {
    return state.result_setUpdateBerthChart;
  },
  getADDConceptAsCurrentPlan(state) {
    return state.result_setADDConceptAsCurrentPlan;
  },
  getchartplanbyVoyageId(state) {
    return state.result_getchartplanbyVoyageId;
  },
  getberthchartschedulebyvoyageid(state) {
    return state.result_getberthchartschedulebyvoyageid;
  },

  



  getAutoVoyageBerthPlan(state) {
    return state.result_autovoyageberthplan;
  },
  getAutoBerthPlan(state) {
    return state.result_autoberthplan;
  },
  getBerthChartLineWindow(state) {
    return state.result_GetBerthChartLineWindow;
  },

  getBerthChartErrors() {
    return state.errors;
  },
  getBerthChartMessages(state) {
    return state.messages;
  },

};
const actions = {
  [GETBerthInit](context) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/system/BerthChart/getberthchartinit")
        .then(({ data }) => {
          context.commit(SET_INIT, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_BERTHCHART_ERROR, response.data.errors);
        });
    });
  },
  [GETBerthChart](context, state) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      console.log('findtermo', state.terminalId);
      var query = Object.keys(state)
        .map((key) => key + "=" + encodeURIComponent(state[key]))
        .join("&");
      ApiService.getData("system/BerthChart/getberthchart"  + "?" + query )
        .then(({ data }) => {
          context.commit(SET_BERTHCHART, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_BERTHCHART_ERROR, response.data.errors);
        });
    });
  },

  [GETBerthChartLineWindow](context, state) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      var query = Object.keys(state)
        .map((key) => key + "=" + encodeURIComponent(state[key]))
        .join("&");
      ApiService.getData(
        "/system/BerthChart/getberthchartlinewindow?" + query
      )
        .then(({ data }) => {
          context.commit(SET_GETBerthChartLineWindow, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_BERTHCHART_ERROR, response.data.errors);
        });
    });
  },

  [GETVoyageProperty](context, state) {
    // const queryStr = `VoyageBerthPlanid=${state.VoyageBerthPlanid}`;
    var query = Object.keys(state)
      .map((key) => key + "=" + encodeURIComponent(state[key]))
      .join("&");

    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/BerthChart/getvoyageproperty?" + query)
        .then(({ data }) => {
          context.commit(SET_VOYAGEPROPERTY, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_BERTHCHART_ERROR, response.data.errors);
        });
    });
  },
  [GETUnplannedVessel](context, state) {
    // const queryStr = `terminalId=${state.terminalId}`;
    let queryStr = `PageNumber=${state.pageNo}&PageSize=${state.rowPerPage}`;
    if (state.sorts)
      state.sorts.forEach((item) => {
        // queryStr += `&sorts[sortBy]=${item.sortBy}&sorts[direction]=${item.direction}`;
      });

    if (state.filters)
      state.filters.forEach((item) => {
        queryStr += `&AdvancedSearch.Keyword=${item.value }&AdvancedSearch.Fields[0]=${item.key}&AdvancedSearch[operatorType]=${item.operatorType}`;
      });

    queryStr += `&terminalId=${state.terminalId}`;
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("system/BerthChart/getunplanvessels?" + queryStr)
        .then(({ data }) => {
          context.commit(SET_UNPLANNEDVESSEL, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_BERTHCHART_ERROR, response.data.errors);
        });
    });
  },

  [ADDPlanByStartPosition](context, state) {
    return new Promise((resolve) => {
      var query = Object.keys(state)
        .map((key) => key + "=" + encodeURIComponent(state[key]))
        .join("&");
      ApiService.setHeader();
      ApiService.post(
        "system/BerthChart/addvoyageberthplanbystartposition?" + query
      )
        .then(({ data }) => {
          context.commit(SET_ADDPLANBYSTARTPOSITION, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_BERTHCHART_ERROR, response.data.errors);
        });
    });
  },
  [UPDATEBerthChart](context, state) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      const queryStr = `terminalId=${state.terminalId}`;
      ApiService.put(
        "system/BerthChart/saveberthchart" + "?" + queryStr,
        state.model
      )
        .then(({ data }) => {
          context.commit(SET_UPDATEBERTHCHART, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_BERTHCHART_ERROR, response.data.errors);
        });
    });
  },
  [ADDConceptAsCurrentPlan](context, state) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      const queryStr = `terminalId=${state.terminalId}&conceptId=${state.ConceptId}`;
      ApiService.put(
        "/BerthChart/saveconceptascurrentplan?" + queryStr,
        state.model
      )
        .then(({ data }) => {
          context.commit(SET_ADDConceptAsCurrentPlan, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_BERTHCHART_ERROR, response.data.errors);
        });
    });
  },
  [GetChartPlanByVoyageId](context, state) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      var query = Object.keys(state)
        .map((key) => key + "=" + encodeURIComponent(state[key]))
        .join("&");
      ApiService.getData(
        "/BerthChart/getvoyageberthplanviewmodelbyvoyageid?" + query
      )
        .then(({ data }) => {
          context.commit(SET_GetChartPlanByVoyageId, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_BERTHCHART_ERROR, response.data.errors);
        });
    });
  },

  [GetBerthChartScheduleByVoyageId](context, state) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      var query = Object.keys(state)
        .map((key) => key + "=" + encodeURIComponent(state[key]))
        .join("&");
      ApiService.getData(
        "system/BerthChart/getberthchartschedulebyvoyageid" + "?" + query
      )
        .then(({ data }) => {
          context.commit(SET_GetBerthChartScheduleByVoyageId, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_BERTHCHART_ERROR, response.data.errors);
        });
    });
  },




  [AutoVoyageBerthPlan](context, state) {
    return new Promise((resolve) => {
      var query = Object.keys(state)
        .map((key) => key + "=" + encodeURIComponent(state[key]))
        .join("&");
      ApiService.setHeader();
      ApiService.post("system/BerthChart/autovoyageberthplan?" + query)
        .then(({ data }) => {
          context.commit(SET_AutoVoyageBerthPlan, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_BERTHCHART_ERROR, response.data.errors);
        });
    });
  },
  [AutoBerthPlan](context, state) {
    return new Promise((resolve) => {
      var query = Object.keys(state)
        .map((key) => key + "=" + encodeURIComponent(state[key]))
        .join("&");
      ApiService.setHeader();
      ApiService.post("/BerthChart/autoberthplan?" + query)
        .then(({ data }) => {
          context.commit(SET_AutoBerthPlan, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_BERTHCHART_ERROR, response.data.errors);
        });
    });
  },




 
};

const mutations = {
 
  [SET_INIT](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_init = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_init = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_BERTHCHART](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_berthchart = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_berthchart = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },

  [SET_GETBerthChartLineWindow](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_GetBerthChartLineWindow = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_GetBerthChartLineWindow = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },

  [SET_VOYAGEPROPERTY](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_voyagepropery = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_voyagepropery = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_UNPLANNEDVESSEL](state, apiResult) {
    if (apiResult.isSuccessful) {
      // state.result_unplannedvessel = apiResult.data;

      state.result_unplannedvessel_Items = apiResult.data.data;
      state.result_unplannedvessel_TotalItems = apiResult.data.totalCount;
      state.result_unplannedvessel_CurrentPage = apiResult.data.currentPage;

      state.errors = [];
      state.messages = apiResult.message;
    } else {
      // state.result_unplannedvessel = [];
      state.result_unplannedvessel_TotalItems = 0;
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_ADDPLANBYSTARTPOSITION](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_addplanbystartposition = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_addplanbystartposition = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_UPDATEBERTHCHART](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_setUpdateBerthChart = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_setUpdateBerthChart = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_ADDConceptAsCurrentPlan](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_setADDConceptAsCurrentPlan = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_setADDConceptAsCurrentPlan = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_GetChartPlanByVoyageId](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_getchartplanbyVoyageId = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_getchartplanbyVoyageId = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },

  [SET_GetBerthChartScheduleByVoyageId](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_getberthchartschedulebyvoyageid = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_getberthchartschedulebyvoyageid = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },




  [SET_AutoVoyageBerthPlan](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_autovoyageberthplan = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_autovoyageberthplan = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_AutoBerthPlan](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_autoberthplan = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_autoberthplan = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },



  [SET_BERTHCHART_ERROR](state, error) {
    state.errors = error;
  },
};

export default { state, actions, mutations, getters };
