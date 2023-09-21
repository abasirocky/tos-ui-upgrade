import ApiService from "@/core/services/api.service";

// action types
export const GETNONEWORKINGLIST = "getNoneWorkingList";
export const GETNONEWORKINGBYID = "getNoneWorking";
export const ADDNONEWORKINGLIST = "addNoneWorking";
export const UPDATENONEWORKINGLIST = "updateNoneWorking";
export const DELETENONEWORKINGLIST = "deleteNoneWorking";
export const GETBOLLARDLIST = "getbollards";
export const GETREASONLIST = "getreasonlist";
// mutation typesrows
export const SET_NONEWORKINGLIST = "setNoneWorkingList";
export const SET_NONEWORKINGERROR = "setNoneWorkingError";
export const SET_NONEWORKINGRESSULT = "setNoneWorkingResult";
export const SET_REASONLIST = "setReasonList";

const state = {
  errors: [],
  totalItems: 0,
  items: [],
  currentPage: 1,
  messages: [],
};

const getters = {
  getNoneWorkingRows(state) {
    return state.items;
  },
  getNoneWorkingErrors() {
    return state.errors;
  },
  getNoneWorkingMessages(state) {
    return state.messages;
  },
  getNoneWorkingRowsCount() {
    return state.totalItems;
  },
};

const actions = {
  [GETNONEWORKINGLIST](context, state) {
    let queryStr = `PageNo=${state.pageNo}&RowPerPage=${state.rowPerPage}&terminalId=${state.terminalId}`;
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
      ApiService.getData("/definition/NoneWorkingZone/getlist?" + queryStr)
        .then(({ data }) => {
          context.commit(SET_NONEWORKINGLIST, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_NONEWORKINGERROR, response.data.errors);
        });
    });
  },
  [GETNONEWORKINGBYID](context, id) {
    const queryStr = `id=${id}`;

    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/definition/NoneWorkingZone/getbyid?" + queryStr)
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_NONEWORKINGERROR, response.data.errors);
        });
    });
  },

  [ADDNONEWORKINGLIST](context, body) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.post("/definition/NoneWorkingZone/add", body)
        .then(({ data }) => {
          context.commit(SET_NONEWORKINGRESSULT, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_NONEWORKINGERROR, response.data.errors);
        });
    });
  },
  [UPDATENONEWORKINGLIST](context, body) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.put("/definition/NoneWorkingZone/update", body)
        .then(({ data }) => {
          context.commit(SET_NONEWORKINGRESSULT, data);

          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_NONEWORKINGERROR, response.data.errors);
        });
    });
  },
  [DELETENONEWORKINGLIST](context, body) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      const query = `Id=${body.id}&Name=${body.name}&UNCode=${body.unCode}&RowVersion=${body.rowVersion}`;
      ApiService.delete(`/definition/NoneWorkingZone/delete?${query}`)
        .then(({ data }) => {
          context.commit(SET_NONEWORKINGRESSULT, data);

          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_NONEWORKINGERROR, response.data.errors);
        });
    });
  },
  [GETBOLLARDLIST](context, terminalId) {
    const queryStr = `terminalId=${terminalId}`;

    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData(
        "/definition/NoneWorkingZone/getbollardbyterminalId?" + queryStr
      )
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_NONEWORKINGERROR, response.data.errors);
        });
    });
  },
  [GETREASONLIST](context) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/definition/NoneWorkingZone/getreasonselectlist?")
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_NONEWORKINGERROR, response.data.errors);
        });
    });
  },
};

const mutations = {
  [SET_NONEWORKINGERROR](state, error) {
    state.errors = error;
  },
  [SET_NONEWORKINGRESSULT](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.messages = apiResult.message;
      state.errors = [];
    } else {
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_NONEWORKINGLIST](state, apiResult) {
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
