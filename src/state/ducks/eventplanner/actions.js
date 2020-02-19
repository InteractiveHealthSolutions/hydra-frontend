import * as types from "./types";
import { fetch } from "../../utils";
import {
  POST,
  GET,
  DELETE,
} from "../../../utilities/constants/globalconstants";
import { REJECTED } from "../../../utilities/constants/globalconstants";
import { displayError } from '../../../utilities/helpers/helper'


export const saveEventPlanner = (eventPlanner) => async dispatch =>
  fetch(POST, "hydra/eventplanner", eventPlanner)
    .then(res => dispatch(eventPlannerAction(res))).catch(displayError)

const eventPlannerAction = (payload) => ({
  type: types.CREATE_EVENT_PLANNER,
  payload
})

export const fetchEventPlanners = () => async dispatch =>
  fetch(GET, "hydra/eventplanner?v=full")
    .then(res => dispatch(setEventPlannerAction(res))).catch(displayError)

const setEventPlannerAction = (payload) => ({ type: types.GET_ALL_EVENT_PLANNER, payload })

export const deleteEventPlanner = (uuid) => async dispatch => {
  fetch(DELETE, "hydra/EventPlanner/" + uuid)
    .then(res => dispatch(deleteEventPlannerAction(res))).catch(displayError)
}
const deleteEventPlannerAction = (payload) => ({ type: types.DELETE_EVENT_PLANNER, payload })



const setProject = () => ({
  type: types.SET_PROJECT
});

const setError = payload => ({
  type: types.GET_ALL_EVENT_PLANNER + REJECTED,
  payload
});