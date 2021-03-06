import React, { Component } from 'react';
import '../../../style/main.css';
import './eventclosure.css';
import DatePicker from "react-datepicker";
import Select from 'react-select';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { history } from '../../../../history';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import moment from 'moment'
import makeAnimated from 'react-select/animated';
import { EventSideBackButton } from '../../common/sidebutton/SideBackButton'
import { eventAction } from '../../../../state/ducks/event';
import { assetAction } from '../../../../state/ducks/assets';
import { serviceAction } from '../../../../state/ducks/service';
import { workforceAction } from '../../../../state/ducks/workforce';
import { locationAction } from '../../../../state/ducks/location';
import { connect } from 'react-redux'
import { AgGridReact } from '@ag-grid-community/react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
import { systemSettingsAction } from '../../../../state/ducks/systemsettings'
import CardTemplate from '../../../ui/cards/SimpleCard/CardTemplate'
import { AgGrid } from '../../../ui/AgGridTable/AgGrid';

const animatedComponents = makeAnimated();

// need to separate in component while refactoring ...
class EventClosureForm extends Component {

    constructor(props) {
        super(props)

        this.state = {
            eventType: "",
            eventName: "",
            description: "",
            startDate: "",
            endDate: "",
            locationType: "",
            locationName: "",
            location: "",
            formErrors: {
                eventType: "",
                eventName: "",
                description: "",
                startDate: "",
                endDate: "",
                locationType: "",
                locationName: ""
            },
            calenderDate: new Date(),

            data: [
                {
                    service: 'Service one',
                    cost: '$ 12'
                },
                {
                    service: 'Service two',
                    cost: '$ 15'
                },
                {
                    service: 'Service three',
                    cost: '$ 16'
                },
            ],
            columns: [
                { title: 'Service Name', field: 'service' },
                { title: 'Service Cost', field: 'cost' }
            ],
            activeEvent: JSON.parse(localStorage.getItem('active-event')),
            eventTypeOption: '',
            locationTypeOption: '',
            defaultEventType: "",
            serviceList: [],
            personalList: [],
            availableEventType: [],
            eventTypeData: [],
            locationData: [],
            availableLocation: [],
            personaldata: [],
            availableWorkforce: [],
            columnDefs: [
                {
                    headerName: "Name", field: "service.name"
                },
                {
                    headerName: "Unit Cost", field: "service.unitCost", valueFormatter: this.currencyFormatter
                },
                {
                    headerName: "Delete",
                    template:
                        `
                    <button className="btn-edite"><i class="fas fa-trash-alt"></i></button>
                    `,
                    width: 90
                },
            ],
            columnAssetDefs: [
                {
                    headerName: "Name", field: "asset.name"
                },
                {
                    headerName: "Type", field: "asset.assetType.name"
                  
                },
                {
                    headerName: "Category", field: "asset.assetType.assetCategory.name"
                   
                },
                {
                    headerName: "Unit Cost", field: "asset.capitalValue", editable: this.editUnitCost, valueFormatter: this.currencyFormatter
                    
                },
                {
                    headerName: "Quantity", field: "quantity", editable: this.editUnitCost

                }
            ],
            rowData: [],
            rowAssetData: [],
            assets: [],
            assetItemlist: [],
            assetItem: [],
            availableAssets: [],
            availableService: [],
            calenderDate: new Date(),
            eventTypeOption: "",
            eventList: [],
            eventFixedAsset: [],
            removeServiceList: [],
            closureNote: '',
            defaultPersonalList: [],
            alreadyRemove: []
        };
    }

    currencyFormatter(params) {
        return params.value !== null ? localStorage.getItem('currency') + " " + params.value : ""
    }
    editUnitCost(params) {
        return (params.data.asset.fixedAsset) ? true : true
    }
    myCellRenderer(params) {
        return (params.data.asset !== undefined && params.data.asset.fixedAsset) ? "" : `<input type="number" class="form-control assets_quantity" onChange ="handleAsset($event)"></input>`;
    }
    handleAsset = (date) => {
        console.log("date date ::", date);
    }
    async componentWillMount() {
        this.setActiveEventValues(this.state.activeEvent)
        this.props.getSettingsByUUID("5a74a10b-3eae-43f6-b019-d0823e28ead1");
        this.props.getAllAssetCategory();
        this.props.getAllService();
        this.props.getAllPersonnel();
        this.props.getAllLocation();
        this.props.getAllEventType();
    }

