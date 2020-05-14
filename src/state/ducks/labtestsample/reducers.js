import * as types from './types';

const initialstate = {labtestSampleForOrder : {},activeLabTestSample:""}

const labtestsampleReducer = (state = initialstate , action) => {
    //console.log('action '+JSON.stringify(action.type));
    //console.log('action '+JSON.stringify(action.payload));

    switch(action.type) {
        case types.GET_LABTESTSAMPLE_FOR_ORDER : 
             return {
                labtestSampleForOrder : action.payload 
             }
        case types.SET_ACTIVE_LABTESTSAMPLE : 
             return {
                activeLabTestSample : action.payload
             }
        case types.POST_LABTESTSAMPLE : 
             return {
                 labtestsample : action.payload
             }
        case types.GET_SAMPLE_BY_UUID :
             return {
                 labtestsample : action.payload
             }
        case types.EDIT_LABTESTSAMPLE : 
             return {
                 labtestsample : action.payload
             }
        default: return state

    }
}

export default labtestsampleReducer;