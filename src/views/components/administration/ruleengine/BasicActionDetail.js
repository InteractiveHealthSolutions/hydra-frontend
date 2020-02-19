import React, { Component } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class BasicActionDetail extends Component {

    constructor(props) {
        super(props)

        this.state = {
            availableWorkflow: [],
            availablePhase: [],
            availableStage: [],
            availableForms: [],
            workflowToAdd: '',
            phaseToAdd: '',
            stageToAdd: '',
            formToAdd: ''

        }
        this.workflows = [];
        this.phases = [];
        this.stages = [];
        this.forms = [];
        this.handleWorkflowChange = this.handleWorkflowChange.bind(this);
        this.handlePhaseChange = this.handlePhaseChange.bind(this);
        this.handleStageChange = this.handleStageChange.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);
    }


    componentWillReceiveProps(nextProps) {
        console.log("basic props", nextProps.values)
        if (nextProps.values) {
            this.setState({
                availableWorkflow: nextProps.values.workflowList,
            })
            if (this.state.availableWorkflow)
                this.populateDropDown();
        }


    }
    moveNextStep = e => {
        e.preventDefault();
        if (this.validations()) {
            this.props.nextStep();
        }

    }

    validations() {
        const { workflowToAdd, phaseToAdd, stageToAdd } = this.state
        if (workflowToAdd !== '' && phaseToAdd !== '' && stageToAdd !== '') {
            return true
        }
        toast.error('You should need phase, stage and form for next step', {containerId: 'AlertMessage'})
        return false
    }

    populateDropDown() {
        this.workflows = [];
        console.log("populateDropDown", this.state.availableWorkflow)
        this.state.availableWorkflow.forEach(element => {
            console.log("element", element.name)
            this.workflows.push(
                <option value={element.uuid}>{element.name}</option>
            );
        });

    }

    async handleWorkflowChange(e) {
        e.preventDefault();
        console.log("filter ", e.target.value)
        await this.setState({
            workflowToAdd: e.target.value,
            availablePhase: [],
            availableStage: []
        })

        if (this.state.workflowToAdd !== '')
            this.filterPhase();

    }

    filterPhase() {
        this.phases = []
        let phase = []
        this.props.values.phaseList.forEach(element => {
            console.log("match ::", element)
            if (this.state.workflowToAdd === element.workflowUUID) {
                phase.push(element)
                this.phases.push(
                    <option value={element.phaseUUID}>{element.phaseName}</option>
                );
            }
        });

        console.log("filter list phase", phase, this.phases);
        this.setState({
            availablePhase: phase
        })

    }

    filterStage() {
        this.stages = []
        let stage = []
        this.props.values.stageList.forEach(element => {
            console.log("match stage ::", element)
            if (this.state.phaseToAdd === element.phaseUUID) {
                stage.push(element)
                this.stages.push(
                    <option value={element.uuid}>{element.hydramoduleComponent.name}</option>
                );
            }
        });

        console.log("filter list stage", stage, this.stages);
        this.setState({
            availableStage: stage
        })
    }
    async handlePhaseChange(e) {
        e.preventDefault();
        console.log("filter ", e.target.value)
        await this.setState({
            phaseToAdd: e.target.value,
            availableStage: []
        })

        if (this.state.phaseToAdd !== '')
            this.filterStage();
    }

    async  handleStageChange(e) {
        e.preventDefault();
        await this.setState({
            stageToAdd: e.target.value,
            availableForms: []
        })
        if (this.state.stageToAdd !== '')
            this.filterForm();
    }

    filterForm() {
        this.forms = [];
        let form = [];
        this.props.values.forms.forEach(element => {
            form.push(element)
            this.forms.push(
                <option value={element.uuid}>{element.name}</option>
            );
        });

        this.setState({
            availableForms: form
        })

    }
    handleFormChange(e) {
        e.preventDefault();

        this.setState({
            formToAdd: e.target.value
        })

    }

    render() {
        const { values, handleChange } = this.props;
        console.log("phases", this.phases);
        return (
            <div className="row container-fluid ">
                <div className="card" style={{
                    width: '60%', display: 'block', marginLeft: 'auto',
                    marginRight: 'auto',
                    padding: '20px'
                }}>
                    {/* <div className="card-header"></div> */}
                    <div className="card-body">
                        <form onSubmit={this.moveNextStep.bind(this)}>
                            <div className="row">
                                <form style={{ width: '100%' }}>
                                    <div className="row" style={{ padding: '15px' }}>
                                        <div className="col-sm-3 col-md-3 col-lg-3">
                                            <label className="ec-label">Select Workflow <span style={{ color: 'red' }}>*</span></label>
                                        </div>
                                        <div className="col-sm-9 col-md-9 col-lg-9">
                                            <select className="form-control"
                                                name="workflowName"
                                                title="Please select workflow"
                                                value={this.state.workflowToAdd}
                                                onChange={this.handleWorkflowChange}
                                                required
                                            >
                                                <option></option>
                                                {this.workflows}
                                            </select>
                                        </div>
                                    </div>

                                    {/* //workflow phase  */}
                                    {
                                        (this.state.availablePhase.length > 0) ?
                                            <div className="row" style={{ padding: '15px' }}>
                                                <div className="col-sm-3 col-md-3 col-lg-3">
                                                    <label className="ec-label">Select Phase <span style={{ color: 'red' }}>*</span></label>
                                                </div>
                                                <div className="col-sm-9 col-md-9 col-lg-9">
                                                    <select className="form-control"
                                                        name="phaseName"
                                                        value={this.state.phaseToAdd}
                                                        onChange={this.handlePhaseChange}
                                                        required
                                                    >
                                                        <option></option>
                                                        {this.phases}
                                                    </select>
                                                </div>
                                            </div>
                                            : ""

                                    }
                                    {/* phase  stages  */}
                                    {
                                        (this.state.availablePhase.length > 0 && this.state.availableStage.length > 0) ?
                                            <div className="row" style={{ padding: '15px' }}>
                                                <div className="col-sm-3 col-md-3 col-lg-3">
                                                    <label className="ec-label">Select Stage <span style={{ color: 'red' }}>*</span></label>
                                                </div>
                                                <div className="col-sm-9 col-md-9 col-lg-9">
                                                    <select className="form-control"
                                                        name="stageName"
                                                        value={this.state.stageToAdd}
                                                        onChange={this.handleStageChange}
                                                        required
                                                    >
                                                        <option></option>
                                                        {this.stages}
                                                    </select>
                                                </div>
                                            </div>
                                            : ""
                                    }
                                    {
                                        (this.state.availableStage.length > 0 && this.state.availableForms.length > 0) ?
                                            <>
                                                <div className="row" style={{ padding: '15px' }}>
                                                    <div className="col-sm-3 col-md-3 col-lg-3">
                                                        <label className="ec-label">Select Form <span style={{ color: 'red' }}>*</span></label>
                                                    </div>
                                                    <div className="col-sm-9 col-md-9 col-lg-9">
                                                        <select className="form-control"
                                                            name="fromName"
                                                            value={this.state.formToAdd}
                                                            onChange={this.handleFormChange}
                                                            required
                                                        >
                                                            <option></option>
                                                            {this.forms}
                                                        </select>
                                                    </div>
                                                </div>
                                                {/* action  */}
                                                <div className="row" style={{ padding: '15px' }}>
                                                    <div className="col-sm-3">
                                                        <label htmlFor="actionName" className="ec-label">Action name <span style={{ color: 'red' }}>*</span></label>
                                                    </div>
                                                    <div className="col-sm-9">
                                                        <input
                                                            placeholder=""
                                                            type="text"
                                                            name="actionName"
                                                            required
                                                            className='form-control'
                                                            defaultValue={values.actionName}
                                                            onChange={handleChange('actionName')}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row" style={{ padding: '15px' }}>
                                                    <div className="col-sm-3">
                                                        <label htmlFor="actionName" className="ec-label">Action Description </label>
                                                    </div>
                                                    <div className="col-sm-9">
                                                        <textarea
                                                            placeholder=""
                                                            type="text"
                                                            name="description"
                                                            rows='2'
                                                            onChange={handleChange('actionDescription')}
                                                            className='form-control'
                                                            defaultValue={values.actionDescription}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                            : ""

                                    }

                                    <div className="row ">
                                        <div className="col-sm-8" ></div>
                                        <div className='col-sm-4 '>
                                            <button type="submit" className='btn btn-primary  save-btn'>Next</button>
                                        </div>
                                    </div>

                                </form>

                            </div>
                        </form>
                    </div>
                </div>

            </div>
        )
    }
}
