import ApiService from "@/core/services/api.service";
// action types
export const GETDOCKLIST = "getDocklist";
export const GETDOCKBYID = "getDock";
export const ADDDOCKLIST = "addDock";
export const UPDATEDOCKLIST = "updateDock";
export const DELETEDOCKLIST = "deleteDock";
export const GETPORTBYUNCODE = "getportbyuncode";
export const GETAllDocks = "getAllDocks"; 
export const GETAllDocksByVoyageId = "getAllDocksByVoyageId"; 


// mutation typesrows
export const SET_DOCKLIST = "setDockList";
export const SET_DOCKERROR = "setDockError";
export const SET_DOCKRESSULT = "setDockResult";
export const SET_AllDocks = "setAllDocks";
export const SET_AllDocksByVoyageId = "setAllDocksByVoyageId";


const state = {
  errors: [],
  totalItems: 0,
  items: [],
  currentPage: 1,
  messages: [],
  countries: [],
  result_allDocks: null,
  result_allDocksByVoyageId:null
};

const getters = {
  getAllDocks(state) {
    return state.result_allDocks;
  },
  getAllDocksByVoyageId(state) {
    return state.result_allDocksByVoyageId;
  },




  getDockRows(state) {
    return state.items;
  },
  getDockErrors() {
    return state.errors;
  },
  getDockMessages(state) {
    return state.messages;
  },
  getDockRowsCount() {
    return state.totalItems;
  },
};

const actions = {
  [GETDOCKLIST](context, state) {
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
      ApiService.getData("/definition/Terminal/getlist?" + queryStr)
        .then(({ data }) => {
          context.commit(SET_DOCKLIST, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_DOCKERROR, response.data.errors);
        });
    });
  },

  [GETDOCKBYID](context, id) {
    const queryStr = `id=${id}`;

    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/definition/Terminal/getbyid?" + queryStr)
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_DOCKERROR, response.data.errors);
        });
    });
  },

  [ADDDOCKLIST](context, body) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.post("/definition/Terminal/add", body)
        .then(({ data }) => {
          context.commit(SET_DOCKRESSULT, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_DOCKERROR, response.data.errors);
        });
    });
  },
  [UPDATEDOCKLIST](context, body) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.put("/definition/Terminal/update", body)
        .then(({ data }) => {
          context.commit(SET_DOCKRESSULT, data);

          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_DOCKERROR, response.data.errors);
        });
    });
  },
  [DELETEDOCKLIST](context, body) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      const query = `Id=${body.id}&Name=${body.name}&UNCode=${body.unCode}&RowVersion=${body.rowVersion}`;
      ApiService.delete(`/definition/Terminal/delete?${query}`)
        .then(({ data }) => {
          context.commit(SET_DOCKRESSULT, data);

          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_DOCKERROR, response.data.errors);
        });
    });
  },
  [GETPORTBYUNCODE](context, uncode) {
    const queryStr = `uncode=${uncode}`;

    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/definition/Port/getbyuncode?" + queryStr)
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_DOCKERROR, response.data.errors);
        });
    });
  },
  [GETAllDocks](context) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/definition/Terminal/getallTerminals")
        .then(({ data }) => {
          context.commit(SET_AllDocks, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_DOCKERROR, response.data.errors);
        });
    });
  },
  [GETAllDocksByVoyageId](context,state) {
    var query = Object.keys(state)
    .map((key) => key + "=" + encodeURIComponent(state[key]))
    .join("&");
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/definition/Terminal/getallterminalsbyvoyageid?" + query)
        .then(({ data }) => {
          context.commit(SET_AllDocksByVoyageId, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_DOCKERROR, response.data.errors);
        });
    });
  },





};

const mutations = {
  [SET_DOCKERROR](state, error) {
    state.errors = error;
  },

  [SET_DOCKRESSULT](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.messages = apiResult.message;
      state.errors = [];
    } else {
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_DOCKLIST](state, apiResult) {
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
  [SET_AllDocks](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_allDocks = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_allDocks = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },

  
  [SET_AllDocksByVoyageId](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_allDocksByVoyageId = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_allDocksByVoyageId = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },



};

export default {
  state,
  actions,
  mutations,
  getters,
};
