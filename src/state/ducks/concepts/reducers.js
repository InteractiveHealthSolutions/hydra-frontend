import * as types from './types';

const initialstate = {concept : {}}

const conceptsReducer = (state = initialstate , action) => {
    switch(action.type) {
        case types.GET_CONCEPT_BY_UUID : 
             return {
                concept : action.payload 
             }
             default: return state

    }
}

export default conceptsReducer;