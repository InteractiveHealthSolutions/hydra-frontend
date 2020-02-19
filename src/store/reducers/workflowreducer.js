import { generalConstants, workflowconstants } from '../../utilities/constants';

const initialState = { workflowName: '', workflowuuId: '', workflowId: '' };

export const workflowreducer = (state = initialState, action) => {
    switch (action.type) {
        case generalConstants.ACTIVE_WORKFLOW:
            return {
                workflowName: action.workflow.workflow.workflowName,
                workflowuuId: action.workflow.workflow.uuid,
                workflowId: action.workflow.workflow.workflowId
            }
        case workflowconstants.CREATE_WORKFLOW:
            return {
                   ...state,  
                    item: action.payload};
        case workflowconstants.GET_ALL_WORKFLOW:
            return {
                    ...state,  
                    allWorkflow: action.payload};
        default: return state
    }
}