import React, { Component } from 'react'
import Card from '@material-ui/core/Card';
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
    OPEN_PARANTHESES
} from "../../../../utilities/constants/globalconstants";



export default class AddRule extends Component {

    constructor(props) {
        super(props)

        this.state = {
            formListItems: [],
            operator: [],
        }
    }
    componentWillReceiveProps() {

    }

    nextStep = e => {
        e.preventDefault();
        this.props.nextStep();
    }
    prevStep = e => {
        e.preventDefault();
        this.props.prevStep();
    }

    handleOperator = (operator) => e => {
        e.preventDefault();
        this.setState({
            operator: this.state.operator.concat(operator)
        })
    }

    handleAddQuestion =(name) => e => {
        e.preventDefault();
        this.setState({
            operator: this.state.operator.concat(name)
        })
    }


    renderFormData() {
        return this.props.values.forms.map(form => (

            <ExpansionPanel style={{ width: '100%' }}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography >{form.name}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <ul style ={{width:'100%'}}>
                        {
                            form.question.map(q => (
                                <div className="row" >
                                    
                                    <div className="col-sm-8">
                                        <li style={{ justifyContent: 'flex-start' }}>{q.name}</li>
                                    </div>
                                    <div className="col-sm-4 text-right" onClick = {this.handleAddQuestion(q.name)}>
                                        <i class="fa fa-plus active" style={{ justifyContent: 'flex-end',cursor:'pointer' }} ></i>
                                    </div>
                                </div>
                            ))
                        }
                    </ul>
                </ExpansionPanelDetails>
            </ExpansionPanel>

        ))

    }

    render() {
        return (
            <div className="row container-fluid  ">
                <div className="card" style={{
                    width: '75%', display: 'block', marginLeft: 'auto',
                    marginRight: 'auto',
                    padding: '20px'
                }}>
                    {/* <div className="card-header"></div> */}
                    <div className="card-body">
                        <div className="row">
                            <div className="col-6 col-sm-6">
                                <div>
                                    <textarea
                                        placeholder=""
                                        type="text"
                                        name="description"
                                        rows='4'
                                        value={this.state.operator}
                                        // onChange={handleChange('actionDescription')}
                                        className='form-control'
                                    //  defaultValue={values.actionDescription}
                                    />
                                </div>
                                <div className="row  control-contaier" >
                                    <button className='btn btn-primary control-btn' onClick={this.handleOperator(PLUS)}>{PLUS}</button>
                                    <button className='btn btn-primary control-btn' onClick={this.handleOperator(EQUAL)}>{EQUAL}</button>
                                    <button className='btn btn-primary control-btn' onClick={this.handleOperator(OPEN_PARANTHESES)}>{OPEN_PARANTHESES}</button>
                                    <button className='btn btn-primary control-btn' onClick={this.handleOperator(CLOSE_PARANTHESES)} >{CLOSE_PARANTHESES}</button>
                                    <button className='btn btn-primary control-btn' onClick={this.handleOperator(AND)} >{AND}</button>
                                    <button className='btn btn-primary control-btn' onClick={this.handleOperator(OR)}>{OR}</button>
                                </div>
                            </div>
                            {/* question section  */}
                            <div className="col-6 col-sm-6">
                                <div className="row">
                                    {this.renderFormData()}
                                </div>
                            </div>
                        </div>
                        <div className="row " style={{ marginTop: '20px', marginBottom: '20px' }}>
                            <div className="col-sm-4" ></div>
                            <div className="col-sm-4" >
                                <button onClick={this.prevStep.bind(this)} className='btn btn-primary save-btn ec-save-btn-row'>Previous</button>
                            </div>
                            <div className='col-sm-4 '>
                                <button onClick={this.nextStep.bind(this)} className='btn btn-primary save-btn ec-save-btn-row'>Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
