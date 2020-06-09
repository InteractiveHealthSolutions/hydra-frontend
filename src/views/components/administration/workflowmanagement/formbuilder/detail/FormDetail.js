import React, { Component, useState, useEffect } from 'react'
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
import { connect } from 'react-redux';
import './formdetail.css';
import { formAction } from "../../../../../../state/ducks/form";
import Loaders from '../../../../common/loader/Loader';
import { AgGrid } from '../../../../../ui/AgGridTable/AgGrid';
import CardTemplate from '../../../../../ui/cards/SimpleCard/CardTemplate'
import { history } from '../../../../../../history';
import {useDispatch ,useSelector} from 'react-redux'
function FormDetail(props) {

    const dispatch = useDispatch()
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
    const [dummy, reload] = useState(false);
    function statusFormatter(params) {
        console.log("Formater ", params.value);
        return params.value === false ? 'Active' : 'Retired';
    }

    useEffect(() => {
          console.log("Form reload fetch" ,localStorage.getItem("check"))
          dispatch(formAction.fetchForms())
    }, []);


    const {rowData,isLoading} = useSelector((state) =>({
        rowData : state.formField.forms.forms,
        isLoading: state.formField.loading
    }))

    
    useEffect(() => {
        if(localStorage.getItem("check") === "true"){
            localStorage.setItem("check",false)
            window.location.reload()
        }
    }, [])

    

    function onRowSelected(event) {
        console.log('onRowSelected: ' + event.node.data);
    };

    function onCellClicked(formdata) {
        if (formdata.colDef.headerName == 'Edit') {
            console.log("form data :: ", formdata.data)
            localStorage.setItem("active_form", JSON.stringify(formdata.data))
            localStorage.setItem("check",true)
            history.push('/administration/form/create')
            // props.nextStep();
        }
    };

    function nextStep() {
        localStorage.setItem("active_form", JSON.stringify([]))
        history.push('/administration/form/create')
        // props.nextStep();
    }

    function onGridReady(params) {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.gridApi.sizeColumnsToFit();
        window.onresize = () => {
            this.gridApi.sizeColumnsToFit();
        }
    }
    console.log("dumy rowData :: " , rowData)
    if (isLoading) return <Loaders />;
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

export default FormDetail
