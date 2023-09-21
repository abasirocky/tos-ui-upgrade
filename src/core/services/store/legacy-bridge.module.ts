import ApiService from "@/core/services/api.service";
export const GETSETTIONID = "getLegacySessionId";
export const SET_SELEGACYRESSULT = "setLegacyResult";
export const SET_LEGACYERROR = "setLegacyError";
const state = {
  errors: [],
  messages: [],
};

const getters = {
  getLegacyErrors() {
    return state.errors;
  },
  getLegacyMessages(state) {
    return state.messages;
  },
};
const actions = {
  [GETSETTIONID](context) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/system/LegacyBridge/getsessionidbyfacillity?facillity=DAR")
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_LEGACYERROR, response?.data?.errors);
        });
    });
  }
};

const mutations = {
  [SET_LEGACYERROR](state, error) {
    state.errors = error;
  },
  [SET_SELEGACYRESSULT](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.messages = apiResult.message;
      state.errors = [];
    } else {
      state.errors = apiResult.message;
      state.messages = [];
    }
  }
};

export default {
  state,
  mutations,
  getters,
  actions,
};
