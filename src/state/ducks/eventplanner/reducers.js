import * as types from "./types";
import createReducer from "../../utils/createReducer";
import { REJECTED } from "../../../utilities/constants/globalconstants";

const initialState = {
    current: null,
    loading: false,
    loaded: false,
    error: null,
    eventPlanner: [],
    eventPlanners: [],
};

const eventPlannerReducer = createReducer(initialState)({

    [types.SET_PROJECT]: (state, { payload }) => ({
        ...state,
        current: payload,
        loading: true,
        error: null
    }),

    [types.ACTIVE_EVENT_PLANNER]: (state, { payload }) => (() => {
        console.log("payload", payload)
    }),

    [types.GET_ALL_EVENT_PLANNER + REJECTED]: (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload
    }),
    [types.CREATE_EVENT_PLANNER]: (state, { payload }) => ({
        ...state,
        loading: false,
        eventPlanner: payload
    }),

    [types.GET_ALL_EVENT_PLANNER]: (state, { payload }) => ({
        ...state,
        loading: false,
        eventPlanners: payload
    }),
    [types.DELETE_EVENT_PLANNER]: (state, { payload }) => ({
        ...state,
        loading: false,
        eventPlanner: payload
    }),


})

export default eventPlannerReducer
