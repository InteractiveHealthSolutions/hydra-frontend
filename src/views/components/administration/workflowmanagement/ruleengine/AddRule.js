import React, { Component } from 'react'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
    AND,
    OR,
    EQUAL,
    PLUS,
    CLOSE_PARANTHESES,
    OPEN_PARANTHESES,
    GREATER_THEN,
    GREATER_THEN_EQUAL,
    LESS_THEN,
    LESS_THEN_EQUAL,
    NOT_EQUAL,
    NOW,
    NULL,
    NOTNULL,
    FUNCTION,
    OPERATOR,
    CODEDVALUE,
    OPENVALUE,
    NULLABLE,
    QUESTION

} from "../../../../../utilities/constants/globalconstants";
import { connect } from 'react-redux'
import { formAction } from '../../../../../state/ducks/form'
import QuestionListExpendableView from './utils/QuestionListExpendableView';
import TextBox from '../formbuilder/formComponents/widgets/TextBox';
import { createNotification } from '../../../../../utilities/helpers/helper'
import ChipView from './utils/ChipView'
import CardTemplate from '../../../../ui/cards/SimpleCard/CardTemplate'

class AddRule extends Component {

    constructor(props) {
        super(props)
        this.state = {
            formListItems: [],
            operator: "",
            activeFormUuid: '',
            availableFormsQuestion: [],
            userInput: "",
            ruleArea: '',
            ruleToDisplay: "",
            ruleActionList: [],
            operatorList: [
                {
                    label: EQUAL,
                    value: "equal"
                },
                {
                    label: NOT_EQUAL,
                    value: "not_equal"
                },
                {
                    label: GREATER_THEN,
                    value: "greater_then"
                },
                {
                    label: LESS_THEN,
                    value: "less_then"
                },
                {
                    label: GREATER_THEN_EQUAL,
                    value: "greater_then_equal"
                },
                {
                    label: GREATER_THEN_EQUAL,
                    value: "greater_then_equal"
                },
            ]
        }
    }

    async componentWillMount() {
        this.setState({
            activeFormUuid: localStorage.getItem('active-action-form')
        })
        await this.props.getFormByUuid(localStorage.getItem('active-action-form'))
    }

    async componentWillReceiveProps(nextProps) {
        if (nextProps.formQuestionList !== undefined) {
            await this.setState({
                availableFormsQuestion: nextProps.formQuestionList
            })
        }
    }

    nextStep = e => {
        e.preventDefault();
        if (this.state.ruleActionList.length > 0) {
            this.props.nextStep({ ruleToken: this.state.ruleActionList });
        } else {
            createNotification("info", "Please specify rule for this form")
        }

    }
    prevStep = e => {
        e.preventDefault();
        this.props.prevStep();
    }

    handleOperator = (operator) => e => {
        e.preventDefault();
        if (operator === 'null' || operator === 'now') {
            this.setState({
                ruleActionList: [...this.state.ruleActionList, { value: operator, type: FUNCTION, label: operator }]
            })
        }
        else {
            this.setState({
                ruleActionList: [...this.state.ruleActionList, { value: operator, type: OPERATOR, label: operator }]
            })
        }

    }

    handleAddQuestion = (questionData) => {
        if (!this.checkTheVariablePosition(questionData)) {
            this.setState({
                ruleActionList: [...this.state.ruleActionList, { type: QUESTION, value: questionData.uuid, label: questionData.display }]
            })
        }

    }
    handleAddQuestionAnswer = (questionAnsData) => {
        if (!this.checkTheVariablePosition(questionAnsData)) {
            this.setState({
                ruleActionList: [...this.state.ruleActionList, { type: CODEDVALUE, value: questionAnsData.uuid, label: questionAnsData.display }]
            })
        }
    }

    checkTheVariablePosition(value) {
        let valid = false
        const { ruleActionList } = this.state
        if (ruleActionList.length > 0) {
            let lastIndexValue = ruleActionList.length - 1
            if (ruleActionList[lastIndexValue].label === value.display) {
                createNotification("warning", "Already exist")
                valid = true;
            }
        }
        return valid

    }


    onDrop = (ev) => {
        const val = ev.dataTransfer.getData('id')
        console.log("ondrop :: ", val)
        const { ruleActionList } = this.state
        if (!this.checkTheVariablePosition({ display: val })) {
            this.setState({
                ruleActionList: [...ruleActionList, { label: val, value: val }]
            })
        }

    }

    onDragStart = (ev, uuid) => {
        console.log("onDragStart :: ", uuid)
        ev.dataTransfer.setData('id', uuid)
    }

    onDragOver = (e) => {
        e.preventDefault();

    }
    onItemSelectedProp = (val) => {
        this.setState({
            userInput: val.value
        })
    }
    addUserInput = (val) => {
        const { userInput, ruleActionList } = this.state
        if (!this.checkTheVariablePosition({ display: userInput })) {
            this.setState({
                ruleActionList: [...this.state.ruleActionList, { type: OPENVALUE, value: userInput, label: userInput }],
                userInput: ""
            })
        }
    }

