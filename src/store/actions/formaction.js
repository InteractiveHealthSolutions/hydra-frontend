import {generalConstants} from '../../utilities/constants';
import { history } from '../../history';

export const formActions = {
     setActiveForm
}

function setActiveForm(form) {
    console.log("active form "+JSON.parse(JSON.stringify(form)).formName)
    return dispatch => {
       dispatch(setForm({form}));
       localStorage.setItem('active-component-name', JSON.parse(JSON.stringify(form)).formName);
    //    history.push('/formdesigner');
    }

    function setForm(form) {return {type : generalConstants.ACTIVE_FORM , form}};
}