import { fetch } from "../../utils";
import * as types from "./types";

import {
  POST,
  GET,
} from "../../../utilities/constants/globalconstants";

import { displayError } from '../../../utilities/helpers/helper'


export const getAllWorkflow = () => async dispatch =>
  fetch(GET, "hydra/workflow")
    .then(res => dispatch(workflowGetAction(res))).catch(displayError)

const workflowGetAction = payload => ({ type: types.GET_ALL_WORKFLOW, payload })

export const getWorkflowPhases = () => async dispatch =>
  fetch(GET, "hydra/workflowphases")
    .then(res => dispatch(phaseGetAction(res))).catch(displayError)

const phaseGetAction = payload => ({ type: types.GET_ALL_PHASE, payload })


export const getPhaseComponent = () => async dispatch =>
  fetch(GET, "hydra/phasecomponent")
    .then(res => dispatch(phaseComponentGetAction(res))).catch(displayError)

const phaseComponentGetAction = payload => ({ type: types.GET_ALL_STAGE, payload })
