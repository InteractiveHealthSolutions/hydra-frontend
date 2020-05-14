import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';
import { AgGridReact } from '@ag-grid-community/react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import makeAnimated from 'react-select/animated';
import { rolesAction } from '../../../../state/ducks/roles';
import { priviligesAction } from '../../../../state/ducks/privileges';
import ButtonRenderer from '../../../../utilities/helpers/ButtonRenderer';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
import './roles.css';
import Loaders from '../../common/loader/Loader';
import CardTemplate from '../../../ui/cards/SimpleCard/CardTemplate';
import { AgGrid } from '../../../ui/AgGridTable/AgGrid';
import { createNotification } from '../../../../utilities/helpers/helper';

const animatedComponents = makeAnimated();

class Roles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openAddRoleModal: false,
            quickFilterText: '',
            columnDefs: [
                {
                    headerName: 'Role', field: 'role'
                },
                {
                    headerName: 'Description', field: 'description'
                },
                {
                    headerName: 'Inherited Roles', field: 'inheritedRoles'
                },
                {
                    headerName: 'Priviliges', field: 'priviliges'
                },
                {
                    headerName: 'UUID', field: 'uuid', hide: true
                },
                {
                    headerName: "Edit",
                    field: "edit",
                    template:
                        `
                    <button className="btn-edite"><i class="fas fa-pencil-alt"></i></button>
                    `
                    , width: 70
                }
            ],
            rowData: [],
            context: { componentParent: this },
            frameworkComponents: {
                buttonRenderer: ButtonRenderer,
            },
            roleFormData: {
                name: '',
                description: '',
                selectedIRoles: [],
                selectedPriviliges: [],

            },
            retire: false,
            rowData: [],
            forEdit: false,
            selectedUUID: '',
            //retire:false
            userSysIdList:[]
        }
        this.onQuickFilterText = this.onQuickFilterText.bind(this);
        this.inheritedRolesOption = [];
        this.privilegesOption = [];
        this.selectedInheritedRoles = this.selectedInheritedRoles.bind(this);
        this.selectedPriviliges = this.selectedPriviliges.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onCellClicked = this.onCellClicked.bind(this);

    }
    onCellClicked = (event) => {
        console.log('event ' + event.data.uuid)
        if (event.column.colId == 'edit') {
            this.setState({
                openAddRoleModal: true, forEdit: true, selectedUUID: event.data.uuid
                , roleFormData: {
                    name: event.data.role,
                    description: event.data.description
                }
            });

        }
    }
    openAddRoleModal() {
        this.setState({
            openAddRoleModal: true, forEdit: false, roleFormData: {
                name: '',
                description: '',
                selectedIRoles: [],
                selectedPriviliges: []
            }
        });
    }
    onQuickFilterText = (event) => {
        this.setState({ quickFilterText: event.target.value });
    };
    static propTypes = {
        rolesList: PropTypes.array.isRequired,
        priviligesList: PropTypes.array.isRequired,
        usersByRoleList: PropTypes.array.isRequired
    };
    async componentWillMount() {
        this.props.getRoles();
        this.setState({ rowData: this.dataBuilder() });
        await this.props.getPriviliges();
        this.createInheritedRoleOptions();
        this.createPriviligesOption();
        console.log('helllo ' + JSON.stringify(this.props.rolesList))
    }
    async componentWillReceiveProps(newProps) {
        if (newProps.rolesList != undefined) {
            this.setState({ rowData: this.dataBuilder() })
            this.createInheritedRoleOptions();
            console.log('helllo props' + JSON.stringify(this.state.rowData))
        }
        else {
            this.props.getRoles()
        }
        if(newProps.priviligesList != undefined) {
            this.createPriviligesOption();
        }
        if(newProps.usersByRoleList != undefined) {
            this.setState({userSysIdList : newProps.usersByRoleList});
        }

    }
    async handleSubmit(event) {
        await event.preventDefault();
        var array  = this.state.rowData;
        var existingObj = array.filter(data => data.role == this.state.roleFormData.name);
        if(JSON.stringify(existingObj) != '[]' && !this.state.forEdit) {
            createNotification('warning','Role with this name already exist');
            return;
        }
        if (this.state.forEdit == true) {
            if (this.state.retire == true) {
                 await this.props.getUsersByRole(this.state.selectedUUID);
                 if(JSON.stringify(this.state.userSysIdList) == '[]' ) {
                    await this.props.deleteRole(this.state.selectedUUID);
                    await this.closeAddRoleModal();

                    await createNotification('success',"Role successfully deleted");

                 }
                 else {
                     createNotification('warning','Can not delete this role. It has following user Ids are associated with it '+JSON.stringify(this.state.userSysIdList));
                     createNotification('info','Please remove the association first')
                     await this.closeAddRoleModal();
                 }
             }
            else {
                 await this.props.editRole(this.state.roleFormData, this.state.selectedUUID);
                 await this.closeAddRoleModal();

             }
             this.setState({ retire: false })
        }
        else{
            await this.props.postRole(this.state.roleFormData);
            await createNotification('success','New role created');
            await this.closeAddRoleModal();
            await this.props.getRoles();
        }
            

    }
    handleChange(event) {

        const { name, value } = event.target;
        const { roleFormData } = this.state;
        if (name == 'retire') {
            this.setState({
                retire: event.target.checked
            });
        }
        else {
            this.setState({
                roleFormData: {
                    ...roleFormData,
                    [name]: value
                }
            });
        }



        console.log("on change " + event.target.name + " " + this.state.retire);
    }
    dataBuilder() {
       if (this.props.rolesList != undefined) {
            let data = [];
            this.props.rolesList.results.forEach(element => {
                let inheritedRoles = '';
                element.allInheritedRoles.forEach(iRole => {
                    inheritedRoles = inheritedRoles + iRole.display + ',';
                });
                let privilege = '';
                element.privileges.forEach(prev => {
                    privilege = privilege + prev.display + ',';
                });
                data.push({
                    "uuid": element.uuid,
                    "role": element.name,
                    "description": element.description,
                    "inheritedRoles": inheritedRoles.slice(0, -1),
                    "priviliges": privilege.slice(0, -1)
                })
            });
            return data;
        }

    }
    closeAddRoleModal() {
        this.setState({ openAddRoleModal: false })
    }
    createInheritedRoleOptions() {
        if (this.props.rolesList != undefined) {
            this.props.rolesList.results.forEach(element => {
                this.inheritedRolesOption.push({
                    "label": element.name,
                    "value": element.uuid
                })
            })
        }

    }
    createPriviligesOption() {
        if (this.props.priviligesList !== undefined && this.props.priviligesList.results !== undefined) {
            this.props.priviligesList.results.forEach(element => {
                this.privilegesOption.push({
                    "label": element.display,
                    "value": element.description
                })
            });
        }
    }
    selectedInheritedRoles(params) {
        const { roleFormData } = this.state;
        this.setState({
            roleFormData: {
                ...roleFormData,
                selectedIRoles: params
            }
        });

    }
    async selectedPriviliges(params) {
        const { roleFormData } = this.state;
        this.setState({
            roleFormData: {
                ...roleFormData,
                selectedPriviliges: params
            }
        });
        console.log(this.state.roleFormData.selectedPriviliges)
        console.log('left ' + JSON.stringify(this.selectedPriviliges))
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
        const { roleFormData, rowData, columnDefs } = this.state;
        if (this.props.isLoading) return <Loaders />;
        return (
            <>
                <CardTemplate
                    title="User Role Management"
                    action={<button type="button" onClick={() => this.openAddRoleModal()} className="fp-btn btn btn-primary "><i class="fas fa-plus"></i> Add User Role</button>}
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
                <Modal show={this.state.openAddRoleModal} onHide={() => this.closeAddRoleModal()} backdrop="static" style={{ marginTop: '40px' }}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.forEdit ? 'Edit' : 'Add New'} Role</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={this.handleSubmit}>
                        <Modal.Body>
                            <div className="form-group row">
                                <label className="col-form-label col-sm-4 required" htmlFor="roleName">Role</label>
                                <div className="col-sm-8">
                                    <input type="text" className="form-control" name="name" value={roleFormData.name} pattern="^[a-zA-Z ]+$" onChange={this.handleChange} required disabled={this.state.forEdit} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-form-label col-sm-4" htmlFor="description">Description</label>
                                <div className="col-sm-8">
                                    <textarea className="form-control" name="description" value={roleFormData.description} onChange={this.handleChange} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="iRole" className="col-form-label col-sm-4">Inherited Roles</label>
                                <div className="col-sm-8">
                                    <Select
                                        components={animatedComponents}
                                        options={this.inheritedRolesOption}
                                        onChange={this.selectedInheritedRoles}
                                        closeMenuOnSelect={false}
                                        isMulti />
                                </div>

                            </div>
                            <div className="form-group row">
                                <label htmlFor="prev" className="col-form-label col-sm-4">Privileges</label>
                                <div className="col-sm-8">
                                    <Select
                                        components={animatedComponents}
                                        options={this.privilegesOption}
                                        onChange={this.selectedPriviliges}
                                        closeMenuOnSelect={false}
                                        isMulti
                                    />
                                </div>

                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            {/* <button type="button" onClick={() => { this.closeAddRoleModal() }} class="btn btn-danger">
                                Cancel
                        </button> */}
                            {
                                this.state.forEdit ?
                                    <div class="form-check">
                                        <input type="checkbox" name="retire" onChange={this.handleChange} />
                                        <label>Delete</label>
                                    </div> : ''
                            }
                            <button type="submit" class="btn btn-primary">
                                Save
                        </button>
                        </Modal.Footer>
                    </form>
                </Modal>
                
            </>
        )
    }
}
const mapStateToProps = state => ({
    rolesList: state.roles.allRoles,
    priviligesList: state.priviliges.allPriviliges,
    isLoading: state.roles.loading,
    usersByRoleList: state.roles.systemIds
})

const mapsDispatchToProps = {
    getRoles: rolesAction.getRoles,
    getPriviliges: priviligesAction.getAllPriviliges,
    postRole: rolesAction.postRole,
    editRole: rolesAction.putRole,
    deleteRole: rolesAction.deleteRole,
    getUsersByRole: rolesAction.getUsersByRole
}
export default connect(mapStateToProps, mapsDispatchToProps)(Roles);
