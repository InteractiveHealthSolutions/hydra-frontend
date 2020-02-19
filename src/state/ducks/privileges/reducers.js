import * as types from './types';

const initialstate = {allPriviliges : []}

const privilegesReducer = (state = initialstate , action) => {
    console.log('action '+JSON.stringify(action.type));
    console.log('action '+JSON.stringify(action.payload));

    switch(action.type) {
        case types.GET_ALL_PRIVILEGES : 
             return {
                allPriviliges : action.payload 
             }
        
        default: return state

    }
}

export default privilegesReducer;