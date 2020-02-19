import * as types from "./types";
import { fetch } from "../../utils";
import {
  POST,
  PUT,
  DELETE,
  GET,
} from "../../../utilities/constants/globalconstants";

import { displayError } from '../../../utilities/helpers/helper'

export const getAllPriviliges = () => async dispatch =>
  fetch(GET, "/privilege?v=full")
    .then(res => dispatch(allPriviligesGetAction(res))).catch(displayError)

const allPriviligesGetAction = payload => ({ type: types.GET_ALL_PRIVILEGES, payload })
