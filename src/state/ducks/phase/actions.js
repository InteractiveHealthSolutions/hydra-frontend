import * as types from "./types";
import { history } from '../../../history';
import { fetch } from "../../utils";
import {
  POST,
  DELETE,
  GET,
} from "../../../utilities/constants/globalconstants";
import { REJECTED } from "../../../utilities/constants/globalconstants";

import { displayError } from '../../../utilities/helpers/helper'

export function setActivePhases(phases) {
  return dispatch => {
    dispatch(setPhases({ phases }));
    localStorage.setItem('active-phases-name', phases.phaseName);
    localStorage.setItem('active-phases-uuid', phases.phaseUUID);
    history.push('/workflow/phase/stage');
  }

  function setPhases(phases) { return { type: types.ACTIVE_PHASE, phases } };
}

export const savePhase = (Phase) => async dispatch =>
  fetch(POST, "/hydra/phase", Phase)
    .then(res => dispatch(phaseSaveAction(res))).catch(displayError)

const phaseSaveAction = (payload) => ({ type: types.CREATE_PHASE, payload })

export const getAllPhase = () => async dispatch =>
  fetch(GET, "/hydra/phase")
    .then(res => dispatch(phaseGetAction(res))).catch(displayError)

const phaseGetAction = payload => ({ type: types.GET_ALL_PHASE, payload })

// maping

export const saveWorkflowPhase = phase => async dispatch =>
  fetch(POST, "/hydra/workflowphases", phase)
    .then(res => { dispatch(saveWorkflowPhaseAction(res)); dispatch(getAllWorkflowPhase()); dispatch(getAllPhase()) }).catch(displayError)

const saveWorkflowPhaseAction = payload => ({ type: types.CREATE_WORKFLOW_PHASE, payload })

export const getAllWorkflowPhase = () => async dispatch => {
  dispatch(setProject())
  fetch(GET, "/hydra/workflowphases")
    .then(res => { dispatch(getWorkflowPhaseAction(filterPhases(res))) }).catch(displayError)
}

const getWorkflowPhaseAction = payload => ({ type: types.GET_WORKFLOW_PHASE, payload })

function filterPhases(workflowphaseData) {
  let filteredPhases = [];
  let activeWorkflow = localStorage.getItem('active-workflow-uuid');
  console.log("workflowphaseData", workflowphaseData, activeWorkflow)
  workflowphaseData.workflowPhasesMap.forEach(element => {
    if (activeWorkflow === element.workflowUUID) {
      filteredPhases.push(element);
    }
  });
  return filteredPhases;
}

export const deleteWorkflowPhase = (uuid) => async dispatch =>
  fetch(DELETE, "/hydra/workflowphases/" + uuid)
    .then(res => dispatch(deleteWorkflowPhaseAction(res))).catch((e) => console.log("Throws", e))

const deleteWorkflowPhaseAction = payload => ({ type: types.DELETE_WORKFLOW_PHASE, payload })


const setProject = () => ({
  type: types.SET_PROJECT
});

const setError = payload => ({
  type: types.GET_ALL_PHASE + REJECTED,
  payload
});
