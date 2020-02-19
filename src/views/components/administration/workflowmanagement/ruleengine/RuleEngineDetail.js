import React, { Component, useState, useEffect } from 'react'
import { AgGridReact } from '@ag-grid-community/react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
import { connect } from 'react-redux';
import { ruleenginAction } from "../../../../../state/ducks/ruleengine";
import Loaders from '../../../loader/Loader';

function RuleEngineDetail(props) {

    const [columnDefs, setColumnDefs] = useState([
        {
            headerName: "Rule Name", field: "name", width: 150,
        },
        {
            headerName: "Description", field: "description", width: 275,
        },
        {
            headerName: "Action Name", field: "actionName", width: 150
        },
        {
            headerName: "Form Name", field: "form.name", width: 150
        },
        {
            headerName: "Target Form", field: "targetForm.name", width: 150
        },
        {
            headerName: "Target Question", field: "targetQuestion.name", width: 350
        },

       
    ]);

    const [rowData, setRowData] = useState([]);


    useEffect(() => {
        if (props.ruleEngineList !== undefined) {
            setRowData(props.ruleEngineList.fields)
        }
    }, [props.ruleEngineList])

    useEffect(() => {
        getAllForms();
    }, []);

    async function getAllForms() {
        await props.getAllFieldRule();
    }


    function onRowSelected(event) {
        console.log('onRowSelected: ' + event.node.data);
    };

    function onCellClicked(event) {
        console.log('onRowSelected: ' + event.node.data);
    };

    function nextStep() {
        props.nextStep();
    }
    if (props.isloading) return <Loaders />;
    return (
        <div className="row container-fluid service-main-container">
            <div className="card fp-header">
                <div className="card-header">
                    <div className="row">
                        <div className="col-md-6 col-sm-4">
                            <span className="text-muted">Rule Engine</span>
                        </div>
                        <div className="col-md-6 col-sm-2">
                            <button className="service-btn btn btn-primary " onClick={nextStep}><i class="fas fa-plus"></i>  Create New</button>
                        </div>
                    </div>
                </div>
                <div className="card-body rm-paadding">
                    <div className="d-flex justify-content-center">
                        <div
                            className="ag-theme-balham"
                            style={{
                                height: '421px',
                                width: '100%'
                            }}
                        >
                            <AgGridReact
                                columnDefs={columnDefs}
                                rowData={rowData}
                                modules={AllCommunityModules}
                                onRowSelected={onRowSelected}
                                onCellClicked={event => { onCellClicked(event) }}
                                enableSorting
                                enableFilter
                                rowAnimation
                                enableRangeSelection={true}
                                pagination={true}
                                paginationAutoPageSize={true}
                                isExternalFilterPresent={true}
                                enableColResize="true"
                            >
                            </AgGridReact>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    ruleEngineList: state.ruleengine.rules,
    isloading: state.ruleengine.loading,
});

const mapDispatchToProps = {
    getAllFieldRule: ruleenginAction.getFieldRule
};


export default connect(mapStateToProps, mapDispatchToProps)(RuleEngineDetail) 
