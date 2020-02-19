import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import DatePicker from "react-datepicker";
import Select from 'react-select';
import './eventlist.css';
import Card from '@material-ui/core/Card';
import Modal from 'react-bootstrap/Modal';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import BarChart from '../../common/barchart';
import { generalConstants } from '../../../../utilities/constants';
import { history } from '../../../../history';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { EventSideBackButton } from '../../common/sidebutton/SideBackButton'
import { eventAction } from '../../../../state/ducks/event';
import moment from 'moment'
import { locationAction } from '../../../../state/ducks/location';
import Loaders from "../../loader/Loader"
import Button from 'react-bootstrap/Button';

class EventList extends React.Component {

    constructor(props) {
        super(props);

        this.calendarComponentRef = React.createRef()

        this.state = {
            selectedLocation: null,
            selectedLocationType: null,
            fromDate: '',
            toDate: '',
            openModal: false,
            openVoidModal: false,
            calendarWeekends: true,
            calendarEvents: [{ title: 'Event Now', start: new Date() }],
            mainEventList: [],
            listItems: [],
            locationData: [],
            eventType: "",
            eventName: "",
            startDate: "",
            endDate: "",
            location: "",
            memberList: [],
            serviceList: [],
            assetList: [],
            voidReason: "",
            deleteEvent: [],
            assetCost: 0,
            personnelCost: 0,
            currentActiveEvent: ''
        };

        this.handleChangeDateFrom = this.handleChangeDateFrom.bind(this);
        this.handleDateChangeRawFrom = this.handleDateChangeRawFrom.bind(this);
        this.handleChangeDateTo = this.handleChangeDateTo.bind(this);
        this.handleDateChangeRawTo = this.handleDateChangeRawTo.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);

    }

    async componentWillMount() {
        this.props.getAllEvents();
        this.props.getAllLocation();

    }

    async componentWillReceiveProps(nextProps) {
        if (nextProps.eventLists !== undefined) {
            this.setState({
                mainEventList: nextProps.eventLists.events
            })
            if (this.state.mainEventList) {
                this.renderEventList();
            }
        }

        if (nextProps.locationList !== undefined) {
            let filterLoc = await this.filterLocation(nextProps.locationList.results)
            this.setState({
                availableLocation: filterLoc
            })
            if (this.state.availableLocation) {
                this.locationListFormat();
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


    locationListFormat = () => {
        let array = []
        array.push(
            {
                label: "",
                value: ""
            })
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

    showContent(id) {
        this.setState({
            openModal: true
        });
    }

    openModal() {
        this.setState({ openModal: true });
    }
    closeModal() {
        this.setState({ openModal: false });
    }

    openVoidModal() {
        this.setState({
            openVoidModal: true,
            voidReason: ""
        });
    }
    closeVoidModal() {
        this.setState({ openVoidModal: false });
    }

    handleButtonClick(e) {
        e.preventDefault();
    }

    handleDateChangeRawFrom(e) {
        e.preventDefault();
    }
    async handleChangeDateFrom(date) {
        await this.setState({
            fromDate: date
        });
        // this.eventfilterByDate()
    }
    handleDateChangeRawTo(e) {
        e.preventDefault();
    }
    async handleChangeDateTo(date) {
        console.log("date", date)
        await this.setState({
            toDate: date
        });
        //this.eventfilterByDate()
    }

    handleChangeLocation = selectedLocation => {
        this.setState({ selectedLocation });
        this.eventfilterByLocation(selectedLocation)

    };

    async eventfilterByLocation(location) {
        if (location.value === "") {
            await this.setState({
                mainEventList: this.props.eventLists.events
            })
        } else {
            await this.setState({
                mainEventList: this.props.eventLists.events.filter(data => data.location.uuid === location.value)
            })
        }
        if (this.state.mainEventList) {
            this.renderEventList();
        }
    }

    async eventfilterByDate(date) {
        const { toDate, fromDate } = this.state
        if (toDate && fromDate) {
            let toDates = moment(toDate).format('YYYY-MM-DD')
            let fromDates = moment(fromDate).format('YYYY-MM-DD')
            let filterList = this.props.eventLists.events.filter(data =>
                (moment(data.schedule.plannedDate).format('YYYY-MM-DD') === fromDates)
                <= (moment(data.schedule.endDate).format('YYYY-MM-DD') === toDates))

            console.log("filterList", filterList)
            await this.setState({
                mainEventList: filterList
            })
            if (this.state.mainEventList) {
                this.renderEventList();
            }
        }

    }

    handleChangeLocationType = selectedLocationType => {
        this.setState({ selectedLocationType });

    };

    deleteEvent = async (event) => {
        await this.setState({
            deleteEvent: event,
        })
        this.openVoidModal()
    };

    handleVoidSubmit = async e => {
        e.preventDefault();
        const { deleteEvent, voidReason } = this.state
        const voidEvent = {
            eventId: deleteEvent.eventId,
            name: deleteEvent.name,
            uuid: deleteEvent.uuid,
            location: deleteEvent.location ? deleteEvent.location.uuid : [],
            eventType: deleteEvent.eventType ? deleteEvent.eventType.uuid : [],
            schedule: {
                scheduleId: deleteEvent.schedule.scheduleId,
                plannedDate: deleteEvent.schedule.plannedDate,
                eventDate: deleteEvent.schedule.eventDate,
                endDate: deleteEvent.schedule.endDate
            },
            voided: true,
            voidReason: voidReason
        }
        console.log("voidEvent", voidEvent);
        this.props.saveEvent(voidEvent);
        this.props.getAllEvents();
        this.closeVoidModal();
    }

    handleChange = e => {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = { ...this.state.formErrors };
        this.setState({ formErrors, [name]: value }, () => console.log(this.state));
    };


    handleAddEvent = () => {
        localStorage.setItem("active-event", JSON.stringify(""))
        history.push('/eventplanner');
    }

    switchPage = (currentStatus, currentObject) => {
        if (currentStatus === generalConstants.Fill_CLOSURE_FORM) {
            this.props.setActiveEvent(currentObject)
        }
        else if (currentStatus === generalConstants.VIEW_SUMMARY) {
            this.showEventSummary(currentObject);
        }
        else if (currentStatus === generalConstants.ADD_DETAIL) {
            this.props.setActiveEvent(currentObject)
        }
    }

    async showEventSummary(activeEvent) {
        await this.calculateCost(activeEvent)
        await this.calculatePersonnel(activeEvent)
        this.setState({
            currentActiveEvent: activeEvent.uuid,
            eventType: activeEvent.eventType.name,
            eventName: activeEvent.name,
            startDate: moment(activeEvent.schedule.plannedDate).format("YYYY-MM-DD"),
            endDate: moment(activeEvent.schedule.endDate).format('YYYY-MM-DD'),
            location: activeEvent.location.display,
            memberList: activeEvent.eventParticipants.map(data => {
                return <label style={{ textAlign: 'center', color: 'gray', margin: 'inherit' }}>{data.participant.display}</label>
            }),
            serviceList: activeEvent.eventServices.map(data => {
                return <tr>
                    <td>{data.service.name}</td>
                    <td>{"$ " + data.actualCost}</td>
                </tr>
            }),
            assetList: activeEvent.eventAssets.map(data => {
                return <tr>
                    <td>{data.asset.name}</td>
                    <td>{data.quantity}</td>
                    <td>{"$ " + data.actualCost}</td>
                </tr>
            }),
            openModal: true
        })
    }

    async calculateCost(activeEvent) {
        let totalAssetCost = 0
        console.log("eventAssets", activeEvent)
        if (activeEvent.eventAssets !== undefined) {
            activeEvent.eventAssets.forEach(data => {
                totalAssetCost = totalAssetCost + data.quantity * data.actualCost
            })
        }
        await this.setState({
            assetCost: totalAssetCost
        })
    }

    async calculatePersonnel(activeEvent) {
        console.log("eventParticipants ", activeEvent.eventParticipants)
        var hours = Math.abs(moment(activeEvent.schedule.endDate).toDate() - moment(activeEvent.schedule.plannedDate).toDate()) / 3600000
        var totalCost = 0;
        await activeEvent.eventParticipants.forEach(element => {
            if (element.participant.salaryType.name === "Daily") {
                totalCost = totalCost + (element.participant.salaryValue / 8) * hours
            } else if (element.participant.salaryType.name === "Monthly") {
                totalCost = totalCost + (element.participant.salaryValue / 173) * hours
            }
            else if (element.participant.salaryType.name === "Annual") {
                totalCost = totalCost + (element.participant.salaryValue / 2080) * hours
            }
        });
        await this.setState({
            personnelCost: totalCost
        })

    }

    renderEventList() {

        const { mainEventList } = this.state
        const removeVoidedList = this.filterVoidedEvents(mainEventList)
        this.setState({
            listItems: removeVoidedList.map(event => {
                return <Card style={{ margin: '1px' }}>
                    <li className="list-group-item " >

                        <div className="row" >
                            <div className="col-lg-1 col-md-1 col-sm-1"  >
                                <img style={{ height: '45px', width: '45px' }}
                                    src={require('../../../../assets/formo.png')}
                                    alt="" />
                            </div>
                            <div className="col-lg-5 col-md-5  col-sm-5"
                                style={{ marginTop: '16px', marginBottom: 'auto' }} >
                                <h6>{event.name}</h6>
                            </div>
                            <div className="col-lg-3 col-md-3  col-sm-3"
                                style={{ marginTop: '2px', marginBottom: 'auto' }}>
                                <p style={{ fontSize: '1.5ex', margin: 'auto', color: 'gray', marginLeft: '144px' }}>
                                    <span style={{ fontSize: '12px' }}>
                                        {moment(event.schedule.plannedDate).format('YYYY-MM-DD')}
                                    </span>
                                    <label style={{ marginRight: '6px', marginLeft: '6px' }}> to </label>
                                    <span style={{ fontSize: '12px' }}>
                                        {moment(event.schedule.endDate).format('YYYY-MM-DD')}
                                    </span>
                                </p>
                                <p style={{ fontSize: '1.5ex', margin: 'auto', color: 'gray', marginLeft: '144px' }}>{event.location.display}</p>
                                {/*    <p style={{ fontSize: '1.5ex', margin: 'auto', color: 'gray', marginLeft: '144px' }}>{event.locationType}</p> */}
                            </div>
                            <div className="col-sm-2" style={{ marginTop: '11px', marginBottom: 'auto' }}>
                                <button
                                    onClick={() => this.switchPage(this.eventStatus(event), event)}
                                    type="button"
                                    className="btn btn-sm btn-primary btn-el-gobal"
                                >{this.eventStatus(event)}
                                </button>
                            </div>
                            <div className="col-lg-1 col-md-1 col-sm-1 align-middle hover-zoom" >
                                {
                                    (event.uuid === '27f83f15-4980-42a7-8f3c-7e6468487084') ? "" :
                                        <span class="d-inline-block" tabindex="0" data-toggle="tooltip" title="Remove" onClick={() => this.deleteEvent(event)}>
                                            <i className="fas fa-times delete-icon-eventlist"></i>
                                        </span>
                                }

                            </div>
                        </div>
                    </li>
                </Card >
            })
        });

    }

    filterVoidedEvents(mainEventList) {
        return mainEventList.filter(data => data.voided !== true)
    }

    eventStatus(event) {
        if (event.closed === null) {
            return generalConstants.Fill_CLOSURE_FORM
        } else {
            return (event.closed) ? generalConstants.VIEW_SUMMARY : generalConstants.ADD_DETAIL
        }
    }

    render() {
        const { eventName, memberList, serviceList, personnelCost, assetCost, assetList, eventType, location, startDate, endDate, selectedLocation, locationData, selectedLocationType, fromDate, toDate, listItems } = this.state;
        console.log("isLoading", this.props.isloading)
        if (this.props.isloading) return <Loaders />;
        return (
            <div className="main-event">
                <div className="row event-maincard-header">
                    <div className="col-sm-3 col-md-3">
                        <h4 className="header_title">Events List</h4>
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-6 el-margin">
                        <div className="row">
                            <div className="col-sm-3 col-md-3"></div>
                            <div className="col-sm-3 col-md-6">
                                <div className="tags">Location </div>
                                <Select
                                    value={selectedLocation}
                                    onChange={this.handleChangeLocation}
                                    options={locationData}
                                    className="select-dropdown sizing"
                                    name="statetype"
                                />
                            </div>
                            {/* form date */}
                            {/* <div className="col-sm-3 col-md-3 col-lg-3">
                                <div className="row tags-date" >
                                    From Date
                                </div>
                                <div className="row">
                                    <DatePicker
                                        selected={fromDate}
                                        onChangeRaw={this.handleDateChangeRawFrom}
                                        onChange={this.handleChangeDateFrom}
                                        className="form-control date-picker-events"
                                        maxDate={new Date()} dateFormat="dd/MM/yyyy"
                                        placeholderText=""
                                    />
                                </div>
                            </div>
                            {/* to date */}
                            {/* <div className="col-sm-3 col-md-3 col-lg-3">
                                <div className="row tags-date">To Date</div>
                                <div className="row">
                                    <DatePicker selected={toDate} onChangeRaw={this.handleDateChangeRawTo} onChange={this.handleChangeDateTo} className="form-control date-picker-events" maxDate={new Date()} dateFormat="dd/MM/yyyy" placeholderText="" required />
                                </div>
                            </div> */}
                        </div>

                    </div>
                    <div className="col-sm-3 col-md-3 col-lg-3 el-margin">
                        <div className="row">
                            <div className="col-sm-6 col-md-6 col-lg-6">
                                <Link to="/eventcalendar">
                                    <button className="btn btn-primary btn-custom">Calendar View</button>
                                </Link>
                            </div>
                            <div className="col-sm-6 col-md-6 col-lg-6">
                                {/* <Link to="/eventplanner"> */}
                                <button id="left" className="btn btn-primary btn-custom" onClick={this.handleAddEvent}>Add Event</button>
                                {/* </Link> */}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="card" id="event-maincard">
                        <ul className="list-group list-group-flush">
                            {listItems}
                        </ul>
                    </div>
                </div>

                {/* Summary */}

                <Modal size="lg" show={this.state.openModal} onHide={() => this.closeModal()} style={{ marginTop: '100px' }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Event Summary</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-group">
                            {
                                (this.state.currentActiveEvent === '27f83f15-4980-42a7-8f3c-7e6468487084') ?
                                    <>
                                        <div className="row">
                                            <ExpansionPanel style={{ width: '100%', margin: '18px' }}>
                                                <ExpansionPanelSummary
                                                    expandIcon={<ExpandMoreIcon />}
                                                    aria-controls="panel1a-content"
                                                    id="panel1a-header"
                                                    style={{ backgroundColor: "var(--label-color)", height: '45px' }}
                                                >
                                                    <div className='row'>
                                                        <div className='col-sm-6'>
                                                            <label style={{ color: '#fff' }} >Total Cost</label>
                                                        </div>
                                                        <div className='col-sm-6'>
                                                            <label style={{ marginLeft: '349px', color: '#fff' }}>$712.15</label>
                                                        </div>
                                                    </div>
                                                </ExpansionPanelSummary>
                                                <ExpansionPanelDetails>

                                                    <table className="" id="assetsTable">
                                                        <thead>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>Total cost per screening</td>
                                                                <td>$ 1.78</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Total cost per presumptive</td>
                                                                <td>$ 11.87</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Total cost per patient</td>
                                                                <td>$ 356.08</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Cost per hour</td>
                                                                <td>$ 178.04</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </ExpansionPanelDetails>
                                            </ExpansionPanel>
                                        </div>
                                        <div className='row' style={{ marginBottom: '50px' }} >
                                            <div className="col-sm-2"></div>
                                            <div className="col-sm-4">
                                                <div class="card" >
                                                    <div class="card-header" style={{ background: '#fff', height: '40px', height: '45px' }}>
                                                        <label style={{ fontSize: '13px', marginLeft: '18px' }}>Number Needed to Screen</label>
                                                    </div>
                                                    <div class="card-body" style={{ background: 'var(--label-color)', height: '50px', color: '#fff' }}>
                                                        <h2 style={{ marginTop: '-15px', marginLeft: '67px' }} >200</h2>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div class="card" >
                                                    <div class="card-header" style={{ background: '#fff', height: '40px' }}>
                                                        <label style={{ fontSize: '13px', marginLeft: '66px' }}> Yield  (%)</label>
                                                    </div>
                                                    <div class="card-body" style={{ background: 'var(--label-color)', height: '54px', color: '#fff' }}>
                                                        <h2 style={{ marginTop: '-12px', marginLeft: '60px' }} >0.50</h2>
                                                    </div>

                                                </div>
                                            </div>
                                            <div className="col-sm-2"></div>
                                        </div>
                                        <BarChart></BarChart>
                                    </>
                                    : ""
                            }
                            {/* total cost */}
                            <div className="row">
                                <div className="card" style={{ width: '100%', margin: '20px' }}>
                                    <div className="card-header" style={{ background: 'var(--label-color)', color: 'white', height: '45px' }}>
                                        <label>Asset And Personnel Cost</label>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className='col-sm-6'>
                                                <label style={{ fontWeight: 'bold' }}>Asset Cost:</label> &nbsp;&nbsp; <label >{assetCost}</label>
                                            </div>
                                            <div className='col-sm-6'>
                                                <label style={{ fontWeight: 'bold' }}>Personnel Cost:</label> &nbsp;&nbsp; <label >{personnelCost.toFixed(2)}</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Event Details */}
                            <div className="row">
                                <div className="card" style={{ width: '100%', margin: '20px' }}>
                                    <div className="card-header" style={{ background: 'var(--label-color)', color: 'white', height: '45px' }}>
                                        <label>Event Details</label>
                                    </div>
                                    <div className="card-body">

                                        <div className="row">
                                            <div className='col-sm-6'>
                                                <label style={{ fontWeight: 'bold' }}>Event Type:</label> &nbsp;&nbsp; <label >{eventType}</label>
                                            </div>
                                            <div className='col-sm-6'>
                                                <label style={{ fontWeight: 'bold' }}>Event Name:</label> &nbsp;&nbsp; <label >{eventName}</label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className='col-sm-6'>
                                                <label style={{ fontWeight: 'bold' }}>Start Date:</label> &nbsp;&nbsp; <label >{startDate}</label>
                                            </div>
                                            <div className='col-sm-6'>
                                                <label style={{ fontWeight: 'bold' }}>End Date:</label> &nbsp;&nbsp; <label >{endDate}</label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            {/* <div className='col-sm-6'>
                                                <label style={{ fontWeight: 'bold' }}>Location Type:</label>&nbsp;&nbsp; <label>Hospital</label>
                                            </div> */}
                                            <div className='col-sm-6'>
                                                <label style={{ fontWeight: 'bold' }}>Location :</label>&nbsp;&nbsp; <label>{location}</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* member */}
                            <div className="row">
                                <div className="card" style={{ width: '100%', margin: '20px' }}>
                                    <div className="card-header" style={{ background: "var(--theme-secondary-color)", color: 'white', height: '45px' }}>
                                        <label>Members</label>
                                    </div>
                                    <div className="card-body" style={{ marginRight: '24px' }}>
                                        {memberList}
                                    </div>
                                </div>
                            </div>
                            {/* service */}
                            <div className="row">
                                <div className="card" style={{ width: '100%', margin: '20px' }}>
                                    <div className="card-header" style={{ background: "var(--label-color)", color: 'white', height: '45px' }}>
                                        <label>Services</label>
                                    </div>
                                    <div className="card-body">
                                        <table className="" id="assetsTable">
                                            <thead>
                                                <tr className="header">
                                                    <th style={{ width: '20%' }}>Service Name</th>
                                                    <th style={{ width: '20%' }}>Service Cost</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {serviceList}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            {/* Assets */}
                            <div className="row">
                                <div className="card" style={{ width: '100%', margin: '20px' }}>
                                    <div className="card-header" style={{ background: "var(--theme-secondary-color)", color: 'white', height: '45px' }} >
                                        <label>Assets</label>
                                    </div>
                                    <div className="card-body">
                                        <table className="" id="assetsTable">
                                            <thead>
                                                <tr className="header">
                                                    <th style={{ width: '20%' }}>Asset Name</th>
                                                    <th style={{ width: '20%' }}>Quantity</th>
                                                    <th style={{ width: '20%' }}>Unit Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {assetList}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </Modal.Body>
                </Modal>


                {/* //voided                            */}
                <Modal
                    show={this.state.openVoidModal}
                    onHide={() => this.closeVoidModal()}
                    style={{ marginTop: '100px' }}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm to Delete?</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={this.handleVoidSubmit}>
                        <Modal.Body>
                            <div className="form-group">
                                <label htmlFor="eventName" className="required" >Reason</label>
                                <input
                                    placeholder="void reason"
                                    type="text"
                                    name="voidReason"
                                    value={this.state.voidReason}
                                    onChange={this.handleChange}
                                    className='form-control'
                                />
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button type='submit' variant='primary'>Save
                        </Button>
                        </Modal.Footer>
                    </form>
                </Modal>

                <EventSideBackButton
                    navigateTo=""
                ></EventSideBackButton>
            </div>
        );
    }
}


const mapStateToProps = (state) => ({
    eventLists: state.event.events,
    locationList: state.location.locations,
    isLoading: state.event.loading
})
const mapDispatchToProps = {
    getAllEvents: eventAction.fetchEvents,
    setActiveEvent: eventAction.setActiveEvent,
    getAllLocation: locationAction.fetchLocations,
    saveEvent: eventAction.saveEvent,
}

export default connect(mapStateToProps, mapDispatchToProps)(EventList)  