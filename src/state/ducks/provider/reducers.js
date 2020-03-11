import * as types from "./types";
import createReducer from "../../utils/createReducer";
const initialState = {
  provider : {}
};

const providerReducer = createReducer(initialState)({

    [types.CREATE_PROVIDER]: (state, { payload }) => ({
        ...state,
        provider: payload
    }),
    [types.GET_PROVIDER_BY_USER]: (state, { payload }) => ({
        ...state,
        provider: payload
    }),
    [types.DELETE_PROVIDER]: (state, { payload }) => ({
        ...state
    })
})
export default providerReducer

