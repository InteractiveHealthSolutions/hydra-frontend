import * as types from "./types";
import createReducer from "../../utils/createReducer";

const initialState = {
    current: null,
    loading: false,
    loaded: false,
    error: null,
    visit: [],
    visits:[],
};

const visitReducer = createReducer(initialState)({
    [types.CREATE_VISIT]: (state, { payload }) => ({
        ...state,
        loading: false,
        visit: payload
    }),
    [types.GET_VISITS_FOR_A_PATIENT]: (state, { payload }) => ({
        ...state,
        loading: false,
        visit: payload
    }),
})

export default visitReducer
