import React from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Modal from 'react-bootstrap/Modal';
import { AgGridReact } from '@ag-grid-community/react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { userAction } from '../../../../state/ducks/user'
import { rolesAction } from '../../../../state/ducks/roles';
import { workforceAction } from '../../../../state/ducks/workforce'
import { systemSettingsAction } from '../../../../state/ducks/systemsettings'
import { registrationJSON , editJSON , providerJSON, editUserJSONWithPassword} from '../../../../utilities/helpers/JSONcreator';
import { createNotification } from '../../../../utilities/helpers/helper';
import { providerAction } from '../../../../state/ducks/provider';
import { personAction } from '../../../../state/ducks/person'; 
import ButtonRenderer from '../../../../utilities/helpers/ButtonRenderer';
import DatePicker from "react-datepicker";
import makeAnimated from 'react-select/animated';
// import Loaders from '../../loader/Loader';
import moment from 'moment';
import Loaders from '../../common/loader/Loader';
import "react-datepicker/dist/react-datepicker.css";
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
import './userlist.css'
import CardTemplate from '../../../ui/cards/SimpleCard/CardTemplate';
import { AgGrid } from '../../../ui/AgGridTable/AgGrid';

const animatedComponents = makeAnimated();

class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openAddUserModal: false,
            quickFilterText: '',
            columnDefs: [
                {
                    headerName: 'System Id', field: 'systemId'
                },
                {
                    headerName: 'Username', field: 'display'
                },
                {
                    headerName: 'Name', field: 'person.display'
                },
                {
                    headerName: 'Gender', field: 'person.gender', width: 80
                },
                {
                    headerName: 'Birthdate', field: 'person.birthdate', width: 80, hide: true
                },
                {
                    headerName: "Edit", field: "edit", width: 80,
                    template:
                    `
                       <button className="btn-edite"><i class="fas fa-pencil-alt"></i></button>
                    `,
                    cellRenderer: 'buttonRenderer'
                }
            ],
            rowData: [],
            context: { componentParent: this },
            frameworkComponents: {
                buttonRenderer: ButtonRenderer,
            },
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
                cnic: '',
                retire:false,
                systemId: ''
            },
            submitted: false,
            invalidPassword: false,
            noRoleSelected: false,
            allRoles: [],
            startDate: '',
            roles: [],
            forEdit: false,
        }
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.handleDateChangeRaw = this.handleDateChangeRaw.bind(this);
        this.onQuickFilterText = this.onQuickFilterText.bind(this);
        this.handleRoleChange = this.handleRoleChange.bind(this);
        this.openAddUserModal = this.openAddUserModal.bind(this);
        this.onCellClicked = this.onCellClicked.bind(this)

    }

    static propTypes = {
        users: PropTypes.array.isRequired,
        user: PropTypes.array.isRequired,
        rolesList: PropTypes.array.isRequired,
        userError: PropTypes.bool.isRequired
    }
    async componentDidMount() {
        await this.props.getAllUsers()
        await this.setState({ rowData: this.props.users.results })
        await this.props.getRoles();
        await this.roleHelper();
        await console.log('rolesss' + JSON.stringify(this.state.allRoles))
        await this.props.getSettingsByUUID('6a78a10b-3eae-43f6-b019-d0823e28ebd1');
        await this.setState({dateFormat : this.props.setting.value});
      

    }
   async componentWillReceiveProps(newProps) {
        if (newProps.users != undefined) {
           await this.setState({ rowData: newProps.users.results })
        }
        if(newProps.rolesList != undefined) {
           await this.roleHelper();
           await console.log('rolesss' + JSON.stringify(this.state.allRoles))

        }
        if(newProps.setting != undefined) {
            await this.setState({dateFormat : this.props.setting.value});
        }
   
    }
    roleHelper() {
        if (this.props.rolesList != undefined) {
            this.props.rolesList.results.forEach(element => {
                this.state.allRoles.push({
                    "label": element.display,
                    "value": element.uuid
                });
            });
        }

        /// return roles;
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
    handleRoleChange(role) {
        const { user } = this.state;
        this.setState({
            roles: role
        });
    }
    async onCellClicked (event) {
        if (event.column.colId == 'edit' && !event.data.retired) {
           // console.log('data date'+JSON.stringify(event.data.person.birthdate));
            const { user } = this.state.user;
            await this.setExistingRoles(event.data.roles);
            await console.log('hii'+JSON.stringify(this.state.roles))
            await this.props.getProviderByUser(event.data.uuid);
            await this.props.getPersonByUUID(event.data.person.uuid);
            await this.setState({
                forEdit: true,
                openAddUserModal: true,
                activeuserUUID: event.data.uuid,
                user: {
                    //familyname: event.data.person.display.substr(0, event.data.person.display.indexOf(' ')),
                   // givenname: event.data.person.display.substr(event.data.person.display.indexOf(' ') + 1),
                    familyname : this.props.person.names[0].familyName,
                    givenname : this.props.person.names[0].givenName,
                    username: event.data.display,
                    gender: event.data.person.gender,
                    provider: this.props.provider.results.length != 0?'yes':'no',
                    password: '',
                    confirmpassword: '',
                    forcepwdchange: '',
                    dateofbirth: event.data.person.birthdate != null? moment(event.data.person.birthdate).toDate():'',
                    role: [],
                    defaultRole:this.getDefaultRoles(event.data.roles),
                    cnic: '',
                    isProvider:this.props.provider.results.length != 0?true:false,
                    currentProvider:this.props.provider.results.length != 0?this.props.provider.results[0]:'',
                    retire:false,
                    systemId: event.data.systemId
                },
            })
        }
        if(event.column.colId == "edit" && event.data.retired) {
            createNotification('error','Can not edit a retired user');
        }
    }
    setExistingRoles(roles) {
      //  var existingRoles = [];
        if (roles) {
            roles.map(data => {
                
                this.state.roles.push({
                    "value":data.uuid})
            });
        }
        //return existingRoles;
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
    handleChange(event) {
        if (event.target.name.includes('role')) {
            event.target.checked ? this.state.roles.push(event.target.value) :
                this.state.roles.pop(event.target.value);
            this.setState({ noRoleSelected: false });
        }
        // else if (event.target.name === 'cnic' && (event.target.value.length === 5 || event.target.value.length === 13)) {
        //     const { name, value } = event.target;
        //     const { user } = this.state;
        //     this.setState({
        //         user: {
        //             ...user,
        //             [name]: value + '-'
        //         }
        //     });
        // }
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
        else if(event.target.name === 'retire') {
            const { user } = this.state;
            this.setState({
                user: {
                    ...user,
                    retire : event.target.checked
                }
            });
        }
        else if(event.target.name=='provider' && this.state.forEdit) {
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
    onQuickFilterText = (event) => {
        this.setState({ quickFilterText: event.target.value });
    };
    closeModal() {
        this.setState({ openAddUserModal: false , noRoleSelected:false })
    }
    async handleSubmit(e) {
        e.preventDefault();
        var array  = this.state.rowData;
        var existingObj = array.filter(data => data.display == this.state.user.username);
        if(JSON.stringify(existingObj) != '[]' && !this.state.forEdit) {
            createNotification('warning','User with this name already exist');
            return;
        }
        const { user } = this.state;
        if(user.retire == true) {
            await this.props.deleteUser(this.state.activeuserUUID);
            
            await this.props.fetchParticipantByUser(this.state.activeuserUUID);

            if(this.props.workforce != undefined) {
                if(this.props.workforce.results != null) {
                    var data = {
                        user : this.state.activeuserUUID,
                        retired : true,
                        participantId : this.props.workforce.results[0].uuid
                    }
                await this.props.saveworkforce(data);
                await console.log('participant '+JSON.stringify(this.props.workforce));
                await console.log('participant '+JSON.stringify(data))
                }
                
            }
            if(user.provider == 'yes') {
               this.props.deleteProvider(user.currentProvider.uuid);
            }
            await this.closeModal();
            await this.props.getAllUsers();
        }
        else {
            if(!/^[a-zA-Z ]+$/.test(user.familyname) || !/^[a-zA-Z ]+$/.test(user.givenname)) {
               createNotification("error","Name cannot contain numbers or special characters");
               return;
            }
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
                
                await this.state.roles.forEach(element => {
                    this.state.user.role.push(element.value);
                });
                await this.setState({
                    submitted: true
                });
                if (!this.state.forEdit) {
                    await this.props.saveUser(registrationJSON(this.state.user));
                    if(user.provider == 'yes' && this.props.createdUser != undefined) {
                        await this.props.saveProvider(providerJSON(this.props.createdUser.person, this.props.createdUser.systemId))
                    }
                    await this.closeModal();
                 
                this.props.userError ? createNotification('error', 'User Not Created') :
                    createNotification('success', 'User Created Successfully');
                await this.props.getAllUsers();
                }
                else {
                    if(user.password=='') {
                        await console.log('submitt '+JSON.stringify(user))
                        await this.props.updateUser(this.state.activeuserUUID, editJSON(user));
                    }
                    else {
                        await this.props.updateUser(this.state.activeuserUUID, editUserJSONWithPassword(user));
                    }
                    if(user.isProvider && user.provider == 'no') {
                        await this.props.deleteProvider(user.currentProvider.uuid);
                    }
                    if((!user.isProvider && user.provider == 'yes') || (user.provider && user.provider == 'yes')) {
                         await this.props.deleteProvider(user.currentProvider.uuid);
                         await this.props.saveProvider(providerJSON(this.props.createdUser.person, this.props.createdUser.systemId))
                    }
                   
                    await this.setState({ forEdit: false ,retire:false});
                    await this.closeModal();
                 
                this.props.userError ? createNotification('error', 'User Not Updated') :
                    createNotification('success', 'User Updated Successfully');
                await this.props.getAllUsers();
                }
                
            }
    
    
        }
        
    }
    openAddUserModal() {
        this.setState({
            openAddUserModal: true,
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
                defaultRole:[],
                cnic: '',
                systemId : ''
            },
            submitted: false,
            invalidPassword: false,
            noRoleSelected: false,
            forEdit:false

        })
    }
    getDefaultRoles(roles) {
        var defaultRoles = [];
        if (roles) {
            roles.map(data => {
                defaultRoles.push({
                    label: data.name,
                    value: data.uuid
                })
            });
        }
        return defaultRoles;

    }


    onGridReady = (params) => {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.gridApi.sizeColumnsToFit();
        window.onresize = () => {
            this.gridApi.sizeColumnsToFit();
        }
    }

    onRowSelected = (event) => {
        console.log('onRowSelected: ' + event.node.data);
    };
    render() {
        const { user, submitted,rowData,columnDefs ,invalidPassword } = this.state;
        if (this.props.isLoading) return <Loaders />;
        return (
            <>
                <CardTemplate
                    title="User Management"
                    action={<button type="button" onClick={this.openAddUserModal} className="fp-btn btn btn-primary "><i class="fas fa-plus"></i> Add New User</button>}
                >
                    <div className="card-body rm-paadding">
                        <AgGrid
                            onGridReady={this.onGridReady}
                            columnDefs={columnDefs}
                            onRowSelected={this.onRowSelected}
                            rowData={rowData}
                            onCellClicked={this.onCellClicked}
                        />

                    </div>
                </CardTemplate>
                <Modal show={this.state.openAddUserModal} backdrop="static" onHide={() => this.setState({ openAddUserModal: false })} style={{ marginTop: '40px' }}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.forEdit ? 'Edit' : 'Add New'} User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group row" >
                                <label htmlFor="familyname" class="col-sm-4 col-form-label required">Family Name</label>
                                <div class="col-sm-8">
                                    <input type="text" className="form-control" name="familyname" pattern="^[a-zA-Z ]+${1,25}" placeholder="max 25 characters" maxlength="25" value={user.familyname} onChange={this.handleChange} required />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="givenname" className="col-sm-4 col-form-label required">Given Name</label>
                                <div class="col-sm-8">
                                    <input type="text" className="form-control" name="givenname" pattern="^[a-zA-Z ]+${1,25}" placeholder="max 25 characters" maxlength="25" value={user.givenname} onChange={this.handleChange} required />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label htmlFor="gender" className="col-sm-4 col-form-label required">Gender</label>
                                <div className="col-sm-8">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="gender" value="M" checked={user.gender==='M'} onChange={this.handleChange} required />
                                                <label className="form-check-label" htmlFor="gender" >
                                                    Male
                                    </label>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-check">
                                            <input className="form-check-input" type="radio" name="gender" value="F" checked={user.gender==='F'} onChange={this.handleChange}  />

                                                <label className="form-check-label" htmlFor="gender">
                                                    Female
                                    </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group row ">
                                <label htmlFor="provider" className="col-sm-4 col-form-label required">Allow Data Entry</label>
                                <div className="col-sm-8">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="provider" id="gridRadios1" checked={user.provider=='yes'}value="yes" onChange={this.handleChange} required  />
                                                <label className="form-check-label" htmlFor="gridRadios3" >
                                                    Yes
                                    </label>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="provider" id="gridRadios2" checked={user.provider=='no'} onChange={this.handleChange} value="no" />
                                                <label className="form-check-label" htmlFor="gridRadios4">
                                                    No
                                    </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group row ">
                                <label htmlFor="username" class="col-sm-4 col-form-label required">Username</label>
                                <div class="col-sm-8">
                                    <input type="text" className="form-control" name="username" value={user.username} title="Username should start with an alphabet, Can contain [numbers, underscore, dash and dot]" maxLength="20" minLength="4" pattern="^[^0-9][A-Za-z0-9]+(?:[ _.][A-Za-z0-9]+)*" autoComplete="off" onChange={this.handleChange} disabled = {this.state.forEdit} required />
                                </div>
                            </div>
                            <div className="form-group row ">
                                <label htmlFor="password" class={this.state.forEdit ? "col-sm-4 col-form-label": "col-sm-4 col-form-label required"}>Password</label>
                                <div class="col-sm-8">
                                    <input type="password" className="form-control" name="password" value={user.password} autoComplete="off" maxLength="15" title="Please enter password containing one uppercase letter, one lowercase letter and a number (min characters 8)" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,15}$" onChange={this.handleChange}  />
                                </div>
                            </div>
                            <div className="form-group row ">
                                <label htmlFor="confirmpassword" class={this.state.forEdit ? "col-sm-4 col-form-label": "col-sm-4 col-form-label required"}>ConfirmPassword</label>
                                <div class="col-sm-8">
                                    <input type="password" className="form-control" name="confirmpassword" maxLength="15" value={user.confirmpassword} onChange={this.handleChange}  />
                                    {invalidPassword &&
                                        <div className="help-block" style={{ color: '#ff0000', marginLeft: '30px' }}>Password and Confirm Password do not match</div>
                                    }
                                </div>
                            </div>
                            {/* <div class="form-group row">
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
                            {/* <div class="form-group row" style={{ marginTop: '-18px', marginLeft: '25px' }}>
                                {/* {submitted && store.getState().registration.message !== '' &&
                                    <div className="help-block" style={{ color: '#ff0000', marginLeft: '30px' }}>{store.getState().registration.message}</div>
                                } 
                            </div> */}
                            <div className="form-group row ">
                                <label htmlFor="dateofbirth" class="col-sm-4 col-form-label required">Date of Birth</label>
                                <div class="col-sm-8">
                                    <DatePicker selected={user.dateofbirth} showMonthDropdown
                                        showYearDropdown onChangeRaw={this.handleDateChangeRaw} onChange={this.handleChangeDate} className="form-control user-date-picker" maxDate={new Date()} dateFormat={this.state.dateFormat} placeholderText="Click to select a date" required />
                                </div>
                            </div>
                            <div className="form-group row ">
                                <label htmlFor="cnic" class="col-sm-4 col-form-label">National Identity</label>
                                <div class="col-sm-8">
                                    <input type="text" style={{ marginLeft: '0px' }} className="form-control" name="cnic" maxlength="15" autoComplete="off" value={user.cnic} onChange={this.handleChange} />
                                </div>
                            </div>

                            <div className="form-group row " >
                                <label htmlFor="role" className="col-sm-4 col-form-label required">Roles</label>
                                <div className="col-sm-8">
                                    <Select
                                        defaultValue={this.state.user.defaultRole}
                                        options={this.state.allRoles}
                                        className="user-select-dropdown"
                                        name="statetype"
                                        onChange={this.handleRoleChange}
                                        components={animatedComponents}
                                        isMulti
                                    />
                                    {this.state.noRoleSelected &&
                                        <div className="help-block" style={{ color: '#ff0000', marginLeft: '30px' }}>Please select atleast one role</div>
                                    }
                                </div>

                            </div>
                            <Modal.Footer>
                             {
                            this.state.forEdit ?
                            <div class="form-check">
                            <input type="checkbox" name="retire" onChange={this.handleChange}/>
                            <label > Retired</label> 
                            </div> : ''
                        }
                                <button type="submit" className="btn btn-primary" >Save</button>
                            </Modal.Footer>

                        </form>
                    </Modal.Body>
                </Modal>
            </>
        )
    }
}
const mapStateToProps = state => ({
    users: state.user.users,
    setting: state.systemSettings.systemSetting,
    rolesList: state.roles.allRoles,
    isLoading: state.user.loading,
    userError: state.user.userError,
    createdUser: state.user.user,
    provider: state.provider.provider,
    workforce:state.workforce.workforce,
    person:state.person.person

});
const mapDispatchToProps = {
    getSettingsByUUID: systemSettingsAction.getSystemSettingsByUUID,
    getAllUsers: userAction.fetchUsers,
    saveUser: userAction.saveUser,
    updateUser: userAction.editUsers,
    getRoles: rolesAction.getRoles,
    deleteUser:userAction.deleteUser,
    saveworkforce: workforceAction.saveParticipant,
    saveProvider:providerAction.saveProvider,
    getProviderByUser:providerAction.getProviderByUser,
    deleteProvider:providerAction.deleteProvider,
    fetchParticipantByUser:workforceAction.fetchParticipantByUser,
    getPersonByUUID: personAction.getPersonByUUID
}
export default connect(mapStateToProps, mapDispatchToProps)(UserList);