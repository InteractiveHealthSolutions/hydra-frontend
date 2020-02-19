import * as types from "./types";
import createReducer from "../../utils/createReducer";
import { REJECTED } from "../../../utilities/constants/globalconstants";

const initialState = {
    current: null,
    loading: false,
    loaded: false,
    error: null,
    question: {},
    questions: [],
    concepts: [],
    answer: {},
    concept: {},
    fields: [],
};

const questionReducer = createReducer(initialState)({

    [types.GET_ALL_QUESTION]: (state, { payload }) => ({
        ...state,
        loading: false,
        questions: payload
    }),
    [types.CREATE_QUESTION]: (state, { payload }) => ({
        ...state,
        loading: false,
        question: payload
    }),
    [types.SEARCH_CONCEPT]: (state, { payload }) => ({
        ...state,
        loading: false,
        concepts: payload
    }),
    [types.CREATE_ANSWER]: (state, { payload }) => ({
        ...state,
        loading: false,
        answer: payload
    }),
    [types.CREATE_CONCEPT]: (state, { payload }) => ({
        ...state,
        loading: false,
        concept: payload
    }),
    [types.SEARCH_FIELD]: (state, { payload }) => ({
        ...state,
        loading: false,
        fields: payload
    })

})

export default questionReducer
