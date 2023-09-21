
import Vue from "vue";
// action types

export const VERIFY_AUTH = "verifyAuth";
export const LOGIN = "login";
export const LOGOUT = "logout";

export const AFTER_LOGIN_KEYCLOAK = "AFTER_LOGIN_KEYCLOAK";

// mutation types
export const PURGE_AUTH = "logOut";
export const SET_TOKEN = "setToken";
export const SET_USERINFO = "setuserinfo";
export const SET_ERROR = "setError";
export const SET_KEYCLOAK = "SET_KEYCLOAK";

const state = {
  keycloak: null,
  errors: [],
  messages: [],
  user: {},
};

const getters = {
  getkeycloak(state) {
    return state.keycloak;
  },
  currentUser(state) {
    return state.user;
  },
  isAuthenticated() {
    return Vue.prototype.$keycloak.authenticated;
  },
  getauthErrors(state) {
    return state.errors;
  },
  getauthMessages(state) {
    return state.messages;
  },
};

const actions = {
  [AFTER_LOGIN_KEYCLOAK](context, keycloak) {
    context.commit(SET_TOKEN, keycloak.token);
    context.commit(SET_KEYCLOAK, keycloak);

    keycloak.loadUserInfo().then((res) => {
      context.commit(SET_USERINFO, res);
    });
  },

  [LOGOUT](context) {
    context.commit(PURGE_AUTH);
  },

  [VERIFY_AUTH](context) {
    //context.commit(SET_KEYCLOAK, keycloak);
   // debugger;
    if (context.getters.getkeycloak) {
      alert("ok");
    }
    // keycloak
    //   .updateToken(180)
    //   .then(refreshed => {
    //     if (refreshed) {
    //       // console.info("Token refreshed:" + refreshed);
    //       context.commit(SET_TOKEN, keycloak.token);
    //     }
    //     // else {
    //     //   console.warn(
    //     //     "Token not refreshed, valid for " +
    //     //       Math.round(
    //     //         keycloak.tokenParsed.exp +
    //     //           keycloak.timeSkew -
    //     //           new Date().getTime() / 1000
    //     //       ) +
    //     //       " seconds"
    //     //   );
    //     // }
    //   })
    //   .catch(() => {
    //     context.commit(PURGE_AUTH);
    //     context.commit(SET_ERROR, "Verify token error");
    //   });
  },
};

const mutations = {
  [SET_KEYCLOAK](state, keycloak) {
    state.keycloak = keycloak;
  },
  [SET_ERROR](state, error) {
    state.errors = error;
  },
  [SET_USERINFO](state, userinfo) {
    state.user = userinfo;
  },
  [SET_TOKEN](state) {
    state.errors = [];

  //  JwtService.saveToken(token);
  },

  [PURGE_AUTH](state) {
    Vue.prototype.$keycloak.logout();
    //if (state.keycloak) state.keycloak.logout();
   // JwtService.destroyToken();
    state.user = {};
    state.errors = [];
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
