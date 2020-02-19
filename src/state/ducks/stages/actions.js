import { history } from '../../../history';
import * as types from "./types";
import { fetch } from "../../utils";
import {
  POST,
  GET,
  DELETE,
} from "../../../utilities/constants/globalconstants";
import { REJECTED } from "../../../utilities/constants/globalconstants";
import { displayError } from '../../../utilities/helpers/helper'


export const setActiveComponent = (component) => dispatch => {
  dispatch(setComponent({ component }));
  localStorage.setItem('active-component-name', component.hydramoduleComponent.name); //local storage also change...
  localStorage.setItem('active-component-uuid', component.componentUUID);
  history.push('/Form');
}
const setComponent = (component) => ({ type: types.ACTIVE_COMPONENT, component })

// export const saveComponent = (component) => ({
//   type: types.API,
//   payload: {
//     url: "hydra/component",
//     method: POST,
//     data: component,
//     success: componentSaveAction,
//     init: setProject,
//     error: setError
//   }

// })

///saveComponent
export const saveComponent = (component) => async dispatch =>
  fetch(POST, "hydra/component", component)
    .then(res => dispatch(componentSaveAction(res))).catch(displayError)

const componentSaveAction = (payload) => ({
  type: types.CREATE_COMPONENT,
  payload
})

//  Fetch all components 
// export const fetchcomponents = () => ({
//   type: types.API,
//   payload: {
//     url: "hydra/component",
//     method: GET,
//     success: fetchComponentAction,
//     init: setProject,
//     error: setError
//   }
// })

export const fetchcomponents = () => async dispatch =>
  fetch(GET, "hydra/component")
    .then(res => dispatch(fetchComponentAction(res))).catch(displayError)

const fetchComponentAction = (payload) => ({ type: types.GET_ALL_COMPONENT, payload })

//  save the phase associated component .. mapping  
// export const savePhaseComponent = (component) => ({
//   type: types.API,
//   payload: {
//     url: "hydra/phasecomponent",
//     method: POST,
//     data: component,
//     success: savePhaseComponentAction,
//     init: setProject,
//     error: setError
//   }
// })

export const savePhaseComponent = (component) => async dispatch =>
  fetch(POST, "hydra/phasecomponent", component)
    .then(res => dispatch(savePhaseComponentAction(res))).catch(displayError)

const savePhaseComponentAction = (payload) => ({ type: types.CREATE_PHASE_COMPONENT, payload })

// get all phase associated component
// export const fetchPhaseComponent = () => ({
//   type: types.API,
//   payload: {
//     url: "hydra/phasecomponent",
//     method: GET,
//     success: fetchPhaseComponentAction,
//     init: setProject,
//     error: setError
//   }
// })

export const fetchPhaseComponent = () => async dispatch =>
  fetch(GET, "hydra/phasecomponent")
    .then(res => dispatch(fetchPhaseComponentAction(filterStage(res)))).catch(displayError)

const fetchPhaseComponentAction = (payload) => ({ type: types.GET_ALL_PHASE_COMPONENT, payload })

function filterStage(phaseStageData) {
  let filteredComponent = [];
  let activePhase = localStorage.getItem('active-phases-uuid');
  phaseStageData.PhaseComponentsMap.forEach(element => {
    if (activePhase === element.phaseUUID) {
      filteredComponent.push(element);
    }
  });
  return filteredComponent;
}

export const deletePhaseComponent = (uuid) => async dispatch =>
  fetch(DELETE, "hydra/phasecomponent/" + uuid)
    .then(res => dispatch(deletePhaseComponentAction(res))).catch(displayError)

const deletePhaseComponentAction = (payload) => ({ type: types.DELETE_PHASE_COMPONENT, payload })


const setProject = () => ({
  type: types.SET_PROJECT
});

const setError = payload => ({
  type: types.GET_ALL_COMPONENT + REJECTED,
  payload
});

