import * as types from "./types";
import { fetch } from "../../utils";
import {
  POST,
  PUT,
  DELETE,
  GET,
} from "../../../utilities/constants/globalconstants";

import { displayError } from '../../../utilities/helpers/helper'

export const getLabTestOrderForPatient = (searchquery) => async dispatch =>
  fetch(GET, "/commonlab/labtestorder?v=full&patient="+searchquery)
    .then(res => dispatch(labTestOrderForPatientGetAction(res))).catch(displayError)

const labTestOrderForPatientGetAction = payload => ({ type: types.GET_LABTESTORDER_FOR_PATIENT, payload })
export const setActiveLabTestOrder = (labTest) => async dispatch => {
  dispatch(labTestOrderActiveTestSetAction(labTest))
}

const labTestOrderActiveTestSetAction = payload => ({type:types.SET_ACTIVE_LABTESTORDER,payload})

export const postLabTestOrder = data => async dispatch => 
  fetch(POST,'/commonlab/labtestorder',data)
  .then(res => dispatch(labTestOrderPostAction(res))).catch(displayError)

const labTestOrderPostAction = payload => ({type:types.POST_LABTESTORDER,payload})
  
export const putLabTestOrder = (uuid,data) => async dispatch => 
  fetch(POST,'/commonlab/labtestorder/'+uuid,data)
  .then(res => dispatch(labTestOrderPutAction(res))).catch(displayError)
  
const labTestOrderPutAction = payload => ({type:types.POST_LABTESTORDER,payload})

  