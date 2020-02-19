import * as types from "./types";
import { fetch } from "../../utils";
import {
  POST,
  PUT,
  DELETE,
  GET,
} from "../../../utilities/constants/globalconstants";

import { displayError } from '../../../utilities/helpers/helper'

export const getAllEncounter = (patient) => async dispatch =>
  fetch(GET, "/encounter?v=full&patient="+patient)
    .then(res => dispatch(getAllEncounterGetAction(res))).catch(displayError)

const getAllEncounterGetAction = payload => ({ type: types.GET_ALL_ENCOUNTERS, payload })
