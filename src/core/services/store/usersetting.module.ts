import ApiService from "@/core/services/api.service";

// action types
export const GETUserSetting = "getusersetting";
export const AddorUpdateUserSetting = "addorupdateusersetting";
export const DeleteUserSetting = "deleteusersetting";

// mutation types
export const SET_GETUserSetting = "setusersetting";
export const SET_AddorUpdateUserSetting = "setAddorUpdateUserSetting";
export const SET_DeleteUserSetting = "setDeleteUserSetting";

export const SET_USERSETTING_ERROR = "setUserSettingError";

const state = {
  result_UserSetting: null,
  errors: [],
  messages: [],
};

const getters = {
  getUserSetting(state) {
    return state.result_UserSetting;
  },
  getUserSettingErrors() {
    return state.errors;
  },
  getUserSettingMessages(state) {
    return state.messages;
  },
};
const actions = {
  [GETUserSetting](context, state) {
    return new Promise((resolve) => {
      ApiService.setHeader();

      const queryStr = `SettingType=${state.SettingType}`;
      ApiService.getData("/definition/UserSetting/getusersetting?" + queryStr)
        .then(({ data }) => {
          context.commit(SET_GETUserSetting, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_USERSETTING_ERROR, response.data.errors);
        });
    });
  },
  [AddorUpdateUserSetting](context, state) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      const queryStr = `SettingType=${state.SettingType}`;
      ApiService.post("/definition/UserSetting/save?" + queryStr, state.model)
        .then(({ data }) => {
          context.commit(SET_AddorUpdateUserSetting, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_USERSETTING_ERROR, response.data.errors);
        });
    });
  },
  [DeleteUserSetting](context, state) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      const queryStr = `SettingType=${state.SettingType}`;
      ApiService.delete("/definition/UserSetting/delete?" + queryStr)
        .then(({ data }) => {
          context.commit(SET_DeleteUserSetting, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_USERSETTING_ERROR, response.data.errors);
        });
    });
  },
};

const mutations = {
  [SET_GETUserSetting](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_UserSetting = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_UserSetting = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_AddorUpdateUserSetting](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_DeleteUserSetting](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_USERSETTING_ERROR](state, error) {
    state.errors = error;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
