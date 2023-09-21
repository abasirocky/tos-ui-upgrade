import ApiService from "@/core/services/api.service";

// action types
export const GET_VoyageSOF_ETA = "getvoyagesofeta";
export const GET_VoyageSOF_AnchorageIn = "getvoyagesofanchoragein";
export const GET_VoyageSOF_Plan = "getvoyagesofplan";
export const GET_VoyageSOF_Berth = "getvoyagesofberth";
export const GET_VoyageSOF_AnchorageOut = "getvoyagesofanchorageout";

export const GET_VoyageSOF_AllBollard = "getvoyagesofallbollard";
export const GET_VoyageSOF_AllBerthSide = "getvoyagesofallberthside";
export const GET_VoyageSOF_EndBollard = "getendbollard";

export const Update_VoyageSOF_ETA = "updateeta";
export const Update_VoyageSOF_AnchorageIn = "updateanchoragein";
export const AddOrUpdate_VoyageSOF_Plan = "addupdateplan";
export const Delete_VoyageSOF_Plan = "deleteplan";
export const AddOrUpdate_VoyageSOF_Berth = "addupdateberth";
export const Delete_VoyageSOF_Berth = "deleteberth";
export const Update_VoyageSOF_AnchorageOut = "updateanchorageout";

export const Update_BerthSideByVoyageId = "updateberthsidebyvoyageid"; 

// mutation types
export const SET_GET_VoyageSOF_ETA = "setVoyageSOFETA";
export const SET_GET_VoyageSOF_AnchorageIn = "setVoyageSOFAnchorageIn";
export const SET_GET_VoyageSOF_Plan = "setVoyageSOFPlan";
export const SET_GET_VoyageSOF_Berth = "setVoyageSOFBerth";
export const SET_GET_VoyageSOF_AnchorageOut = "setVoyageSOFAnchorageOut";

export const SET_GET_VoyageSOF_AllBollard = "setVoyageSOFAllBollard";
export const SET_GET_VoyageSOF_AllBerthSide = "setVoyageSOFAllBerthSide";

export const SET_Update_VoyageSOF_ETA = "setupdateeta";
export const SET_Update_VoyageSOF_AnchorageIn = "setupdateanchoragein";
export const SET_AddOrUpdate_VoyageSOF_Plan = "setupdateplan";
export const SET_Delete_VoyageSOF_Plan = "setdeleteplan";
export const SET_AddOrUpdate_VoyageSOF_Berth = "setupdateberth";
export const SET_Delete_VoyageSOF_Berth = "setdeleteberth";
export const SET_Update_VoyageSOF_AnchorageOut = "setupdateanchorageout";
export const SET_GET_VoyageSOF_EndBollard = "setgetendbollard";

export const SET_Update_BerthSideByVoyageId = "setupdateberthsidebyvoyageid";

export const SET_VOYAGESOF_ERROR = "setVoyageSOFError";

const state = {
  result_getvoyagesofeta: null,
  result_getvoyagesofanchoragein: null,
  result_getvoyagesofplan: null,
  result_getvoyagesofberth: null,
  result_getvoyagesofanchorageout: null,
  result_getvoyagesofallbollard: null,
  result_getvoyagesofallberthside: null,
  result_getVoyageSOFEndBollard: null,

  errors: [],
  messages: [],
};

