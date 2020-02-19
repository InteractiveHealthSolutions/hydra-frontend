import React from 'react';
import { Link } from 'react-router-dom';
import './homepage.css';
import Card from "@material-ui/core/Card";
import Loaders from "../loader/Loader"
import { userAction } from '../../../state/ducks/login';

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: '',
            loading: false
        };


    }
    onMouseHoverIn(tile) {
        this.setState({ hover: tile });
    }
    onMouseHoverOut() {
        this.setState({ hover: '' });
    }
    render() {
        if (this.state.loading) return <Loaders />;
        return (

            <div className="home-div">

                <br />
                <div className="row" style={{ width: '100%', height: '100%' }}>
                    <div className="col-3" style={{ visibility: 'hidden' }}>
                        <Card style={{ width: '20rem', height: '32rem', marginLeft: '18px' }}>
                            <div className="card-header" id="card-header">
                                <h3 style={{ color: '#696969' }}> Information </h3>
                                <hr id="for-info" />
                            </div>

                            <div className="card-body">

                                {
                                    this.state.hover === 'Find Patient'
                                    &&
                                    <ul>
                                        <li>Dummy Data</li>

                                    </ul>
                                }
                            </div>
                        </Card>
                    </div>
                    <div className="col-9 col-sm-8">

                        <Card style={{ width: '62rem', height: '32rem', marginLeft: '-160px', marginTop: '18px' }}>
                            <div className="card-header" id="card-header">
                                <h3 style={{ color: '#696969' }}> Home </h3>
                                <hr id="for-home" />
                            </div>

                            <div className="row" id="menu-row">
                                <div className="col-md-3 col-sm-6">
                                    <Link to="/FindPatient">
                                        <div className="box-first" onMouseEnter={() => this.onMouseHoverIn('Find Patient')} onMouseLeave={() => this.onMouseHoverOut()}>
                                            <img id="icon-img" src={require('../../../assets/searchpatient.png')} alt="" />
                                            <div className="tag-name"><h5 className="h5">Find Patient</h5></div>

                                        </div>
                                    </Link>
                                </div>
                                <div className="col-md-3 col-sm-6">
                                    {/* <Link to="/reports"> */}
                                        <div className="box" onMouseEnter={() => this.onMouseHoverIn('Reports')} onMouseLeave={() => this.onMouseHoverOut()}>
                                            <img id="icon-img" src={require('../../../assets/report.png')} alt="" />
                                            <div className="tag-name-reports"><h5 className="h5">Reports</h5></div>
                                        </div>
                                    {/* </Link> */}
                                </div>
                                <div className="col-md-3 col-sm-6">
                                    <Link to="/events">
                                        <div className="box" onMouseEnter={() => this.onMouseHoverIn('Events')} onMouseLeave={() => this.onMouseHoverOut()}>
                                            <img id="icon-img" src={require('../../../assets/events.png')} alt="" />
                                            <div className="tag-name-events"> <h5 className="h5">Events</h5></div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-md-3 col-sm-6">
                                    <Link to="/workflow">
                                        <div className="box" onMouseEnter={() => this.onMouseHoverIn('Workflows')} onMouseLeave={() => this.onMouseHoverOut()}>
                                            <img id="icon-img" src={require('../../../assets/workflow.png')} alt="" />
                                            <div className="tag-name-workflows"><h5 className="h5">Workflows</h5></div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            <div className="row" id="menu-row2">
                                <div className="col-md-3 col-sm-2">
                                    <Link to="/administration">
                                        <div className="box-first" onMouseEnter={() => this.onMouseHoverIn('System Administration')} onMouseLeave={() => this.onMouseHoverOut()}>
                                            <img id="icon-img" src={require('../../../assets/administration.png')} alt="" />
                                            <div className="tag-name-system"><h6>Administration</h6></div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-md-3 col-sm-2">
                                    <div className="box" onMouseEnter={() => this.onMouseHoverIn('Dashboard')} onMouseLeave={() => this.onMouseHoverOut()}>
                                        <img id="icon-img" src={require('../../../assets/dashboard.png')} alt="" />
                                        <div className="tag-name-workflows"><h5 className="h5">Dashboard</h5></div>
                                    </div>
                                </div>
                                {/*   <div className="col-md-3 col-sm-2">
                                    <Link to="/signup">
                                        <div className="box-first" onMouseEnter={() => this.onMouseHoverIn('Add User')} onMouseLeave={() => this.onMouseHoverOut()}>
                                          <i className="fa fa-user-plus fa-5x" aria-hidden="true" id="icon-wide"></i> 
                                            <img id="icon-img" src={require('../assets/adduser.png')} alt="" />
                                            <div className="tag-name-user">
                                                <h5 className="h5">Add User</h5>
                                            </div>
                                        </div>
                                    </Link>
                                </div>*/}
                                <div className="col-md-3 col-sm-2">
                                    {/* <Link to="/formdesigner"> */}
                                    <div className="box-first" onMouseEnter={() => this.onMouseHoverIn('Help')} onMouseLeave={() => this.onMouseHoverOut()}>
                                        <img id="icon-img" src={require('../../../assets/help.png')} alt="" />
                                        <div className="tag-name-help">
                                            <h5 className="h5">Help</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        )
    };
}

export default HomePage;