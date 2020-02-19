import React, { Component } from 'react';
import '../../../style/main.css';
import './eventplanner.css';
import { connect } from 'react-redux';
import DatePicker from "react-datepicker";
import Select from 'react-select';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TransferList from '../../common/transferlist/TransferList'
import moment from 'moment'
import makeAnimated from 'react-select/animated';
import { EventSideBackButton } from '../../common/sidebutton/SideBackButton'
import { eventAction } from '../../../../state/ducks/event';
import { assetAction } from '../../../../state/ducks/assets';
import { serviceAction } from '../../../../state/ducks/service';
import { workforceAction } from '../../../../state/ducks/workforce';
import { locationAction } from '../../../../state/ducks/location';

const animatedComponents = makeAnimated();


const formValid = (formErrors, ...rest) => {
    let valid = true;
    Object.values(formErrors).forEach(val => {
        val.length > 0 && (valid = false);
    })
    Object.values(rest).forEach(val => {
        val === null > 0 && (valid = false);
    })
    return valid;
}


class EventPlanner extends Component {

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
                locationName: "",
                location: "",
                service: [],
                personal: [],
                asset: []

            },
            personaldata: [],
            locationData: [],
            eventTypeData: [],
            availableLocation: [],
            availableAssets: [],
            availableService: [],
            availableWorkforce: [],
            availableEventType: [],
            calenderDate: new Date(),
            eventTypeOption: "",
            locationTypeOption: "",
            eventList: [],
            assets: [],
            personalList: [],
            assetItemlist: [],
            assetItem: [],
            activeEvent: JSON.parse(localStorage.getItem('active-event')),
        };
    }


    async  componentWillMount() {
        if (this.state.activeEvent) this.setActiveEventValues(this.state.activeEvent)
        await this.props.getAllAssetCategory();
        await this.props.getAllService();
        await this.props.getAllPersonnel();
        await this.props.getAllLocation();
        await this.props.getAllEventType();
    }

    async componentWillReceiveProps(nextProps) {
        if (nextProps.personalList !== undefined && nextProps.personalList.participants !== undefined) {
            let filterRetiredWorkforce = await nextProps.personalList.participants.filter(data => data.retired !== true)
            await this.setState({
                availableWorkforce: filterRetiredWorkforce
            })
            if (this.state.availableWorkforce)
                this.personalListFormat();
        }
        if (nextProps.locationList !== undefined) {
            this.setState({
                availableLocation: nextProps.locationList.results
            })
            if (this.state.availableLocation) {
                this.locationListFormat();
            }
        }
        if (nextProps.serviceList !== undefined && nextProps.serviceList.services !== undefined) {
            let nonRetiredService = await nextProps.serviceList.services.filter(data => data.retired !== true)
            await this.setState({
                availableService: nonRetiredService
            })
        }
        if (nextProps.assetTypeList !== undefined) {
            this.setState({
                availableAssets: nextProps.assetTypeList.services
            })
            if (this.state.availableAssets)
                this.filterAssetType();
        } if (nextProps.eventTypeList !== undefined) {
            this.setState({
                availableEventType: nextProps.eventTypeList.eventTypes
            })
            if (this.state.availableEventType) {
                this.eventTypeListFormat();
            }
        }
    }
    
    setActiveEventValues(activeEvent) {
        this.setState({
            eventTypeOption: { label: activeEvent.eventType.name, value: activeEvent.eventType.uuid },
            location: { label: activeEvent.location.display, value: activeEvent.location.uuid },
            eventName: activeEvent.name,
            description: activeEvent.description,
            startDate: moment(activeEvent.schedule.plannedDate).toDate(),
            endDate: moment(activeEvent.schedule.endDate).toDate(),
        }, () => {
            console.log("personaldata: ", this.state.personalList);
        })
    }

    result = params => {
        // console.log("multi-ep-select::" + params);
    }

    personalResult = params => {
        let formErrors = { ...this.state.formErrors };
        formErrors.personal = this.state.personalList.length > 0 ? "" : "personal is required"
        this.setState({
            personalList: this.eventParticipantFormat(params)
        })
        // console.log("List personal  ::", this.state.personalList);
    }

    assetResult = params => {
        this.setState({
            assetItem: this.eventAssetFormat(params)
        })
        console.log("List assets  ::", params, this.state.assetItem);
    }

    onCalenderDateChange = date => this.setState({ date })

    handleDateChangeRawFrom = e => {
        e.preventDefault();
    }
    handleChangeDateFrom = date => {
        let formErrors = { ...this.state.formErrors };
        formErrors.startDate = ""
        this.setState({
            formErrors,
            startDate: date
        });
    }

    handleDateChangeRawTo = e => {
        e.preventDefault();
    }
    handleChangeDateTo = date => {
        let formErrors = { ...this.state.formErrors };
        formErrors.endDate = ""
        this.setState({
            formErrors,
            endDate: date
        });
    }

    handleSubmit = e => {
        e.preventDefault();
        console.log("services data", JSON.parse(localStorage.getItem("TransferList")));
        if (this.validation()) {
            const { activeEvent, eventName, description, eventTypeOption, location, startDate, endDate, personalList, assetItem } = this.state
            let newEvent = {}
            if (activeEvent) {
                newEvent = {
                    eventId: activeEvent.eventId,
                    name: eventName,
                    description: description,
                    eventType: eventTypeOption.value,
                    location: location.value,
                    closed: null,
                    schedule: {
                        scheduleId: activeEvent.schedule.scheduleId,
                        plannedDate: moment(startDate).format('YYYY-MM-DD'),
                        endDate: moment(endDate).format('YYYY-MM-DD')
                    },
                    eventParticipants: personalList,
                    eventAssets: assetItem,
                    eventServices: JSON.parse(localStorage.getItem("TransferList"))
                }
            } else {
                newEvent = {
                    name: eventName,
                    description: description,
                    eventType: eventTypeOption.value,
                    location: location.value,
                    closed: null,
                    schedule: {
                        plannedDate: moment(startDate).format('YYYY-MM-DD'),
                        endDate: moment(endDate).format('YYYY-MM-DD')
                    },
                    eventParticipants: personalList,
                    eventAssets: assetItem,
                    eventServices: JSON.parse(localStorage.getItem("TransferList"))
                }
            }

            console.log("newEvent", newEvent);
            this.props.saveEvent(newEvent);
        }
    }

    validation() {
        console.log("validation");
        ///i know i know ... this is bad practice 
        const { eventName, description, eventTypeOption, location, startDate, endDate, personalList, assetItem } = this.state
        let valid = true;
        const serviceList = JSON.parse(localStorage.getItem("TransferList"))
        let formErrors = { ...this.state.formErrors };
        formErrors.service = serviceList.length > 0 ? "" : "service  is required"
        this.setState({ formErrors }, () => { });

        if (eventTypeOption === "") {
            formErrors.eventType = "Event Type is required"
            this.setState({ formErrors }, () => { });
            return false
        } else if (eventName === "") {
            formErrors.eventName = "Event Name is required"
            this.setState({ formErrors }, () => { });
            return false
        }
        else if (startDate === "") {
            formErrors.startDate = "start date is required"
            this.setState({ formErrors }, () => { });
            return false
        }
        else if (endDate === "") {
            formErrors.endDate = "end date is required"
            this.setState({ formErrors }, () => { });
            return false
        }
        else if (location === "") {
            formErrors.location = "location is required"
            this.setState({ formErrors }, () => { });
            return false
        }
        else if (personalList === null || personalList.length <= 0) {
            formErrors.personal = "personal is required"
            this.setState({ formErrors }, () => { });
            return false
        }

        else if (serviceList === null || serviceList.length <= 0) {
            formErrors.service = "service  is required"
            this.setState({ formErrors }, () => { });
            return false
        }
        else if (serviceList === null || serviceList.length <= 0) {
            formErrors.asset = "asset  is required"
            this.setState({ formErrors }, () => { });
            return false
        }
        return valid
    }

    //
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
    eventAssetFormat = (List) => {
        let array = []
        if (List) {
            List.forEach(data => {
                array.push(
                    {
                        asset: data.value,
                        actualCost: "",
                        plannedForEvent: true,
                        availableInEvent: false
                    }
                )
            })
        }
        return array
    }

    handleEventTypeChange = eventTypeOption => {
        let formErrors = { ...this.state.formErrors };
        formErrors.eventType = ""
        this.setState(
            { formErrors, eventTypeOption },
            // () => console.log(`Option selected:`, this.state.eventTypeOption.value)
        );
    };

    handleLocationTypeChange = location => {
        let formErrors = { ...this.state.formErrors };
        formErrors.location = ""
        this.setState(
            {
                formErrors, location
            },
        );
    };

    handleChange = e => {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = { ...this.state.formErrors };
        switch (name) {
            case "eventName":
                formErrors.eventName = value.length > 0 ?
                    "" : "event Name required";
                break;
        }

        this.setState({ formErrors, [name]: value }, () => { });
    };

    filterAssetType = () => {
        const { availableAssets } = this.state;

        this.setState({
            assetItemlist: availableAssets.map(data => (
                <ExpansionPanel className="ep-expansion">
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography >{data.name}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Select
                            className="asset-list"
                            components={animatedComponents}
                            options={this.assetListFormate(data)}
                            onChange={this.assetResult}
                            isMulti />
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            ))
        })
    }

    assetListFormate(list) {
        let array = []

        if (list.assetTypes !== undefined) {
            list.assetTypes.forEach((data, index) => {
                data.assets.forEach((assetData) => {
                    array.push(
                        {
                            label: (<span>{assetData.name}<span className="category">({data.name})</span></span>),
                            value: assetData.uuid
                        }
                    )
                })
            })
        }
        console.log("List assetType array :: ", array)
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

    render() {
        const { personaldata, locationData, eventTypeData, location, formErrors, startDate, endDate, calenderDate, eventTypeOption, description, locationTypeOption, locationName, eventName } = this.state;
        return (
            <div className="main-event-planner">
                <div className="row">
                    <div className="col-7 ep-col">
                        <h2 className="header_title">Event Planner</h2>
                        <div className="card ep-main-card">
                            <div className="card-header">
                                <div className="row form-control-sm form-group">
                                    <div className="col-sm-1 col-md-1 col-lg-1">
                                        <img
                                            style={{ height: '30px', width: '30px' }}
                                            src={require('../../../../assets/clipboard.svg')}
                                            alt="" />
                                    </div>
                                    <div className="col-sm-11 col-md-11 col-lg-11" style={{ marginTop: '5px' }}>
                                        <p>Event Details</p>
                                    </div>
                                </div>
                            </div>
                            {/* body block */}
                            <div className="card-body">
                                <form onSubmit={this.handleSubmit} >
                                    {/*event type*/}
                                    <div className="row">
                                        <div className="col-sm-3 col-md-2">
                                            <label className="ec-label required">Event Type</label>
                                        </div>
                                        <div className="col-sm-9 col-md-10">
                                            <Select
                                                value={eventTypeOption}
                                                onChange={this.handleEventTypeChange}
                                                options={eventTypeData}
                                                name="eventType"
                                                required="true"
                                                className="form-control-sm"

                                            />
                                        </div>
                                        {formErrors.eventType.length > 0 && (
                                            <span className="errorMessagetype">{formErrors.eventType}</span>
                                        )}
                                    </div>
                                    {/*event name*/}
                                    <div className="row form-control-sm form-group ec-rows">
                                        <div className="col-sm-3 col-md-2">
                                            <label htmlFor="eventName" className="ec-label required">Event name</label>
                                        </div>
                                        <div className="col-sm-9 col-md-10">
                                            <input
                                                placeholder=""
                                                type="text"
                                                name="eventName"
                                                noValidate
                                                value={eventName}
                                                onChange={this.handleChange}
                                                className={formErrors.eventName.length > 0 ? 'error form-control' : 'form-control'}
                                            />
                                            {formErrors.eventName.length > 0 && (
                                                <span className="errorMessage">{formErrors.eventName}</span>
                                            )}
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
                                                value={this.state.description}
                                                onChange={this.handleChange}
                                                className='form-control'

                                            />
                                            {formErrors.description.length > 0 && (
                                                <span className="errorMessage">{formErrors.description}</span>
                                            )}
                                        </div>

                                    </div>
                                    {/*Date*/}
                                    <div className="row form-control-sm form-group ec-date-div">
                                        <div className="col-sm-3 col-md-2">
                                            <label htmlFor="start date" className="ec-label required">Start Date</label>
                                        </div>
                                        <div className="col-sm-9 col-md-10">
                                            <DatePicker
                                                selected={startDate}
                                                onChangeRaw={this.handleDateChangeRawFrom}
                                                onChange={this.handleChangeDateFrom}
                                                className="form-control"
                                                dateFormat="MM/dd/yyyy hh:mm aa"
                                                showTimeSelect
                                                placeholderText="" />
                                            <span class="calendar_icon"><i class="fas fa-calendar-alt"></i></span>
                                        </div>
                                        {formErrors.startDate.length > 0 && (
                                            <span className="errorMessagedate">{formErrors.startDate}</span>
                                        )}
                                    </div>
                                    <div className="row form-control-sm form-group ec-enddate-div">
                                        <div className="col-sm-3 col-md-2">
                                            <label htmlFor="end date" className="required">End Date</label>
                                        </div>
                                        <div className="col-sm-9 col-md-10">
                                            <DatePicker
                                                selected={endDate}
                                                onChangeRaw={this.handleDateChangeRawTo}
                                                onChange={this.handleChangeDateTo}
                                                className="form-control"
                                                dateFormat="MM/dd/yyyy hh:mm aa"
                                                showTimeSelect
                                                placeholderText="" />

                                            <span class="calendar_icon"><i class="fas fa-calendar-alt"></i></span>
                                        </div>
                                        {formErrors.endDate.length > 0 && (
                                            <span className="errorMessagedate">{formErrors.endDate}</span>
                                        )}

                                    </div>
                                    {/*Location*/}
                                    <div className="row form-control-sm form-group ec-rows">
                                        <div className="col-sm-3 col-md-2">
                                            <label htmlFor="start date" className="ec-label required">Location</label>
                                        </div>
                                        <div className="col-sm-9 col-md-10">
                                            <Select
                                                components={animatedComponents}
                                                value={location}
                                                onChange={this.handleLocationTypeChange}
                                                options={locationData}
                                                required
                                                placeholderText=""
                                            />
                                        </div>
                                        {formErrors.location.length > 0 && (
                                            <span className="errorMessagedate">{formErrors.location}</span>
                                        )}
                                    </div>
                                    {/* personal */}
                                    <div className="row form-control-sm form-group ec-rows">
                                        <div className="col-sm-3 col-md-2">
                                            <label htmlFor="start date" className="ec-label required">Personel</label>
                                        </div>
                                        <div className="col-sm-9 col-md-10">
                                            <Select
                                                components={animatedComponents}
                                                options={personaldata}
                                                onChange={this.personalResult}
                                                required
                                                isMulti />
                                        </div>
                                        {formErrors.personal.length > 0 && (
                                            <span className="errorMessagedate">{formErrors.personal}</span>
                                        )}
                                    </div>
                                    <div className="row form-control-sm form-group ec-rows ">
                                        <div className="col-sm-8" ></div>
                                        <div className='col-sm-4 '>
                                            <button type='submit' className='btn btn-primary save-btn ep-save-btn-row'>Save</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    {/* next col */}
                    <div className="col-5 ep-col-n">
                        {/* <Link to="/events">
                            <button type='button' className='btn btn-primary btn-sm ep-back-btn'>Go Back</button>
                        </Link> */}
                        <div className="card ep-main-card-services" >
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
                            {/*services and assets -- body*/}
                            <div className="card-body">
                                <div className="row" >
                                    <label className="ep-label-heading">Service</label>
                                    {formErrors.service.length > 0 && (
                                        <span className="errorMessageService">{formErrors.service}</span>
                                    )}
                                </div>
                                <div className="row ep-transferlist">
                                    <TransferList services={this.state.availableService}> </TransferList>
                                </div>
                                <div className="row">
                                    <label className="ep-label-heading-assets">Assets</label>
                                    {formErrors.asset.length > 0 && (
                                        <span className="errorMessageService">{formErrors.asset}</span>
                                    )}
                                </div>
                                <div className="row">
                                    {this.state.assetItemlist}
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
                <EventSideBackButton
                    navigateTo="events"
                ></EventSideBackButton>
            </div>
        );
    }

}

const mapStateToProps = (state) => ({
    eventLists: state.event.events,
    assetTypeList: state.asset.assetCategory,
    serviceList: state.service.services,
    personalList: state.workforce.workforces,
    locationList: state.location.locations,
    eventTypeList: state.event.eventType
})

const mapDispatchToProps = {
    saveEvent: eventAction.saveEvent,
    // getAllAsset: assetAction.fetchAssetTypes,
    getAllService: serviceAction.fetchServices,
    getAllPersonnel: workforceAction.fetchParticipant,
    getAllLocation: locationAction.fetchLocations,
    getAllEventType: eventAction.fetchEventTypes,
    getAllAssetCategory: assetAction.fetchAssetCategory
}

export default connect(mapStateToProps, mapDispatchToProps)(EventPlanner)  
