import { history } from '../history';
import { authenticationGenerator } from '../utilities/helpers';
import { userService } from './userservice';

export const componentService = {
    getAllComponents,
    saveComponent,
    getPhaseAndAsscoiatedComponents,
    purgeComponent,
    savePhaseAndAsscoiatedComponent,
    deleteComponent
}

function getAllComponents() {
    const token = authenticationGenerator.generateAuthenticationToken(localStorage.getItem('username'),
        localStorage.getItem('password'));
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': token }
    };
    return fetch('/hydra/component', requestOptions)
        .then(handleResponse).then(componentData => {
            return componentData;
        });
}

function getPhaseAndAsscoiatedComponents() {
    const token = authenticationGenerator.generateAuthenticationToken(localStorage.getItem('username'),
        localStorage.getItem('password'));
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': token }
    };
    return fetch('/hydra/phasecomponent', requestOptions)
        .then(handleResponse).then(phaseComponentData => {
           // console.log("phases component :: " + JSON.stringify(phaseComponentData))
            return filterComponent(phaseComponentData);
        });
}

function filterComponent(phaseComponentData) {
    let filteredComponent = [];
    let activePhase = localStorage.getItem('active-phases-uuid');
    let activeWorkflow = localStorage.getItem('active-workflow-uuid');
    phaseComponentData.PhaseComponentsMap.forEach(element => {
       // console.log("active pase :: ", activePhase)
        //console.log("Hydra phase uuid",element.phaseUUID)
        if (activePhase === element.phaseUUID && activeWorkflow === element.workflowUUID) {
            filteredComponent.push(element);
        }
    });
    //console.log("filter phase data ::: " + JSON.stringify(filteredComponent))
    return filteredComponent;
}

function saveComponent(component) {
    const token = authenticationGenerator.generateAuthenticationToken(localStorage.getItem('username'),
        localStorage.getItem('password'));

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify(component)
    };
    return fetch('/hydra/component', requestOptions)
        .then(handleResponse).then(componentData => {
            return componentData;
        }).catch(function () {
            console.log("error");
        });

}

function savePhaseAndAsscoiatedComponent(component) {
    //console.log("goin to save :: ",JSON.stringify(component))
    const token = authenticationGenerator.generateAuthenticationToken(localStorage.getItem('username'),
        localStorage.getItem('password'));

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify(component)
    };
    return fetch('/hydra/phasecomponent', requestOptions)
        .then(handleResponse).then(componentData => {
            //console.log("save component ",componentData)
            return componentData;
        },error => console.log("error  ", error)).catch(function () {
            console.log("error");
        });

}

function deleteComponent(uuid) {
    const token = authenticationGenerator.generateAuthenticationToken(localStorage.getItem('username'),
        localStorage.getItem('password'));

    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': token }
    };
    return fetch('/hydra/phasecomponent/'+uuid, requestOptions)
        .then(handleResponse).then(workflowData => {
            return workflowData;
        });
}

function purgeComponent(component) {
    const token = authenticationGenerator.generateAuthenticationToken(localStorage.getItem('username'),
        localStorage.getItem('password'));

    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify(component)
    };
    return fetch('/hydra/component', requestOptions)
        .then(handleResponse).then(componentData => {
            return componentData;
        }).catch(function () {
            console.log("error");
        });

}

function handleResponse(response) {
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