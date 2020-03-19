import React, { Suspense } from 'react';
import { Router, Route, HashRouter, BrowserRouter, Switch } from 'react-router-dom';
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
import './defaultLayout.css'

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
    loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>
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
                <Router history={history}>
                    <Switch>
                        <Route exact path="/login" component={LogIn} />
                        <Route path="/" render={() => (
                            <div className="app">
                                <Header ></Header>
                                <div className="app-body">
                                    <main className="main">
                                        <Container fluid>
                                            <CustomBreadcrumbs />
                                            <Switch>
                                                <PrivateRoute exact path="/" component={Homepage} />
                                                <PrivateRoute exact path="/workflow" component={Workflow} />
                                                <PrivateRoute exact path="/workflow/phase" component={Phase} />
                                                <PrivateRoute exact path="/workflow/phase/component" component={Component} />
                                                <PrivateRoute exact path="/workflow/phase/component/form" component={Form} />
                                                <PrivateRoute exact path="/event" component={EventList} />
                                                <PrivateRoute exact path="/event/eventcalendar" component={EventCalendar} />
                                                <PrivateRoute exact path="/event/eventplanner" component={EventPlanner} />
                                                <PrivateRoute exact path="/event/eventclosure" component={EventClosureForm} />
                                                <PrivateRoute exact path="/administration" component={AdministrationHome} />
                                            </Switch>
                                        </Container>
                                    </main>
                                </div>
                            </div>

                        )} />
                    </Switch>
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
