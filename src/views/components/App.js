import React from 'react';
import { Router, Route } from 'react-router-dom';
import LogIn from './login/Login';
import { history } from '../../history'
import IdleTimer from 'react-idle-timer'
import { PrivateRoute } from './route/PrivateRoute';
import Homepage from './home/Homepage';
import { userActions } from '../../store/actions';
import { store } from '../../state/store';
import SignUp from './administration/user/signup/SignUp';
import Header from './header/Header';
import Workflow from './workflow/Workflow';
import Phase from './phases/Phase';
import Component from './stages/Component';
import FormDesigner from './form/formdesigner/FormDesigner';
import EventList from './events/eventlist/EventList';
import EventCalendar from './events/eventcalender/EventCalendar';
import EventPlanner from './events/eventplanner/EventPlanner';
import EventClosureForm from './events/eventclosure/EventClosureForm';
import FormRender from './form/formdesigner/FormRender';
import Form from './form/Form';
import FindPatient from './patient/search/FindPatient'
import PatientDetail from './patient/detail/PatientDetail';
import PatientRegistration from './patient/create/PatientRegistration';
import AdministrationHome from './administration/AdministrationHome'
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";
import ManageLabTest from './managelabtest/ManageLabTest'
import AddLabTestAttribute from './addlabtestattribute/AddLabTestAttribute';
import ManageLabTestAttribute from './managelabtestattribute/ManageLabTestAttribute'
import TestOrderList from './labtestorder/TestOrderList'
import AddTestOrder from './labtestorder/AddTestOrder';
import SampleList from './labtestsample/samplelist';
import Roles from './administration/roles/roles';
import QuestionList from './administration/workflowmanagement/questions/QuestionList'
import TestResults from './testresults/TestResuts';
import Reports from './Reports/Reports'
import SystemSetting from './administration/systemsettings/systemsettings'
import UserList from './administration/user/userlist'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.idleTimer = null;
        this.onAction = this.onAction.bind(this);
        this.onActive = this.onActive.bind(this);
        this.onIdle = this.onIdle.bind(this);
    }
    onbeforeunload = (e) => {
        window.onunload = function () {
            localStorage.clear();
        }
        return 'undefined';
    }

    render() {
        return (

            <div>

                <IdleTimer ref={ref => { this.idleTimer = ref }}
                    element={document}
                    onActive={this.onActive}
                    onIdle={this.onIdle}
                    onAction={this.onAction}
                    debounce={250}
                    timeout={18000000}
                />
                <Router history={history}>
                    <Route path="/" component={Header} />
                    {/* <Route path = "/" component={SideBar}/> */}
                    <PrivateRoute exact path="/" component={Homepage} />
                    <Route path="/login" component={LogIn} />
                    <Route path="/signup" component={SignUp} />
                    <PrivateRoute path="/workflow" component={Workflow} />
                    <PrivateRoute path="/phase" component={Phase} />
                    <PrivateRoute path="/component" component={Component} />
                    <PrivateRoute path="/formdesigner" component={FormDesigner} />
                    <PrivateRoute path="/events" component={EventList} />
                    <PrivateRoute path="/eventcalendar" component={EventCalendar} />
                    <PrivateRoute path="/eventplanner" component={EventPlanner} />
                    <PrivateRoute path="/eventclosure" component={EventClosureForm} />
                    {/* naming convention  */}
                    <PrivateRoute path="/Form" component={Form} />
                    <PrivateRoute path="/FormRender" component={FormRender} />
                    <PrivateRoute path="/FindPatient" component={FindPatient} />
                    <PrivateRoute path="/PatientDetail" component={PatientDetail} />
                    <PrivateRoute path="/PatientRegistration" component={PatientRegistration} />
                    <PrivateRoute path="/administration" component={AdministrationHome} />
                    <PrivateRoute path="/labtest" component={ManageLabTest} />
                    <PrivateRoute path="/addlabtestattr" component={AddLabTestAttribute} />
                    <PrivateRoute path="/labtestattr" component={ManageLabTestAttribute} />
                    <PrivateRoute path="/testorderlist" component={TestOrderList} />
                    <PrivateRoute path="/testorder" component={AddTestOrder} />
                    <PrivateRoute path="/samplelist" component={SampleList} />
                    <PrivateRoute path="/roles" component={Roles} />
                    <PrivateRoute path="/testresults" component={TestResults} />
                    <PrivateRoute path="/reports" component={Reports} />
                    <PrivateRoute path="/systemsettings" component={SystemSetting} />
                    <PrivateRoute path="/questionlist" component={QuestionList} />
                    <PrivateRoute path="/users" component={UserList} />
                </Router>
                <NotificationContainer />
            </div>

        );
    }

    onAction(e) {
        this.idleTimer.reset();
    }

    onActive(e) {
        this.idleTimer.reset();
    }

    onIdle(e) {
        // if (store.getState().authentication.authorized) {
            userActions.logout();
       // }

    }
};

export default App;
