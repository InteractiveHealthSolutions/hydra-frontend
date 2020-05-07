import * as types from "./types";
import { fetch } from "../../utils";
import {
  POST,
  GET,
  DELETE
} from "../../../utilities/constants/globalconstants";
import { REJECTED } from "../../../utilities/constants/globalconstants";
import { displayError } from "../../../utilities/helpers/helper";

export const saveForm = Form => async dispatch => {
  //dispatch(setProject)
  fetch(POST, "/hydra/form", Form)
    .then(res => dispatch(formAction(res)))
    .catch(displayError);
  const formAction = payload => ({
    type: types.CREATE_FORM,
    payload
  });
}


export const fetchForms = () => async dispatch => {
  dispatch(setProject())
  fetch(GET, "/hydra/form?v=full")
    .then(res => dispatch(setForm(res)))
    .catch(displayError);
}

const setForm = payload => ({ type: types.GET_ALL_FORM, payload });

export const searchForm = componentUuid => async dispatch =>
  fetch(GET, "/hydra/form?q=" + componentUuid)
    .then(res => dispatch(setSearchForm(res)))
    .catch(displayError);
const setSearchForm = payload => ({ type: types.SEARCH_FORM, payload });

export const saveComponentFormRelation = componentform => async dispatch => {
  fetch(POST, "/hydra/componentform", componentform)
    .then(res => dispatch(setComponentFormRelation(res)))
    .catch(displayError);
};

const setComponentFormRelation = payload => ({
  type: types.CREATE_COMPONENT_FORM_RELATION,
  payload
});

export const getFormByUuid = (uuid) => async dispatch =>
  fetch(GET, "/hydra/form/" + uuid)
    .then(res => dispatch(setFormByUuidAction(res))).catch(displayError)
const setFormByUuidAction = (payload) => ({ type: types.GET_FORM_BY_UUID, payload })


export const getComponentFormRelation = (filterWith, phaseUuid) => async dispatch => {
  dispatch(setProject())
  fetch(GET, "/hydra/componentform")
    .then(res => dispatch(getComponentFormRelations(filterStageForm(res, filterWith, phaseUuid))))
    .catch(displayError);
};
const getComponentFormRelations = payload => ({
  type: types.GET_COMPONENT_FORM_RELATION,
  payload
});

function filterStageForm(StageFormData, filterWith, phaseUuid) {
  let filteredForm = [];
  let phase = "";
  let workflow = "";
  let activeComponent = "";
  if (filterWith === "dataview" && phaseUuid ) {
    phase = phaseUuid;
    workflow = localStorage.getItem("selectedWorkflowId")
    activeComponent = null
  } else {
    phase = localStorage.getItem("active-phases-uuid");
    workflow = localStorage.getItem("active-workflow-uuid")
    activeComponent = localStorage.getItem("active-component-uuid");
  }

  StageFormData.ComponentsFormsMap.forEach(element => {
    if (activeComponent === null) {
        if (phase === element.phase.uuid && workflow === element.workflow.uuid) {
          filteredForm.push(element);
        }
    } else if (activeComponent === element.component.uuid && phase === element.phase.uuid && workflow === element.workflow.uuid) {
      filteredForm.push(element);
    }
  });
  console.log("componentForms Form vv ", filteredForm)
  return filteredForm;
}

export const deleteComponentFormRelation = uuid => async dispatch => {
 // console.log(" called");
  fetch(DELETE, "/hydra/componentform/" + uuid)
    .then(res => dispatch(setDeleteComponentFormRelations(res)))
    .catch(displayError);
};
const setDeleteComponentFormRelations = payload => ({
  type: types.GET_COMPONENT_FORM_RELATION,
  payload
});

export  const formSubmission  = (formData) => async dispatch =>{
  dispatch(setProject())
  fetch(POST, "/hydra/formSubmission", formData)
    .then(res => dispatch(setFormSubmission(res)))
    .catch(displayError);
}
const setFormSubmission = payload => ({
  type: types.FORM_SUBMISSION,
  payload
});

const setProject = () => ({
  type: types.SET_PROJECT
});

const setError = payload => ({
  type: types.GET_ALL_FORM + REJECTED,
  payload
});
