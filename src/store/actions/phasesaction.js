import {generalConstants} from '../../utilities/constants';
import { history } from '../../history';

export const phasesActions = {
    setActivePhases
}

function setActivePhases(phases) {
    console.log("active phases   ::  "+phases.phaseName)
    console.log("active phases uuid  ::: "+phases.uuid)
    return dispatch => {
       dispatch(setPhases({phases}));
       localStorage.setItem('active-phases-name', phases.phaseName);
       localStorage.setItem('active-phases-uuid', phases.phaseUUID);
       history.push('/component');
    }

    function setPhases(phases) {return {type : generalConstants.ACTIVE_PHASES , phases}};
}