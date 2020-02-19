import React, { useState, useEffect } from 'react';
import { AgGridReact } from '@ag-grid-community/react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import './workforce.css';
import { workforceAction } from '../../../../../state/ducks/workforce'
import AutoSearchComplete from '../../workflowmanagement/formbuilder/formComponents/widgets/AutoSearchComplete';
import { createNotification } from '../../../../../utilities/helpers/helper'
import { systemSettingsAction } from '../../../../../state/ducks/systemsettings'
import Loaders from '../../../loader/Loader';
function Workforce(props) {

    const [columnDefs, setColumnDefs] = useState([
        {
            headerName: "Name", field: "display", width: 465
        },
        {
            headerName: "Salary", field: "salaryValue", width: 300, valueFormatter: currencyFormatter
        },
        {
            headerName: "Salary Type", field: "salaryType.name", width: 300
        },
        {
            headerName: "Edit",
            template:
                `
                  <button class ="edite" className="btn-edite"><i class="fas fa-pencil-alt"></i></button>
                `
            , width: 80
        },
        {
            headerName: "Status", field: "retired", valueFormatter: statusFormatter, width: 80
        },
    ]);
    const [rowData, setRowData] = useState([]);
    const [workforceName, setworkforceName] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [actionType, setActionType] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [activeWorkforce, setActiveWorkforce] = useState({});
    const [workforceRetire, setWorkforceRetire] = useState(false);
    const [salaryValue, setSalaryValue] = useState('');
    const [salaryType, setSalaryType] = useState('');
    const [arrSalaryType, setArrSalaryType] = useState([]);
    const [availableSalaryTypes, setAvailableSalaryTypes] = useState([]);
    const [userName, setuserName] = useState("");
    const [userUuid, setUserUuid] = useState("")
    const [activeCurrency, setActiveCurrency] = useState({})

    function statusFormatter(params) {
        console.log("Formater ", params.value);
        return params.value === false ? 'Active' : 'Retired';
    }
    function currencyFormatter(params) {
        return params.value !== null ? localStorage.getItem('currency') + " " + params.value : ""
    }


    useEffect(() => {
        if (props.workforceList !== undefined) {
            setRowData(props.workforceList.participants)
        }

    }, [props.workforceList])

    useEffect(() => {
        if (props.salaryTypeList !== undefined) {
            console.log("salaryTypeList", props.salaryTypeList)
            setAvailableSalaryTypes(props.salaryTypeList.salaryTypes)
            if (availableSalaryTypes !== undefined)
                populateDropDown();
        }
    }, [props.salaryTypeList, availableSalaryTypes])

    useEffect(() => {
        if (props.setting !== undefined && props.setting.value !== undefined) {
            console.log("currencyFormatter insdie", props.setting.value)
            localStorage.setItem("currency", props.setting.value)
            setActiveCurrency(props.setting)
        }

    }, [props.setting, currencyFormatter])


    useEffect(() => {
        getWorkforce();
    }, [])

    async function getWorkforce() {
        await props.getAllworkforce();
        await props.getSalaryType();
    }

    async function saveWorkforces() {
        let form = {}
        if (actionType === 'EditType') {
            form = {
                name: workforceName,
                participantId: activeWorkforce.participantId,
                uuid: activeWorkforce.uuid,
                retired: workforceRetire,
                salaryValue: salaryValue,
                salaryType: salaryType
            }
        } else {
            form = {
                name: workforceName,
                salaryValue: salaryValue,
                salaryType: salaryType,
                user: userUuid
            }
        }
        if (userUuid === "" && workforceName === "") {
            createNotification("warning", "Workforce should not be empty.")
        } else {
            closeModal();
            await props.saveworkforce(form)
            await props.getAllworkforce();
            createNotification("success", "Saved successfully")
            setworkforceName('')
        }
    }

    function populateDropDown() {
        let array = [];
        console.log("populateDropDown ", availableSalaryTypes)
        availableSalaryTypes.forEach(element => {
            array.push(
                <option value={element.uuid}>{element.name}</option>
            );
        });
        setArrSalaryType(array)
    }

    function onRowSelected(event) {
        console.log('onRowSelected: ' + event.node.data);
    };

    function onCellClicked(event) {
        if (event.colDef.headerName == 'Edit') {
            console.log("event data", event.data)
            setActionType('EditType')
            setModalTitle('Edit Workforce')
            setworkforceName(event.data.name)
            setWorkforceRetire(event.data.retired)
            setSalaryValue(event.data.salaryValue)
            setSalaryType(event.data.salaryType.uuid)
            setActiveWorkforce(event.data)
            // setworkforceName(event.data.user.person.display)
            // setUserUuid(event.data.user.uuid)
            setOpenModal(true)
        }
    };


    async function handleSubmit(e) {
        e.preventDefault();
        saveWorkforces();
    }
    function handleChange(e) {
        let value = e.target.value;
        let name = e.target.name;
        if (name === 'salaryValue') {
            setSalaryValue(value)
        } else if (name === 'salaryType') {
            setSalaryType(value);
        }
        else {
            setworkforceName(value)
        }
    }

    function openModall() {
        setModalTitle('Create Personnel')
        setActionType('CreateType')
        resetForm()
        setOpenModal(true);
    }
    function closeModal() {
        setOpenModal(false);
    }

    function handleRetiredChecked(event) {
        setWorkforceRetire(event.target.checked)
    }

    function onItemSelectedProp(workforce) {
        setworkforceName(workforce.value)
        setUserUuid(workforce.uuid)
    }

    function resetForm() {
        setworkforceName("")
        setSalaryType("")
        setSalaryValue("")
    }
    if (props.isloading) return <Loaders />;
    return (
        <div className="row container-fluid l-main-container">

            <div className="card fp-header">
                <div className="card-header">
                    <div className="row">
                        <div className="col-md-8 col-sm-4">
                            <span className="text-muted">Personnel</span>
                        </div>
                        <div className="col-md-4 col-sm-2">
                            <button className="workforce-btn btn btn-primary " onClick={() => openModall()}><i class="fas fa-plus"></i>  Create New</button>
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
                        <div className='form-group'>
                            {/* <label htmlFor='workforceName'>Name</label>
                            <input
                                type='text'
                                className='form-control'
                                autoComplete='off'
                                pattern='^[a-zA-Z\s]*$'
                                name='workforceName'
                                value={workforceName}
                                onChange={handleChange}
                                required 
                            />
                            */}
                            {
                                (actionType === 'EditType') ?
                                    <>
                                        <label htmlFor='workforceName' className="required">Name</label>
                                        <input
                                            type='text'
                                            className='form-control'
                                            autoComplete='off'
                                            pattern='^[a-zA-Z\s]*$'
                                            name='workforceName'
                                            value={workforceName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </>
                                    :
                                    <AutoSearchComplete
                                        controlId="workforceName"
                                        title="Name"
                                        onItemSelectedProp={onItemSelectedProp}
                                        parentType="workforce"
                                        name="workforceName"
                                        searchFor="Workforce"
                                        showAutocomplete="true"
                                        isRequired="true"
                                    />
                            }

                        </div>
                        <div className="form-group" id="add">
                            <label htmlFor="salaryType" className="required">Salary Type</label>
                            <select className="form-control"
                                name="salaryType"
                                value={salaryType}
                                onChange={handleChange}
                                required>
                                <option></option>
                                {arrSalaryType}
                            </select>
                        </div>
                        <div className='form-group'>
                            <label htmlFor='salaryValue' className="required">Salary</label>
                            <input
                                type='number'
                                className='form-control'
                                autoComplete='off'
                                pattern='^[0-9\s]*$'
                                name='salaryValue'
                                value={salaryValue}
                                onChange={handleChange}
                                required
                            />
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        {
                            (actionType === "EditType") ?
                                <div class="form-check">
                                    <input type="checkbox" class="form-check-input" id="retired" onChange={handleRetiredChecked} checked={workforceRetire} />
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
    workforceList: state.workforce.workforces,
    salaryTypeList: state.workforce.salaryType,
    isloading: state.workforce.loading,
    setting: state.systemSettings.systemSetting
});

const mapDispatchToProps = {
    getAllworkforce: workforceAction.fetchParticipant,
    saveworkforce: workforceAction.saveParticipant,
    getSalaryType: workforceAction.fetchParticipantSalaryType,
    getSettingsByUUID: systemSettingsAction.getSystemSettingsByUUID,
};

export default connect(mapStateToProps, mapDispatchToProps)(Workforce) 
