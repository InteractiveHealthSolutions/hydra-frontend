import { generalConstants } from '../../utilities/constants';
import { history } from '../../utilities/helpers';

export const eventplanneraction = {
    setNewEvent
}

function setNewEvent(event) {
    console.log("active event" + JSON.stringify(event))
    return dispatch => {
        dispatch(setEvent({ event }));
        //     let eventList = JSON.parse(localStorage.getItem("new-event"));
        //     let currentevent = {}
        //     event.forEach(element => {
        //         currentevent  = element
        //     });
        //     localStorage.setItem('new-event', JSON.stringify([...eventList,  currentevent ]));
        //    history.push('/event');
    }

    function setEvent(event) { return { type: generalConstants.NEW_EVENT, event } };
}