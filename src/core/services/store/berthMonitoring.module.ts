import ApiService from "@/core/services/api.service";

// action types
export const GET_IS_PAGE_REFRESHING = "getIsPageRefreshing"
export const GETBERTHLIST = "getBerthList";
export const GETBERTHBYID = "getBerth";
export const ADDBERTHLIST = "addBerth";
export const UPDATEBERTHLIST = "updateBerth";
export const DELETEBERTHLIST = "deleteBerth";
export const GETQUAYWALLLIST = "getQuayWallList";
// mutation typesrows
export const SET_BERTHLIST = "setBerthList";
export const SET_BERTHERROR = "setBerthError";
export const SET_BERTHRESSULT = "setBerthResult";
export const TOGGLE_IS_PAGE_REFRESHING = "toggleIsPageRefreshing"
export const MUTATE_IS_PAGE_REFRESHING = "MutateRefreshButtonClicked"


interface IState {
  errors: any[]
  totalItems: number
  items: any[]
  currentPage: number,
  messages: any[]
  isPageRefreshing: boolean
  isLoading: boolean
}

const state: IState = {
  errors: [],
  totalItems: 0,
  items: [],
  currentPage: 1,
  messages: [],
  isPageRefreshing: false,
  isLoading:false
};

const getters = {
  [GET_IS_PAGE_REFRESHING](state: IState) {
    return state.isPageRefreshing
  }
};

const actions = {
  [TOGGLE_IS_PAGE_REFRESHING](context, state) {
    context.commit(MUTATE_IS_PAGE_REFRESHING)
  },
};

const mutations = {
  [MUTATE_IS_PAGE_REFRESHING](state: IState, error) {
    state.isPageRefreshing = !state.isPageRefreshing
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
