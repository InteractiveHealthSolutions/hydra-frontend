import React from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';
import {NotificationContainer} from 'react-notifications';
import DatePicker from "react-datepicker";
import { AgGridReact } from '@ag-grid-community/react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import {labtestSampleAction} from '../../../state/ducks/labtestsample';
import { conceptsAction } from '../../../state/ducks/concepts';
import {createNotification} from '../../../utilities/helpers/helper';
import { history } from '../../../history';
import ButtonRenderer from '../../../utilities/helpers/ButtonRenderer';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
import './samplelist.css';

class SampleList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openAddSampleModal : false,
            quickFilterText: null,
            columnDefs: [
                {
                    headerName: "S. No", field: "sampleid", width: 100,
                    cellRenderer: function (params) {
                        return "<a href='javascript: void(0)'" + params.value
                            + "'> " + params.value + "</a>";
                    },
                    cellStyle: { 'background-color': '#e6f3ff', 'text-decoration': 'underline' }

                },
                {
                    headerName: "Specimen Type", field: "specimentype", width: 200
                },
                {
                    headerName: "Specimen Site", field: "specimensite", width: 200,
                },
                {
                    headerName: "Sample Identifier", field: "sampleidentifier", width: 200,
                },
                {
                    headerName: "Collected On", field: "collectedon", width: 200
                },
                {
                    headerName: "Status", field: "status", width: 130,
                },
                {
                    headerName: "Accept Sample", field: "accept", width: 135,
                    cellRenderer: 'buttonRenderer'
                },
                {
                    headerName: "Reject Sample", field: "reject", width: 135,
                    cellRenderer: 'buttonRenderer'
                },
                {
                    headerName: "UUID", field: "uuid", width: 130, hide:true
                }
            ],
            rowData: [],
            context: { componentParent: this },
            frameworkComponents: {
                buttonRenderer: ButtonRenderer,
            },
            sampleFormData : {
                specimenType : '',
                specimenSite : '',
                quantity : '',
                identifier : '',
                collectionDate : ''
            },
            forEdit : false,
            defaultSpecimenType : {
                'label' : '',
                'value' : ''
            },
            defaultSpecimenSite : {
               'label' : '',
               'value' : ''
           }
            
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.specimenType = []
        this.specimenSite = []
        this.units = [
            {label :  "X 10⁶/L" , value:"165289"},
            {label :  "X 10³/L" , value:"165288"},
            {label :  "X 10⁹/L" , value:"165290"},
            {label :  "X 10¹²/L" , value:"165291"},
            {label :  "X 10³/µL" , value:"165295"},
            {label :  "X 10⁶/µL" , value:"165296"},
            {label :  "X 10⁹/µL" , value:"165297"},
            {label :  "X 10¹²/µL" , value:"165298"},
            {label :  "mIU/L" , value:"165299"},
            {label :  "mEq/L" , value:"165300"},
            {label :  "mg/dL" , value:"165301"},
            {label :  "gm/dL" , value:"165302"},
            {label :  "IU/L" , value:"165303"},
            {label :  "U/L" , value:"165304"},
            {label :  "IU/mL" , value:"165305"},
            {label :  "µL/mL" , value:"165306"},
            {label :  "umol/L" , value:"165307"},
            {label :  "%" , value:"165308"},
            {label :  "mm/hr" , value:"165309"},
            {label :  "/100 WBCs" , value:"165310"},
            {label :  "cells/L" , value:"165311"},
            {label :  "cells/µL" , value:"165312"},
            {label :  "copies/ml" , value:"165313"},
            {label :  "pg" , value:"165314"},
            {label :  "fl" , value:"165315"},
            {label :  "OTHER TEST UNIT" , value:"165316"},
            {label :  "NOT APPLICABLE" , value:"1175"},
            {label :  "gm/L" , value:"165403"},
            {label :  "mg/L" , value:"165404"},
            {label :  "uL" , value:"166346"},
            {label :  "mL" , value:"166347"},


            
        
        ]
        this.handleChangeSpecimenSite = this.handleChangeSpecimenSite.bind(this);
        this.handleChangeSpecimenType = this.handleChangeSpecimenType.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleDateChangeRaw = this.handleDateChangeRaw.bind(this);
      //  this.openAddSampleModal = this.openAddSampleModal.bind(this);

    }
    static propTypes = {
        sampleList : PropTypes.array.isRequired,
        activeLabTest: PropTypes.string.isRequired,
        concept : PropTypes.array.isRequired,
        sample : PropTypes.array.isRequired
    }
    async componentWillMount() {
        await console.log('active test'+localStorage.getItem('active-test'));
        
        await this.props.getSampleList(localStorage.getItem('active-test'));
        await console.log('samples '+JSON.stringify(this.props.sampleList));
        await this.setState({rowData : this.dataBuilder()})
        await this.props.getConceptByUUID('162476AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        await this.createSpecimenTypeDropDown();
        await this.props.getConceptByUUID('159959AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        await this.createSpecimenSiteDropDown();

    }
    
    createSpecimenTypeDropDown() {
        this.props.concept.answers.forEach(element => {
            this.specimenType.push({
                "label" : element.display,
                "value" : element.uuid
            })
        })
    }
    createSpecimenSiteDropDown() {
        this.props.concept.answers.forEach(element => {
            this.specimenSite.push({
                "label" : element.display,
                "value" : element.uuid
            })
        })
    }
    dataBuilder() {
        let data = [];
        let sno = 1;
        this.props.sampleList.results.forEach(element => {
            data.push({
               "sampleid" : sno,
               "specimentype" : element.specimenType.display,
               "specimensite" : element.specimenSite.display,
               "sampleidentifier" : element.sampleIdentifier,
               "collectedon" : element.collectionDate,
               "status" : element.status,
               "uuid" : element.uuid
            })
            sno++
        });
        return data;
    }
    onQuickFilterText = (event) => {
        this.setState({ quickFilterText: event.target.value });
    };
    closeAddSampleModal() {
        this.setState({ openAddSampleModal: false });
    }
    handleChangeSpecimenType = specimenType => {
        const {sampleFormData} = this.state;
        this.setState({
             sampleFormData : {
                 ...sampleFormData , 
                 specimenType : specimenType.value
             }
        })
    }
    handleChangeSpecimenSite = specimenSite => {
        const {sampleFormData} = this.state;
        this.setState({
             sampleFormData : {
                 ...sampleFormData , 
                 specimenSite : specimenSite.value
             }
        })
    }
    handleChange(event) {
        const { name, value } = event.target;
        const {sampleFormData} = this.state;
        this.setState({
             sampleFormData : {
                 ...sampleFormData , 
                 [name] : value
             }
        })
    }
    handleDateChangeRaw(e) {
        e.preventDefault();
    }
    handleChangeDate(date) {
        const { sampleFormData } = this.state;

        this.setState({
            sampleFormData: {
                ...sampleFormData,
                collectionDate: date
            }
        });
    }
    handleSubmit(e) {
        e.preventDefault();
        if(this.state.sampleFormData.specimenSite == '' || this.state.sampleFormData.specimenType == '' ||
           this.state.sampleFormData.identifier == '' || this.state.sampleFormData.collectionDate == '') {
               createNotification('warning' , 'Please fill the required fields')
           }
        else {
           this.props.postLabTestSample(this.createPOSTJSON());
           this.closeAddSampleModal();
           history.push('/samplelist')
           
        }
      //  this.closeAddSampleModal();
      }
    createPOSTJSON() {
        return {
            "labTest" : localStorage.getItem('active-test'),
            "sampleIdentifier" : this.state.sampleFormData.identifier,
            "specimenType" : this.state.sampleFormData.specimenType,
            "specimenSite" : this.state.sampleFormData.specimenSite,
            "collectionDate":this.state.sampleFormData.collectionDate,
	        "collector":"f233f9d1-f008-4984-b1c5-c057bdd44cb9",
	        "quantity":this.state.sampleFormData.quantity,
	        "expiryDate":null,
	        "status":"COLLECTED",
	        "comments":"sdds"

        }
    }
    openAddSampleModal() {
        if(JSON.stringify(this.state.rowData).includes('PROCESSED')) {
            createNotification('info' , 'Sample Already Processed');
        }
        else {
            this.setState({openAddSampleModal:true,forEdit:false,defaultSpecimenSite:'',defaultSpecimenType:''});

        }
       
    }
    createEditJSON(status) {
        return {
            "labTest" : localStorage.getItem('active-test'),
            "sampleIdentifier" : this.props.sample.sampleIdentifier,
            "specimenType" : this.props.sample.specimenType.uuid,
            "specimenSite" : this.props.sample.specimenSite.uuid,
            "collectionDate":this.props.sample.collectionDate,
	        "collector":"f233f9d1-f008-4984-b1c5-c057bdd44cb9",
	        "quantity":this.props.sample.quantity,
	        "expiryDate":null,
	        "status":status,
	        "comments":"sdds"

        }
    }
    async onCellClicked(event)  {
        if(event.column.colId == 'accept') {
            if(event.data.status == 'PROCESSED') {
                createNotification('warning', 'Cannot Accept/Reject a processed Sample')
            }
            else {
               await this.props.getSampleByUUID(event.data.uuid);
              // await this.createEditJSON('ACCEPTED');
              console.log('edit '+JSON.stringify(this.createEditJSON('ACCEPTED')))
              await this.props.editSample(this.props.sample.uuid,this.createEditJSON('ACCEPTED'))
            }

        }
        else if(event.column.colId == 'reject') {
            if(event.data.status == 'PROCESSED') {
                createNotification('warning', 'Cannot Accept/Reject a processed Sample')
            }
            else {
                await this.props.getSampleByUUID(event.data.uuid);
              // await this.createEditJSON('ACCEPTED');
              console.log('edit '+JSON.stringify(this.createEditJSON('REJECTED')))
              await this.props.editSample(this.props.sample.uuid,this.createEditJSON('REJECTED'))
            }
        }
        else if(event.column.colId == 'sampleid') {
             this.setState({forEdit : true})
             await this.props.getSampleByUUID(event.data.uuid);
             this.setState({
                 openAddSampleModal : true,
                 forEdit : true,
                 defaultSpecimenType : {
                     'label' : this.props.sample.specimenType.display,
                     'value' : this.props.sample.specimenType.uuid
                 },
                 defaultSpecimenSite : {
                    'label' : this.props.sample.specimenSite.display,
                    'value' : this.props.sample.specimenSite.uuid
                },
                 sampleFormData : {
                    quantity : this.props.sample.quantity,
                    identifier : this.props.sample.sampleIdentifier,
                    collectionDate : ''
                 }
             })

        }
    }
    render() {
        const {sampleFormData} = this.state;
        return (
            <div className="row sl-main-header">
                <div className="lt-heading col-sm-4 col-md-4 col-lg-4">
                    <h2 className="title">Sample List</h2>
                </div>
                <div className="col-sm-4 col-md-8 col-lg-8">

                    <button type="button" onClick={()=>this.openAddSampleModal()}  className="btn btn-sm btn-primary btn-add-sample">
                      Add New Sample
                    </button>
                </div>
                <div className="sl-main-card card">
                    <div className="row card-header">
                        <div className="input-group search-btn">
                            <input type="text" name="quickFilter" id="quickFilter" placeholder="Search..." onChange={this.onQuickFilterText} className="form-control bg-light border-0 small ol-input-search" aria-label="Search" aria-describedby="basic-addon2" />
                            <div className="input-group-append">
                                <button className="btn btn-primary" type="button">
                                    <i className="fas fa-search fa-sm"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="d-flex justify-content-center">
                            <div className="ag-theme-balham" style={{ height: '415px', width: '100%' }}>
                                <AgGridReact
                                    columnDefs={this.state.columnDefs}
                                    rowData={this.state.rowData}
                                    modules={AllCommunityModules}
                                    context={this.state.context}
                                    frameworkComponents={this.state.frameworkComponents}
                                    onCellClicked={event => { this.onCellClicked(event) }}
                                    enableSorting
                                    enableFilter
                                    rowAnimation
                                    quickFilterText={this.state.quickFilterText}
                                    enableRangeSelection={true}
                                    pagination={true}
                                    paginationPageSize="12"
                                    isExternalFilterPresent={true}
                                    enableColResize="true"
                                >
                                </AgGridReact>
                            </div>
                        </div>
                    </div>
              </div>
              <Modal show={this.state.openAddSampleModal} onHide={() => this.closeAddSampleModal()} style={{ marginTop: '40px' }}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.forEdit==true?'Edit':'Add'}+ Sample </Modal.Title>
                </Modal.Header>
                <form onSubmit={this.handleSubmit}>
                    <Modal.Body>
                      <div className="form-group required row">
                      <label htmlFor="specimentype" class="col-sm-4 col-form-label">Specimen Type</label>
                                <div class="col-sm-8">
                                    <Select
                                        //value={selectedDataType.label}
                                        defaultValue={this.state.defaultSpecimenType}
                                        onChange={this.handleChangeSpecimenType}
                                        options={this.specimenType}
                                        className="sl-select-dropdown"
                                        name="specimentype"

                                    />
                                </div>
                      </div>
                      <div className="form-group required row">
                      <label htmlFor="specimensite" class="col-sm-4 col-form-label">Specimen Site</label>
                                <div class="col-sm-8">
                                    <Select
                                        //value={selectedDataType.label}
                                        defaultValue={this.state.defaultSpecimenSite}
                                        onChange={this.handleChangeSpecimenSite}
                                        options={this.specimenSite}
                                        className="sl-select-dropdown"
                                        name="specimensite"

                                    />
                                </div>
                      </div>
                      <div className="form-group row">
                        <label htmlFor="quantity" class="col-sm-4 col-form-label">Quantity</label>
                        <div class="col-sm-8">
                          <input type="number" className="form-control" name="quantity"  value={sampleFormData.quantity} onChange={this.handleChange}/>
                        </div>
                      </div>
                      <div className="form-group row">
                      <label htmlFor="unit" class="col-sm-4 col-form-label">Unit</label>
                                <div class="col-sm-8">
                                    <Select
                                        //value={selectedDataType.label}
                                        //onChange={this.handleChangeDataType}
                                        options={this.units}
                                        className="sl-select-dropdown"
                                        name="unit"

                                    />
                                </div>                      </div>
                    
                      <div className="form-group required row">
                        <label htmlFor="identifier" class="col-sm-4 col-form-label">Sample Identifier</label>
                        <div class="col-sm-8">
                          <input type="text" className="form-control" name="identifier" value={sampleFormData.identifier} onChange={this.handleChange}/>
                        </div>
                      </div>
                      <div className="form-group required row">
                        <label htmlFor="identifier" class="col-sm-4 col-form-label">Collection Date</label>
                        <div class="col-sm-8">
                        <DatePicker className="form-control date-picker" selected={sampleFormData.collectionDate} onChangeRaw={this.handleDateChangeRaw} onChange={this.handleChangeDate} className="form-control date-picker" maxDate={new Date()} dateFormat="dd/MM/yyyy" placeholderText="Click to select a date" required />
                        </div>
                      </div>
                      
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" onClick = {()=>{this.closeAddSampleModal()}}class="btn btn-danger">
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-success">
                            Save
                        </button>

                    </Modal.Footer>
                </form>

            </Modal>
            <NotificationContainer/>
            </div>);
    }
}
const mapStateToProps = state => ({
 sampleList : state.labtestsample.labtestSampleForOrder,
 activeLabTest: state.labtestorder.activeLabTestOrder,
 concept: state.concepts.concept,
 sample:state.labtestsample.labtestsample
});
const mapDispatchToProps = {
  getSampleList : labtestSampleAction.getLabTestSampleForOrder,
  postLabTestSample : labtestSampleAction.postLabTestSample,
  getConceptByUUID: conceptsAction.getConceptByUUID,
  getSampleByUUID : labtestSampleAction.getLabTestSampleByUUID,
  editSample : labtestSampleAction.putLabTestSample
}
export default connect(mapStateToProps,mapDispatchToProps)(SampleList);
