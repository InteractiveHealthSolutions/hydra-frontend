import React, { useEffect, useState } from 'react'
import WorkflowFormView from './WorkflowFormView'
import { useDispatch, useSelector } from 'react-redux'
import { phaseAction } from '../../../../../state/ducks/phase'
import { LoaderDots } from '../../../common/loader/LoaderDots'

export default function WorkflowFormViewContainer() {

    const dispatch = useDispatch()
    const { workflowPhases, loading } = useSelector(state => ({
        workflowPhases: state.phase.allWorkPhase,
        loading: state.phase.loading
    }))

    useEffect(() => {
        dispatch(phaseAction.getAllWorkflowPhase("dataview"))
    }, [])

    console.log("loading loading"  , loading)

    return<WorkflowFormView
        workflowPhase={workflowPhases}
    />
}