    async componentWillReceiveProps(nextProps) {

        if (nextProps.eventTypeList !== undefined) {
            await this.setState({
                availableEventType: nextProps.eventTypeList.eventTypes
            })

            if (this.state.availableEventType) {
                this.eventTypeListFormat();
            }
        }

        if (nextProps.locationList !== undefined) {
            let filterLocationtag = await this.filterLocation(nextProps.locationList.results)
            await this.setState({
                availableLocation: filterLocationtag
            })
            if (this.state.availableLocation) {
                this.locationListFormat();
            }
        }
        if (nextProps.personalList !== undefined && nextProps.personalList.participants !== undefined) {
            let filterRetiredWorkforce = await nextProps.personalList.participants.filter(data => data.retired !== true)
            await this.setState({
                availableWorkforce: filterRetiredWorkforce
            })
            if (this.state.availableWorkforce)
                this.personalListFormat();
        }

        if (this.props.setting !== undefined && this.props.setting.value !== undefined) {
            localStorage.setItem("currency", this.props.setting.value)
        }

    }


    async filterLocation(list) {
        let array = []
        if (list) {
            await list.forEach(element => {
                if (element.tags) {
                    if (this.filterLocationByTag(element.tags).length > 0) {
                        array.push(element)
                    }
                }
            });
        }
        return array
    }

    filterLocationByTag(list) {
        let array = []
        let valid = true;
        if (list) {
            for (let index = 0; index < list.length; index++) {
                if (list[index].name === "Country" || list[index].name === "City/Village" || list[index].name === "Province/State") {
                    valid = false
                    break;
                }
            }
            if (valid) {
                return list
            }
        }
        return array
    }



    personalListFormat = () => {
        let array = []
        this.state.availableWorkforce.forEach(data => {
            array.push(
                {
                    label: data.name,
                    value: data.uuid
                }
            )
        })
        this.setState({
            personaldata: array
        })
    }

    eventTypeListFormat = () => {
        let array = []
        this.state.availableEventType.forEach(data => {
            array.push(
                {
                    label: data.name,
                    value: data.uuid
                }
            )
        })
        this.setState({
            eventTypeData: array
        })
    }

    locationListFormat = () => {
        let array = []
        this.state.availableLocation.forEach(data => {
            array.push(
                {
                    label: data.name,
                    value: data.uuid
                }
            )
        })
        this.setState({
            locationData: array
        })
    }

