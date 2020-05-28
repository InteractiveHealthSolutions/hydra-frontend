import React from 'react'
import CardTemplate from '../../ui/cards/SimpleCard/CardTemplate'
import ListItem from '../../ui/listItem/ListItem'
import Sortable from 'react-sortablejs';
import LinearProgress from '@material-ui/core/LinearProgress'
import { CustomizedDialog } from '../../ui/modal'
import './phase.css';

export const Phase = ({
    isloading,
    openModal,
    workflowPhaseList,
    phaseList,
    handleOnClick,
    handleDeleteOnClick,
    handleSubmit,
    handleChange,
    closeModal,
    modalIsOpen,
    phaseToAdd,

}) => (
        <>
            {(isloading) ? <LinearProgress /> : ""}
            <CardTemplate
                title={localStorage.getItem('active-workflow-name') + "- Phases"}
                action={
                    <button
                        className="btn btn-primary _btn"
                        onClick={() => openModal()}>
                        <i class="fas fa-plus"></i> Add Phase
            </button>
                }
                contentHeight="450px"
            >
                <Sortable
                    options={{
                        animation: 100,
                        easing: "cubic-bezier(1, 0, 0, 1)"
                    }}
                    onChange={(order) => {
                        //reorder(order);
                    }}
                    tag="ul">
                    {
                        (workflowPhaseList) ? workflowPhaseList.map(element => (
                            <ListItem
                                handleOnClick={handleOnClick}
                                color="var(--orange)"
                                handleDeleteOnClick={handleDeleteOnClick}
                                data={element}
                                name ={element.phaseName}
                            />
                        )) : null
                    }
                </Sortable>
            </CardTemplate>
            <CustomizedDialog
                open={modalIsOpen}
                handleClose={closeModal}
                handleSubmit={handleSubmit}
                title="Add Phase"
            >
                <div className="form-group">
                    <label htmlFor="phaseName">Select phase</label>
                    <select
                        className="form-control"
                        name="phaseName"
                        value={phaseToAdd}
                        onChange={handleChange}
                        required
                    >
                        <option></option>
                        {phaseList}
                    </select>
                </div>
            </CustomizedDialog>
        </>
    )