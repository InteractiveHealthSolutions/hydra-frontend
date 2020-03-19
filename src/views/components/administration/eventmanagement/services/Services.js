import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import './services.css';
import { serviceAction } from '../../../../../state/ducks/service'
import { encounterAction } from '../../../../../state/ducks/encounter'
import { labtesttypeAction } from '../../../../../state/ducks/labtesttype'
import Loaders from '../../../common/loader/Loader';
import { createNotification } from '../../../../../utilities/helpers/helper'
import { systemSettingsAction } from '../../../../../state/ducks/systemsettings'
import AutoSearchComplete from '../../../../ui/inputs/AutoComplete/AutoSearchComplete';
import { ModalFormTemplate } from '../../../../ui/modal/modalFormTemplate/ModalFormTemplate';
import { AgGrid } from '../../../../ui/AgGridTable/AgGrid';
import CardTemplate from '../../../../ui/cards/SimpleCard/CardTemplate';


function Services(props) {

    const [columnDefs, setColumnDefs] = useState([
        {
            headerName: "Name", field: "name", editable: true, filter: "agTextColumnFilter",
            icons: {
                menu: '<i class="fas fa-search"></i>',
                filter: '<i class="fa fa-long-arrow-alt-up"/>',
                columns: '<i class="fa fa-snowflake"/>',
                sortAscending: '<i class="fa fa-sort-alpha-up"/>',
                sortDescending: '<i class="fa fa-sort-alpha-down"/>'
            },
            filter: true
        },
        {
            headerName: "Service Type", field: "serviceType.name", filter: "agTextColumnFilter"
        },
        {
            headerName: "Unit Cost", field: "unitCost", valueFormatter: currencyFormatter, filter: "agSetColumnFilter"
        },
        {
            headerName: "Edit",
            template:
                `
                  <button className="btn-edite"><i class="fas fa-pencil-alt"></i></button>
                `
            , filter: "agSetColumnFilter"
        },
        {
            headerName: "Status", field: "retired", valueFormatter: statusFormatter, filter: "agSetColumnFilter"
        },
    ]);
    const [rowData, setRowData] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [serviceName, setServiceName] = useState('');
    const [serviceRetire, setServiceRetire] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [actionType, setActionType] = useState('');
    const [activeService, setActiveService] = useState({});
    const [serviceTypeName, setServiceTypeName] = useState('');
    const [availableServicesType, setAvailableServicesType] = useState([]);
    const [availableEncounterType, setAvailableEncounterType] = useState([]);
    const [arrServiceType, setArrServiceType] = useState([]);
    const [unitCost, setUnitCost] = useState('');
    const [labtestTypeArray, setLabtestTypeArray] = useState([])
    const [autocompleteLabtestTypeValue, setAutocompleteLabtestTypeValue] = useState("")
    const [activeCurrency, setActiveCurrency] = useState({})
    const [associatedForm, setAssociatedForm] = useState({})


    function statusFormatter(params) {
        console.log("Formater ", params.value);
        return params.value === false ? 'Active' : 'Retired';
    }

    function currencyFormatter(params) {
        return params.value !== null ? localStorage.getItem('currency') + " " + params.value : ""
    }


    useEffect(() => {
        if (props.serviceList !== undefined) {
            setRowData(props.serviceList.services)
        }

    }, [props.serviceList, rowData])

    useEffect(() => {

        if (props.serviceTypeList !== undefined) {
            console.log("serviceTypeLis",props.serviceTypeList)
            setAvailableServicesType(props.serviceTypeList.serviceTypes);
            if (availableServicesType !== undefined)
                populateDropDown();
        }

    }, [props.serviceTypeList,availableServicesType])



    useEffect(() => {
        if (props.setting !== undefined && props.setting.value !== undefined) {
            localStorage.setItem("currency", props.setting.value)
            setActiveCurrency(props.setting)
        }

    }, [props.setting, currencyFormatter])


    useEffect(() => {
        getAllService();

    }, []);

    async function getAllService() {
        await props.getSettingsByUUID("5a74a10b-3eae-43f6-b019-d0823e28ead1");
        await props.fetchServiceType();
        await props.getAllService();

    }

    function onRowSelected(event) {

    };

    function onCellClicked(event) {
        if (event.colDef.headerName == 'Edit') {
            console.log("serviceType", event.data.serviceType)
            setModalTitle("Edit Service")
            setActionType("EditService")
            setAssociatedForm(event.data.serviceType)
            setUnitCost(event.data.unitCost)
            setActiveService(event.data)
            setServiceRetire(event.data.retired)
            setServiceName(event.data.name)
            setOpenModal(true)
        }
    };

    async function saveServiceType() {
        const assetTypeForm = {
            name: serviceTypeName,
            encounterType: associatedForm.uuid
        }
        console.log("assetTypeForm", assetTypeForm)
        await props.saveServiceType(assetTypeForm);
        await props.fetchServiceType();
        resetForm()
        await createNotification("success", "Saved successfully")
      
    }

    async function saveService() {
        let serviceForm = {};
        if (actionType === 'EditService') {
            serviceForm = {
                name: serviceName,
                serviceType: activeService.serviceType.uuid,
                retired: serviceRetire,
                serviceId: activeService.serviceId,
                uuid: activeService.uuid,
                unitCost: unitCost,
                // referenceId: activeService.referenceId
            }
        }
        else {
            serviceForm = {
                name: serviceName,
                retired: false,
                serviceType: serviceTypeName,
                unitCost: unitCost,
                // referenceId: filterLabtestType(autocompleteLabtestTypeValue).value
            }
        }
        console.log("serviceForm", serviceForm)
        await props.saveService(serviceForm);
        await getAllService();
        resetForm()
        await createNotification("success", "Saved successfully")

    }

    function resetForm() {
        setServiceName('')
        setUnitCost('')
        setServiceTypeName('');
    }

    function openModall() {
        resetForm();
        setModalTitle("Create Service")
        setActionType("Service")
        setOpenModal(true);
    }
    function openModalServiceType() {
        resetForm();
        setModalTitle("Create Service Type")
        setActionType("ServiceType")
        setOpenModal(true);
    }

    function closeModal() {
        setOpenModal(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        (actionType === 'ServiceType') ? saveServiceType() : saveService();
        closeModal();
    }
    function filterLabtestType(name) {
        return labtestTypeArray.filter(data => data.label === name)[0];
    }

    //this function also need refactor.....
    function handleChange(e) {
        let value = e.target.value
        let name = e.target.name
        if (name === "serviceTypeName") {
            setServiceTypeName(value)
        } else if (name === 'unitCost') {
            setUnitCost(value)
        } else {
            setServiceName(value);
        }
    }

    function handleRetiredChecked(event) {
        setServiceRetire(event.target.checked)
    }

    function populateDropDown() {
        let array = [];
        console.log("populateDropDown ", availableServicesType)
        availableServicesType.forEach(element => {
            array.push(
                <option value={element.uuid}>{element.name}</option>
            );
        });
        setArrServiceType(array)
    }

    function onItemSelectedProp(value) {
        setAssociatedForm(value)
    }

    function onGridReady(params) {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.gridApi.sizeColumnsToFit();
        window.onresize = () => {
            this.gridApi.sizeColumnsToFit();
        }
    }

    if (props.isloading) return <Loaders />;
    return (
        <div className="row container-fluid service-main-container">
            <CardTemplate
                title="Services"
                action={
                    <>
                        <button className="service-btn btn btn-primary " onClick={() => openModall()}><i class="fas fa-plus"></i>  Create New</button>
                        <button className="service-btn btn btn-primary s-space" onClick={() => openModalServiceType()}><i class="fas fa-plus"></i> Create Type</button>
                    </>
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

            <Modal
                show={openModal}
                onHide={() => closeModal()}
                style={{ marginTop: '80px' }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleSubmit}>
                    <Modal.Body style={{ overflowY: 'auto' }} >
                        {
                            (actionType === "ServiceType") ?
                                <>
                                    <div className='form-group'>
                                        <label htmlFor='serviceTypeName' className="required">Name</label>
                                        <input
                                            type='text'
                                            className='form-control'
                                            autoComplete='off'
                                            pattern='^[a-zA-Z\s]*$'
                                            name='serviceTypeName'
                                            value={serviceTypeName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className='form-group'>
                                        <AutoSearchComplete
                                          showLable ="true"
                                            controlId="associatedForm"
                                            title="Associated Form"
                                            onItemSelectedProp={onItemSelectedProp}
                                            parentType="associatedForm"
                                            name="associatedForm"
                                            searchFor="encounterType"
                                            showAutocomplete='true'
                                        />
                                    </div>
                                </>
                                :
                                (actionType === "Service") ?
                                    <>
                                        <div className='form-group'>
                                            <label htmlFor='serviceName' className="required">Name</label>
                                            <input
                                                type='text'
                                                className='form-control'
                                                autoComplete='off'
                                                pattern='^[a-zA-Z\s]*$'
                                                name='serviceName'
                                                value={serviceName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group" id="add">
                                            <label htmlFor="serviceTypeName" className="required">Service Type</label>
                                            <select className="form-control" name="serviceTypeName"
                                                value={serviceTypeName}
                                                onChange={handleChange} required>
                                                <option></option>
                                                {arrServiceType}
                                            </select>
                                        </div>
                                        <div className='form-group'>
                                            <label htmlFor='unitCost' className="required">Unit Cost</label>
                                            <input
                                                type='number'
                                                className='form-control'
                                                autoComplete='off'
                                                pattern='^[0-9\s]*$'
                                                name='unitCost'
                                                value={unitCost}
                                                onChange={handleChange}
                                                min="1"
                                                required
                                            />
                                        </div>
                                        {/* <div className='form-group' >
                                            <AutoSearchComplete
                                                controlId="associatedTest"
                                                title="Associated Test"
                                                onItemSelectedProp={onItemSelectedProp}
                                                parentType="associatedTest"
                                                name="associatedTest"
                                                searchFor="labTestType"
                                                showAutocomplete='true'
                                            />
                                        </div> */}

                                    </>
                                    : <>
                                        <div className='form-group'>
                                            <label htmlFor='serviceName' className="required">Name</label>
                                            <input
                                                type='text'
                                                className='form-control'
                                                autoComplete='off'
                                                pattern='^[a-zA-Z\s]*$'
                                                name='serviceName'
                                                value={serviceName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className='form-group'>
                                            <label htmlFor='serviceType' className="required">Service Type</label>
                                            <input
                                                disabled
                                                type='text'
                                                className='form-control'
                                                autoComplete='off'
                                                pattern='^[0-9\s]*$'
                                                name='serviceType'
                                                value={associatedForm.name}
                                            />
                                        </div>
                                        <div className='form-group'>
                                            <label htmlFor='unitCost' className="required">Unit Cost</label>
                                            <input
                                                type='number'
                                                className='form-control'
                                                autoComplete='off'
                                                pattern='^[0-9\s]*$'
                                                name='unitCost'
                                                value={unitCost}
                                                onChange={handleChange}
                                                min="1"
                                                required
                                            />
                                        </div>
                                    </>
                        }

                    </Modal.Body>
                    <Modal.Footer>
                        {
                            (actionType === "EditService") ?
                                <div class="form-check">
                                    <input type="checkbox" class="form-check-input" id="retired" onChange={handleRetiredChecked} checked={serviceRetire} />
                                    <label class="form-check-label" for="exampleCheck1">Retired</label>
                                </div>
                                : ""
                        }
                        <Button type='submit' variant='primary'>Save
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>

        </div >
    )
}

const mapStateToProps = state => ({
    serviceList: state.service.services,
    serviceTypeList: state.service.serviceType,
    isloading: state.service.loading,
    labtesttypeList: state.labtesttype.labtestType,
    setting: state.systemSettings.systemSetting
});

const mapDispatchToProps = {
    getAllService: serviceAction.fetchServices,
    saveService: serviceAction.saveService,
    deleteService: serviceAction.deleteService,
    saveServiceType: serviceAction.saveServiceType,
    fetchServiceType: serviceAction.fetchServiceType,
    getAllLabtestType: labtesttypeAction.fetchLabTestType,
    getSettingsByUUID: systemSettingsAction.getSystemSettingsByUUID,
};

export default connect(mapStateToProps, mapDispatchToProps)(Services) 
