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
    componentFormsList: [],
    formbyuuid: {},
    componentFormRelations: [],
    componentFormRelation: {},
    formSubmission: {},
    formFields: [],
    formField: []
};

const formReducer = createReducer(initialState)({

    [types.SET_PROJECT]: (state, { payload }) => ({
        ...state,
        current: payload,
        loading: true,
        error: null
    }),
    [types.GET_ALL_FORM + REJECTED]: (state, { payload }) => ({
        ...state,
        loading: false,
        searchLoading: false,
        error: payload
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
    }),
    [types.GET_COMPONENT_FORM_BY_COMPONENT]: (state, { payload }) => ({
        ...state,
        loading: false,
        componentFormsList: payload
    }),
    [types.GET_FORM_FIELDS_BY_FORM]: (state, { payload }) => ({
        ...state,
        loading: false,
        formFields: payload
    }),
    [types.GET_FORM_FIELD_BY_UUID]: (state, { payload }) => ({
        ...state,
        loading: false,
        formField: payload

    })
})

export default formReducer
