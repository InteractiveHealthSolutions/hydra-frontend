import { history } from "../history";
import { authenticationGenerator } from "../utilities/helpers";
import { existsTypeAnnotation } from "@babel/types";
import { BASE_URL } from "../utilities/constants/globalconstants";
import { userService } from '../services/userservice';

export const reportService = {
  downloadReport,
  downloadDump,
  getFormsByWorkflow
};
function downloadReport(params, name, ext) {
  const token = authenticationGenerator.generateAuthenticationToken(
    localStorage.getItem("username"),
    localStorage.getItem("password")
  );
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: token }
  };
  return fetch(`${BASE_URL}/hydra/report?` + params, requestOptions).then(response =>
    handleResponse(response, name, ext)
  );
}

function downloadDump(params, name, ext) {
  const token = authenticationGenerator.generateAuthenticationToken(
    localStorage.getItem("username"),
    localStorage.getItem("password")
  );
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: token }
  };
  return fetch(`${BASE_URL}/hydra/report/dump/` + name + "?" + params,
    requestOptions
  ).then(response => handleResponse(response, name, ext));
}

function getFormsByWorkflow(workflow) {
  const token = authenticationGenerator.generateAuthenticationToken(
    localStorage.getItem("username"),
    localStorage.getItem("password")
  );
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: token }
  };
  return fetch(`${BASE_URL}/hydra/componentform`, requestOptions)
    .then(handleFormResponse)
    .then(response =>
      filterFormsByWorkflow(workflow, response)
    );
}



async function handleFormResponse(response) {
  return await response.text().then(text => {
    if (!response.ok) {
      if (response.status === 401) {
        userService.logOutService();
        history.push('/login');
      }
      const error = response.statusText;
      console.log("api error ....", error);
      return Promise.reject(error)
    }
    const data = text && JSON.parse(text);
    return Promise.resolve(data);
  });
}


function handleResponse(response, name, ext) {
  return response.blob().then(blob => {
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = name + "." + ext;
    a.click();
  });
}

function filterFormsByWorkflow(workflow, response) {
  console.log("############## FORMS BY WORKFLOW ###############", response);
  let filteredForm = [];

  // filter forms by workflow
  response.ComponentsFormsMap.forEach(element => {
    if (workflow === element.workflow.uuid) {
      filteredForm.push(element);
    }
  });

  return filteredForm;
}
