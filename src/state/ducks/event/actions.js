import * as types from "./types";
import { fetch } from "../../utils";
import {
  POST,
  GET,
  DELETE,
} from "../../../utilities/constants/globalconstants";
import { REJECTED } from "../../../utilities/constants/globalconstants";
import { displayError, createNotification } from '../../../utilities/helpers/helper'
import { history } from '../../../history';


export const setActiveEvent = (event) => dispatch => {
  dispatch(setEvent({ event }));
  localStorage.setItem('active-event', JSON.stringify(event));

  if (event.closed === null)
    history.push('/event/eventclosure');
  else
    history.push('/event/eventplanner');

}

const setEvent = (Event) => ({ type: types.ACTIVE_EVENT, Event })



export const saveEvent = (event) => async dispatch => {
  fetch(POST, "hydra/event", event)
    .then(res => {
      console.log("saveEvent", res);
      history.push('/events');
      dispatch(eventAction(res))
    }).catch(displayError)
}


const eventAction = (payload) => ({
  type: types.CREATE_EVENT,
  payload
})

export const fetchEvents = () => async dispatch => {
  dispatch(setProject())  
  fetch(GET, "hydra/event?v=full")
    .then(res => {
      dispatch(setEventAction(res))
    }).catch(displayError)
}


const setEventAction = (payload) => ({ type: types.GET_ALL_EVENT, payload })

export const deleteEvent = (uuid) => async dispatch => {
  dispatch(setProject)
  fetch(DELETE, "hydra/event/" + uuid)
    .then(res => dispatch(deleteEventAction(res))).catch(displayError)
}
const deleteEventAction = (payload) => ({ type: types.DELETE_EVENT, payload })


export const saveEventType = (eventType) => async dispatch => {
  fetch(POST, "hydra/eventType", eventType)
    .then(res => dispatch(saveEventTypeAction(res))).catch(displayError)
}
const saveEventTypeAction = (payload) => ({ type: types.CREATE_EVENT_TYPE, payload })

export const fetchEventTypes = () => async dispatch => {
  fetch(GET, "hydra/eventType?v=full")
    .then(res => dispatch(getEventTypeAction(res))).catch(displayError)
}
const getEventTypeAction = (payload) => ({ type: types.GET_ALL_EVENT_TYPE, payload })




const setProject = () => ({
  type: types.SET_PROJECT
});

const setError = payload => ({
  type: types.GET_ALL_EVENT + REJECTED,
  payload
});