import ApiService from "@/core/services/api.service";

 // action types
export const GETVOYAGELIST = "getVoyageList";
export const GETVOYAGEBYID = "getVoyage";
export const ADDVOYAGELIST = "addVoyage";
export const UPDATEVOYAGELIST = "updateVoyage";
export const DELETEVOYAGELIST = "deleteVoyage";
export const GETVOYAGEPORTBYUNCODE = "getvoyagePort";
export const GETALLVOYAGEVESSEL = "getVessels";
export const GETVOYAGESERVICETYPELIST = "getVoyageServiceType";
export const GETVESSELINEAGENT = "getAgentLine";
export const GETCOMPANYLINESERVICEBYLINEID = "getCompanyLineServiceByLineId";
// mutation typesrows
export const SET_VOYAGELIST = "setVoyageList";
export const SET_VOYAGEERROR = "setVoyageError";
export const SET_VOYAGERESSULT = "setVoyageResult";

const state = {
  errors: [],
  totalItems: 0,
  items: [],
  currentPage: 1,
  messages: [],
};
 
const getters = {
  getVoyageRows(state) {
    return state.items;
  },
  getVoyageErrors() {
    return state.errors;
  },
  getVoyageMessages(state) {
    return state.messages;
  },
  getVoyageRowsCount() {
    return state.totalItems;
  },
};

const actions = {
  [GETVOYAGELIST](context, state) {
    let queryStr = `pageNo=${state.pageNo}&rowPerPage=${state.rowPerPage}`;
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
      ApiService.getData("/definition/Voyage/getlist?" + queryStr)
      
        .then(({ data }) => {
          context.commit(SET_VOYAGELIST, data, []);

          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VOYAGEERROR, response.data.errors);
        });
    });
  },
  [GETVOYAGEBYID](context, id) {
    const queryStr = `id=${id}`;

    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/definition/Voyage/getbyid?" + queryStr)
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VOYAGEERROR, response.data.errors);
        });
    });
  },

  [ADDVOYAGELIST](context, body) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.post("/definition/Voyage/add", body)
        .then(({ data }) => {
          context.commit(SET_VOYAGERESSULT, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VOYAGEERROR, response.data.errors);
        });
    });
  },
  [UPDATEVOYAGELIST](context, body) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.put("/definition/Voyage/update", body)
        .then(({ data }) => {
          context.commit(SET_VOYAGERESSULT, data);

          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VOYAGEERROR, response.data.errors);
        });
    });
  },
  [DELETEVOYAGELIST](context, body) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      const query = `Id=${body.id}&RowVersion=${encodeURIComponent(body.rowVersion)}`;
      ApiService.delete(`/definition/Voyage/delete?${query}`)
        .then(({ data }) => {
          context.commit(SET_VOYAGERESSULT, data);

          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VOYAGEERROR, response.data.errors);
        });
    });
  },
  [GETVOYAGEPORTBYUNCODE](context, uncode) {
    const queryStr = `uncode=${uncode}`;

    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/definition/Port/getbyuncode?" + queryStr)
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VOYAGEERROR, response.data.errors);
        });
    });
  },
  [GETALLVOYAGEVESSEL](context) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/definition/Vessel/getall")
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VOYAGEERROR, response.data.errors);
        });
    });
  },
  [GETVOYAGESERVICETYPELIST](context) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/definition/Voyage/getvoyageservicetypeselectlist")
        .then(({ data }) => {

          resolve(data);

        })
        .catch(({ response }) => {
          context.commit(SET_VOYAGEERROR, response.data.errors);
        });
    });
  },
  [GETVESSELINEAGENT](context, vesselId) {
    const queryStr = `vesselId=${vesselId}`;

    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/definition/Voyage/getvessellinecompany?" + queryStr)
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VOYAGEERROR, response.data.errors);
        });
    });
  },
  [GETCOMPANYLINESERVICEBYLINEID](context, lineId) {
    const queryStr = `lineId=${lineId}`;

    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/definition/Voyage/getallcompanylineservicebylineid?" + queryStr)
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VOYAGEERROR, response.data.errors);
        });
    });
  },

};

const mutations = {
  [SET_VOYAGEERROR](state, error) {
    state.errors = error;
  },
  [SET_VOYAGERESSULT](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.messages = apiResult.message;
      state.errors = [];
    } else {
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_VOYAGELIST](state, apiResult) {
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
