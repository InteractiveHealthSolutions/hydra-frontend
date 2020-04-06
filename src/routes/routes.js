import React from 'react';

const Homepage = React.lazy(() => import('../views/components/home/Homepage'));
const EventList = React.lazy(() => import('../views/components/events/eventlist/EventList'));
const EventCalendar = React.lazy(() => import('../views/components/events/eventcalender/EventCalendar'))
const EventPlanner = React.lazy(() => import('../views/components/events/eventplanner/EventPlanner'))
const EventClosureForm = React.lazy(() => import('../views/components/events/eventclosure/EventClosureForm'))


const routes = [
  { path: '/', name: 'Home', component: Homepage },
  { path: '/event', exact: true, name: 'Event', component: EventList },
  { path: '/event/eventplanner', name: 'Event Planner', component: EventPlanner },
  { path: '/event/eventclosure', name: 'Event Closure', component: EventClosureForm },
  { path: '/event/eventcalender', name: 'Event Calender', component: EventCalendar }
];

export default routes;
