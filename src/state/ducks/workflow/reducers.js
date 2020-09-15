import * as types from "./types";
import createReducer from "../../utils/createReducer";
import { REJECTED } from "../../../utilities/constants/globalconstants";

const initialState = {
    current: null,
    loading: false,
    loaded: false,
    error: null,
    workflow: [],
    workflows:[],
};

const workflowReducer = createReducer(initialState)({

    [types.SET_PROJECT]: (state, { payload }) => ({
        ...state,
        current: payload,
        loading: true,
        error: null
    }),

    [types.ACTIVE_WORKFLOW]: (state, { payload }) => ( () =>{
        console.log("payload",payload)
        // workflowName: payload.workflowName,
        // workflowuuId: payload.uuid,
        // workflowId: payload.workflowId
    }),
    [types.GET_ALL_WORKFLOW + REJECTED]: (state, { payload }) => ({
        ...state,
        loading: false,
        error: payload
    }),
    [types.CREATE_WORKFLOW]: (state, { payload }) => ({
        ...state,
        loading: false,
        workflow: payload
    }),
    [types.GET_ALL_WORKFLOW]: (state, { payload }) => ({
         ...state,
         loading: false,
         workflows: payload
    }),
    [types.USERWORKFLOW_BY_USER]: (state, { payload }) => ({
        ...state,
        loading: false,
        userWorkflow: payload
    })
})

export default workflowReducer

// const workflowreducer = (state = initialState, action) => {

//     switch (action.type) {
//         case types.ACTIVE_WORKFLOW:
//             return {
//                 workflowName: action.workflow.workflow.workflowName,
//                 workflowuuId: action.workflow.workflow.uuid,
//                 workflowId: action.workflow.workflow.workflowId
//             }
//         case types.SET_PROJECT:
//             return {
//                 ...state,
//                 loading: true
//             }
//         case types.GET_ALL_WORKFLOW + REJECTED: {
//             return {
//                 ...state,
//                 loading: false,
//                 error: action.payload
//             }
//         }
//         case types.CREATE_WORKFLOW:
//             return {
//                 ...state,
//                 loading: false,
//                 item: action.payload
//             };
//         case types.GET_ALL_WORKFLOW:
//             return {
//                 ...state,
//                 loading: false,
//                 allWorkflow: action.payload
//             };
//         default: return state
//     }
// }

