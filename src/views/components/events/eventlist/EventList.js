import React, { lazy, Suspense } from 'react';
import { connect } from 'react-redux'
import './eventlist.css';
import { EventSideBackButton } from '../../common/sidebutton/SideBackButton'
import { eventAction } from '../../../../state/ducks/event';
import moment from 'moment'
import { locationAction } from '../../../../state/ducks/location';
import { ModalFormTemplate } from '../../../ui/modal/modalFormTemplate/ModalFormTemplate';
import { LoaderDots } from "../../common/loader/LoaderDots"
import CardTemplate from '../../../ui/cards/SimpleCard/CardTemplate';
import { history } from '../../../../history';

const EventHeaderSearch = lazy(() => import('./EventHeaderSearch'))
const EventContainer = lazy(() => import('./EventContainer'))
const EventSummary = lazy(() => import('./EventSummary'))

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
            activeEvent: [],
            fltLocation: {}
        };

        this.handleChangeDateFrom = this.handleChangeDateFrom.bind(this);
        this.handleDateChangeRawFrom = this.handleDateChangeRawFrom.bind(this);
        this.handleChangeDateTo = this.handleChangeDateTo.bind(this);
        this.handleDateChangeRawTo = this.handleDateChangeRawTo.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);

    }

    async UNSAFE_componentWillMount() {
        //this.props.getAllEvents();
        //this.props.getAllLocation();
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

    openModal = () => {
        this.setState({ openModal: true });
    }
    closeModal = () => {
        this.setState({ openModal: false });
    }

    openVoidModal() {
        this.setState({
            openVoidModal: true,
            voidReason: ""
        });
    }
    closeVoidModal = () => {
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
        await this.setState({
            toDate: date
        });
        //this.eventfilterByDate()
    }

    handleChangeLocation = selectedLocation => {
        this.setState({ fltLocation: selectedLocation });
        // this.eventfilterByLocation(selectedLocation)

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
    }

    async eventfilterByDate(date) {
        const { toDate, fromDate } = this.state
        if (toDate && fromDate) {
            let toDates = moment(toDate).format('YYYY-MM-DD')
            let fromDates = moment(fromDate).format('YYYY-MM-DD')
            let filterList = this.props.eventLists.events.filter(data =>
                (moment(data.schedule.plannedDate).format('YYYY-MM-DD') === fromDates)
                <= (moment(data.schedule.endDate).format('YYYY-MM-DD') === toDates))
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
        this.props.saveEvent(voidEvent);
        this.props.getAllEvents();
        this.closeVoidModal();
    }

    handleChange = e => {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = { ...this.state.formErrors };
        this.setState({ formErrors, [name]: value });
    };


    showEventSummary = (activeEvent) => {
        console.log("showEventSummary", activeEvent)
        this.setState({
            activeEvent: activeEvent,
            openModal: true
        })
    }

    handleAddEvent = () => {
        localStorage.setItem("active-event", JSON.stringify(""))
        history.push('/event/eventplanner');
    }

    render() {
        const { selectedLocation, activeEvent, fltLocation, voidReason, openModal, openVoidModal } = this.state;
        console.log("showEventSummary", openModal)
        return (
            <>
                <CardTemplate
                    title={
                        <Suspense fallback={<LoaderDots withMargin="true" height={30} width={30} />}>
                            <EventHeaderSearch
                                selectedLocation={selectedLocation}
                                handleChangeLocation={this.handleChangeLocation}
                                handleAddEvent={this.handleAddEvent}
                            />
                        </Suspense>
                    }
                    action={
                        <button className="btn btn-primary btn_custom_e_add" onClick={this.handleAddEvent}>Add Event</button>
                    }
                >
                    <Suspense fallback={<LoaderDots withMargin="true" height={30} width={30} />}>
                        <EventContainer
                            location={fltLocation}
                            deleteEvent={this.deleteEvent}
                            eventSummary={this.showEventSummary}
                        />
                    </Suspense>
                </CardTemplate >
                <Suspense fallback={<LoaderDots withMargin="true" height={30} width={30} />}>
                    <EventSummary
                        openModal={openModal}
                        closeModal={this.closeModal}
                        event={activeEvent}
                    />
                </Suspense>
                <ModalFormTemplate
                    openVoidModal={openVoidModal}
                    closeVoidModal={this.closeVoidModal}
                    handleVoidSubmit={this.handleVoidSubmit}
                    title="Confirm to Delete?"
                >
                    <div className="form-group">
                        <label htmlFor="eventName" className="required" >Reason</label>
                        <input
                            placeholder="void reason"
                            type="text"
                            name="voidReason"
                            value={voidReason}
                            onChange={this.handleChange}
                            className='form-control'
                            required
                        />
                    </div>
                </ModalFormTemplate>
            </>

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