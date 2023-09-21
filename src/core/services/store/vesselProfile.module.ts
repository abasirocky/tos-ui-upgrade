import ApiService from "@/core/services/api.service";
import Vue from "vue";
import { axios } from "vue/types/umd";
import { ActionTree } from "vuex";
import _ from 'lodash'

const TOGGLE_CELL_PROPERTIES = 'TOGGLE_CELL_PROPERTIES';

// action types
export const DELETE_VESSEL_HATCH ="deleteVesselHatch"
export const ADD_VESSEL_HATCH = "addVesselHatch"
export const GETVESSELPROFILELIST = "getVesselProfileList";
export const FETCH_VESSEL_PROFILE = "fetchVesselProfile";
export const SET_SELECTED_HATCH_INDEX = "setSelectedHatchIndex";
export const GETVESSELBYID = "getVessel";
export const ADDVESSELLIST = "addVessel";
export const UPDATEVESSELLIST = "updateVessel";
export const DELETEVESSELLIST = "deleteVessel";
export const GETVESSELLINECOMPANYLIST = "getVesselLineList";
export const GETVESSELTYPELIST = "getVesselTypeList";
export const GETALLVESSELCOUNTRIES = "getVesselCountries";
export const GETREGISTRYPORTBYUNCODE = "getRegistryPort";

// mutation
export const DELETE_VESSEL_HATCH_MUTATION = "deleteVesselHatchMutation"
export const ADD_VESSEL_HATCH_MUTATION = "addVesselHatchMutation"
export const ADD_VESSEL_HATCH_TO_RIGHT_MUTATION = "addVesselHatchToRightMutation"
export const ADD_VESSEL_HATCH_TO_LEFT_MUTATION = "addVesselHatchToLeftMutation"

export const UPDATE_VESSEL_PROFILE = "updateVesselProfile";
export const SET_VESSEL_PROFILE = "setVesselProfile";

export const SET_VESSELPROFILELIST = "setVesselList";
export const SET_VESSEL_PROFILE_ERROR = "setVesselError";
export const SET_VESSELRESSULT = "setVesselResult";

export const MUTATE_SELECTED_HATCH_INDEX = "mutateSelectedHatchId";

export const UPDATE_HATCH = "updateHatch";


// const reorderLabelsa = vesselProfileHatches => {
//   let clonedVesselProfileHatches = _.cloneDeep(vesselProfileHatches)
//   let currentBayLabel = 1
//   let counter = 0
//   return clonedVesselProfileHatches.map(function (h, index){
//     h.bayFore = currentBayLabel + (counter)
//     if (h.hasBayFore)  currentBayLabel += 1
//     if ((currentBayLabel + counter) % 2 !== 0 ) {
//       currentBayLabel += 1
//     }
//     h.bay40 = currentBayLabel + (counter)
//     if (h.hasBay40)  currentBayLabel += 1
//     h.bayAfter = currentBayLabel + (counter)
//     if (h.hasBayAfter) currentBayLabel += 1

//     if (h.hasBay40 || h.hasBayAfter || h.hasBayFore) {
//       counter++
//     }
    
//     return h
//   })
// }

const reorderLabels = vesselProfileHatches => {
  let clonedVesselProfileHatches = _.cloneDeep(vesselProfileHatches)
  let start = 0

  return clonedVesselProfileHatches.map(function (h, index){
    if(h.hasBayFore) {
      h.bayFore = start + 1
    } else {
      h.bayFore = 0
    }

    if(h.hasBay40) {
      h.bay40 = start + 2
    } else {
      h.bay40 = 0
    }

    if(h.hasBayAfter) {
      h.bayAfter = start + 3
    } else {
      h.bayAfter = 0
    }

    if(!h.hasBayAfter && !h.hasBay40 && h.hasBayFore) {
      start += 2
    } else {
      start += 4
    }
    return h
  })
} 

