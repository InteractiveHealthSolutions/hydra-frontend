import * as types from "./types";
import { fetch } from "../../utils";
import {
  POST,
  GET,
  DELETE
} from "../../../utilities/constants/globalconstants";
import { REJECTED } from "../../../utilities/constants/globalconstants";
import { displayError } from "../../../utilities/helpers/helper";

export const saveForm = Form => async dispatch =>
  fetch(POST, "hydra/form", Form)
    .then(res => dispatch(formAction(res)))
    .catch(displayError);
const formAction = payload => ({
  type: types.CREATE_FORM,
  payload
});

export const fetchForms = () => async dispatch =>
  fetch(GET, "hydra/form")
    .then(res => dispatch(setForm(res)))
    .catch(displayError);
const setForm = payload => ({ type: types.GET_ALL_FORM, payload });

export const searchForm = componentUuid => async dispatch =>
  fetch(GET, "hydra/form?q=" + componentUuid)
    .then(res => dispatch(setSearchForm(res)))
    .catch(displayError);
const setSearchForm = payload => ({ type: types.SEARCH_FORM, payload });

export const saveComponentFormRelation = componentform => async dispatch => {
  console.log(" called", componentform);
  fetch(POST, "hydra/componentform", componentform)
    .then(res => dispatch(setComponentFormRelation(res)))
    .catch(displayError);
};

const setComponentFormRelation = payload => ({
  type: types.CREATE_COMPONENT_FORM_RELATION,
  payload
});

export const getComponentFormRelation = () => async dispatch => {
  console.log(" called");
  fetch(GET, "hydra/componentform")
    .then(res => dispatch(getComponentFormRelations(filterStageForm(res))))
    .catch(displayError);
};
const getComponentFormRelations = payload => ({
  type: types.GET_COMPONENT_FORM_RELATION,
  payload
});

async function filterStageForm(StageFormData) {
  let filteredForm = [];
  let activeComponent = localStorage.getItem("active-component-uuid");
  console.log("filterForm StageFormData", StageFormData);
  await StageFormData.ComponentsFormsMap.forEach(element => {
    if (activeComponent === element.component.uuid) {
      filteredForm.push(element);
    }
  });
  console.log("filterForm", filteredForm);
  return filteredForm;
}

export const deleteComponentFormRelation = uuid => async dispatch => {
  console.log(" called");
  fetch(DELETE, "hydra/componentform/" + uuid)
    .then(res => dispatch(setDeleteComponentFormRelations(res)))
    .catch(displayError);
};
const setDeleteComponentFormRelations = payload => ({
  type: types.GET_COMPONENT_FORM_RELATION,
  payload
});

const setProject = () => ({
  type: types.SET_PROJECT
});

const setError = payload => ({
  type: types.GET_ALL_FORM + REJECTED,
  payload
});
