import * as types from "./types";
import { history } from '../../../history';
import { fetch } from "../../utils";
import {
  POST,
  PUT,
  DELETE,
  GET,
} from "../../../utilities/constants/globalconstants";

import { displayError } from '../../../utilities/helpers/helper'

export const getAllLabTestAttribute = () => async dispatch =>
  fetch(GET, "/commonlab/labtestattributetype?v=full")
    .then(res => dispatch(labtestattributeGetAction(res))).catch(displayError)

const labtestattributeGetAction = payload => ({ type: types.GET_ALL_LABTESTATTRIBUTE, payload })

export const getLabTestAttributeForOrder = (searchQuery) => async dispatch =>
  fetch(GET, "/commonlab/labtestattributetype?v=full&testTypeUuid="+searchQuery)
    .then(res => dispatch(labtestattributefororderGetAction(res))).catch(displayError)

const labtestattributefororderGetAction = payload => ({ type: types.GET_LABTESTATTRIBUTE_FOR_ORDER, payload })

export const getTestResultForOrder = (searchQuery) => async dispatch =>
  fetch(GET, "/commonlab/labtestattribute?v=full&testOrderId="+searchQuery)
    .then(res => dispatch(labtestresultGetAction(res))).catch(displayError)

const labtestresultGetAction = payload => ({ type: types.GET_LABTEST_RESULTS, payload })
