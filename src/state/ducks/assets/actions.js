import * as types from "./types";
import { fetch } from "../../utils";
import {
  POST,
  GET,
  DELETE,
} from "../../../utilities/constants/globalconstants";
import { REJECTED } from "../../../utilities/constants/globalconstants";
import { displayError } from '../../../utilities/helpers/helper'
import createTypography from "@material-ui/core/styles/createTypography";


export const saveAsset = (asset) => async dispatch =>
  fetch(POST, "/hydra/asset", asset)
    .then(res => dispatch(assetAction(res))).catch(displayError)

const assetAction = (payload) => ({
  type: types.CREATE_ASSET,
  payload
})

export const fetchAssets = () => async dispatch => {
  dispatch(setProject())
  fetch(GET, "/hydra/asset?v=full")
    .then(res => dispatch(setAssetAction(res))).catch(displayError)
}


const setAssetAction = (payload) => ({ type: types.GET_ALL_ASSET, payload })

export const deleteAsset = (uuid) => async dispatch => {
  fetch(DELETE, "/hydra/asset/" + uuid)
    .then(res => dispatch(deleteAssetAction(res))).catch(displayError)
}
const deleteAssetAction = (payload) => ({ type: types.DELETE_ASSET, payload })

//assets type 
export const saveAssetType = (assetType) => async dispatch =>
  fetch(POST, "/hydra/assetType", assetType)
    .then(res => dispatch(assetTypeAction(res))).catch(displayError)

const assetTypeAction = (payload) => ({
  type: types.CREATE_ASSET_TYPE,
  payload
})

export const fetchAssetTypes = () => async dispatch =>
  fetch(GET, "/hydra/assetType?v=full")
    .then(res => dispatch(setAssetTypeAction(res))).catch(displayError)

const setAssetTypeAction = (payload) => ({ type: types.GET_ALL_ASSET_TYPE, payload })


export const saveAssetCategory = (category) => async dispatch =>
  fetch(POST, "/hydra/assetCategory", category)
    .then(res => dispatch(setAssetCategoryAction(res))).catch(displayError)

const setAssetCategoryAction = (payload) => ({ type: types.CREATE_ASSET_CATEGORY, payload })

export const fetchAssetCategory = () => async dispatch =>
  fetch(GET, "/hydra/assetCategory?v=full")
    .then(res => dispatch(setFetchAssetCategoryAction(res))).catch(displayError)

const setFetchAssetCategoryAction = (payload) => ({ type: types.GET_ALL_ASSET_CATEGORY, payload })



const setProject = () => ({
  type: types.SET_PROJECT
});

const setError = payload => ({
  type: types.GET_ALL_ASSET + REJECTED,
  payload
});