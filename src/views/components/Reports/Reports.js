import React from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { locationAction } from '../../../state/ducks/location';
import { systemSettingsAction } from '../../../state/ducks/systemsettings'

import "react-datepicker/dist/react-datepicker.css";
import './Reports.css'


class Reports extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            provinceDropDown : [],
            cityDropDown : [],
            locationDropDown : [],
            stateProvince : '',
            city : '',
            country : ''
        }
        this.handleProvinceChange = this.handleProvinceChange.bind(this);
        this.handleCityChange = this.handleCityChange.bind(this)
    }
    static propTypes = {
        locationListByTag: PropTypes.array.isRequired,
        childLocations: PropTypes.array.isRequired,
        locationLists: PropTypes.array.isRequired
    }
    async componentWillMount() {
        await this.props.getSettingsByUUID('3h98a10f-3edz-43f6-b020-d0823e28ebd1');
        await this.setState({
                country: this.props.setting.value,
        });
        await this.props.getChildLocations(this.state.country);
        await this.props.getAllLocation();
        console.log('child loc'+JSON.stringify(this.props.locationLists));
        await this.createProvinceDropDown();
        
    }
    async createProvinceDropDown() {
        let provinceDropDown = []
        await this.props.childLocations.childLocations.forEach(element => {
            provinceDropDown.push({
                "label" : element.display,
                "value" : element.uuid
            })
        })
        await this.setState({provinceDropDown:provinceDropDown})

    }
    async handleProvinceChange(province) {
        await this.setState({cityDropDown : []})
        let cityDropDown = [];
        await this.setState({stateProvince:province.label});
        await this.props.getChildLocations(province.value);
        await this.props.childLocations.childLocations.forEach(element => {
            cityDropDown.push({
                "label" : element.display,
                "value" : element.uuid
            })
        });
        await this.setState({cityDropDown : cityDropDown})
    }
    async handleCityChange(city) {
        await this.setState({locationDropDown : []})
        let locationDropDown = [];
        await this.setState({city:city.value});
        await this.props.locationLists.results.forEach(element => {
            console.log(element.cityVillage)
            if(element.cityVillage == city.label) {
                console.log('yes')
                locationDropDown.push({
                    "label" : element.display,
                    "value" : element.uuid
                })
            }
            
        });
        await this.setState({locationDropDown : locationDropDown})
    
        


    }
    render() {
        return (
            <div className="row reports-main-header">
                <div className="reports-heading col-sm-8 col-md-8 col-lg-8">
                    <h2 className="title">Reports</h2>
                </div>
                <div className="col-sm-4 col-md-4 col-lg-4">

                    {/* <button type="button" className="btn btn-sm btn-primary btn-add-report">
                        + Add Report
</button> */}
                </div>
                <div className="reports-main-card card">

                    <div className="row card-header">

                        <div className="col-sm-2">
                            <div className="row filter-label">
                                Province
                    </div>
                            <div className="row">
                                <Select

                                    options={this.state.provinceDropDown}
                                    className="reports-select-dropdown"
                                    name="statetype"
                                    onChange={this.handleProvinceChange}

                                />
                            </div>
                        </div>
                        <div className="col-sm-2">
                            <div className="row filter-label">
                                City
                        </div>
                            <div className="row">
                                <Select

                                    options={this.state.cityDropDown}
                                    className="reports-select-dropdown"
                                    name="statetype"
                                    onChange={this.handleCityChange}

                                />
                            </div>
                        </div>
                        <div className="col-sm-2">
                            <div className="row filter-label">
                                Location
                    </div>
                            <div className="row">
                                <Select

                                    options={this.state.locationDropDown}
                                    className="reports-select-dropdown"
                                    name="statetype"

                                />
                            </div>
                        </div>
                        <div className="col-sm-2">
                            <div className="row filter-label">
                                Start Date
                    </div>
                            <div className="row">
                                <DatePicker className="form-control reports-date-picker" maxDate={new Date()} dateFormat="dd/MM/yyyy" placeholderText="Click to select a date" required />
                            </div>
                        </div>
                        <div className="col-sm-2">
                            <div className="row filter-label">
                                End Date
                    </div>
                            <div className="row">
                                <DatePicker className="form-control reports-date-picker" maxDate={new Date()} dateFormat="dd/MM/yyyy" placeholderText="Click to select a date" required />
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-sm-8">
                                <div className="card inner-card">
                                    <RadioGroup aria-label="gender" name="gender1" >

                                        <table className="table table-striped table-bordered">
                                            <thead className="thead-dark">
                                                <th style={{ width: "10px" }}>

                                                </th>
                                                <th style={{ width: "200px" }}>
                                                    Report Name
                        </th>
                                                <th>
                                                    Description
                        </th>
                                                <th style={{ width: "180px" }}>
                                                    Export
                        </th>
                                            </thead>
                                            <tbody>
                                                <tr style={{ height: '20px' }}>
                                                    <td>
                                                        <FormControlLabel value="female" control={<Radio />} />

                                                    </td>
                                                    <td>
                                                        Report 1
                                </td>
                                                    <td>
                                                    </td>
                                                    <td>
                                                        <img src="https://img.icons8.com/color/48/000000/csv.png" />
                                                        <img src="https://img.icons8.com/cute-clipart/48/000000/pdf.png" />
                                                        <img src="https://img.icons8.com/office/40/000000/html-filetype.png" />                                                </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </RadioGroup>

                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="card inner-card">
                                    <table className="table">
                                        <thead className="thead-dark">
                                            <th>
                                                Additional Filters
                        </th>

                                        </thead>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}
const mapStateToProps = state => ({
    locationListByTag: state.location.locationsForATag,
    childLocations: state.location.childLocations,
    setting: state.systemSettings.systemSetting,
    locationLists: state.location.locations

});

const mapDispatchToProps = {
    getSettingsByUUID: systemSettingsAction.getSystemSettingsByUUID,
    getLocationByTag: locationAction.getLocationByTag,
    getChildLocations: locationAction.getChildLocations,
    getAllLocation: locationAction.fetchLocations
};

export default connect(mapStateToProps, mapDispatchToProps)(Reports) 