const getters = {
  getVoyageSOFETA(state) {
    return state.result_getvoyagesofeta;
  },
  getVoyageSOFAnchorageIn(state) {
    return state.result_getvoyagesofanchoragein;
  },
  getVoyageSOFPlan(state) {
    return state.result_getvoyagesofplan;
  },
  getVoyageSOFBerth(state) {
    return state.result_getvoyagesofberth;
  },
  getVoyageSOFAnchorageOut(state) {
    return state.result_getvoyagesofanchorageout;
  },
  getVoyageSOFAllBollard(state) {
    return state.result_getvoyagesofallbollard;
  },
  getVoyageSOFAllBerthSide(state) {
    return state.result_getvoyagesofallberthside;
  },
  getVoyageSOFEndBollard(state) {
    return state.result_getVoyageSOFEndBollard;
  },
  getVoyageSOFMessages(state) {
    return state.messages;
  },
  getVoyageSOFErrors() {
    return state.errors;
  },
};
const actions = {
  [GET_VoyageSOF_ETA](context, state) {
    var query = Object.keys(state)
      .map((key) => key + "=" + encodeURIComponent(state[key]))
      .join("&");
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/definition/VoyageSOF/getvoyagesofeta?" + query)
        .then(({ data }) => {
          context.commit(SET_GET_VoyageSOF_ETA, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VOYAGESOF_ERROR, response.data.errors);
        });
    });
  },
  [GET_VoyageSOF_AnchorageIn](context, state) {
    var query = Object.keys(state)
      .map((key) => key + "=" + encodeURIComponent(state[key]))
      .join("&");
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData(
        "/definition/VoyageSOF/getvoyagesofanchoragein?" + query
      )
        .then(({ data }) => {
          context.commit(SET_GET_VoyageSOF_AnchorageIn, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VOYAGESOF_ERROR, response.data.errors);
        });
    });
  },
  [GET_VoyageSOF_Plan](context, state) {
    var query = Object.keys(state)
      .map((key) => key + "=" + encodeURIComponent(state[key]))
      .join("&");
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/definition/VoyageSOF/getvoyagesofplan?" + query)
        .then(({ data }) => {
          context.commit(SET_GET_VoyageSOF_Plan, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VOYAGESOF_ERROR, response.data.errors);
        });
    });
  },
  [GET_VoyageSOF_Berth](context, state) {
    var query = Object.keys(state)
      .map((key) => key + "=" + encodeURIComponent(state[key]))
      .join("&");
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/definition/VoyageSOF/getvoyagesofberth?" + query)
        .then(({ data }) => {
          context.commit(SET_GET_VoyageSOF_Berth, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VOYAGESOF_ERROR, response.data.errors);
        });
    });
  },
  [GET_VoyageSOF_AnchorageOut](context, state) {
    var query = Object.keys(state)
      .map((key) => key + "=" + encodeURIComponent(state[key]))
      .join("&");
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData(
        "/definition/VoyageSOF/getvoyagesofanchorageout?" + query
      )
        .then(({ data }) => {
          context.commit(SET_GET_VoyageSOF_AnchorageOut, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VOYAGESOF_ERROR, response.data.errors);
        });
    });
  },
  [GET_VoyageSOF_AllBollard](context, state) {
    var query = Object.keys(state)
      .map((key) => key + "=" + encodeURIComponent(state[key]))
      .join("&");
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/definition/VoyageSOF/getbollardbyportid?" + query)
        .then(({ data }) => {
          context.commit(SET_GET_VoyageSOF_AllBollard, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VOYAGESOF_ERROR, response.data.errors);
        });
    });
  },
  [GET_VoyageSOF_AllBerthSide](context) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/definition/VoyageSOF/getberthsideselectlist")
        .then(({ data }) => {
          context.commit(SET_GET_VoyageSOF_AllBerthSide, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VOYAGESOF_ERROR, response.data.errors);
        });
    });
  },
  [GET_VoyageSOF_EndBollard](context, state) {
    var query = Object.keys(state)
      .map((key) => key + "=" + encodeURIComponent(state[key]))
      .join("&");
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.getData("/definition/VoyageSOF/getendbollard?" + query)
        .then(({ data }) => {
          context.commit(SET_GET_VoyageSOF_EndBollard, data, []);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VOYAGESOF_ERROR, response.data.errors);
        });
    });
  },

  [Update_VoyageSOF_ETA](context, state) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.post("/definition/VoyageSOF/saveeta", state)
        .then(({ data }) => {
          context.commit(SET_Update_VoyageSOF_ETA, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VOYAGESOF_ERROR, response.data.errors);
        });
    });
  },
  [Update_VoyageSOF_AnchorageIn](context, state) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.post("/system/VoyageSOF/saveanchorage", state)
        .then(({ data }) => {
          context.commit(SET_Update_VoyageSOF_AnchorageIn, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VOYAGESOF_ERROR, response.data.errors);
        });
    });
  },
  [AddOrUpdate_VoyageSOF_Plan](context, state) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.post("/definition/VoyageSOF/saveplan", state)
        .then(({ data }) => {
          context.commit(SET_AddOrUpdate_VoyageSOF_Plan, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VOYAGESOF_ERROR, response.data.errors);
        });
    });
  },
  [Delete_VoyageSOF_Plan](context, state) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      const query = `Id=${state.id}&RowVersion=${encodeURIComponent(
        state.rowVersion
      )}`;
      ApiService.delete("/system/VoyageSOF/deleteplan?" + query)
        .then(({ data }) => {
          context.commit(SET_Delete_VoyageSOF_Plan, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VOYAGESOF_ERROR, response.data.errors);
        });
    });
  },
  [AddOrUpdate_VoyageSOF_Berth](context, state) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.post("/system/VoyageSOF/saveberth", state)
        .then(({ data }) => {
          context.commit(SET_AddOrUpdate_VoyageSOF_Berth, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VOYAGESOF_ERROR, response.data.errors);
        });
    });
  },
  [Delete_VoyageSOF_Berth](context, state) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      const query = `Id=${state.id}&RowVersion=${encodeURIComponent(
        state.rowVersion
      )}`;
      ApiService.delete("/system/VoyageSOF/deleteberth?" + query)
        .then(({ data }) => {
          context.commit(SET_Delete_VoyageSOF_Berth, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VOYAGESOF_ERROR, response.data.errors);
        });
    });
  },
  [Update_VoyageSOF_AnchorageOut](context, state) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.post("/system/VoyageSOF/saveanchorageout", state)
        .then(({ data }) => {
          context.commit(SET_Update_VoyageSOF_AnchorageOut, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VOYAGESOF_ERROR, response.data.errors);
        });
    });
  },

  [Update_BerthSideByVoyageId](context, state) {
    return new Promise((resolve) => {
      ApiService.setHeader();
      ApiService.post("/system/VoyageSOF/updateberthsidebyvoyageid", state)
        .then(({ data }) => {
          context.commit(SET_Update_BerthSideByVoyageId, data);
          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VOYAGESOF_ERROR, response.data.errors);
        });
    });
  },
};

