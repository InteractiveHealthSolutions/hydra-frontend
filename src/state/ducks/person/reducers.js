import * as types from "./types";
import createReducer from "../../utils/createReducer";
import { REJECTED } from "../../../utilities/constants/globalconstants";

const initialState = {
    current: null,
    loading: false,
    loaded: false,
    error: null,
    person: [],
    persons: []
};

const personReducer = createReducer(initialState)({

    [types.CREATE_PERSON]: (state, { payload }) => ({
        ...state,
        loading: false,
        person: payload
    }),

    [types.GET_ALL_PERSON]: (state, { payload }) => ({
        ...state,
        loading: false,
        persons: payload
    })

})

export default personReducer
