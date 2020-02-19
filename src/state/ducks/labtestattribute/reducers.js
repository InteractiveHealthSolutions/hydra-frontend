import * as types from './types';

const initialstate = {allLabTestAttribute : {},labTestAttributeForOrder:{},labTestResults:{}}

const labtestattributeReducer = (state = initialstate , action) => {
    console.log('action '+JSON.stringify(action.type));
    switch(action.type) {
        case types.GET_ALL_LABTESTATTRIBUTE : 
            return {
                 allLabTestAttribute : action.payload 
            }
        case types.GET_LABTESTATTRIBUTE_FOR_ORDER :
            return {
                 labTestAttributeForOrder : action.payload
            }
        case types.GET_LABTEST_RESULTS :
           return {
               labTestResults : action.payload
           }
        default: return state

    }
}

export default labtestattributeReducer;