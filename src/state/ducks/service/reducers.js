import * as types from "./types";
import createReducer from "../../utils/createReducer";
import { REJECTED } from "../../../utilities/constants/globalconstants";

const initialState = {
    current: null,
    loading: false,
    loaded: false,
    error: null,
    service: [],
    services: [],
    serviceType: [],
};

const serviceReducer = createReducer(initialState)({

    [types.SET_PROJECT]: (state, { payload }) => ({
        ...state,
        current: payload,
        loading: true,
        error: null
    }),

    [types.ACTIVE_SERVICE]: (state, { payload }) => (() => {
        console.log("payload", payload)
    }),

    [types.GET_ALL_SERVICE + REJECTED]: (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload
    }),
    [types.CREATE_SERVICE]: (state, { payload }) => ({
        ...state,
        loading: false,
        service: payload
    }),

    [types.GET_ALL_SERVICE]: (state, { payload }) => ({
        ...state,
        loading: false,
        services: payload
    }),
    [types.DELETE_SERVICE]: (state, { payload }) => ({
        ...state,
        loading: false,
        service: payload
    }),
    //service type

    [types.GET_ALL_SERVICE_TYPE]: (state, { payload }) => ({
        ...state,
        loading: false,
        serviceType: payload
    }),
    [types.CREATE_SERVICE_TYPE]: (state, { payload }) => ({
        ...state,
        loading: false,
        serviceType: payload
    }),

})

export default serviceReducer
