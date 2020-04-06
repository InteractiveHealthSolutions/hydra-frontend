import React from 'react';
import Sortable from 'react-sortablejs';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import './phase.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Card from '@material-ui/core/Card';
import { WorkflowSideBackButton } from '../common/sidebutton/SideBackButton'
import { phaseAction } from '../../../state/ducks/phase'
import PropTypes from 'prop-types';
import Loaders from "../common/loader/Loader"
import CardTemplate from '../../ui/cards/SimpleCard/CardTemplate'

class Phase extends React.Component {
    constructor(props) {
        super(props);
        this.sortable = null;
        this.state = {
            items: [],
            openModal: false,
            availablePhase: [],
            phaseToAdd: 0,
            listItems: [],
            loading: true,
            newItemList: [],
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.phases = [];

    }
    // static propTypes = {
    //     phaseList: PropTypes.array.isRequired,
    //     workflowPhaseList: PropTypes.array.isRequired
    // };

    async componentWillMount() {
        await this.props.getAllPhases()
        await this.props.getAllWorkflowPhase()
    }

    async componentWillReceiveProps(newProps) {
        if (newProps.workflowPhaseList !== undefined) {
            await this.setState({
                newItemList: newProps.workflowPhaseList,
                availablePhase: newProps.phaseList.phases,
                loading: false
            }, () => {
                if (this.state.newItemList) {
                    this.displayPhases();
                }
            })
        }
        if (newProps.phaseList !== undefined) {
            await this.setState({
                availablePhase: newProps.phaseList.phases,
                loading: false
            }, () => {

                if (this.state.availablePhase) {
                    this.populateDropDown();
                }
            })
        }
    }


    deletePhases = (phase) => {
        confirmAlert({
            title: 'Confirm to Delete',
            message: 'Are you sure to do this ?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        this.deleteWorkflowPhases(phase.uuid);
                    }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    };

    async deleteWorkflowPhases(uuid) {
        await this.props.deleteWorkflowPhase(uuid);
        await this.props.getAllWorkflowPhase();
    }

    async savePhases() {
        let phase = this.getPhaseById()
        let newPhaseMap = {
            "displayOrder": phase.phaseId,
            "hydramodulePhase": phase.uuid,
            "hydramoduleWorkflow": localStorage.getItem("active-workflow-uuid")
        }
        await this.props.saveWorkflowPhase(newPhaseMap)
        await this.props.getAllWorkflowPhase();
    }

    getPhaseById() {
        let newPhase = {};
        this.state.availablePhase.forEach(element => {
            if (element.phaseId == this.state.phaseToAdd) {
                newPhase = element;
            }
        });
        return newPhase;
    }

    setImgIcon(name) {
        switch (name.toUpperCase()) {
            case 'SEARCH':
                return <img className="workflow-icon img-fluid " src={require('../../../assets/searchpatient.png')} alt="" />;
            case 'TREAT':
                return <img className="workflow-icon img-fluid " src={require('../../../assets/treato.svg')} alt="" />;
            case 'PREVENT':
                return <img className="workflow-icon img-fluid " src={require('../../../assets/prevento.svg')} alt="" />;
            default:
                return <img className="workflow-icon img-fluid" src={require('../../../assets/treato.svg')} alt="" />;
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        this.savePhases();
        this.closeModal();
    }

    displayPhases() {
        // phaseService.getWorkflowAndAsscoiatedPhases().then(data => {
        const { newItemList } = this.state;
        var sortedData = this.sort(newItemList);
        this.setState({
            items: sortedData,
            listItems: sortedData.map(val => (

                <li className="block-list-phase"
                    key={val.id} data-id={val.id} >
                    <Card className="p_card">
                        <div className="row p-row">
                            <div className="col-sm-1 col-md-1 col-lg-1 p_div" onClick={((e) => this.handleClick(e, val))}>
                                {this.setImgIcon(val.phaseName)}
                            </div>
                            <div className="col-sm-10 col-md-10 col-lg-10 p_div" onClick={((e) => this.handleClick(e, val))} >
                                <h6 className="list-content-phase" onClick={((e) => this.handleClick(e, val))}>{val.phaseName}</h6>
                            </div>
                            <div className="col-sm-1">
                                <span onClick={() => this.deletePhases(val)}  > <i class="fas fa-times delete-icon-phase"></i></span>
                            </div>
                        </div>
                    </Card>
                </li >

            )
            )
        });
        // if (this.state.availablePhase)
        //         this.populateDropDown();
        // phaseService.getAllPhases().then(data => {
        //     this.setState({ availablePhase: data.phases });
        //     this.populateDropDown();
        // });
        // });


    }

    sort(data) {
        for (let i = 0; i < data.length; i++) {
            let holder = data[i];
            let j = i - 1;
            while (j >= 0 && data[j].displayOrder > holder.displayOrder) {
                data[j + 1] = data[j];
                j = j - 1;
            }
            data[j + 1] = holder;
        }

        return data;
    }

    handleChange(e) {
        this.setState({ phaseToAdd: e.target.value });
    }

    openModal() {
        this.setState({ openModal: true });
    }

    closeModal() {
        this.setState({ openModal: false });
    }

    handleClick(e, val) {
        if (val) {
            this.props.setActivePhases(val);
        }
    }

    itemIncludes(element) {
        var includes = false;
        for (var i = 0; i < this.state.items.length && includes === false; i++) {
            if (this.state.items[i].phaseUUID === element.uuid) includes = true;
        }
        return includes;
    }
    populateDropDown() {
        this.phases = [];
        // console.log("availablePhase", this.state.availablePhase)
        this.state.availablePhase.forEach(element => {
            if (this.state.listItems.length === 3 || this.itemIncludes(element)) {
                this.phases.push(
                    <option disabled>{element.name}</option>
                );
            }
            else {
                this.phases.push(
                    <option value={element.phaseId}>{element.name}</option>
                );
            }
        });

    }
    reorder(order) {
        // console.log("Order data :: " + JSON.stringify(order))
        let tempArray = [];
        for (var i = 0; i < order.length; i++) {
            for (var j = 0; j < this.state.listItems.length; j++) {
                //  console.log("Order data list", this.state.listItems[j].key)
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
            <>
                <CardTemplate
                    title={localStorage.getItem('active-workflow-name') + "- Phases"}
                    action={
                        <button className="btn btn-primary btn-gobal heading" onClick={() => this.openModal()}>Add Phase</button>
                    }
                >
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

                </CardTemplate>


                {/* <div className="main-ph">
                        <div className="row">
                            <div className="col-sm-6 col-md-6 col-lg-6">
                                <h4 className="header_title">{localStorage.getItem('active-workflow-name')} - Phases</h4>
                            </div>
                            <div className="col-sm-6 col-md-6 col-lg-6 ">
                                <button className="btn btn-primary btn-gobal heading" onClick={() => this.openModal()}>Add Phase</button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="card" id="phase-maincard">
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
                        </div> */}

                <Modal show={this.state.openModal} onHide={() => this.closeModal()} style={{ marginTop: '100px' }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Phase</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={this.handleSubmit}>
                        <Modal.Body>
                            <div className="form-group">
                                <label htmlFor="phaseName">Select phase</label>
                                <select className="form-control" name="phaseName" value={this.state.phaseToAdd} onChange={this.handleChange} required>
                                    <option></option>
                                    {this.phases}
                                </select>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button type="submit" variant="primary">
                                Save
                            </Button>

                        </Modal.Footer>
                    </form>

                </Modal>

                {/* <WorkflowSideBackButton
                    navigateTo="workflow"
                ></WorkflowSideBackButton> */}

            </>
        );
    }

}
const mapStateToProps = (state) => ({
    phaseList: state.phase.allphase,
    workflowPhaseList: state.phase.allWorkPhase,
    isloading: state.phase.loading

})

const mapsDispatchToProps = {
    getAllPhases: phaseAction.getAllPhase,
    savePhases: phaseAction.savePhase,
    setActivePhases: phaseAction.setActivePhases,
    saveWorkflowPhase: phaseAction.saveWorkflowPhase,
    getAllWorkflowPhase: phaseAction.getAllWorkflowPhase,
    deleteWorkflowPhase: phaseAction.deleteWorkflowPhase

}
export default connect(mapStateToProps, mapsDispatchToProps)(Phase);