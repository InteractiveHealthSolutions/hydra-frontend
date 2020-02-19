import { history } from '../history';
import { authenticationGenerator } from '../utilities/helpers';

export const questionService = {
    saveConcept,
    saveField

}


function saveConcept(concept) {
    const token = authenticationGenerator.generateAuthenticationToken(localStorage.getItem('username'),
        localStorage.getItem('password'));
                console.log("concept res",concept);
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify(concept)
    };
    return fetch('concept', requestOptions)
        .then(handleResponse).then(conceptData => {
            console.log("concept res",conceptData);
            return conceptData;
        }, e => console.log('error', e)
        ).catch(err => {
            console.log("Error :: ", err)
        });
}

function saveField(field) {
    const token = authenticationGenerator.generateAuthenticationToken(localStorage.getItem('username'),
        localStorage.getItem('password'));
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify(field)
    };
    return fetch('/hydra/field', requestOptions)
        .then(handleResponse).then(fieldData => {
            return fieldData;
        }, e => console.log('error', e)
        ).catch(err => {
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
                history.push('/login');
            }
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}