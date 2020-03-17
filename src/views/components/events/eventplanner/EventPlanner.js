import React, { Component, lazy, Suspense } from 'react';
import '../../../style/main.css';
import './eventplanner.css';
import { connect } from 'react-redux';
import DatePicker from "react-datepicker";
import Select from 'react-select';
import moment from 'moment'
import makeAnimated from 'react-select/animated';
import { EventSideBackButton } from '../../common/sidebutton/SideBackButton'
import { eventAction } from '../../../../state/ducks/event';
import { workforceAction } from '../../../../state/ducks/workforce';
import { locationAction } from '../../../../state/ducks/location';
import { SERVICE_TITLE, ASSETS_TITLE } from '../../../../utilities/constants/globalconstants'
import { LoaderDots } from "../../common/loader/LoaderDots"
const EventAssetService = lazy(() => import('./EventAssetService'));
const animatedComponents = makeAnimated();



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
            assetItem: {},
            selectedAssetItem: [],
            serviceItem: {},
            selectedServiceItem: [],
            activeEvent: JSON.parse(localStorage.getItem('active-event')),
        };
    }

    async  UNSAFE_componentWillMount() {
        if (this.state.activeEvent) this.setActiveEventValues(this.state.activeEvent)
        this.props.getAllPersonnel();
        this.props.getAllLocation();
        this.props.getAllEventType();
    }

    async UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.personalList !== undefined && nextProps.personalList.participants !== undefined) {
            let filterRetiredWorkforce = await nextProps.personalList.participants.filter(data => data.retired !== true)
            await this.setState({
                availableWorkforce: filterRetiredWorkforce
            })
            if (this.state.availableWorkforce)
                this.personalListFormat();
        }
        if (nextProps.locationList !== undefined) {
            let filterLocation = await this.filterLocation(nextProps.locationList.results)
            this.setState({
                availableLocation: filterLocation
            })
            if (this.state.availableLocation) {
                this.locationListFormat();
            }
        }
        if (nextProps.eventTypeList !== undefined) {
            this.setState({
                availableEventType: nextProps.eventTypeList.eventTypes
            })
            if (this.state.availableEventType) {
                this.eventTypeListFormat();
            }
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


    setActiveEventValues(activeEvent) {
        console.log("activeEvent.schedule.plannedDate: ", activeEvent.schedule.plannedDate);
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

    serviceResult = (params, name) => {
        this.setState({
            serviceItem: { ...this.state.serviceItem, [name]: params }
        }, async () => {
            let mergeArray = [];
            await Object.values(this.state.serviceItem).map((x, i) => {
                console.log('x1',x)
                if (x) {
                    for (const elelemt of x)
                        mergeArray.push(elelemt)
                }
            })
            this.setState({
                selectedServiceItem: mergeArray
            })
            console.log("serviceItem  ::", this.state.selectedServiceItem);
        })
    }

    storeUniqueParams(params, name) {
        return { ...this.state.serviceItem, [name]: params }
    }





    eventServiceFormat(list) {
        let array = []
        if (list) {
            list.forEach(data => {
                array.push(
                    {
                        service: data.value,
                        actualCost: "",
                        plannedForEvent: true,
                        availableInEvent: false
                    }
                )
            })
        }
        return array
    }

    personalResult = params => {
        let formErrors = { ...this.state.formErrors };
        formErrors.personal = this.state.personalList.length > 0 ? "" : "personal is required"
        this.setState({
            personalList: this.eventParticipantFormat(params)
        })
    }

    assetResult = (params, name) => {
        console.log('params',name,params)
        this.setState({
            assetItem: { ...this.state.assetItem, [name]: params }
        }, async () => {
            let mergeArray = [];
            await Object.values(this.state.assetItem).forEach((x, i) => {
      
            
                if (x) {
                    for (const elelemt of x)
                        mergeArray.push(elelemt)
                }
            })
            console.log("mergeArray  ::", mergeArray);
            this.setState({
                selectedAssetItem: mergeArray
            })
            console.log("selectedAssetItem  ::", this.state.selectedAssetItem);
        })
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

    handleSubmit = async (e) => {
        e.preventDefault();
        if (this.validation()) {
            const { activeEvent, selectedServiceItem, selectedAssetItem, eventName, description, eventTypeOption, location, startDate, endDate, personalList, assetItem } = this.state
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
                        plannedDate: moment(startDate).format('YYYY-MM-DD hh:mm:ss'),
                        endDate: moment(endDate).format('YYYY-MM-DD hh:mm:ss')
                    },
                    eventParticipants: personalList,
                    eventAssets: await this.eventAssetFormat(selectedAssetItem),
                    eventServices: await this.eventServiceFormat(selectedServiceItem)
                }
            } else {
                newEvent = {
                    name: eventName,
                    description: description,
                    eventType: eventTypeOption.value,
                    location: location.value,
                    closed: null,
                    schedule: {
                        plannedDate: moment(startDate).format('YYYY-MM-DD hh:mm:ss'),
                        endDate: moment(endDate).format('YYYY-MM-DD hh:mm:ss')
                    },
                    eventParticipants: personalList,
                    eventAssets: await this.eventAssetFormat(selectedAssetItem),
                    eventServices: await this.eventServiceFormat(selectedServiceItem)
                }
            }
            console.log("newEvent", newEvent)
            this.props.saveEvent(newEvent);
        }
    }

    validation() {
        const { eventName, serviceItem, description, eventTypeOption, location, startDate, endDate, personalList, assetItem } = this.state
        let valid = true;
        let formErrors = { ...this.state.formErrors };

        this.setState({ formErrors }, () => { });
        if (eventTypeOption === "") {
            formErrors.eventType = "Event type is required"
            this.setState({ formErrors }, () => { });
            return false
        } else if (eventName === "") {
            formErrors.eventName = "Event name is required"
            this.setState({ formErrors }, () => { });
            return false
        }
        else if (startDate === "") {
            formErrors.startDate = "Start date is required"
            this.setState({ formErrors }, () => { });
            return false
        }
        else if (endDate === "") {
            formErrors.endDate = "End date is required"
            this.setState({ formErrors }, () => { });
            return false
        }
        else if (location === "") {
            formErrors.location = "Location is required"
            this.setState({ formErrors }, () => { });
            return false
        }
        else if (personalList === null || personalList.length <= 0) {
            formErrors.personal = "Personnel is required"
            this.setState({ formErrors }, () => { });
            return false
        }

        else if (serviceItem === null || serviceItem.length <= 0) {
            formErrors.service = "Service  is required"
            this.setState({ formErrors }, () => { });
            return false
        }
        else if (assetItem === null || assetItem.length <= 0) {
            formErrors.asset = "Asset is required"
            this.setState({ formErrors }, () => { });
            return false
        }
        return valid
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
                        <h4 className="header_title">Event Planner</h4>
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
                                            <label className="ec-label required" style={{ marginLeft: '7px' }}>Event Type</label>
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
                                            <label htmlFor="eventName" className="ec-label required">Event Name</label>
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
                                            <label htmlFor="start date" className="ec-label required">Personnel</label>
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
                                        <p>Services and Assets </p>
                                    </div>
                                </div>
                            </div>
                            {/*services --*/}
                            <div className="card-body">
                                <div className="row ep_service" >
                                    <Suspense fallback={<LoaderDots height={30} width={30} />}>
                                        <EventAssetService
                                            title={SERVICE_TITLE}
                                            serviceResult={this.serviceResult}
                                        />
                                    </Suspense>
                                </div>
                                {/* assets */}
                                <div className="row">
                                    <Suspense fallback={<LoaderDots height={30} width={30} />}>
                                        <EventAssetService
                                            title={ASSETS_TITLE}
                                            assetResult={this.assetResult}
                                        />
                                    </Suspense>
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
    personalList: state.workforce.workforces,
    locationList: state.location.locations,
    eventTypeList: state.event.eventType
})

const mapDispatchToProps = {
    saveEvent: eventAction.saveEvent,
    getAllPersonnel: workforceAction.fetchParticipant,
    getAllLocation: locationAction.fetchLocations,
    getAllEventType: eventAction.fetchEventTypes,
}

export default connect(mapStateToProps, mapDispatchToProps)(EventPlanner)  