function isBaySelectionValid(selectedHatchData) {
  if (selectedHatchData.hasBay40 && ((selectedHatchData.hasBayFore && !selectedHatchData.hasBayAfter) || (!selectedHatchData.hasBayFore && selectedHatchData.hasBayAfter)) ) {
    Vue.$toast.open({
      message: "Invalid bay selection: fix bay selection before selecting another hatch",
      type: "error",
      position: "top",
    });
    return false
  }

  if (selectedHatchData.hasBayAfter && !selectedHatchData.hasBay40 && !selectedHatchData.hasBayFore) {
    Vue.$toast.open({
      message: "Invalid bay selection: fix bay selection before selecting another hatch",
      type: "error",
      position: "top",
    });
    return false
  }
  return true
}



const initialVesselHatchData = {
  vesselHatchType: 1,
  sequence: 1,
  minHoldTiers: 4,
  maxHoldTiers: 4,
  holdRows: 4,
  minDeckTiers: 12,
  maxDeckTiers: 88,
  deckRows: 10,
  hasBayFore: true,
  hasBayAfter: true,
  hasBay40: true,
  bayFore: 1,
  bayAfter: 3,
  bay40: 2,
  onDeckFore: {
    cols: 4,
    rows: 4,
    cells: [
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
    ],
  },
  onDeckAfter: {
    cols: 4,
    rows: 4,
    cells: [
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
    ],
  },
  onDeck40: {
    cols: 4,
    rows: 4,
    cells: [
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
    ],
  },
  holdFore: {
    cols: 4,
    rows: 4,
    cells: [
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
    ],
  },
  holdAfter: {
    cols: 4,
    rows: 4,
    cells: [
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
    ],
  },
  hold40: {
    cols: 4,
    rows: 4,
    cells: [
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
      { existed: true, isReefer: false, is45Foot: false },
    ],
  },
}

export interface Cell {
  existed: boolean;
  isReefer: boolean;
  is45Foot: boolean;
}

export interface OnDeckFore {
  rows: number;
  cols: number;
  cells: Cell[];
}

export enum VesselHatchType {
  Hatch = 1,
  Bridge = 2,
  Engine = 3,
  Crane = 4,
  Blank = 5,
}

export interface OnDeckAfter {
  rows: number;
  cols: number;
  cells: Cell[];
}

export interface OnDeck40 {
  rows: number;
  cols: number;
  cells: Cell[];
}

export interface HoldFore {
  rows: number;
  cols: number;
  cells: Cell[];
}

export interface HoldAfter {
  rows: number;
  cols: number;
  cells: Cell[];
}

export interface Hold40 {
  rows: number;
  cols: number;
  cells: Cell[];
}

export interface VesselProfileHatch {
  id: number;
  vesselHatchType: number;
  sequence: number;
  minHoldTiers: number;
  maxHoldTiers: number;
  holdRows: number;
  minDeckTiers: number;
  maxDeckTiers: number;
  deckRows: number;
  hasBayFore: boolean;
  hasBayAfter: boolean;
  hasBay40: boolean;
  bayFore: number;
  bayAfter: number;
  bay40: number;
  onDeckFore: OnDeckFore;
  onDeckAfter: OnDeckAfter;
  onDeck40: OnDeck40;
  holdFore: HoldFore;
  holdAfter: HoldAfter;
  hold40: Hold40;
}

export interface VesselProfileData {
  vesselProfileId: number;
  vesselProfileName: string;
  vesselProfileHatches: VesselProfileHatch[];
}

export interface Message {
  messageText: string;
  messageType: number;
}

export interface VesselProfileResponse {
  data: VesselProfileData;
  isSuccessful: boolean;
  tag?: any;
  message: Message[];
}

type State = {
  isLoading: boolean;
  vesselProfile: VesselProfileData;
  vesselProfileHatches: VesselProfileHatch[]
  selectedHatchIndex: number;
  selectedHatchData: VesselProfileHatch;
  vesselProfileId: number;
  mirroredBays: {
    "Fore": boolean,
    "40": boolean
    "After": boolean
  };
  vesselProfileList: VesselProfileHatch[];
  message: Message[];
  errors: Error[];
  totalItems: number;
};

