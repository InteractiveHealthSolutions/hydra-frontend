import { history } from '../../../history';
import * as types from "./types";
import { fetch } from "../../utils";
import {
  POST,
  GET,
  REJECTED
} from "../../../utilities/constants/globalconstants";
import { displayError } from '../../../utilities/helpers/helper'

export const setActiveWorkflow = (workflow) => dispatch => {
  dispatch(setWorkflow({ workflow }));
  localStorage.setItem('active-workflow-name', workflow.name);
  localStorage.setItem('active-workflow-uuid', workflow.uuid);
  history.push('/phase');
}

const setWorkflow = (workflow) => ({ type: types.ACTIVE_WORKFLOW, workflow })

// export const saveWorkflow = (workflow) => async dispatch =>
//   fetch(POST, "hydra/workflow", workflow)
//     .then(res => dispatch(workflowSaveAction(res))).catch(displayError)

// const workflowSaveAction = (payload) => ({ type: types.CREATE_WORKFLOW, payload })


//Save  workflow
// export const saveWorkflow = (workflow) => ({
//   type: types.API,
//   payload: {
//     url: "hydra/workflow",
//     method: POST,
//     data: workflow,
//     success: workflowSaveAction,
//     init: setProject,
//     error: setError
//   }

// })

// const workflowSaveAction = (payload) => ({
//   type: types.CREATE_WORKFLOW,
//   payload
// })


export const saveWorkflow = (workflow) => async dispatch =>
  fetch(POST, "hydra/workflow", workflow)
    .then(res => dispatch(workflowSaveAction(res))).catch(displayError)

const workflowSaveAction = (payload) => ({ type: types.CREATE_WORKFLOW, payload })




export const getAllWorkflow = () => async dispatch =>
  fetch(GET, "hydra/workflow")
    .then(res => dispatch(workflowGetAction(res))).catch(displayError)

const workflowGetAction = (payload) => ({ type: types.GET_ALL_WORKFLOW, payload })




//  Fetch all workflows not working  .... :(
// export const fetchWorkflows = () => ({
//   type: types.API,
//   payload: {
//     url: "hydra/workflow",
//     method: GET,
//     success: setWorkflows,
//     init: setProject,
//     error: setError
//   }
// })

// const setWorkflows = (payload) => ({ type: types.GET_ALL_WORKFLOW, payload })

const setProject = () => ({

  type: types.SET_PROJECT

});

const setError = payload => ({
  type: types.GET_ALL_WORKFLOW + REJECTED,
  payload
});