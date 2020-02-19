import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import styled from 'styled-components';
import { MemoryRouter, Switch, Route, Link } from 'react-router-dom';
import Engine from './workflowmanagement/ruleengine/Engine'
import { history } from '../../../history'
import LocationManagement from './location/home/LocationManagement';
import SignUp from './user/signup/SignUp';
import Assets from './eventmanagement/assets/Assets';
import Services from './eventmanagement/services/Services';
import Workforce from './eventmanagement/workforce/Workforce';
import Questions from './workflowmanagement/questions/Question';
import QuestionList from './workflowmanagement/questions/QuestionList';
import './administrationhome.css'
import Roles from './roles/roles'
import SystemSettings from './systemsettings/systemsettings'
import FormHome from './workflowmanagement/formbuilder/FormHome';
import UserList from './user/userlist'

import Home from './Home';
const Main = styled.main`
    position: relative;
    overflow: hidden;
    transition: all .15s;
    padding: 0 20px;
    margin-left: ${props => (props.expanded ? 240 : 64)}px;
`;


export default class AdministrationHome extends Component {
    state = {
        selected: 'home',
        expanded: false
    };

    onSelect = (select) => {
        if (select === 'back') {
            history.push("/")
        }
        this.setState({
            selected: select
        });
    };

    onToggle = (expanded) => {

        this.setState({ expanded: expanded });
    };


    toggleSidebar = event => {
        // this.setState({ 
        //     expanded: false 
        //   });
        //   event.preventDefault();
    }

    render() {
        const { expanded, selected } = this.state
        return (
            <div >
                <MemoryRouter>
                    <SideNav

                        onSelect={this.onSelect}
                        style={{ marginTop: '70px', background: 'var(--bg)' }}
                        onToggle={this.onToggle}
                    >
                        <SideNav.Toggle />
                        <SideNav.Nav selected={this.selected} >

                            <NavItem eventKey="/systemsettings" onClick={this.toggleSidebar}>
                                <NavIcon>
                                    <Link to="/systemsettings">
                                        <i class="fas fa-cogs" style={{ fontSize: '1.5em', verticalAlign: 'middle' }} />
                                    </Link>
                                </NavIcon>
                                <NavText>
                                    <Link to="/systemsettings">
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
                                {/* create/add */}
                                <NavItem eventKey="/users" onClick={this.toggleSidebar}>
                                    <NavText >
                                        <Link className={expanded ? "formLink" : ""} to="/users" >
                                            <i class="fas fa-user-plus" style={{ fontSize: '1em', verticalAlign: 'middle', marginRight: '10px' }} />
                                            Create User
                                        </Link>
                                    </NavText>
                                </NavItem>
                                {/* role */}
                                <NavItem eventKey="/roles" onClick={this.toggleSidebar}>
                                    <NavText>
                                        <Link className={expanded ? "formLink" : ""} to="/roles">
                                            <i class="fas fa-users" style={{ fontSize: '1em', verticalAlign: 'middle', marginRight: '14px' }} />
                                            Role
                                         </Link>
                                    </NavText>
                                </NavItem>
                            </NavItem>
                            {/* end */}

                            <NavItem eventKey="/location" onClick={this.toggleSidebar}>
                                <NavIcon>
                                    <Link to="/location">
                                        <i class="fas fa-map-marker-alt" style={{ fontSize: '1.5em', verticalAlign: 'middle' }} />
                                    </Link>
                                </NavIcon>
                                <NavText>
                                    <Link to="/location">
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
                                <NavItem eventKey="/questions" onClick={this.toggleSidebar}>
                                    <NavText >
                                        <Link className={expanded ? "formLink" : ""} to="/questions" >
                                            <i class="fas fa-cube" style={{ fontSize: '1em', verticalAlign: 'middle', marginRight: '10px' }} />
                                            Question Bank
                                        </Link>
                                    </NavText>
                                </NavItem>
                                {/* formbuilder */}
                                <NavItem eventKey="/formbuilder" onClick={this.toggleSidebar}>
                                    <NavText>
                                        <Link className={expanded ? "formLink" : ""} to="/formbuilder" >
                                            <i class="fas fa-cubes" style={{ fontSize: '1em', verticalAlign: 'middle', marginRight: '10px' }} />
                                            Form Builder
                                        </Link>
                                    </NavText>
                                </NavItem>
                                {/* //ruleEngine */}
                                <NavItem eventKey="/ruleEngine" onClick={this.toggleSidebar}>
                                    <NavText>
                                        <Link className={expanded ? "formLink" : ""} to="/ruleEngine" >
                                            <i class="fas fa-ruler-combined" style={{ fontSize: '1em', verticalAlign: 'middle', marginRight: '10px' }} />
                                            Rule Engine
                                        </Link>
                                    </NavText>
                                </NavItem>
                            </NavItem>
                            {/* end  */}
                            <NavItem eventKey="/event" onClick={this.toggleSidebar}>
                                <NavIcon>
                                    <i class="fas fa-calendar-alt" style={{ fontSize: '1.5em', verticalAlign: 'middle' }} />
                                </NavIcon>
                                <NavText>
                                    Event Management
                                </NavText>
                                <NavItem eventKey="/services" onClick={this.toggleSidebar}>

                                    <NavText>
                                        <Link className={expanded ? "formLink" : ""} to="/services">
                                            <i className="fas fa-calendar-alt" style={{ fontSize: '1em', verticalAlign: 'middle', marginRight: '10px' }} />
                                            Services
                                        </Link>
                                    </NavText>
                                </NavItem>
                                <NavItem eventKey="/assets" onClick={this.toggleSidebar}>

                                    <NavText>
                                        <Link className={expanded ? "formLink" : ""} to="/assets">
                                            <i className="fas fa-calendar-alt" style={{ fontSize: '1em', verticalAlign: 'middle', marginRight: '10px' }} />
                                            Assets
                                        </Link>
                                    </NavText>
                                </NavItem>
                                <NavItem eventKey="/workforce" onClick={this.toggleSidebar}>
                                    <NavText >
                                        <Link className={expanded ? "formLink" : ""} to="/workforce" >
                                            <i className="fas fa-calendar-alt" style={{ fontSize: '1em', verticalAlign: 'middle', marginRight: '10px' }} />
                                            Personnel
                                        </Link>
                                    </NavText>
                                </NavItem>
                            </NavItem>

                            <NavItem eventKey="back">
                                <NavIcon>
                                    <i class="fa fa-arrow-left" style={{ fontSize: '1.5em', verticalAlign: 'middle' }} />
                                </NavIcon>
                                <NavText>
                                    Go Back
                                        </NavText>
                            </NavItem>

                        </SideNav.Nav>
                    </SideNav>
                    <Main expanded={expanded} className="ah-container">
                        <Switch>
                            <Route path="/ruleEngine" component={Engine} />
                            <Route path="/location" component={LocationManagement} />
                            <Route path="/users" component={UserList} />
                            <Route path="/assets" component={Assets} />
                            <Route path="/services" component={Services} />
                            <Route path="/workforce" component={Workforce} />
                            {/* <Route path="/questions" component={Questions} /> */}
                            {/* <Route path="/formbuilder" component={FormBuilder} /> */}
                            <Route path="/formbuilder" component={FormHome} />
                            <Route path="/questions" component={QuestionList} />
                            <Route path="/roles" component={Roles} />
                            <Route path="/systemsettings" component={SystemSettings} />
                            <Route path="/" component={Home} />


                        </Switch>
                    </Main>
                </MemoryRouter>
            </div>
        )
    }
}
