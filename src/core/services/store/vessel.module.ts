import ApiService from "@/core/services/api.service";

// action types
export const GETVESSELLIST = "getVesselList";
export const GETVESSELBYID = "getVessel";
export const ADDVESSELLIST = "addVessel";
export const UPDATEVESSELLIST = "updateVessel";
export const DELETEVESSELLIST = "deleteVessel";
export const GETVESSELLINECOMPANYLIST = "getVesselLineList";
export const GETVESSELTYPELIST = "getVesselTypeList";
export const GETALLVESSELCOUNTRIES = "getVesselCountries";
export const GETREGISTRYPORTBYUNCODE = "getRegistryPort";

// mutation typesrows
export const SET_VESSELLIST = "setVesselList";
export const SET_VESSELERROR = "setVesselError";
export const SET_VESSELRESSULT = "setVesselResult";

const state = {
  errors: [],
  totalItems: 0,
  items: [],
  currentPage: 1,
  messages: []
};

const getters = {
  getVesselRows(state) {
    return state.items;
  },
  getVesselErrors() {
    return state.errors;
  },
  getVesselMessages(state) {
    return state.messages;
  },
  getVesselRowsCount() {
    return state.totalItems;
  }
};

const actions = {
  [GETVESSELLIST](context, state) {
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
      ApiService.getData("/definition/Vessel/getlist?" + queryStr)

        .then(({ data }) => {
          context.commit(SET_VESSELLIST, data, []);

          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VESSELERROR, response.data.errors);
        });
    });
  },
  [GETVESSELBYID](context, id) {
    const queryStr = `id=${id}`;

    return new Promise(resolve => {
      ApiService.setHeader();
      ApiService.getData("/definition/Vessel/getbyid?" + queryStr)
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VESSELERROR, response.data.errors);
        });
    });
  },

  [ADDVESSELLIST](context, body) {
    return new Promise(resolve => {
      ApiService.setHeader();
      ApiService.post("/definition/Vessel/add", body)
        .then(({ data }) => {
          context.commit(SET_VESSELRESSULT, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VESSELERROR, response.data.errors);
        });
    });
  },
  [UPDATEVESSELLIST](context, body) {
    return new Promise(resolve => {
      ApiService.setHeader();
      ApiService.put("/definition/Vessel/update", body)
        .then(({ data }) => {
          context.commit(SET_VESSELRESSULT, data);

          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VESSELERROR, response.data.errors);
        });
    });
  },
  [DELETEVESSELLIST](context, body) {
    return new Promise(resolve => {
      ApiService.setHeader();
      const query = `Id=${body.id}&Name=${body.name}&UNCode=${body.unCode}&RowVersion=${encodeURIComponent(body.rowVersion)}`;
      ApiService.delete(`/definition/Vessel/delete?${query}`)
        .then(({ data }) => {
          context.commit(SET_VESSELRESSULT, data);

          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VESSELERROR, response.data.errors);
        });
    });
  },
  [GETVESSELLINECOMPANYLIST](context) {
    return new Promise(resolve => {
      ApiService.setHeader();
      ApiService.getData("/definition/Vessel/getallvessellinecompany")
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VESSELERROR, response.data.errors);
        });
    });
  },
  [GETVESSELTYPELIST](context) {
    return new Promise(resolve => {
      ApiService.setHeader();
      ApiService.getData("/definition/Vessel/getvesseltypeselectlist")
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VESSELERROR, response.data.errors);
        });
    });
  },
  [GETALLVESSELCOUNTRIES](context) {
    return new Promise(resolve => {
      ApiService.setHeader();
      ApiService.getData("/definition/Country/getall")
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VESSELERROR, response.data.errors);
        });
    });
  },
  [GETREGISTRYPORTBYUNCODE](context, uncode) {
    const queryStr = `uncode=${uncode}`;

    return new Promise(resolve => {
      ApiService.setHeader();
      ApiService.getData("/definition/Port/getbyuncode?" + queryStr)
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VESSELERROR, response.data.errors);
        });
    });
  }
};

const mutations = {
  [SET_VESSELERROR](state, error) {
    state.errors = error;
  },
  [SET_VESSELRESSULT](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.messages = apiResult.message;
      state.errors = [];
    } else {
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_VESSELLIST](state, apiResult) {
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
