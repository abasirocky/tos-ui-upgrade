import ApiService from "@/core/services/api.service";
// action types
export const GETPORTLIST = "getPortlist";
export const GETPORTBYID = "getPort";
export const ADDPORTLIST = "addPort";
export const UPDATEPORTLIST = "updatePort";
export const DELETEPORTLIST = "deletePort";
export const GETALLCOUNTRYS = "getallcountrys";
export const GETALLPORT = "getAllPort";
// mutation typesrows
export const SET_PORTLIST = "setPortList";
export const SET_PORTERROR = "setPortError";
export const SET_PORTRESSULT = "setPortResult";
export const SET_ALLCOUNTRYS = "setAllCountrys";
const state = {
  errors: [],
  totalItems: 0,
  items: [],
  currentPage: 1,
  messages: [],
  countries: [],
};

const getters = {
  getPortRows(state) {
    return state.items;
  },
  getPortErrors() {
    return state.errors;
  },
  getPortMessages(state) {
    return state.messages;
  },
  getPortRowsCount() {
    return state.totalItems;
  },
};

const actions = {
  [GETALLPORT](context) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/definition/Port/getall")
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_PORTERROR, response.data.errors);
        });
    });
  },
  [GETPORTLIST](context, state) {
    let queryStr = `PageNo=${state.pageNo}&RowPerPage=${state.rowPerPage}`;
    // if (state.portName) {
    //   queryStr += `&portName=${state.portName}`;
    // }
    // if (state.unCode) {
    //   queryStr += `&unCode=${state.unCode}`;
    // }
    // if (state.countryId) {
    //   queryStr += `&countryId=${state.countryId}`;
    // }
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
      ApiService.getData("/definition/Port/getlist?" + queryStr)
        .then(({ data }) => {
          context.commit(SET_PORTLIST, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_PORTERROR, response.data.errors);
        });
    });
  },
  [GETPORTBYID](context, id) {
    const queryStr = `id=${id}`;

    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/definition/Port/getbyid?" + queryStr)
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_PORTERROR, response.data.errors);
        });
    });
  },

  [ADDPORTLIST](context, body) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.post("/definition/Port/add", body)
        .then(({ data }) => {
          context.commit(SET_PORTRESSULT, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_PORTERROR, response.data.errors);
        });
    });
  },
  [UPDATEPORTLIST](context, body) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.put("/definition/Port/update", body)
        .then(({ data }) => {
          context.commit(SET_PORTRESSULT, data);

          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_PORTERROR, response.data.errors);
        });
    });
  },
  [DELETEPORTLIST](context, body) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      const query = `Id=${body.id}&Name=${body.name}&UNCode=${body.unCode}&RowVersion=${body.rowVersion}`;
      ApiService.delete(`/definition/Port/delete?${query}`)
        .then(({ data }) => {
          context.commit(SET_PORTRESSULT, data);

          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_PORTERROR, response.data.errors);
        });
    });
  },
  [GETALLCOUNTRYS](context) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/definition/Country/getall")
        .then(({ data }) => {
          context.commit(SET_ALLCOUNTRYS, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_PORTERROR, response.data.errors);
        });
    });
  },
};

const mutations = {
  [SET_PORTERROR](state, error) {
    state.errors = error;
  },

  [SET_PORTRESSULT](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.messages = apiResult.message;
      state.errors = [];
    } else {
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_PORTLIST](state, apiResult) {
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
  [SET_ALLCOUNTRYS](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.countries = apiResult.data.items;
    } else {
      state.countries = [];
    }
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
