import ApiService from "@/core/services/api.service";

// action types
export const GETConceptList = "getconceptList";
export const GETConceptChart = "getconceptchart";
export const UPDATEConceptChart = "updateconceptchart";
export const ADDConceptChart = "addconceptchart";
export const AddAutoPlantoConcept = "addAutoPlantoConcept";
export const GETConceptUnplannedVessel = "getconceptunplannedvessel";
export const ADDConceptItemByStartPosition = "addconceptitembystartposition";
export const GetConceptItemByVoyageId = "getconceptitembyVoyageId";
export const Delete_Concept = "deleteconcept";
export const Delete_BatchConcept = "deletebatchconcept";
export const Delete_ConceptItem = "deleteconceptitem";
export const UPDATEConceptActive = "updateconceptactive";
export const AutoConceptPlan = "autoconceptplan";

export const Update_ConceptBerthSideByVoyageId = "updateconceptberthsidebyvoyageid";

// mutation types
export const SET_CONCEPTCHART = "setConceptChart";
export const SET_UPDATECONCEPTCHART = "setUpdateConceptChart";
export const SET_ADDCONCEPTCHART = "setAddConceptChart";
export const SET_AddAutoPlantoConcept = "setAddAutoPlantoConcept";
export const SET_CONCEPTUNPLANNEDVESSEL = "setConceptUnplannedVessel";
export const SET_ADDCONCEPTITEMBYSTARTPOSITION = "setADDConceptItemByStartPosition";
export const SET_GetConceptItemByVoyageId = "setgetconceptitembyVoyageId";
export const SET_Delete_Concept = "setdeleteConcept";
export const SET_Delete_BatchConcept = "setdeleteBatchConcept";
export const SET_Delete_ConceptItem = "setdeleteConceptItem";
export const SET_UPDATECONCEPTACTIVE = "setUpdateConceptActive";
export const SET_AutoConceptPlan = "setAutoConceptPlan";

export const SET_CONCEPTCHART_ERROR = "setConceptChartError";
export const SET_GETCONCEPTLIST = "setConceptList";
export const SET_Update_ConceptBerthSideByVoyageId = "setupdateconceptberthsidebyvoyageid";

const state = {
  result_conceptchart: null,
  result_setUpdateConceptChart: null,
  result_setAddConceptChart: null,
  result_setAddConceptChartId: 0,
  result_setAddAutoPlantoConcept: null, 
  result_setAddAutoPlantoConceptResultConceptNames: '',
    result_conceptunplannedvessel_TotalItems: 0,
  result_conceptunplannedvessel_Items: [],
  result_conceptunplannedvessel_CurrentPage: 1,
  result_addconceptitembystartposition: null,
  result_getconceptitembyVoyageId: null,
  result_getConceptList: null,
  result_setUpdateConceptActive: null,
  result_autoconceptplan: null,
  errors: [],
  messages: [],
};

const getters = {
  getConseptList(state) {
    return state.result_getConceptList;
  },

  getConceptChart(state) {
    return state.result_conceptchart;
  },
  getUpdateConceptChart(state) {
    return state.result_setUpdateConceptChart;
  },
  getAddConceptChart(state) {
    return state.result_setAddConceptChart;
  },
  getAddConceptResultId(state) {
    return state.result_setAddConceptChartId;
  },
  getAddAutoPlantoConcept(state) {
    return state.result_setAddAutoPlantoConcept;
  },
  getAddAutoPlantoConceptResultConceptNames(state) {
    return state.result_setAddAutoPlantoConceptResultConceptNames;
  },

  getConceptUnplannedVessel_TotalItems(state) {
    return state.result_conceptunplannedvessel_TotalItems;
  },
  getConceptUnplannedVessel_Items(state) {
    return state.result_conceptunplannedvessel_Items;
  },
  getConceptUnplannedVessel_CurrentPage(state) {
    return state.result_conceptunplannedvessel_CurrentPage;
  },
  getConceptItembyStartPosition(state) {
    return state.result_addconceptitembystartposition;
  },
  getconceptitembyVoyageId(state) {
    return state.result_getconceptitembyVoyageId;
  },
  getUpdateConceptActive(state) {
    return state.result_setUpdateConceptActive;
  },
  getAutoConceptPlan(state) {
    return state.result_autoconceptplan;
  },

  getConceptChartErrors() {
    return state.errors;
  },
  getConceptChartMessages(state) {
    return state.messages;
  },
};

