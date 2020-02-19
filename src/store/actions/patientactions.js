import {generalConstants} from '../../utilities/constants';
import { history } from '../../history';

export const PatientActions = {
    setActivePatient
}

function setActivePatient(patient) {
    return dispatch => {
       dispatch(setPatient({patient}));
       localStorage.setItem('active-patient', JSON.stringify(patient));
       console.log('patient '+patient);
       history.push('/PatientDetail');
    }

    function setPatient(patient) {return {type : generalConstants.ACTIVE_PATIENT , patient}};
}