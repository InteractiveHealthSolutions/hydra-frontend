import * as types from "./types";
import createReducer from "../../utils/createReducer";
import { REJECTED } from "../../../utilities/constants/globalconstants";

const initialState = {
    current: null,
    loading: false,
    loaded: false,
    error: null,
    patient: [],
    patients: [],
    patientType: [],
};

const patientReducer = createReducer(initialState)({

    [types.SET_PROJECT]: (state, { payload }) => ({
        ...state,
        current: payload,
        loading: true,
        error: null
    }),

    [types.ACTIVE_PATIENT]: (state, { payload }) => (() => {
        console.log("payload", payload)
    }),

    [types.GET_ALL_PATIENT + REJECTED]: (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload
    }),
    [types.CREATE_PATIENT]: (state, { payload }) => ({
        ...state,
        loading: false,
        patient: payload
    }),

    [types.GET_ALL_PATIENT]: (state, { payload }) => ({
        ...state,
        loading: false,
        patients: payload
    }),
    [types.DELETE_PATIENT]: (state, { payload }) => ({
        ...state,
        loading: false,
        patient: payload
    }),


})

export default patientReducer