const mutations = {
  [SET_GET_VoyageSOF_ETA](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_getvoyagesofeta = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_getvoyagesofeta = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_GET_VoyageSOF_AnchorageIn](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_getvoyagesofanchoragein = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_getvoyagesofanchoragein = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_GET_VoyageSOF_Plan](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_getvoyagesofplan = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_getvoyagesofplan = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_GET_VoyageSOF_Berth](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_getvoyagesofberth = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_getvoyagesofberth = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_GET_VoyageSOF_AnchorageOut](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_getvoyagesofanchorageout = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_getvoyagesofanchorageout = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_GET_VoyageSOF_AllBollard](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_getvoyagesofallbollard = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_getvoyagesofeta = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_GET_VoyageSOF_AllBerthSide](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_getvoyagesofallberthside = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_getvoyagesofeta = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_GET_VoyageSOF_EndBollard](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.result_getVoyageSOFEndBollard = apiResult.data;
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.result_getVoyageSOFEndBollard = [];
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_Update_VoyageSOF_ETA](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_Update_VoyageSOF_AnchorageIn](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_AddOrUpdate_VoyageSOF_Plan](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_Delete_VoyageSOF_Plan](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_AddOrUpdate_VoyageSOF_Berth](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_Delete_VoyageSOF_Berth](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_Update_VoyageSOF_AnchorageOut](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_Update_BerthSideByVoyageId](state, apiResult) {
    if (apiResult.isSuccessful) {
      state.errors = [];
      state.messages = apiResult.message;
    } else {
      state.errors = apiResult.message;
      state.messages = [];
    }
  },
  [SET_VOYAGESOF_ERROR](state, error) {
    state.errors = error;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
