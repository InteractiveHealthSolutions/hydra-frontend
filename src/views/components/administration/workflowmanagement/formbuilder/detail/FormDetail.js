import React, { Component, useState, useEffect } from 'react'
import { AgGridReact } from '@ag-grid-community/react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import './formdetail.css';
import { formAction } from "../../../../../../state/ducks/form";
import { createNotification } from '../../../../../../utilities/helpers/helper'
import Loaders from '../../../../loader/Loader';

function FormDetail(props) {

    const [columnDefs, setColumnDefs] = useState([
        {
            headerName: "Name", field: "name", editable: true, width: 520,
        },
        {
            headerName: "Description", field: "description", width: 610
        },
        {
            headerName: "Edit",
            template:
                `
                  <button className="btn-edite"><i class="fas fa-pencil-alt"></i></button>
                `
            , width: 80
        }
    ]);

    const [rowData, setRowData] = useState([]);


    useEffect(() => {
        if (props.formList !== undefined) {
            setRowData(props.formList.forms)
        }
    }, [props.formList])


    useEffect(() => {
        getAllForms();
    }, []);

    async function getAllForms() {
        await props.getAllForm();
    }


    function onRowSelected(event) {
        console.log('onRowSelected: ' + event.node.data);
    };

    function onCellClicked(formdata) {
        if (formdata.colDef.headerName == 'Edit') {
            console.log("form data :: ", formdata.data)
            localStorage.setItem("active_form", JSON.stringify(formdata.data))
            props.nextStep();
        }
    };

    function nextStep() {
        localStorage.setItem("active_form", JSON.stringify([]))
        props.nextStep();
    }
    
    if (props.isLoading) return <Loaders />;
    return (
        <div className="row container-fluid service-main-container">
            <div className="card fp-header">
                <div className="card-header">
                    <div className="row">
                        <div className="col-md-6 col-sm-4">
                            <span className="text-muted">Form</span>
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
    formList: state.formField.forms,
    isLoading: state.formField.loading
});

const mapDispatchToProps = {
    getAllForm: formAction.fetchForms
};


export default connect(mapStateToProps, mapDispatchToProps)(FormDetail) 
