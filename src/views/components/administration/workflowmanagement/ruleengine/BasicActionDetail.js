import React, { Component } from 'react'
import { formAction } from '../../../../../state/ducks/form'
import { connect } from 'react-redux'
import CardTemplate from '../../../../ui/cards/SimpleCard/CardTemplate'


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
                <form onSubmit={this.moveNextStep.bind(this)} style={{ width: '100%' }}>
                    <CardTemplate
                        title="Create Rule"
                        height="500px"
                        action={
                            <>
                                <button type="submit" className='service-btn btn btn-primary btn-re'>Next</button>
                                <button onClick={this.props.prevStep.bind(this)} className='service-btn btn btn-primary btn-re'>Go Back</button>

                            </>}
                    >
                        <div className="row" >
                            <div className="col-md-6">
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
                            <div className="col-md-6">
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

                        </div>
                        <div className="row">
                        <div className="col-md-10">
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

                        </div>
                    </CardTemplate>
                </form>
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


