import * as types from "./types";
import { authenticationGenerator } from '../../../utilities/helpers';
import { history } from '../../../history';
import { BASE_URL } from '../../../utilities/constants/globalconstants'
let axios = require('axios');


export const login = (username, password) => async dispatch => {
  dispatch(setProject())
 console.log("BASE_URL" ,BASE_URL)
  const token = authenticationGenerator.generateAuthenticationToken(username, password);
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    }
  };

  await fetch(`user?v=full&q=${username}`, requestOptions)
    .then(handleResponseLogin)
    .then(user => {
      if (user === 'authorized') {
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        dispatch(success(username));
        history.push("/");
      }
      else {
        dispatch(failure(username));
      }
    })
}

const request = (user) => { return { type: types.LOGIN_REQUEST, user } };
const success = (user) => { return { type: types.LOGIN_SUCCESS, user } };
const failure = (user) => { return { type: types.LOGIN_FAILURE, user } };


const handleResponseLogin = (response) => {
  return response.text().then(text => {
    if (!response.ok) {
      if (response.status === 401) {
        logout()
      }
      return 'unauthorized';
    }
    localStorage.setItem('active_user', JSON.stringify(JSON.parse(text).results[0].privileges))
    return 'authorized';
  });
}

export const logout = () => async dispatch => {
  localStorage.removeItem('username');
  localStorage.removeItem('password');
  localStorage.removeItem('activeTab');
  localStorage.removeItem('active_user');
  dispatch(requestLogout())
  history.push('/login');
}


const requestLogout = () => { return { type: types.LOGOUT } };

const setProject = () => ({

  type: types.SET_PROJECT

});

export const loginTest = (username, password) => dispatch => {
  var basicAuth2 = authenticationGenerator.generateAuthenticationToken(username, password);
  let URL = `http://ihs.ihsinformatics.com:9990/aahung-aagahi/api/user/username/` + username; console.log(URL);
  return axios.get(URL,
    {
      'headers': { 'Authorization': basicAuth2, }
    }).then(response => {
      console.log("axios axios", response.data);
      console.log(">>>> USERNAME");
      console.log(response.data.username);
      dispatch(success(username));
      return response;
    }).catch((error) => {
      console.log(typeof error);
      console.log('error ' + error);
      return error;
    });
} 