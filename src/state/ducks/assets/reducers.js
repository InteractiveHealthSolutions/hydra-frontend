import * as types from "./types";
import createReducer from "../../utils/createReducer";
import { REJECTED } from "../../../utilities/constants/globalconstants";

const initialState = {
    current: null,
    loading: false,
    loaded: false,
    error: null,
    asset: [],
    assets: [],
    assetType: [],
    assetCategory: []
};

const assetReducer = createReducer(initialState)({

    [types.SET_PROJECT]: (state, { payload }) => ({
        ...state,
        current: payload,
        loading: true,
        error: null
    }),

    [types.ACTIVE_ASSET]: (state, { payload }) => (() => {
        console.log("payload", payload)
    }),

    [types.GET_ALL_ASSET + REJECTED]: (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload
    }),
    [types.CREATE_ASSET]: (state, { payload }) => ({
        ...state,
        loading: false,
        asset: payload
    }),

    [types.GET_ALL_ASSET]: (state, { payload }) => ({
        ...state,
        loading: false,
        assets: payload
    }),
    [types.DELETE_ASSET]: (state, { payload }) => ({
        ...state,
        loading: false,
        asset: payload
    }),
    [types.CREATE_ASSET_TYPE]: (state, { payload }) => ({
        ...state,
        loading: false,
        assetType: payload
    }),

    [types.GET_ALL_ASSET_TYPE]: (state, { payload }) => ({
        ...state,
        loading: false,
        assetType: payload
    }),

    [types.CREATE_ASSET_CATEGORY]: (state, { payload }) => ({
        ...state,
        loading: false,
        assetCategory: payload
    }),
    [types.GET_ALL_ASSET_CATEGORY]: (state, { payload }) => ({
        ...state,
        loading: false,
        assetCategory: payload
    }),
})

export default assetReducer
