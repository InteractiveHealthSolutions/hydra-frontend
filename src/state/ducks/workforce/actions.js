import * as types from "./types";
import { fetch } from "../../utils";
import {
  POST,
  GET,
  DELETE,
} from "../../../utilities/constants/globalconstants";
import { displayError, createNotification } from '../../../utilities/helpers/helper'


export const saveParticipant = (workforce) => async dispatch =>
  fetch(POST, "/hydra/participant", workforce)
    .then(res => dispatch(workforceAction(res))).catch(displayError)

const workforceAction = (payload) => ({
  type: types.CREATE_WORKFORCE,
  payload
})


export const fetchParticipant = () => async dispatch => {
  dispatch(setProject())
  fetch(GET, "/hydra/participant?v=full")
    .then(res => { dispatch(setWorkforceAction(res)) }).catch(displayError)

}

const setWorkforceAction = (payload) => ({ type: types.GET_ALL_WORKFORCE, payload })

export const fetchParticipantByUser = (userUUID) => async dispatch => {
  dispatch(setProject())
  fetch(GET, "/hydra/participant?q="+userUUID)
    .then(res => { dispatch(getWorkForceByUserAction(res)) }).catch(displayError)

}

const getWorkForceByUserAction = (payload) => ({ type: types.GET_PARTICIPANT_BY_USER, payload })

export const fetchParticipantSalaryType = () => dispatch =>
  fetch(GET, "/hydra/participantSalaryType?v=full")
    .then(res => { dispatch(setParticipantSalaryTypeAction(res)) }).catch(displayError)

const setParticipantSalaryTypeAction = (payload) => ({ type: types.GET_WORKFORCE_SALARY_TYPE, payload })

const setProject = () => ({
  type: types.SET_PROJECT
});
