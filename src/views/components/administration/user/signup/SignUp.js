import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './signup.css';
import { roleservice } from '../../../../../services';
import { userActions } from '../../../../../store/actions';
import { createNotification } from '../../../../../utilities/helpers/helper';
import { store } from '../../../../../state/store';
import { history } from '../../../../../history'
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";



class SignUp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {
                familyname: '',
                givenname: '',
                gender: '',
                provider: '',
                username: '',
                password: '',
                confirmpassword: '',
                forcepwdchange: '',
                dateofbirth: '',
                role: [],
                cnic: ''
            },
            submitted: false,
            invalidPassword: false,
            noRoleSelected: false,
            items: [],
            startDate: '',
            roles: []
        };
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.handleDateChangeRaw = this.handleDateChangeRaw.bind(this);

    }

    handleDateChangeRaw(e) {
        e.preventDefault();
    }
    handleChangeDate(date) {
        const { user } = this.state;

        this.setState({
            user: {
                ...user,
                dateofbirth: date
            }
        });
    }
    onKeyDown(e) {

        if (e.key === 'Backspace' && (e.target.value.length === 6 || e.target.value.length === 14)) {
            const { name, value } = e.target;
            const { user } = this.state;
            this.setState({
                user: {
                    ...user,
                    [name]: value.slice(0, value.length - 1)
                }
            });
        }


    }
    cancelButtonAction() {
        history.push('/');
    }
    handleChange(event) {
        if (event.target.name.includes('role')) {
            event.target.checked ? this.state.roles.push(event.target.value) :
                this.state.roles.pop(event.target.value);
            this.setState({ noRoleSelected: false });
        }
        else if (event.target.name === 'cnic' && (event.target.value.length === 5 || event.target.value.length === 13)) {
            const { name, value } = event.target;
            const { user } = this.state;
            this.setState({
                user: {
                    ...user,
                    [name]: value + '-'
                }
            });
        }
        else if (event.target.name === 'password' || event.target.name === 'confirmpassword') {
            this.setState({ invalidPassword: false });

            const { name, value } = event.target;
            const { user } = this.state;
            this.setState({
                user: {
                    ...user,
                    [name]: value
                }
            });

        }
        else {
            const { name, value } = event.target;
            const { user } = this.state;
            this.setState({
                user: {
                    ...user,
                    [name]: value
                }
            });

        }
    }
    roleHelper() {
        const roles = [];
        this.state.items.forEach(element => {
            roles.push(
                <div className="col-sm-6">
                    <div className="form-check">
                        <input className="form-check-input" type='checkbox' name={element.display + 'role'} value={element.uuid} onChange={this.handleChange} />
                        <label className="form-check-label" htmlFor="gridRadios3">{element.display} </label>
                    </div>
                </div>);
        });
        return roles;
    }
    componentDidMount() {
        roleservice.getAllRoles().then(data => {
            this.setState({ items: data.results });
            this.roleHelper();

        });
    }
    handleSubmit(e) {
        e.preventDefault();
        const { user } = this.state;
        if (user.password !== user.confirmpassword) {
            this.setState({
                invalidPassword: true
            });
        }
        else if (this.state.roles.length === 0) {
            this.setState({
                noRoleSelected: true
            });
        }
        else {

            this.state.roles.forEach(element => {
                this.state.user.role.push(element);
            });
            this.setState({
                submitted: true
            });
            const { dispatch } = this.props;
            dispatch(userActions.register(user));
            createNotification('success', 'User Registered Successfully');
        }


    }

    render() {
        const { user, submitted, invalidPassword } = this.state;
        // && store.getState().registration.message !== '' className={(submitted) || this.invalidPassword ? 'base-container-custom' : 'base-container'}
        return (
            <div className="base-container">
                <h4 style={{ fontWeight: '220px', color: '#696969', marginLeft: '25px' }}>Add New User</h4>
                <hr className="for-add-user" />
                <form onSubmit={this.handleSubmit}>
                    <div className="row">
                        <div className="col-6">
                            <div className="form-group row" style={{ marginLeft: '25px' }}>
                                <label htmlFor="familyname" class="col-sm-6 col-form-label">Family Name</label>
                                <div class="col-sm-6">
                                    <input type="text" className="form-control" name="familyname" pattern="[a-zA-Z]+\s?[a-zA-Z]{1,15}" placeholder="max 15 characters (no space)" maxlength="15" value={user.familyname} onChange={this.handleChange} required />
                                </div>
                            </div>
                            <div className="form-group row" style={{ marginLeft: '25px' }}>
                                <label htmlFor="givenname" className="col-sm-6 col-form-label">Given Name</label>
                                <div class="col-sm-6">
                                    <input type="text" className="form-control" name="givenname" pattern="^[a-zA-Z]{1,15}" placeholder="max 15 characters (no space)" maxlength="15" value={user.givenname} onChange={this.handleChange} required />
                                </div>
                            </div>
                            <div class="form-group row" style={{ marginLeft: '25px' }}>
                                <label htmlFor="gender" className="col-sm-6 col-form-label">Gender</label>
                                <div className="col-sm-6">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="gender" value="M" onChange={this.handleChange} required />
                                                <label className="form-check-label" htmlFor="gender" >
                                                    Male
                                    </label>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="gender" value="F" onChange={this.handleChange} />
                                                <label className="form-check-label" htmlFor="gender">
                                                    Female
                                    </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group row" style={{ marginLeft: '25px' }}>
                                <label htmlFor="provider" className="col-sm-6 col-form-label">Add Provider</label>
                                <div className="col-sm-6">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="provider" id="gridRadios1" value="yes" onChange={this.handleChange} required />
                                                <label className="form-check-label" htmlFor="gridRadios3" >
                                                    Yes
                                    </label>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="provider" id="gridRadios2" onChange={this.handleChange} value="no" />
                                                <label className="form-check-label" htmlFor="gridRadios4">
                                                    No
                                    </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group row" style={{ marginLeft: '25px' }}>
                                <label htmlFor="username" class="col-sm-6 col-form-label">Username</label>
                                <div class="col-sm-6">
                                    <input type="text" className="form-control" name="username" value={user.username} title="Username should start with an alphabet, Can contain [numbers, underscore, dash and dot]" maxLength="10" minLength="4" pattern="^[^0-9][A-Za-z0-9]+(?:[ _-.][A-Za-z0-9]+)*" autoComplete="off" onChange={this.handleChange} required />
                                </div>
                            </div>
                            <div className="form-group row" style={{ marginLeft: '25px' }}>
                                <label htmlFor="password" class="col-sm-6 col-form-label">Password</label>
                                <div class="col-sm-6">
                                    <input type="password" className="form-control" name="password" value={user.password} autoComplete="off" maxLength="15" title="Please enter password containing one uppercase letter, one lowercase letter and a number (min characters 8)" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,15}$" onChange={this.handleChange} required />
                                </div>
                            </div>
                            <div className="form-group row" style={{ marginLeft: '25px' }}>
                                <label htmlFor="confirmpassword" class="col-sm-6 col-form-label">Confirm Password</label>
                                <div class="col-sm-6">
                                    <input type="password" className="form-control" name="confirmpassword" maxLength="15" value={user.confirmpassword} onChange={this.handleChange} required />
                                    {invalidPassword &&
                                        <div className="help-block" style={{ color: '#ff0000', marginLeft: '30px' }}>Password and Confirm Password do not match</div>
                                    }
                                </div>
                            </div>
                            <div class="form-group row" style={{ marginLeft: '25px' }}>
                                <label htmlFor="forcepwdchange" className="col-sm-6 col-form-label">Force Password Change?</label>
                                <div className="col-sm-6">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="forcepwdchange" id="gridRadios1" value="yes" onChange={this.handleChange} required />
                                                <label className="form-check-label" htmlFor="gridRadios3" >
                                                    Yes
                                    </label>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="forcepwdchange" id="gridRadios2" value="no" onChange={this.handleChange} />
                                                <label className="form-check-label" htmlFor="gridRadios4">
                                                    No
                                    </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group row" style={{ marginTop: '-18px', marginLeft: '25px' }}>
                                {/* {submitted && store.getState().registration.message !== '' &&
                                    <div className="help-block" style={{ color: '#ff0000', marginLeft: '30px' }}>{store.getState().registration.message}</div>
                                } */}
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-group row" style={{ marginLeft: '25px' }}>
                                <label htmlFor="dateofbirth" class="col-sm-6 col-form-label">Date of Birth</label>
                                <div class="col-sm-6">
                                    <DatePicker selected={user.dateofbirth} showMonthDropdown
                                        showYearDropdown onChangeRaw={this.handleDateChangeRaw} onChange={this.handleChangeDate} className="form-control user-date-picker" maxDate={new Date()} dateFormat="dd/MM/yyyy" placeholderText="Click to select a date" required />
                                </div>
                            </div>
                            <div className="form-group row" style={{ marginLeft: '25px' }}>
                                <label htmlFor="cnic" class="col-sm-6 col-form-label">CNIC</label>
                                <div class="col-sm-6">
                                    <input type="text" style={{ marginLeft: '-50px' }} className="form-control" name="cnic" maxlength="15" autoComplete="off" placeholder="xxxxx-xxxxxxx-x" pattern="^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$" value={user.cnic} onChange={this.handleChange} onKeyDown={this.onKeyDown} required />
                                </div>
                            </div>

                            <div className="form-group row" style={{ marginLeft: '25px' }}>
                                <label htmlFor="role" className="col-sm-6 col-form-label">Roles</label>
                                <br />
                                <hr className="hr-role" />
                                <br />
                                <br />
                                <div className="row" style={{ marginLeft: "2px" }}>
                                    <div className="col-sm-6">
                                        <div className="row" style={{ height: '200px', overflowY: 'scroll', overflowX: 'hidden' }}>
                                            {this.roleHelper()}
                                            {this.state.noRoleSelected &&
                                                <div className="help-block" style={{ color: '#ff0000', marginLeft: '30px' }}>Please select atleast one role</div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* <div className="form-group row" style = {{marginLeft : '25px'}}>
                  <label className="col-sm-6 col-form-label">Provider Details</label>
                  <hr style = {{color : '#335fff' , backgroundColor : '#335fff' , height : '2px' , width : '200px' , marginLeft: '-308px' ,marginTop: '35px'}}/>
               </div>
               <div className="form-group row" style = {{marginLeft : '25px'}}>
                    <label htmlFor="identifier" class="col-sm-6 col-form-label">Identifier</label>
                    <div class="col-sm-6">
                        <input type="text" className="form-control" style = {{marginLeft : '-50px'}} name="identifier" />
                    </div>
                </div> */}
                            <div className="form-group row" style={{ marginLeft: '50px' }}>

                                <div className="col-sm-6">
                                </div>
                                <div className="col-sm-6">
                                    {/* <Link to="/">
                                        <button type="button" className="btn btn-danger" id="cancel-button">Cancel</button>
                                    </Link> */}
                                    <button type="submit" className="btn btn-primary" style={{ right: '0', position: 'absolute', marginRight: '32px' }}>Add User</button>

                                </div>

                            </div>

                        </div>
                    </div>
                </form>
            </div>
        );
    }
};
const mapStateToProps = (state) => {
    const register = state.registration;
    return { register };
}

export default connect(mapStateToProps)(SignUp);