import React, { Component } from 'react'
import { formAction } from '../../../../../state/ducks/form'
import { connect } from 'react-redux'

class BasicActionDetail extends Component {

    constructor(props) {
        super(props)

        this.state = {
            availableForms: [],
            formToAdd: '',
            actionName: '',
            actionDescription: '',
            basicDetail: {}
        }
        this.forms = [];
        this.handleFormChange = this.handleFormChange.bind(this);
    }

    async componentWillMount() {
        await this.props.getAllForm();

    }
    async componentWillReceiveProps(nextProps) {
        console.log("engine available form :: ", nextProps.formList)
        if (nextProps.formList !== undefined) {
            await this.setState({
                availableForms: nextProps.formList.forms
            }, () => {

                if (this.state.availableForms) {
                    this.filterForm()
                }
            })
        }
    }
    moveNextStep = async (e) => {
        e.preventDefault();
        const { formToAdd, actionName, actionDescription } = this.state
        if (this.validations()) {
            await this.setState({
                basicDetail: {
                    form: formToAdd,
                    ruleName: actionName,
                    actionDescription: actionDescription
                }
            })
            localStorage.setItem('active-action-form', formToAdd)
            localStorage.setItem('active-action-form-name', actionName)
            localStorage.setItem('active-action-form-description', actionDescription)
            this.props.nextStep(this.state.basicDetail);
        }
    }

    validations() {
        return true
    }

    filterForm() {
        this.forms = [];
        let form = [];
        this.state.availableForms.forEach(element => {
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

    handleChange = (e) => {
        e.preventDefault();
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        const { actionDescription, actionName } = this.state
        return (
            <div className="row container-fluid ">
                <div className="card" style={{
                    width: '60%', display: 'block', marginLeft: 'auto',
                    marginRight: 'auto',
                    padding: '20px'
                }}>
                    <div className="card-body">
                        <form onSubmit={this.moveNextStep.bind(this)}>
                            <div className="row" >
                                <label className="ec-label">Select Form <span style={{ color: 'red' }}>*</span></label>
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
                            {/* action  */}
                            <div className="row" >
                                <label htmlFor="actionName" className="ec-label">Rule Name <span style={{ color: 'red' }}>*</span></label>
                                <input
                                    placeholder=""
                                    type="text"
                                    name="actionName"
                                    required
                                    className='form-control'
                                    value={actionName}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="row">
                                <label htmlFor="actionDescription" className="ec-label">Description </label>
                                <textarea
                                    placeholder=""
                                    type="text"
                                    name="actionDescription"
                                    rows='2'
                                    onChange={this.handleChange}
                                    className='form-control'
                                    value={actionDescription}
                                />
                            </div>
                            <div className="row" style={{ marginTop: '15px', marginBottom: '39px' }}>
                                <div className="col-sm-4" ></div>
                                <div className="col-sm-4" >
                                    <button onClick={this.props.prevStep.bind(this)} className='btn btn-primary save-btn ec-save-btn-row'>Go Back</button>
                                </div>
                                <div className='col-sm-4 '>
                                    <button type="submit" className='btn btn-primary save-btn ec-save-btn-row'>Next</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        )
    }
}

const mapStateToProps = state => ({
    formList: state.formField.forms
})

const mapDispatchToProps = {
    getAllForm: formAction.fetchForms
}

export default connect(mapStateToProps, mapDispatchToProps)(BasicActionDetail);


