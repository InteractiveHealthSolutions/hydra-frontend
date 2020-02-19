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
        if (nextProps.authorized !== undefined) {
            await this.setState({
                authorizedCredenti  : nextProps.authorized
            })
        }
        if (nextProps.submitted !== undefined) {
            await this.setState({
                submitted: nextProps.submitted
            })
        }
    }
    componentDidMount() {
        this.setState({
            username: '',
            password: '',
            submitted: false,
            authorizedCredential: false
        })
    }

    componentWillUnmount() {
        this.setState({
            username: '',
            password: '',
            submitted: false,
            authorizedCredential: false
        })
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
        const { username, password } =  this.state;
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
                                Sign In
                            </span>

                            <div className="wrap-input100 ">
                                <input
                                    className="input100"
                                    type="text"
                                    name="username"
                                    placeholder="User Name"
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