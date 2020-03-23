import React, { Component } from 'react'
import { RadioGroup } from './RadioGroup';
import TextBox from './TextBox';
import  './widgets.css'
import {
    NUMERIC,
    CODED,
    TEXT,
    DATE_TIME,
    HEADING,
    ADDRESS,
    CONTACT_TRACING
} from '../../../../../../../utilities/constants/globalconstants'
import CheckBox from './CheckBox';

export default class QuestionConfiguration extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isScorable: false,
            defaultValue: "",
            errorMsg: "",
            minValue: "",
            maxValue: "",
            maxLength: "",
            minLength: "",
            questionText: "",
            headingTitle: "",
            allowFutureDate: false,
            allowPastDaate: false,
            dateformat: "",
            regix: "",
            displayOrder: 1,
            mandatory: 'yes',
            allowCharacter: "",
            patientContacts: "",
            patientId: "",
            patientIdMandatory: 'yes',
            patientName: "",
            patientNameMandatory: 'yes',
            patientAge: "",
            patientAgeMandatory: 'yes',
            patientGender: "",
            patientGenderMandatory: 'yes',
            patientRelationship: "",
            patientRelationshipMandatory: 'yes'
        }

        console.log("QuestionConfiguration", this.props.dataField);
    }
    async componentDidMount() {
        await this.setDefaultValue()
    }

    async setDefaultValue() {
        console.log("defaultValue component", localStorage.getItem(`${this.props.uuid}-errorMsg`))
        await this.setState({
            defaultValue: localStorage.getItem(`${this.props.uuid}-defaultValue`),
            errorMsg: localStorage.getItem(`${this.props.uuid}-errorMsg`),
            allowCharacter: localStorage.getItem(`${this.props.uuid}-allowCharacter`),
            questionText: localStorage.getItem(`${this.props.uuid}-questionText`),
            mandatory: localStorage.getItem(`${this.props.uuid}-mandatory`),
            headingTitle: localStorage.getItem(`${this.props.uuid}-headingTitle`),
            minValue: localStorage.getItem(`${this.props.uuid}-minValue`),
            maxValue: localStorage.getItem(`${this.props.uuid}-maxValue`),
            maxLength: localStorage.getItem(`${this.props.uuid}-maxLength`),
            minLength: localStorage.getItem(`${this.props.uuid}-minLength`),
            isScorable: localStorage.getItem(`${this.props.uuid}-scorable`),
            dateformat: localStorage.getItem(`${this.props.uuid}-dateformat`),
            allowFutureDate: localStorage.getItem(`${this.props.uuid}-futureDate`),
            allowPastDaate: localStorage.getItem(`${this.props.uuid}-pastDate`),
            regix: localStorage.getItem(`${this.props.uuid}-rxp`),
            patientContacts: localStorage.getItem(`${this.props.uuid}-patientContacts`),
            patientId: localStorage.getItem(`${this.props.uuid}-patientId`),
            patientIdMandatory: localStorage.getItem(`${this.props.uuid}-patientIdMandatory`),
            patientName: localStorage.getItem(`${this.props.uuid}-patientName`),
            patientNameMandatory: localStorage.getItem(`${this.props.uuid}-patientNameMandatory`),
            patientGender: localStorage.getItem(`${this.props.uuid}-patientGender`),
            patientGenderMandatory: localStorage.getItem(`${this.props.uuid}-patientGenderMandatory`),
            patientAge: localStorage.getItem(`${this.props.uuid}-patientAge`),
            patientAgeMandatory: localStorage.getItem(`${this.props.uuid}-patientAgeMandatory`),
            patientRelationship: localStorage.getItem(`${this.props.uuid}-patientRelationship`),
            patientRelationshipMandatory: localStorage.getItem(`${this.props.uuid}-patientRelationshipMandatory`),
        }, () => {
            console.log("defaultValue", this.state.allowPastDaate)
        })
    }

    onItemSelectedProp = (ev) => {
        this.setState({
            [ev.controlId]: ev.value
        })
        localStorage.setItem(`${ev.name}`, ev.value)
    }

    setStateAccordingToControlId(controlId, value) {
        switch (controlId) {
            case "displayOrder":
                this.setState({
                    displayOrder: value
                })
                break;
            case "defaultValue":
                this.setState({
                    defaultValue: value
                })
                break;
            case "errorMsg":
                this.setState({
                    errorMsg: value
                })
                break;
            case "allowCharacter":
                this.setState({
                    allowCharacter: value
                })
                break;
            case "questionText":
                this.setState({
                    questionText: value
                })
                break;
            case "mandatory":
                this.setState({
                    mandatory: value
                })
                break;
            case "headingTitle":
                this.setState({
                    headingTitle: value
                })
                break;
            case "minLength":
                this.setState({
                    minLength: value
                })
                break;
            case "maxLength":
                this.setState({
                    maxLength: value
                })
                break;
            case "minValue":
                this.setState({
                    minValue: value
                })
                break;
            case "maxValue":
                this.setState({
                    maxValue: value
                })
                break;
            case "rxp":
                this.setState({
                    regix: value
                })
                break;
            case "dateformat":
                this.setState({
                    dateformat: value
                })
                break;
            case "futureDate":
                this.setState({
                    allowFutureDate: value
                })
                break;
            case "pastDate":
                this.setState({
                    allowPastDaate: value
                })
                break;
            default:
        }

    }

    handleRadioChange = (ev) => {
        this.setState({
            [ev.controlId]: ev.value
        }, () => {
            console.log("handleRadioChange", this.state.patientContacts)
        })
        // this.setStateAccordingToControlId(ev.controlId, ev.value)
        localStorage.setItem(`${ev.name}`, ev.value)
    }
    onItemCheckedProp = (ev) => {
        this.setState({
            [ev.controlId]: ev.value
        })
        /// this.setStateAccordingToControlId(ev.controlId, ev.value)
        localStorage.setItem(`${ev.name}`, ev.value)
    }

    render() {

        const { datatype, uuid } = this.props
        const { patientAge, patientAgeMandatory, patientContacts, patientGender, patientGenderMandatory
            , patientId, patientIdMandatory, patientName, patientNameMandatory, patientRelationship, patientRelationshipMandatory,
            displayOrder, headingTitle, allowFutureDate, allowPastDaate, dateformat, mandatory, minValue, maxValue, maxLength, regix, minLength, errorMsg, allowCharacter, isScorable, questionText, defaultValue } = this.state
        return (
            <>
                {/* common */}
                {(datatype === HEADING) ?
                    <TextBox
                        controlId="questionText"
                        title="Title"
                        type="text"
                        name={uuid + "-questionText"}
                        value={questionText}
                        onItemSelectedProp={this.onItemSelectedProp}
                    /> : ""
                }
                {(datatype === ADDRESS) ? <>
                    {/* <label>Show Address hierarchy</label> */}
                    <TextBox
                        controlId="questionText"
                        title="Question text"
                        type="text"
                        value={questionText}
                        name={uuid + "-questionText"}
                        onItemSelectedProp={this.onItemSelectedProp}
                    />
                </>
                    : ""
                }

                {(datatype !== HEADING && datatype !== ADDRESS) ?
                    <>
                        <TextBox
                            controlId="questionText"
                            title="Question text"
                            type="text"
                            value={questionText}
                            name={uuid + "-questionText"}
                            onItemSelectedProp={this.onItemSelectedProp}
                        />
                        <RadioGroup
                            controlId="mandatory"
                            title="Mandatory?"
                            name={uuid + "-mandatory"}
                            value={mandatory}
                            handleRadioChange={this.handleRadioChange}
                            options={[{ key: "1" + this.props.uuid, title: "Yes" }, { key: "2" + this.props.uuid, title: "No" }]}
                        />
                        {
                            (datatype !== CONTACT_TRACING) ?
                                <TextBox
                                    controlId="errorMsg"
                                    title="Custom Error Message"
                                    type="text"
                                    value={errorMsg}
                                    name={uuid + "-errorMsg"}
                                    onItemSelectedProp={this.onItemSelectedProp}
                                /> : ""
                        }
                    </> : ""
                }
                {/* numeric */}
                {
                    (datatype === NUMERIC) ?
                        <>
                            <TextBox
                                controlId="minValue"
                                title="Minimum Value"
                                name={uuid + "-minValue"}
                                type="number"
                                value={minValue}
                                onItemSelectedProp={this.onItemSelectedProp}
                            />
                            <TextBox
                                controlId="maxValue"
                                title="Maximum Value"
                                name={uuid + "-maxValue"}
                                type="number"
                                value={maxValue}
                                onItemSelectedProp={this.onItemSelectedProp}
                            />
                            <CheckBox
                                controlId="allowDecimal"
                                name={uuid + "-allowDecimal"}
                                onItemCheckedProp={this.onItemCheckedProp}
                                title="Allow Decimal"
                            />
                        </> : ""
                }
                {/* common */}
                {
                    (datatype === CODED) ?
                        <>
                            {/* <RadioGroup
                                controlId="scorable"
                                title="Is this scorable"
                                key="scorable"
                                name={uuid + "-scorable"}
                                value={isScorable}
                                handleRadioChange={this.handleRadioChange}
                                options={[{ key: "3" + uuid, title: "Yes"}, { key: "4" + this.props.uuid, title: "No" }]}
                            />
                            {
                                (this.state.isScorable) ?
                                    <>
                                        {this.props.data.map(option => (
                                            <div className="row">
                                                <div className="col-sm-6 col-md-8">
                                                    <TextBox
                                                        controlId="answer"
                                                        title={option.concept.display}
                                                        type="text"
                                                        placeholdertext="Change  your question text"
                                                        name={option.concept.display}
                                                        onItemSelectedProp={this.onItemSelectedProp}
                                                    />
                                                </div>
                                                <div className="col-sm-6 col-md-4">
                                                    <TextBox
                                                        controlId="score"
                                                        title="Score"
                                                        type="number"
                                                        min="0"
                                                        name="score"
                                                        onItemSelectedProp={this.onItemSelectedProp}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </> : ""
                            } */}

                            <TextBox
                                controlId="defaultValue"
                                title="Default Value"
                                type="text"
                                name={uuid + "-defaultValue"}
                                value={defaultValue}
                                onItemSelectedProp={this.onItemSelectedProp}
                            />
                        </> : ""
                }
                {
                    (datatype === TEXT) ?
                        <>
                            <TextBox
                                controlId="minLength"
                                title="Minimum Length"
                                name={uuid + "-minLength"}
                                type="number"
                                value={minLength}
                                onItemSelectedProp={this.onItemSelectedProp}
                            />
                            <TextBox
                                controlId="maxLength"
                                title="Maximum Length"
                                type="number"
                                value={maxLength}
                                name={uuid + "-maxLength"}
                                onItemSelectedProp={this.onItemSelectedProp}
                            />
                            <TextBox
                                controlId="rxp"
                                title="Regular Expression Pattern"
                                type="text"
                                value={regix}
                                name={uuid + "-rxp"}
                                onItemSelectedProp={this.onItemSelectedProp}
                            />
                            <TextBox
                                controlId="defaultValue"
                                title="Default Value"
                                type="text"
                                value={defaultValue}
                                name={uuid + "-defaultValue"}
                                onItemSelectedProp={this.onItemSelectedProp}
                            />
                            <TextBox
                                controlId="allowCharacter"
                                title="Allow Characters"
                                type="text"
                                value={allowCharacter}
                                name={uuid + "-allowCharacter"}
                                onItemSelectedProp={this.onItemSelectedProp}
                            />

                            {/* <RadioGroup
                                controlId="disabled"
                                title="Disabled?"
                                key="Disabled"
                                name={uuid + "-disabled"}
                                handleRadioChange={this.handleRadioChange}
                                options={[{ key: "5" + this.props.uuid, title: "Yes" }, { key: "6" + this.props.uuid, title: "No" }]}
                            /> */}

                        </> : ""
                }
                {/* date DATE_TIME */}

                {
                    (datatype === DATE_TIME) ?
                        <>
                            <RadioGroup
                                controlId="dateformat"
                                title="Date?"
                                key="date"
                                name={uuid + "-dateformat"}
                                value={dateformat}
                                handleRadioChange={this.handleRadioChange}
                                options={[{ key: "7" + uuid, title: "Only date" }, { key: "8" + uuid, title: "Only time" }, { key: "9" + uuid, title: "Date time" }]}
                            />
                            <CheckBox
                                controlId="futureDate"
                                onItemCheckedProp={this.onItemCheckedProp}
                                value={allowFutureDate}
                                name={uuid + "-futureDate"}
                                title="Allow future date?"
                            />
                            <CheckBox
                                controlId="pastDate"
                                name={uuid + "-pastDate"}
                                value={allowPastDaate}
                                onItemCheckedProp={this.onItemCheckedProp}
                                title="Allow past date?"
                            />

                        </>
                        : ""

                }

                {/* Contact Tracing */}

                {
                    (datatype === CONTACT_TRACING) ?
                        <>
                            <RadioGroup
                                controlId="patientContacts"
                                title="Create Patient for Contacts?"
                                name={uuid + "-patientContacts"}
                                value={patientContacts}
                                handleRadioChange={this.handleRadioChange}
                                options={[{ key: "11" + this.props.uuid, title: "Yes" }, { key: "22" + this.props.uuid, title: "No" }]}
                            />
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">S.No</th>
                                        <th scope="col">Question</th>
                                        <th scope="col">Display Name</th>
                                        <th scope="col">Mandatory</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className ={(patientContacts === 'No'?'tr_back':"")}>
                                        <th>1</th>
                                        <td>Patient ID</td>
                                        <td>
                                            <TextBox
                                                disabled={patientContacts === 'No' ? "Yes" : "No"}
                                                controlId="patientId"
                                                name={uuid + "-patientId"}
                                                type="text"
                                                value={patientId}
                                                onItemSelectedProp={this.onItemSelectedProp}
                                            />
                                        </td>
                                        <td>
                                            <CheckBox
                                                disabled={"Yes"}
                                                controlId="patientIdMandatory"
                                                name={uuid + "-patientIdMandatory"}
                                                value={patientContacts === 'Yes' ? "true" : patientIdMandatory}
                                                onItemCheckedProp={this.onItemCheckedProp}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>2</th>
                                        <td>Name</td>
                                        <td>
                                            <TextBox
                                                controlId="patientName"
                                                name={uuid + "-patientName"}
                                                type="text"
                                                value={patientName}
                                                onItemSelectedProp={this.onItemSelectedProp}
                                            />

                                        </td>
                                        <td>
                                            <CheckBox
                                                disabled={patientContacts}
                                                controlId="patientNameMandatory"
                                                name={uuid + "-patientNameMandatory"}
                                                value={patientContacts === 'Yes' ? "true" : patientNameMandatory}
                                                onItemCheckedProp={this.onItemCheckedProp}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>3</th>
                                        <td>Age</td>
                                        <td>
                                            <TextBox
                                                controlId="patientAge"
                                                name={uuid + "-patientAge"}
                                                type="text"
                                                value={patientAge}
                                                onItemSelectedProp={this.onItemSelectedProp}
                                            />
                                        </td>
                                        <td>
                                            <CheckBox
                                                disabled={patientContacts}
                                                controlId="patientAgeMandatory"
                                                name={uuid + "-patientAgeMandatory"}
                                                value={patientContacts === 'Yes' ? "true" : patientAgeMandatory}
                                                onItemCheckedProp={this.onItemCheckedProp}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>4</th>
                                        <td>Gender</td>
                                        <td>
                                            <TextBox
                                                controlId="patientGender"
                                                name={uuid + "-patientGender"}
                                                type="text"
                                                value={patientGender}
                                                onItemSelectedProp={this.onItemSelectedProp}
                                            />
                                        </td>
                                        <td>
                                            <CheckBox
                                                disabled={patientContacts}
                                                controlId="patientGenderMandatory"
                                                name={uuid + "-patientGenderMandatory"}
                                                value={patientContacts === 'Yes' ? "true" : patientGenderMandatory}
                                                onItemCheckedProp={this.onItemCheckedProp}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>5</th>
                                        <td>Relationship</td>
                                        <td>
                                            <TextBox
                                                controlId="patientRelationship"
                                                name={uuid + "-patientRelationship"}
                                                type="text"
                                                value={patientRelationship}
                                                onItemSelectedProp={this.onItemSelectedProp}
                                            />
                                        </td>
                                        <td>
                                            <CheckBox
                                                disabled={patientContacts}
                                                controlId="patientRelationshipMandatory"
                                                name={uuid + "-patientRelationshipMandatory"}
                                                value={patientContacts === 'Yes' ? "true" : patientRelationshipMandatory}
                                                onItemCheckedProp={this.onItemCheckedProp}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </>
                        : ""

                }

            </>
        )
    }
}
