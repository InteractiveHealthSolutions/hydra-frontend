import * as types from "./types";
import { fetch } from "../../utils";
import {
  POST,
  GET,
  DELETE,
} from "../../../utilities/constants/globalconstants";
import { REJECTED } from "../../../utilities/constants/globalconstants";
import { displayError } from '../../../utilities/helpers/helper'
import { history } from '../../../history';

export const setActivePatient = (patient) => async dispatch => {

  localStorage.setItem('active-patient', JSON.stringify(patient));
  dispatch(setPatient({ patient }));
  history.push('/PatientDetail');
}

const setPatient = (patient) => ({ type: types.ACTIVE_PATIENT, patient });



export const savePatient = (Patient) => async dispatch =>
  fetch(POST, "patient", Patient)
    .then(res => dispatch(patientAction(res))).catch(displayError)

const patientAction = (payload) => ({
  type: types.CREATE_PATIENT,
  payload
})

export const fetchPatients = (query) => async dispatch =>
  fetch(GET, "patient?v=full&q="+query)
    .then(res => dispatch(setpatientAction(res))).catch(displayError)

const setpatientAction = (payload) => ({ type: types.GET_ALL_PATIENT, payload })

export const deletePatient = (uuid) => async dispatch => {
  fetch(DELETE, "patient/" + uuid)
    .then(res => dispatch(deletepatientAction(res))).catch(displayError)
}
const deletepatientAction = (payload) => ({ type: types.DELETE_PATIENT, payload })


export const searchPatient = (query) => async dispatch => {
  dispatch(setProject())
  fetch(GET, "/patient?v=full&q=" + query)
    .then(res => dispatch(searchPatientAction(res))).catch(displayError)
}
const searchPatientAction = (payload) => ({ type: types.SEARCH_PATIENT, payload })


const setProject = () => ({
  type: types.SET_PROJECT
});

const setError = payload => ({
  type: types.GET_ALL_PATIENT + REJECTED,
  payload
});