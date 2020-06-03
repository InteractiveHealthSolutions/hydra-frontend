import * as types from "./types";
import { fetch } from "../../utils";
import { roleJSON } from '../../../utilities/helpers'

import {
  POST,
  PUT,
  DELETE,
  GET,
} from "../../../utilities/constants/globalconstants";

import { displayError } from '../../../utilities/helpers/helper'

export const getRoles = () => async dispatch => {
  dispatch(setProject())
  fetch(GET, "/role?v=full")
    .then(res => dispatch(rolesGetAction(res))).catch(displayError)
}


const rolesGetAction = payload => ({ type: types.GET_ROLES, payload })

export const postRole = (data) => async dispatch =>
  fetch(POST, "/role", roleJSON(data))
    .then(res => { dispatch(postRoleOption(res)); dispatch(getRoles()) }).catch(displayError)
const postRoleOption = payload => ({ type: types.ADD_ROLES, payload })

export const putRole = (data, uuid) => async dispatch =>
  fetch(POST, "/role/" + uuid, roleJSON(data)).
    then(res => { dispatch(postRoleOption(res)); dispatch(getRoles()) }).catch(displayError)

export const deleteRole = (uuid) => async dispatch => 
  fetch(DELETE,"/role/"+uuid+"?purge=true").
    then(res => {dispatch(deleteRoleOption(res))}).catch(displayError)

const deleteRoleOption = payload => ({type : types.DELETE_ROLE, payload})

export const getUsersByRole = (uuid) => async dispatch => 
  fetch(GET,"/hydra/customservices/getUserByRole?role="+uuid)
   .then(res => {dispatch(getUsersByRoleAction(res))}).catch(displayError)

const getUsersByRoleAction = payload => ({type : types.GET_USERS_BY_ROLE, payload});

export const getRoleByUUID = (uuid) => async dispatch =>
  fetch(GET,"/role/"+uuid+"?v=full")
   .then(res => {dispatch(getRoleByUUIDAction(res))}).catch(displayError)

const getRoleByUUIDAction = payload => ({type : types.GET_ROLE_BY_UUID, payload})
const setProject = () => ({
  type: types.SET_PROJECT
});   