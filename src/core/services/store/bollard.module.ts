import ApiService from "@/core/services/api.service";

// action types
export const GETBOLLARDLIST = "getBollardList";
export const GETBOLLARDBYID = "getBollard";
export const ADDBOLLARDLIST = "addBollard";
export const UPDATEBOLLARDLIST = "updateBollard";
export const DELETEBOLLARDLIST = "deleteBollard";
// mutation typesrows
export const SET_BOLLARDLIST = "setBollardList";
export const SET_BOLLARDERROR = "setBollardError";
export const SET_BOLLARDRESSULT = "setBollardResult";

const state = {
  errors: [],
  totalItems: 0,
  items: [],
  currentPage: 1,
  messages: []
};

const getters = {
  getBollardRows(state) {
    return state.items;
  },
  getBollardErrors() {
    return state.errors;
  },
  getBollardMessages(state) {
    return state.messages;
  },
  getBollardRowsCount() {
    return state.totalItems;
  }
};

const actions = {
  [GETBOLLARDLIST](context, state) {
    let queryStr = `PageNo=${state.pageNo}&RowPerPage=${state.rowPerPage}&berthId=${state.berthId}`;
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
      ApiService.getData("/definition/Bollard/getlist?" + queryStr)
        .then(({ data }) => {
          context.commit(SET_BOLLARDLIST, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_BOLLARDERROR, response.data.errors);
        });
    });
  },
  [GETBOLLARDBYID](context, id) {
    const queryStr = `id=${id}`;

    return new Promise(resolve => {
      ApiService.setHeader();
      ApiService.getData("/definition/Bollard/getbyid?" + queryStr)
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_BOLLARDERROR, response.data.errors);
        });
    });
  },

  [ADDBOLLARDLIST](context, body) {
    return new Promise(resolve => {
      ApiService.setHeader();
      ApiService.post("/definition/Bollard/add", body)
        .then(({ data }) => {
          context.commit(SET_BOLLARDRESSULT, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_BOLLARDERROR, response.data.errors);
        });
    });
  },
  [UPDATEBOLLARDLIST](context, body) {
    return new Promise(resolve => {
      ApiService.setHeader();
      ApiService.put("/definition/Bollard/update", body)
        .then(({ data }) => {
          context.commit(SET_BOLLARDRESSULT, data);

          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_BOLLARDERROR, response.data.errors);
        });
    });
  },
  [DELETEBOLLARDLIST](context, body) {
    return new Promise(resolve => {
      ApiService.setHeader();
      const query = `Id=${body.id}&Name=${body.name}&UNCode=${body.unCode}&RowVersion=${body.rowVersion}`;
      ApiService.delete(`/definition/Bollard/delete?${query}`)
        .then(({ data }) => {
          context.commit(SET_BOLLARDRESSULT, data);

          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_BOLLARDERROR, response.data.errors);
        });
    });
  }
};

const mutations = {
  [SET_BOLLARDERROR](state, error) {
    state.errors = error;
  },
  [SET_BOLLARDRESSULT](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.messages = apiResult.message;
      state.errors = [];
    } else {
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_BOLLARDLIST](state, apiResult) {
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
