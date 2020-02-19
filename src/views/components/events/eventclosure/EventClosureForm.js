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
                    headerName: "Name", field: "service.name", width: 320
                },
                {
                    headerName: "Unit Cost", field: "service.unitCost", valueFormatter: this.currencyFormatter, width: 200
                },
                {
                    headerName: "delete",
                    template:
                        `
                    <button className="btn-edite"><i class="fas fa-trash-alt"></i></button>
                    `
                    , width: 80
                },
            ],
            columnAssetDefs: [
                {
                    headerName: "Name", field: "asset.name",
                    headerCheckboxSelection: true,
                    headerCheckboxSelectionFilteredOnly: true,
                    checkboxSelection: true,
                    width: 150
                },
                {
                    headerName: "Asset Type", field: "asset.assetType.name", width: 120
                },
                {
                    headerName: "Asset Category", field: "asset.assetType.assetCategory.name", width: 150
                },
                {
                    headerName: "Unit Cost", field: "asset.capitalValue", editable: this.editUnitCost, valueFormatter: this.currencyFormatter, width: 100
                },
                {
                    headerName: "Quantity", field: "quantity", editable: this.editUnitCost, width: 100
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
        };
    }

    currencyFormatter(params) {
        return params.value !== null ? "$ " + params.value : ""
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
        await this.props.getAllAssetCategory();
        await this.props.getAllService();
        await this.props.getAllPersonnel();
        await this.props.getAllLocation();
        await this.props.getAllEventType();
        await this.setActiveEventValues(this.state.activeEvent)
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
            await this.setState({
                availableLocation: nextProps.locationList.results
            })
            if (this.state.availableLocation) {
                this.locationListFormat();
            }
        }
        if (nextProps.personalList !== undefined) {
            await this.setState({
                availableWorkforce: nextProps.personalList.participants
            })
            if (this.state.availableWorkforce)
                this.personalListFormat();
        }

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
                        console.log("delete service :", service)
                        let removeService = this.state.activeEvent.eventServices.filter(data => data.uuid !== service.uuid)
                        this.setState({
                            rowData: removeService,
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

        this.setState({
            eventTypeOption: { label: activeEvent.eventType.name, value: activeEvent.eventType.uuid },
            location: { label: activeEvent.location.display, value: activeEvent.location.uuid },
            eventName: activeEvent.name,
            description: activeEvent.description,
            startDate: moment(activeEvent.schedule.plannedDate).toDate(),
            endDate: moment(activeEvent.schedule.endDate).toDate(),
            personalList: this.initPersonals(activeEvent.eventParticipants),
            rowData: this.state.activeEvent.eventServices,
            rowAssetData: this.state.activeEvent.eventAssets,

        }, () => {
            console.log("personaldata: ", this.state.personalList);

        })
    }



    initPersonals(workforce) {

        console.log("workf :: ",workforce)
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
        const { personalList, activeEvent } = this.state
        personalList.forEach(personalData => {
            let workforce = activeEvent.eventParticipants.filter(data => data.uuid === personalData.value);
            workforce.forEach(workforceData => {
                array.push({
                    eventParticipantId: workforceData.eventParticipantId,
                    attendance: true,
                    absenceReason: "",
                    plannedForEvent: true,
                    participant: workforceData.participant.uuid
                })
            })
        })
        console.log("Personal :: ", array)
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
        //console.log("event",event)
        if (event.colDef.headerName === 'delete') {
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


    //assets

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



    render() {
        const { eventTypeData, description, closureNote, personaldata, personalList, columnDefs, rowData, eventName, location, locationData, formErrors, startDate, endDate, eventTypeOption, locationTypeOption, data, columns, activeEvent } = this.state;
        return (
            <div className="main-event-closure">
                <div className="row">
                    <div className="col-6 ec-col">
                        <h2 className="header_title">Event Closure Form</h2>
                        <div className="card ec-main-card">
                            <div className="card-header">
                                <div className="row form-control-sm form-group">
                                    <div className="col-sm-1 col-md-1 col-lg-1">
                                        <img
                                            style={{ height: '30px', width: '30px' }}
                                            src={require('../../../../assets/clipboard.svg')}
                                            alt="" />
                                    </div>
                                    <div className="col-sm-11 col-md-11 col-lg-11" style={{ marginTop: '5px' }}>
                                        <p>Field Trip</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <form onSubmit={this.handleSubmit} >
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
                                                selected={endDate}
                                                onChangeRaw={this.handleDateChangeRawTo}
                                                onChange={this.handleChangeDateTo}
                                                className="form-control"
                                                dateFormat="MM/dd/yyyy hh:mm"
                                                showTimeSelect
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
                                            <label htmlFor="start date" className="ec-label">Personel</label>
                                        </div>
                                        <div className="col-sm-9 col-md-10">
                                            <Select
                                                components={animatedComponents}
                                                options={personaldata}
                                                value={personalList}
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
                                    <div className="row form-control-sm form-group ">
                                        <div className="col-sm-8" ></div>
                                        <div className='col-sm-4 '>
                                            <button type='submit' className='btn btn-primary save-btn ec-save-btn-row'>Save</button>
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                    {/*service and assets*/}
                    <div className="col-6 ec-col-n">
                        <div className="card ec-main-card-services" >
                            <div className="card-header">
                                <div className="row form-control-sm form-group">
                                    <div className="col-sm-1 col-md-1 col-lg-1">
                                        <img
                                            style={{ height: '30px', width: '30px' }}
                                            src={require('../../../../assets/clipboard.svg')}
                                            alt="" />
                                    </div>
                                    <div className="col-sm-11 col-md-11 col-lg-11" style={{ marginTop: '5px' }}>
                                        <p>Services and Assets | Planned</p>
                                    </div>
                                </div>
                            </div>
                            {/* body*/}
                            <div className="card-body">
                                {/* service */}
                                <div className="row" style={{ maxWidth: "100%", marginLeft: '2px' }}>
                                    <label className="label-heading">Services</label>
                                    <div
                                        className="ag-theme-balham"
                                        style={{
                                            width: '100%',
                                            height: '216px',
                                            marginTop: '10px'
                                        }}
                                    >
                                        <AgGridReact
                                            columnDefs={this.state.columnDefs}
                                            rowData={this.state.rowData}
                                            modules={AllCommunityModules}
                                            onRowSelected={this.onRowSelected}
                                            onCellClicked={event => { this.onCellClicked(event) }}
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
                                {/* assets*/}
                                <div className="row" style={{ maxWidth: "100%", marginLeft: '2px' }}>
                                    <label className="label-heading-assets">Assets</label>
                                    <div
                                        className="ag-theme-balham"
                                        style={{
                                            width: '100%',
                                            height: '216px',
                                            marginTop: '10px'
                                        }}
                                    >
                                        <AgGridReact
                                            columnDefs={this.state.columnAssetDefs}
                                            rowData={this.state.rowAssetData}
                                            modules={AllCommunityModules}
                                            onRowSelected={this.onRowSelected}
                                            onCellClicked={event => { this.onCellClicked(event) }}
                                            enableSorting
                                            enableFilter
                                            rowAnimation
                                            onCellEditingStopped={event => { this.handleCellEditingStopped(event) }}
                                            forEachNode={(rowNode, index) => { console.log('node ' + rowNode.data.athlete + ' is in the grid'); }}
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
                </div>
                <EventSideBackButton
                    navigateTo="events"
                ></EventSideBackButton>
            </div>
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
    activeEvent: state.event.activeEvent
})
const mapDispatchToProps = {
    saveEvent: eventAction.saveEvent,
    getAllEvents: eventAction.fetchEvents,
    getAllEventType: eventAction.fetchEventTypes,
    getAllService: serviceAction.fetchServices,
    getAllPersonnel: workforceAction.fetchParticipant,
    getAllLocation: locationAction.fetchLocations,
    getAllAssetCategory: assetAction.fetchAssetCategory
}

export default connect(mapStateToProps, mapDispatchToProps)(EventClosureForm)  