const actions = {
  [GETConceptChart](context, state) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      var query = Object.keys(state)
        .map((key) => key + "=" + encodeURIComponent(state[key]))
        .join("&");
      ApiService.getData("/system/Concept/getconceptchart?" + query)
        .then(({ data }) => {
          context.commit(SET_CONCEPTCHART, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_CONCEPTCHART_ERROR, response.data.errors);
        });
    });
  },
  [UPDATEConceptChart](context, state) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      // const queryStr = `terminalId=${state.terminalId}&conceptId=${state.ConceptId}`;
      const queryStr = `terminalId=${state.terminalId}&conceptId=${state.ConceptId}`;
      ApiService.put("/system/Concept/updateconceptchart/?" + queryStr, state.model)
        .then(({ data }) => {
          context.commit(SET_UPDATECONCEPTCHART, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_CONCEPTCHART_ERROR, response.data.errors);
        });
    });
  },
  [UPDATEConceptActive](context, state) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      const queryStr = `conceptId=${state.ConceptId}&active=${state.Active}`;
      ApiService.put("/system/Concept/updateconceptactive?" + queryStr, state.model)
        .then(({ data }) => {
          context.commit(SET_UPDATECONCEPTACTIVE, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_CONCEPTCHART_ERROR, response.data.errors);
        });
    });
  },
  [ADDConceptChart](context, state) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      const queryStr = `terminalId=${state.terminalId}&conceptName=${state.ConceptName}&startDate=${state.StartDate}&endDate=${state.EndDate}&saveWithConceptItems=${state.saveWithConceptItems}`;
      ApiService.put("/system/Concept/addconceptchart?" + queryStr, state.model)
        .then(({ data }) => {
          context.commit(SET_ADDCONCEPTCHART, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_CONCEPTCHART_ERROR, response.data.errors);
        });
    });
  },


  [AddAutoPlantoConcept](context, state) {

    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.put("/system/Concept/addAutoPlantoConcept", state)
        .then(({ data }) => {
          context.commit(SET_AddAutoPlantoConcept, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_CONCEPTCHART_ERROR, response.data.errors);
        });
    });
  },



  [GETConceptUnplannedVessel](context, state) {
    let queryStr = `PageNumber =${state.pageNo}&PageSize=${state.rowPerPage}`;
    if (state.sorts)
      state.sorts.forEach((item) => {
        // queryStr += `&sorts[sortBy]=${item.sortBy}&sorts[direction]=${item.direction}`;
      });

    if (state.filters)
      state.filters.forEach((item) => {
        queryStr += `&filters[key]=${item.key}&filters[value]=${item.value}&filters[operatorType]=${item.operatorType}`;
      });

    queryStr += `&terminalId=${state.terminalId}&conceptId=${state.conceptId}`;
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/system/Concept/getconceptunplanvessels?" + queryStr)
        .then(({ data }) => {
          context.commit(SET_CONCEPTUNPLANNEDVESSEL, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_CONCEPTCHART_ERROR, response.data.errors);
        });
    });
  },
  [ADDConceptItemByStartPosition](context, state) {
    return new Promise((resolve) => {
      var query = Object.keys(state)
        .map((key) => key + "=" + encodeURIComponent(state[key]))
        .join("&");
      ApiService.setHeader();
      ApiService.post("/system/Concept/addconceptitembystartposition?" + query)
        .then(({ data }) => {
          context.commit(SET_ADDCONCEPTITEMBYSTARTPOSITION, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_CONCEPTCHART_ERROR, response.data.errors);
        });
    });
  },
  [GetConceptItemByVoyageId](context, state) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      var query = Object.keys(state)
        .map((key) => key + "=" + encodeURIComponent(state[key]))
        .join("&");
      ApiService.getData("/system/Concept/getconceptItemviewmodelbyvoyageid?" + query)
        .then(({ data }) => {
          context.commit(SET_GetConceptItemByVoyageId, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_CONCEPTCHART_ERROR, response.data.errors);
        });
    });
  },
  [Delete_Concept](context, state) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      const query = `Id=${state.ConceptId}&RowVersion=${encodeURIComponent(state.rowVersion)}`;
      ApiService.delete(`/system/Concept/deleteconcept?${query}`, )
        .then(({ data }) => {
          context.commit(SET_Delete_Concept, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_CONCEPTCHART_ERROR, response.data.errors);
        });
    });
  },
  [Delete_BatchConcept](context, state) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      const query = `BatchId=${state.BatchId}`;
      ApiService.delete("/system/Concept/deletebatchconcept?" + query)
        .then(({ data }) => {
          context.commit(SET_Delete_BatchConcept, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_CONCEPTCHART_ERROR, response.data.errors);
        });
    });
  },



  [Delete_ConceptItem](context, state) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      const query = `Id=${state.conceptItemId}&RowVersion=${encodeURIComponent(state.rowVersion)}`;
      ApiService.delete("/system/Concept/deleteconceptitem?" + query)
        .then(({ data }) => {
          context.commit(SET_Delete_ConceptItem, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_CONCEPTCHART_ERROR, response.data.errors);
        });
    });
  },
  [GETConceptList](context, state) {
    // let queryStr = `PageNo=${state.pageNo}&RowPerPage=${state.rowPerPage}&terminalId=${state.terminalId}`;

    
    let queryStr = {
      pageNumber: state.pageNo,
      pageSize: state.rowPerPage,
      terminalId: state.terminalId
    }

    // ANCHOR legacy code
    // & sort.sortby=${ state.sort }& sort.Direction=${ state.sortDirection }& terminalId=${ state.terminalId }`;
    // if (state.sorts)
    //   state.sorts.forEach((item) => {
    //     queryStr += `&sorts[sortBy]=${item.sortBy}&sorts[direction]=${item.direction}`;
    //   });
    // if (state.filters)
    //   state.filters.forEach((item) => {
    //     queryStr += `&filters[key]=${item.key}&filters[value]=${item.value}&filters[operatorType]=${item.operatorType}`;
    //   });

    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.post("/system/Concept/getlist" /* + "?" */, queryStr)
        .then(({ data }) => {
          //context.commit(SET_GETCONCEPTLIST, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_CONCEPTCHART_ERROR, response.data.errors);
        });
    });
  },


  [Update_ConceptBerthSideByVoyageId](context, state) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.post("/system/Concept/updateconceptberthsidebyvoyageid", state)
        .then(({ data }) => {
          context.commit(SET_Update_ConceptBerthSideByVoyageId, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_CONCEPTCHART_ERROR, response.data.errors);
        });
    });
  },

  [AutoConceptPlan](context, state) {
    return new Promise((resolve) => {
      var query = Object.keys(state)
        .map((key) => key + "=" + encodeURIComponent(state[key]))
        .join("&");
      ApiService.setHeader();
      ApiService.post("/definition/Concept/autoconceptplan?" + query)
        .then(({ data }) => {
          context.commit(SET_AutoConceptPlan, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_CONCEPTCHART_ERROR, response.data.errors);
        });
    });
  },
};

