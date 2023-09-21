import ApiService from "@/core/services/api.service";

// action types

export const GETVoyageDetailById = "getvoyagedetailbyid";
export const ADDUpdateVoyageDetail = "addupdatevoyagedetail";


// mutation typesrows
export const SET_GETVoyageDetailById = "setgetvoyagedetailbyid";
export const SET_VoyageDetailError = "setvoyagedetailerror";
export const SET_VoyageDetailResult = "setvoyagedetailresult";

const state = {
  errors: [],
  messages: [],
  result_voyagedetail: null,
};

const getters = {
  getVoyageDetailErrors() {
    return state.errors;
  },
  getVoyageDetailMessages(state) {
    return state.messages;
  },
  getVoyageDetail(state) {
    return state.result_voyagedetail;
  },

};

const actions = {

  [GETVoyageDetailById](context, voyageId) {
    const queryStr = `voyageId=${voyageId}`;

    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/definition/VoyageDetail/getbyvoyageid?" + queryStr)
        .then(({ data }) => {
          context.commit(SET_GETVoyageDetailById, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VoyageDetailError, response.data.errors);
        });
    });
  },

  [ADDUpdateVoyageDetail](context, body) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.post("/definition/VoyageDetail/addorUpdate", body)
        .then(({ data }) => {
          context.commit(SET_VoyageDetailResult, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VoyageDetailError, response.data.errors);
        });
    });
  },
  
};

const mutations = {
  [SET_VoyageDetailError](state, error) {
    state.errors = error;
  },
  [SET_VoyageDetailResult](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.messages = apiResult.message;
      state.errors = [];
    } else {
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_GETVoyageDetailById](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_voyagedetail = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_voyagedetail = null;
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
