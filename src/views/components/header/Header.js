import React from 'react';
import './header.css'
import { Link } from 'react-router-dom';
import { userAction } from '../../../state/ducks/login';
import { connect } from 'react-redux';

class Header extends React.Component {

    capitalizeFirstLetter(name) {
        if (name !== null) return name.charAt(0).toUpperCase() + name.slice(1);

    }
    logout = (e) => {
        e.preventDefault();
        this.props.logout()

    }
    render() {
        if (window.location.pathname === '/login') return null;
        return (

            <div >
                <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow" id="nav-bar" style={{ zIndex: '10000', 'height': '70px' }}>
                    <Link to="/"> <img src={require('../../../assets/logowhite.png')} style={{ width: '119PX', height: '57px' }}></img>  </Link>
                    {/* <Link to="/"><h2 className="heading-appname"><span className="mr-2 d-none d-lg-inline text-gray-600 small" style ={{color:'white' ,fontWeight :'bold'}}>LHC</span></h2></Link>  */}


                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        {/*  <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                            <i className="fa fa-bars"></i>
                        </button>
                         <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                            <div className="input-group">
                                <input type="text" className="form-control bg-light border-0 small" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2" />
                                <div className="input-group-append">
                                    <button className="btn btn-primary" type="button">
                                        <i className="fas fa-search fa-sm"></i>
                                    </button>
                                </div>
                            </div>
                        </form>    */}
                        <ul className="navbar-nav ml-auto " >
                            <div className="topbar-divider d-none d-sm-block"></div>
                            <li className="nav-item dropdown no-arrow">
                                <a className="nav-link dropdown-toggle" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span className="mr-2 d-none d-lg-inline text-gray-600 small" style={{ color: 'white' }}>{this.capitalizeFirstLetter(localStorage.getItem('username'))}</span>
                                    <img className="img-profile rounded-circle" src={require('../../../assets/loggedInUser.png')} />
                                </a>

                                <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                                    {/* <a className="dropdown-item" href="#">
                                        <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400 fb-icon "></i> Profile
                                        </a>
                                    <a className="dropdown-item" href="#">
                                        <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400 fb-icon"></i> Settings
                                        </a>
                                    <div className="dropdown-divider"></div> */}
                                    <a className="dropdown-item" onClick={this.logout}>
                                        <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400  fb-icon"></i> Logout
                                    </a>
                                </div>
                            </li>
                        </ul>

                    </div>
                </nav>

            </div>
        );
    }
}
const mapStateToProps = (state) => ({
    authorized: state.login.authorized
})
const mapDispatchTopProps = ({
    logout: userAction.logout
})

export default connect(mapStateToProps, mapDispatchTopProps)(Header);