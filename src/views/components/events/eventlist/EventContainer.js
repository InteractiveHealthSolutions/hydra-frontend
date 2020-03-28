import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { LoaderDots } from "../../common/loader/LoaderDots"
import { eventAction } from '../../../../state/ducks/event';
import { generalConstants } from '../../../../utilities/constants';
import EventCardList from './EventCardList'
import './eventlist.css';

function EventContainer({ eventSummary, location, ...props }) {

    const [mainEventList, setMainEventList] = useState([])


    useEffect(() => {
        if (props.eventList !== undefined && props.eventList.events !== undefined) {
            let nonVoidedEvents = filterVoidedEvents(props.eventList.events)
            setMainEventList(nonVoidedEvents)
        }
    }, [props.eventList])

    useEffect(() => {
        props.getAllEvents()
    }, [])

    useEffect(() => {
         if(location !==undefined){
              eventfilterByLocation(location)
         }
    }, [location])

    async function eventfilterByLocation(location) {
        if (location.value === "") {
                setMainEventList(filterVoidedEvents(props.eventList.events))
        } else {
            setMainEventList(mainEventList.filter(data => data.location.uuid === location.value))
        }
    }

    function filterVoidedEvents(events) {
        return events.filter(data => data.voided !== true)
    }

    function eventStatus(event) {
        if (event.closed === null) {
            return generalConstants.Fill_CLOSURE_FORM
        } else {
            return (event.closed) ? generalConstants.VIEW_SUMMARY : generalConstants.ADD_DETAIL
        }
    }

    function switchPage(currentStatus, currentObject) {
        if (currentStatus === generalConstants.Fill_CLOSURE_FORM) {
            props.setActiveEvent(currentObject)
        }
        else if (currentStatus === generalConstants.VIEW_SUMMARY) {
            eventSummary(currentObject);
        }
        else if (currentStatus === generalConstants.ADD_DETAIL) {
            props.setActiveEvent(currentObject)
        }
    }


    console.log("mainEventList :: ", mainEventList)
    if (props.isLoading) return <LoaderDots withMargin="true" height={40} width={40} />;
    return (
        <div id="event-maincard">
            <ul className="list-group list-group-flush">
                {
                    mainEventList ? mainEventList.map(event => (
                        <EventCardList
                            event={event}
                            eventStatus={eventStatus}
                            switchPage={switchPage}
                            deleteEvent={props.deleteEvent}
                        />
                    )) : ""
                }
            </ul>
        </div>
    )
}

const mapStateToProps = (state) => ({
    eventList: state.event.events,
    isLoading: state.event.loading
})
const mapDispatchToProps = {
    getAllEvents: eventAction.fetchEvents,
    setActiveEvent: eventAction.setActiveEvent,
}

export default connect(mapStateToProps, mapDispatchToProps)(EventContainer)  
