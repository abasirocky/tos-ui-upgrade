import ApiService from "@/core/services/api.service";

// action types
export const GETCOUNTRYLIST = "getCountryList";
export const GETCOUNTRYBYID = "getCountry";
export const ADDCOUNTRYLIST = "addCountry";
export const UPDATECOUNTRYLIST = "updateCountry";
export const DELETECOUNTRYLIST = "deleteCountry";
// mutation typesrows
export const SET_COUNTRYLIST = "setCountryList";
export const SET_COUNTRYERROR = "setCountryError";
export const SET_COUNTRYRESSULT = "setCountryResult";

const state = {
  errors: [],
  totalItems: 0,
  items: [],
  currentPage: 1,
  messages: []
};

const getters = {
  getCountryRows(state) {
    return state.items;
  },
  getCountryErrors() {
    return state.errors;
  },
  getCountryMessages(state) {
    return state.messages;
  },
  getCountryRowsCount() {
    return state.totalItems;
  }
};

const actions = {
  [GETCOUNTRYLIST](context, state) {
    let queryStr = `PageNo=${state.pageNo}&RowPerPage=${state.rowPerPage}`;
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
      ApiService.getData("/definition/Country/getlist?" + queryStr)
        .then(({ data }) => {
          context.commit(SET_COUNTRYLIST, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_COUNTRYERROR, response.data.errors);
        });
    });
  },
  [GETCOUNTRYBYID](context, id) {
    const queryStr = `id=${id}`;

    return new Promise(resolve => {
      ApiService.setHeader();
      ApiService.getData("/definition/Country/getbyid?" + queryStr)
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_COUNTRYERROR, response.data.errors);
        });
    });
  },

  [ADDCOUNTRYLIST](context, body) {
    return new Promise(resolve => {
      ApiService.setHeader();
      ApiService.post("/definition/Country/add", body)
        .then(({ data }) => {
          context.commit(SET_COUNTRYRESSULT, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_COUNTRYERROR, response.data.errors);
        });
    });
  },
  [UPDATECOUNTRYLIST](context, body) {
    return new Promise(resolve => {
      ApiService.setHeader();
      ApiService.put("/definition/Country/update", body)
        .then(({ data }) => {
          context.commit(SET_COUNTRYRESSULT, data);

          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_COUNTRYERROR, response.data.errors);
        });
    });
  },
  [DELETECOUNTRYLIST](context, body) {
    return new Promise(resolve => {
      ApiService.setHeader();
      const query = `Id=${body.id}&Name=${body.name}&UNCode=${body.unCode}&RowVersion=${body.rowVersion}`;
      ApiService.delete(`/definition/Country/delete?${query}`)
        .then(({ data }) => {
          context.commit(SET_COUNTRYRESSULT, data);

          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_COUNTRYERROR, response.data.errors);
        });
    });
  }
};

const mutations = {
  [SET_COUNTRYERROR](state, error) {
    state.errors = error;
  },
  [SET_COUNTRYRESSULT](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.messages = apiResult.message;
      state.errors = [];
    } else {
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_COUNTRYLIST](state, apiResult) {
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
