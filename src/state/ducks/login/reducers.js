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
        submitted:false,
        error: null
    }),


    [types.LOGIN_SUCCESS]: (state, { payload }) => ({
        ...state,
        loggedIn: true,
        user: payload,
        authorized: true,
        submitted:true
    }),

    [types.LOGOUT]: (state, { payload }) => ({
        ...state,
        loggedIn: false,
        authorized: false,
        submitted:false,
    }),
    [types.LOGIN_FAILURE]: (state, { payload }) => ({
        ...state,
        loggedIn: false,
        payload,
        authorized: false,
        submitted:true
    }),
})

export default userReducer
