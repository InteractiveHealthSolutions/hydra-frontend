import { fetch } from "../../utils";
import * as types from "./types";

import {
  POST,
  GET,
} from "../../../utilities/constants/globalconstants";

import { displayError } from '../../../utilities/helpers/helper'

export const getFieldRule = () => async dispatch => {
  dispatch(setProject())
  fetch(GET, "hydra/fieldRule")
    .then(res => dispatch(setFieldRuleAction(res))).catch(displayError)
}


const setFieldRuleAction = payload => ({ type: types.GET_FIELD_RULE, payload })

export const saveFieldRule = (rule) => async dispatch =>
  fetch(POST, "hydra/fieldRule", rule)
    .then(res => dispatch(setSaveFieldRuleAction(res))).catch(displayError)

const setSaveFieldRuleAction = payload => ({ type: types.CREATE_FIELD_RULE, payload })

const setProject = () => ({
  type: types.SET_PROJECT
});