    deleteServices = (service) => {
        confirmAlert({
            title: 'Confirm to Delete',
            message: 'Are you sure to do this ?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        let removeService = []
                        if(this.state.alreadyRemove.length>0){
                            removeService =   this.state.alreadyRemove.filter(data => data.uuid !== service.uuid)
                        }else{
                            removeService =   this.state.activeEvent.eventServices.filter(data => data.uuid !== service.uuid)
                        }
                        console.log("removeService" ,removeService)
                        this.setState({
                            rowData: removeService,
                            alreadyRemove:removeService,
                            removeServiceList: this.state.activeEvent.eventServices.filter(data => data.uuid === service.uuid)
                        })
                    }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    }

    result = params => {
        console.log(params);
    }

    personalResult = params => {
        this.setState({
            personalList: this.eventParticipantFormat(params)
        })
        console.log("multi-select :: " + params);
    }

    eventParticipantFormat = (List) => {
        let array = []
        if (List) {
            List.forEach(data => {
                array.push(
                    {
                        participant: data.value,
                        plannedForEvent: true,
                        attendance: false
                    }
                )
            })
        }
        return array
    }

    onCalenderDateChange = date => this.setState({ date })

    handleDateChangeRawFrom = e => {
        e.preventDefault();
    }
    handleChangeDateFrom = date => {
        this.setState({

            startDate: date
        });
    }
    handleDateChangeRawTo = e => {
        e.preventDefault();
    }
    handleChangeDateTo = date => {
        this.setState({
            endDate: date
        });
    }


    setActiveEventValues(activeEvent) {
        console.log("activeEvent.schedule.plannedDate: ", activeEvent.schedule.plannedDate);
        this.setState({
            eventTypeOption: { label: activeEvent.eventType.name, value: activeEvent.eventType.uuid },
            location: { label: activeEvent.location.display, value: activeEvent.location.uuid },
            eventName: activeEvent.name,
            description: activeEvent.description,
            startDate: moment(activeEvent.schedule.plannedDate).toDate(),
            endDate: moment(activeEvent.schedule.endDate).toDate(),
            defaultPersonalList: this.initPersonals(activeEvent.eventParticipants),
            rowData: this.state.activeEvent.eventServices,
            rowAssetData: this.state.activeEvent.eventAssets,

        }, () => {
            console.log("personaldata: ", this.state.personalList);

        })
    }

    initPersonals(workforce) {
        var formatePersonalArr = [];
        if (workforce) {
            workforce.map(data => {
                formatePersonalArr.push({
                    label: data.participant.name,
                    value: data.participant.uuid
                })
            });
        }
        return formatePersonalArr;

    }


    handleSubmit = e => {
        e.preventDefault();
        this.saveEventClosure();
    }

    async saveEventClosure() {
        const { location, activeEvent, description, closureNote, eventTypeOption, eventName, startDate, endDate } = this.state
        const eventclosureForm = {
            eventId: activeEvent.eventId,
            name: eventName,
            description: description,
            uuid: activeEvent.uuid,
            closed: true,
            location: location.value,
            schedule: {
                scheduleId: activeEvent.schedule.scheduleId,
                plannedDate: activeEvent.schedule.plannedDate,
                eventDate: moment(startDate).toDate,
                endDate: endDate
            },
            eventType: eventTypeOption.value,
            eventAssets: this.getAssets(),
            eventServices: this.getServices(),
            eventParticipants: this.getPersonnel(),
            closureNotes: closureNote
        }

        console.log("eventclosureForm", eventclosureForm)
        await this.props.saveEvent(eventclosureForm);
    }

    getAssets() {
        let array = [];
        const { activeEvent } = this.state
        activeEvent.eventAssets.map((plannedData) => {
            var modifiedData = this.state.eventFixedAsset.filter((data) => data[0].uuid == plannedData.uuid)

            console.log("plannedData", plannedData)

            if (modifiedData[0]) {
                // console.log("modifiedData", modifiedData[0][0].eventAssetId) 
                array.push(
                    {
                        eventAssetId: modifiedData[0][0].eventAssetId,
                        quantity: modifiedData[0][0].quantity,
                        actualCost: modifiedData[0][0].asset.capitalValue,
                        asset: modifiedData[0][0].asset.uuid
                    }
                )
            }
            else {
                array.push(
                    {
                        eventAssetId: plannedData.eventAssetId,
                        quantity: plannedData.quantity,
                        actualCost: plannedData.asset.capitalValue,
                        asset: plannedData.asset.uuid
                    }
                )
            }

        })

        console.log("Final Asset", array)
        return array
    }

    getServices() {
        let array = []
        const { activeEvent, removeServiceList } = this.state
        activeEvent.eventServices.map((plannedData) => {
            let modifiedData = removeServiceList.filter(data => data.uuid === plannedData.uuid)
            if (modifiedData.length > 0) {
                modifiedData.forEach(data => {
                    array.push(
                        {
                            eventServiceId: data.eventServiceId,
                            quantity: data.quantity,
                            actualCost: data.service.unitCost,
                            availableInEvent: false,
                            service: data.service.uuid
                        }
                    )
                })

            } else {
                array.push(
                    {
                        eventServiceId: plannedData.eventServiceId,
                        quantity: plannedData.quantity,
                        actualCost: plannedData.service.unitCost,
                        availableInEvent: true,
                        service: plannedData.service.uuid
                    }
                )
            }
        })
        return array
    }

    ///what we do if someone add new workforce ...?? ,, also remove the dublicate names ...
    getPersonnel() {
        let array = []
        const { personalList, activeEvent, availableWorkforce } = this.state
        ///console.log("participant personalList", availableWorkforce)

        personalList.forEach(personalData => {
            let workforce = activeEvent.eventParticipants.filter(data => data.participant.uuid === personalData.participant)
            console.log("active participant", workforce)
            if (workforce.length <= 0) {
                workforce = availableWorkforce.filter(data => data.uuid === personalData.participant);
            }
            workforce.forEach(workforceData => {
                array.push({
                    eventParticipantId: workforceData.eventParticipantId,
                    attendance: true,
                    absenceReason: "",
                    plannedForEvent: workforceData.eventParticipantId ? true : false,
                    participant: workforceData.participant ? workforceData.participant.uuid : workforceData.uuid
                })

            })
        })
        console.log("participant update array ", array)
        return array
    }

    handleEventTypeChange = eventTypeOption => {
        this.setState(
            { eventTypeOption },
            () => console.log(`Option selected:`, this.state.eventTypeOption)
        );
    };

    handleLocationTypeChange = location => {
        this.setState(
            { location },
            () => console.log(`Option Location Selected:`, this.state.location)
        );
    };

    handleChange = e => {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = { ...this.state.formErrors };
        this.setState({ formErrors, [name]: value }, () => console.log(this.state));
    };

    handlePersonalChange = e => {
        e.preventDefault();
    }

    onRowSelected = (event) => {
        console.log('onRowSelected: ' + event.node.data);
    };

    onCellClicked = (event) => {
        console.log("event oncellClicked", event)
        if (event.colDef.headerName === 'Delete') {
            this.deleteServices(event.data)
        }
    };

    handleCellEditingStopped = (event) => {
        if (event.colDef.headerName === 'Unit Cost' || event.colDef.headerName === 'Quantity') {
            var array = this.state.eventFixedAsset
            console.log("array", array, event.data.uuid)
            let filterArray = array.filter(data => data[0].uuid !== event.data.uuid)
            if (filterArray) {
                this.setState({
                    eventFixedAsset: [...filterArray, [event.data]]
                })

            } else {
                this.setState({
                    eventFixedAsset: [event.data]
                })
            }

            console.log("eventFixedAsset", this.state.eventFixedAsset);
        }
    }

    filterAssetType = () => {
        const { activeEvent } = this.state;
        console.log("activeEvent :: ", activeEvent.eventAssets)
        if (activeEvent.eventAssets) {
            this.setState({
                assetItemlist: activeEvent.eventAssets.map(data => (
                    <ExpansionPanel className="ep-expansion">
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography >{data.asset.assetType.name}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <table className="" id="assetsTable">
                                <thead>
                                    <tr className="header">
                                        <th style={{ width: '50%' }}>Name</th>
                                        <th style={{ width: '20%' }}>Quantity</th>
                                        <th style={{ width: '20%' }}>Unit Cost</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox value="Food" style={{ marginLeft: '8px' }} />
                                                }
                                                label={data.asset.display}
                                            />
                                        </td>
                                        <td><input type="number" className="form-control assets_quantity" disabled={data.asset.fixedAsset} ></input></td>
                                        <td><input type="number" className="form-control assets_quantity" disabled={data.asset.fixedAsset} ></input></td>
                                    </tr>
                                </tbody>
                            </table>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                ))
            })
        }

    }
    onGridReady = (params) => {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.gridApi.sizeColumnsToFit();
        window.onresize = () => {
            this.gridApi.sizeColumnsToFit();
        }
    }

