// action types
export const GET_SERVER_LIST = 'getServerList'
export const GET_SELECTED_SERVER = 'getSelectedServer'

// mutation typesrows

export const SET_SELECTED_SERVER = 'setSelectedServer'

const state = {
  selectedServer: null,
  serverList: []
}

const getters = {
  getServerList(state) {
    return state.serverList
  },
  getSelectedServer() {
    return state.selectedServer
  }
}

const actions = {
  [GET_SERVER_LIST]() {},
  [GET_SELECTED_SERVER]() {}
}

const mutations = {
  [SET_SELECTED_SERVER](state) {
    state.selectedServer = state
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
