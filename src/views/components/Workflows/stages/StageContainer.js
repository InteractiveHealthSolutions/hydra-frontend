import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { componentAction } from '../../../../state/ducks/stages'


export default function StageContainer() {
    const dispatch = useDispatch()
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [stageToAdd, setStageToAdd] = useState('')
    const [isCreateStage, setIsCreateStage] = useState(false)
    const [stages, setStages] = useState([])

    useEffect(() => {
        dispatch(componentAction.fetchcomponents())
        dispatch(componentAction.fetchPhaseComponent())
    }, [])

    const { stageList, phaseStageList, isloading } = useSelector(state => ({
        stageList: state.stages.components,
        phaseStageList: state.stages.phaseComponents,
        isloading: state.stages.loading
    }))

    return (
        <div>

        </div>
    )
}
