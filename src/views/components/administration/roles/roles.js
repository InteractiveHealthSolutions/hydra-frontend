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

const animatedComponents = makeAnimated();

class Roles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openAddRoleModal: false,
            quickFilterText: '',
            columnDefs: [
                {
                    headerName: 'Role', field: 'role', width: '200'
                },
                {
                    headerName: 'Description', field: 'description', width: '320'
                },
                {
                    headerName: 'Inherited Roles', field: 'inheritedRoles', width: '180'
                },
                {
                    headerName: 'Priviliges', field: 'priviliges', width: '450'
                },
                {
                    headerName: 'UUID', field: 'uuid', width: '450', hide: true
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
                // {
                //     headerName: "Edit", field: "edit", width: '70',
                //     cellRenderer: 'buttonRenderer'
                // }
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
            retire:false,
            rowData: [],
            forEdit: false,
            selectedUUID: '',
            //retire:false
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
        priviligesList: PropTypes.array.isRequired
    };
    async componentWillMount() {
           this.props.getRoles();
            await this.setState({ rowData: this.dataBuilder() });
            await this.props.getPriviliges();
            await this.createInheritedRoleOptions();
            await this.createPriviligesOption();
           await console.log('helllo '+JSON.stringify(this.props.rolesList))
        
        
     }
    async componentWillReceiveProps(newProps) {
        if (newProps.rolesList != undefined) {
            this.setState({ rowData: this.dataBuilder() })
           await this.createInheritedRoleOptions();
         await console.log('helllo props'+JSON.stringify(this.state.rowData))
        }
        
    }
    async handleSubmit(event) {
    await event.preventDefault();
           if (this.state.forEdit == true) {
               if(this.state.retire == true) {
                  await this.props.deleteRole(this.state.selectedUUID)
               }
               else {
                await this.props.editRole(this.state.roleFormData, this.state.selectedUUID);
               }
               await this.setState({retire:false})
               await this.props.getRoles();
            }
            else
                await this.props.postRole(this.state.roleFormData);
                await this.props.getRoles();
            
        
        //console.log('submitted '+JSON.stringify(this.state.roleFormData))
        this.closeAddRoleModal();
    }
     handleChange(event) {
        
            const { name, value } = event.target;
            const { roleFormData } = this.state;
            if(name == 'retire') {
                this.setState({
                  retire : event.target.checked
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
        if(this.props.rolesList != undefined) {
            this.props.rolesList.results.forEach(element => {
                this.inheritedRolesOption.push({
                    "label": element.name,
                    "value": element.uuid
                })
            })
        }
      
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
        const { roleFormData ,rowData,columnDefs} = this.state;
        if (this.props.isLoading) return <Loaders />;
        return (
            <div className="row container-fluid l-main-container">
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
{/* 

                <div className="card fp-header">
                    <div className="card-header">
                        {/* <div className="input-group search-btn">
                            <input type="text" name="quickFilter" id="quickFilter" placeholder="Search..." onChange={this.onQuickFilterText} className="form-control bg-light border-0 small lt-input-search" aria-label="Search" aria-describedby="basic-addon2" />
                            <div className="input-group-append">
                                <button className="btn btn-primary" type="button">
                                    <i className="fas fa-search fa-sm"></i>
                                </button>
                            </div>
                        </div> */}
                      {/*  <div className="row">
                            <div className="col-md-8 col-sm-4">
                                <span className="text-muted">User Role Management</span>
                            </div>
                            <div className="col-md-4 col-sm-2">
                                <button type="button" onClick={() => this.openAddRoleModal()} className="fp-btn btn btn-primary ">
                                    + Add User Role
            </button>                            </div>
                        </div>
                    </div>
                    <div className="card-body rm-paadding">
                        <div className="d-flex justify-content-center">
                            <div className="ag-theme-balham" style={{ height: '415px', width: '100%' }}>
                                <AgGridReact
                                    columnDefs={this.state.columnDefs}
                                    rowData={this.state.rowData}
                                    modules={AllCommunityModules}
                                    context={this.state.context}
                                    frameworkComponents={this.state.frameworkComponents}
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
                </div> */}
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
                            <input type="checkbox" name="retire" onChange={this.handleChange}/>
                            <label>Delete</label> 
                            </div> : ''
                        }  
                            <button type="submit" class="btn btn-primary">
                                Save
                        </button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </div>
        )
    }
}
const mapStateToProps = state => ({
    rolesList: state.roles.allRoles,
    priviligesList: state.priviliges.allPriviliges,
    isLoading: state.roles.loading
})

const mapsDispatchToProps = {
    getRoles: rolesAction.getRoles,
    getPriviliges: priviligesAction.getAllPriviliges,
    postRole: rolesAction.postRole,
    editRole: rolesAction.putRole,
    deleteRole: rolesAction.deleteRole
}
export default connect(mapStateToProps, mapsDispatchToProps)(Roles);