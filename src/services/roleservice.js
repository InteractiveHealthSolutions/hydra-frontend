import { authenticationGenerator } from '../utilities/helpers';
import { userService } from './userservice';
import { history } from '../history';
export const roleservice = {
    getAllRoles
}

function getAllRoles() {
    const token = authenticationGenerator.generateAuthenticationToken(localStorage.getItem('username'),
        localStorage.getItem('password'));
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': token }
    };
    return fetch('/role', requestOptions)
        .then(handleResponse).then(roleData => {
            return roleData;
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