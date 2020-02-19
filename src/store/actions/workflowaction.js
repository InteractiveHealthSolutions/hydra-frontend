import { history } from '../../history';
import { fetch } from "../../state/utils";
import { workflowconstants } from '../../utilities/constants';

import {
  POST,
  PUT,
  DELETE,
  GET,
} from "../../utilities/constants/globalconstants";
import { displayError } from '../../utilities/helpers/helper'

export const setActiveWorkflow = (workflow) => dispatch =>{
    dispatch(setWorkflow({ workflow }));
    localStorage.setItem('active-workflow-name', workflow.name);
    localStorage.setItem('active-workflow-uuid', workflow.uuid);
    history.push('/phase');
}

const setWorkflow = (workflow) => ({ type: workflowconstants.ACTIVE_WORKFLOW, workflow })

export const saveWorkflow = (workflow) => async dispatch =>
  fetch(POST, "hydra/workflow", workflow)
    .then(res => dispatch(workflowSaveAction(res))).catch(displayError)

const workflowSaveAction = (payload) => ({ type: workflowconstants.CREATE_WORKFLOW, payload })

export const getAllWorkflow = () => async dispatch =>
  fetch(GET, "hydra/workflow")
    .then(res => dispatch(workflowGetAction(res))).catch(displayError)

const workflowGetAction = payload => ({ type: workflowconstants.GET_ALL_WORKFLOW, payload })


