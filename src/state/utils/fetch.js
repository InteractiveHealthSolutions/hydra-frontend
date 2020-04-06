import { authenticationGenerator } from '../../utilities/helpers';
import { userService } from '../../services/userservice';
import { history } from '../../history';
import { displayError, createNotification } from '../../utilities/helpers/helper'
import { BASE_URL } from '../../utilities/constants/globalconstants'

export default async (method, path, data) => {
  const token = authenticationGenerator.generateAuthenticationToken(localStorage.getItem('username'),
    localStorage.getItem('password'));
  console.log("token", token)
  const requestOptions = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify(data)
  };
  console.log("path", path, requestOptions)
  return fetch(`${BASE_URL}/ ${path}`, requestOptions)
    .then(handleResponse).then(response => {
      console.log("api Response ....", response);
      return response;
    }).catch(displayError);
};

async function handleResponse(response) {
  console.log("api Response ....", response);
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
    console.log("api data ....", data);
    return Promise.resolve(data);
  });
}
