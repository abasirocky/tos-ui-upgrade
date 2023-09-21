import ApiService from "@/core/services/api.service";

// action types
export const GETLINEWINDOWLIST = "getLineWindowList";
export const GETLINEWINDOWBYID = "getLineWindow";
export const ADDLINEWINDOWLIST = "addLineWindow";
export const UPDATELINEWINDOWLIST = "updateLineWindow";
export const DELETELINEWINDOWLIST = "deleteLineWindow";
export const GETWEEKDAYLIST = "getweekday";
export const GETLINEWINDOWBOLLARDLIST = "getlinewindowbollards";
// mutation typesrows
export const SET_LINEWINDOWLIST = "setLineWindowList";
export const SET_LINEWINDOWERROR = "setLineWindowError";
export const SET_LINEWINDOWRESSULT = "setLineWindowResult";
 
const state = {
  errors: [],
  totalItems: 0,
  items: [],
  currentPage: 1,
  messages: []
};

const getters = {
  getLineWindowRows(state) {
    return state.items;
  },
  getLineWindowErrors() {
    return state.errors;
  },
  getLineWindowMessages(state) {
    return state.messages;
  },
  getLineWindowRowsCount() {
    return state.totalItems;
  }
};

const actions = {
  [GETLINEWINDOWLIST](context, state) {
    let queryStr = `PageNo=${state.pageNo}&RowPerPage=${state.rowPerPage}&terminalId=${state.terminalId}`;
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
      ApiService.getData("/definition/LineWindow/getlist?" + queryStr)
        .then(({ data }) => {
          context.commit(SET_LINEWINDOWLIST, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_LINEWINDOWERROR, response.data.errors);
        });
    });
  },
  [GETLINEWINDOWBYID](context, id) {
    const queryStr = `id=${id}`;

    return new Promise(resolve => {
      ApiService.setHeader();
      ApiService.getData("/definition/LineWindow/getbyid?" + queryStr)
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_LINEWINDOWERROR, response.data.errors);
        });
    });
  },

  [ADDLINEWINDOWLIST](context, body) {
    return new Promise(resolve => {
      ApiService.setHeader();
      ApiService.post("/definition/LineWindow/add", body)
        .then(({ data }) => {
          context.commit(SET_LINEWINDOWRESSULT, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_LINEWINDOWERROR, response.data.errors);
        });
    });
  }, 
  [UPDATELINEWINDOWLIST](context, body) {
    return new Promise(resolve => {
      ApiService.setHeader();
      ApiService.put("/definition/LineWindow/update", body)
        .then(({ data }) => {
          context.commit(SET_LINEWINDOWRESSULT, data);

          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_LINEWINDOWERROR, response.data.errors);
        });
    });
  },
  [DELETELINEWINDOWLIST](context, body) {
    return new Promise(resolve => {
      ApiService.setHeader();
      //const query = `Id=${body.id}&Name=${body.name}&UNCode=${body.unCode}&RowVersion=${body.rowVersion}`;
     
      const query = Object.keys(body)
      .map(key => key + "=" + encodeURIComponent(body[key]))
      .join("&");
     
     
     
     
      ApiService.delete(`/definition/LineWindow/delete?${query}`)
        .then(({ data }) => {
          context.commit(SET_LINEWINDOWRESSULT, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_LINEWINDOWERROR, response.data.errors);
        });
    });
  },

  [GETWEEKDAYLIST](context) {
    return new Promise(resolve => {
      ApiService.setHeader();
      ApiService.getData("/definition/LineWindow/getweekdaysselectlist?")
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_LINEWINDOWERROR, response.data.errors);
        });
    });
  },
  [GETLINEWINDOWBOLLARDLIST](context, terminalId) {
    const queryStr = `terminalId=${terminalId}`;

    return new Promise(resolve => {
      ApiService.setHeader();
      ApiService.getData(
        "/definition/NoneWorkingZone/getbollardbyterminalId?" + queryStr
      )
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_LINEWINDOWERROR, response.data.errors);
        });
    });
  }
};

const mutations = {
  [SET_LINEWINDOWERROR](state, error) {
    state.errors = error;
  },
  [SET_LINEWINDOWRESSULT](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.messages = apiResult.message;
      state.errors = [];
    } else {
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_LINEWINDOWLIST](state, apiResult) {
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
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
