import * as types from "./types";
import createReducer from "../../utils/createReducer";
import { REJECTED } from "../../../utilities/constants/globalconstants";

const initialState = {
    current: null,
    loading: false,
    loaded: false,
    error: null,
    phaseName: '',
    phaseuuId: '',
    phaseId: '',
    isCreated: false,
    allphase: [],
    allWorkPhase: [],
    workPhase: [],
    phase: {}
};

const phaseReducer = createReducer(initialState)({
    [types.SET_PROJECT]: (state, { payload }) => ({
        ...state,
        current: payload,
        loading: true,
        error: null
    }),

    [types.ACTIVE_PHASE]: (state, { payload }) => ({
        ...state
    }),
    [types.GET_ALL_PHASE + REJECTED]: (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload
    }),
    [types.CREATE_PHASE]: (state, { payload }) => ({
        ...state,
        loading: false,
        phase: payload
    }),
    [types.GET_ALL_PHASE]: (state, { payload }) => ({
        ...state,
        loading: false,
        allphase: payload
    }),
    [types.CREATE_WORKFLOW_PHASE]: (state, { payload }) => ({
        ...state,
        loading: false,
        workPhase: payload
    }),
    [types.GET_WORKFLOW_PHASE]: (state, { payload }) => ({
        ...state,
        loading: false,
        allWorkPhase: payload
    }),
    [types.DELETE_WORKFLOW_PHASE]: (state, { payload }) => ({
        ...state,
        loading: false,
        workPhase: payload
    }),
    [types.GET_WORKFLOW_PHASE_BY_WORKFLOW]: (state, { payload }) => ({
        ...state,
        loading: false,
        workPhase: payload
    })

})

export default phaseReducer

