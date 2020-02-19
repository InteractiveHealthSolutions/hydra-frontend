import { generalConstants, workflowconstants } from '../../utilities/constants';

const initialState = { workflowName: '', workflowuuId: '', workflowId: '' };

export const ruleenginereducer = (state = initialState, action) => {
    switch (action.type) {
        case workflowconstants.GET_ALL_WORKFLOW:
            return {
                    ...state,  
                    allWorkflow: action.payload};
        default: return state
    }
}