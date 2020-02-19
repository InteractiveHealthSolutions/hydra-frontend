import * as types from './types';

const initialstate = {allCustomDataType : {}}

const customDataTypeReducer = (state = initialstate , action) => {
    console.log('action '+JSON.stringify(action.type));
    switch(action.type) {
        case types.GET_ALL_CUSTOMDATATYPE : 
             return {
                 allCustomDataType : action.payload 
             }
             default: return state

    }
}

export default customDataTypeReducer;