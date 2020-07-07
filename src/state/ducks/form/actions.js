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
    .then(res => {
      dispatch(setForm(res))
    })
    .catch((error) => {
      console.error("form fetch error", error)
      dispatch(setError(error))
    });
}

const setForm = payload => ({ type: types.GET_ALL_FORM, payload });

export const searchForm = componentUuid => async dispatch =>
  fetch(GET, "/hydra/form?q=" + componentUuid)
    .then(res => dispatch(setSearchForm(res)))
    .catch(displayError);
const setSearchForm = payload => ({ type: types.SEARCH_FORM, payload });

export const saveComponentFormRelation = componentform => async dispatch => {
  dispatch(setProject())
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
    .then(res => {
      console.log("componentform res ", res)
      dispatch(getComponentFormRelations(filterStageForm(res, filterWith, phaseUuid)))
    })
    .catch((error) => {
      console.error("componentform error ", error)
      dispatch(setError(error))
    });
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
  if (filterWith === "dataview" && phaseUuid) {
    phase = phaseUuid;
    workflow = localStorage.getItem("selectedWorkflowId")
    activeComponent = null
  } else {
    phase = localStorage.getItem("active-phases-uuid");
    workflow = localStorage.getItem("active-workflow-uuid")
    activeComponent = localStorage.getItem("active-component-uuid");
  }

  console.log("componentForms Form vv ", StageFormData)
  StageFormData.ComponentsFormsMap.forEach(element => {
    if (activeComponent === null) {
      if (phase === element.phase.uuid && workflow === element.workflow.uuid) {
        filteredForm.push(element);
      }
    } else if (activeComponent === element.component.uuid && phase === element.phase.uuid && workflow === element.workflow.uuid) {
      filteredForm.push(element);
    }
  });
  return filteredForm;
}

export const deleteComponentFormRelation = uuid => async dispatch => {
  dispatch(setProject())
  fetch(DELETE, "/hydra/componentform/" + uuid)
    .then(res => dispatch(setDeleteComponentFormRelations(res)))
    .catch((error) => {
      console.error("componentform error ", error)
      dispatch(setError(error))
    });
};
const setDeleteComponentFormRelations = payload => ({
  type: types.DELETE_COMPONENT_FORM_RELATION,
  payload
});

export const formSubmission = (formData) => async dispatch => {
  dispatch(setProject())
  fetch(POST, "/hydra/form-submission", formData)
    .then(res => dispatch(setFormSubmission(res)))
    .catch((error) => {
      console.error("componentform error ", error)
      dispatch(setError(error))
    });
}
const setFormSubmission = payload => ({
  type: types.FORM_SUBMISSION,
  payload
});

export const getComponentFormByComponent = uuid => async dispatch => {
  dispatch(setProject())
  fetch(GET, "/hydra/componentform?q=" + uuid)
    .then(res => dispatch(getComponentFormByComponentAction(res)))
    .catch((error) => {
      console.error("componentform error ", error)
      dispatch(setError(error))
    });
};
const getComponentFormByComponentAction = payload => ({
  type: types.GET_COMPONENT_FORM_BY_COMPONENT,
  payload
});

export const getComponentFormByUUID = uuid => async dispatch => {
  dispatch(setProject())
  fetch(GET, "/hydra/componentform/" + uuid)
    .then(res => dispatch(getComponentFormByUUIDAction(res)))
    .catch((error) => {
      console.error("componentform error ", error)
      dispatch(setError(error))
    });
};
const getComponentFormByUUIDAction = payload => ({
  type: types.GET_COMPONENT_FORM_BY_UUID,
  payload
});

export const getFormFieldsByForm = uuid => async dispatch => {
  dispatch(setProject())
  fetch(GET, "/hydra/form-field?q=" + uuid)
    .then(res => dispatch(getFormFieldsByFormAction(res)))
    .catch((error) => {
      console.error("componentform error ", error)
      dispatch(setError(error))
    });
};
const getFormFieldsByFormAction = payload => ({
  type: types.GET_FORM_FIELDS_BY_FORM,
  payload
});


export const getFormFieldsByUUID = uuid => async dispatch => {
  dispatch(setProject())
  fetch(GET, "/hydra/form-field/" + uuid)
    .then(res => dispatch(getFormFieldsByUUIDAction(res)))
    .catch((error) => {
      console.error("componentform error ", error)
      dispatch(setError(error))
    });
};
const getFormFieldsByUUIDAction = payload => ({
  type: types.GET_FORM_FIELD_BY_UUID,
  payload
});



const setProject = () => ({
  type: types.SET_PROJECT
});

const setError = payload => ({
  type: types.GET_ALL_FORM + REJECTED,
  payload
});