    render() {
        const { eventTypeData, description,columnAssetDefs, rowAssetData ,closureNote, personaldata, defaultPersonalList, personalList, columnDefs, rowData, eventName, location, locationData, formErrors, startDate, endDate, eventTypeOption, locationTypeOption, data, columns, activeEvent } = this.state;
        return (
            <div className="row">
                <div className="col-md-6">
                    <form onSubmit={this.handleSubmit} >
                        <CardTemplate
                            title={
                                <div className="row">
                                    <div className="col-md-1">
                                        <img
                                            style={{ height: '30px', width: '30px' }}
                                            src={require('../../../../assets/clipboard.svg')}
                                            alt="" />
                                    </div>
                                    <div className="col-md-11">
                                        <p>Field Trip</p>
                                    </div>
                                </div>
                            }
                            action={
                                <button type='submit' className='btn btn-primary ep-save-btn-row'>Save</button>
                            }
                        >
                            {/*event type*/}
                            <div className="row form-control-sm form-group">
                                <div className="col-sm-3 col-md-2">
                                    <label className="ec-label">Event Type</label>
                                </div>
                                <div className="col-sm-9 col-md-10">
                                    <Select
                                        value={eventTypeOption}
                                        onChange={this.handleEventTypeChange}
                                        options={eventTypeData}
                                    />
                                </div>
                            </div>
                            {/*event name*/}
                            <div className="row form-control-sm form-group ec-rows">
                                <div className="col-sm-3 col-md-2">
                                    <label htmlFor="eventName" className="ec-label">Event name</label>
                                </div>
                                <div className="col-sm-9 col-md-10">
                                    <input
                                        placeholder=""
                                        type="text"
                                        name="eventName"
                                        value={eventName}
                                        onChange={this.handleChange}
                                        className='form-control'
                                    />
                                    {/* {formErrors.eventName.length > 0 && (
                                                        <span className="errorMessage">{formErrors.eventName}</span>
                                                    )} */}
                                </div>
                            </div>
                            {/*description*/}
                            <div className="row form-control-sm form-group ec-rows">
                                <div className="col-sm-3 col-md-2">
                                    <label htmlFor="description" className="ec-label">Description</label>
                                </div>
                                <div className="col-sm-9 col-md-10">
                                    <textarea
                                        placeholder=""
                                        type="text"
                                        name="description"
                                        rows='2'
                                        value={description}
                                        onChange={this.handleChange}
                                        className='form-control'
                                    />
                                    {/* {formErrors.description.length > 0 && (
                                                         marginTop: '30px'
                                                        <span className="errorMessage">{formErrors.description}</span>
                                                    )} */}
                                </div>
                            </div>
                            {/*Date*/}
                            <div className="row form-control-sm form-group ec-date-div">
                                <div className="col-sm-3 col-md-2">
                                    <label htmlFor="start date" className="ec-label">Start Date</label>
                                </div>
                                <div className="col-sm-9 col-md-10">
                                    <DatePicker
                                        selected={startDate}
                                        onChangeRaw={this.handleDateChangeRawFrom}
                                        onChange={this.handleChangeDateFrom}
                                        className="form-control"
                                        dateFormat="MM/dd/yyyy hh:mm"
                                        showTimeSelect
                                        placeholderText="" />
                                    {/* {formErrors.startDate.length > 0 && (
                                                                <span className="errorMessage">{formErrors.startDate}</span>
                                                            )} */}
                                    <span class="calendar_icon"><i class="fas fa-calendar-alt"></i></span>
                                </div>
                            </div>
                            <div className="row form-control-sm form-group  ec-enddate-div">
                                <div className="col-sm-3 col-md-2">
                                    <label htmlFor="end date" >End Date</label>
                                </div>
                                <div className="col-sm-9 col-md-10">
                                    <DatePicker
                                        readOnly={startDate ? false : true}
                                        selected={endDate}
                                        onChangeRaw={this.handleDateChangeRawTo}
                                        onChange={this.handleChangeDateTo}
                                        className="form-control"
                                        dateFormat="MM/dd/yyyy hh:mm"
                                        showTimeSelect
                                        minDate={startDate}
                                        placeholderText="" />
                                    {/* {formErrors.endDate.length > 0 && ( marginTop: '30px' 
                                                                <span className="errorMessage">{formErrors.endDate}</span>
                                                            )} */}
                                    <span class="calendar_icon"><i class="fas fa-calendar-alt"></i></span>
                                </div>
                            </div>
                            {/*Location*/}
                            <div className="row form-control-sm form-group ec-rows">
                                <div className="col-sm-3 col-md-2">
                                    <label htmlFor="start date" className="ec-label">Location</label>
                                </div>
                                <div className="col-sm-9 col-md-10">
                                    <Select
                                        components={animatedComponents}
                                        value={location}
                                        onChange={this.handleLocationTypeChange}
                                        options={locationData}
                                    />
                                </div>
                            </div>
                            {/* personal */}
                            <div className="row form-control-sm form-group ec-rows">
                                <div className="col-sm-3 col-md-2">
                                    <label htmlFor="start date" className="ec-label">Personnel</label>
                                </div>
                                <div className="col-sm-9 col-md-10">
                                    <Select
                                        defaultValue={defaultPersonalList}
                                        components={animatedComponents}
                                        options={personaldata}
                                        onChange={this.personalResult}
                                        isMulti />
                                </div>

                            </div>
                            {/*closure notes*/}
                            <div className="row form-control-sm form-group ec-rows closure-notes">
                                <div className="col-sm-3 col-md-2">
                                    <label htmlFor="closureNote" className="ec-label">Closure Notes</label>
                                </div>
                                <div className="col-sm-9 col-md-10">
                                    <textarea
                                        placeholder=""
                                        type="text"
                                        name="closureNote"
                                        rows='2'
                                        value={closureNote}
                                        onChange={this.handleChange}
                                        className='form-control'
                                    />
                                    {/* {formErrors.description.length > 0 && (
                                                         marginTop: '30px'
                                                        <span className="errorMessage">{formErrors.description}</span>
                                                    )} */}
                                </div>
                            </div>

                        </CardTemplate>
                    </form>
                </div>
                <div className="col-md-6">
                    <CardTemplate
                        title={
                            <div className="row">
                                <div className="col-md-1">
                                    <img
                                        style={{ height: '30px', width: '30px' }}
                                        src={require('../../../../assets/clipboard.svg')}
                                        alt="" />
                                </div>
                                <div className="col-md-11">
                                    <p>Services and Assets</p>
                                </div>
                            </div>
                        }
                    >
                        {/* service */}
                        <div className="row adjustment">
                            <label className="label-heading">Services</label>
                        </div>
                        <div className="row">
                            <div className="card-body">
                                <AgGrid
                                    onGridReady={this.onGridReady}
                                    columnDefs={columnDefs}
                                    onRowSelected={this.onRowSelected}
                                    rowData={rowData}
                                    height="216px"
                                    onCellClicked={this.onCellClicked}
                                />
                            </div>
                        </div>

                        {/* assets*/}
                        <div className="row adjustment">
                            <label className="label-heading-assets">Assets</label>
                        </div>
                        <div className="row">
                            <div className="card-body">
                                <AgGrid
                                    onGridReady={this.onGridReady}
                                    columnDefs={columnAssetDefs}
                                    onRowSelected={this.onRowSelected}
                                    rowData={rowAssetData}
                                    height="216px"
                                    onCellClicked={event => { this.onCellClicked(event) }}
                                    handleCellEditingStopped ={event => { this.handleCellEditingStopped(event) }}
                                />
                            </div>
                        </div>
                    </CardTemplate>
                </div>
            </div >
        )
    }

}

const mapStateToProps = (state) => ({
    eventLists: state.event.events,
    assetTypeList: state.asset.assetCategory,
    serviceList: state.service.services,
    personalList: state.workforce.workforces,
    locationList: state.location.locations,
    eventTypeList: state.event.eventType,
    activeEvent: state.event.activeEvent,
    setting: state.systemSettings.systemSetting
})
const mapDispatchToProps = {
    saveEvent: eventAction.saveEvent,
    getAllEvents: eventAction.fetchEvents,
    getAllEventType: eventAction.fetchEventTypes,
    getAllService: serviceAction.fetchServices,
    getAllPersonnel: workforceAction.fetchParticipant,
    getAllLocation: locationAction.fetchLocations,
    getAllAssetCategory: assetAction.fetchAssetCategory,
    getSettingsByUUID: systemSettingsAction.getSystemSettingsByUUID,
}

export default connect(mapStateToProps, mapDispatchToProps)(EventClosureForm)  