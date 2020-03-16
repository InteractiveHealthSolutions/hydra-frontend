import React from 'react';
import { Router, Route, HashRouter, Switch } from 'react-router-dom';
import LogIn from './views/components/login/Login';
import { history } from './history'
import IdleTimer from 'react-idle-timer'
import { PrivateRoute } from './views/components/route/PrivateRoute';
import Homepage from './views/components/home/Homepage';
import { userActions } from './store/actions';
import { store } from './state/store';
import SignUp from './views/components/administration/user/signup/SignUp';
import Header from './views/components/header/Header';
import Workflow from './views/components/workflow/Workflow';
import Phase from './views/components/phases/Phase';
import Component from './views/components/stages/Component';
import FormDesigner from './views/components/form/formdesigner/FormDesigner';
import EventList from './views/components/events/eventlist/EventList';
import EventCalendar from './views/components/events/eventcalender/EventCalendar';
import EventPlanner from './views/components/events/eventplanner/EventPlanner';
import EventClosureForm from './views/components/events/eventclosure/EventClosureForm';
import FormRender from './views/components/form/formdesigner/FormRender';
import Form from './views/components/form/Form';
import FindPatient from './views/components/patient/search/FindPatient'
import PatientDetail from './views/components/patient/detail/PatientDetail';
import PatientRegistration from './views/components/patient/create/PatientRegistration';
import AdministrationHome from './views/components/administration/AdministrationHome'
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";
import ManageLabTest from './views/components/manageLabTest/ManageLabTest'
import AddLabTestAttribute from './views/components/addlabtestattribute/AddLabTestAttribute';
import ManageLabTestAttribute from './views/components/manageLabTestAttribute/ManageLabTestAttribute'
import TestOrderList from './views/components/labtestorder/TestOrderList'
import AddTestOrder from './views/components/labtestorder/AddTestOrder';
import SampleList from './views/components/labtestsample/samplelist';
import Roles from './views/components/administration/roles/roles';
import QuestionList from './views/components/administration/workflowmanagement/questions/QuestionList'
import TestResults from './views/components/testresults/TestResuts';
import Reports from './views/components/Reports/Reports'
import SystemSetting from './views/components/administration/systemsettings/systemsettings'
import UserList from './views/components/administration/user/userlist'
import CustomBreadcrumbs from './views/components/breadcrumbs/CustomBreadcrumbs';
import { Container } from 'reactstrap';

const Login = React.lazy(() => import('./views/components/login/Login'));
const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
const DefaultLayout = React.lazy(() => import('./DefaultLayout'));


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
                    timeout={1800000}
                />
                {/* 
                <Router history={history}>
                    <React.Suspense fallback={loading()}>
                        <Switch>
                            <Route exact path="/login" name="Login Page" render={props => <Login {...props} />} />
                            <Route path="/" name="Home" render={props => <DefaultLayout {...props} />} />
                        </Switch>
                    </React.Suspense>
                </Router> */}
                            <Router history={history}>
                                <Route path="/" component={Header} />
                                <PrivateRoute exact path="/" component={Homepage} />
                                <Route path="/login" component={LogIn} />
                                <Route path="/signup" component={SignUp} />
                                <PrivateRoute exact path="/workflow" component={Workflow} />
                                <PrivateRoute path="/phase" component={Phase} />
                                <PrivateRoute path="/component" component={Component} />
                                <PrivateRoute path="/formdesigner" component={FormDesigner} />
                                <PrivateRoute path="/events" component={EventList} />
                                <PrivateRoute path="/eventcalendar" component={EventCalendar} />
                                <PrivateRoute path="/eventplanner" component={EventPlanner} />
                                <PrivateRoute path="/eventclosure" component={EventClosureForm} />
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
        localStorage.clear()
        userActions.logout();
        // }

    }
};

export default App;
