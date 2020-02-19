import * as types from "./types";
import { fetch } from "../../utils";
import {
  POST,
  PUT,
  DELETE,
  GET,
} from "../../../utilities/constants/globalconstants";

import { displayError } from '../../../utilities/helpers/helper'

export const getLabTestSampleForOrder = (searchquery) => async dispatch =>
  fetch(GET, "/commonlab/labtestsample?v=full&labtest="+searchquery)
    .then(res => dispatch(labTestSampleForOrderGetAction(res))).catch(displayError)

const labTestSampleForOrderGetAction = payload => ({ type: types.GET_LABTESTSAMPLE_FOR_ORDER, payload })
export const setActiveLabTestSample = (labTestSample) => async dispatch => {
  dispatch(activeLabTestSampleSetAction(labTestSample))
}

const activeLabTestSampleSetAction = payload => ({type:types.SET_ACTIVE_LABTESTSAMPLE, payload})

export const postLabTestSample = (labTestSample) => async dispatch => 
  fetch(POST , '/commonlab/labtestsample',labTestSample)
    .then(res => dispatch(labtestsamplePostAction(res),dispatch(getLabTestSampleForOrder(labTestSample.labtest)))).catch(displayError)

const labtestsamplePostAction = payload => ({type:types.POST_LABTESTSAMPLE , payload})

export const getLabTestSampleByUUID = (searchquery) => async dispatch =>
  fetch(GET, "/commonlab/labtestsample/"+searchquery+'?&v=full')
    .then(res => dispatch(labTestSampleByUUIDGetAction(res))).catch(displayError)

const labTestSampleByUUIDGetAction = payload => ({ type: types.GET_SAMPLE_BY_UUID, payload })

export const putLabTestSample = (uuid,labTestSample) => async dispatch => 
  fetch(POST , '/commonlab/labtestsample/'+uuid,labTestSample)
    .then(res => dispatch(labtestsamplePUTAction(res),dispatch(getLabTestSampleForOrder(labTestSample.labtest)))).catch(displayError)

const labtestsamplePUTAction = payload => ({type:types.EDIT_LABTESTSAMPLE , payload})

