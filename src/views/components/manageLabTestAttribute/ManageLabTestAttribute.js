import React from 'react' ;
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import { AgGridReact } from '@ag-grid-community/react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import AddLabTestAttribute from '../addlabtestattribute/AddLabTestAttribute'
import {labtestattributeAction} from '../../../state/ducks/labtestattribute'
import CardTemplate from '../../ui/cards/SimpleCard/CardTemplate';
import { AgGrid } from '../../ui/AgGridTable/AgGrid';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
import './ManageLabTestAttribute.css'

class ManageLabTestAttribute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quickFilterText : null,
            openAddAttrModal : false,
            columnDefs : [
              {
                headerName: "Name", field: "name", width: 400
              },
              {
                headerName: "Description", field: "description", width: 600
              },
              {
                headerName: "Lab Test Type", field: "testtype", width: 300
              }],
            rowData: [],
            
  
          }
          this.closeAddTestAttrModal = this.closeAddTestAttrModal.bind(this);

    }
    static propTypes = {
        labtestattributelist: PropTypes.array.isRequired,
      };
    async componentWillMount() {
        await this.props.getAllLabTestAttribute();
        await this.setState({rowData : this.labTestDataBuilder()});
        await console.log('row data'+JSON.stringify(this.state.rowData));

    }
    closeAddTestAttrModal() {
        this.setState({openAddAttrModal : false});
      }
    labTestDataBuilder() {
        let dataToBeDisplayed = [];
        this.props.labtestattributelist.results.forEach(element => {
          dataToBeDisplayed.push({
            "name":element.name,
            "description": element.description,
            "testtype": element.labTestType.name,
            "uuid" : element.uuid
          })
        });
        return dataToBeDisplayed;
      }
      onQuickFilterText = (event) => {
        this.setState({quickFilterText: event.target.value});
      };
      onCellClicked = event => {
        if(event.value === "View"){
          console.log('hi '+event.column.colId);
          //console.log('hi '+event.data.testType);
        }
        else if(event.value === "Add") {
          //<AddLabTestAttribute testdata={event.data}/>
          console.log('hi');
          this.setState({openAddAttrModal : true , selectedTest : event.data});
        }
        else {
  
        }
      }
    render() {
      const {rowData, columnDefs } = this.state;

        return (
          <>
          <CardTemplate
                    title="Manage Lab Test Attribute"
                    action={<button type="button" onClick={() => this.setState({openAddAttrModal:true})} className="fp-btn btn btn-primary "><i class="fas fa-plus"></i> Add New Attribute</button>}
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
                <AddLabTestAttribute labTestAvailable={false} show = {this.state.openAddAttrModal} close = {this.closeAddTestAttrModal}/>
   
          </>
      //       <div className="row main-header">
      //       <div className="lt-heading col-sm-6 col-md-6 col-lg-6">
      //         <h2 className="title">Manage Lab Test Attributes</h2>
      //       </div>  
      //       <div className="col-sm-6 col-md-6 col-lg-6">

      //       <button type="button" onClick={() => this.setState({openAddAttrModal : true})} className="btn btn-sm btn-primary btn-add-test-att">
      //          + Add Attribute Type
      //       </button>
      //       </div>
      //   <div className="main-card card">
      //     <div className="row card-header">
      //     <div className="input-group search-btn">
      //         <input type="text" name="quickFilter" id="quickFilter" placeholder = "Search..." onChange={this.onQuickFilterText} className="form-control bg-light border-0 small lt-input-search"  aria-label="Search" aria-describedby="basic-addon2" />
      //           <div className="input-group-append">
      //             <button className="btn btn-primary" type="button">
      //                 <i className="fas fa-search fa-sm"></i>
      //             </button>
      //           </div>
      //         </div>
      //     </div>
      //     <div className = "card-body">
      //     <div className="d-flex justify-content-center">
      //     <div className="ag-theme-balham" style={{ height: '415px',width: '100%'}}>
      //     <AgGridReact
      //         columnDefs={this.state.columnDefs}
      //         rowData={this.state.rowData}
      //         modules={AllCommunityModules}
      //         onCellClicked={event => { this.onCellClicked(event) }}
      //         enableSorting
      //         enableFilter
      //         rowAnimation
      //         quickFilterText={this.state.quickFilterText}
      //         enableRangeSelection={true}
      //         pagination={true}
      //         paginationPageSize="12"
      //         isExternalFilterPresent={true}
      //         enableColResize="true"
      //     >                 
      //     </AgGridReact>
      //     </div>
      //     </div>
      //     </div>
      // </div>
      

        
      // </div>
        );
    }
}
const mapStateToPops = state => ({
    labtestattributelist : state.labtestattribute.allLabTestAttribute,
  })
  
  const mapsDispatchToProps = {
    getAllLabTestAttribute : labtestattributeAction.getAllLabTestAttribute,
  }
  export default connect(mapStateToPops,mapsDispatchToProps)(ManageLabTestAttribute);