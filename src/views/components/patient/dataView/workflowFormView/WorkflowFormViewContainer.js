import React, { useEffect, useState } from 'react'
import WorkflowFormView from './WorkflowFormView'
import { useDispatch, useSelector } from 'react-redux'
import { phaseAction } from '../../../../../state/ducks/phase'


export default function WorkflowFormViewContainer() {

    const dispatch = useDispatch()
    const {workflowPhases} = useSelector(state => ({
             workflowPhases :state.phase.allWorkPhase
    }))

    useEffect(() => {
        dispatch(phaseAction.getAllWorkflowPhase("dataview"))
    }, [])


    console.log("workflowPhases" ,  workflowPhases)

    return <WorkflowFormView
        workflowPhase ={workflowPhases}
    />
}
