import ApiService from "@/core/services/api.service";

// action types
export const GETBERTHLIST = "getBerthList";
export const GETBERTHBYID = "getBerth";
export const ADDBERTHLIST = "addBerth";
export const UPDATEBERTHLIST = "updateBerth";
export const DELETEBERTHLIST = "deleteBerth";
export const GETQUAYWALLLIST = "getQuayWallList";
// mutation typesrows
export const SET_BERTHLIST = "setBerthList";
export const SET_BERTHERROR = "setBerthError";
export const SET_BERTHRESSULT = "setBerthResult";


interface IState {
  errors: any[]
  totalItems: number
  items: any[]
  currentPage: number,
  messages: any[]
  isPageRefreshing: boolean
  isLoading: boolean
}

const state: IState = {
  errors: [],
  totalItems: 0,
  items: [],
  currentPage: 1,
  messages: [],
  isPageRefreshing: false,
  isLoading:false
};

const getters = {
  getBerthRows(state) {
    return state.items;
  },
  getBerthErrors() {
    return state.errors;
  },
  getBerthMessages(state) {
    return state.messages;
  },
  getBerthRowsCount() {
    return state.totalItems;
  },
};

const actions = {
  [GETBERTHLIST](context, state) {
    let queryStr = `PageNo=${state.pageNo}&RowPerPage=${state.rowPerPage}&terminalId=${state.terminalId}`;
    // & sort.sortby=${ state.sort }& sort.Direction=${ state.sortDirection }& terminalId=${ state.terminalId }`;
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
      ApiService.getData("/definition/Berth/getlist?" + queryStr)
        .then(({ data }) => {
          context.commit(SET_BERTHLIST, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_BERTHERROR, response.data.errors);
        });
    });
  },
  [GETBERTHBYID](context, id) {
    const queryStr = `id=${id}`;

    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/definition/Berth/getbyid?" + queryStr)
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_BERTHERROR, response.data.errors);
        });
    });
  },
  [ADDBERTHLIST](context, body) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.post("/definition/Berth/add", body)
        .then(({ data }) => {
          context.commit(SET_BERTHRESSULT, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_BERTHERROR, response.data.errors);
        });
    });
  },
  [UPDATEBERTHLIST](context, body) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.put("/definition/Berth/update", body)
        .then(({ data }) => {
          context.commit(SET_BERTHRESSULT, data);

          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_BERTHERROR, response.data.errors);
        });
    });
  },
  [DELETEBERTHLIST](context, body) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      const query = `Id=${body.id}&Name=${body.name}&UNCode=${body.unCode}&RowVersion=${body.rowVersion}`;
      ApiService.delete(`/definition/Berth/delete?${query}`)
        .then(({ data }) => {
          context.commit(SET_BERTHRESSULT, data);

          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_BERTHERROR, response.data.errors);
        });
    });
  },
  [GETQUAYWALLLIST](context) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/definition/Berth/getquaywallselectlist")
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_BERTHERROR, response.data.errors);
        });
    });
  },
};

const mutations = {
  [SET_BERTHERROR](state, error) {
    state.errors = error;
  },
  [SET_BERTHRESSULT](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.messages = apiResult.message;
      state.errors = [];
    } else {
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_BERTHLIST](state, apiResult) {
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
