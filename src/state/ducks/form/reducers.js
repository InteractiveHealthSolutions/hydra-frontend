import * as types from "./types";
import createReducer from "../../utils/createReducer";
import { REJECTED } from "../../../utilities/constants/globalconstants";

const initialState = {
    current: null,
    loading: false,
    loaded: false,
    error: null,
    form: {},
    forms: [],
    componentForms: [],
    formbyuuid: {},
    componentFormRelations: [],
    componentFormRelation: {},
    formSubmission:{}
};

const formReducer = createReducer(initialState)({

    [types.SET_PROJECT]: (state, { payload }) => ({
        ...state,
        current: payload,
        loading: true,
        error: null
    }),
    [types.CREATE_FORM]: (state, { payload }) => ({
        ...state,
        loading: false,
        form: payload
    }),

    [types.GET_ALL_FORM]: (state, { payload }) => ({
        ...state,
        loading: false,
        forms: payload
    }),
    [types.SEARCH_FORM]: (state, { payload }) => ({
        ...state,
        loading: false,
        componentForms: payload
    }),
    [types.CREATE_COMPONENT_FORM_RELATION]: (state, { payload }) => ({
        ...state,
        loading: false,
        componentFormRelation: payload
    }),
    [types.GET_COMPONENT_FORM_RELATION]: (state, { payload }) => ({
        ...state,
        loading: false,
        componentFormRelations: payload
    })
    ,
    [types.GET_FORM_BY_UUID]: (state, { payload }) => ({
        ...state,
        loading: false,
        formbyuuid: payload
    }),
    [types.DELETE_COMPONENT_FORM_RELATION]: (state, { payload }) => ({
        ...state,
        loading: false,
        componentFormRelation: payload
    }),
    [types.FORM_SUBMISSION]: (state, { payload }) => ({
        ...state,
        loading: false,
        formSubmission: payload
    })


})

export default formReducer
