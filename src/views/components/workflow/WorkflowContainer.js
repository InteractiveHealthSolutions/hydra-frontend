import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { workflowAction } from '../../../state/ducks/workflow'
import Workflow from './Workflow';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default function WorkflowContainer() {
    const dispatch = useDispatch();
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [workflowToAdd, setWorkflowToAdd] = useState('')
  
    useEffect(() => {
        dispatch(workflowAction.getAllWorkflow())
    }, [])

    const { workflowLists, isloading } = useSelector(state => ({
        workflowLists: state.workflow.workflows,
        isloading: state.workflow.loading
    }))

    function handleOnClick(e, val) {
        if (val) {
            dispatch(workflowAction.setActiveWorkflow(val))
        }
    }
    function handleDeleteOnClick(val) {
        deleteWorkflow(val)
    }

    function deleteWorkflow(workflow) {
        confirmAlert({
            title: 'Confirm to Delete',
            message: 'Are you sure to do this ?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        let newWorkflow = {
                            "workflowId": workflow.workflowId,
                            "uuid": workflow.uuid,
                            "retired": true,
                            "name": workflow.name
                        }
                        createNewWorkFlow(newWorkflow);
                    }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    };
    function openModal() {
        setModalIsOpen(true)
    }
    function closeModal() {
        setModalIsOpen(false)
    }
    function handleSubmit(e) {
        e.preventDefault();
        createNewWorkFlow({ "name": workflowToAdd });
        setWorkflowToAdd("");
        closeModal();
    }
    async function createNewWorkFlow(workflow) {
        await dispatch(workflowAction.saveWorkflow(workflow));
        dispatch(workflowAction.getAllWorkflow());
    }

    function handleChange(e) {
        setWorkflowToAdd(e.target.value)
    }

    return <Workflow
        isloading={isloading}
        openModal={openModal}
        workflowLists={workflowLists}
        handleOnClick={handleOnClick}
        handleDeleteOnClick={handleDeleteOnClick}
        handleSubmit={handleSubmit}
        workflowToAdd={workflowToAdd}
        handleChange={handleChange}
        closeModal={closeModal}
        modalIsOpen={modalIsOpen}
    />
}
