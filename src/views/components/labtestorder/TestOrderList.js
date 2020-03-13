import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NotificationContainer } from 'react-notifications';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';
import Card from 'react-bootstrap/Card';
import { AgGridReact } from '@ag-grid-community/react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import ButtonRenderer from '../../../utilities/helpers/ButtonRenderer';
import { createNotification } from '../../../utilities/helpers/helper'
import { labtestOrderAction } from '../../../state/ducks/labtestorder';
import {labtestattributeAction} from '../../../state/ducks/labtestattribute';
import { history } from '../../../history'
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
import './TestOrderList.css';

class TestOrderList extends React.Component {
    constructor(props) {
        super(props);
        this.activePatient = JSON.parse(localStorage.getItem('active-patient'));
        this.state = {
            quickFilterText: null,
            openViewModal: false,
            openEditModal: false,
            currentIndex: 0,
            viewList: [],
            columnDefs: [
                {
                    headerName: "Test Type", field: "testtype", width: 250
                },
                {
                    headerName: "Lab Reference Number", field: "labreference", width: 275
                },
                {
                    headerName: "Manage Test Sample", field: "testsample", width: 210,
                    cellRenderer: 'buttonRenderer'
                },
                {
                    headerName: "Test Results", field: "testresults", width: 170,
                    cellRenderer: 'buttonRenderer'
                },
                {
                    headerName: "Result Date", field: "resultdate", width: 210
                },
                {
                    headerName: "View", field: "view", width: 90,
                    cellRenderer: 'buttonRenderer'
                },
                {
                    headerName: "Edit", field: "edit", width: 90,
                    cellRenderer: 'buttonRenderer',
                    
                },
                {
                    headerName: "UUID", field: "uuid", width: 250, hide: true
                },
                {
                    headerName: "index", field: "index", width: 250, hide: true
                },
                {
                    headerName: "TestTypeUUID", field: "testTypeuuid", width: 250, hide: true
                }
            ],
            rowData: [],
            context: { componentParent: this },
            frameworkComponents: {
                buttonRenderer: ButtonRenderer
            },
            editFormData: {
                encounterName: '',
                encounterUUID: '',
                testTypeName: '',
                testTypeUUID: '',
                labReference: '',
                instructions: '',
                caresetting: ''
            },
            selectedUUID: ''
        }
        this.optionsCareSetting = [
            { label: 'In Patient', value: '5485AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' },
            { label: 'Out Patient', value: '160542AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' }
        ];
        this.handleChangeCareSetting = this.handleChangeCareSetting.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    static propTypes = {
        labTestOrderList: PropTypes.array.isRequired,
        activeLabTest: PropTypes.string.isRequired,
        testresults : PropTypes.array.isRequired

    };
    async componentWillMount() {
        console.log('active ' + JSON.parse(localStorage.getItem('active-patient')));

        await this.props.getLabTestOrderForPatient(this.activePatient.uuid/*'dbac89bb-508b-4693-aad1-3b5a5310252e'*/);
        console.log('list ' + JSON.stringify(this.props.labTestOrderList))
        await this.setState({ rowData: this.labTestOrderDataBuilder() });
        await this.setState({ viewList: this.props.labTestOrderList.results })
    }
    openViewModal() {
        this.setState({ openViewModal: true });
    }
    closeViewModal() {
        this.setState({ openViewModal: false });
    }
    handleChangeCareSetting = caresetting => {
        const formData = this.state.editFormData
        this.setState({
            editFormData: {
                ...formData,
                caresetting: caresetting.value
            }
        });
    }
    closeEditModal() {
        this.setState({ openEditModal: false });
    }
    labTestOrderDataBuilder() {
        let dataToBeDisplayed = [];
        let index = 0;
        this.props.labTestOrderList.results.forEach(element => {
            let sample=''
            if(JSON.stringify(element.labTestSamples).includes('PROCESSED'))
               sample = 'PROCESSED'
            if(JSON.stringify(element.labTestSamples).includes('ACCEPTED'))
               sample = 'ACCEPTED'
            if(JSON.stringify(element.labTestSamples).includes('REJECTED'))
               sample = 'REJECTED'
            dataToBeDisplayed.push({
                "testtype": element.labTestType.name,
                "labreference": element.labReferenceNumber,
                "uuid": element.uuid,
                "testsample": sample,
                "resultdate": '2020-01-01',
                "testresults": "testresults",
                "index": index,
                "view": "view",
                "edit": "edit",
                "TestTypeUUID": element.labTestType.uuid
            })
            index++;

        });
        return dataToBeDisplayed;

    }
    handleSubmit(e) {
        e.preventDefault();
        this.props.saveLabTest(this.state.selectedUUID, this.createEditJSON());
    }
    createEditJSON() {
        return {
            "order": {
                "patient": this.activePatient.uuid,
                "concept": this.state.editFormData.concept,
                "orderer": 'e2d3590a-b7b5-11e6-bc7b-08002765b69c',
                "type": "Test Order",
                "caresetting": this.state.editFormData.caresetting,
                "encounter": this.state.editFormData.encounterUUID
            },
            "labTestType": this.state.editFormData.testTypeUUID,
            "labReferenceNumber": this.state.editFormData.labReference,
            "labInstructions": this.state.editFormData.instructions
        }
    }

    async onCellClicked(event) {
        if (event.column.colId === "testsample") {
            console.log('hi ' + event.column.colId);
            this.props.setActiveLabTest(event.data.uuid);
            localStorage.setItem('active-test', this.props.activeLabTest);
            history.push("/samplelist")
            //console.log('hi '+event.data.testType);
        }
        else if (event.value === "testresults") {
            this.props.labTestOrderList.results.forEach(element => {
                if (event.data.uuid == element.uuid) {
                    if (element.labTestSamples.length == 0 && element.labTestType.requiresSpecimen) {
                        createNotification('warning', 'Need to provide atleast one sample');
                    }
                    else {
                        // this.props.setActiveLabTest(event.data.testTypeuuid);
                        localStorage.setItem('active-test-type', event.data.TestTypeUUID);
                        this.props.setActiveLabTest(event.data.uuid);
                        console.log(localStorage.getItem('active-test-type'))
                        localStorage.setItem('active-test', this.props.activeLabTest);
                        localStorage.setItem('active-test-name',event.data.testtype)
                        localStorage.setItem('reference',event.data.labreference)
                        history.push("/testresults");
                    }

                }
            })
        }
        else if (event.value === "view") {
            this.setState({ openViewModal: true, currentIndex: event.data.index });
            this.setState({ viewList: this.props.labTestOrderList.results })
           // add get results here
            console.log('update cell' + JSON.stringify(this.props.labTestOrderList))
        }
        else if (event.value === "edit") {

            this.props.labTestOrderList.results.forEach(element => {
                if (event.data.uuid == element.uuid) {
                    this.setState({
                        editFormData: {
                            encounterName: element.order.encounter.display,
                            encounterUUID: element.order.encounter.uuid,
                            testTypeName: element.labTestType.name,
                            testTypeUUID: element.labTestType.uuid,
                            labReference: element.labReferenceNumber,
                            instructions: '',
                            caresetting: '',
                            concept: element.labTestType.referenceConcept
                        },
                        openEditModal: true,
                        selectedUUID: event.data.uuid

                    })
                }
            });
        }
    }
    handleChange(event) {

        const { name, value } = event.target;
        const { editFormData } = this.state;
        this.setState({
            editFormData: {
                ...editFormData,
                [name]: value
            }
        });
        console.log("on change " + name + " " + value);
    }
    onQuickFilterText = (event) => {
        this.setState({ quickFilterText: event.target.value });
    };

    render() {
        const { editFormData } = this.state;
        return (
            <div className="row ol-main-header">
                <div className="lt-heading col-sm-4 col-md-4 col-lg-4">
                    <h2 className="title">Test Order List</h2>
                </div>
                <div className="col-sm-4 col-md-8 col-lg-8">

                    <Link to="/testorder"><button type="button" className="btn btn-sm btn-primary btn-add-order">
                        + Add Test Order
      </button></Link>
                </div>
                <div className="ol-main-card card">
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
                <Modal size="lg" show={this.state.openViewModal} onHide={() => this.closeViewModal()} style={{ marginTop: '30px' }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Test Order Summary</Modal.Title>
                    </Modal.Header>
                    {
                        this.state.viewList.map((value, i) => {
                            if (i == this.state.currentIndex) {
                                return (
                                    <Modal.Body >
                                        <Card>
                                            <Card.Header style={{ backgroundColor: '#b3b300' }}>
                                                Order Details
                                            </Card.Header>
                                            <Card.Body>
                                                <table className="" id="orderTable">
                                                    <tbody>
                                                        <tr>
                                                            <td>Test Order Id</td>
                                                            <td>{value.order.orderNumber}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Test Group</td>
                                                            <td>{value.labTestType.testGroup}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Test Type</td>
                                                            <td>{value.labTestType.name}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Encounter Type</td>
                                                            <td>{value.order.encounter.display}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Lab Reference Number</td>
                                                            <td>{value.labReferenceNumber}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Require Specimen</td>
                                                            <td>{value.labTestType.requiresSpecimen == true ? 'true' : 'false'}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Created By</td>
                                                            <td>{value.auditInfo.creator.display}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Changed By</td>
                                                            <td>{value.auditInfo.changedBy}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Date Created</td>
                                                            <td>{value.auditInfo.dateCreated}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>UUID</td>
                                                            <td>{value.uuid}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </Card.Body>
                                        </Card>
                                        <br />
                                        <Card>
                                            <Card.Header style={{ backgroundColor: '#cc6600' }}>
                                                Test Sample Details
                                        </Card.Header>
                                            <Card.Body>
                                                <table className="" id="orderTable">
                                                    <thead>
                                                        <th>
                                                            Specimen Site
                                                          </th>
                                                        <th>
                                                            Specimen Type
                                                          </th>
                                                        <th>
                                                            Status
                                                          </th>
                                                    </thead>
                                                    <tbody>
                                                        {value.labTestSamples.map((element,j) => {
                                                            return (<tr>
                                                                <td>
                                                                    {element.specimenSite.display}
                                                                </td>
                                                                <td>
                                                                   {element.specimenType.display}
                                                                </td>
                                                                <td>
                                                                    {element.status}
                                                                </td>
                                                            </tr>)
                                                        })}


                                                    </tbody>
                                                </table>
                                            </Card.Body>
                                        </Card>
                                        <br />
                                        <Card>
                                            <Card.Header style={{ backgroundColor: '#ff8c1a' }}>
                                                Test Result Details
                                        </Card.Header>
                                            <Card.Body>
                                                <table className="" id="orderTable">
                                                    <thead>
                                                        <th>
                                                            Group Name
                                                          </th>
                                                        <th>
                                                            Question
                                                          </th>
                                                        <th>
                                                            Value
                                                          </th>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                            </td>
                                                            <td>
                                                            </td>
                                                            <td>
                                                            </td>
                                                        </tr>

                                                    </tbody>
                                                </table>
                                            </Card.Body>
                                        </Card>

                                    </Modal.Body>

                                );
                            }
                        })
                    }




                </Modal>
                <Modal show={this.state.openEditModal} onHide={() => this.closeEditModal()} style={{ marginTop: '40px' }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Test Order</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={this.handleSubmit}>
                        <Modal.Body>
                            <div className="form-group row required">
                                <label className="col-form-label col-sm-4" htmlFor="encounter">Encounter</label>
                                <div className="col-sm-8">
                                    <input type="text" className="form-control" name={editFormData.encounterUUID} value={editFormData.encounterName} onChange={this.handleChange} required disabled={true} />
                                </div>
                            </div>
                            <div className="form-group row required">
                                <label className="col-form-label col-sm-4" htmlFor="testtype">Test Type</label>
                                <div className="col-sm-8">
                                    <input type="text" className="form-control" name={editFormData.testTypeUUID} value={editFormData.testTypeName} onChange={this.handleChange} required disabled={true} />
                                </div>
                            </div>
                            <div className="form-group row required">
                                <label className="col-form-label col-sm-4" htmlFor="labReference">Lab Reference Number</label>
                                <div className="col-sm-8">
                                    <input type="text" className="form-control" name="labReference" value={editFormData.labReference} onChange={this.handleChange} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="caresetting" className="col-form-label col-sm-4">Care Setting</label>
                                <div className="col-sm-8">
                                    <Select
                                        //value={editFormData.caresetting}
                                        onChange={this.handleChangeCareSetting}
                                        options={this.optionsCareSetting}
                                        className="to-select-dropdown"
                                        name="caresetting"

                                    />
                                </div>

                            </div>
                            <div className="form-group row">
                                <label className="col-form-label col-sm-4" htmlFor="instructions">Instructions</label>
                                <div className="col-sm-8">
                                    <textarea className="form-control" name="instructions" value={editFormData.instructions} onChange={this.handleChange} />
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <button type="button" onClick={() => { this.closeEditModal() }} class="btn btn-danger">
                                Cancel
                        </button>
                            <button type="submit" class="btn btn-success">
                                Save
                        </button>

                        </Modal.Footer>
                    </form>
                </Modal>
                <NotificationContainer />
            </div>);
    }
}
const mapStateToProps = (state) => ({
    labTestOrderList: state.labtestorder.labtestOrderForPatient,
    activeLabTest: state.labtestorder.activeLabTestOrder,
    testresults : state.labtestattribute.labTestResults
})
const mapDispatchToProps = {
    getLabTestOrderForPatient: labtestOrderAction.getLabTestOrderForPatient,
    setActiveLabTest: labtestOrderAction.setActiveLabTestOrder,
    saveLabTest: labtestOrderAction.putLabTestOrder,
    getResults : labtestattributeAction.getTestResultForOrder
}

export default connect(mapStateToProps, mapDispatchToProps)(TestOrderList);