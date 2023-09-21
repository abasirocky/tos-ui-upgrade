import ApiService from "@/core/services/api.service";
export const GETSETTINGLIST = "getSettingList";
export const GETSETTINGSYSTEMINFOLIST = "getSystemInfo";
export const GETWEBINFO = "getWebInfo";
export const ADDSETTINGLIST = "addSettingList";
export const SET_SETTINGRESSULT = "setSettingResult";
export const SET_SETTINGERROR = "setSettingError";
export const SETSETTINGLIST = "setSettingList";
export const SET_GETWEBINFO = "setGETWEBINFO";
const state = {
  result_getWebInfo: null,
  errors: [],
  messages: [],
};

const getters = {
  getWebInfo(state) {
    return state.result;
  },
  getSettingErrors() {
    return state.errors;
  },
  getSettingMessages(state) {
    return state.messages;
  },
};
const actions = {
  [ADDSETTINGLIST](context, body) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.post("/definition/Setting/savesetting", body)
        .then(({ data }) => {
          context.commit(SET_SETTINGRESSULT, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_SETTINGERROR, response.data.errors);
        });
    });
  },
  [GETSETTINGLIST](context) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/definition/Setting/getsetting")
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_SETTINGERROR, response.data.errors);
        });
    });
  },
  [GETWEBINFO](context) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/definition/Setting/getwebsiteinfo")
        .then(({ data }) => {
          context.commit(SET_GETWEBINFO, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_SETTINGERROR, response.data.errors);
        });
    });
  },
  [GETSETTINGSYSTEMINFOLIST](context,token) {
    return new Promise((resolve) => {
      // @ts-ignore
      ApiService.setHeader(token);
      ApiService.getData("/system/getapplicationsetting")
        .then(({ data }) => {
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_SETTINGERROR, response.data.errors);
        });
    });
  },
};

const mutations = {
  [SET_SETTINGERROR](state, error) {
    state.errors = error;
  },
  [SET_SETTINGRESSULT](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.messages = apiResult.message;
      state.errors = [];
    } else {
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SETSETTINGLIST](state, apiResult) {
    state.apiResult = apiResult;
    if (apiResult.isSuccessful) {
      state.errors = [];
    } else {
      state.errors = apiResult.message;
    }
  },
  [SET_GETWEBINFO](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_getWebInfo = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_getWebInfo = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
};

export default {
  state,
  mutations,
  getters,
  actions,
};
