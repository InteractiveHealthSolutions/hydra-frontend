import * as types from "./types";
import { fetch } from "../../utils";
import {
  POST,
  GET,
  DELETE,
} from "../../../utilities/constants/globalconstants";
import { REJECTED } from "../../../utilities/constants/globalconstants";
import { displayError } from '../../../utilities/helpers/helper'


export const savePerson = (Person) => async dispatch =>
  fetch(POST, "/person", Person)
    .then(res => dispatch(personCreateAction(res))).catch(displayError)

const personCreateAction = (payload) => ({
  type: types.CREATE_PERSON,
  payload
})

export const fetchPersons = () => async dispatch =>
  fetch(GET, "/person?v=full")
    .then(res => dispatch(setpersonsAction(res))).catch(displayError)

const setpersonsAction = (payload) => ({ type: types.GET_ALL_PERSON, payload })






































































































































































































































































































