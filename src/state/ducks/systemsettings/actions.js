import * as types from "./types";
import { fetch } from "../../utils";
import {
  POST,
  PUT,
  DELETE,
  GET,
} from "../../../utilities/constants/globalconstants";

import { displayError } from '../../../utilities/helpers/helper'

export const getSystemSettingsByUUID = (uuid) => async dispatch =>
  fetch(GET, "/systemsetting/"+uuid)
    .then(res => dispatch(systemSettingByUUIDGetAction(res))).catch(displayError)

const systemSettingByUUIDGetAction = payload => ({ type: types.GET_GLOBAL_PROPERTY_BY_UUID, payload })

export const postSystemSettings = (uuid,data) => async dispatch => 
  fetch(POST,"/systemsetting/"+uuid,data)
    .then(res => dispatch(systemSettingPostAction(res))).catch(displayError)

const systemSettingPostAction = payload => ({type : types.POST_GLOBAL_PROPERTY , payload})