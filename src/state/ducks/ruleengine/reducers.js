import * as types from "./types";
import createReducer from "../../utils/createReducer";

const initialState = {
    current: null,
    loading: false,
    loaded: false,
    error: null,
    phaseComponents: [],
    workflows: [],
    workflowPhases: {},
};
const ruleengineReducer = createReducer(initialState)({

    [types.GET_ALL_PHASE]: (state, { payload }) => ({
        ...state,
        loading: false,
        workflowPhases: payload
    }),
    [types.GET_ALL_WORKFLOW]: (state, { payload }) => ({
        ...state,
        loading: false,
        workflows: payload
    }),
    [types.GET_ALL_WORKFLOW]: (state, { payload }) => ({
        ...state,
        loading: false,
        workflows: payload
    }),
    [types.GET_ALL_STAGE]: (state, { payload }) => ({
        ...state,
        loading: false,
        phaseComponents: payload
    }),


})

export default ruleengineReducer