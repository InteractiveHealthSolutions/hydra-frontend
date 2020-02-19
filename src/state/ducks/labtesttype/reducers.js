import * as types from "./types";
import createReducer from "../../utils/createReducer";
import { REJECTED } from "../../../utilities/constants/globalconstants";

const initialState = {
    current: null,
    loading: false,
    loaded: false,
    error: null,
    labtestType: [],

};

const labtestReducer = createReducer(initialState)({

    [types.GET_ALL_LAB_TEST_TYPE]: (state, { payload }) => ({
        ...state,
        loading: false,
        labtestType: payload
    }),


})

export default labtestReducer
