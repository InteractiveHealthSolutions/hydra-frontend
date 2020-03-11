import React from 'react';
import Sortable from 'react-sortablejs';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import { workflowAction } from '../../../state/ducks/workflow'
import './workflow.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Card from '@material-ui/core/Card';
import PropTypes from 'prop-types';
import { WorkflowSideBackButton } from '../common/sidebutton/SideBackButton'
import Loaders from "../common/loader/Loader"

class Workflow extends React.Component {

  constructor(props) {
    super(props);
    this.sortable = null;
    this.state = {
      items: [],
      openModal: false,
      listItems: [],
      workflowToAdd: '',
      newItemList: [],

    };
    localStorage.removeItem('active-workflow-name');
    localStorage.removeItem('active-workflow-uuid');
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.createNewWorkFlow = this.createNewWorkFlow.bind(this);
  }

  async componentDidMount () {
    await this.props.getAllWorkflow()
    if (this.props.workflowLists) {
      await this.setState({
        newItemList: this.props.workflowLists.workflows
      })

      if (this.state.newItemList)
        await this.display();
    }
  }

  async componentWillReceiveProps(nextProps) {
    if (this.props.workflowLists && nextProps.workflowLists) {
      await this.setState({
        newItemList: nextProps.workflowLists.workflows
      })
      if (this.state.newItemList)
        this.display();
    }

  }

  deleteWorkflow = (workflow) => {
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

            this.createNewWorkFlow(newWorkflow);
          }
        },
        {
          label: 'No',
          onClick: () => { }
        }
      ]
    });
  };

  setImgIcon(name) {
    switch (name.toUpperCase()) {
      case 'FACILITY BASED':
        return <img className="workflow-icon img-fluid " src={require('../../../assets/facilityo.svg')} alt="" />;
      case 'COMMUNITY BASED':
        return <img className="workflow-icon img-fluid " src={require('../../../assets/communityo.svg')} alt="" />;
      default:
        return <img className="workflow-icon img-fluid" src={require('../../../assets/workflow.png')} alt="" />;
    }
  }

  display() {
    const { newItemList } = this.state
    this.setState({
      items: newItemList,
      listItems: newItemList.map(val => (
        <li
          className='block-list-workflow'
          key={val.workflowId}
          data-id={val.workflowId}
          id='2'
        >
          <Card className='wf-Card'>
            <div className='row wf-row'>
              <div
                className='col-sm-1 col-md-1 col-lg-1 wf-div'
                onClick={e => this.handleClick(e, val)}
              >
                {this.setImgIcon(val.name)}
              </div>
              <div
                className='col-sm-10 col-md-10 col-lg-10 wf-div'
                onClick={e => this.handleClick(e, val)}
              >
                <h6 className='list-content' onClick={e => this.handleClick(e, val)}>
                  {val.name}
                </h6>
              </div>
              <div className='col-sm-1 col-md-1 col-lg-1'>
                <span onClick={() => this.deleteWorkflow(val)}>
                  <i className='fas fa-times delete-icon-workflow'></i>
                </span>
              </div>
            </div>
          </Card>
        </li>
      ))
    });
    this.setState({ items: newItemList })
  }

  async createNewWorkFlow(workflow) {
    await this.props.saveWorkflowItem(workflow);
    await this.props.getAllWorkflow();
  }


  handleSubmit(e) {
    e.preventDefault();
    this.createNewWorkFlow({ "name": this.state.workflowToAdd });
    this.state.workflowToAdd = "";
    this.closeModal();
  }

  handleChange(e) {
    this.setState({ workflowToAdd: e.target.value });
  }

  openModal() {
    this.setState({ openModal: true });
  }
  closeModal() {
    this.setState({ openModal: false });
  }

  handleClick(e, val) {
    if (val) {
      this.props.setActiveWorkflow(val)
    }
  }

  reorder(order) {
    let tempArray = [];
    for (var i = 0; i < order.length; i++) {
      for (var j = 0; j < this.state.listItems.length; j++) {
        if (order[i] == this.state.listItems[j].key) {
          tempArray.push(this.state.listItems[j]);
        }
      }
    }
    this.setState({ listItems: tempArray });
  }

  render() {
    if (this.props.isloading) return <Loaders />;
    return (
      <div className="main-wf container-fluid">
        <div className="row">
          <div className="col-sm-6 col-md-6 col-lg-6">
            <h4 className="header_title">Workflows</h4>
          </div>
          <div className="col-sm-6 col-md-6 col-lg-6">
            <button className="btn btn-primary btn-gobal heading" onClick={() => this.openModal()}>Create Workflow</button>
          </div>
        </div>
        <div className="row">
          <div className="card" id="workflow-maincard">
            <Sortable
              options={{
                animation: 100,
                easing: "cubic-bezier(1, 0, 0, 1)"
              }}
              ref={(c) => {
                if (c) {
                  this.sortable = c.sortable;
                }
              }}
              onChange={(order) => {
                this.reorder(order);
              }}
              tag="ul">
              {this.state.listItems}
            </Sortable>
          </div>
        </div>
        <Modal show={this.state.openModal} onHide={() => this.closeModal()} style={{ marginTop: '100px' }}>
          <Modal.Header closeButton>
            <Modal.Title>Add Workflow</Modal.Title>
          </Modal.Header>
          <form onSubmit={this.handleSubmit}>
            <Modal.Body>
              <div className="form-group">
                <label htmlFor="workflowName">Enter Name</label>
                <input type="text" className="form-control" value={this.state.workflowToAdd} autoComplete="off" pattern="^[a-zA-Z\s]*$" name="workflowName" onChange={this.handleChange} required />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" variant="primary">
                Save
                            </Button>
            </Modal.Footer>
          </form>
        </Modal>
        <WorkflowSideBackButton
          navigateTo=""
        ></WorkflowSideBackButton>
      </div >
    );
  }


  static propTypes = {
    workflowLists: PropTypes.array.isRequired,
  };

}


const mapStateToProps = state => ({
  workflowLists: state.workflow.workflows,
  workflowObject: state.workflow.workflow,
  isloading: state.workflow.loading
});

const mapDispatchToProps = {
  getAllWorkflow: workflowAction.getAllWorkflow,
  saveWorkflowItem: workflowAction.saveWorkflow,
  setActiveWorkflow: workflowAction.setActiveWorkflow
};

export default connect(mapStateToProps, mapDispatchToProps)(Workflow);