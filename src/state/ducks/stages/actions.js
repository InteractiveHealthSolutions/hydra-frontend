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
  history.push('/workflow/phase/stage/form');
}
const setComponent = (component) => ({ type: types.ACTIVE_COMPONENT, component })

export const saveComponent = (component) => async dispatch =>
  fetch(POST, "/hydra/component", component)
    .then(res => dispatch(componentSaveAction(res))).catch(displayError)

const componentSaveAction = (payload) => ({
  type: types.CREATE_COMPONENT,
  payload
})


export const fetchcomponents = () => async dispatch =>
  fetch(GET, "/hydra/component")
    .then(res => dispatch(fetchComponentAction(res))).catch(displayError)

const fetchComponentAction = (payload) => ({ type: types.GET_ALL_COMPONENT, payload })


export const savePhaseComponent = (component) => async dispatch => {

  fetch(POST, "/hydra/phasecomponent", component)
    .then(res => dispatch(savePhaseComponentAction(res))).catch(displayError)
}


const savePhaseComponentAction = (payload) => ({ type: types.CREATE_PHASE_COMPONENT, payload })


export const fetchPhaseComponent = (filterWith) => async dispatch => {
  dispatch(setProject())
  fetch(GET, "/hydra/phasecomponent")
    .then(res => dispatch(fetchPhaseComponentAction(filterStage(res, filterWith)))).catch(displayError)
}

const fetchPhaseComponentAction = (payload) => ({ type: types.GET_ALL_PHASE_COMPONENT, payload })

function filterStage(phaseStageData, filterWith) {
  let filteredComponent = [];
  let activePhase = ""
  let activeWorkflow = ""
  if (filterWith === "dataview") {
    activePhase = localStorage.getItem('active-phases-uuid');
    activeWorkflow = localStorage.getItem('selectedWorkflowId');
  } else {
    activePhase = localStorage.getItem('active-phases-uuid');
    activeWorkflow = localStorage.getItem('active-workflow-uuid');
  }


  phaseStageData.PhaseComponentsMap.forEach(element => {
    if (activePhase === element.phaseUUID && activeWorkflow === element.workflowUUID) {
      filteredComponent.push(element);
    }
  });
  return filteredComponent;
}

export const deletePhaseComponent = (uuid) => async dispatch =>
  fetch(DELETE, "/hydra/phasecomponent/" + uuid)
    .then(res => dispatch(deletePhaseComponentAction(res))).catch(displayError)

const deletePhaseComponentAction = (payload) => ({ type: types.DELETE_PHASE_COMPONENT, payload })


const setProject = () => ({
  type: types.SET_PROJECT
});

const setError = payload => ({
  type: types.GET_ALL_COMPONENT + REJECTED,
  payload
});

