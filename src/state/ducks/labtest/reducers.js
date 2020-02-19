import * as types from './types';

const initialstate = {allLabTest : {}}

const labtestReducer = (state = initialstate , action) => {
    console.log('action '+JSON.stringify(action.type));
  //  console.log('action pl'+JSON.stringify(action.payload));

    switch(action.type) {
        case types.GET_ALL_LABTEST : 
             return {
                 allLabTest : action.payload 
             }
             default: return state

    }
}

export default labtestReducer;