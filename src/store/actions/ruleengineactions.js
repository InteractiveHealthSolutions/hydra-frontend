import { fetch } from "../../state/utils";
import { workflowconstants,phasesconstants } from '../../utilities/constants';
import {
  POST,
  PUT,
  DELETE,
  GET,
} from "../../utilities/constants/globalconstants";
import { displayError } from '../../utilities/helpers/helper'

export const ruleengineActions = {
      getAllWorkflow,
      getAllPhases
  }

 function getAllWorkflow() {
    return dispatch => {
         fetch(GET,"hydra/workflow")
          .then(res => dispatch(workflowGetAction(res))).catch(displayError)
    }
    function workflowGetAction(payload) { return { type: workflowconstants.GET_ALL_WORKFLOW, payload } }
  }

  function getAllPhases(){
     return dispatch => {
      fetch(GET,"hydra/phase")
         .then(res => dispatch(phaseGetAction(res))).catch(displayError)
     }
 
    function phaseGetAction(payload) {return {type:phasesconstants.GET_ALL_PHASE,payload}}
  }
  