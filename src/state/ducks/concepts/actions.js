import * as types from "./types";
import { fetch } from "../../utils";
import {
  POST,
  PUT,
  DELETE,
  GET,
} from "../../../utilities/constants/globalconstants";

import { displayError } from '../../../utilities/helpers/helper'

export const getConceptByUUID = (uuid) => async dispatch =>
  fetch(GET, "/concept/"+uuid)
    .then(res => dispatch(conceptByUUIDGetAction(res))).catch(displayError)

const conceptByUUIDGetAction = payload => ({ type: types.GET_CONCEPT_BY_UUID, payload })
