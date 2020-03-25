import * as types from "./types";
import createReducer from "../../utils/createReducer";
import { REJECTED } from "../../../utilities/constants/globalconstants";

const initialState = {
    current: null,
    loading: false,
    searchLoading: false,
    loaded: false,
    error: null,
    patient: [],
    patients: [],
    patientType: [],
    searchPatients: [],
};

const patientReducer = createReducer(initialState)({

    [types.SET_SEARCH_PROJECT]: (state, { payload }) => ({
        ...state,
        current: payload,
        searchLoading: true,
        error: null
    }),

    [types.ACTIVE_PATIENT]: (state, { payload }) => (() => {
        console.log("payload", payload)
    }),

    [types.GET_ALL_PATIENT + REJECTED]: (state, { payload }) => ({
        ...state,
        loading: false,
        searchLoading: false,
        error: payload
    }),
    [types.CREATE_PATIENT]: (state, { payload }) => ({
        ...state,
        loading: false,
        searchLoading: false,
        patient: payload
    }),

    [types.GET_ALL_PATIENT]: (state, { payload }) => ({
        ...state,
        loading: false,
        searchLoading: false,
        patients: payload
    }),
    [types.DELETE_PATIENT]: (state, { payload }) => ({
        ...state,
        loading: false,
        searchLoading: false,
        patient: payload
    }),
    [types.SEARCH_PATIENT]: (state, { payload }) => ({
        ...state,
        loading: false,
        searchLoading: false,
        searchPatients: payload
    }),


})

export default patientReducer
