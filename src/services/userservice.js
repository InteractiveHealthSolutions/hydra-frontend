import { authenticationGenerator } from '../utilities/helpers';
import { history } from '../history';
import {BASE_URL} from '../../utilities/constants/globalconstants'
export const userService = {

    logInService,
    logOutService,
    registrationService,
    addProviderService
};
function logInService(username, password) {

    const token = authenticationGenerator.generateAuthenticationToken(username, password);
    const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'Authorization': token }
    };

    

    return fetch(`${BASE_URL}/user?v=full&q=${username}`, requestOptions)
        .then(handleResponseLogin)
        .then(user => {
            if (user === 'authorized') {
                localStorage.setItem('username', username);
                localStorage.setItem('password', password);
            }
            return user;
        });


}

function registrationService(userJSON) {
   // console.log('user  '+JSON.stringify(userJSON))
    const token = authenticationGenerator.generateAuthenticationToken(localStorage.getItem('username'),
        localStorage.getItem('password'));
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify(userJSON)
    };

    return fetch('/user', requestOptions).then(handleResponse);
}
function addProviderService(provider) {
    const token = authenticationGenerator.generateAuthenticationToken(localStorage.getItem('username'),
        localStorage.getItem('password'));
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': token },
        body: JSON.stringify(provider)
    };

    return fetch('/provider', requestOptions).then(handleResponse)
}

function logOutService() {

    localStorage.removeItem('username');

    localStorage.removeItem('password');

     localStorage.removeItem('activeTab');
    
}   

function handleResponseLogin(response) {
    return response.text().then(text => {
        if (!response.ok) {
            if (response.status === 401) {
                logOutService();

            }
            return 'unauthorized';
        }
        return 'authorized';
    });
}
function handleResponse(response) {
    return response.text().then(text => {
       // console.log("userResp error:: ", JSON.stringify(text) )
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                logOutService();
                alert('Session expired! Please login again');
                history.push('/login');
            }

            const  error = (data && data.error.message);
           // console.log("userResp error:: ", JSON.stringify(data) )
            return Promise.reject(error);

        }
       // console.log("userResp :: ",data)
        return data;
    });
}