import ApiService from "@/core/services/api.service";
 
// action types
export const GETCompanyLineServiceLIST = "getCompanyLineServiceList";
export const GETCompanyLineServiceBYID = "getCompanyLineService";
export const ADDCompanyLineServiceLIST = "addCompanyLineService";
export const UPDATECompanyLineServiceLIST = "updateCompanyLineService";
export const DELETECompanyLineServiceLIST = "deleteCompanyLineService";

export const GETALLCOMPANYLINESERVICELIST = "getAllcompanyLineServiceList";

// mutation typesrows
export const SET_CompanyLineServiceLIST = "setCompanyLineServiceList";
export const SET_CompanyLineServiceERROR = "setCompanyLineServiceError";
export const SET_CompanyLineServiceRESSULT = "setCompanyLineServiceResult";
 
const state = {
  errors: [],
  totalItems: 0,
  items: [],
  currentPage: 1,
  messages: [],
};

const getters = {
  getCompanyLineServiceRows(state) {
    return state.items;
  },
  getCompanyLineServiceErrors() {
    return state.errors;
  },
  getCompanyLineServiceMessages(state) {
    return state.messages;
  },
  getCompanyLineServiceRowsCount() {
    return state.totalItems;
  },
};

const actions = {
  [GETCompanyLineServiceLIST](context, state) {
    let queryStr = `PageNo=${state.pageNo}&RowPerPage=${state.rowPerPage}&companyId=${state.companyId}`;
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

      ApiService.getData("/definition/CompanyLineService/getlist?" + queryStr)
        .then(({ data }) => {
          context.commit(SET_CompanyLineServiceLIST, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_CompanyLineServiceERROR, response.data.errors);
        });
    });
  },
  [GETCompanyLineServiceBYID](context, id) {
    const queryStr = `id=${id}`;

    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/definition/CompanyLineService/getbyid?" + queryStr)
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_CompanyLineServiceERROR, response.data.errors);
        });
    });
  },
  [ADDCompanyLineServiceLIST](context, body) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.post("/definition/CompanyLineService/add", body)
        .then(({ data }) => {
          context.commit(SET_CompanyLineServiceRESSULT, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_CompanyLineServiceERROR, response.data.errors);
        });
    });
  },
  [UPDATECompanyLineServiceLIST](context, body) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.put("/definition/CompanyLineService/update", body)
        .then(({ data }) => {
          context.commit(SET_CompanyLineServiceRESSULT, data);

          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_CompanyLineServiceERROR, response.data.errors);
        });
    });
  },
  [DELETECompanyLineServiceLIST](context, body) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      const query = `Id=${body.id}&Name=${body.name}&UNCode=${body.unCode}&RowVersion=${body.rowVersion}`;
      ApiService.delete(`/definition/CompanyLineService/delete?${query}`)
        .then(({ data }) => {
          context.commit(SET_CompanyLineServiceRESSULT, data);

          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_CompanyLineServiceERROR, response.data.errors);
        });
    });
  },


  [GETALLCOMPANYLINESERVICELIST](context) {
    return new Promise(resolve => {
      ApiService.setHeader();
      ApiService.getData("/definition/CompanyLineService/getallcompanylineservice")
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_CompanyLineServiceERROR, response.data.errors);
        });
    });
  },







};

const mutations = {
  [SET_CompanyLineServiceERROR](state, error) {
    state.errors = error;
  },
  [SET_CompanyLineServiceRESSULT](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.messages = apiResult.message;
      state.errors = [];
    } else {
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_CompanyLineServiceLIST](state, apiResult) {
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
