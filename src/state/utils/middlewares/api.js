import { fetch } from "../../utils";
import { API } from "../../../utilities/constants/globalconstants";

const api = ({ dispatch, getState }) => next => async action => {
    if (action.type !== API) {
        return next(action)
    }
    const { url, method, success, init, error,data } = action.payload; //vs6 destruction...
    dispatch(init()); 
    fetch(method, url,data)
        .then(response => {
            console.log("api Response :: ", method , response)
             dispatch(success(response))
        }).catch((err) => {
            console.log("api Response :: ",err)
            dispatch(error(err))
        })
}

export default api