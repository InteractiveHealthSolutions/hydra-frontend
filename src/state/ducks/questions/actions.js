import * as types from "./types";
import { history } from '../../../history';
import { fetch } from "../../utils";
import {
  POST,
  DELETE,
  GET,
} from "../../../utilities/constants/globalconstants";

import { displayError } from '../../../utilities/helpers/helper'



export const saveQuestion = (Question) => async dispatch =>
  fetch(POST, "/hydra/field", Question)
    .then(res => dispatch(QuestionSaveAction(res))).catch(displayError)

const QuestionSaveAction = (payload) => ({ type: types.CREATE_QUESTION, payload })

//not in use
export const saveConcept = (Concept) => async dispatch =>
  fetch(POST, "/concept", Concept)
    .then(res => dispatch(ConceptSaveAction(res))).catch(displayError)

const ConceptSaveAction = (payload) => ({ type: types.CREATE_CONCEPT, payload })

export const getAllQuestion = () => async dispatch => {
  dispatch(setProject())
  fetch(GET, "/hydra/hydra-field?v=full")
    .then(res => dispatch(QuestionGetAction(res))).catch(displayError)
}


const QuestionGetAction = payload => ({ type: types.GET_ALL_QUESTION, payload })

export const searchConcept = (conceptName) => async dispatch =>
  fetch(GET, "/concept?v=full&limit=10&q=" + conceptName)
    .then(res => dispatch(SearchConceptAction(res))).catch(displayError)

const SearchConceptAction = (payload) => ({ type: types.SEARCH_CONCEPT, payload })

export const searchField = (field) => async dispatch => {
  dispatch(setProject())
  fetch(GET, "/hydra/field?q=" + field)
    .then(res => dispatch(SearchFieldAction(res))).catch(displayError)
}


const SearchFieldAction = (payload) => ({ type: types.SEARCH_FIELD, payload })


const setProject = () => ({
  type: types.SET_PROJECT_QUESTION
});
