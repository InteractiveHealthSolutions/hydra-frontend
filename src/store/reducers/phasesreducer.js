import {generalConstants} from '../../utilities/constants';

const initialState = {phaseName : '', phasesuuId : '' , phasesId : ''};

export const phasesreducer = (state = initialState , action) => {
    switch(action.type) {
        case generalConstants.ACTIVE_PHASES : 
         return {
          
         }
         default : return state
    }
}