import { history } from '../history';
import { authenticationGenerator } from '../utilities/helpers';
import { userService } from './userservice';

export const phaseService = {
    getAllPhases,
    getWorkflowAndAsscoiatedPhases,
    saveWorkflowPhase,
    savePhase,
    purgePhase,
    deletePhase
}

function getAllPhases() {
    const token = authenticationGenerator.generateAuthenticationToken(localStorage.getItem('username'),
        localStorage.getItem('password'));
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': token }
    };
    return fetch('/hydra/phase', requestOptions)
        .then(handleResponse).then(phaseData => {
            return phaseData;
        }).catch(err => {
            console.log("Error :: ", err)
        });
}
function getWorkflowAndAsscoiatedPhases() {
    const token = authenticationGenerator.generateAuthenticationToken(localStorage.getItem('username'),
        localStorage.getItem('password'));
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': token }
    };
    return fetch('/hydra/workflowphases', requestOptions)
        .then(handleResponse).then(workflowphaseData => {
            return filterPhases(workflowphaseData);
        }).catch(err => {
            console.log("Error :: ", err)
        });
}
function filterPhases(workflowphaseData) {
    let filteredPhases = [];
    let activeWorkflow = localStorage.getItem('active-workflow-uuid');
    workflowphaseData.workflowPhasesMap.forEach(element => {
        if (activeWorkflow === element.workflowUUID) {
            filteredPhases.push(element);
        }
    });
    return filteredPhases;
}

function savePhase(phase) {
    const token = authenticationGenerator.generateAuthenticationToken(localStorage.getItem('username'),
        localStorage.getItem('password'));
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify(phase)
    };
    return fetch('/hydra/phase', requestOptions)
        .then(handleResponse).then(phaseData => {
            return phaseData;
        }, error => console.log("error  ", error)).catch(() => console.log("error"));
}


function saveWorkflowPhase(phase) {
    const token = authenticationGenerator.generateAuthenticationToken(localStorage.getItem('username'),
        localStorage.getItem('password'));
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify(phase)
    };
    return fetch('/hydra/workflowphases', requestOptions)
        .then(handleResponse).then(phaseData => {
            return phaseData;
        }, e => console.log('error', e)
        ).catch(err => {
            console.log("Error :: ", err)
        });
}

function purgePhase(phase) {
    const token = authenticationGenerator.generateAuthenticationToken(localStorage.getItem('username'),
        localStorage.getItem('password'));

    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify(phase)
    };
    return fetch('/hydra/workflow', requestOptions)
        .then(handleResponse).then(phaseData => {
            return phaseData;
        }, error => console.log("error", error)
        ).catch(err => {
            console.log("Error :: ", err)
        });
}


function deletePhase(uuid) {
    const token = authenticationGenerator.generateAuthenticationToken(localStorage.getItem('username'),
        localStorage.getItem('password'));

    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': token }
    };
    return fetch('/hydra/workflowphases/' + uuid, requestOptions)
        .then(handleResponse).then(workflowData => {
            return workflowData;
        }).catch(err => {
            console.log("Error :: ", err)
        });
}

function handleResponse(response) {
    if (!response.ok) {
        throw Error(response.statusText + " - " + response.url)
    }
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                userService.logOutService();
                history.push('/login');
            }
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}