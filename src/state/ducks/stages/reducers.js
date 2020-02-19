import * as types from "./types";
import createReducer from "../../utils/createReducer";
import { REJECTED } from "../../../utilities/constants/globalconstants";

const initialState = {
    current: null,
    loading: false,
    loaded: false,
    error: null,
    component:{},
    components: [],
    phaseComponents:[],
    phaseComponent:{},
};

const componentReducer = createReducer(initialState)({
    [types.SET_PROJECT]: (state, { payload }) => ({
        ...state,
        current: payload,
        loading: true,
        error: null
    }),

    [types.ACTIVE_COMPONENT]: (state, { payload }) => ( () =>{
        console.log("payload",payload)
    }),
    [types.GET_ALL_COMPONENT + REJECTED]: (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload
    }),
    [types.CREATE_COMPONENT]: (state, { payload }) => ({
        ...state,
        loading: false,
        component: payload
    }),
    [types.GET_ALL_COMPONENT]: (state, { payload }) => ({
        ...state,
        loading: false,
        components: payload
    }),

  //Mapping reducers..
    [types.GET_ALL_PHASE_COMPONENT]: (state, { payload }) => ({
        ...state,
        loading: false,
        phaseComponents: payload
    }),
    [types.CREATE_PHASE_COMPONENT]: (state, { payload }) => ({
        ...state,
        loading: false,
        phaseComponent: payload
    }),
    [types.DELETE_PHASE_COMPONENT]: (state, { payload }) => ({
        ...state,
        loading: false,
        phaseComponent: payload
    }),

})

export default componentReducer