const initialVesselProfile: VesselProfileData = {
  vesselProfileId: 0,
  vesselProfileName: "Default Name",
  vesselProfileHatches: [
    {
      id: 0,
      vesselHatchType: 1,
      sequence: 1,
      minHoldTiers: 4,
      maxHoldTiers: 4,
      holdRows: 4,
      minDeckTiers: 12,
      maxDeckTiers: 88,
      deckRows: 10,
      hasBayFore: false,
      hasBayAfter: false,
      hasBay40: false,
      bayFore: 1,
      bayAfter: 2,
      bay40: 3,
      onDeckFore: {
        cols: 4,
        rows: 4,
        cells: [{ existed: true, isReefer: true, is45Foot: false }],
      },
      onDeckAfter: {
        cols: 4,
        rows: 4,
        cells: [{ existed: true, isReefer: true, is45Foot: false }],
      },
      onDeck40: {
        cols: 4,
        rows: 4,
        cells: [{ existed: true, isReefer: true, is45Foot: false }],
      },
      holdFore: {
        cols: 4,
        rows: 4,
        cells: [{ existed: true, isReefer: true, is45Foot: false }],
      },
      holdAfter: {
        cols: 4,
        rows: 4,
        cells: [{ existed: true, isReefer: true, is45Foot: false }],
      },
      hold40: {
        cols: 4,
        rows: 4,
        cells: [{ existed: true, isReefer: true, is45Foot: false }],
      },
    },
  ],
};

const state: State = {
  isLoading: false,
  vesselProfile: initialVesselProfile,
  selectedHatchData: initialVesselProfile.vesselProfileHatches[0],
  vesselProfileHatches: initialVesselProfile.vesselProfileHatches,
  selectedHatchIndex: 0,
  vesselProfileId: 0,
  errors: [],
  mirroredBays: {
    Fore: false,
    "40": false,
    After: false,
  },
  totalItems: 0,
  vesselProfileList: [],
  message: [],
};

const getters = {
  getIsLoading(state: State) {
    return state.isLoading
  },
  getSelectedHatchData(state: State) {
    
    return state.selectedHatchData
  },
  getVesselProfileHatches(state: State) {
    
    return state.vesselProfileHatches
  },
  getVesselProfileList(state: State) {
    return state.totalItems;
  },
  getVesselProfile(state: State) {
    
    return state.vesselProfile;
  },
  getSelectedVesselProfile(state: State) {
    return state.selectedHatchIndex;
  },
  getSelectedHatchIndex(state: State) {
    return state.selectedHatchIndex;
  },
};

