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
import Loaders from '../../../../common/loader/Loader';
import { AgGrid } from '../../../../../ui/AgGridTable/AgGrid';
import CardTemplate from '../../../../../ui/cards/SimpleCard/CardTemplate'

function FormDetail(props) {

    const [columnDefs, setColumnDefs] = useState([
        {
            headerName: "Name", field: "name"
        },
        {
            headerName: "Description", field: "description"
        },
        {
            headerName: "Edit",
            template:
                `
                  <button className="btn-edite"><i class="fas fa-pencil-alt"></i></button>
                `
            , width: 60
        },
        {
            headerName: "Status", field: "retired", valueFormatter: statusFormatter, filter: "agSetColumnFilter", width: 60
        }
    ]);

    const [rowData, setRowData] = useState([]);

    function statusFormatter(params) {
        console.log("Formater ", params.value);
        return params.value === false ? 'Active' : 'Retired';
    }

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

    function onGridReady(params) {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.gridApi.sizeColumnsToFit();
        window.onresize = () => {
            this.gridApi.sizeColumnsToFit();
        }
    }

    if (props.isLoading) return <Loaders />;
    return (
        <CardTemplate
            title="Form"
            action={
                <button className="service-btn btn btn-primary " onClick={nextStep}><i class="fas fa-plus"></i>  Create New</button>
            }
        >
            <div className="card-body rm-paadding">
                <AgGrid
                    onGridReady={onGridReady}
                    columnDefs={columnDefs}
                    onRowSelected={onRowSelected}
                    rowData={rowData}
                    onCellClicked={onCellClicked}
                />
            </div>
        </CardTemplate>
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
