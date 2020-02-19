import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';
import { AgGridReact } from '@ag-grid-community/react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import makeAnimated from 'react-select/animated';
import { rolesAction } from '../../../../state/ducks/roles';
import { priviligesAction } from '../../../../state/ducks/privileges'
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
import './roles.css';

const animatedComponents = makeAnimated();

class Roles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openAddRoleModal: false,
            quickFilterText: '',
            columnDefs: [
                {
                    headerName: 'Role', field: 'role', width: '200',
                     cellRenderer: function (params) {
                         return "<a href='javascript: void(0)'" + params.value
                             + "'> " + params.value + "</a>";
                    },
                    cellStyle: { 'background-color': '#e6f3ff', 'text-decoration': 'underline' }
                },
                {
                    headerName: 'Description', field: 'description', width: '320'
                },
                {
                    headerName: 'Inherited Roles', field: 'inheritedRoles', width: '220'
                },
                {
                    headerName: 'Priviliges', field: 'priviliges', width: '450'
                },
                {
                    headerName: 'UUID', field: 'uuid', width: '450', hide: true
                }

            ],
            roleFormData: {
                name: '',
                description: '',
                selectedIRoles: [],
                selectedPriviliges: []
            },
            rowData: [],
            forEdit: false,
            selectedUUID: ''




        }
        this.onQuickFilterText = this.onQuickFilterText.bind(this);
        this.inheritedRolesOption = [];
        this.privilegesOption = [];
        this.selectedInheritedRoles = this.selectedInheritedRoles.bind(this);
        this.selectedPriviliges = this.selectedPriviliges.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onCellClicked = this.onCellClicked.bind(this)

    }
    onCellClicked = (event) => {
        console.log('event ' + event.data.uuid)
        if (event.column.colId == 'role') {
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
        priviligesList: PropTypes.array.isRequired
    };
    async componentWillMount() {
        await this.props.getRoles();
        await console.log('roles ' + JSON.stringify(this.props.rolesList));
        await this.setState({ rowData: this.dataBuilder() });
        await this.props.getPriviliges();
        await console.log('prev ' + JSON.stringify(this.props.priviligesList))
        await this.createInheritedRoleOptions();
        await this.createPriviligesOption();
    }
    async componentWillReceiveProps() {
        if (this.props.rolesList)
            this.setState({ rowData: this.dataBuilder() })
    }
    async handleSubmit(event) {
        await event.preventDefault();
        if (this.state.forEdit == true) {
            console.log('uuid ' + this.state.selectedUUID);
            await this.props.editRole(this.state.roleFormData, this.state.selectedUUID);
        }
        else
            await this.props.postRole(this.state.roleFormData);
        //console.log('submitted '+JSON.stringify(this.state.roleFormData))
        this.closeAddRoleModal();
    }
    handleChange(event) {

        const { name, value } = event.target;
        const { roleFormData } = this.state;
        this.setState({
            roleFormData: {
                ...roleFormData,
                [name]: value
            }
        });
        console.log("on change " + name + " " + value);
    }
    dataBuilder() {
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
    closeAddRoleModal() {
        this.setState({ openAddRoleModal: false })
    }
    createInheritedRoleOptions() {
        this.props.rolesList.results.forEach(element => {
            this.inheritedRolesOption.push({
                "label": element.name,
                "value": element.uuid
            })
        })
    }
    createPriviligesOption() {
        this.props.priviligesList.results.forEach(element => {
            this.privilegesOption.push({
                "label": element.display,
                "value": element.description
            })
        });
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
        await this.setState({
            roleFormData: {
                ...roleFormData,
                selectedPriviliges: params

            }
        });
        await console.log(this.state.roleFormData.selectedPriviliges)
        console.log('left ' + JSON.stringify(this.selectedPriviliges))
    }
    render() {
        const { roleFormData } = this.state;
        return (
            <div className="row role-main-header">
                <div className="role-heading col-sm-8 col-md-8 col-lg-8">
                    <h2 className="title">Manage User Roles</h2>
                </div>
                <div className="col-sm-4 col-md-4 col-lg-4">

                    <button type="button" onClick={() => this.openAddRoleModal()} className="btn btn-sm btn-primary btn-user-role">
                        + Add User Role
            </button>
                </div>
                <div className="role-main-card card">
                    <div className="row card-header">
                        <div className="input-group search-btn">
                            <input type="text" name="quickFilter" id="quickFilter" placeholder="Search..." onChange={this.onQuickFilterText} className="form-control bg-light border-0 small lt-input-search" aria-label="Search" aria-describedby="basic-addon2" />
                            <div className="input-group-append">
                                <button className="btn btn-primary" type="button">
                                    <i className="fas fa-search fa-sm"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="d-flex justify-content-center">
                            <div className="ag-theme-balham" style={{ height: '415px', width: '100%' }}>
                                <AgGridReact
                                    columnDefs={this.state.columnDefs}
                                    rowData={this.state.rowData}
                                    modules={AllCommunityModules}
                                    enableSorting
                                    enableFilter
                                    rowAnimation
                                    quickFilterText={this.state.quickFilterText}
                                    enableRangeSelection={true}
                                    pagination={true}
                                    paginationPageSize="12"
                                    isExternalFilterPresent={true}
                                    enableColResize="true"
                                    onCellClicked={this.onCellClicked}
                                >
                                </AgGridReact>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal show={this.state.openAddRoleModal} onHide={() => this.closeAddRoleModal()} style={{ marginTop: '40px' }}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.forEdit ? 'Edit' : 'Add New'} Role</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={this.handleSubmit}>
                        <Modal.Body>
                            <div className="form-group row required">
                                <label className="col-form-label col-sm-4" htmlFor="roleName">Role</label>
                                <div className="col-sm-8">
                                    <input type="text" className="form-control" name="name" value={roleFormData.name} pattern="^[a-zA-Z]{1,15}" onChange={this.handleChange} required disabled={this.state.forEdit} />
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
                                <label htmlFor="prev" className="col-form-label col-sm-4">Priviliges</label>
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
                            <button type="button" onClick={() => { this.closeAddRoleModal() }} class="btn btn-danger">
                                Cancel
                        </button>
                            <button type="submit" class="btn btn-success">
                                Save
                        </button>

                        </Modal.Footer>
                    </form>
                </Modal>
            </div>
        )
    }
}
const mapStateToPops = state => ({
    rolesList: state.roles.allRoles,
    priviligesList: state.priviliges.allPriviliges
})

const mapsDispatchToProps = {
    getRoles: rolesAction.getRoles,
    getPriviliges: priviligesAction.getAllPriviliges,
    postRole: rolesAction.postRole,
    editRole: rolesAction.putRole
}
export default connect(mapStateToPops, mapsDispatchToProps)(Roles);