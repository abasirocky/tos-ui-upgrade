import ApiService from "@/core/services/api.service";

// action types
export const GETCOMPANYLIST = "getCompanyList";
export const GETCOMPANYBYID = "getCompany";
export const ADDCOMPANYLIST = "addCompany";
export const UPDATECOMPANYLIST = "updateCompany";
export const DELETECOMPANYLIST = "deleteCompany";
export const GETALLLINES = "getAllLines";
export const GETCOMPANYIMAGE = "getCompanyImage";
// mutation typesrows
export const SET_COMPANYLIST = "setCompanyList";
export const SET_COMPANYERROR = "setCompanyError";
export const SET_COMPANYRESSULT = "setCompanyResult";

const state = {
  errors: [],
  totalItems: 0,
  items: [],
  currentPage: 1,
  messages: [],
};

const getters = {
  getCompanyRows(state) {
    return state.items;
  },
  getCompanyErrors() {
    return state.errors;
  },
  getCompanyMessages(state) {
    return state.messages;
  },
  getCompanyRowsCount() {
    return state.totalItems;
  },
};

const actions = {
  [GETCOMPANYLIST](context, state) {
    let queryStr = `PageNo=${state.pageNo}&RowPerPage=${state.rowPerPage}`;
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
      ApiService.getData("/definition/Company/getlist?" + queryStr)
        .then(({ data }) => {
          context.commit(SET_COMPANYLIST, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_COMPANYERROR, response.data.errors);
        });
    });
  },
  [GETCOMPANYBYID](context, id) {
    const queryStr = `id=${id}`;

    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/definition/Company/getbyid?" + queryStr)
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_COMPANYERROR, response.data.errors);
        });
    });
  },
  [GETCOMPANYIMAGE](context, id) {
    const queryStr = `id=${id}`;

    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/definition/Company/getcompanyimageurl?" + queryStr)
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_COMPANYERROR, response.data.errors);
        });
    });
  },
  [ADDCOMPANYLIST](context, body) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.post("/definition/Company/add", body)
        .then(({ data }) => {
          context.commit(SET_COMPANYRESSULT, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_COMPANYERROR, response.data.errors);
        });
    });
  },
  [UPDATECOMPANYLIST](context, body) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.put("/definition/Company/update", body)
        .then(({ data }) => {
          context.commit(SET_COMPANYRESSULT, data);

          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_COMPANYERROR, response.data.errors);
        });
    });
  },
  [DELETECOMPANYLIST](context, body) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      const query = `Id=${body.id}&Name=${body.name}&UNCode=${body.unCode}&RowVersion=${body.rowVersion}`;
      ApiService.delete(`/definition/Company/delete?${query}`)
        .then(({ data }) => {
          context.commit(SET_COMPANYRESSULT, data);

          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_COMPANYERROR, response.data.errors);
        });
    });
  },
  [GETALLLINES](context) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/definition/Company/getallLines")
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_COMPANYERROR, response.data.errors);
        });
    });
  },
};

const mutations = {
  [SET_COMPANYERROR](state, error) {
    state.errors = error;
  },
  [SET_COMPANYRESSULT](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.messages = apiResult.message;
      state.errors = [];
    } else {
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_COMPANYLIST](state, apiResult) {
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
