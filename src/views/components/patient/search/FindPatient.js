import React from 'react';
import './findpatient.css';
import { findpatientservice } from '../../../../services';
import { AgGridReact } from '@ag-grid-community/react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
import { Link } from 'react-router-dom';
import { PatientActions } from '../../../../store/actions';
import { connect } from 'react-redux';
import {PatiendSideBackButton} from '../../common/sidebutton/SideBackButton'

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
            rowData: []
        };

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

    handleChange = e => {
        e.preventDefault();
        const { name, value } = e.target;
        this.setState({ [name]: value }, () => console.log(this.state));
    };

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
                                <Link to="/PatientRegistration">
                                    <button class="fp-btn btn btn-primary"><i class="fas fa-plus"></i> Create New</button>
                                </Link>
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

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const Patient = state.patientreducer;
    return { Patient };
}
export default connect(mapStateToProps)(FindPatient);