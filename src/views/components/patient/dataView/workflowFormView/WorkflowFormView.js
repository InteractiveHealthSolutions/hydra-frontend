import React from 'react'
import { WorkflowTabPanel } from '../../../../ui'

const WorkflowFormView = ({
    workflowPhase
}) => {
    console.log("workflowPhase", workflowPhase)
    return (
        <WorkflowTabPanel
            height={760}
            padding='0'
            tabData={workflowPhase}
            tabPanelData={workflowPhase}
        />
    )
}

export default WorkflowFormView