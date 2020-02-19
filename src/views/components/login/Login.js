import React from 'react';
import { connect } from 'react-redux';
import './css/login.css'
import './css/util.css'
import './css/main-login.css'
import './css/animate.css'
import { userAction } from '../../../state/ducks/login';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.props.logout();
        this.state = {
            username: '',
            password: '',
            submitted: false,
            authorizedCredential: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    async componentWillReceiveProps(nextProps) {
        console.log("nextProps.authorized", nextProps.authorized)
        if (nextProps.authorized !== undefined) {
            await this.setState({
                authorizedCredential: nextProps.authorized
            })
        }
        if (nextProps.submitted !== undefined) {
            await this.setState({
                submitted: nextProps.submitted
            })
        }
    }

    //form event handlers
    handleChange(e) {
        e.preventDefault();
        const { name, value } = e.target;
        this.setState({ [name]: value });
        this.setState({ submitted: false });
    }

    handleSubmit(e) {
        e.preventDefault();
        // localStorage.setItem('username', "irtiza.ahmed");
        // localStorage.setItem('password', "Irtiza1234");
        // history.push("/");
        // this.setState({ submitted: true });
        const { username, password } = this.state;
        if (username && password) {
            this.props.login(username, password)
        }
    }

    render() {

        const { username, password, submitted, authorizedCredential } = this.state;
        return (

            <div className="limiter">
                <div className="container-login100">
                    <div className="wrap-login100">
                        <div className="login100-pic rotate" >
                            <img src={require('../../../assets/logo.png')} alt="IMG" />
                        </div>

                        <form className="login100-form validate-form" onSubmit={this.handleSubmit}>
                            <span className="login100-form-title">
                                {/* Lung  Health <span>Corporation</span> */}
                                Sign In
                            </span>

                            <div className="wrap-input100 ">
                                <input
                                    className="input100"
                                    type="text"
                                    name="username"
                                    value={username}
                                    onChange={this.handleChange}
                                />
                                <span className="focus-input100"></span>
                                <span className="symbol-input100">
                                    <i className="fa fa-envelope" aria-hidden="true"></i>
                                </span>
                                {submitted && !username &&
                                    <div className="help-block" style={{ color: '#ff0000', marginLeft: '30px' }}>Username is required</div>
                                }
                            </div>

                            <div className="wrap-input100 " >
                                <input
                                    className="input100"
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={this.handleChange}
                                />
                                <span className="focus-input100"></span>
                                <span className="symbol-input100">
                                    <i className="fa fa-lock" aria-hidden="true"></i>
                                </span>
                                {submitted && !password &&
                                    <div className="help-block" style={{ color: '#ff0000', marginLeft: '30px' }}>Password is required</div>
                                }
                            </div>

                            <div class="container-login100-form-btn">
                                {(authorizedCredential === false && submitted && username && password) ?
                                    <div className="help-block" style={{ color: '#ff0000', marginLeft: '30px' }}>Invalid Credentials</div>
                                    : ""
                                }
                                <button className="login100-form-btn">
                                    Login
                                </button>
                            </div>
                            <div class="text-center p-t-136">
                                <a class="txt2" href="#">
                                    Powered by
                                </a>
                                <b style={{ fontSize: '12px' }}> IHS</b>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        );

        // <div className="login-container">

        //     <div className="main-card">
        //         <br /><br />
        //         <h2 className="page-title" >Hydra Web App</h2>

        //         <div className="card card-signin my-5">
        //             <div className="card-body">
        //                 <h5 className="card-title text-center">Sign In</h5>
        //                 <form className="form-signin" onSubmit={this.handleSubmit}>
        //                     <div className="form-group">
        //                         <label htmlFor="username">
        //                             Username
        //             </label>
        //                         <input type="text" className="form-control" name="username" value={username} onChange={this.handleChange} />
        //                         {submitted && !username &&
        //                             <div className="help-block" style={{ color: '#ff0000', marginLeft: '30px' }}>Username is required</div>
        //                         }
        //                     </div>
        //                     <div className="form-group">
        //                         <label htmlFor="password">
        //                             Password
        //             </label>
        //                         <input type="password" className="form-control" name="password" value={password} onChange={this.handleChange} />
        //                         {submitted && !password &&
        //                             <div className="help-block" style={{ color: '#ff0000', marginLeft: '30px' }}>Password is required</div>
        //                         }
        //                     </div>
        //                     {
        //                         store.getState().authentication.authorized === false && submitted && username && password &&
        //                         <div className="help-block" style={{ color: '#ff0000', marginLeft: '30px' }}>Invalid Credentials</div>
        //                     }
        //                     <button className="btn btn-lg btn-primary btn-block text-uppercase">Login</button>

        //                 </form>
        //             </div>
        //         </div>
        //     </div>
        // </div>




    }

};
const mapStateToProps = (state) => ({
    authorized: state.login.authorized,
    submitted: state.login.submitted
})
const mapDispatchTopProps = ({
    login: userAction.login,
    logout: userAction.logout
})

export default connect(mapStateToProps, mapDispatchTopProps)(Login);