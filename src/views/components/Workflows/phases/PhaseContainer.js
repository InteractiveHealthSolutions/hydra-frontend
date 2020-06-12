import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { phaseAction } from '../../../../state/ducks/phase'
import { Phase } from './Phase'

export default function PhaseContainer() {

    const dispatch = useDispatch()
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [phaseToAdd, setPhaseToAdd] = useState('')
    const [phases, setPhases] = useState([])

    useEffect(() => {
        dispatch(phaseAction.getAllWorkflowPhase())
        dispatch(phaseAction.getAllPhase())
    }, [])

    const { phaseList, workflowPhaseList, isloading } = useSelector(state => ({
        phaseList: state.phase.allphase,
        workflowPhaseList: state.phase.allWorkPhase,
        isloading: state.phase.loading
    }))

    useEffect(() => {
        if (phaseList !== undefined && phaseList.phases !== undefined && workflowPhaseList !== undefined) {
            populateDropDown()
        }
    }, [phaseList, workflowPhaseList])

    function itemIncludes(element) {
        var includes = false;
        for (var i = 0; i < workflowPhaseList.length; i++) {
            if (workflowPhaseList[i].phaseUUID === element.uuid) includes = true;
        }
        return includes;
    }

    async function populateDropDown() {
        let phase = [];
        let nonVoidedList = await phaseList.phases.filter(x => x.retired !== true)
        nonVoidedList.forEach(element => {

            if (itemIncludes(element)) {
                phase.push(
                    <option key={element.phaseId} disabled style={{ color: 'gray' }}>
                        {element.name}
                    </option>
                );
            } else {
                phase.push(
                    <option key={element.phaseId} value={element.uuid}>
                        {element.name}
                    </option>
                );
            }
        });
        setPhases(phase)
    }


    function openModal() {
        setModalIsOpen(true)
    }
    function closeModal() {
        setModalIsOpen(false)
    }
    async function handleSubmit(e) {
        e.preventDefault();
        console.log("phaseList", phaseList, phaseToAdd)
        let phase = await phaseList.phases.filter(element => element.uuid === phaseToAdd)[0]
        console.log("phaseList dd", phase)
        let newPhaseMap = {
            displayOrder: phase.phaseId,
            hydramodulePhase: phase.uuid,
            hydramoduleWorkflow: localStorage.getItem("active-workflow-uuid")
        }
        console.log("phaseList dd", newPhaseMap)
        dispatch(phaseAction.saveWorkflowPhase(newPhaseMap))
        dispatch(phaseAction.getAllWorkflowPhase())
        closeModal();
    }


    function deletePhase(phase) {
        confirmAlert({
            title: 'Confirm to Delete',
            message: 'Are you sure to do this ?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        dispatch(phaseAction.deleteWorkflowPhase(phase.uuid))
                        dispatch(phaseAction.getAllWorkflowPhase())
                    }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    };
    function handleDeleteOnClick(val) {
        deletePhase(val)
    }

    function handleChange(e) {
        setPhaseToAdd(e.target.value);
    }
    function handleOnClick(e, val) {
        if (val) {
            dispatch(phaseAction.setActivePhases(val))
        }
    }

    return <Phase
        isloading={isloading}
        openModal={openModal}
        workflowPhaseList={workflowPhaseList}
        phaseList={phases}
        handleOnClick={handleOnClick}
        handleDeleteOnClick={handleDeleteOnClick}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        closeModal={closeModal}
        modalIsOpen={modalIsOpen}
        phaseToAdd={phaseToAdd}
    />
}
