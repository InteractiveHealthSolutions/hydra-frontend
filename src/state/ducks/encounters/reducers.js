import * as types from './types';

const initialstate = {allEncounters : {}}

const encountersReducer = (state = initialstate , action) => {
   // console.log('action '+JSON.stringify(action.type));
    switch(action.type) {
        case types.GET_ALL_ENCOUNTERS : 
             return {
                allEncounters : action.payload 
             }
             default: return state

    }
}

export default encountersReducer;