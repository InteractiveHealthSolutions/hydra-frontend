import * as types from "./types";
import createReducer from "../../utils/createReducer";
import { REJECTED } from "../../../utilities/constants/globalconstants";

const initialState = {
    current: null,
    loading: false,
    loaded: false,
    error: null,
    eventClosure: [],
    eventClosures: [],
};

const eventClosureReducer = createReducer(initialState)({

    [types.SET_PROJECT]: (state, { payload }) => ({
        ...state,
        current: payload,
        loading: true,
        error: null
    }),

    [types.ACTIVE_EVENT_CLOSURE]: (state, { payload }) => (() => {
        console.log("payload", payload)
    }),

    [types.GET_ALL_EVENT_CLOSURE + REJECTED]: (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload
    }),
    [types.CREATE_EVENT_CLOSURE]: (state, { payload }) => ({
        ...state,
        loading: false,
        eventClosure: payload
    }),

    [types.GET_ALL_EVENT_CLOSURE]: (state, { payload }) => ({
        ...state,
        loading: false,
        eventClosures: payload
    }),
    [types.DELETE_EVENT_CLOSURE]: (state, { payload }) => ({
        ...state,
        loading: false,
        eventClosure: payload
    }),


})

export default eventClosureReducer
