import * as types from "./types";

const initialState = { phaseName: '', phaseuuId: '', phaseId: '' , isCreated: false};

const phaseReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.ACTIVE_PHASE:
            return {
                phaseName: action.phaseName,
                phaseuuId: action.uuid,
                phaseId: action.phaseId
            }
        case types.CREATE_PHASE:
            return {
                ...state,
                item: action.payload
            };
        case types.GET_ALL_PHASE:
            return {
                ...state,
                allphase: action.payload
            };
        case types.GET_WORKFLOW_PHASE:
            return {
                ...state,
                allWorkPhase: action.payload
            };
        case types.CREATE_WORKFLOW_PHASE:
            return {
                ...state,
                 workPhase: action.payload,
                 isCreated : true
            };    
        case types.DELETE_WORKFLOW_PHASE:
                return {
                    ...state,
                     workPhase: action.payload
                };  
        default: return state
    }
}

export default phaseReducer
