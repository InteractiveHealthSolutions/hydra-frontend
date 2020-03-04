import * as types from "./types";
import { fetch } from "../../utils";
import {
  POST,
  GET,
  REJECTED
} from "../../../utilities/constants/globalconstants";
import { displayError } from '../../../utilities/helpers/helper'

export const saveVisit = (visit) => async dispatch =>
  fetch(POST, "visit", visit)
    .then(res => dispatch(visitSaveAction(res))).catch(displayError)

const visitSaveAction = (payload) => ({ type: types.CREATE_VISIT, payload })




export const getAllVisitsForAPatient = (patient) => async dispatch => {
  dispatch(setProject())
  fetch(GET, "visit?patient="+patient)
    .then(res => dispatch(visitsForAPatientGetAction(res))).catch(displayError)
}


const visitsForAPatientGetAction = (payload) => ({ type: types.GET_VISITS_FOR_A_PATIENT, payload })

const setProject = () => ({

  type: types.SET_PROJECT

});
