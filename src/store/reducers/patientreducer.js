import {generalConstants} from '../../constants';

const initialState = {given : '', identifier : '',middle:'',familyname:'',age:'',gender:'',birthday:'',deathdate:'' };

export const patientreducer = (state = initialState , action) => {
    switch(action.type) {
        case generalConstants.ACTIVE_PATIENT : 
         return {
            activePatient : action.payload
         }
         default : return state
    }
}