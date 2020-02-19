import * as types from "./types";
import { fetch } from "../../utils";
import {
  POST,
  GET,
  DELETE,
} from "../../../utilities/constants/globalconstants";
import { REJECTED } from "../../../utilities/constants/globalconstants";
import { displayError } from '../../../utilities/helpers/helper'

// export const saveLocation = (Location) => ({
//   type: types.API,
//   payload: {
//     url: "location",
//     method: POST,
//     data: Location,
//     success: LocationAction,
//     init: setProject,
//     error: setError
//   }
// })

export const saveLocation = (Location) => async dispatch =>
  fetch(POST, "location", Location)
    .then(res => dispatch(LocationAction(res))).catch(displayError)

const LocationAction = (payload) => ({
  type: types.CREATE_LOCATION,
  payload
})

// export const fetchLocations = () => ({
//   type: types.API,
//   payload: {
//     url: "location?v=full",
//     method: GET,
//     success: setLocation,
//     init: setProject,
//     error: setError
//   }
// })

export const fetchLocations = () => async dispatch =>
  fetch(GET, "location?v=full")
    .then(res => dispatch(setLocation(res))).catch(displayError)

const setLocation = (payload) => ({ type: types.GET_ALL_LOCATION, payload })

export const deleteLocation = (uuid) => async dispatch => {
  fetch(DELETE, "location/" + uuid)
    .then(res => dispatch(deleteLocationAction(res))).catch(displayError)
}
const deleteLocationAction = (payload) => ({ type: types.DELETE_LOCATION, payload })


export const fetchLocationTags = () => async dispatch =>
  fetch(GET, "locationtag")
    .then(res => dispatch(setLocationTag(res))).catch(displayError)

const setLocationTag = (payload) => ({ type: types.GET_ALL_LOCATION_TAG, payload })

export const getChildLocations = (uuid) => async dispatch => 
  fetch(GET,"location/"+uuid)
   .then(res => dispatch(childLocationGetAction(res))).catch(displayError);

const childLocationGetAction = (payload) => ({type: types.GET_CHILD_LOCATIONS, payload})

export const getLocationByTag = (tag) => async dispatch =>
  fetch(GET,"location?tag="+tag)
   .then(res=>dispatch(locationByTagGetAction(res))).catch(displayError)

const locationByTagGetAction = (payload) => ({type: types.GET_LOCATION_BY_TAG,payload})
const setProject = () => ({

  type: types.SET_PROJECT

});

const setError = payload => ({
  type: types.GET_ALL_LOCATION + REJECTED,
  payload
});