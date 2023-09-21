import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
//import JwtService from "@/core/services/jwt.service";

/**
 * Service to call HTTP request via Axios
 */
const ApiService = {
  init() {
    Vue.use(VueAxios, axios);
    Vue.axios.defaults.baseURL = process.env.VUE_APP_BASE_API;
  },

  tokenInterceptor() {
    Vue.axios.interceptors.request.use(
      (config) => {
        if (Vue.prototype.$keycloak.authenticated) {
          config.headers.Authorization = `Bearer ${Vue.prototype.$keycloak.token}`;
        } else {
          //logout for next login
           Vue.prototype.$keycloak.keycloak.logout();
           throw new Error(`[KT] ApiService Keycloak not authenticated `);
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  },
  /**
   * Set the default HTTP request headers
   */
  setHeader() {
    //const keycloak = Vue.prototype.$keycloak;
    // 
    // if (token) {
    //   JwtService.saveToken(token);
    //   Vue.axios.defaults.headers.common[
    //     "Authorization"
    //   ] = `bearer ${JwtService.getToken()}`;
    //   return;
    // }
    // debugger;
    // 
    // if (JwtService.getToken()) {
    //   Vue.axios.defaults.headers.common[
    //     "Authorization"
    //   ] = `bearer ${JwtService.getToken()}`;
    // }
    
  },

  query(resource, params) {
    return Vue.axios.get(resource, params).catch((error) => {
      // 
      throw new Error(`[KT] ApiService ${error}`);
    });
  },

  /**
   * Send the GET HTTP request
   * @param resource
   * @param slug
   * @returns {*}
   */
  get(resource, slug = "") {
    return Vue.axios.get(`${resource}/${slug}`).catch((error) => {
      // 
      throw new Error(`[KT] ApiService ${error}`);
    });
  },

  getData(resource) {
    return Vue.axios.get(`${resource}`).catch((error) => {
      // 
      throw new Error(`[KT] ApiService ${error}`);
    });
  },
  /**
   * Set the POST HTTP request
   * @param resource
   * @param params
   * @returns {*}
   */
  post(resource, params ?: any) {
    return Vue.axios.post(`${resource}`, params);
  },

  /**
   * Send the UPDATE HTTP request
   * @param resource
   * @param slug
   * @param params
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   */
  update(resource, slug, params) {
    return Vue.axios.put(`${resource}/${slug}`, params);
  },

  /**
   * Send the PUT HTTP request
   * @param resource
   * @param params
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   */
  put(resource, params) {
    return Vue.axios.put(`${resource}`, params);
  },

  /**
   * Send the DELETE HTTP request
   * @param resource
   * @returns {*}
   */
  delete(resource) {
    return Vue.axios.delete(resource).catch((error) => {
      // 
      throw new Error(`[RWV] ApiService ${error}`);
    });
  },
  newDelete(address, payload) {
    return Vue.axios.delete(address, {data: payload}).catch((error) => {
      // 
      throw new Error(`[RWV] ApiService ${error}`);
    });
  },
};

export default ApiService;
