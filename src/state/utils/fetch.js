import { authenticationGenerator } from '../../utilities/helpers';
import { userService } from '../../services/userservice';
import { history } from '../../history';
import { displayError, createNotification } from '../../utilities/helpers/helper'
import {BASE_URL} from '../../utilities/constants/globalconstants'
export default async (method, path, data) => {
  const token = authenticationGenerator.generateAuthenticationToken(localStorage.getItem('username'),
    localStorage.getItem('password'));
  const requestOptions = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
      'Accept': 'application/json'
    },
    body: JSON.stringify(data)
  };

  return fetch(path, requestOptions)
    .then(CheckError)
    .then((data) => {
      console.log("Fetch data ", data)
      return Promise.resolve(data ? data : {})
    })
    .catch((error) => {
      console.log("Fetch Error ", error)
      return Promise.reject(error)
    })

  //   return fetch(path, requestOptions)
  //     .then(handleResponse).then(response => {
  //       return response;
  //     }).catch((error) => {

  //     });
};

function CheckError(response) {
  if (response.ok) {
     return response.json();
  } else {
    if (response.status === 401) {
      userService.logOutService();
      history.push('/login');
    }
    throw Error(response.statusText);
  }
}


async function handleResponse(response) {
  // console.log("api Response ....", response);
  return await response.text().then(text => {
    if (!response.ok) {
      if (response.status === 401) {
        userService.logOutService();
        history.push('/login');
      } else if (response.status === 500) {
        console.log("Form ....", text);
      }
      const error = response.statusText;
      return Promise.reject(error)
    }

    const data = text && JSON.parse(text);
    console.log("api data ....", text);
    return Promise.resolve(data);
  });
}
