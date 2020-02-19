import * as types from "./types";
import { fetch } from "../../utils";
import {
  POST,
  GET,
  DELETE,
} from "../../../utilities/constants/globalconstants";
import { REJECTED } from "../../../utilities/constants/globalconstants";
import { displayError } from '../../../utilities/helpers/helper'


export const saveEventClosure = (eventClosure) => async dispatch =>
  fetch(POST, "hydra/EventClosure", eventClosure)
    .then(res => dispatch(eventClosureAction(res))).catch(displayError)

const eventClosureAction = (payload) => ({
  type: types.CREATE_EVENT_CLOSURE,
  payload
})

export const fetchEventClosures = () => async dispatch =>
  fetch(GET, "hydra/eventclosure?v=full")
    .then(res => dispatch(setEventClosureAction(res))).catch(displayError)

const setEventClosureAction = (payload) => ({ type: types.GET_ALL_EVENT_CLOSURE, payload })

export const deleteEventClosure = (uuid) => async dispatch => {
  fetch(DELETE, "hydra/eventclosure/" + uuid)
    .then(res => dispatch(deleteEventClosureAction(res))).catch(displayError)
}
const deleteEventClosureAction = (payload) => ({ type: types.DELETE_EVENT_CLOSURE, payload })



const setProject = () => ({
  type: types.SET_PROJECT
});

const setError = payload => ({
  type: types.GET_ALL_EVENT_CLOSURE + REJECTED,
  payload
});