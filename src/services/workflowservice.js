import { history } from '../history';
import { authenticationGenerator } from '../utilities/helpers';
import { userService } from './userservice';
import {createNotification} from '../utilities/helpers/helper'

export const workflowService = {
    getAllWorkflow,
    saveWorkflow,
    purgeWorflow,
    deleteWorflow
}

function getAllWorkflow() {
    
    const token = authenticationGenerator.generateAuthenticationToken(localStorage.getItem('username'),
        localStorage.getItem('password'));
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': token }
    };
    return fetch('/hydra/workflow', requestOptions)
        .then(handleResponse).then(workflowData => {
            return workflowData;
        }).catch(err => {
            createNotification({
                type: "error",
                text: `some issue occure`
              });
            console.log("Error :: ", err)
        });
}

function saveWorkflow(workflow) {
    const token = authenticationGenerator.generateAuthenticationToken(localStorage.getItem('username'),
        localStorage.getItem('password'));

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify(workflow)
    };
    return fetch('/hydra/workflow', requestOptions)
        .then(handleResponse).then(workflowData => {
            return workflowData;
        }).catch(err => {
            console.log("Error :: ", err)
        });
}
function getRequiredFormate(workflow) {

    return {
        "workflowId": workflow.workflowId,
        "uuid": workflow.uuid,
        "retired": true,
        "name": workflow.name
    }
}
function purgeWorflow(workflow) {
    const token = authenticationGenerator.generateAuthenticationToken(localStorage.getItem('username'),
        localStorage.getItem('password'));

    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify(workflow)
    };
    return fetch('/hydra/workflow', requestOptions)
        .then(handleResponse)
        .then(workflowData => {
            return workflowData;
        }).catch(err => {
            console.log("Error :: ", err)
        });
}


function deleteWorflow(uuid) {
    const token = authenticationGenerator.generateAuthenticationToken(localStorage.getItem('username'),
        localStorage.getItem('password'));

    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': token }
    };
    return fetch('/hydra/workflow/' + uuid, requestOptions)
        .then(handleResponse).then(workflowData => {
            return workflowData;
        }).catch(err => {
            console.log("Error :: ", err)
        });
}

function handleResponse(response) {
    return response.text().then(text => {
        if (!response.ok) {
            if (response.status === 401) {
                userService.logOutService();
                history.push('/login');
            }
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error)
        }
        const data = text && JSON.parse(text);
        return Promise.resolve(data);
    });
}