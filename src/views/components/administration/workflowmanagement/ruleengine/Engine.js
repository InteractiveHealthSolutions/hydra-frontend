import React, { Component } from 'react'
import BasicActionDetail from './BasicActionDetail'
import AddRule from './AddRule'
import './ruleengine.css'
import { connect } from 'react-redux';
import { formAction } from '../../../../../state/ducks/form'
import { ruleenginAction } from '../../../../../state/ducks/ruleengine'
import TargetActions from './TargetActions'
import { createNotification } from '../../../../../utilities/helpers/helper'
import RuleEngineDetail from './RuleEngineDetail';

const actionTypes = [
    { value: 'hide', label: 'Hide' },
    { value: 'openform', label: 'Open Form' },
    { value: 'autoselect', label: 'Auto Select' },
];

class Engine extends Component {

    state = {
        step: 1,
        actionName: '',
        actionDescription: '',
        availableFormList: [],
        isValidate: false,
        ruleList: [],
    }

    async componentWillMount() {
    }
    async componentWillReceiveProps(nextProps) {
    }
    nextStep = async (data) => {
        if (data) {
            await this.setState({
                ruleList: [...this.state.ruleList, data]
            })
        }
        const { step } = this.state
        this.setState({
            step: step + 1
        })
    }
    prevStep = () => {
        const { step } = this.state
        this.setState({
            step: step - 1,
            ruleList: []
        })
    }

    validation = () => {
        this.setState({

        })
    }
    saverule = (data) => {
        this.setState({
            ruleList: [...this.state.ruleList, data]
        }, () => {
            this.saveRuleAction()

        })
    }

    async saveRuleAction() {
        const { ruleList } = this.state
        if (ruleList) {
            let targetFormList = []
            let ruleLists = []
            await ruleList.forEach(element => {
                if (element.ruleToken) {
                    ruleLists.push(element.ruleToken)
                } else if (element.targetForm) {
                    targetFormList.push(element.targetForm)
                }
            });
            let tokenList = await this.getTokenList(ruleLists)
            let newRule = {
                form: localStorage.getItem('active-action-form'),
                name: localStorage.getItem('active-action-form-name'),
                description: localStorage.getItem('active-action-form-description'),
                actionName: targetFormList[0].ruleAction ? targetFormList[0].ruleAction : "",
                targetForm: targetFormList[0].targetForm,
                targetQuestion: targetFormList[0].targetQuestion,
                targetFieldAnswer:targetFormList[0].targetFieldAnswer,
                tokens: tokenList
            }
            console.log("newRule" ,newRule)
            await this.props.saveRuleAction(newRule)
            await createNotification("success", "Saved Successfully")
            this.setState({
                step: 1,
                ruleList: []
            })
        } else {
            createNotification("error", "")
        }

    }

    async getTokenList(tokenList) {
        let array = []
        if (tokenList) {
            tokenList[0].forEach(element => {
                array.push({
                    typeName: element.type,
                    value: element.value
                })
            });
        }
        return array
    }

    handleChange = input => e => {
        this.setState({ [input]: e.target.value })
    }

    handleActiveForm = stage => e => {
        e.preventDefault();
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
        const { step, actionName, actionDescription, availableFormList, ruleList } = this.state
        const values = { actionTypes, actionName, actionDescription, availableFormList }
        switch (step) {
            case 1:
                return (
                    <RuleEngineDetail
                        nextStep={this.nextStep}
                    ></RuleEngineDetail>
                )
            case 2:
                return (
                    <>
                        {this.drawProgress(1)}
                        <BasicActionDetail
                            nextStep={this.nextStep}
                            handleChange={this.handleChange}
                            prevStep={this.prevStep}
                            values={values}
                        ></BasicActionDetail>
                    </>
                )
            case 3:
                return (
                    <>
                        {this.drawProgress(2)}
                        <AddRule
                            nextStep={this.nextStep}
                            prevStep={this.prevStep}
                            handleChange={this.handleChange}
                            values={values}
                            updateList={ruleList}
                        />
                    </>

                )
            case 4:
                return (
                    <>
                        {this.drawProgress(3)}
                        <TargetActions
                            prevStep={this.prevStep}
                            handleChange={this.handleChange}
                            saverule={this.saverule}
                            values={values}
                        >
                        </TargetActions>
                    </>

                )
        }
    }
}

const mapStateToProps = state => ({
    formList: state.formField.forms,
    ruleList: state.ruleengine.rules
})

const mapDispatchToProps = {
    getAllForm: formAction.fetchForms,
    saveRuleAction: ruleenginAction.saveFieldRule

}


export default connect(mapStateToProps, mapDispatchToProps)(Engine);