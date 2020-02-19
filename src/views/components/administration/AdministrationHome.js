import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import styled from 'styled-components';
import { MemoryRouter, Switch, Route, Link } from 'react-router-dom';
import Engine from './ruleengine/Engine'
import { history } from '../../../history'
import LocationManagement from './location/home/LocationManagement';
import SignUp from './user/signup/SignUp';
import Assets from './eventmanagement/assets/Assets';
import Services from './eventmanagement/services/Services';
import Workforce from './eventmanagement/workforce/Workforce';
import Questions from './questions/Question';
import './administrationhome.css'
import FormBuilder from './FormBuilder/FormBuilder';
import Roles from './roles/roles'
import SystemSettings from './systemsettings/systemsettings'
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

    static propTypes = {
        prop: PropTypes
    }

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
                            <NavItem eventKey="/ruleEngine" onClick={this.toggleSidebar}>
                                <NavIcon>
                                    <Link to="/ruleEngine">
                                        <i class="fas fa-ruler-combined" style={{ fontSize: '1.5em', verticalAlign: 'middle' }} />
                                    </Link>
                                </NavIcon>
                                <NavText>
                                    <Link to="/ruleEngine">
                                        Rule Engine
                                    </Link>
                                </NavText>
                            </NavItem>
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
                            <NavItem eventKey="/users" onClick={this.toggleSidebar}>
                                <NavIcon>
                                    <Link to="/users">
                                        <i class="fas fa-users-cog" style={{ fontSize: '1.5em', verticalAlign: 'middle' }} />
                                    </Link>
                                </NavIcon>
                                <NavText>
                                    <Link to="/users">
                                        User Management
                                    </Link>
                                </NavText>
                            </NavItem>
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
                                            <i className="fas fa-calendar-alt" style={{ fontSize: '1em', verticalAlign: 'middle', marginRight: '10px' }} />  Services
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
                                            Workforce
                                        </Link>
                                    </NavText>
                                </NavItem>
                            </NavItem>
                            <NavItem eventKey="/questions" onClick={this.toggleSidebar}>
                                <NavIcon>
                                    <Link to="/questions">
                                        <i class="fas fa-cube" style={{ fontSize: '1.5em', verticalAlign: 'middle' }} />
                                    </Link>
                                </NavIcon>
                                <NavText>
                                    <Link to="/questions">
                                       Question Bank
                                    </Link>
                                </NavText>
                            </NavItem>
                            <NavItem eventKey="/formbuilder" onClick={this.toggleSidebar}>
                                <NavIcon>
                                    <Link to="/formbuilder">
                                        <i class="fas fa-cubes" style={{ fontSize: '1.5em', verticalAlign: 'middle' }} />
                                    </Link>
                                </NavIcon>
                                <NavText>
                                    <Link to="formbuilder">
                                       Form Builder
                                    </Link>
                                </NavText>
                            </NavItem>
                            <NavItem eventKey="/roles" onClick={this.toggleSidebar}>
                                <NavIcon>
                                    <Link to="/roles">
                                        <i class="fas fa-users" style={{ fontSize: '1.5em', verticalAlign: 'middle' }} />
                                    </Link>
                                </NavIcon>
                                <NavText>
                                    <Link to="/roles">
                                        Role Management
                                    </Link>
                                </NavText>
                            </NavItem>
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
                            <Route path="/users" component={SignUp} />
                            <Route path="/assets" component={Assets} />
                            <Route path="/services" component={Services} />
                            <Route path="/workforce" component={Workforce} />
                            <Route path="/questions" component={Questions} />
                            <Route path="/formbuilder" component={FormBuilder} />
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
