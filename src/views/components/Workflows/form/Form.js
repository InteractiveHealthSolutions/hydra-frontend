import React from 'react'
import CardTemplate from '../../../ui/cards/SimpleCard/CardTemplate'
import ListItem from '../../../ui/listItem/ListItem'
import Sortable from 'react-sortablejs';
import LinearProgress from '@material-ui/core/LinearProgress'
import { ModalFormTemplate, FormDialog, CustomizedDialog } from '../../../ui/modal'
import Card from "@material-ui/core/Card";

export const Form = ({
    isloading,
    openModal,
    componentFormList,
    formList,
    handleOnClick,
    handleDeleteOnClick,
    handleSubmit,
    handleChange,
    closeModal,
    modalIsOpen,
    formToAdd,
    ...rest
}) => (
        <>
            {(isloading) ? <LinearProgress /> : ""}
            <CardTemplate
                title="Workflows"
                action={
                    <button
                        className="btn btn-primary _btn"
                        onClick={() => openModal()}>
                        <i class="fas fa-plus"></i> Add Form
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
                        (componentFormList) ? componentFormList.map(element => (
                            <ListItem
                                handleOnClick={handleOnClick}
                                color="var(--indigo)"
                                handleDeleteOnClick={handleDeleteOnClick}
                                data={element}
                                name = {element.form.name}
                            />
                        )) : null
                    }
                </Sortable>
            </CardTemplate>
            <CustomizedDialog
                open={modalIsOpen}
                handleClose={closeModal}
                handleSubmit={handleSubmit}
                title="Add Form"
            >
                <div className="form-group">
                    <label htmlFor="formName">Select a Form</label>
                    <select
                        className="form-control"
                        name="formName"
                        value={formToAdd}
                        onChange={handleChange}
                        required
                    >
                        <option></option>
                        {formList}
                    </select>
                </div>
            </CustomizedDialog>
        </>
    )
