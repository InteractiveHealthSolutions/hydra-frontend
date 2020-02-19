import * as types from "./types";
import createReducer from "../../utils/createReducer";
import { REJECTED } from "../../../utilities/constants/globalconstants";

const initialState = {
    current: null,
    loading: false,
    loaded: false,
    error: null,
    event: [],
    events: [],
    eventType: [],
    activeEvent: {},
};

const eventReducer = createReducer(initialState)({

    [types.SET_PROJECT]: (state, { payload }) => ({
        ...state,
        current: payload,
        loading: true,
        error: null
    }),

    [types.ACTIVE_EVENT]: (state, { payload }) => ({
        ...state,
        loading: false,
        activeEvent: payload,

    }),

    [types.GET_ALL_EVENT + REJECTED]: (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload
    }),
    [types.CREATE_EVENT]: (state, { payload }) => ({
        ...state,
        loading: false,
        event: payload
    }),

    [types.GET_ALL_EVENT]: (state, { payload }) => ({
        ...state,
        loading: false,
        events: payload
    }),
    [types.DELETE_EVENT]: (state, { payload }) => ({
        ...state,
        loading: false,
        event: payload
    }),

    [types.CREATE_EVENT_TYPE]: (state, { payload }) => ({
        ...state,
        loading: false,
        eventType: payload,
    }),

    [types.GET_ALL_EVENT_TYPE]: (state, { payload }) => ({
        ...state,
        loading: false,
        eventType: payload
    }),


})

export default eventReducer
