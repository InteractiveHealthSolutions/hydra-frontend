import React, { Component } from 'react'
import BasicActionDetail from './BasicActionDetail'
import AddRule from './AddRule'
import GeneralActions from './GeneralActions'
import './ruleengine.css'
import { connect } from 'react-redux';
import { ruleenginAction } from '../../../../state/ducks/ruleengine'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const workflowType = [
    { value: 'Community base', label: 'Community base' },
    { value: 'Facility base', label: 'Facility base' }
];

const phaseType = [
    { value: 'Search', label: 'Search' },
    { value: 'Tread', label: 'Tread' },
    { value: 'Prevent', label: 'Prevent' },
];

const actionTypes = [
    { value: 'Hide', label: 'Hide' },
    { value: 'Show', label: 'Show' },
    { value: 'Assign Value', label: 'Assign Value' },
    { value: 'Mandatory', label: 'Mandatory' }
];

const forms = [
    {
        formId: 1, name: 'Patient Information', uuid: "0ae4eb98-8a4e-4ada-bb25-a4264297423",
        question: [
            {
                name: "question 1"
            },
            {
                name: "question 2"
            },
            {
                name: "question 3"
            },
            {
                name: "question 4"
            }

        ]
    },
    {
        formId: 2, name: 'Child Screening', uuid: "0ae4eb98-8a4e-4ada-bb25-a42642974ddd3",
        question: [
            {
                name: "question 1"
            },
            {
                name: "question 2"
            },
            {
                name: "question 3"
            },
            {
                name: "question 4"
            }

        ]
    },
    {
        formId: 3, name: 'Child Clinician Evaluation', uuid: "0ae4eb98-8a4e-4ada-bb25df-a42642974dd3",
        question: [
            {
                name: "question 1"
            },
            {
                name: "question 2"
            },
            {
                name: "question 3"
            },
            {
                name: "question 4"
            }

        ]
    },
    {
        formId: 4, name: 'End of Follow-up', uuid: "0ae4eb98-8a4e-4ada-bb25-a426429d74dd3",
        question: [
            {
                name: "question 1"
            },
            {
                name: "question 2"
            },
            {
                name: "question 3"
            },
            {
                name: "question 4"
            }

        ]

    },
]

const formOptions = [
    {
        value: 'Patient Information', label: 'Patient Information',

    },
    {
        value: 'Child Screening', label: 'Child Screening',

    },
    {
        value: 'Child Clinician Evaluation', label: 'Child Clinician Evaluation',

    },
    {
        value: 'End of Follow-up', label: 'End of Follow-up',

    }
]

class Engine extends Component {

    state = {
        step: 1,
        actionName: '',
        actionDescription: '',
        workflowList: [],
        phaseList: [],
        stageList: [],
        formList: [],
        isValidate: false
    }

    async componentWillMount() {
        await this.props.getAllWorkflow();
        await this.props.getAllStages();
        await this.props.getAllPhase();
        console.log("workflows", this.props.workflowList);
        if (this.props.workflowLists) {
            await this.setState({
                workflowList: this.props.workflowLists.workflows,
                phaseList: this.props.phaseLists.workflowPhasesMap,
                stageList: this.props.phaseComponentList.PhaseComponentsMap
            })

        }

    }
    async componentWillReceiveProps(nextProps) {
        if (nextProps.workflowLists) {
            await this.setState({
                workflowList: this.props.workflowLists.workflows,
                phaseList: this.props.phaseLists.workflowPhasesMap,
                stageList: this.props.phaseComponentList.PhaseComponentsMap
            })
        }
    }


    nextStep = () => {
        const { step } = this.state
        this.setState({
            step: step + 1
        })
    }
    prevStep = () => {
        const { step } = this.state
        this.setState({
            step: step - 1
        })
    }

    validation = () => {
        this.setState({

        })
    }


    saverule = () => {
        //Todo 
    }

    handleChange = input => e => {
        this.setState({ [input]: e.target.value })
    }

    handleActiveForm = stage => e => {
        e.preventDefault();
        toast.info('Please use next button', { containerId: 'AlertMessage' })
        // this.setState({
        //     step: stage
        // })
    }
    drawProgress(step) {
        return (
            <div className="row progress-container">
                {
                    step == 1 ?
                        <span className="circle active progress-span" onClick={this.handleActiveForm(1)}>1</span>
                        : <span className="circle gray progress-span" onClick={this.handleActiveForm(1)}>1</span>
                }
                {
                    step == 2 ?
                        //<span className="line active"></span>
                        <span className="circle active progress-span" onClick={this.handleActiveForm(2)}>2</span>
                        :
                        //  <span className="line active"></span>
                        <span className="circle gray progress-span" onClick={this.handleActiveForm(2)}>2</span>
                }
                {
                    step == 3 ?
                        <span className="circle active progress-span" onClick={this.handleActiveForm(3)}>3</span>
                        : <span className="circle  gray progress-span" onClick={this.handleActiveForm(3)}>3</span>
                }

            </div>
        )
    }
    render() {
        const { step, actionName, actionDescription, workflowList, phaseList, stageList } = this.state
        const values = { workflowType, actionTypes, formOptions, forms, phaseType, actionName, actionDescription, workflowList, stageList, phaseList }
        console.log("step render", step, workflowList)
        switch (step) {
            case 1:
                return (
                    <>
                        {this.drawProgress(1)}
                        <BasicActionDetail
                            nextStep={this.nextStep}
                            handleChange={this.handleChange}
                            values={values}
                        ></BasicActionDetail>
                        <ToastContainer enableMultiContainer containerId={'AlertMessage'} position={toast.POSITION.BOTTOM_RIGHT} />
                    </>
                )
            case 2:
                return (
                    <>
                        {this.drawProgress(2)}
                        <AddRule
                            nextStep={this.nextStep}
                            prevStep={this.prevStep}
                            handleChange={this.handleChange}
                            values={values}
                        />
                    </>

                )
            case 3:
                return (
                    <>
                        {this.drawProgress(3)}
                        <GeneralActions
                            prevStep={this.prevStep}
                            handleChange={this.handleChange}
                            saverule={this.saverule}
                            values={values}
                        >
                        </GeneralActions>
                    </>

                )
        }
    }
}

const mapStateToProps = state => ({
    workflowLists: state.ruleengine.workflows,
    phaseLists: state.ruleengine.workflowPhases,
    phaseComponentList: state.ruleengine.phaseComponents
})

const mapDispatchToProps = {
    getAllWorkflow: ruleenginAction.getAllWorkflow,
    getAllPhase: ruleenginAction.getWorkflowPhases,
    getAllStages: ruleenginAction.getPhaseComponent
}


export default connect(mapStateToProps, mapDispatchToProps)(Engine);