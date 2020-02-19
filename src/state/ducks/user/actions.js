import * as types from "./types";
import { fetch } from "../../utils";
import {
  POST,
  GET,
  DELETE,
} from "../../../utilities/constants/globalconstants";
import { displayError, createNotification } from '../../../utilities/helpers/helper'

export const searchUser = (name) => async dispatch =>
  fetch(GET, `user?v=full&&q=${name}`)
    .then(res => { dispatch(setSearchAction(res)) }).catch(displayError)

const setSearchAction = (payload) => ({ type: types.SEARCH_USER, payload })

export const saveUser = (User) => async dispatch =>
  fetch(POST, "user", User)
    .then(res => dispatch(userSaveAction(res))).catch(displayError)

const userSaveAction = (payload) => ({ type: types.GET_ALL_USER, payload })

export const editUsers = (uuid, user) => async dispatch =>
  fetch(POST, "user/" + uuid, user)
    .then(res => dispatch(userUpdateAction(res))).catch(displayError)

const userUpdateAction = (payload) => ({ type: types.UPDATE_USER, payload })

export const fetchUsers = () => async dispatch => {
  dispatch(setProject())
  fetch(GET, "user?v=full")
    .then(res => dispatch(userFetchAction(res))).catch(displayError)
}


const userFetchAction = (payload) => ({ type: types.GET_ALL_USER, payload })


const setProject = () => ({
  type: types.SET_PROJECT
});

const setError = ({

  type: types.SET_ERROR
})
