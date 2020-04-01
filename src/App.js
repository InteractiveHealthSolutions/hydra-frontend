import React, { Suspense } from 'react';
import { Router, MemoryRouter, Link, Route, HashRouter, BrowserRouter, Switch } from 'react-router-dom';
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
import EventList from './views/components/events/eventlist/EventList';
import EventCalendar from './views/components/events/eventcalender/EventCalendar';
import EventPlanner from './views/components/events/eventplanner/EventPlanner';
import EventClosureForm from './views/components/events/eventclosure/EventClosureForm';
import Form from './views/components/form/Form';
import FindPatient from './views/components/patient/search/FindPatient'
import PatientDetail from './views/components/patient/detail/PatientDetail';
import PatientRegistration from './views/components/patient/create/PatientRegistration';
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
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import SystemSettings from './views/components/administration/systemsettings/systemsettings'
import styled from 'styled-components';
import LocationManagement from './views/components/administration/location/home/LocationManagement';
import FormHome from './views/components/administration/workflowmanagement/formbuilder/FormHome';
import Assets from './views/components/administration/eventmanagement/assets/Assets';
import Services from './views/components/administration/eventmanagement/services/Services';
import Workforce from './views/components/administration/eventmanagement/workforce/Workforce';
import Engine from './views/components/administration/workflowmanagement/ruleengine/Engine'
import Home from './views/components/administration/Home';
import AdminBreadCrumbs from './views/components/breadcrumbs/AdminBreadCrumbs';
import Visits from './views/components/patient/visit/Visit';


const Main = styled.main`
    position: relative;
    overflow: hidden;
    transition: all .15s;
    padding: 0 20px;
    margin-left: ${props => (props.expanded ? 240 : 64)}px;
`;


class App extends React.Component {
    constructor(props) {
        super(props);
        this.idleTimer = null;
        this.onAction = this.onAction.bind(this);
        this.onActive = this.onActive.bind(this);
        this.onIdle = this.onIdle.bind(this);
        this.state = {

            expanded: false
        }
    }

    onbeforeunload = (e) => {

        window.onunload = function () {
            localStorage.clear();
        }
        return 'undefined';
    }

    toggleSidebar = (navigateTo) => {
        console.log("navigateTo", navigateTo)
    }

    onToggle = (expanded) => {

        this.setState({ expanded: expanded });
    };


    loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>
    render() {
        const { expanded } = this.state
        return (
            <>
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
                        <Route exact path="/login" name="Login" component={LogIn} />
                        <Route path="/" render={() => (
                            <div className="app">
                                <Header ></Header>
                                <div className="app-body">
                                    <main className="main">
                                        <Container fluid>
                                            <CustomBreadcrumbs />
                                            <Switch>
                                                <PrivateRoute exact path="/" name="Home" component={Homepage} />
                                                <PrivateRoute exact path="/workflow" name="Workflow" component={Workflow} />
                                                <PrivateRoute exact path="/workflow/phase" component={Phase} />
                                                <PrivateRoute exact path="/workflow/phase/stage" component={Component} />
                                                <PrivateRoute exact path="/workflow/phase/stage/form" component={Form} />
                                                <PrivateRoute exact path="/event" component={EventList} />
                                                <PrivateRoute exact path="/event/eventcalendar" component={EventCalendar} />
                                                <PrivateRoute exact path="/event/eventplanner" component={EventPlanner} />
                                                <PrivateRoute exact path="/event/eventclosure" component={EventClosureForm} />
                                                <PrivateRoute exact path="/reports" component={Reports} />
                                                <PrivateRoute exact path="/FindPatient" component={FindPatient} />
                                                <PrivateRoute exact path="/FindPatient/PatientDetail" component={PatientDetail} />
                                                <PrivateRoute exact path="/PatientRegistration" component={PatientRegistration} />
                                                <PrivateRoute exact path="/FindPatient/PatientDetail/visit" component={Visits}/>
                                                <Route path="/administration" render={() => (
                                                    <>
                                                        <SideNav
                                                            onSelect={this.onSelect}
                                                            style={{ marginTop: '70px', background: 'var(--bg)' }}
                                                            onToggle={this.onToggle}
                                                        >
                                                            <SideNav.Toggle />
                                                            <SideNav.Nav selected={this.selected} >
                                                                <NavItem eventKey="/administration/systemsettings" onClick={this.toggleSidebar}>
                                                                    <NavIcon>
                                                                        <Link to="/administration/systemsettings">
                                                                            <i class="fas fa-cogs" style={{ fontSize: '1.5em', verticalAlign: 'middle' }} />
                                                                        </Link>
                                                                    </NavIcon>
                                                                    <NavText>
                                                                        <Link to="/administration/systemsettings">
                                                                            Advanced Settings
                                                                        </Link>
                                                                    </NavText>
                                                                </NavItem>
                                                                {/* userManagement   */}
                                                                <NavItem eventKey="/user" onClick={this.toggleSidebar}>
                                                                    <NavIcon>
                                                                        <i class="fas fa-users-cog" style={{ fontSize: '1.5em', verticalAlign: 'middle' }} />
                                                                    </NavIcon>
                                                                    <NavText>
                                                                        User Management
                                                                    </NavText>
                                                                    {/* role */}
                                                                    <NavItem eventKey="/administration/roles" onClick={this.toggleSidebar}>
                                                                        <NavText>
                                                                            <Link className={expanded ? "formLink" : ""} to="/administration/roles">
                                                                                <i class="fas fa-users" style={{ fontSize: '1em', verticalAlign: 'middle', marginRight: '14px' }} />
                                                                                 Role
                                                                            </Link>
                                                                        </NavText>
                                                                    </NavItem>
                                                                    {/* create/add */}
                                                                    <NavItem eventKey="/administration/users" onClick={this.toggleSidebar}>
                                                                        <NavText >
                                                                            <Link className={expanded ? "formLink" : ""} to="/administration/users" >
                                                                                <i class="fas fa-user-plus" style={{ fontSize: '1em', verticalAlign: 'middle', marginRight: '10px' }} />
                                                                                 Users
                                                                            </Link>
                                                                        </NavText>
                                                                    </NavItem>
                                                                </NavItem>
                                                                {/* end */}

                                                                <NavItem eventKey="/administration/location" onClick={this.toggleSidebar}>
                                                                    <NavIcon>
                                                                        <Link to="/administration/location">
                                                                            <i class="fas fa-map-marker-alt" style={{ fontSize: '1.5em', verticalAlign: 'middle' }} />
                                                                        </Link>
                                                                    </NavIcon>
                                                                    <NavText>
                                                                        <Link to="/administration/location">
                                                                            Location Management
                                                                        </Link>
                                                                    </NavText>
                                                                </NavItem>

                                                                {/* workflowmanagement */}
                                                                <NavItem eventKey="/workflow" onClick={this.toggleSidebar}>
                                                                    <NavIcon>
                                                                        <i class="fas fa-sitemap" style={{ fontSize: '1.5em', verticalAlign: 'middle' }} />
                                                                    </NavIcon>
                                                                    <NavText>
                                                                        Workflow Management
                                                                    </NavText>
                                                                    <NavItem eventKey="/administration/questions" onClick={this.toggleSidebar}>
                                                                        <NavText >
                                                                            <Link className={expanded ? "formLink" : ""} to="/administration/questions" >
                                                                                <i class="fas fa-cube" style={{ fontSize: '1em', verticalAlign: 'middle', marginRight: '10px' }} />
                                                                                 Question Bank
                                                                            </Link>
                                                                        </NavText>
                                                                    </NavItem>
                                                                    {/* formbuilder */}
                                                                    <NavItem eventKey="/administration/formbuilder" onClick={this.toggleSidebar}>
                                                                        <NavText>
                                                                            <Link className={expanded ? "formLink" : ""} to="/administration/formbuilder" >
                                                                                <i class="fas fa-cubes" style={{ fontSize: '1em', verticalAlign: 'middle', marginRight: '10px' }} />
                                                                                Form Builder
                                                                            </Link>
                                                                        </NavText>
                                                                    </NavItem>
                                                                    {/* //ruleEngine */}
                                                                    <NavItem eventKey="/administration/ruleEngine" onClick={this.toggleSidebar}>
                                                                        <NavText>
                                                                            <Link className={expanded ? "formLink" : ""} to="/administration/ruleEngine" >
                                                                                <i class="fas fa-ruler-combined" style={{ fontSize: '1em', verticalAlign: 'middle', marginRight: '10px' }} />
                                                                                         Rule Engine
                                                                            </Link>
                                                                        </NavText>
                                                                    </NavItem>
                                                                </NavItem>

                                                                {/* eventmanagement */}
                                                                <NavItem eventKey="/event" onClick={this.toggleSidebar}>
                                                                    <NavIcon>
                                                                        <i class="fas fa-calendar-alt" style={{ fontSize: '1.5em', verticalAlign: 'middle' }} />
                                                                    </NavIcon>
                                                                    <NavText>
                                                                        Event Management
                                                                    </NavText>
                                                                    <NavItem eventKey="/administration/services" onClick={this.toggleSidebar}>

                                                                        <NavText>
                                                                            <Link className={expanded ? "formLink" : ""} to="/administration/services">
                                                                                <i className="fas fa-calendar-alt" style={{ fontSize: '1em', verticalAlign: 'middle', marginRight: '10px' }} />
                                                                                     Services
                                                                            </Link>
                                                                        </NavText>
                                                                    </NavItem>
                                                                    <NavItem eventKey="/administration/assets" onClick={this.toggleSidebar}>

                                                                        <NavText>
                                                                            <Link className={expanded ? "formLink" : ""} to="/administration/assets">
                                                                                <i className="fas fa-calendar-alt" style={{ fontSize: '1em', verticalAlign: 'middle', marginRight: '10px' }} />
                                                                                      Assets
                                                                            </Link>
                                                                        </NavText>
                                                                    </NavItem>
                                                                    <NavItem eventKey="/administration/workforce" onClick={this.toggleSidebar}>
                                                                        <NavText >
                                                                            <Link className={expanded ? "formLink" : ""} to="/administration/workforce" >
                                                                                <i className="fas fa-calendar-alt" style={{ fontSize: '1em', verticalAlign: 'middle', marginRight: '10px' }} />
                                                                                     Personnel
                                                                            </Link>
                                                                        </NavText>
                                                                    </NavItem>
                                                                </NavItem>

                                                            </SideNav.Nav>
                                                        </SideNav>
                                                        <Main expanded={expanded} className="ah-container">
                                                            <AdminBreadCrumbs />
                                                            <Switch>
                                                                <Route path="/administration/systemsettings" component={SystemSettings} />
                                                                <Route path="/administration/users" component={UserList} />
                                                                <Route path="/administration/roles" component={Roles} />
                                                                <Route path="/administration/location" component={LocationManagement} />
                                                                <Route path="/administration/ruleEngine" component={Engine} />
                                                                <Route path="/administration/assets" component={Assets} />
                                                                <Route path="/administration/services" component={Services} />
                                                                <Route path="/administration/workforce" component={Workforce} />
                                                                <Route path="/administration/formbuilder" component={FormHome} />
                                                                <Route path="/administration/questions" component={QuestionList} />
                                                                <Route path="/" component={Home} />
                                                            </Switch>
                                                        </Main>
                                                    </>

                                                )} />
                                            </Switch>
                                        </Container>
                                    </main>
                                </div>
                            </div>

                        )} />
                    </Switch>
                </Router>
                <NotificationContainer />
            </>
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
