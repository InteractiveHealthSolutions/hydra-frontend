import * as types from "./types";
import createReducer from "../../utils/createReducer";
import { REJECTED } from "../../../utilities/constants/globalconstants";

const initialState = {
    current: null,
    loading: false,
    loaded: false,
    error: null,
    workforce: [],
    workforces:[],
    salaryType:[],
};

const workforceReducer = createReducer(initialState)({
    
    [types.SET_PROJECT]: (state, { payload }) => ({
        ...state,
        current: payload,
        loading: true,
        error: null
    }),

    [types.GET_ALL_WORKFORCE + REJECTED]: (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload
    }),
    [types.CREATE_WORKFORCE]: (state, { payload }) => ({
        ...state,
        loading: false,
        workforce: payload
    }),

    [types.GET_ALL_WORKFORCE]: (state, { payload }) => ({
        ...state,
        loading: false,
        workforces: payload
    }),
    [types.DELETE_WORKFORCE]: (state, { payload }) => ({
        ...state,
        loading: false,
        workforce: payload
    }),
    [types.GET_WORKFORCE_SALARY_TYPE]: (state, { payload }) => ({
        ...state,
        loading: false,
        salaryType: payload
    }),
    [types.GET_PARTICIPANT_BY_USER]: (state, { payload }) => ({
        ...state,
        loading: false,
        workforce: payload
    })
})

export default workforceReducer
