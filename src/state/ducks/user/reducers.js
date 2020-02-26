import * as types from "./types";
import createReducer from "../../utils/createReducer";
const initialState = {
    current: null,
    loading: false,
    loaded: false,
    error: null,
    user: {},
    users: []
};

const userReducer = createReducer(initialState)({

    [types.SET_PROJECT]: (state, { payload }) => ({
        ...state,
        current: payload,
        loading: true,
        error: null
    }),
    [types.SEARCH_USER]: (state, { payload }) => ({
        ...state,
        loading: false,
        users: payload
    }),
    [types.GET_ALL_USER]: (state, { payload }) => ({
        ...state,
        loading: false,
        users: payload
    }),
    [types.CREATE_USER]: (state, { payload }) => ({
        ...state,
        loading: false,
        user: payload
    }),
    [types.UPDATE_USER]: (state, { payload }) => ({
        ...state,
        loading: false,
        user: payload
    }),
    [types.DELETE_USER]: (state, { payload }) => ({
        ...state,
        loading: false,
        users: payload
    })
})
export default userReducer

