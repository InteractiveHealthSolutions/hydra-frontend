import React from 'react';
import './locationmanagement.css';
import { AgGridReact } from '@ag-grid-community/react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Select from 'react-select'
import { connect } from 'react-redux';
import { locationAction } from '../../../../../state/ducks/location'
import { createNotification } from '../../../../../utilities/helpers/helper'
import Loaders from '../../../common/loader/Loader';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { AgGrid } from '../../../../ui/AgGridTable/AgGrid';
import CardTemplate from '../../../../ui/cards/SimpleCard/CardTemplate';

class LocationManagement extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            columnDefs: [
                {
                    headerName: "Name", field: "display"
                },
                {
                    headerName: "Description", field: "description"
                },
                {
                    headerName: "City/village", field: "cityVillage"
                },
                {
                    headerName: "Address", field: "address1"
                },
                {
                    headerName: "Tags", field: "tags"
                },
                {
                    headerName: "Edit",
                    template:
                        `
                    <button className="btn-edite"><i class="fas fa-pencil-alt"></i></button>
                    `
                    , width: 80
                },
                {
                    headerName: "uuid",
                    field: "uuid",
                    hide: true
                },
                {
                    headerName: "address2",
                    field: "address2",
                    hide: true
                },
                {
                    headerName: "country",
                    field: "country",
                    hide: true
                },
                {
                    headerName: "stateProvince",
                    field: "stateProvince",
                    hide: true
                },
                {
                    headerName: "parenLocation",
                    field: "parentLocation",
                    hide: true
                },
                {
                    headerName: "tagsArray",
                    field: "tagsArray",
                    hide: true
                }
            ],
            rowData: [],
            openModal: false,
            listItems: [],
            description: '',
            locationName: '',
            country: '',
            address: '',
            landmark: '',
            city: '',
            stateProvince: '',
            activeLocation: {},
            isEdit: false,
            parentLocation: "",
            availableParentLocation: [],
            arrayParentLocation: [],
            locationTag: [],
            availableLocationTag: [],
            arrayLocationtag: [],
            countryDropDown: [],
            provinceDropDown: [],
            cityDropDown: [],
            colorCountryError: false,
            colorCityError: false,
            colorProvinceError: false,
            defaultCountry: {
                "label": "",
                "value": ""
            },
            defaultCity: {
                "label": "",
                "value": ""
            },
            defaultProvince: {
                "label": "",
                "value": ""
            },
            defaultTags : []


        }
        this.selectRef = React.createRef();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCountryChange = this.handleCountryChange.bind(this);
        this.handleProvinceChange = this.handleProvinceChange.bind(this);
        this.handleCityChange = this.handleCityChange.bind(this);
        this.handleChangeLocationTag = this.handleChangeLocationTag.bind(this);
    }

    async componentDidMount() {
        await this.props.getAllLocation();
        await this.props.getAllLocationTag();
        if (this.props.locationLists != undefined) {
            await this.setState({
                rowData: this.dataBuilder(),
                availableParentLocation: this.props.locationLists.results
            })

        }
        await this.props.getLocationByTag('country');
        await this.createCountryDropDown();


    }
    dataBuilder() {
         let data = [];
         if(this.props.locationLists != undefined && this.props.locationLists.results != undefined) {
             this.props.locationLists.results.forEach(element => {
                 let tagList= '';
                 element.tags.forEach(value => {
                     tagList = tagList + value.display + ","
                 })
                 data.push({
                     "display" : element.display,
                     "country" : element.country,
                     "address1" : element.address1,
                     "address2" : element.address2,
                     "cityVillage" : element.cityVillage,
                     "stateProvince" : element.stateProvince,
                     "uuid" : element.uuid,
                     "tags" : tagList.slice(0,-1),
                     "parentLocation" : element.parentLocation != null ? element.parentLocation.display : '',
                     "tagsArray" : element.tags

                 })
             })
         }
         return data
    }
    async createCountryDropDown() {
        let countryDropDown = [];
        if (this.props.locationListByTag !== undefined && this.props.locationListByTag.results !== undefined) {
            await this.props.locationListByTag.results.forEach(element => {
                countryDropDown.push({
                    "label": element.display,
                    "value": element.uuid
                })
            });
            await this.setState({ countryDropDown: countryDropDown });
        }
    }


    async componentWillReceiveProps(nextProps) {

        if (nextProps.locationLists !== undefined) {
            await this.setState({
                rowData: this.dataBuilder(),
                availableParentLocation: nextProps.locationLists.results
            })
            if (this.state.availableParentLocation !== undefined) {
                this.populateDropDown();
            }
        }
        if (nextProps.locationTagList !== undefined) {
            await this.setState({
                availableLocationTag: nextProps.locationTagList.results
            })
            if (this.state.availableLocationTag !== undefined) {
                this.populateDropDownLocationTag();
            }
        }
    }

    onRowSelected = (event) => {

        console.log('onRowSelected: ' + event.node.data);
    };
    createDefaultTags(tags) {
        if(tags) {
            tags.map(data => {
                this.state.defaultTags.push({
                    "label":data.display,
                    "value":data.uuid})
            });
        }
    }
    onCellClicked = (event) => {

        if (event.colDef.headerName === 'Edit') {
            console.log("data edit", event.data);
            this.createDefaultTags(event.data.tagsArray)
            this.setState({
                locationName: event.data.display,
                address: event.data.address1,
                description: event.data.description,
                city: event.data.cityVillage,
                defaultCountry: {
                    "label": event.data.country,
                    "value": event.data.country
                },
                defaultCity: {
                    "label": event.data.cityVillage,
                    "value": event.data.cityVillage
                },
                defaultProvince: {
                    "label": event.data.stateProvince,
                    "value": event.data.stateProvince
                },
                stateProvince: event.data.stateProvince,
                defaultParentLocation: event.data.parentLocation,
                landmark: event.data.address2,
                isEdit: true,
                openModal: true,
                activeLocation: event.data.uuid
            })
        }
        else if (event.colDef.headerName === 'delete') {
            this.deleteLocation(event.data)
        }
    };

    openModal() {
        this.resetForm();
        this.setState({
            openModal: true,
            isEdit: false
        })
    }

    resetForm() {

        this.setState({
            description: '',
            locationName: '',
            address: '',
            landmark: '',
            city: '',
            stateProvince: ''
        })
    }

    closeModal() {
        this.setState({
            isEdit: false,
            openModal: false,
            colorCountryError: false,
            colorCityError: false,
            colorProvinceError: false

        })
    }

    async handleSubmit(e) {
        await e.preventDefault();
        var array  = this.state.rowData;
        var existingObj = array.filter(data => data.display == this.state.locationName);
        if(JSON.stringify(existingObj) != '[]' && !this.state.isEdit) {
            createNotification('warning','Location with this name already exist');
            return;
        }
        const { country, city, address, locationTag, parentLocation, landmark, locationName, stateProvince, description, activeLocation } = this.state
        let locationForm = {}
        let submit = true;
        if (country == '') {
            this.setState({ colorCountryError: true });
            submit = false;
        }
        else {
            this.setState({ colorCountryError: false });

        }
        if (city == '') {
            this.setState({ colorCityError: true });
            submit = false;
        }
        else {
            this.setState({ colorCityError: false });
        }
        if (stateProvince == '') {
            this.setState({ colorProvinceError: true });
            submit = false;
        }
        else {
            this.setState({ colorProvinceError: false });
        }
        if (submit) {
            let tags = [];
            // if (locationTag)
            if (locationTag && locationTag.length != 0) {
                locationTag.forEach(element => {
                    tags.push(element.value);
                })
                locationForm = {
                    name: locationName,
                    description: description,
                    address1: address,
                    address2: landmark,
                    cityVillage: city,
                    country : country,
                    stateProvince: stateProvince,
                    parentLocation: parentLocation,
                    tags: tags
                }

            } else {
                locationForm = {
                    name: locationName,
                    description: description,
                    address1: address,
                    address2: landmark,
                    cityVillage: city,
                    country : country,
                    stateProvince: stateProvince,
                    parentLocation: parentLocation
                }

            }
            if (this.state.isEdit) {
                await this.props.editLocation(this.state.activeLocation, locationForm);
                await createNotification('success', 'Location Updated');
                await this.props.getAllLocation();
                await this.closeModal()
            }
            else {
                await this.props.saveLocation(locationForm);
                createNotification('success', 'Location Created');
                await this.props.getAllLocation();
                await this.closeModal();

            }

        }

    }

    handleChange(e) {
        console.log("prope", e.target.value);
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    async handleCountryChange(country) {
        await this.props.getChildLocations(country.value);
        let provinceDropDown = [];
        await this.props.childLocations.childLocations.forEach(element => {
            provinceDropDown.push({
                "label": element.display,
                "value": element.uuid
            })
        })
        await this.setState({ country: country.label })
        await this.setState({ provinceDropDown: provinceDropDown })

    }
    async handleProvinceChange(province) {
        await this.setState({ cityDropDown: [] })
        let cityDropDown = [];
        await this.setState({ stateProvince: province.label });
        await this.props.getChildLocations(province.value);
        await this.props.childLocations.childLocations.forEach(element => {
            cityDropDown.push({
                "label": element.display,
                "value": element.uuid
            })
        });
        await this.setState({ cityDropDown: cityDropDown })




    }
    handleCityChange(city) {
        this.setState({ city: city.label });
    }

    ///this function need to be generic 
    deleteLocation(location) {
        confirmAlert({
            title: 'Confirm to Delete',
            message: 'Are you sure to do this ?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        this.deleteLocationAsync(location.uuid)
                    }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    }

    populateDropDown() {
        let array = [];
        this.state.availableParentLocation.forEach(element => {
            array.push(
                <option value={element.uuid}>{element.name}</option>
            );
        });
        this.setState({
            arrayParentLocation: array
        })
    }
    async populateDropDownLocationTag() {
        let array = [];
        await this.state.availableLocationTag.forEach(element => {
            array.push({
                "label": element.display,
                "value": element.uuid

            });
        });
        await this.setState({
            arrayLocationtag: array
        })
    }
    async deleteLocationAsync(uuid) {
        await this.props.deleteLocations(uuid)
        await this.props.getAllLocation();
    }
    async handleChangeLocationTag(params) {
        console.log('params ' + JSON.stringify(params))
        await this.setState({
            locationTag: params
        })
        await console.log('params ' + this.state.locationTag)

        //console.log('left ' + JSON.stringify(this.selectedPriviliges))
    }
    onGridReady(params) {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.gridApi.sizeColumnsToFit();
        window.onresize = () => {
            this.gridApi.sizeColumnsToFit();
        }
    }

    render() {
        const { colorCountryError, rowData, columnDefs, colorCityError, colorProvinceError } = this.state;

        if (this.props.isloading) return <Loaders />;
        return (
            <>
                <CardTemplate
                    title="Location Management"
                    action={<button className="fp-btn btn btn-primary " onClick={() => this.openModal()}><i class="fas fa-plus"></i> Create New</button>}
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

                <Modal
                    show={this.state.openModal}
                    onHide={() => this.closeModal()}
                    style={{ marginTop: '100px' }}
                    backdrop="static"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Add Location</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={this.handleSubmit}>
                        <Modal.Body style={{ height: '309px', overflowY: 'auto' }} >
                            <div className='form-group '>
                                <label htmlFor='locationName' className="required">Name</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    autoComplete='off'
                                    pattern="^[a-zA-Z]+(?:[\s-][a-zA-Z]+[0-9]*)*$"
                                    value={this.state.locationName}
                                    name='locationName'
                                    onChange={this.handleChange}
                                    required
                                />
                            </div>
                            <div className='form-group '>
                                <label htmlFor='description'>Description</label>
                                <textarea
                                    type='text'
                                    className='form-control'
                                    autoComplete='off'
                                    name='description'
                                    value={this.state.description}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="form-group ">
                                <label htmlFor="country" className="required">Country</label>
                                <Select
                                    ref={this.selectRef}
                                    name="country"
                                    required
                                    options={this.state.countryDropDown}
                                    onChange={this.handleCountryChange}
                                    defaultValue={this.state.defaultCountry}
                                    styles={{
                                        control: (provided, state) =>
                                            colorCountryError
                                                ? {
                                                    ...provided,
                                                    boxShadow: "0 0 0 1px red !important",
                                                    borderColor: "red !important"
                                                }
                                                : provided
                                    }}
                                />
                            </div>
                            <div className="form-group ">
                                <label htmlFor="province" className="required">State/Province</label>
                                <Select
                                    required
                                    options={this.state.provinceDropDown}
                                    onChange={this.handleProvinceChange}
                                    defaultValue={this.state.defaultProvince}
                                    styles={{
                                        control: (provided, state) =>
                                            colorCityError
                                                ? {
                                                    ...provided,
                                                    boxShadow: "0 0 0 1px red !important",
                                                    borderColor: "red !important"
                                                }
                                                : provided
                                    }}
                                />
                            </div>
                            <div className="form-group ">
                                <label htmlFor="city" className="required">City</label>
                                <Select
                                    required
                                    options={this.state.cityDropDown}
                                    onChange={this.handleCityChange}
                                    defaultValue={this.state.defaultCity}
                                    styles={{
                                        control: (provided, state) =>
                                            colorProvinceError
                                                ? {
                                                    ...provided,
                                                    boxShadow: "0 0 0 1px red !important",
                                                    borderColor: "red !important"
                                                }
                                                : provided
                                    }}
                                />
                            </div>
                            <div className='form-group '>
                                <label htmlFor='parentLocation' >Parent Location</label>
                                <select className="form-control" name="parentLocation"
                                    value={this.state.parentLocation}
                                    onChange={this.handleChange}>
                                    <option>{this.state.isEdit ? this.state.defaultParentLocation:''}</option>
                                    {this.state.arrayParentLocation}
                                </select>
                            </div>
                            <div className='form-group '>
                                <label htmlFor='address' >Address</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    autoComplete='off'
                                    name='address'
                                    value={this.state.address}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className='form-group '>
                                <label htmlFor='landmark' className="">Landmark</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    autoComplete='off'
                                    pattern='^[a-zA-Z\s]*$'
                                    name='landmark'
                                    value={this.state.landmark}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='locationTag'>Location Tags</label>
                                <Select
                                    defaultValue={this.state.defaultTags}
                                    options={this.state.arrayLocationtag}
                                    onChange={this.handleChangeLocationTag}
                                    isMulti
                                />
                            </div>



                        </Modal.Body>
                        <Modal.Footer>
                            <Button type='submit' variant='primary'>Save
                        </Button>
                        </Modal.Footer>
                    </form>
                </Modal >

            </>
        )
    }

}

const mapStateToProps = state => ({
    locationLists: state.location.locations,
    isloading: state.location.loading,
    locationTagList: state.location.locationtag,
    locationListByTag: state.location.locationsForATag,
    childLocations: state.location.childLocations,
    error: state.location.locationError
});

const mapDispatchToProps = {
    getAllLocation: locationAction.fetchLocations,
    saveLocation: locationAction.saveLocation,
    deleteLocations: locationAction.deleteLocation,
    getAllLocationTag: locationAction.fetchLocationTags,
    getLocationByTag: locationAction.getLocationByTag,
    getChildLocations: locationAction.getChildLocations,
    editLocation: locationAction.editLocation
};

export default connect(mapStateToProps, mapDispatchToProps)(LocationManagement) 