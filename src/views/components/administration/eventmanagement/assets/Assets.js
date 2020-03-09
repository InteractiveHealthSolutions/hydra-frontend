import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import './asset.css';
import { assetAction } from '../../../../../state/ducks/assets'
import { createNotification } from '../../../../../utilities/helpers/helper'
import { systemSettingsAction } from '../../../../../state/ducks/systemsettings'
import Loaders from '../../../common/loader/Loader';
import { AgGrid } from '../../../../ui/AgGridTable/AgGrid';
import CardTemplate from '../../../../ui/cards/SimpleCard/CardTemplate';

function Assets(props) {

    const [columnDefs, setColumnDefs] = useState([
        {
            headerName: "Name", field: "display",
            icons: {
                menu: '<i class="fas fa-search"></i>',
                filter: '<i class="fa fa-long-arrow-alt-up"/>',
                columns: '<i class="fa fa-snowflake"/>',
                sortAscending: '<i class="fa fa-sort-alpha-up"/>',
                sortDescending: '<i class="fa fa-sort-alpha-down"/>'
            }
        },
        {
            headerName: "Asset Type", field: "assetType.name"
        },
        {
            headerName: "Capital Cost", field: "capitalValue", valueFormatter: currencyFormatter
        },
        {
            headerName: "Reference Id", field: "referenceId"
        },
        {
            headerName: "Fixed Asset", field: "fixedAsset"
        },
        {
            headerName: "Edit",
            template:
                `
                  <button class ="edite" className="btn-edite"><i class="fas fa-pencil-alt"></i></button>
                `

        },
        {
            headerName: "Status", field: "retired", valueFormatter: statusFormatter
        },
    ]);
    const [rowData, setRowData] = useState([]);
    const [assetName, setAssetName] = useState('');
    const [assetRetire, setAssetRetire] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [assetTypeName, setAssetTypeName] = useState('');
    const [isAssetType, setIsAssetType] = useState(false);
    const [actionType, setActionType] = useState('');
    const [activeAsset, setActiveAssets] = useState({});
    const [availableAssetType, setAvailableAssetType] = useState([]);
    const [availableAssetCategory, setAvailableAssetCategory] = useState([]);
    const [arrAssetType, setArrAssetType] = useState([]);
    const [capitalValue, setCapitalValue] = useState([]);
    const [assetCategoryName, setAssetCategoryName] = useState('');
    const [arrAssetCategory, setArrAssetCategory] = useState([]);
    const [fixedAsset, setFixedAsset] = useState(false);
    const [referenceId, setReferenceId] = useState('');
    const [dateProcured, setDateProcured] = useState('2020-01-16');
    const [activeCurrency, setActiveCurrency] = useState({})

    function statusFormatter(params) {
        console.log("Formater ", params.value);
        return params.value === false ? 'Active' : 'Retired';
    }

    function currencyFormatter(params) {
        return params.value !== null ? localStorage.getItem('currency') + " " + params.value : ""
    }


    useEffect(() => {
        console.log("assets List ::", props.assetList)
        if (props.assetList !== undefined) {
            setRowData(props.assetList.assets)
        }
    }, [props.assetList])

    useEffect(() => {

        if (props.assetTypeList !== undefined) {
            setAvailableAssetType(props.assetTypeList.assetTypes);
            if (availableAssetType !== undefined)
                populateDropDown();
        }


    }, [props.assetTypeList, availableAssetType])

    useEffect(() => {
        if (props.assetCategoryList !== undefined) {
            setAvailableAssetCategory(props.assetCategoryList.services);
            if (availableAssetCategory !== undefined)
                populateCategoryDropDown();
        }
    }, [props.assetCategoryList, availableAssetCategory])

    useEffect(() => {
        if (props.setting !== undefined && props.setting.value !== undefined) {
            console.log("currencyFormatter insdie", props.setting.value)
            localStorage.setItem("currency", props.setting.value)
            setActiveCurrency(props.setting)
        }

    }, [props.setting, currencyFormatter])


    useEffect(() => {
        getAllAsset();

    }, []);

    async function getAllAsset() {
        await props.getSettingsByUUID("5a74a10b-3eae-43f6-b019-d0823e28ead1");
        await props.getAllAsset();
        await props.getAllAssetType();
        await props.getAllAssetCategory();
    }

    async function saveAssets(assetForm) {
        console.log("assetForm", assetForm);
        await props.saveAsset(assetForm);
        await props.getAllAsset();
        createNotification("success", "Saved successfully")
        setAssetName('')
    }

    async function saveAssetType() {
        const assetTypeForm = {
            name: assetTypeName,
            assetCategory: assetCategoryName
        }
        console.log("assetTypeForm", assetTypeForm);
        await props.saveAssetType(assetTypeForm);
        await props.getAllAssetType();
        createNotification("success", "Saved successfully")
        setAssetTypeName('')
    }


    async function saveAssetCategory() {
        const assetCategoryForm = {
            name: assetCategoryName,
        }
        console.log("assetCategoryForm", assetCategoryForm);
        await props.saveAssetCategory(assetCategoryForm);
        await props.getAllAssetCategory();
        createNotification("success", "Saved successfully")
        setAssetCategoryName('')
    }


    async function handleSubmit(e) {
        e.preventDefault();
        let assetForm = {}
        if (actionType === 'EditAsset') {
            assetForm = {
                name: assetName,
                retired: assetRetire,
                uuid: activeAsset.uuid,
                assetId: activeAsset.assetId,
                assetType: assetTypeName,
                capitalValue: capitalValue,
                dateProcured: dateProcured,
                fixedAsset: fixedAsset,
                referenceId: referenceId
            }
        } else if (actionType === 'AssetsCategory') {
            saveAssetCategory()
        }
        else {
            assetForm = {
                name: assetName,
                retired: assetRetire,
                assetType: assetTypeName,
                capitalValue: capitalValue,
                dateProcured: dateProcured,
                fixedAsset: fixedAsset,
                referenceId: referenceId
            }
        }
        console.log("assetForm", assetForm)
        isAssetType ? saveAssetType() : saveAssets(assetForm);
        closeModal();
    }

    //
    function handleChange(e) {
        let name = e.target.name
        let value = e.target.value
        if (name === 'assetTypeName') {
            setAssetTypeName(value)
        } else if (name === 'assetName') {
            setAssetName(value);
        } else if (name === 'assetCategoryName') {
            setAssetCategoryName(value)
        }
        else if (name === 'capitalValue') {
            setCapitalValue(value)
        }
        else if (name === 'fixedAsset') {
            setFixedAsset(e.target.checked)
        }
        else if (name === 'referenceId') {
            setReferenceId(value)
        }
    }

    function onCellClicked(event) {

        if (event.colDef.headerName == 'Edit') {
            console.log("assetType", event.data.assetType ? event.data.assetType.name : "")
            setModalTitle("Edit Asset")
            setActionType('EditAsset')
            setActiveAssets(event.data)
            setAssetRetire(event.data.retired)
            setAssetName(event.data.name)
            setAssetTypeName(event.data.assetType ? event.data.assetType.name : "")
            setCapitalValue(event.data.capitalValue)
            setReferenceId(event.data.referenceId)
            setFixedAsset(event.data.fixedAsset)
            setIsAssetType(false)
            setOpenModal(true)
        }

    };

    function handleRetiredChecked(event) {
        setAssetRetire(event.target.checked)
    }
    function openModall() {
        resetForm();
        setModalTitle('Create Asset')
        setActionType("AssetsCreate")
        setIsAssetType(false)
        setOpenModal(true);
    }
    function openModalType() {
        resetForm();
        setAssetTypeName('')
        setModalTitle('Create Asset Type')
        setActionType("AssetsType")
        setIsAssetType(true)
        setOpenModal(true);
    }
    function openModalCategory() {
        resetForm();
        setModalTitle('Create Asset Category')
        setActionType("AssetsCategory")
        setIsAssetType(false)
        setOpenModal(true);
    }


    function closeModal() {
        setOpenModal(false);
    }

    function resetForm() {
        setAssetName("")
        setAssetTypeName('')
        setAssetCategoryName('')
        setReferenceId('');
        setCapitalValue('');
        setFixedAsset('');

    }

    function populateDropDown() {
        let array = [];
        console.log("populateDropDown ", availableAssetType)
        availableAssetType.forEach(element => {
            array.push(
                <option value={element.uuid}>{element.name}</option>
            );
        });

        setArrAssetType(array)
    }

    function populateCategoryDropDown() {
        let array = [];
        console.log("populateDropDown ", availableAssetCategory)
        availableAssetCategory.forEach(element => {
            array.push(
                <option value={element.uuid}>{element.name}</option>
            );
        });

        setArrAssetCategory(array)
    }

    function onGridReady(params) {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.gridApi.sizeColumnsToFit();
        window.onresize = () => {
            this.gridApi.sizeColumnsToFit();
        }
    }

    function onRowSelected() { }


    if (props.isloading) return <Loaders />;
    var optDisabled = {}; if (actionType === "EditAsset") { optDisabled['disabled'] = 'disabled'; }
    var optChecked = {}; if (fixedAsset === true) { optChecked['checked'] = 'checked' }
    return (
        <div className="row assets-main-container container-fluid ">
            <CardTemplate
                title="Assets"
                action={
                    <>
                        <button className="service-btn btn btn-primary " onClick={() => openModall()}><i class="fas fa-plus"></i>  Create New</button>
                        <button className="service-btn btn btn-primary s-space" onClick={() => openModalType()}><i class="fas fa-plus"></i> Create Type</button>
                        <button className="service-btn btn btn-primary s-space" onClick={() => openModalCategory()}><i class="fas fa-plus"></i> Create Category</button>
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
                style={{ marginTop: '50px' }}
            >
                <Modal.Header closeButton>
                    <Modal.Title >{modalTitle}</Modal.Title>
                </Modal.Header>
                <form className="needs-validation" onSubmit={handleSubmit}>
                    <Modal.Body className={(actionType === 'AssetsCreate') ? 'modal-body-adjust' : ""}>
                        {
                            (isAssetType) ?
                                <>
                                    <div className='form-group'>
                                        <label htmlFor='assetTypeName' className="required">Name</label>
                                        <input
                                            type='text'
                                            className='form-control'
                                            autoComplete='off'
                                            name='assetTypeName'
                                            value={assetTypeName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group" id="add">
                                        <label htmlFor="assetCategoryName" className="required">Asset Category</label>
                                        <select className="form-control" name="assetCategoryName" value={assetCategoryName} onChange={handleChange} required>
                                            <option> </option>
                                            {arrAssetCategory}
                                        </select>
                                    </div>
                                </>

                                : (actionType === 'AssetsCategory') ?
                                    <div className='form-group'>
                                        <label htmlFor='assetCategoryName' className="required">Name</label>
                                        <input
                                            type='text'
                                            className='form-control'
                                            autoComplete='off'
                                            name='assetCategoryName'
                                            value={assetCategoryName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    :
                                    <>
                                        <div className='form-group'>
                                            <label htmlFor='assetName' className="required">Name</label>
                                            <input
                                                type='text'
                                                className='form-control'
                                                autoComplete='off'
                                                name="assetName"
                                                value={assetName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group" id="add">
                                            <label htmlFor="assetTypeName" className="required">Asset Type</label>
                                            <select {...optDisabled} className="form-control" name="assetTypeName" value={assetTypeName} onChange={handleChange} required>
                                                {(actionType === 'EditAsset') ? <option>{assetTypeName} </option> : <><option></option> { arrAssetType }</>}
                                            </select>

                                        </div>
                                        <div className='form-group'>
                                            <label htmlFor='capitalValue' className="required">Capital Cost</label>
                                            <input
                                                type='number'
                                                className='form-control'
                                                autoComplete='off'
                                                pattern='^[0-9\s]*$'
                                                name="capitalValue"
                                                value={capitalValue}
                                                onChange={handleChange}
                                                min="0"
                                                required
                                            />
                                        </div>
                                        <div className='form-group'>
                                            <label htmlFor='referenceId' className="">Reference Id</label>
                                            <input
                                                type='text'
                                                className='form-control'
                                                autoComplete='off'
                                                name="referenceId"
                                                value={referenceId}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className='form-group'>
                                            <label htmlFor='fixedAsset' className="">Fixed Asset</label>
                                            <input
                                                {...optChecked}
                                                style={{ marginLeft: '30px' }}
                                                type='checkbox'
                                                className='form-check-input'
                                                name="fixedAsset"
                                                value={fixedAsset}
                                                onChange={handleChange}
                                            />
                                        </div>

                                    </>
                        }

                    </Modal.Body>
                    <Modal.Footer>
                        {
                            (actionType === "EditAsset") ?
                                <div class="form-check">
                                    <input type="checkbox" class="form-check-input" id="retired" onChange={handleRetiredChecked} checked={assetRetire} />
                                    <label class="form-check-label" for="exampleCheck1">Retired</label>
                                </div>
                                : ""
                        }
                        <Button type='submit' variant='primary'>Save
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
    )
}

const mapStateToProps = state => ({
    assetList: state.asset.assets,
    assetTypeList: state.asset.assetType,
    assetCategoryList: state.asset.assetCategory,
    isloading: state.asset.loading,
    setting: state.systemSettings.systemSetting
});

const mapDispatchToProps = {
    getAllAsset: assetAction.fetchAssets,
    saveAsset: assetAction.saveAsset,
    deleteAsset: assetAction.deleteAsset,
    saveAssetType: assetAction.saveAssetType,
    getAllAssetType: assetAction.fetchAssetTypes,
    saveAssetCategory: assetAction.saveAssetCategory,
    getAllAssetCategory: assetAction.fetchAssetCategory,
    getSettingsByUUID: systemSettingsAction.getSystemSettingsByUUID,
};

export default connect(mapStateToProps, mapDispatchToProps)(Assets) 
