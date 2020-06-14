import React from "react";
import { connect } from "react-redux";
import "./css/login.css";
import "./css/util.css";
import "./css/main-login.css";
import "./css/animate.css";
import { userAction } from "../../../state/ducks/login";

const initialState = {
  username: "",
  password: "",
  submitted: false,
  authorizedCredential: false,
  userNameErr: "",
  passwordErr: "",
};

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.props.logout();
    this.state = initialState;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  reset() {
    this.setState(initialState);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.authorized !== undefined) {
      this.setState({
        authorizedCredenti: nextProps.authorized,
      });
    }
    if (nextProps.submitted !== undefined) {
      this.setState({
        submitted: nextProps.submitted,
      });
    }
  }

  componentWillUnmount() {
    this.reset();
  }

  //  componentDidMount(){
  //      this.reset()
  //  }

  handleChange(e) {
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({ [name]: value });
    if (name === "username") {
      this.setState({ userNameErr: "" });
    } else if (name === "password") {
      this.setState({ passwordErr: "" });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const { username, password } = this.state;
    if (this.validation()) {
      //this.props.logintest(username, password)
      this.props.login(username, password);
    }
  }

  validation() {
    let isValid = true;
    const { username, password } = this.state;
    if (!username) {
      this.setState({
        userNameErr: "Error",
      });
      isValid = false;
    }
    if (!password) {
      this.setState({
        passwordErr: "Error",
      });
      isValid = false;
    }
    return isValid;
  }

  render() {
    const {
      username,
      password,
      userNameErr,
      passwordErr,
      submitted,
      authorizedCredential,
    } = this.state;
    const { isLoading } = this.props;
    return (
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100">
            <p style={{ color: "red", fontSize: "22px", fontStyle: "bold" }}>
              System is down for maintenance
            </p>
            <div className={isLoading ? "login100-pic rotate" : "login100-pic"}>
              <img src={require("../../../assets/logo.png")} alt="IMG" />
            </div>
            <form
              className="login100-form validate-form"
              onSubmit={this.handleSubmit}
            >
              <span className="login100-form-title">Sign In</span>

              <div className="wrap-input100 ">
                <input
                  className="input100"
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={username}
                  onChange={this.handleChange}
                />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="fa fa-envelope" aria-hidden="true"></i>
                </span>
              </div>
              {userNameErr && (
                <span className="help-block error_spn">
                  Username is required
                </span>
              )}
              <div className="wrap-input100 extra-margin">
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
              </div>
              {passwordErr && (
                <span className="help-block error_spn">
                  Password is required
                </span>
              )}
              <div className="container-login100-form-btn">
                {authorizedCredential === false &&
                submitted &&
                username &&
                password ? (
                  <div className="help-block error_spn">
                    Invalid Credentials
                  </div>
                ) : (
                  ""
                )}
                <button
                  className={
                    isLoading
                      ? "login100-form-btn disabled_btn"
                      : "login100-form-btn"
                  }
                  disabled={isLoading}
                >
                  Login
                </button>
              </div>
              <div className="text-center p-t-136">
                <label className="txt2">Powered by</label>
                <a href="http://www.ihsinformatics.com/">
                  <b style={{ fontSize: "12px" }}> IHS</b>
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  authorized: state.login.authorized,
  submitted: state.login.submitted,
  isLoading: state.login.loading,
});
const mapDispatchTopProps = {
  login: userAction.login,
  logintest: userAction.loginTest,
  logout: userAction.logout,
};

export default connect(mapStateToProps, mapDispatchTopProps)(Login);
