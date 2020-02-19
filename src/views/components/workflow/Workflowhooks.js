import React, { useState, useEffect } from 'react';
import Sortable from 'react-sortablejs';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import { workflowAction } from '../../../state/ducks/workflow';
import './workflow.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Card from '@material-ui/core/Card';
import PropTypes from 'prop-types';
import { WorkflowSideBackButton } from '../common/sidebutton/SideBackButton';
import Loaders from '../loader/Loader';
import { useGeneric } from './WorkflowList';

function Workflow(props) {

  let sortable = null;
  const [items, setItems] = useState([]);
  const [listItems, setListItems] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [workflowToAdd, setWorkflowToAdd] = useState('');

  localStorage.removeItem('active-workflow-name');
  localStorage.removeItem('active-workflow-uuid');

  const [myitems, mylistItems] = useGeneric(
    props.workflowLists ? props.workflowLists.workflows : [],
    handleClick,
    deleteWorkflow,
  );

  useEffect(() => { // 
    console.log("listItems", listItems, mylistItems);
    if (listItems.length <1 || mylistItems.length > listItems.length || props.workflowLists.workflows.length < listItems.length) {
        setListItems(mylistItems);
    }
  
  }, [props.workflowLists?props.workflowLists.workflows:[], mylistItems, listItems]); //input array ...  <a> not used ...



  useEffect(() => {
    if (myitems.length > 0) {
      setItems(myitems);
      console.log("items", items);
    }
  }, []);

  useEffect(() => {
    getWorkFlow();

  }, []);

  async function getWorkFlow() {
    await props.getAllWorkflow();
    console.log("props", props)
  }

  function handleClick(e, val) {
    e.preventDefault();
    if (val) {
      props.setActiveWorkflow(val);
    }
  }

  function deleteWorkflow(e, workflow) {
    e.preventDefault();
    confirmAlert({
      title: 'Confirm to Delete',
      message: 'Are you sure to do this ?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            let newWorkflow = {
              workflowId: workflow.workflowId,
              uuid: workflow.uuid,
              retired: true,
              name: workflow.name
            };

            saveWorkflow(newWorkflow);
          }
        },
        {
          label: 'No',
          onClick: () => { }
        }
      ]
    });
  }

  async function saveWorkflow(workflow) {
    await props.saveWorkflow(workflow)
    await props.getAllWorkflow()
  }

  function handleSubmit(e) {
    e.preventDefault();
    saveWorkflow({ name: workflowToAdd });
    setWorkflowToAdd('');
    closeModal();
  }

  function handleChange(e) {
    setWorkflowToAdd(e.target.value);
  }
  function openModall() {
    setOpenModal(true);
  }
  function closeModal() {
    setOpenModal(false);
  }

  function reorder(order) {
    console.log('Order data :: ' + JSON.stringify(order));
    let tempArray = [];
    for (var i = 0; i < order.length; i++) {
      for (var j = 0; j < mylistItems.length; j++) {
        console.log('Order data list', mylistItems[j].key);
        if (order[i] === mylistItems[j].key) {
          tempArray.push(mylistItems[j]);
        }
      }
    }
    setListItems(tempArray);
  }

  if (props.isloading) return <Loaders />;

  return (
    <div className='main-wf container-fluid'>
      <div className='row'>
        <div className='col-sm-6 col-md-6 col-lg-6'>
          <h4 className='title'>Workflows</h4>
        </div>
        <div className='col-sm-6 col-md-6 col-lg-6'>
          <button
            className='btn btn-primary btn-gobal heading'
            onClick={() => openModall()}
          >
            Create Workflow
          </button>
        </div>
      </div>
      <div className='row'>
        <div className='card' id='workflow-maincard'>
          <Sortable
            options={{
              animation: 100,
              easing: 'cubic-bezier(1, 0, 0, 1)'
            }}
            ref={c => {
              if (c) {
                sortable = c.sortable;
              }
            }}
            onChange={order => {
              reorder(order);
            }}
            tag='ul'
          >
            {listItems}
          </Sortable>
        </div>
      </div>

      <Modal
        show={openModal}
        onHide={() => closeModal()}
        style={{ marginTop: '100px' }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Workflow</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className='form-group'>
              <label htmlFor='workflowName'>Enter Name</label>
              <input
                type='text'
                className='form-control'
                value={workflowToAdd}
                autoComplete='off'
                pattern='^[a-zA-Z\s]*$'
                name='workflowName'
                onChange={handleChange}
                required
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type='submit' variant='primary'>
              Save
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
      <WorkflowSideBackButton navigateTo=''></WorkflowSideBackButton>
    
    </div>
  );
}

const mapStateToProps = state => ({
  workflowLists: state.workflow.workflows,
  workflowObject: state.workflow.workflow,
  isloading: state.workflow.loading
});

const mapDispatchToProps = {
  getAllWorkflow: workflowAction.fetchWorkflows,
  saveWorkflow: workflowAction.saveWorkflow,
  setActiveWorkflow: workflowAction.setActiveWorkflow
};

export default connect(mapStateToProps, mapDispatchToProps)(Workflow);