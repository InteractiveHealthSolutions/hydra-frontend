import * as types from "./types";
import { fetch } from "../../utils";
import {
  POST,
  GET,
  DELETE,
} from "../../../utilities/constants/globalconstants";
import { displayError} from '../../../utilities/helpers/helper'


export const saveProvider = (provider) => async dispatch =>
  fetch(POST, "provider", provider)
    .then(res => dispatch(providerSaveAction(res))).catch(displayError)

const providerSaveAction = (payload) => ({ type: types.CREATE_PROVIDER, payload })

export const deleteProvider = (uuid) => async dispatch =>
  fetch(DELETE, "provider/"+uuid+"?!purge")
    .then(res => dispatch(providerDeleteAction(res))).catch(displayError)

const providerDeleteAction = () => ({ type: types.GET_PROVIDER_BY_USER})

export const getProviderByUser = (uuid) => async dispatch =>
  fetch(GET, "provider?user="+uuid)
    .then(res => dispatch(providerGetByUserAction(res))).catch(displayError)

const providerGetByUserAction = (payload) => ({ type: types.GET_PROVIDER_BY_USER, payload })

