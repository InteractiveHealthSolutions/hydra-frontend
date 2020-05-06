import * as types from './types';

const initialstate = {labtestOrderForPatient :{},activeLabTestOrder:""}

const labtestorderReducer = (state = initialstate , action) => {
   // console.log('action '+JSON.stringify(action.type));
   // console.log('action '+JSON.stringify(action.payload));

    switch(action.type) {
        case types.GET_LABTESTORDER_FOR_PATIENT : 
             return {
                 labtestOrderForPatient : action.payload 
             }
        case types.SET_ACTIVE_LABTESTORDER : 
             return {
               activeLabTestOrder : action.payload
             }
        case types.POST_LABTESTORDER :
             return {
                 labtest : action.payload
             }
             default: return state

    }
}

export default labtestorderReducer;