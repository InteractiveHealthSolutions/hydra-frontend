import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Link } from 'react-router-dom';

import '../../../style/main.css';
import './eventcalendar.css';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import moment from 'moment'
import { history } from '../../../../history';
import Calendar from 'react-calendar';
import { EventSideBackButton } from '../../common/sidebutton/SideBackButton'
import { eventAction } from '../../../../state/ducks/event';
import { assetAction } from '../../../../state/ducks/assets';
import { serviceAction } from '../../../../state/ducks/service';
import { workforceAction } from '../../../../state/ducks/workforce';
import { locationAction } from '../../../../state/ducks/location';
import { connect } from 'react-redux'

class EventCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.calendarComponentRef = React.createRef()

    this.state = {
      calendarWeekends: true,
      calendarEvents: [],
      eventColor: '#ffa500',
      openModal: false,
      eventName: "",
      selectDate: "",
      eventTypeOption: '',
      locationTypeOption: '',
      locationName: "",
      startDate: "",
      endDate: "",
      eventList: [],
      eventcalendarList: [],
      dateTime: null,
      date: new Date(),
      defaultEventType: "",
      personalList: [],
      availableEventType: [],
      eventTypeData: [],
      locationData: [],
      availableLocation: [],
      personaldata: [],
      availableWorkforce: [],
      calenderDate: new Date(),
    };


  }

  setDate = (dateTime) => this.setState({ dateTime })

  async componentWillMount() {
    await this.props.getAllLocation();
    await this.props.getAllEventType();
    await this.props.getAllEvents();
  }

  async componentWillReceiveProps(nextProps) {
    console.log("nextProps.eventLists", nextProps.eventLists);

    if (nextProps.eventTypeList.eventTypes !== undefined) {
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
    if (nextProps.locationList !== undefined) {
      await this.setState({
        availableLocation: nextProps.locationList.results
      })
      if (this.state.availableLocation) {
        this.locationListFormat();
      }
    }
    if (nextProps.eventLists !== undefined) {
      await this.setState({
        eventList: nextProps.eventLists.events
      })
      if (this.state.eventList) {
        this.displayEventsInCalendar()
      }
    }


  }

  ///Formate function

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


  displayEventsInCalendar() {
    var events = this.state.eventList.map((event, index) => {
      return {
        id: event.eventId,
        title: event.name,
        start: moment(event.schedule.plannedDate).toDate(),
        end: moment(event.schedule.endDate).toDate()
      }
    })

    console.log("displayEventsInCalendar", events);
    this.setState({
      calendarEvents: events
    })
  }

  toggleWeekends = () => {
    this.setState({ // update a property
      calendarWeekends: this.state.calendarWeekends
    })
  }

  gotoPast = () => {
    let calendarApi = this.calendarComponentRef.current.getApi()
    calendarApi.gotoDate('2000-01-01') // call a method on the Calendar object
  }

  handleDateClick = (arg) => {
    /// var formateEndDate = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(arg.date)
    this.setState({
      selectDate: arg.date,
      startDate: arg.date,
      endDate: arg.date,
      openModal: true
    });

    console.log("start date == " + this.state.startDate)
    // if (window.confirm('Would you like to add an event to ' + arg.dateStr + ' ?')) {
    // this.setState({ // add new event data
    //   calendarEvents: this.state.calendarEvents.concat({ // creates a new array
    //     title: 'New Event',
    //     start: arg.date,
    //     allDay: false
    //   })
    // })
  }

  handleEventTypeChange = eventTypeOption => {
    this.setState(
      { eventTypeOption },
      () => console.log(`Option selected:`, this.state.eventTypeOption)
    );
  };

  handleLocationTypeChange = locationTypeOption => {
    this.setState(
      { locationTypeOption },
      () => console.log(`Option Location Selected:`, this.state.locationTypeOption)
    );
  };

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

  openModal() {
    this.setState({ openModal: true });
  }
  closeModal() {
    this.setState({ openModal: false });
  }
  handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({ [name]: value }, () => console.log(this.state));
  };

  handleSubmit = e => {
    e.preventDefault();
    this.closeModal();
    this.saveEvents()
  }

  async saveEvents() {

    const { eventName, eventTypeOption, locationTypeOption, startDate, endDate } = this.state
    const newEvent = {
      name: eventName,
      description: "",
      closed:false,
      eventType: eventTypeOption.value,
      location: locationTypeOption.value,
      schedule: {
        plannedDate: moment(startDate).format('YYYY-MM-DD'),
        endDate: moment(endDate).format('YYYY-MM-DD')
      },
      eventParticipants: [],
      eventAssets: [],
      eventServices: []
    }
    await this.props.saveEvent(newEvent)
    await this.props.getAllEvents();
  }

  handleSelectedRange = (date) => {
    this.setState({
      startDate: date.start,
      endDate: date.end,
      openModal: true

    })
  }

  handleAddEvent = () => {
    localStorage.setItem("active-event", JSON.stringify(""))
    history.push('/eventplanner');
  }

  onCalendarChange = date => this.setState({ date })

  render() {
    const { startDate, eventTypeData, locationData, endDate, eventTypeOption, locationTypeOption } = this.state;

    return (

      <div className="main-event-calendar">
        <div className="row" style={{ marginBottom: '27px' }}>
          <div className="col-sm-8 col-md-6">
            <h4 className="header_title">Events Calendar</h4>
          </div>
          <div className="col-sm-2 col-md-3" style={{ position: 'absolute', right: '0' }}>
            <Link to="/events">
              <button id="left-calendar" className="btn btn-primary  btn-calendar-custom">List View</button>
            </Link>
          </div>
          <div className="col-sm-2 col-md-3" style={{ position: 'absolute', right: '0', marginRight: '68px' }}>
            <button id="right-calendar" className="btn btn-primary btn-calendar-custom" onClick={this.handleAddEvent} >Add Event</button>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-2 col-md-3 card" >
            <Calendar
              onChange={this.onCalendarChange}
              value={this.state.date}
            />
          </div>
          <div className="col-sm-10 col-md-9 card" >
            <FullCalendar
              defaultView="dayGridMonth"
              header={{
                left: 'today ,prev,next',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,listWeek'
              }}
              textColor='#fff'
              eventColor='#4285f4'
              selectable='true'
              selectHelper='true'
              eventLimit='false'
              editable='true'

              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              ref={this.calendarComponentRef}
              weekends={this.state.calendarWeekends}
              events={this.state.calendarEvents}
              dateClick={this.handleDateClick}
              select={(selectdate) => this.handleSelectedRange(selectdate)}
            />
          </div>
        </div>

        <Modal size="lg" show={this.state.openModal} onHide={() => this.closeModal()} style={{ marginTop: '100px' }}>
          <Modal.Header closeButton>
            {/* <Modal.Title>Event Summary</Modal.Title> */}
          </Modal.Header>
          <form onSubmit={this.handleSubmit}>
            <Modal.Body>
              <div className="row">
                <div className="col-sm-1">
                  <span style={{ color: '#4285f4' }}><i class="fa fa-calendar-alt" aria-hidden="true"></i></span>
                </div>
                <div className="col-sm-5">
                  {/* <label>Event Type</label> */}
                  <Select
                    required="true"
                    value={eventTypeOption}
                    onChange={this.handleEventTypeChange}
                    options={eventTypeData}
                    placeholder="Event Type"
                  />
                </div>
                <div className="col-sm-5">
                  {/* <label htmlFor="eventName">Event name</label> */}
                  <input
                    required="true"
                    placeholder=" Event Name"
                    type="text"
                    name="eventName"
                    value={this.state.eventName}
                    onChange={this.handleChange}
                    className='form-control'
                  />
                </div>
              </div>
              {/* next row */}
              <div className="row" style={{ marginTop: '15px ', }}>
                <div className="col-sm-1">
                  <span style={{ color: '#4285f4' }}><i class="fas fa-calendar-alt"></i></span>
                </div>
                <div className="col-sm-5">

                  <DatePicker
                    required="true"
                    style={{ marginleft: '-64px' }}
                    selected={startDate}
                    onChangeRaw={this.handleDateChangeRawFrom}
                    onChange={this.handleChangeDateFrom}
                    className="form-control"
                    dateFormat="MM/dd/yyyy hh:mm aa"
                    showTimeSelect
                    placeholderText="Start Date" />

                </div>
                <div className="col-sm-5">

                  <DatePicker
                    required="true"
                    style={{ marginleft: '-64px' }}
                    selected={endDate}
                    onChangeRaw={this.handleDateChangeRawTo}
                    onChange={this.handleChangeDateTo}
                    className="form-control"
                    dateFormat="MM/dd/yyyy hh:mm aa"
                    showTimeSelect
                    placeholderText="End Date" />
                </div>
              </div>
              {/* next row */}
              <div className="row" style={{ marginTop: '15px ', }}>
                <div className="col-sm-1">
                  <span style={{ color: '#4285f4' }}><i class="fa fa-map-marker-alt" aria-hidden="true"></i></span>
                </div>
                <div className="col-sm-10">
                  <Select
                    required="true"
                    value={locationTypeOption}
                    onChange={this.handleLocationTypeChange}
                    options={locationData}
                    placeholder="Location Type"

                  />
                </div>
              </div>

            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" variant="primary">Save </Button>
            </Modal.Footer>
          </form>
        </Modal>
        <EventSideBackButton
          navigateTo="events"
        ></EventSideBackButton>
      </div>

    );
  }
}
const mapStateToProps = (state) => ({
  eventLists: state.event.events,
  locationList: state.location.locations,
  eventTypeList: state.event.eventType,
  activeEvent: state.event.activeEvent
})
const mapDispatchToProps = {
  saveEvent: eventAction.saveEvent,
  getAllEvents: eventAction.fetchEvents,
  getAllEventType: eventAction.fetchEventTypes,
  getAllLocation: locationAction.fetchLocations,
}

export default connect(mapStateToProps, mapDispatchToProps)(EventCalendar)

