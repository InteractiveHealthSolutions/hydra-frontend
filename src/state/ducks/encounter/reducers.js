import * as types from "./types";
import createReducer from "../../utils/createReducer";
import { REJECTED } from "../../../utilities/constants/globalconstants";

const initialState = {
    current: null,
    loading: false,
    loaded: false,
    error: null,
    encounter: [],
    encounters: [],
    encounterType: [],
    searchEncounterType:{},
    activeencounter: {},
};

const encounterReducer = createReducer(initialState)({

    [types.SET_PROJECT]: (state, { payload }) => ({
        ...state,
        current: payload,
        loading: true,
        error: null
    }),

    [types.ACTIVE_ENCOUNTER]: (state, { payload }) => ({
        ...state,
        loading: false,
        activeencounter: payload,

    }),

    [types.GET_ALL_ENCOUNTER + REJECTED]: (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload
    }),
    [types.CREATE_ENCOUNTER]: (state, { payload }) => ({
        ...state,
        loading: false,
        encounter: payload
    }),

    [types.GET_ALL_ENCOUNTER]: (state, { payload }) => ({
        ...state,
        loading: false,
        encounters: payload
    }),
    [types.DELETE_ENCOUNTER]: (state, { payload }) => ({
        ...state,
        loading: false,
        encounter: payload
    }),

    [types.CREATE_ENCOUNTER_TYPE]: (state, { payload }) => ({
        ...state,
        loading: false,
        encounterType: payload,
    }),

    [types.GET_ALL_ENCOUNTER_TYPE]: (state, { payload }) => ({
        ...state,
        loading: false,
        encounterType: payload
    }),
    [types.SEARCH_ENCOUNTER_TYPE]: (state, { payload }) => ({
        ...state,
        loading: false,
        searchEncounterType: payload
    }),

})

export default encounterReducer
