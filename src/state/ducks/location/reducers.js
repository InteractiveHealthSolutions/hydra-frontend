import * as types from "./types";
import createReducer from "../../utils/createReducer";
import { REJECTED } from "../../../utilities/constants/globalconstants";

const initialState = {
    current: null,
    loading: false,
    loaded: false,
    error: null,
    location: [],
    Locations: [],
    locationtag: [],
    childLocations: [],
    locationsForATag: [],
    locationError : false,
    locationTypes : [],
    locationType : {}
};

const locationReducer = createReducer(initialState)({

    [types.SET_PROJECT]: (state, { payload }) => ({
        ...state,
        current: payload,
        loading: true,
        error: null
    }),

    [types.ACTIVE_LOCATION]: (state, { payload }) => (() => {
        console.log("payload", payload)
    }),

    [types.GET_ALL_LOCATION + REJECTED]: (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload
    }),
    [types.CREATE_LOCATION]: (state, { payload }) => ({
        ...state,
        loading: false,
        location: payload
    }),
    [types.UPDATE_LOCATION]: (state, { payload }) => ({
        ...state,
        loading: false,
        location: payload
    }),

    [types.GET_ALL_LOCATION]: (state, { payload }) => ({
        ...state,
        loading: false,
        locations: payload
    }),
    [types.DELETE_LOCATION]: (state, { payload }) => ({
        ...state,
        loading: false,
        location: payload
    }),
    [types.GET_ALL_LOCATION_TAG]: (state, { payload }) => ({
        ...state,
        loading: false,
        locationtag: payload
    }),
    [types.GET_LOCATION_BY_TAG]: (state, {payload}) => ({
        ...state,
        loading: false,
        locationsForATag: payload
    }),
    [types.GET_CHILD_LOCATIONS]: (state, {payload}) => ({
        ...state,
        loading: false,
        childLocations: payload
    }),
    [types.SET_ERROR] : (state) => ({
        
        ...state,
        locationError : true
    }),
    [types.UNSET_ERROR] : (state) => ({
        
        ...state,
        locationError : false
    }),
    [types.GET_ALL_LOCATION_TYPES] : (state,payload) => ({
        ...state,
        locationTypes : payload,
        loading : false
    }),
    [types.POST_LOCATION_TYPES] : (state, payload) => ({
        ...state,
        locationType : payload, 
        loading : false
    })

})

export default locationReducer
