import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import DatePicker from "react-datepicker";
import { AgGridReact } from '@ag-grid-community/react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { personAction } from '../../../../state/ducks/person';
import { workflowAction } from '../../../../state/ducks/workflow';
import { findpatientservice } from '../../../../services';
import { locationAction } from '../../../../state/ducks/location';
import { systemSettingsAction } from '../../../../state/ducks/systemsettings'
import { personJSON } from '../../../../utilities/helpers/JSONcreator'
import { PatiendSideBackButton } from '../../common/sidebutton/SideBackButton'
import { createNotification } from '../../../../utilities/helpers/helper'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
import './findpatient.css';
import { patientAction } from '../../../../state/ducks/patient';

import './findpatient.css';
import { LoaderDots } from '../../common/loader/LoaderDots';
import moment from 'moment';
import { AgGrid } from '../../../ui/AgGridTable/AgGrid'
import CardTemplate from '../../../ui/cards/SimpleCard/CardTemplate'
import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';

class FindPatient extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchQuery: "",
            columnDefs: [
                {
                    headerName: "Identifier", field: "identifier", width: 170
                },
                {
                    headerName: "First  Name", field: "given", width: 165
                },
                {
                    headerName: "Middle Name", field: "middle", width: 165
                },
                {
                    headerName: "Family Name", field: "familyname", width: 170
                },
                {
                    headerName: "Age", field: "age", width: 140
                },
                {
                    headerName: "Gender", field: "gender", width: 140
                },
                {
                    headerName: "Birth Date", field: "birthday", width: 170
                },
                {
                    headerName: "Death Date", field: "deathdate", width: 170
                }
                ,
                {
                    headerName: "UUID", field: "uuid", width: 170, hide: true
                }
            ],
            rowData: [],
            openAddPatientModal: false,
            patient: {
                personname: '',
                familyname: '',
                dateofbirth: '',
                age: null,
                gender: '',
                location: ''
            },
            location: [],
            identifierFormat: '',
            openWorkflowModal: false,
            workflowData: [],
            selectedWorkflow: "",
            selectedWorkflowId: ""

        };
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDateChangeRaw = this.handleDateChangeRaw.bind(this);
        this.closeWorkflowModal = this.closeWorkflowModal.bind(this)
        this.setWorkflow = this.setWorkflow.bind(this);
        this.savePatient = this.savePatient.bind(this)
        this.openWorkflowModal = this.openWorkflowModal.bind(this)

    }
    static propTypes = {
        patients: PropTypes.array.isRequired,
    }
    async setWorkflow(event) {
        await this.setState({ selectedWorkflow: event.target.value })
        await localStorage.setItem('selectedWorkflow', this.state.selectedWorkflow)
        var existingObj = this.state.workflowData.filter(data => data.label == this.state.selectedWorkflow);
        await this.setState({ selectedWorkflowId: existingObj[0].value });
        await localStorage.setItem("selectedWorkflowId", this.state.selectedWorkflowId)
        if (this.state.selectedWorkflow != '') {

            await this.closeWorkflowModal();
        }
    }


    handleChange(event) {
        const { name, value } = event.target;
        const { patient } = this.state;
        this.setState({
            patient: {
                ...patient,
                [name]: value
            }
        });

    }
    openWorkflowModal = async () => {
        await this.props.getAllWorkflows();
        await this.setState({ workflowData: this.createWorkflowCheckBox() })

        await this.setState({ openWorkflowModal: true });
    }
    closeWorkflowModal() {
        this.setState({ openWorkflowModal: false })
    }
    async usn() {
        await this.setState({ rowData: [] })
        await this.props.getAllWorkflows();

        await this.setState({ workflowData: this.createWorkflowCheckBox() })
        if (this.state.workflowData.length != 0) {
            await this.setState({ openWorkflowModal: true })
        }
    }
    async componentDidMount() {
        // await this.props.getAllWorkflows();

        // await this.setState({workflowData:this.createWorkflowCheckBox()})
        // if(this.state.workflowData.length != 0) {
        //     await this.setState({openWorkflowModal:true})
        // }
        await this.props.getAllLocation();
        await this.populateDropDown();
        await this.props.getSettingsByUUID('9b68a10b-3ede-43f6-b019-d0823e28ebd1');
        if (this.props.setting !== undefined && this.props.setting.value !== undefined) {
            await this.setState({
                identifierFormat: this.props.setting.value
            });
        }


    }
    createWorkflowCheckBox() {
        let workflowsData = [];
        if (this.props.workflows !== undefined && this.props.workflows.workflows !== undefined) {
            this.props.workflows.workflows.forEach(element => {
                workflowsData.push({
                    "label": element.name,
                    "value": element.uuid
                })
            })
        }
        return workflowsData;
    }
    async handleSubmit(event) {
        event.preventDefault();
        if (this.state.patient.age == null && this.state.patient.dateofbirth == '') {
            createNotification('error', 'Atleast fill any one, date fof birth or estimated age');
            return;
        }
        await this.props.savePerson(personJSON(this.state.patient.gender, this.state.patient.personname, this.state.patient.familyname, this.state.patient.dateofbirth, this.state.patient.age));
        var data = {
            person: this.props.person.uuid,
            identifiers: [
                {
                    identifier: this.state.patient.identifier,
                    identifierType: "8d79403a-c2cc-11de-8d13-0010c6dffd0f",
                    location: this.state.patient.location,
                    preferred: true
                }]
        }
        await this.props.savePatient(data);
        await createNotification('success', 'Patient Created');
        await this.closeAddPatientModal()

        await console.log(JSON.stringify(data));


    }
    handleDateChangeRaw(e) {
        e.preventDefault();
    }
    handleChangeDate(date) {
        const { patient } = this.state;

        this.setState({
            patient: {
                ...patient,
                dateofbirth: date
            }
        });
    }

    async componentWillReceiveProps(nextProps) {
        if (nextProps.patients !== undefined && nextProps.patients.results != undefined) {
            await this.setState({
                rowData: this.filterPatient(nextProps.patients.results)
            })
        }
        if (nextProps.workflows != undefined && nextProps.workflows.workflows) {

            await this.setState({ workflowData: this.createWorkflowCheckBox() })
        }
        if (nextProps.locationLists != undefined) {
            await this.populateDropDown();
        }
    }

    filterPatient(patientData) {
        let filteredPatient = [];
        if (patientData != undefined) {
            patientData.forEach(element => {
                filteredPatient.push({
                    "identifier": element.identifiers[0].identifier,
                    "given": element.person.preferredName.givenName,
                    "middle": element.person.preferredName.middleName,
                    "familyname": element.person.preferredName.familyName,
                    "age": element.person.age,
                    "gender": element.person.gender == "F" ? "Female" : "Male",
                    "birthday": element.person.birthdate != null ? moment(element.person.birthdate).format('YYYY-MM-DD') : "",
                    "deathdate": element.person.deathDate != null ? moment(element.person.deathDate).format('YYYY-MM-DD') : "",
                    "uuid": element.uuid
                });
            });
            return filteredPatient;
        }
    }

    async handleKeyDown(e) {
        e.preventDefault();
        if (e.key === 'Enter') {
            await this.props.searchPatientByQuery(this.state.searchQuery);
            await console.log('hiiii ' + JSON.stringify(this.props.patients))
            if (this.props.patients != undefined) {
                await this.setState({ rowData: this.filterPatient(this.props.patients.results) })

            }
        }
    }
    openAddPatientModal() {
        this.setState({
            openAddPatientModal: true,
        })
    }
    async  savePatient(e) {
        e.preventDefault()
        var data = [
            {
                "param_name": "Patient Identifier",
                "value": this.state.patient.identifier,
                "payload_type": "IDENTIFIER"
            },
            {
                "payload_type": "NAME",
                "givenName": this.state.patient.personname,
                "familyName": this.state.patient.familyname
            },
            {
                "param_name": "sex",
                "value": this.state.patient.gender,
                "payload_type": "GENDER"
            },
            {
                "param_name": "age",
                "value": moment(this.state.patient.dateofbirth).format("YYYY-MM-DD HH:mm:ss"),
                "payload_type": "DOB"
            },
            {
                "param_name": "location",
                "value": this.state.patient.location,
                "payload_type": "LOCATION"
            }];
        var metadata = {
            "authentication": {
                "USERNAME": localStorage.getItem("username"),
                "PASSWORD": localStorage.getItem("password")
            },
            "ENCONTER_TYPE": "Create Patient",
            "WORKFLOW": localStorage.getItem("selectedWorkflowId")
        }
        var patient = {
            data: JSON.stringify(data),
            metadata: JSON.stringify(metadata)
        }
        await console.log(JSON.stringify(patient))
        await this.props.savePatient(patient);
        await createNotification('success', 'Patient Created');
        await this.closeAddPatientModal()
    }
    closeAddPatientModal() {
        this.setState({
            openAddPatientModal: false,
            patient: {
                personname: '',
                familyname: '',
                dateofbirth: '',
                age: null,
                gender: '',
                location: ''
            }
        })
    }
    async searchPatient(e) {
        e.preventDefault();
        await this.props.searchPatientByQuery(this.state.searchQuery);
        // await console.log('hiiii ' + JSON.stringify(this.props.patients))
        if (this.props.patients != undefined) {
            await this.setState({ rowData: this.filterPatient(this.props.patients.results) })

        }
    }
    populateDropDown() {
        let array = [];
        if (this.props.locationLists != undefined && this.props.locationLists.results != undefined) {
            this.props.locationLists.results.forEach(element => {
                array.push(
                    <option value={element.uuid}>{element.name}</option>
                );
            });
            this.setState({
                location: array
            })
        }

    }
    searchIdhandleClick = e => {
        e.preventDefault();
        this.searchPatient(e);
    };
    onCellClicked = event => {
        if (localStorage.getItem("selectedWorkflow")) {

            this.props.setActivePatient(event.data)
        } else {
            this.openWorkflowModal()
        }
    };

    onRowSelected = (event) => {
        console.log('onRowSelected: ' + event.node.data);
    };
    onGridReady = (params) => {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.gridApi.sizeColumnsToFit();
        window.onresize = () => {
            this.gridApi.sizeColumnsToFit();
        }
    }

    render() {
        const { patient, identifierFormat, rowData, columnDefs } = this.state;

        return (
            <>
                <CardTemplate
                    title={
                        <form onSubmit={this.handleSubmit} className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                            <div className="input-group search-btn">
                                <input type="text" name="searchQuery" value={this.state.searchQuery} onChange={event => { this.setState({ searchQuery: event.target.value }) }}
                                    onKeyPress={event => {
                                        if (event.key === 'Enter') {
                                            this.searchPatient(event)
                                        }
                                    }}
                                    required
                                    className="form-control bg-light border-0 small fp-input-search " placeholder="Enter name or identifier" aria-label="Search" aria-describedby="basic-addon2" />
                                <div className="input-group-append">
                                    <button className="btn btn-primary" type="button" onClick={((e) => this.searchPatient(e))}>
                                        <i className="fas fa-search fa-sm"></i>
                                    </button>
                                </div>
                            </div>
                        </form>
                    }
                    action={
                        <>
                            <Chip
                                style={{ margin: '8px' }}
                                label={localStorage.getItem("selectedWorkflow")}
                                clickable={true}
                                onClick={this.openWorkflowModal}
                                onDelete={this.openWorkflowModal}
                                deleteIcon={<Icon className="fa fa-plus-circle" />}
                                color="#4258d0"
                                variant="outlined"
                            />
                            {/* <button className="btn btn-primary workFlowButton" onClick={this.openWorkflowModal}>{localStorage.getItem("selectedWorkflow")}</button> */}
                            <button class="fp-btn btn btn-primary" onClick={e => this.openAddPatientModal()}><i class="fas fa-plus"></i> Create New</button>
                        </>
                    }
                >
                    {
                        (this.props.searchLoading) ? <LoaderDots withMargin="true" /> :
                            <AgGrid
                                onGridReady={this.onGridReady}
                                columnDefs={columnDefs}
                                onRowSelected={this.onRowSelected}
                                rowData={rowData}
                                onCellClicked={event => { this.onCellClicked(event) }}
                            />
                    }

                </CardTemplate>

                <Modal show={this.state.openAddPatientModal} backdrop="static" onHide={() => this.setState({ openAddPatientModal: false })} style={{ marginTop: '80px' }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Patient</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={this.savePatient}>
                            <div className="form-group row" >
                                <label htmlFor="identifier" class="col-sm-4 col-form-label required">Identifier</label>
                                <div class="col-sm-8">
                                    <input type="text" className="form-control" name="identifier" autoComplete="off" pattern={identifierFormat} placeholder={identifierFormat} maxlength="15" value={patient.identifierFormat} onChange={this.handleChange} required />
                                </div>
                            </div>

                            <div className="form-group row" >
                                <label htmlFor="personname" class="col-sm-4 col-form-label required">Person Name</label>
                                <div class="col-sm-8">
                                    <input type="text" className="form-control" name="personname" autoComplete="off" pattern="[a-zA-Z]+\s?[a-zA-Z]{1,25}" placeholder="max 15 characters (no space)" maxlength="15" value={patient.personname} onChange={this.handleChange} required />
                                </div>
                            </div>
                            <div className="form-group row" >
                                <label htmlFor="familyname" class="col-sm-4 col-form-label required">Family Name</label>
                                <div class="col-sm-8">
                                    <input type="text" className="form-control" name="familyname" pattern="[a-zA-Z]+\s?[a-zA-Z]{1,25}" placeholder="max 15 characters (no space)" maxlength="15" value={patient.familyname} onChange={this.handleChange} required />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label htmlFor="gender" className="col-sm-4 col-form-label required">Gender</label>
                                <div className="col-sm-8">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="gender" value="M" checked={patient.gender === 'M'} onChange={this.handleChange} required />
                                                <label className="form-check-label" htmlFor="gender" >
                                                    Male
                                               </label>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="gender" value="F" checked={patient.gender === 'F'} onChange={this.handleChange} />

                                                <label className="form-check-label" htmlFor="gender">
                                                    Female
                                    </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group row ">
                                <label htmlFor="dateofbirth" class="col-sm-4 col-form-label required">Date of Birth</label>
                                <div class="col-sm-8">
                                    <DatePicker selected={patient.dateofbirth} showMonthDropdown
                                        showYearDropdown onChangeRaw={this.handleDateChangeRaw} onChange={this.handleChangeDate} className="form-control user-date-picker" maxDate={new Date()} dateFormat="dd/MM/yyyy" placeholderText="Click to select a date" required />
                                </div>
                            </div>
                            {/* <div className="form-group row ">
                                <div className="col-sm-4"></div><div className="col-sm-4">OR</div><div className="col-sm-4"></div>
                            </div>
                            <div className="form-group row" >
                                <label htmlFor="age" class="col-sm-4 col-form-label required">Age</label>
                                <div class="col-sm-8">
                                    <input type="number" className="form-control" name="age" value={patient.age} onChange={this.handleChange} />
                                </div>
                            </div> */}
                            <div className='form-group row '>
                                <label htmlFor='location' class="col-sm-4 col-form-label required">Location</label>
                                <div class="col-sm-8">
                                    <select className="form-control" name="location"
                                        value={patient.location}
                                        onChange={this.handleChange}>
                                        <option></option>
                                        {this.state.location}
                                    </select>
                                </div>
                            </div>


                            <Modal.Footer>

                                <button type="submit" className="btn btn-primary" >Save</button>
                            </Modal.Footer>

                        </form>
                    </Modal.Body>
                </Modal>

                <Modal
                    show={this.state.openWorkflowModal}
                    backdrop="static"
                    onHide={() => this.setState({ openWorkflowModal: false })}
                    style={{ marginTop: '80px' }}>
                    <Modal.Header>
                        Select A Workflow
                </Modal.Header>
                    <Modal.Body style={{ height: '450px', overflowY: 'auto' }}>
                        <RadioGroup
                            aria-label="report"
                            name="workflow"
                            onChange={this.setWorkflow} >
                            {console.log("workflowData", this.state.workflowData)}
                            {
                                this.state.workflowData.length > 0 ?
                                    this.state.workflowData.map((value, i) => {
                                        return (
                                            <tr>
                                                <td><FormControlLabel value={value.label} control={<Radio color="primary" />} /></td>
                                                <td>{value.label}</td>
                                            </tr>
                                        )
                                    }) : <LoaderDots withMargin="true" height={60} width={60} />
                            }
                        </RadioGroup>
                    </Modal.Body>
                    {/* <Modal.Footer>
                            <button class="btn btn-primary" onClick={this.closeWorkflowModal}>
                                Save
                        </button>
                        </Modal.Footer> */}
                </Modal>
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    person: state.person.person,
    patients: state.patient.searchPatients,
    locationLists: state.location.locations,
    setting: state.systemSettings.systemSetting,
    workflows: state.workflow.workflows,
    searchLoading: state.patient.searchLoading
})
const mapDispatchToProps = {
    savePerson: personAction.savePerson,
    savePatient: patientAction.savePatient,
    searchPatientByQuery: patientAction.searchPatient,
    setActivePatient: patientAction.setActivePatient,
    getAllLocation: locationAction.fetchLocations,
    getSettingsByUUID: systemSettingsAction.getSystemSettingsByUUID,
    getAllWorkflows: workflowAction.getAllWorkflow
}
export default connect(mapStateToProps, mapDispatchToProps)(FindPatient);
