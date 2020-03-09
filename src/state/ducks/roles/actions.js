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
  fetch(DELETE,"/role/"+uuid+"?purge").
    then(res => {dispatch(deleteRoleOption(res))}).catch(displayError)

const deleteRoleOption = payload => ({type : types.DELETE_ROLE, payload})
const setProject = () => ({
  type: types.SET_PROJECT
});   