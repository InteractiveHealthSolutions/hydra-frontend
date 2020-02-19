import * as types from "./types";
import { fetch } from "../../utils";
import {
  GET,
} from "../../../utilities/constants/globalconstants";
import { REJECTED } from "../../../utilities/constants/globalconstants";
import { displayError, createNotification } from '../../../utilities/helpers/helper'

export const fetchLabTestType = () => async dispatch => {
  dispatch(setProject)
  fetch(GET, "commonlab/labtesttype")
    .then(res => {
      dispatch(setLabTestAction(res))
    }).catch(displayError)
}

const setLabTestAction = (payload) => ({ type: types.GET_ALL_LAB_TEST_TYPE, payload })


const setProject = () => ({
  type: types.SET_PROJECT
});

const setError = payload => ({
  type: types.GET_ALL_LAB_TEST_TYPE + REJECTED,
  payload
});