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
    .then(res => dispatch(conceptByUUIDGetAction(res))).catch(displayError);
const conceptByUUIDGetAction = payload => ({ type: types.GET_CONCEPT_BY_UUID, payload })

export const getAllConcepts = () => async dispatch =>{
  dispatch(setProject())
  fetch(GET,"/concept?v=full")
  .then(res => dispatch(allConceptsGetOption(res))).catch(displayError);
}
  const allConceptsGetOption = payload => ({type: types.GET_ALL_CONCEPTS, payload})

const setProject = () => ({
  type: types.SET_PROJECT_CONCEPT
});