const actions: ActionTree<any, any> = {
  setIsLoading(context, payload) {
    context.commit('mutateIsLoading', payload)
  },
  [DELETE_VESSEL_HATCH](context, payload) {
    const id = payload.id
    context.commit(DELETE_VESSEL_HATCH_MUTATION, id)
  },
  [ADD_VESSEL_HATCH](context, payload) {
    const position = payload.position

    if(position === "right") {
      context.commit(ADD_VESSEL_HATCH_TO_RIGHT_MUTATION)
    } else {
      context.commit(ADD_VESSEL_HATCH_TO_LEFT_MUTATION)
    }
  },
  postVesselProfile({state, commit, dispatch}: {state: State, commit: any, dispatch: any}, body) {
    return new Promise(resolve => {
      ApiService.setHeader();
      if (!isBaySelectionValid(state.selectedHatchData)) {
        return
      }
      commit('mutateIsLoading', true)
      const response = ApiService.post("/system/vesselprofile/updatehatchdesign", state.vesselProfile)
      .then((data) => {
        if (data.data.isSuccessful) {
          Vue.$toast.open({
            message: data.data.message[0].messageText,
            type: "success",
            position: "top",
          });
          dispatch(FETCH_VESSEL_PROFILE)
        } else {
          commit('mutateIsLoading', false)

          Vue.$toast.open({
            message: data.data.message[0].messageText,
            type: "error",
            position: "top",
          });
        }
        return response 
      })
        .finally(() => {
          commit('mutateIsLoading', false)
        })
    });
  },
  setMirroredBays(context, payload) {
    context.commit('setMirroredBaysMutation', payload)
  },

  toggleCellProperty({ commit, state }: { commit: any, state: State }, { hatchIndex, deckPosition, bayType, cellIndex, property, currentValue }: { hatchIndex: number, deckPosition: string, bayType: string, cellIndex: number, property: string, currentValue: any }) {


    // if the clicked bay isn't mirrored only apply changed on itself
    if (!state.mirroredBays[bayType]) {
      commit(TOGGLE_CELL_PROPERTIES, { hatchIndex, deckPosition, bayType: bayType, cellIndex, property, value: !currentValue });
      return
    }
    
    for (const key in state.mirroredBays) {
      const currentBayType = key
      const isCurrentBayMirrored = state.mirroredBays[key]
    
      if (isCurrentBayMirrored){
        commit(TOGGLE_CELL_PROPERTIES, { hatchIndex, deckPosition, bayType: currentBayType, cellIndex, property, value: !currentValue });
      }
    }
    // commit(TOGGLE_CELL_PROPERTIES, { hatchIndex, deckType, cellIndex, property });
    // commit(TOGGLE_CELL_PROPERTIES, { hatchIndex, deckType: deckType, cellIndex, property });
    // TODO set selected hatch data with new changes
  },
  
  setSelectedHatchData(context, payload) {
    
    context.commit("mutateSelectedHatchData", payload);
  },
  setSelectedHatchCells(context, payload) {
    context.commit("mutateSelectedHatchData", payload);
  },
  [FETCH_VESSEL_PROFILE]: async (
    context,
    payload
  ): Promise<VesselProfileResponse> => {
    if(payload) {
      context.commit('setVesselProfileId', payload)
    } 
    return new Promise((resolve, body) => {
      ApiService.setHeader();
      context.commit('mutateIsLoading', true)
      ApiService.post("/system/vesselprofile/gethatchdesignupdate", {
        vesselProfileId: context.state.vesselProfileId ? context.state.vesselProfileId : payload,
      })
        .then(({ data }) => {

          if (data.isSuccessful) {
            context.commit(SET_VESSEL_PROFILE, data);
          }

          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VESSEL_PROFILE_ERROR, response.data.errors);
        })
        .finally(() => {
          context.commit('mutateIsLoading', false)
        })
    });
  },
  [SET_SELECTED_HATCH_INDEX]: ({commit, state} : {commit: any, state: State}, payload) => {
    // commit('updateVesselProfile')
    const { index } = payload;



    if(!isBaySelectionValid(state.selectedHatchData)) {
      return
    }
    
    
    commit(MUTATE_SELECTED_HATCH_INDEX, index)
    // commit('mutateSelectedHatchData', state.vesselProfile.vesselProfileHatches[index]) 
    
  },

  [UPDATE_VESSEL_PROFILE]: async (
    context,
    payload
  ): Promise<VesselProfileResponse> => {
    return new Promise((resolve, body) => {
      ApiService.setHeader();
      ApiService.post("/system/vesselprofile/gethatchdesignupdate", {
        vesselProfileId: payload,
      })
        .then(({ data }) => {
          if (data.isSuccessful){
            context.commit(SET_VESSEL_PROFILE, data);
          }

          resolve(data);
        })
        .catch(({ response }) => {
          context.commit(SET_VESSEL_PROFILE_ERROR, response.data.errors);
        });
    });
  },
};

