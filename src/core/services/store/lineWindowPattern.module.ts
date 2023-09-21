import ApiService from "@/core/services/api.service";
 
// action types
export const GET_LineWindowPattern_OrdinalType = "getLineWindowPattern_OrdinalType";
export const GET_LineWindowPattern_SpecificType = "getLineWindowPattern_SpecificType";
export const GET_LineWindowPattern_Month = "getLineWindowPattern_Month";
export const GET_LineWindowPattern_ByLineWindowId = "getLineWindowPattern_ByLineWindowId";
export const Update_LineWindowPattern_Save = "Update_LineWindowPattern_Save";
export const Delete_LineWindowPattern_Pattern = "deleteLineWindowPattern_Pattern";
export const Delete_LineWindowPattern_All = "deleteLineWindowPattern_All";

// mutation types
export const SET_LineWindowPattern_OrdinalType = "setLineWindowPattern_OrdinalType";
export const SET_LineWindowPattern_SpecificType = "setLineWindowPattern_SpecificType";
export const SET_LineWindowPattern_Month = "setLineWindowPattern_Month";
export const SET_LineWindowPattern_ByLineWindowId = "setLineWindowPattern_ByLineWindowId";
export const SET_Update_LineWindowPattern_Save = "SET_Update_LineWindowPattern_Save";


export const SET_Delete_LineWindowPattern_Pattern = "setdeleteLineWindowPattern_Pattern";
export const SET_Delete_LineWindowPattern_All = "setdeleteLineWindowPattern_All";


export const SET_LINEWINDOWPATTERN_ERROR = "setLineWindowPatternError";

const state = {
  result_getLineWindowPattern_OrdinalType:null,
  result_getLineWindowPattern_SpecificType:null,
  result_getLineWindowPattern_Month:null,
  result_getLineWindowPattern_ByLineWindowId:null,

  errors: [],
  messages: [],
};

const getters = {
  getLineWindowPattern_OrdinalType(state) {
    return state.result_getLineWindowPattern_OrdinalType;
  },
  getLineWindowPattern_SpecificType(state) {
    return state.result_getLineWindowPattern_SpecificType;
  },
  getLineWindowPattern_Month(state) {
    return state.result_getLineWindowPattern_Month;
  },
  getLineWindowPattern_ByLineWindowId(state) {
    return state.result_getLineWindowPattern_ByLineWindowId;
  },
  getLineWindowPatternMessages(state) {
    return state.messages;
  },
  getLineWindowPatternErrors() {
    return state.errors;
  },
};

const actions = {
  [GET_LineWindowPattern_OrdinalType](context) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/definition/LineWindowRecurrencePattern/getordinaltypeselectlist" )
        .then(({ data }) => {
          context.commit(SET_LineWindowPattern_OrdinalType, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_LINEWINDOWPATTERN_ERROR, response.data.errors);
        });
    });
  },
  [GET_LineWindowPattern_SpecificType](context) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/definition/LineWindowRecurrencePattern/getspecifictypeselectlist" )
        .then(({ data }) => {
          context.commit(SET_LineWindowPattern_SpecificType, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_LINEWINDOWPATTERN_ERROR, response.data.errors);
        });
    });
  },
  [GET_LineWindowPattern_Month](context) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/definition/LineWindowRecurrencePattern/getmonthselectlist" )
        .then(({ data }) => {
          context.commit(SET_LineWindowPattern_Month, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_LINEWINDOWPATTERN_ERROR, response.data.errors);
        });
    });
  },
  [GET_LineWindowPattern_ByLineWindowId](context,state) {
    return new Promise((resolve) => {
      ApiService.setHeader();

      const query = `lineWindowId=${state.lineWindowId}`;
      ApiService.getData("/definition/LineWindowRecurrencePattern/getbylinewindowid?" + query )
        .then(({ data }) => {
          context.commit(SET_LineWindowPattern_ByLineWindowId, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_LINEWINDOWPATTERN_ERROR, response.data.errors);
        });
    });
  },
  [Update_LineWindowPattern_Save](context, body) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.post("/definition/LineWindowRecurrencePattern/save", body)
        .then(({ data }) => {
          context.commit(SET_Update_LineWindowPattern_Save, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_LINEWINDOWPATTERN_ERROR, response.data.errors);
        });
    });
  },

  [Delete_LineWindowPattern_Pattern](context, state) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      const query = `lineWindowId=${state.lineWindowId}&rowVersion=${encodeURIComponent(state.rowVersion)}`;

      ApiService.delete("/definition/LineWindowRecurrencePattern/deletepattern?" + query)
        .then(({ data }) => {
          context.commit(SET_Delete_LineWindowPattern_Pattern, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_LINEWINDOWPATTERN_ERROR, response.data.errors);
        });
    });
  },
  [Delete_LineWindowPattern_All](context, state) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      const query = `lineWindowId=${state.lineWindowId}&rowVersion=${encodeURIComponent(state.rowVersion)}`;
      ApiService.delete("/definition/LineWindowRecurrencePattern/delete?" + query)
        .then(({ data }) => {
          context.commit(SET_Delete_LineWindowPattern_All, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_LINEWINDOWPATTERN_ERROR, response.data.errors);
        });
    });
  },



};

const mutations = {
  [SET_LineWindowPattern_OrdinalType](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_getLineWindowPattern_OrdinalType = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_getLineWindowPattern_OrdinalType = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_LineWindowPattern_SpecificType](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_getLineWindowPattern_SpecificType = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_getLineWindowPattern_SpecificType = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_LineWindowPattern_Month](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_getLineWindowPattern_Month = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_getLineWindowPattern_Month = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_LineWindowPattern_ByLineWindowId](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_getLineWindowPattern_ByLineWindowId = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_getLineWindowPattern_ByLineWindowId = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_Update_LineWindowPattern_Save](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.errors = apiResult.message;
      state.messages = [];
    }
  },

  [SET_Delete_LineWindowPattern_Pattern](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.errors = apiResult.message;
      state.messages = [];
    }
  },

  [SET_Delete_LineWindowPattern_All](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.errors = apiResult.message;
      state.messages = [];
    }
  },



  [SET_LINEWINDOWPATTERN_ERROR](state, error) {
    state.errors = error;
  },
};



export default {
  state,
  actions,
  mutations,
  getters,
};