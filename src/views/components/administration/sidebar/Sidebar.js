import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { sidebarConstants } from '../constants';
import { store } from '../helpers';
import { sidebarActions } from '../actions';
import '../style/sidebar.css';

class SideBar extends React.Component {

    constructor(props) {
        super(props);

    }

    selectedTab(name) {
        const { dispatch } = this.props;
        dispatch(sidebarActions.showTab(name));
    }


    render() {
        if (window.location.pathname === "/login") return null;
        return (
            <div className="wrapper">
                <nav id="sidebar">
                    <ul className="list-unstyled-components">
                        <li className={localStorage.getItem('activeTab') === sidebarConstants.SHOW_HOME ? 'active' : ''} onClick={() => (this.selectedTab(sidebarConstants.SHOW_HOME))}>
                            <Link to="/"><i class="fa fa-home" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Home</Link>
                        </li>
                        <li className={localStorage.getItem('activeTab') === sidebarConstants.SHOW_FIND_PATIENT ? 'active' : ''} onClick={() => (this.selectedTab(sidebarConstants.SHOW_FIND_PATIENT))}>
                            <Link to="/"><i class="fa fa-search" aria-hidden="true" ></i>&nbsp;&nbsp;&nbsp;Find Patient</Link>
                        </li>
                        <li className={localStorage.getItem('activeTab') === sidebarConstants.SHOW_REGISTER_PATIENT ? 'active' : ''} onClick={() => (this.selectedTab(sidebarConstants.SHOW_REGISTER_PATIENT))}>
                            <Link to="/signup"><i class="fa fa-user" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Register User</Link>
                        </li>
                        <li>
                            <a href="#reportsmenu" data-toggle="collapse" aria-expanded={localStorage.getItem('activeTab') === sidebarConstants.SHOW_REPORTS ? 'true' : 'false'} className="dropdown-toggle"><i class="fa fa-book" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Reports</a>
                            <ul class="collapse list-unstyled" id="reportsmenu">
                                <li className={localStorage.getItem('activeTab') === sidebarConstants.SHOW_REPORTS ? 'active' : ''} onClick={() => (this.selectedTab(sidebarConstants.SHOW_REPORTS))}>
                                    <Link to="/">Report 1</Link>
                                </li>
                                <li>
                                    <Link to="/">Report 1</Link>
                                </li>
                                <li>
                                    <Link to="/">Report 1</Link>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="#sysmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle"><i class="fa fa-users" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;System <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Administration</a>
                            <ul class="collapse list-unstyled" id="sysmenu">
                                <li>
                                    <a href="#">Report 1</a>
                                </li>
                                <li>
                                    <a href="#">Report 2</a>
                                </li>
                                <li>
                                    <a href="#">Report 3</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <Link to="/"><i class="fa fa-file" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Data Management</Link>
                        </li>
                        <li>
                            <Link to="/"><i class="fa fa-calendar" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Events</Link>
                        </li>
                        <li>
                            <Link to="/"><i class="fa fa-retweet" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Workflows</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const sidebar = state.showTab;
    return { sidebar }
}
export default connect(mapStateToProps)(SideBar);

