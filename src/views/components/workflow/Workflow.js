import React from 'react'
import CardTemplate from '../../ui/cards/SimpleCard/CardTemplate'
import ListItem from '../../ui/listItem/ListItem'
import Sortable from 'react-sortablejs';
import LinearProgress from '@material-ui/core/LinearProgress'
import { ModalFormTemplate, FormDialog, CustomizedDialog } from '../../ui/modal'
import './workflow.css';

const Workflow = ({
  isloading,
  openModal,
  workflowLists,
  handleOnClick,
  handleDeleteOnClick,
  handleSubmit,
  workflowToAdd,
  handleChange,
  closeModal,
  modalIsOpen,
  ...rest

}) => {
  return (
    <>
      {(isloading) ? <LinearProgress /> : ""}
      <CardTemplate
        title="Workflows"
        action={
          <button className="btn btn-primary _btn" onClick={() => openModal()}> <i class="fas fa-plus"></i> Create</button>
        }
        contentHeight="450px"
      >
        <Sortable
          options={{
            animation: 100,
            easing: "cubic-bezier(1, 0, 0, 1)"
          }}
          onChange={(order) => {
            //this.reorder(order);
          }}
          tag="ul">
          {
            (workflowLists && workflowLists.workflows) ?
              workflowLists.workflows.map(element => (
                <ListItem
                  handleOnClick={handleOnClick}
                  color="var(--bg)"
                  handleDeleteOnClick={handleDeleteOnClick}
                  data={element}
                  name={element.name}
                />
              )) : null
          }
        </Sortable>
      </CardTemplate>
      <CustomizedDialog
        open={modalIsOpen}
        handleClose={closeModal}
        handleSubmit={handleSubmit}
        title="Add Workflow"
      >
        <div className="form-group">
          <label htmlFor="workflowName">Enter Name</label>
          <input type="text" className="form-control" value={workflowToAdd} autoComplete="off" pattern="^[a-zA-Z\s]*$" name="workflowName" onChange={handleChange} required />
        </div>
      </CustomizedDialog>
      {/* <ModalFormTemplate
        title="Add Workflow"
        openVoidModal={modalIsOpen}
        closeVoidModal={closeModal}
        handleVoidSubmit={handleSubmit}
      >
        <div className="form-group">
          <label htmlFor="workflowName">Enter Name</label>
          <input type="text" className="form-control" value={workflowToAdd} autoComplete="off" pattern="^[a-zA-Z\s]*$" name="workflowName" onChange={handleChange} required />
        </div>
      </ModalFormTemplate> */}
    </>
  )
}

export default Workflow
