import { history } from '../history';
import { authenticationGenerator } from '../utilities/helpers';
import { userService } from './userservice';

export const formService = {
    getAllForms,
    saveForm,
    purgeForm
}

function getAllForms() {
    const token = authenticationGenerator.generateAuthenticationToken(localStorage.getItem('username'),
        localStorage.getItem('password'));
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': token }
    };
    return fetch('/hydra/form', requestOptions)
        .then(handleResponse).then(formData => {
            return formData;
        });
}

function saveForm(form) {
    const token = authenticationGenerator.generateAuthenticationToken(localStorage.getItem('username'),
        localStorage.getItem('password'));

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify(form)
    };
    return fetch('/hydra/form', requestOptions)
        .then(handleResponse).then(formData => {
            return formData;
        }).catch(function () {
            console.log("error");
        });

}

function purgeForm(form) {
    const token = authenticationGenerator.generateAuthenticationToken(localStorage.getItem('username'),
        localStorage.getItem('password'));

    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify(form)
    };
    return fetch('/hydra/form', requestOptions)
        .then(handleResponse).then(formData => {
            return formData;
        }).catch(function () {
            console.log("error");
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