const mutations = {
  [SET_GETCONCEPTLIST](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_getConceptList = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_getConceptList = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_CONCEPTCHART](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_conceptchart = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_conceptchart = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_UPDATECONCEPTCHART](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_setUpdateConceptChart = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_setUpdateConceptChart = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_ADDCONCEPTCHART](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_setAddConceptChart = apiResult.data;
      state.result_setAddConceptChartId = apiResult.tag;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_setAddConceptChart = [];
      state.result_setAddConceptChartId = 0;
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_AddAutoPlantoConcept](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_setAddAutoPlantoConcept = apiResult.data;
      state.result_setAddAutoPlantoConceptResultConceptNames = apiResult.tag;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_setAddAutoPlantoConcept = [];
      state.result_setAddAutoPlantoConceptResultConceptNames = '';
      state.errors = apiResult.message;
      state.messages = [];
    }
  },





  





  [SET_CONCEPTUNPLANNEDVESSEL](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_conceptunplannedvessel_Items = apiResult.data.data;
      state.result_conceptunplannedvessel_TotalItems = apiResult.data.totalItems;
      state.result_conceptunplannedvessel_CurrentPage = apiResult.data.currentPage;

      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_conceptunplannedvessel_TotalItems = 0;
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_ADDCONCEPTITEMBYSTARTPOSITION](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_addconceptitembystartposition = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_addconceptitembystartposition = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_GetConceptItemByVoyageId](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_getconceptitembyVoyageId = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_getconceptitembyVoyageId = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },

  [SET_Delete_Concept](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_Delete_BatchConcept](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.errors = apiResult.message;
      state.messages = [];
    }
  },

  [SET_Delete_ConceptItem](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_UPDATECONCEPTACTIVE](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_setUpdateConceptActive = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_setUpdateConceptActive = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_Update_ConceptBerthSideByVoyageId](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_AutoConceptPlan](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_autoconceptplan = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_autoconceptplan = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_CONCEPTCHART_ERROR](state, error) {
    state.errors = error;
  },
};

export default { state, actions, mutations, getters };
