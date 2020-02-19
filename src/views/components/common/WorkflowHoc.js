import React, { Component } from 'react'
import { confirmAlert } from 'react-confirm-alert';
import { workflowService } from '../../services';
import Card from '@material-ui/core/Card';
import { generalConstants } from "../../utilities/constants";

const WorkflowHoc = (WrapperComponent, type) => {
    class WorkflowHoc extends Component {
        constructor(props) {
            super(props)
            this.state = {
                items: [],
                openModal: false,
                listItems: [],
                workflowToAdd: '',
                workflowLists: [],
                loading: true,
                deleteWorkflow: {}
            }

            // this.handleSubmit = this.handleSubmit.bind(this);
            // this.handleChange = this.handleChange.bind(this);
            // //this.handleClick = this.handleClick.bind(this);

            this.display();
        }

        delete = (workflow) => {
            confirmAlert({
                title: 'Confirm to Delete',
                message: 'Are you sure to do this ?',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: () => {
                            workflowService.saveWorkflow(workflow).then(data => {
                                this.display()
                            })
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
                case generalConstants.FACILITY_BASED:
                    return <img className="workflow-icon img-fluid " src={require('../../assets/facilityo.svg')} />;
                case generalConstants.COMMUNITY_BASED:
                    return <img className="workflow-icon img-fluid " src={require('../../assets/communityo.svg')} />;
                case generalConstants.SEARCH:
                    return <img className="workflow-icon img-fluid " src={require('../../assets/searchpatient.png')} />;
                case generalConstants.TREAT:
                    return <img className="workflow-icon img-fluid " src={require('../../assets/treato.svg')} />;
                case generalConstants.PREVENT:
                    return <img className="workflow-icon img-fluid " src={require('../../assets/prevento.svg')} />;

                default:
                    return <img className="workflow-icon img-fluid" src={require('../../assets/workflow.png')} />;
            }
        }

        display() {
            workflowService.getAllWorkflow().then(data => {
                this.setState({ 
                    items: data.workflows,
                    listItems: data.workflows.map(val => (
                        <Card className="wf-Card">
                            <li className="block-list-workflow" key={val.workflowId} data-id={val.workflowId} id="2" >
                                <div className="row">
                                    <div className="col-sm-1 col-md-1 col-lg-1 wf-div" onClick={((e) => this.handleClick(e, val))}>
                                        {this.setImgIcon(val.name)}
                                    </div>
                                    <div className="col-sm-10 col-md-10 col-lg-10 wf-div" onClick={((e) => this.handleClick(e, val))} >
                                        <h6 className="list-content" onClick={((e) => this.handleClick(e, val))} >{val.name}</h6>
                                    </div>
                                    <div className="col-sm-1 col-md-1 col-lg-1">
                                        <span onClick={() => this.props.deleteWorkflow(val)} ><i className="fas fa-times delete-icon-workflow" ></i></span>
                                    </div>
                                </div>
                            </li>
                        </Card>
                    )
                    )
                });
                this.setState({ items: workflowService.getAllWorkflow() })
            })
        }

        save(workflow) {
            let newWorkflow = { "name": workflow }
            workflowService.saveWorkflow(newWorkflow).then(data => {
                this.display()
            })
        }

        render() {
            return (
                <WrapperComponent
                    delete={(param) => this.delete(param)}
                    items={this.state.items}
                    listItems={this.state.listItems}
                    save = {(param) => this.save(param)}
                >

                </WrapperComponent>
            )
        }

    }
    return WorkflowHoc
}

export default WorkflowHoc
