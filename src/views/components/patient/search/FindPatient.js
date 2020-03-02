import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import DatePicker from "react-datepicker";
import { AgGridReact } from '@ag-grid-community/react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { PatientActions } from '../../../../store/actions';
import {personAction} from '../../../../state/ducks/person'
import { findpatientservice } from '../../../../services';
import { locationAction } from '../../../../state/ducks/location';
import { systemSettingsAction } from '../../../../state/ducks/systemsettings'
import {personJSON} from '../../../../utilities/helpers/JSONcreator'
import {PatiendSideBackButton} from '../../common/sidebutton/SideBackButton'
import {createNotification} from '../../../../utilities/helpers/helper'

import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
import './findpatient.css';
import { patientAction } from '../../../../state/ducks/patient';

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
                    headerName: "UUID", field: "uuid", width: 170,hide:true
                }
            ],
            rowData: [],
            openAddPatientModal : false,
            patient : {
                personname : '',
                familyname : '',
                dateofbirth : '',
                age : null,
                gender : '',
                location:''
            },
            location : [],
            identifierFormat : ''

        };
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDateChangeRaw = this.handleDateChangeRaw.bind(this);

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
    async componentDidMount() {
        await this.props.getAllLocation();
        await this.populateDropDown();
        await this.props.getSettingsByUUID('9b68a10b-3ede-43f6-b019-d0823e28ebd1');
        await this.setState({
            identifierFormat: this.props.setting.value
        });
    }
    async handleSubmit(event) {
      event.preventDefault();
      if(this.state.patient.age == null && this.state.patient.dateofbirth == '')
      {
          createNotification('error','Atleast fill any one, date fof birth or estimated age');
          return;
      }
      await this.props.savePerson(personJSON(this.state.patient.gender, this.state.patient.personname , this.state.patient.familyname,this.state.patient.dateofbirth, this.state.patient.age));
      var data = {
          person : this.props.person.uuid,
          identifiers: [
            {
              identifier:this.state.patient.identifier, 
              identifierType:"8d79403a-c2cc-11de-8d13-0010c6dffd0f", 
              location:this.state.patient.location,
              preferred:true
            } ]
      }
      await this.props.savePatient(data);
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
    
    _handleKeyDown = (e) => {
        e.preventDefault();
        if (e.key === 'Enter') {
            findpatientservice.getSearchPatient(this.state.searchQuery).then(data => {
                console.log("Return patient :: ", JSON.stringify(data))
                this.setState({
                    rowData: data
                })
            })
        }
    }
    openAddPatientModal() {
        this.setState({
            openAddPatientModal: true,
        })
    }
    closeAddPatientModal() {
        this.setState({
            openAddPatientModal: false,
        })
    }
    // handleChange = e => {
    //     e.preventDefault();
    //     const { name, value } = e.target;
    //     this.setState({ [name]: value }, () => console.log(this.state));
    // };

    searchPatient = e => {
        e.preventDefault();
        findpatientservice.getSearchPatient(this.state.searchQuery).then(data => {
            console.log("Return patient :: ", JSON.stringify(data))
            this.setState({
                rowData: data
            })
        }
        )
    }
    populateDropDown() {
        let array = [];
        this.props.locationLists.results.forEach(element => {
            array.push(
                <option value={element.uuid}>{element.name}</option>
            );
        });
        this.setState({
            location: array
        })
    }
    searchIdhandleClick = e => {
        e.preventDefault();
        this.searchPatient(e);
    };

    onCellClicked = event => {
        console.log('onCellClicked: ' + JSON.stringify(event.data));
        console.log('onCellClicked: ' + JSON.stringify(event.name));
        console.log('onCellClicked: ' + JSON.stringify(event.value));


        const { dispatch } = this.props;
        if (event.data) {
            dispatch(PatientActions.setActivePatient(event.data));
        }
    };

    onRowSelected = (event) => {
        console.log('onRowSelected: ' + event.node.data);
    };

    render() {
        const {patient , identifierFormat} = this.state;
        return (
            <div className="row container-fluid fp-main-container">
                <div className="card fp-header">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-md-8 col-sm-4">
                                <span>
                                    <form onSubmit={this.handleSubmit} className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                                        <div className="input-group search-btn">
                                            <input type="text" name="searchQuery" value={this.state.searchQuery} onChange={event => { this.setState({ searchQuery: event.target.value }) }}
                                                onKeyPress={event => {
                                                    if (event.key === 'Enter') {
                                                        this.searchPatient(event)
                                                    }
                                                }}
                                                required
                                                className="form-control bg-light border-0 small fp-input-search" placeholder="Enter name or identifier" aria-label="Search" aria-describedby="basic-addon2" />
                                            <div className="input-group-append">
                                                <button className="btn btn-primary" type="button" onClick={((e) => this.searchIdhandleClick(e))}>
                                                    <i className="fas fa-search fa-sm"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </span>
                            </div>
                            <div className="col-md-4 col-sm-2">
                                    <button class="fp-btn btn btn-primary" onClick={e => this.openAddPatientModal()}><i class="fas fa-plus"></i> Create New</button>
                            </div>
                        </div>
                    </div>
                    <div className="card-body rm-paadding">
                        <div className="d-flex justify-content-center">
                            {/* <Loader
                                type="BallTriangle"
                                color="#4158d0"
                                height={100}
                                width={100}
                                timeout={3000} //3 secs
                            /> */}
                            <div
                                className="ag-theme-balham"
                                style={{
                                    height: '421px',
                                    width: '100%'
                                }}
                            >
                                <AgGridReact
                                    columnDefs={this.state.columnDefs}
                                    rowData={this.state.rowData}
                                    modules={AllCommunityModules}
                                    onRowSelected={this.onRowSelected}
                                    onCellClicked={event => { this.onCellClicked(event) }}
                                    enableSorting
                                    enableFilter
                                    rowAnimation
                                    enableRangeSelection={true}
                                    pagination={true}
                                    isExternalFilterPresent={true}
                                    enableColResize="true"
                                >
                                </AgGridReact>
                            </div>
                        </div>
                    </div>
                </div>
                
                <PatiendSideBackButton
                    navigateTo=""
                ></PatiendSideBackButton>
                <Modal show={this.state.openAddPatientModal} backdrop="static" onHide={() => this.setState({ openAddPatientModal: false })} style={{ marginTop: '40px' }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New Patient</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={this.handleSubmit}>
                        <div className="form-group row" >
                                <label htmlFor="identifier" class="col-sm-4 col-form-label required">Identifier</label>
                                <div class="col-sm-8">
                                    <input type="text" className="form-control" name="identifier" autoComplete="off" pattern={identifierFormat} placeholder={identifierFormat} maxlength="15" value={patient.identifierFormat} onChange={this.handleChange} required />
                                </div>
                            </div>
                           
                            <div className="form-group row" >
                                <label htmlFor="personname" class="col-sm-4 col-form-label required">Person Name</label>
                                <div class="col-sm-8">
                                    <input type="text" className="form-control" name="personname" autoComplete="off" pattern="[a-zA-Z]+\s?[a-zA-Z]{1,15}" placeholder="max 15 characters (no space)" maxlength="15" value={patient.personname} onChange={this.handleChange} required />
                                </div>
                            </div>
                            <div className="form-group row" >
                                <label htmlFor="familyname" class="col-sm-4 col-form-label required">Family Name</label>
                                <div class="col-sm-8">
                                    <input type="text" className="form-control" name="familyname" pattern="[a-zA-Z]+\s?[a-zA-Z]{1,15}" placeholder="max 15 characters (no space)" maxlength="15" value={patient.familyname} onChange={this.handleChange} required />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label htmlFor="gender" className="col-sm-4 col-form-label required">Gender</label>
                                <div className="col-sm-8">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="gender" value="M" checked={patient.gender==='M'} onChange={this.handleChange} required />
                                                <label className="form-check-label" htmlFor="gender" >
                                                    Male
                                    </label>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-check">
                                            <input className="form-check-input" type="radio" name="gender" value="F" checked={patient.gender==='F'} onChange={this.handleChange}  />

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
                                        showYearDropdown onChangeRaw={this.handleDateChangeRaw} onChange={this.handleChangeDate} className="form-control user-date-picker" maxDate={new Date()} dateFormat="dd/MM/yyyy" placeholderText="Click to select a date"  />
                                </div>
                            </div>
                            <div className="form-group row ">
                            <div className="col-sm-4"></div><div className="col-sm-4">OR</div><div className="col-sm-4"></div>
                            </div>
                            <div className="form-group row" >
                                <label htmlFor="age" class="col-sm-4 col-form-label required">Age</label>
                                <div class="col-sm-8">
                                    <input type="number" className="form-control" name="age" value={patient.age} onChange={this.handleChange}  />
                                </div>
                            </div>
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
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    Patient : state.patientreducer,
    person : state.person.person,
    locationLists: state.location.locations,
    setting: state.systemSettings.systemSetting
})
const mapDispatchToProps = {
    savePerson : personAction.savePerson,
    savePatient : patientAction.savePatient,
    getAllLocation: locationAction.fetchLocations,
    getSettingsByUUID: systemSettingsAction.getSystemSettingsByUUID
}
export default connect(mapStateToProps,mapDispatchToProps)(FindPatient);