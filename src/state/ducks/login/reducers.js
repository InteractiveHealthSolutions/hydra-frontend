import * as types from "./types";
import createReducer from "../../utils/createReducer";
import { REJECTED } from "../../../utilities/constants/globalconstants";

const initialState = {
    current: null,
    loggedIn: false,
    error: null,
    user: [],
    authorized: false,
    submitted: false,
};

const userReducer = createReducer(initialState)({

    [types.SET_PROJECT]: (state, { payload }) => ({
        ...state,
        current: payload,
        loading: true,
        submitted:true,
        error: null
    }),


    [types.LOGIN_SUCCESS]: (state, { payload }) => ({
        ...state,
        loggedIn: true,
        user: payload,
        submitted:true,
        authorized: true
    }),

    [types.LOGOUT]: (state, { payload }) => ({
        ...state,
        loggedIn: false,
        authorized: false,
        submitted:true,
    }),
    [types.LOGIN_FAILURE]: (state, { payload }) => ({
        ...state,
        loggedIn: false,
        payload,
        submitted:true,
        authorized: false
    }),
})

export default userReducer
