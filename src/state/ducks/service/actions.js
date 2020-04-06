import * as types from "./types";
import { fetch } from "../../utils";
import {
  POST,
  GET,
  DELETE,
} from "../../../utilities/constants/globalconstants";
import { REJECTED } from "../../../utilities/constants/globalconstants";
import { displayError } from '../../../utilities/helpers/helper'


export const saveService = (Service) => async dispatch => {
  dispatch(setProject())
  fetch(POST, "/hydra/service", Service)
    .then(res => dispatch(ServiceAction(res))).catch(displayError)
}


const ServiceAction = (payload) => ({
  type: types.CREATE_SERVICE,
  payload
})

export const fetchServices = () => dispatch => {
  dispatch(setProject())
  fetch(GET, "/hydra/service?v=full")
    .then(res => dispatch(setServiceAction(res))).catch(displayError)
}


const setServiceAction = (payload) => ({ type: types.GET_ALL_SERVICE, payload })

export const deleteService = (uuid) => async dispatch => {
  fetch(DELETE, "/hydra/service/" + uuid)
    .then(res => dispatch(deleteServiceAction(res))).catch(displayError)
}
const deleteServiceAction = (payload) => ({ type: types.DELETE_SERVICE, payload })

//service type
export const saveServiceType = (serviceType) => async dispatch => {
  dispatch(setProject())
  fetch(POST, "/hydra/serviceType", serviceType)
    .then(res => dispatch(ServiceTypeAction(res))).catch(displayError)
}
const ServiceTypeAction = (payload) => ({
  type: types.CREATE_SERVICE_TYPE,
  payload
})


export const fetchServiceType = () => async dispatch => {
  dispatch(setProject())
  fetch(GET, "/hydra/serviceType?v=full")
    .then(res => dispatch(setServiceTypeAction(res))).catch(displayError)
}

const setServiceTypeAction = (payload) => ({ type: types.GET_ALL_SERVICE_TYPE, payload })



const setProject = () => ({
  type: types.SET_PROJECT
});

const setError = payload => ({
  type: types.GET_ALL_SERVICE + REJECTED,
  payload
});