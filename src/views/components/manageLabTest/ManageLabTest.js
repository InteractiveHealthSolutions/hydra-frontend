import React from 'react' ;
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import { AgGridReact } from '@ag-grid-community/react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import ButtonRenderer from '../../../utilities/helpers/ButtonRenderer';
import {labtestAction} from '../../../state/ducks/labtest';
import { createNotification } from '../../../utilities/helpers/helper';
import AddLabTestAttribute from '../addlabtestattribute/AddLabTestAttribute';
import CardTemplate from '../../ui/cards/SimpleCard/CardTemplate';
import { AgGrid } from '../../ui/AgGridTable/AgGrid';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
import  './ManageLabTest.css';

class ManageLabTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          openAddTestModal : false,
          quickFilterText : null,
          openAddAttrModal : false,
          openViewAttrModel : false,
          isLabTestAvailable: false,
          selectedTest : '',
          columnDefs : [
            {
              headerName: "S.No.", field: "sno", width: 110
            },
            {
              headerName: "Test Type Name", field: "testType", width: 250
            },
            {
              headerName: "Short Name", field: "shortName", width: 250
            },
            {
              headerName: "Test Group", field: "testGroup", width: 250
            },  
            {
              headerName: "Reference Concept", field: "referenceConcept", width: 280
            },
            {
              headerName: "View",
              field: "view",
              template:
                  `
              <button className="btn-edite"><i class="fa fa-eye"></i></button>
              `
              , width: 100
            },
            {
              headerName: "Add",
              field: "add",
              template:
                  `
              <button className="btn-edite"><i class="fa fa-plus"></i></button>
              `
              , width: 100
          }
          ],
          rowData: [],
          context: { componentParent: this },
          frameworkComponents: {
            buttonRenderer: ButtonRenderer,
          }

        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.closeAddTestAttrModal = this.closeAddTestAttrModal.bind(this);
        
    }
    static propTypes = {
      labtestlist: PropTypes.array.isRequired,
    };
    handleSubmit() {
      this.closeAddTestModal();
    }
    
    async componentWillMount() {
     await this.props.getAllLabTest();
     await console.log('list +' + JSON.stringify(this.props.labtestlist.results));

     await this.setState({rowData : this.labTestDataBuilder()});
    }
    openAddTestModal() {
      this.setState({ openAddTestModal: true });
    }
  
    closeAddTestModal() {
      this.setState({ openAddTestModal: false });
    }
    labTestDataBuilder() {
      let dataToBeDisplayed = [];
      let sno = 1;
      this.props.labtestlist.results.forEach(element => {
        dataToBeDisplayed.push({
          "sno":sno,
          "testGroup": element.testGroup,
          "shortName": element.shortName,
          "testType" :element.name,
          "referenceConcept":element.referenceConcept.name.name,
          "view":"view",
          "add":"add"
        })
        sno++;
      });
      return dataToBeDisplayed;
    }
   
  
  closeAddTestAttrModal() {
    this.setState({openAddAttrModal : false , selectedTest : '',isLabTestAvailable:false});
  }
  
    onCellClicked = event => {
      if(event.value === "view"){
        createNotification('info','Feature under construction');
        //console.log('hi '+event.data.testType);
      }
      else if(event.value === "add") {
        //<AddLabTestAttribute testdata={event.data}/>
        this.setState({openAddAttrModal : true ,selectedTest : event.data, isLabTestAvailable:true});
      }
      else {

      }
    }
    onQuickFilterText = (event) => {
      this.setState({quickFilterText: event.target.value});
    };
    render() {
      const {rowData, columnDefs } = this.state;

      return (
        <>
        <CardTemplate
                  title="Manage Lab Test"
                  action={<button type="button" onClick={() => this.openAddTestModal()} className="fp-btn btn btn-primary "><i class="fas fa-plus"></i> Add New Lab Test</button>}
              >
                  <div className="card-body rm-paadding">
                      <AgGrid
                          onGridReady={this.onGridReady}
                          columnDefs={columnDefs}
                          onRowSelected={this.onRowSelected}
                          rowData={rowData}
                          onCellClicked={this.onCellClicked}
                      />
                  </div>
              </CardTemplate>
       {/* <div className="row lt-main-header">
                <div className="lt-heading col-sm-4 col-md-4 col-lg-4">
                  <h2 className="title">Manage Lab Test</h2>
                </div>  
                <div className="col-sm-4 col-md-8 col-lg-8">

                <button type="button" onClick={() => this.openAddTestModal()} className="btn btn-sm btn-primary btn-add-test">
                   + Add Test Type
                </button>
                </div>
            <div className="lt-main-card card">
              <div className="row card-header">
              <div className="input-group search-btn">
                  <input type="text" name="quickFilter" id="quickFilter" placeholder = "Search..." onChange={this.onQuickFilterText} className="form-control bg-light border-0 small lt-input-search"  aria-label="Search" aria-describedby="basic-addon2" />
                    <div className="input-group-append">
                      <button className="btn btn-primary" type="button">
                          <i className="fas fa-search fa-sm"></i>
                      </button>
                    </div>
                  </div>
              </div>
              <div className = "card-body">
              <div className="d-flex justify-content-center">
              <div className="ag-theme-balham" style={{ height: '415px',width: '100%'}}>
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
      </div>*/}
          <Modal show={this.state.openAddTestModal} onHide={() => this.closeAddTestModal()} style={{ marginTop: '40px' }}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Test Type</Modal.Title>
                </Modal.Header>
                <form onSubmit={this.handleSubmit}>
                    <Modal.Body>
                      <div className="form-group row">
                        <label htmlFor="rconcept" class="col-sm-5 col-form-label required">Reference Concept</label>
                        <div class="col-sm-7">
                          <input type="text" className="form-control" name="rconcept" required/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label htmlFor="testname" class="col-sm-5 col-form-label required">Test Name</label>
                        <div class="col-sm-7">
                          <input type="text" className="form-control" name="testname" required />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label htmlFor="shortname" class="col-sm-5 col-form-label">Short Name</label>
                        <div class="col-sm-7">
                          <input type="text" className="form-control" name="shortname" />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label htmlFor="description" class="col-sm-5 col-form-label">Description</label>
                        <div class="col-sm-7">
                        <textarea class="form-control" rows="3" name="description"></textarea>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label htmlFor="testgroup" class="col-sm-5 col-form-label">Test Group</label>
                        <div class="col-sm-7">
                          <input type="text" className="form-control" name="testgroup" />
                        </div>
                      </div>
                      <div class="form-group row">
                        <div className="col-sm-5">
                        <label htmlFor="specimen" className="col-form-label required">Requires Specimen</label>
                        </div>
                          <div className="col-sm-7">
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-check">
                                      <input className="form-check-input" type="radio" name="specimen" value="Yes"required />
                                      <label className="form-check-label" htmlFor="specimen" >
                                        Yes
                                      </label>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                  <div className="form-check">
                                    <input className="form-check-input" type="radio" name="specimen" value="No" />
                                    <label className="form-check-label" htmlFor="specimen">
                                      No
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                       </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" onClick = {()=>{this.closeAddTestModal()}}class="btn btn-danger">
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-success">
                            Save
                        </button>

                    </Modal.Footer>
                </form>

            </Modal>{/*
            <Modal show={this.state.openViewAttrModel} onHide={() => this.closeAddTestModal()} style={{ marginTop: '40px' }}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Test Type</Modal.Title>
                </Modal.Header>
                    <Modal.Body>
                    </Modal.Body>
            </Modal>
            
          </div> */}
          <AddLabTestAttribute test = {this.state.selectedTest} labTestAvailable={this.state.isLabTestAvailable} show = {this.state.openAddAttrModal} close = {this.closeAddTestAttrModal}/>

          </>);
        
    }
}
const mapStateToProps = state => ({
  labtestlist : state.labtest.allLabTest,
})

const mapsDispatchToProps = {
  getAllLabTest : labtestAction.getAllLabTest,
}
export default connect(mapStateToProps,mapsDispatchToProps)(ManageLabTest);