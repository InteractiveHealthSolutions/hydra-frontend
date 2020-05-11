import * as types from './types';

const initialstate = {concept : {}, concepts: [],loading:false}

const conceptsReducer = (state = initialstate , action) => {
    switch(action.type) {
        case types.GET_CONCEPT_BY_UUID : 
            return {
                concept : action.payload,
                loading : false
            }
        case types.GET_ALL_CONCEPTS :
            return {
                concepts : action.payload,
                loading : false
            }
        case types.SET_PROJECT_CONCEPT :
            return {
                current: action.payload,
                loading: true,
            }
        default: return state

    }
}

export default conceptsReducer;