    handleDelete = (e, val) => {
        e.preventDefault()
        const { userInput, ruleActionList } = this.state
        this.setState({
            ruleActionList: ruleActionList.filter(data => data.label !== val.label)
        })
    }
    render() {
        const { availableFormsQuestion, ruleActionList } = this.state
        return (
            <div className="row container-fluid">
                <CardTemplate
                    title="Add Rule"
                    height="500px"
                    action={
                        <>
                            <button onClick={this.prevStep.bind(this)} className='btn btn-primary btn-re'>Previous</button>
                            <button onClick={this.nextStep.bind(this)} className='btn btn-primary btn-re'>Next</button>
                        </>
                    }
                >
                    <div className="row">
                        <div className="col-md-6">
                            <div className="row no-gutters">
                                <div className="col-md-11">
                                    <TextBox
                                        title="Enter Value"
                                        name="rulevalue"
                                        value={this.state.userInput}
                                        onItemSelectedProp={this.onItemSelectedProp}
                                    />
                                </div>
                                <div className="col-md-1">
                                    <button
                                        onClick={this.addUserInput}
                                        style={{ marginTop: '32px',float:'right' }}
                                        type="button"
                                        className="btn btn-primary">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                            </div>

                            <div
                                style={{ height: '200px', padding: '8px', width: '100%', overflowY: 'scroll', border: '1px solid var(--bg)' }}
                                onDragOver={(e) => this.onDragOver(e)}
                                onDrop={(e) => this.onDrop(e)}
                               >
                                <ChipView
                                    ruleActionList={ruleActionList}
                                    handleDelete={this.handleDelete}
                                />
                            </div>
                            <div className="row  control-rule-contaier" >
                                <button
                                    className='btn btn-primary control-btn'
                                    onClick={this.handleOperator(NOT_EQUAL)}
                                    draggable
                                    onDragStart={(e) => this.onDragStart(e, NOT_EQUAL)}
                                >{NOT_EQUAL}</button>
                                <button
                                    className='btn btn-primary control-btn'
                                    onClick={this.handleOperator(EQUAL)}
                                    draggable
                                    onDragStart={(e) => this.onDragStart(e, EQUAL)}
                                >{EQUAL}</button>
                                <button
                                    className='btn btn-primary control-btn'
                                    onClick={this.handleOperator(GREATER_THEN)}
                                    draggable
                                    onDragStart={(e) => this.onDragStart(e, GREATER_THEN)}
                                >{GREATER_THEN}</button>
                                <button
                                    className='btn btn-primary control-btn'
                                    onClick={this.handleOperator(LESS_THEN)}
                                    draggable
                                    onDragStart={(e) => this.onDragStart(e, LESS_THEN)}
                                >{LESS_THEN}</button>
                                <button
                                    className='btn btn-primary control-btn'
                                    onClick={this.handleOperator(GREATER_THEN_EQUAL)}
                                    draggable
                                    onDragStart={(e) => this.onDragStart(e, GREATER_THEN_EQUAL)}
                                >{GREATER_THEN_EQUAL}</button>
                                <button
                                    className='btn btn-primary control-btn'
                                    onClick={this.handleOperator(LESS_THEN_EQUAL)}
                                    draggable
                                    onDragStart={(e) => this.onDragStart(e, LESS_THEN_EQUAL)}
                                >{LESS_THEN_EQUAL}</button>
                            </div>
                            {/* NEXT LIST  */}
                            <div className="row  control-rule-contaier" >
                                <button
                                    className='btn btn-primary control-btn'
                                    onClick={this.handleOperator(OR)}
                                    draggable
                                    onDragStart={(e) => this.onDragStart(e, OR)}
                                >{OR}</button>
                                <button
                                    className='btn btn-primary control-btn'
                                    onClick={this.handleOperator(AND)}
                                    draggable
                                    onDragStart={(e) => this.onDragStart(e, AND)}
                                >{AND}</button>
                                <button
                                    className='btn btn-primary control-btn'
                                    onClick={this.handleOperator(OPEN_PARANTHESES)}
                                    draggable
                                    onDragStart={(e) => this.onDragStart(e, OPEN_PARANTHESES)}
                                >{OPEN_PARANTHESES}</button>
                                <button
                                    className='btn btn-primary control-btn'
                                    onClick={this.handleOperator(CLOSE_PARANTHESES)}
                                    draggable
                                    onDragStart={(e) => this.onDragStart(e, CLOSE_PARANTHESES)}
                                >{CLOSE_PARANTHESES}</button>
                                <button
                                    className='btn btn-primary control-btn'
                                    onClick={this.handleOperator(NOW)}
                                    draggable
                                    onDragStart={(e) => this.onDragStart(e, NOW)}
                                >{NOW}</button>
                                <button
                                    className='btn btn-primary control-btn'
                                    onClick={this.handleOperator(NULL)}
                                    draggable
                                    onDragStart={(e) => this.onDragStart(e, NULL)}
                                >{NULL}</button>
                            </div>
                        </div>
                        {/* question section  */}
                        <div className="col-md-6">
                            {
                                (this.state.availableFormsQuestion) ?
                                    <QuestionListExpendableView
                                        form={availableFormsQuestion}
                                        handleAddQuestion={this.handleAddQuestion}
                                        handleAddQuestionAnswer={this.handleAddQuestionAnswer}
                                    />
                                    : ""
                            }
                        </div>
                    </div>
                </CardTemplate>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    formQuestionList: state.formField.formbyuuid
})

const mapDispatchToProps = {
    getFormByUuid: formAction.getFormByUuid
}

export default connect(mapStateToProps, mapDispatchToProps)(AddRule);