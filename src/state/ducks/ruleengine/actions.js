import { fetch } from "../../utils";
import * as types from "./types";

import {
  POST,
  GET,
} from "../../../utilities/constants/globalconstants";

import { displayError } from '../../../utilities/helpers/helper'

export const getFieldRule = () => async dispatch => {
  dispatch(setProject())
  fetch(GET, "/hydra/field-rule")
    .then(res => {
      console.log("fieldRule res", res)
      dispatch(setFieldRuleAction(res))
    })
    .catch((error) => {
      console.error("fieldRule err", error)
    })
}


const setFieldRuleAction = payload => ({ type: types.GET_FIELD_RULE, payload })

export const saveFieldRule = (rule) => async dispatch =>
  fetch(POST, "/hydra/field-rule", rule)
    .then(res => dispatch(setSaveFieldRuleAction(res))).catch(displayError)

const setSaveFieldRuleAction = payload => ({ type: types.CREATE_FIELD_RULE, payload })

const setProject = () => ({
  type: types.SET_PROJECT
});
