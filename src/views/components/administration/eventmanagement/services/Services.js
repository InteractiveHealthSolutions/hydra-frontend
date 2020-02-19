import React, { useState, useEffect } from 'react';
import { AgGridReact } from '@ag-grid-community/react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import './services.css';
import { serviceAction } from '../../../../../state/ducks/service'
import { encounterAction } from '../../../../../state/ducks/encounter'
import { labtesttypeAction } from '../../../../../state/ducks/labtesttype'
import Loaders from '../../../loader/Loader';
import Autocomplete from "react-autocomplete";
import { createNotification } from '../../../../../utilities/helpers/helper'
 //proper validation is required ...
function Services(props) {

    const [columnDefs, setColumnDefs] = useState([
        {
            headerName: "Name", field: "name", editable: true, width: 320, 
        },
        {
            headerName: "Service Type", field: "serviceType.name", width: 320
        },
        {
            headerName: "Unit Cost", field: "unitCost", width: 320, valueFormatter: currencyFormatter
        },
        {
            headerName: "Edit",
            template:
                `
                  <button className="btn-edite"><i class="fas fa-pencil-alt"></i></button>
                `
            , width: 80
        },
        {
            headerName: "Status", field: "retired", valueFormatter: statusFormatter, width: 80
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
    const [encounterTypeArray, setencounterTypeArray] = useState([])
    const [arrServiceType, setArrServiceType] = useState([]);
    const [unitCost, setUnitCost] = useState('');
    const [serviceCategoryName, setServiceCategoryName] = useState('')
    const [arrServiceCategories, setArrServiceCategories] = useState([])
    const [autocompleteValue, setAutocompleteValue] = useState("")
    const [availableLabtestType, setAvailableLabtestType] = useState([])
    const [labtestTypeArray, setLabtestTypeArray] = useState([])
    const [autocompleteLabtestTypeValue, setAutocompleteLabtestTypeValue] = useState("")


    function statusFormatter(params) {
        console.log("Formater ", params.value);
        return params.value === false ? 'Active' : 'Retired';
    }

    function currencyFormatter(params) {
        return params.value !== null ? "$ " + params.value : ""
    }


    useEffect(() => {
        //console.log("serviceList ::", props.serviceList)
        if (props.serviceList !== undefined) {
            setRowData(props.serviceList.services)
        }

    }, [props.serviceList])

    useEffect(() => {

        if (props.serviceTypeList !== undefined) {
            setAvailableServicesType(props.serviceTypeList.serviceTypes);
            if (availableServicesType !== undefined)
                populateDropDown();
        }

    }, [props.serviceTypeList, availableServicesType])

    useEffect(() => {
        if (props.encounterTypeList !== undefined) {
            setAvailableEncounterType(props.encounterTypeList.results);
            if (availableEncounterType !== undefined)
                autoCompleteFormat();
        }

    }, [props.encounterTypeList, availableEncounterType])

    useEffect(() => {
        if (props.labtesttypeList !== undefined) {
            setAvailableLabtestType(props.labtesttypeList.results);
            if (availableLabtestType !== undefined)
                autoCompleteLabTestTypeFormat();
        }

    }, [props.labtesttypeList, availableLabtestType])

    useEffect(() => {
        getAllService();

    }, []);

    async function getAllService() {
        await props.getAllService();
        await props.fetchServiceType();
        await props.getAllEncounterType();
        await props.getAllLabtestType();
    }

    function onRowSelected(event) {
        console.log('onRowSelected: ' + event.node.data);
    };

    function onCellClicked(event) {
        if (event.colDef.headerName == 'Edit') {
            setModalTitle("Edit Service")
            setActionType("EditService")
            setActiveService(event.data)
            setServiceRetire(event.data.retired)
            setServiceName(event.data.name)
            setOpenModal(true)
        }
        // } else if (event.colDef.headerName == 'delete') {
        //     deleteService(event.data);
        // }
    };
   
    async function saveServiceType() {
        let getEnType = await filterEncounterType(autocompleteValue)
        if (getEnType) {
            const assetTypeForm = {
                name: serviceTypeName,
                encounterType: getEnType.value
            }
            await props.saveServiceType(assetTypeForm);
            await props.fetchServiceType();
            setServiceTypeName('')
        } else {
            createNotification("warning", "Encounter Type should not be empty")
        }

    }

    function resetForm() {
        setServiceName('');
        setServiceTypeName('');
        setServiceCategoryName('');
    }

    async function saveService(service) {
        console.log("service", service);
        await props.saveService(service);
        await props.getAllService();
        setServiceName('')
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
    function openModalServiceCategory() {
        resetForm();
        setModalTitle("Create Service Category")
        setActionType("ServiceCategory")
        setOpenModal(true)
    }

    function closeModal() {
        setOpenModal(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        let serviceForm = {};
        if (actionType === 'EditService') {
            serviceForm = {
                name: serviceName,
                serviceType: activeService.serviceType.uuid,
                retired: serviceRetire,
                serviceId: activeService.serviceId,
                uuid: activeService.uuid,
                unitCost: activeService.unitCost,
                referenceId: activeService.referenceId
            }
        }
        else if (actionType !== 'ServiceType') {
            serviceForm = {
                name: serviceName,
                retired: false,
                serviceType: serviceTypeName,
                unitCost: unitCost,
                referenceId: filterLabtestType(autocompleteLabtestTypeValue).value
            }
        }
        (actionType === 'ServiceType') ? saveServiceType() : saveService(serviceForm);
        closeModal();
    }
    function filterEncounterType(name) {
        return encounterTypeArray.filter(data => data.label === name)[0];
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
        } else if (name === 'serviceCategoryName') {
            setServiceCategoryName(value)
        } else {
            setServiceName(value);
        }
    }

    function handleRetiredChecked(event) {
        setServiceRetire(event.target.checked)
    }
    function autoCompleteFormat() {
        let array = [];
        availableEncounterType.forEach(element => {
            array.push({
                label: element.display,
                value: element.uuid
            }
            );
        });
        setencounterTypeArray(array)
    }

    function autoCompleteLabTestTypeFormat() {
        let array = [];
        availableLabtestType.forEach(element => {
            array.push({
                label: element.name,
                value: element.uuid
            }
            );
        });
        setLabtestTypeArray(array)
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

    function autoInput(props) {
        return <input
            {...props}
            type='text'
            className='form-control'
            style={{ width: '467px' }}
            onChange={(e) => { console.log("auto value ", e.target.value); }}
        />
    }

    if (props.isloading) return <Loaders />;
    return (
        <div className="row container-fluid service-main-container">
            <div className="card fp-header">
                <div className="card-header">
                    <div className="row">
                        <div className="col-md-6 col-sm-4">
                            <span className="text-muted">Services</span>
                        </div>
                        <div className="col-md-6 col-sm-2">
                            <button className="service-btn btn btn-primary " onClick={() => openModall()}><i class="fas fa-plus"></i>  Create New</button>
                            <button className="service-btn btn btn-primary s-space" onClick={() => openModalServiceType()}><i class="fas fa-plus"></i> Create Type</button>
                            {/* <button className="service-btn btn btn-primary s-space" onClick={() => openModalServiceCategory()}><i class="fas fa-plus"></i> Create Category</button> */}
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

            <Modal
                show={openModal}
                onHide={() => closeModal()}
                style={{ marginTop: '100px' }}
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
                                        <label htmlFor='serviceTypeName' className="required">Name Type</label>
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
                                        <label htmlFor='serviceTypeName' className="required">Encounter Type</label>
                                        <Autocomplete
                                            getItemValue={(item) => item.label}
                                            items={encounterTypeArray}
                                            renderInput={autoInput}
                                            renderItem={(item, isHighlighted) =>
                                                <div style={{
                                                    background: isHighlighted ? 'rgb(66, 88, 208)' : 'white',
                                                    color: isHighlighted ? 'white' : 'black'
                                                    , padding: '10px'
                                                }}>
                                                    {item.label}
                                                </div>
                                            }
                                            value={autocompleteValue}
                                            onChange={(e) => { }}
                                            onSelect={(val) => { setAutocompleteValue(val) }}
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
                                                required
                                            />
                                        </div>
                                        <div className='form-group'>
                                            <label htmlFor='labtesttype' className="required">Lab Test Type</label>
                                            <Autocomplete
                                                getItemValue={(item) => item.label}
                                                items={labtestTypeArray}
                                                renderInput={autoInput}
                                                renderItem={(item, isHighlighted) =>
                                                    <div style={{
                                                        background: isHighlighted ? 'rgb(66, 88, 208)' : 'white',
                                                        color: isHighlighted ? 'white' : 'black'
                                                        , padding: '10px'
                                                    }}>
                                                        {item.label}
                                                    </div>
                                                }
                                                value={autocompleteLabtestTypeValue}
                                                onChange={(e) => { }}
                                                onSelect={(val) => { setAutocompleteLabtestTypeValue(val) }}
                                            />
                                        </div>

                                    </>
                                    : <div className='form-group'>
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
    encounterTypeList: state.encounter.encounterType,
    labtesttypeList: state.labtesttype.labtestType
});

const mapDispatchToProps = {
    getAllService: serviceAction.fetchServices,
    saveService: serviceAction.saveService,
    deleteService: serviceAction.deleteService,
    saveServiceType: serviceAction.saveServiceType,
    fetchServiceType: serviceAction.fetchServiceType,
    getAllEncounterType: encounterAction.fetchEncounterType,
    getAllLabtestType: labtesttypeAction.fetchLabTestType
};

export default connect(mapStateToProps, mapDispatchToProps)(Services) 
