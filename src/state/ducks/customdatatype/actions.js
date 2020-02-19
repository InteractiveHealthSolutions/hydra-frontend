import * as types from "./types";
import { fetch } from "../../utils";
import {
  POST,
  PUT,
  DELETE,
  GET,
} from "../../../utilities/constants/globalconstants";

import { displayError } from '../../../utilities/helpers/helper'

export const getAllCustomDataType = () => async dispatch =>
  fetch(GET, "/customdatatype?v=full")
    .then(res => dispatch(customDatatypeGetAction(res))).catch(displayError)

const customDatatypeGetAction = payload => ({ type: types.GET_ALL_CUSTOMDATATYPE, payload })
