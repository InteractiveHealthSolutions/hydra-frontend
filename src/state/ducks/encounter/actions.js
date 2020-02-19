import * as types from "./types";
import { fetch } from "../../utils";
import {
  GET,
} from "../../../utilities/constants/globalconstants";
import { REJECTED } from "../../../utilities/constants/globalconstants";
import { displayError, createNotification } from '../../../utilities/helpers/helper'

export const fetchEncounterType = () => async dispatch => {
  dispatch(setProject)
  fetch(GET, "encountertype")
    .then(res => {
      dispatch(setEncounterAction(res))
    }).catch(displayError)
}

const setEncounterAction = (payload) => ({ type: types.GET_ALL_ENCOUNTER_TYPE, payload })


export const searchEncounterType = (encountertypeName) => async dispatch => {
  dispatch(setProject)
  fetch(GET, "encountertype?q="+encountertypeName)
    .then(res => {
      dispatch(setSearchEncounterType(res))
    }).catch(displayError)
}

const setSearchEncounterType = (payload) => ({ type: types.SEARCH_ENCOUNTER_TYPE, payload })


const setProject = () => ({
  type: types.SET_PROJECT
});

const setError = payload => ({
  type: types.GET_ALL_ENCOUNTER + REJECTED,
  payload
});