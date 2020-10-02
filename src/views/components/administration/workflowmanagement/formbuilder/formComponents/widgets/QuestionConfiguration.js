import React, { Component } from 'react'
import { RadioGroup } from './RadioGroup';
import TextBox from './TextBox';
import { phaseAction } from '../../../../../../../state/ducks/phase';
import { formAction } from '../../../../../../../state/ducks/form'
import { connect } from 'react-redux'
import './widgets.css'
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
import Select from 'react-select';
import SingleSelect from './SingleSelect';

class QuestionConfiguration extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isScorable: false,
            defaultValue: {},
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
            occurence: "Earliest",
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
            patientRelationshipMandatory: 'yes',
            patientGivenName: "",
            patientGivenNameMandatory: 'yes',
            patientFamilyName: "",
            patientFamilyNameMandatory: 'yes',
            disabled: 'yes',
            allowDecimal: false,
            selectOptions: [],
            phaseDropdown: [],
            componentDropdown: [],
            selectedPhaseUUID: '',
            showAutoCompleteOption: false,
            formDropdown: [],
            questionDropDown: []

        }

        console.log("QuestionConfiguration", localStorage.getItem(`${this.props.uuid}-defaultValue`));
    }
    async componentDidMount() {
        await this.setDefaultValue();
        await this.setWorkflowOptions();
    }
    async componentWillReceiveProps(nextProps) {
        if (nextProps.workflow != undefined) {
            await this.setWorkflowOptions()
        }
        if (nextProps.componentFormList != undefined) {
            await this.createFormDropdown(this.props.uuid);
        }
        if (nextProps.fieldList != undefined) {
            await this.createQuestionDropDown()
        }
    }
    async setWorkflowOptions() {
        //this.state.selectOptions = [];
        this.props.workflow.forEach(element => {
            var array = this.state.selectOptions;

            var existingObj = array.filter(data => data.value == element.workflow.uuid);
            if (JSON.stringify(existingObj) === '[]') {
                this.state.selectOptions.push({
                    "value": element.workflow.uuid,
                    "label": element.workflow.name
                })
            }
        });

    }

    async setDefaultValue() {
        await this.setState({
            defaultValue: this.setDefault(),
            errorMsg: localStorage.getItem(`${this.props.uuid}-errorMsg`),
            allowCharacter: localStorage.getItem(`${this.props.uuid}-allowCharacter`),
            questionText: localStorage.getItem(`${this.props.uuid}-questionText`),
            mandatory: localStorage.getItem(`${this.props.uuid}-mandatory`),
            headingTitle: localStorage.getItem(`${this.props.uuid}-headingTitle -${this.props.displayOrder}`),
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
            patientGivenName: localStorage.getItem(`${this.props.uuid}-patientGivenName`),
            patientGivenNameMandatory: localStorage.getItem(`${this.props.uuid}-patientGivenNameMandatory`),
            patientFamilyName: localStorage.getItem(`${this.props.uuid}-patientFamilyName`),
            patientFamilyNameMandatory: localStorage.getItem(`${this.props.uuid}-patientFamilyNameMandatory`),
            patientGender: localStorage.getItem(`${this.props.uuid}-patientGender`),
            patientGenderMandatory: localStorage.getItem(`${this.props.uuid}-patientGenderMandatory`),
            patientAge: localStorage.getItem(`${this.props.uuid}-patientAge`),
            patientAgeMandatory: localStorage.getItem(`${this.props.uuid}-patientAgeMandatory`),
            patientRelationship: localStorage.getItem(`${this.props.uuid}-patientRelationship`),
            patientRelationshipMandatory: localStorage.getItem(`${this.props.uuid}-patientRelationshipMandatory`),
            disabled: localStorage.getItem(`${this.props.uuid}-disabled`),
            allowDecimal: localStorage.getItem(`${this.props.uuid}-allowDecimal`)
        }, () => {
            //console.log("setDefaultValue", `${this.props.uuid}-defaultValue`, localStorage.getItem(`${this.props.uuid}-defaultValue`))

        })
    }

    setDefault() {
        let defaultUUid = ""

        try {
            defaultUUid = JSON.parse(localStorage.getItem(`${this.props.uuid}-defaultValue`)).value
        } catch (err) {
            // console.log("defaultValue", localStorage.getItem(`${this.props.uuid}-defaultValue`))
            defaultUUid = localStorage.getItem(`${this.props.uuid}-defaultValue`)

        }

        // if (typeof localStorage.getItem(`${this.props.uuid}-defaultValue`)  == "object"){
        //     console.log("defaultValue", localStorage.getItem(`${this.props.uuid}-defaultValue`))
        //   }else{
        //     console.log("defaultValue not ", localStorage.getItem(`${this.props.uuid}-defaultValue`))
        //     defaultUUid = localStorage.getItem(`${this.props.uuid}-defaultValue`)
        //   }


        //      defaultUUid = localStorage.getItem(`${this.props.uuid}-defaultValue`)?JSON.parse(localStorage.getItem(`${this.props.uuid}-defaultValue`)).value:""
        // console.log("setDefaultValue dd d", defaultUUid)

        return this.props.answers ?
            this.props.answers.filter(el => el.uuid === defaultUUid)
                .map(data => ({
                    label: data.concept.display,
                    value: data.uuid
                })) : localStorage.getItem(`${this.props.uuid}-defaultValue`) ? JSON.parse(localStorage.getItem(`${this.props.uuid}-defaultValue`)) : ""
        //    return this.props.editeMood?
        //        this.props.answers?
        //          this.props.answers.filter(el=> el.uuid === localStorage.getItem(`${this.props.uuid}-defaultValue`))
        //          .map(data => ({
        //             label:data.concept.display,
        //             value:data.uuid
        //         })):"" :localStorage.getItem(`${this.props.uuid}-defaultValue`)? JSON.parse(localStorage.getItem(`${this.props.uuid}-defaultValue`)):"" 
    }

    onHandleDefaultValue = (ev, name, controlId) => {
        console.log("Naam dena", name, JSON.stringify(ev))
        this.setState({
            [controlId]: ev
        })
        localStorage.setItem(`${name}`, JSON.stringify(ev))
    }

    onHandleWorkflowValue = (ev, name, controlId) => {
        console.log("Naam dena", name, JSON.stringify(ev))
        this.setState({
            [controlId]: ev
        })
        localStorage.setItem(`${name}`, ev.value);
        this.createPhaseDropdown(ev.value)


    }

    sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    async createPhaseDropdown(value) {
        await this.props.getWorkflowPhaseByWorkflow(value);
        let phaseDropdown = [];
        await this.setState({ phaseDropdown: [] });
        await this.props.workflowPhase.results.forEach(element => {
            var array = phaseDropdown;

            var existingObj = array.filter(data => data.value == element.hydramodulePhase.uuid);
            if (JSON.stringify(existingObj) === '[]') {
                phaseDropdown.push({
                    "label": element.hydramodulePhase.name,
                    "value": element.hydramodulePhase.uuid
                });
            }

        })

        await this.setState({ phaseDropdown: phaseDropdown })
    }
    onHandlePhaseValue = (ev, name, controlId) => {
        console.log("Naam dena", name, JSON.stringify(ev))
        this.setState({
            [controlId]: ev
        })
        localStorage.setItem(`${name}`, ev.value)
        this.setState({ selectedPhaseUUID: ev.value })
        // let componentDropdown = [];
        // this.props.workflowPhase.results.forEach(element => {
        //     if(element.phaseUUID === this.state.selectedPhaseUUID) {
        //         componentDropdown.push({
        //             "label": element.hydramoduleComponent.name,
        //             "value": element.hydramoduleComponent.uuid
        //         })
        //     }
        // })

        //  this.setState({componentDropdown: componentDropdown})
        this.createComponentDropDown(ev.value);
    }
    async createComponentDropDown(value) {
        let componentDropdown = [];
        await this.setState({ componentDropdown: [] })
        await this.props.workflowPhase.results.forEach(element => {
            if (element.phaseUUID === this.state.selectedPhaseUUID) {
                componentDropdown.push({
                    "label": element.hydramoduleComponent.name,
                    "value": element.hydramoduleComponent.uuid
                })
            }
        })

        await this.setState({ componentDropdown: componentDropdown })
    }
    async onHandleComponentValue(ev, name, controlId, uuid) {
        console.log("Naam dena", name, JSON.stringify(ev))
        this.setState({
            [controlId]: ev
        });
        localStorage.setItem(`${name}`, ev.value);

        this.setState({ selectedComponentForm: ev.value })
        await this.props.getComponentFormByComponent(ev.value);
        await this.sleep(30000)
        await this.createFormDropdown(uuid)
    }
    async createFormDropdown(uuid) {

        if (this.props.componentFormList != undefined && this.props.componentFormList.results != undefined) {
            let formDropdown = [];
            await this.setState({ formDropdown: [] })

            for (const element of this.props.componentFormList.results) {

                if (element.component.uuid == localStorage.getItem(`${uuid}-component`)
                    && element.workflow.uuid == localStorage.getItem(`${uuid}-Workflow`)
                    && element.phase.uuid == localStorage.getItem(`${uuid}-phase`)) {
                    var array = formDropdown;

                    var existingObj = array.filter(data => data.value == element.form.uuid);
                    if (JSON.stringify(existingObj) === '[]') {
                        formDropdown.push({
                            "label": element.form.name,
                            "value": element.form.uuid
                        });
                    }

                }

                await this.setState({ formDropdown: formDropdown });
            }

        }
    }
    async onHandleFormValue(ev, name, controlId) {
        console.log("Naam dena", name, JSON.stringify(ev))
        this.setState({
            [controlId]: ev
        });
        //     this.setState({selectedComponentForm:ev.value})
        localStorage.setItem(`${name}`, ev.value);

        //    this.createFormDropdown(ev.value)
        await this.props.getFormFieldsByForm(ev.value);

        await this.createQuestionDropDown();

    }

    async createQuestionDropDown() {

        if (this.props.fieldList != undefined && this.props.fieldList.results != undefined) {
            let questionDropdown = [];
            this.setState({ questionDropDown: [] })
            await this.props.fieldList.results.forEach(element => {
                if (element.field.attributeName === this.props.datatype) {
                    questionDropdown.push({
                        "label": element.field.name,
                        "value": element.uuid,
                        "id": element.id
                    })

                }
            })
            await this.setState({ questionDropDown: questionDropdown });

        }
    }
    async onHandleQuestionValue(ev, name, controlId, uuid) {
        console.log("Naam dena", name, JSON.stringify(ev));
        this.setState({
            [controlId]: ev
        });
        //     this.setState({selectedComponentForm:ev.value})
        localStorage.setItem(`${name}`, ev.value);
        await localStorage.setItem(`${uuid}-autocompletefield`, ev.id)

        //await this.props.getComponentFormByComponent(localStorage.getItem(`${uuid}-component`));
        if (this.props.componentFormList != undefined && this.props.componentFormList.results != undefined) {
            for (const element of this.props.componentFormList.results) {
                if (element.component.uuid == localStorage.getItem(`${uuid}-component`)
                    && element.form.uuid == localStorage.getItem(`${uuid}-form`)
                    && element.workflow.uuid == localStorage.getItem(`${uuid}-Workflow`)
                    && element.phase.uuid == localStorage.getItem(`${uuid}-phase`)) {


                    await localStorage.setItem(`${uuid}-autocompletecomponent`,
                        element.id)

                }
            }
        }



        //    this.createFormDropdown(ev.value)
        //         this.createQuestionDropDown(ev.value);
    }
    onItemSelectedProp = (ev) => {
        this.setState({
            [ev.controlId]: ev.value
        })
        // console.log("ev.name", ev.name)
        localStorage.setItem(`${ev.name}`, ev.value)
    }

    handleRadioChange = (ev) => {
        console.log(ev.name)
        this.setState({
            [ev.controlId]: ev.value
        }, () => {

        })
        localStorage.setItem(`${ev.name}`, ev.value);
        if (ev.name.includes('autocomplete') && ev.value == "Yes") {
            this.setState({ showAutoCompleteOption: true })
        }
        if (ev.name.includes('autocomplete') && ev.value == "No") {
            this.setState({ showAutoCompleteOption: false })
        }

    }
    onItemCheckedProp = (ev) => {
        this.setState({
            [ev.controlId]: ev.value
        }, () => {
            //console.log("handleGivenName inside", this.state.patientGivenNameMandatory)
        })
        localStorage.setItem(`${ev.name}`, ev.value)
    }

    render() {
        const { datatype, uuid } = this.props
        const { patientAge, showAutoCompleteOption, patientAgeMandatory, patientContacts, patientGender, patientGenderMandatory
            , patientId, patientIdMandatory, occurence, patientGivenName, patientGivenNameMandatory, patientRelationship, patientRelationshipMandatory,
            patientFamilyName, headingTitle, allowDecimal, disabled, patientFamilyNameMandatory, allowFutureDate, allowPastDaate, dateformat, mandatory, minValue, maxValue, maxLength, regix, minLength, errorMsg, allowCharacter, isScorable, questionText, defaultValue } = this.state
        console.log("Naam dena d", defaultValue)
        return (
            <>
                {/* common */}
                {(datatype === HEADING) ?
                    <TextBox
                        controlId="headingTitle"
                        title="Title"
                        type="text"
                        name={uuid + "-headingTitle-" + this.props.displayOrder}
                        value={localStorage.getItem(uuid + "-headingTitle-" + this.props.displayOrder)}
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
                                value={allowDecimal}
                            />
                        </> : ""
                }
                {/* common */}
                {
                    (datatype === CODED) ?
                        <>

                            <RadioGroup
                                controlId="disabled"
                                title="Disabled?"
                                key="Disabled"
                                name={uuid + "-disabled"}
                                value={disabled}
                                handleRadioChange={this.handleRadioChange}
                                options={[{ key: "5" + this.props.uuid, title: "Yes" }, { key: "6" + this.props.uuid, title: "No" }]}
                            />

                            <label htmlFor="start date" className="ec-label">Default Value</label>
                            <Select
                                controlId="defaultValue"
                                title="Default Value"
                                name={uuid + "-defaultValue"}
                                value={defaultValue}
                                onChange={(evt) => this.onHandleDefaultValue(evt, `${uuid}-defaultValue`, "defaultValue")}
                                options={this.props.answers.map((option) => (
                                    {
                                        label: option.concept.display,
                                        value: option.uuid
                                    }
                                ))}

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
                                controlId="regix"
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
                                    <tr className={(patientContacts === 'No' ? 'tr_back' : "")}>
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
                                        <td>Given Name</td>
                                        <td>
                                            <TextBox
                                                controlId="patientGivenName"
                                                name={uuid + "-patientGivenName"}
                                                type="text"
                                                value={patientGivenName}
                                                onItemSelectedProp={this.onItemSelectedProp}
                                            />

                                        </td>
                                        <td>
                                            <CheckBox
                                                disabled={patientContacts}
                                                controlId="patientGivenNameMandatory"
                                                name={uuid + "-patientGivenNameMandatory"}
                                                value={patientContacts === 'Yes' ? "true" : patientGivenNameMandatory}
                                                onItemCheckedProp={this.onItemCheckedProp}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>2</th>
                                        <td>Family Name</td>
                                        <td>
                                            <TextBox
                                                controlId="patientFamilyName"
                                                name={uuid + "-patientFamilyName"}
                                                type="text"
                                                value={patientFamilyName}
                                                onItemSelectedProp={this.onItemSelectedProp}
                                            />

                                        </td>
                                        <td>
                                            <CheckBox
                                                disabled={patientContacts}
                                                controlId="patientFamilyNameMandatory"
                                                name={uuid + "-patientFamilyNameMandatory"}
                                                value={patientContacts === 'Yes' ? "true" : patientFamilyNameMandatory}
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
                <RadioGroup
                    controlId="autocomplete"
                    title="Auto Populate Answer?"
                    name={uuid + "-autocomplete"}
                    value={showAutoCompleteOption ? 'Yes' : 'No'}
                    handleRadioChange={this.handleRadioChange}
                    options={[{ key: "10", title: "Yes" }, { key: "20", title: "No" }]}
                />
                {
                    (datatype !== CONTACT_TRACING && this.state.showAutoCompleteOption) ? <>
                        <label htmlFor="start date" className="ec-label">Workflow</label>

                        <Select
                            title="workflow"
                            controlId="workflow"
                            options={this.state.selectOptions}
                            onChange={(evt) => this.onHandleWorkflowValue(evt, `${uuid}-Workflow`, "workflow")}
                        >

                        </Select>
                        <label htmlFor="start date" className="ec-label">Phase</label>

                        <Select
                            title="phase"
                            controlId="phase"
                            options={this.state.phaseDropdown}
                            onChange={(evt) => this.onHandlePhaseValue(evt, `${uuid}-phase`, "phase")}
                        >

                        </Select>
                        <label htmlFor="start date" className="ec-label">Component</label>
                        <Select
                            title="component"
                            controlId="component"
                            options={this.state.componentDropdown}
                            onChange={(evt) => this.onHandleComponentValue(evt, `${uuid}-component`, "component")}
                        >

                        </Select>
                        <label htmlFor="start date" className="ec-label">Form</label>

                        <Select
                            title="form"
                            controlId="form"
                            options={this.state.formDropdown}
                            onChange={(evt) => this.onHandleFormValue(evt, `${uuid}-form`, "form", this.props.uuid)}
                        >

                        </Select>

                        <label htmlFor="start date" className="ec-label">Question</label>

                        <Select
                            title="question"
                            controlId="question"
                            options={this.state.questionDropDown}
                            onChange={(evt) => this.onHandleQuestionValue(evt, `${uuid}-question`, "question", this.props.uuid)}
                        >

                        </Select>
                        <RadioGroup
                            controlId="autocompleteearliest"
                            title="Occurence"
                            name={uuid + "-autocompleteearliest"}
                            value={occurence}
                            handleRadioChange={this.handleRadioChange}
                            options={[{ key: "30" + this.props.uuid, title: "Earliest" }, { key: "40" + this.props.uuid, title: "Latest" }]}
                        />



                    </> : ""
                }

            </>

        )
    }

}

const mapStateToProps = state => ({
    workflowPhase: state.phase.workPhase,
    componentFormList: state.formField.componentFormsList,
    fieldList: state.formField.formFields,
    formField: state.formField.formField,

});

const mapDispatchToProps = {
    getWorkflowPhaseByWorkflow: phaseAction.getPhaseComponentByWorkflow,
    getComponentFormByComponent: formAction.getComponentFormByComponent,
    getFormFieldsByForm: formAction.getFormFieldsByForm,
    getFormFieldsByUUID: formAction.getFormFieldsByUUID,
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionConfiguration);

