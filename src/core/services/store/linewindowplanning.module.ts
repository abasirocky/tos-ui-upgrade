import ApiService from "@/core/services/api.service";

// action types
export const GETLineWindowInit = "getlinewindowinit";
export const GETLineWindowChart = "getlinewindowchart";
export const GETUnplannedLines = "getunplannedlines";
export const ADDLineWindowPlanByStartPosition = "addlinewindowplanbystartposition";
export const UPDATELineWindowChart = "updatelinewindowchart";


// mutation types
export const SET_INIT = "setInit";
export const SET_LINEWINDOWCHART = "setLineWindowChart";
export const SET_UNPLANNEDLINE = "setUnplannedLine";
export const SET_ADDLINEWINDOWPLANBYSTARTPOSITION = "setADDLineWindowPlanByStartPosition";
export const SET_UPDATELINEWINDOWCHART = "setUpdateLineWindowChart";


export const SET_LINEWINDOWCHART_ERROR = "setLineWindowChartError";


const state = {
  result_init: null,
  result_linewindowchart: null,

  result_unplannedline_TotalItems: 0,
  result_unplannedline_Items: [],
  result_unplannedline_CurrentPage: 1,

  result_addlinewindowplanbystartposition: null,
  result_setUpdateLineWindowChart: null,
  
  errors: [],
  messages: [],

};

const getters = {
  getLineWindowChartInit(state) {
    return state.result_init;
  },
  getLineWindowChart(state) {
    return state.result_linewindowchart;
  },


  getUnplannedLine_TotalItems(state) {
    return state.result_unplannedline_TotalItems;
  },
  getUnplannedLine_Items(state) {
    return state.result_unplannedline_Items;
  },
  getUnplannedLine_CurrentPage(state) {
    return state.result_unplannedline_CurrentPage;
  },


  getLineWindowPlanbyStartPosition(state) {
    return state.result_addlinewindowplanbystartposition;
  },
  getUpdateLineWindowChart(state) {
    return state.result_setUpdateLineWindowChart;
  },
 
  getLineWindowChartErrors() {
    return state.errors;
  },
  getLineWindowChartMessages(state) {
    return state.messages;
  },

};
const actions = {
  [GETLineWindowInit](context) {
    return new Promise(resolve => {
      ApiService.setHeader();
      ApiService.getData("/definition/LineWindowChart/getlinewindowchartinit")
        .then(({ data }) => {
          context.commit(SET_INIT, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_LINEWINDOWCHART_ERROR, response.data.errors);
        });
    });
  },
  [GETLineWindowChart](context, state) {
    return new Promise(resolve => {
      ApiService.setHeader();
      var query = Object.keys(state)
        .map(key => key + "=" + encodeURIComponent(state[key]))
        .join("&");
      ApiService.getData("/definition/LineWindowChart/getlinewindowchart?" + query)
        .then(({ data }) => {
          context.commit(SET_LINEWINDOWCHART, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_LINEWINDOWCHART_ERROR, response.data.errors);
        });
    });
  },
  [GETUnplannedLines](context, state) {
    let queryStr = `pageNo=${state.pageNo}&rowPerPage=${state.rowPerPage}`;
    if (state.sorts)
      state.sorts.forEach((item) => {
        queryStr += `&sorts[sortBy]=${item.sortBy}&sorts[direction]=${item.direction}`;
      });
    if (state.filters)
      state.filters.forEach((item) => {
        queryStr += `&filters[key]=${item.key}&filters[value]=${item.value}&filters[operatorType]=${item.operatorType}`;
      });

    return new Promise(resolve => {
      ApiService.setHeader();
      ApiService.getData("/definition/LineWindowChart/getunplanlines?" + queryStr)
        .then(({ data }) => {
          context.commit(SET_UNPLANNEDLINE, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_LINEWINDOWCHART_ERROR, response.data.errors);
        });
    });
  },

  [ADDLineWindowPlanByStartPosition](context, state) {
    return new Promise(resolve => {
      var query = Object.keys(state)
        .map(key => key + "=" + encodeURIComponent(state[key]))
        .join("&");
      ApiService.setHeader();
      ApiService.post("/definition/LineWindowChart/addlinewindowplanbystartposition?" + query)
        .then(({ data }) => {
          context.commit(SET_ADDLINEWINDOWPLANBYSTARTPOSITION, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_LINEWINDOWCHART_ERROR, response.data.errors);
        });
    });
  },
  [UPDATELineWindowChart](context, state) {
    return new Promise(resolve => {
      ApiService.setHeader();
      const queryStr = `terminalId=${state.terminalId}`;
      ApiService.put("/definition/LineWindowChart/savelinewindowchart?" + queryStr, state.model)
        .then(({ data }) => {
          context.commit(SET_UPDATELINEWINDOWCHART, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_LINEWINDOWCHART_ERROR, response.data.errors);
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
  [SET_LINEWINDOWCHART](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_linewindowchart = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_linewindowchart = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
   [SET_UNPLANNEDLINE](state, apiResult) {
    //state.apiResult = apiResult;
    if (apiResult.isSuccessful) {
      state.result_unplannedline_Items = apiResult.data.items;
      state.result_unplannedline_TotalItems = apiResult.data.totalItems;
      state.result_unplannedline_CurrentPage = apiResult.data.currentPage;
      state.messages = apiResult.message;
      state.errors = [];
    } else {
      state.result_unplannedline_TotalItems = 0;
      state.errors = apiResult.message;
      state.messages = [];
    }
  },

  [SET_ADDLINEWINDOWPLANBYSTARTPOSITION](state, apiResult) {

    if (apiResult.isSuccessful) {
      state.result_addlinewindowplanbystartposition = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_addlinewindowplanbystartposition = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_UPDATELINEWINDOWCHART](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_setUpdateLineWindowChart = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_setUpdateLineWindowChart = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
    [SET_LINEWINDOWCHART_ERROR](state, error) {
    state.errors = error;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
