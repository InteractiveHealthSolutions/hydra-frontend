import React, { useEffect, useState } from 'react'
import WorkflowFormView from './WorkflowFormView'
import { useDispatch, useSelector } from 'react-redux'
import { phaseAction } from '../../../../../state/ducks/phase'
import { componentAction } from '../../../../../state/ducks/stages'
import { formAction } from '../../../../../state/ducks/form'

export default function WorkflowFormViewContainer() {

    const dispatch = useDispatch()
    const {workflowPhases,phaseStages, stageForms} = useSelector(state => ({
             workflowPhases :state.phase.allWorkPhase
    }))

    useEffect(() => {
        dispatch(phaseAction.getAllWorkflowPhase("dataview"))
        dispatch(componentAction.fetchPhaseComponent("dataview"))
    }, [])


    console.log("workflowPhases" ,  workflowPhases)

    return <WorkflowFormView
        workflowPhase ={workflowPhases}
    />
}
