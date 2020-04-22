import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment'
import Modal from 'react-bootstrap/Modal';
import { AgGridReact } from '@ag-grid-community/react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { encountersAction } from '../../../../state/ducks/encounters';

import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
import './visit.css';
import CardTemplate from '../../../ui/cards/SimpleCard/CardTemplate';
import { AgGrid } from '../../../ui/AgGridTable/AgGrid';

class Visits extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            quickFilterText: '',
            obs: [],
            columnDefs: [
                {
                    headerName: "Visit", field: "visit", width: 200
                },
                {
                    headerName: "Encounter Date", field: "encounterDate", width: 200
                },
                {
                    headerName: "Encounter Type", field: "encounterType", width: 200
                },
                {
                    headerName: "Providers", field: "providers", width: 200
                },
                {
                    headerName: "Location", field: "location", width: 200
                },
                {
                    headerName: "Enterer", field: "enterer", width: 200
                },
                {
                    headerName: "View",
                    field: "view",
                    template:
                        `
                        <button style={{ lineHeight: 0.5, color: "#808080" }}><i class="fas fa-eye "></i></button>                    `
                    , width: 70
                },

                {
                    headerName: "obs", field: "obs", width: 200, hide: true
                }


            ],
            rowData: [],
            openViewModal: false,
            activePatient: JSON.parse(localStorage.getItem('active-patient'))
        }
        this.onCellClicked = this.onCellClicked.bind(this);

    }
    static propTypes = {
        encountersList: PropTypes.array.isRequired
    }
    async componentDidMount() {
        await this.props.getEncountersForAPatient(this.state.activePatient.uuid);
        await console.log('encounters ' + JSON.stringify(this.props.encountersList))
        await this.setState({ rowData: this.dataBuilder() });
    }
    async componentWillReceiveProps(newProps) {
        if (newProps.allEncounters != undefined) {
            await this.setState({ rowData: this.dataBuilder() });

        }
    }
    async onCellClicked(event) {
        if (event.column.colId == 'view') {
            await this.setState({ obs: event.data.obs, openViewModal: true })
        }
    }
    dataBuilder() {
        let data = [];
        if (this.props.encountersList != undefined) {
            this.props.encountersList.results.forEach(element => {
                let providers = '';
                element.encounterProviders.forEach(value => {
                    providers = providers + value.provider.display + ',';
                });
                data.push({
                    "visit": element.visit == null ? 'None' : element.visit,
                    "view": "view",
                    "encounterDate": element.encounterDatetime != null ? moment(element.encounterDatetime).format("YYYY_MM_DD") : "",
                    "encounterType": element.encounterType.display,
                    "providers": providers.slice(0, -1),
                    "location": element.location.display,
                    "enterer": element.auditInfo.creator.display,
                    "obs": element.obs
                })
            });

        }
        return data;
    }
    closeViewModal() {
        this.setState({ openViewModal: false, obs: [] })
    }
    onGridReady = (params) => {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.gridApi.sizeColumnsToFit();
        window.onresize = () => {
            this.gridApi.sizeColumnsToFit();
        }
    }
    render() {
        const { columnDefs, rowData } = this.state
        return (
            <>
                <CardTemplate
                    title="Patient Visits"
                >
                    <AgGrid
                        onGridReady={this.onGridReady}
                        columnDefs={columnDefs}
                        onRowSelected={this.onRowSelected}
                        rowData={rowData}
                        onCellClicked={event => { this.onCellClicked(event) }}
                    />

                </CardTemplate>
                <Modal show={this.state.openViewModal} onHide={() => this.closeViewModal()} backdrop="static" style={{ marginTop: '40px' }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Encounter Observations</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {
                            this.state.obs.map((value, i) => {
                                return (
                                    <div className="form-group row">
                                        <label className="col-form-label col-sm-4 " >{value.concept.display}</label>
                                        <div className="col-sm-8">
                                          <input type="text" className="form-control" name="name" value={(value !== undefined && value.display !== undefined) ? value.display : value} disabled />
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>
            </>

            // <div className="row container-fluid l-main-container">
            //     <div className="card fp-header" style={{ marginTop: '100px', marginLeft: '30px' }}>
            //         <div className="card-header">
            //             <div className="row">
            //                 <div className="col-md-8 col-sm-4">
            //                     <span className="text-muted">Patient Visits</span>
            //                 </div>
            //             </div>


            //         </div>
            //         <div className="card-body rm-paadding">
            //             <div className="d-flex justify-content-center">
            //                 <div className="ag-theme-balham" style={{ height: '415px', width: '100%' }}>
            //                     <AgGridReact
            //                         columnDefs={this.state.columnDefs}
            //                         rowData={this.state.rowData}
            //                         modules={AllCommunityModules}
            //                         //context={this.state.context}
            //                         //frameworkComponents={this.state.frameworkComponents}
            //                         enableSorting
            //                         enableFilter
            //                         rowAnimation
            //                         //quickFilterText={this.state.quickFilterText}
            //                         enableRangeSelection={true}
            //                         pagination={true}
            //                         paginationPageSize="12"
            //                         isExternalFilterPresent={true}
            //                         enableColResize="true"
            //                         onCellClicked={this.onCellClicked}
            //                     >
            //                     </AgGridReact>
            //                 </div>
            //             </div>
            //         </div>
            //     </div>


        )
    }
}
const mapStateToProps = state => ({
    encountersList: state.encounters.allEncounters
});
const mapDispatchToProps = {
    getEncountersForAPatient: encountersAction.getAllEncounter
};
export default connect(mapStateToProps, mapDispatchToProps)(Visits)