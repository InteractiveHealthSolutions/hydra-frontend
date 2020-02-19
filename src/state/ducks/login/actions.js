import * as types from "./types";
import { authenticationGenerator } from '../../../utilities/helpers';
import { history } from '../../../history';



export const login = (username, password) => async dispatch => {
  const token = authenticationGenerator.generateAuthenticationToken(username, password);
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Request-Method': '*',
      'Access-Control-Request-Headers': '*',
      'Authorization': token,
    }
  };

  await fetch(`user?v=full&q=${username}`, requestOptions)
    .then(handleResponseLogin)
    .then(user => {
      if (user === 'authorized') {

        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        console.log("success", username)
        dispatch(success(username));
        history.push("/");
      }
      else {
        console.log("failure", username)
        dispatch(failure(username));
        //history.push("/login");
        // window.location.reload();
      }
    }).catch(dispatch(failure(username)))
}

const request = (user) => { return { type: types.LOGIN_REQUEST, user } };
const success = (user) => { return { type: types.LOGIN_SUCCESS, user } };
const failure = (user) => { return { type: types.LOGIN_FAILURE, user } };


const handleResponseLogin = (response) => {
  return response.text().then(text => {
    console.log("handleResponseLogin", text)
    if (!response.ok) {
      if (response.status === 401) {
        logout()
      }
      return 'unauthorized';
    }
    return 'authorized';
  });
}

export const logout = () => async dispatch => {
  localStorage.removeItem('username');
  localStorage.removeItem('password');
  localStorage.removeItem('activeTab');
  history.push('/login');
  return { type: types.LOGOUT };
}