const mutations = {
  mutateIsLoading(state: State, payload) {
    state.isLoading = payload
  },
  setMirroredBaysMutation(state: State, payload) {
    state.mirroredBays = {
      ...state.mirroredBays,
      ...payload
    }
  },
  setVesselProfileId(state: State, payload) {
    state.vesselProfileId = payload
  },
  [TOGGLE_CELL_PROPERTIES](state: State, { hatchIndex, deckPosition, bayType, cellIndex, property, value }: { hatchIndex: number, deckPosition: string, bayType: string, cellIndex: number, property: string, value: boolean }) {
    
    const cell = state.vesselProfile.vesselProfileHatches[hatchIndex][deckPosition + bayType].cells[cellIndex];
    cell[property] = value;
    if (property === 'isReefer') {
      cell.is45Foot = false
    } else if (property === 'is45Foot') {
      cell.isReefer = false
    }
  },
  mutateSelectedHatchData(state: State, payload) {
    
    const [key, value] = Object.entries(payload)[0]
    if(key === 'hasBayFore' && value === false) {
      if(state.selectedHatchData.hasBayFore && state.selectedHatchData.hasBayAfter) {
        state.selectedHatchData.hasBayAfter = false
      }
    }

    if(key === 'hasBayAfter' && value === true) {
      if(state.selectedHatchData.hasBay40 && state.selectedHatchData.hasBayAfter === false && state.selectedHatchData.hasBayFore === false) {
        state.selectedHatchData.hasBayFore = true
      }
    }

    if(key === 'hasBayAfter' && value === true) {
      if(state.selectedHatchData.hasBay40 === false && state.selectedHatchData.hasBayAfter === false && state.selectedHatchData.hasBayFore === false) {
        state.selectedHatchData.hasBayFore = true
      }
    }
    
    state.selectedHatchData = {...state.selectedHatchData, ...payload}
    state.vesselProfileHatches[state.selectedHatchIndex] = {...state.vesselProfileHatches[state.selectedHatchIndex], ...payload}
    state.vesselProfile.vesselProfileHatches[state.selectedHatchIndex] = {...state.vesselProfile.vesselProfileHatches[state.selectedHatchIndex], ...payload}

    let reorderedProfileHatches = reorderLabels(state.vesselProfile.vesselProfileHatches)
    state.vesselProfile.vesselProfileHatches = reorderedProfileHatches
    state.vesselProfileHatches = reorderedProfileHatches

    state.selectedHatchData = reorderedProfileHatches[state.selectedHatchIndex]
    
  },
  mutateSelectedHatchCells(state: State, payload) {
    state.selectedHatchData = {...state.selectedHatchData, ...payload}
    state.vesselProfileHatches[state.selectedHatchIndex] = {...state.vesselProfileHatches[state.selectedHatchIndex], ...payload}
    state.vesselProfile.vesselProfileHatches[state.selectedHatchIndex] = {...state.vesselProfile.vesselProfileHatches[state.selectedHatchIndex], ...payload}
  },

  [SET_VESSEL_PROFILE_ERROR](state: State, error) {
    state.errors = error;
  },
  [SET_VESSEL_PROFILE](state, apiResult: VesselProfileResponse) {
    state.apiResult = apiResult;
    if (apiResult.isSuccessful) {
      state.vesselProfile = apiResult.data;
      state.vesselProfileHatches = apiResult.data.vesselProfileHatches;
      state.selectedHatchData =
        apiResult.data.vesselProfileHatches[state.selectedHatchIndex];
      state.errors = [];
    } else {
      state.totalItems = 0;
      state.errors = apiResult.message;
    }
  },
  [MUTATE_SELECTED_HATCH_INDEX](state, givenId) {
    // call updateVesselProfile mutation here
    state.selectedHatchIndex = givenId;
    // state.selectedHatchData = state.vesselProfile[givenId]
    state.selectedHatchData = state.vesselProfile.vesselProfileHatches[givenId];
  },
  [SET_VESSELPROFILELIST](state, apiResult) {
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
  },
  [UPDATE_HATCH](state, newData) {
    const { id, hatchData } = newData;
    const index = state.vesselProfile.vesselProfileHatches.findIndex(
      (hatch) => hatch.id === id
    );
    if (index !== -1) {
      state.vesselProfile.vesselProfileHatches.splice(index, 1, hatchData);
    }
  },
  updateVesselProfile(state) {
    state.vesselProfile.vesselProfileHatches[state.selectedHatchIndex] = {
      ...state.selectedHatchData,
    };
  },
  [DELETE_VESSEL_HATCH_MUTATION](state){
    state.vesselProfile.vesselProfileHatches = state.vesselProfile.vesselProfileHatches.filter((h, index) => {
      return index !== state.selectedHatchIndex
    })
    let reorderedProfileHatches = reorderLabels(state.vesselProfile.vesselProfileHatches)
    state.vesselProfile.vesselProfileHatches = reorderedProfileHatches
    state.vesselProfileHatches = reorderedProfileHatches
  },
  [ADD_VESSEL_HATCH_TO_RIGHT_MUTATION](state, vesselHatchData){
    // FIXME
    const selectedIndex = state.selectedHatchIndex
    
    let selectedHatchData = state.selectedHatchData 
    let sampleBay =
      selectedHatchData.onDeckFore ||
      selectedHatchData.onDeck40 ||
      selectedHatchData.onDeckAfter ||
      selectedHatchData.holdFore ||
      selectedHatchData.hold40 ||
      selectedHatchData.holdAfter;  

    let cells = sampleBay.cells
    let cols = sampleBay.cols
    let rows = sampleBay.rows
    
    const newCells = cells.map(c => ({ existed: true, is45Foot: false, isReefer: false}))    

    const newDeck = {cells: newCells, rows: rows, cols: cols}

    const newHatchData = {
      ...selectedHatchData,
      onDeckFore: newDeck,
      onDeck40: newDeck,
      onDeckAfter: newDeck,
      holdFore: newDeck,
      hold40: newDeck,
      holdAfter: newDeck,
      bayFore: selectedHatchData.bayFore + 1,
      bay40: selectedHatchData.bay40 + 1,
      bayAfter: selectedHatchData.bayAfter + 1,
    };
      
      
    state.vesselProfile.vesselProfileHatches.splice(selectedIndex + 1, 0, newHatchData)

    let reorderedProfileHatches = reorderLabels(state.vesselProfile.vesselProfileHatches)
    state.vesselProfile.vesselProfileHatches = reorderedProfileHatches
    state.vesselProfileHatches = reorderedProfileHatches
  },
  [ADD_VESSEL_HATCH_TO_LEFT_MUTATION](state: State, vesselHatchData){
    // FIXME
    const selectedIndex = state.selectedHatchIndex
    const placeToPut = selectedIndex

    let selectedHatchData = state.selectedHatchData 
    let sampleBay =
      selectedHatchData.onDeckFore ||
      selectedHatchData.onDeck40 ||
      selectedHatchData.onDeckAfter ||
      selectedHatchData.holdFore ||
      selectedHatchData.hold40 ||
      selectedHatchData.holdAfter;  

    let cells = sampleBay.cells
    let cols = sampleBay.cols
    let rows = sampleBay.rows

    const newCells = cells.map(c => ({ existed: true, is45Foot: false, isReefer: false}))    

    const newDeck = {cells: newCells, rows: rows, cols: cols}

    const newHatchData = {
      ...selectedHatchData,
      onDeckFore: newDeck,
      onDeck40: newDeck,
      onDeckAfter: newDeck,
      holdFore: newDeck,
      hold40: newDeck,
      holdAfter: newDeck,
    };

    state.vesselProfile.vesselProfileHatches.splice(placeToPut, 0, newHatchData)

    let reorderedProfileHatches = reorderLabels(state.vesselProfile.vesselProfileHatches)
    state.vesselProfile.vesselProfileHatches = reorderedProfileHatches
    state.vesselProfileHatches = reorderedProfileHatches
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
