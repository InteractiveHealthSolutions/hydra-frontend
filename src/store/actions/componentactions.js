import {generalConstants} from '../../utilities/constants';
import { history } from '../../history';

export const componentActions = {
    setActiveComponent
}

function setActiveComponent(component) {
    return dispatch => {
       dispatch(setComponent({component}));
       localStorage.setItem('active-component-name',component.hydramoduleComponent.name);
       localStorage.setItem('active-component-uuid', component.componentUUID);
       history.push('/Form');
    }

    function setComponent(component) {return {type : generalConstants.ACTIVE_COMPONENT , component}};
}