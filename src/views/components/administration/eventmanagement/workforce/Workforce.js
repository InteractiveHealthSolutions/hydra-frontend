import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import './workforce.css';
import { workforceAction } from '../../../../../state/ducks/workforce'
import AutoSearchComplete from '../../workflowmanagement/formbuilder/formComponents/widgets/AutoSearchComplete';
import { createNotification } from '../../../../../utilities/helpers/helper'
import { systemSettingsAction } from '../../../../../state/ducks/systemsettings'
import Loaders from '../../../common/loader/Loader';
import { AgGrid } from '../../../../ui/AgGridTable/AgGrid';
import CardTemplate from '../../../../ui/cards/SimpleCard/CardTemplate';

function Workforce(props) {

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
            headerName: "Salary", field: "salaryValue", valueFormatter: currencyFormatter
        },
        {
            headerName: "Salary Type", field: "salaryType.name"
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
       // console.log("Formater ", params.value);
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
           // console.log("salaryTypeList", props.salaryTypeList)
            setAvailableSalaryTypes(props.salaryTypeList.salaryTypes)
            if (availableSalaryTypes !== undefined)
                populateDropDown();
        }
    }, [props.salaryTypeList, availableSalaryTypes])

    useEffect(() => {
        if (props.setting !== undefined && props.setting.value !== undefined) {
           // console.log("currencyFormatter insdie", props.setting)
            localStorage.setItem("currency", props.setting.value)
            setActiveCurrency(props.setting)
        }

    }, [props.setting])


    useEffect(() => {
        getWorkforce();
    }, [])

    async function getWorkforce() {
        await props.getSettingsByUUID("5a74a10b-3eae-43f6-b019-d0823e28ead1");
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
       // console.log("populateDropDown ", availableSalaryTypes)
        availableSalaryTypes.forEach(element => {
            array.push(
                <option value={element.uuid}>{element.name}</option>
            );
        });
        setArrSalaryType(array)
    }

    function onRowSelected(event) {
       // console.log('onRowSelected: ' + event.node.data);
    };

    function onCellClicked(event) {
        if (event.colDef.headerName == 'Edit') {
          //  console.log("event data", event.data)
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
        <>
            <CardTemplate
                title="Personnel"
                action={
                    <button className="workforce-btn btn btn-primary " onClick={() => openModall()}><i class="fas fa-plus"></i>  Create New</button>
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
                                    showLable ="true"
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
                                min="1"
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
        </>
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
