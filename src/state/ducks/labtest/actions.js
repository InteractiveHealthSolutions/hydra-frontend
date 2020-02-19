import * as types from "./types";
import { fetch } from "../../utils";
import {
  POST,
  PUT,
  DELETE,
  GET,
} from "../../../utilities/constants/globalconstants";

import { displayError } from '../../../utilities/helpers/helper'

export const getAllLabTest = () => async dispatch =>
  fetch(GET, "/commonlab/labtesttype?v=full")
    .then(res => dispatch(labtestGetAction(res))).catch(displayError)

const labtestGetAction = payload => ({ type: types.GET_ALL_LABTEST, payload })
function filterresponse (res) {
console.log('response '+JSON.stringify(res));
  // let filteredData = [];
  // let sno = 1;
  // res.results.forEach(element => {
  //   filteredData.push({
  //     "sno":sno,
  //     "testGroup": element.testGroup,
  //     "shortName": element.shortName,
  //     "testname" :element.name,
  //     "referenceconcept":element.referenceConcept.name
            
  //   })
  //   sno++;
  // });
  // return filteredData;
  return res;
}