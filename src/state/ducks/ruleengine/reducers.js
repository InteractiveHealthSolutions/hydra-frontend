import * as types from "./types";
import createReducer from "../../utils/createReducer";

const initialState = {
    current: null,
    loading: false,
    loaded: false,
    error: null,
    rules: [],
    rule: {}
};
const ruleengineReducer = createReducer(initialState)({
    [types.SET_PROJECT]: (state, { payload }) => ({
        ...state,
        current: payload,
        loading: true,
        error: null
    }),
    [types.CREATE_FIELD_RULE]: (state, { payload }) => ({
        ...state,
        loading: false,
        rule: payload
    }),
    [types.GET_FIELD_RULE]: (state, { payload }) => ({
        ...state,
        loading: false,
        rules: payload
    }),



})

export default ruleengineReducer