import React from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import PropTypes from 'prop-types';
import makeAnimated from 'react-select/animated';
import moment from 'moment'
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';

import { connect } from 'react-redux';
import { locationAction } from '../../../state/ducks/location';
import { conceptsAction } from '../../../state/ducks/concepts';
import { workflowAction } from '../../../state/ducks/workflow';
import { reportService } from '../../../services/reportsservice';
import { systemSettingsAction } from '../../../state/ducks/systemsettings'
import { createNotification } from '../../../utilities/helpers/helper'
import "react-datepicker/dist/react-datepicker.css";
import './Reports.css'
import CardTemplate from '../../ui/cards/SimpleCard//CardTemplate'

const animatedComponents = makeAnimated();

const targetHeight = 30;

const customStyles = {
    control: base => ({
        ...base,
        minHeight: 'initial',
    }),
    valueContainer: base => ({
        ...base,
        height: `${targetHeight - 1 - 1}px`,
        padding: '0 8px',
    }),
    clearIndicator: base => ({
        ...base,
        padding: `${(targetHeight - 20 - 1 - 1) / 2}px`,
    }),
    dropdownIndicator: base => ({
        ...base,
        padding: `${(targetHeight - 20 - 1 - 1) / 2}px`,
    }),
};

class Reports extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            provinceDropDown: [],
            cityDropDown: [],
            locationDropDown: [],
            stateProvince: '',
            city: '',
            country: '',
            currentFilters: [],
            currentReport: '',
            currentDump: '',
            noAdditionalFiltersFlag: false,
            startDate: '',
            startDumpDate: '',
            endDate: '',
            startDumpDate: '',
            endDumpDate: '',
            selectedLocation: [],
            filters: [],
            selectedWorkflow: '',
            selectedPresumptiveTB: '',
            selectedForm: '',
            formOptions: []
        }
        this.filters = {
            reportname: 'FacilityPatients',
            filters: [
            ]
        }
        this.otherFilter = [];
        this.options = [];
        // this.formOptions = [];
        this.optionsTB = [];
        //this.isMounted = true;
        this.handleProvinceChange = this.handleProvinceChange.bind(this);
        this.handleCityChange = this.handleCityChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeDynamicFilters = this.handleChangeDynamicFilters.bind(this)
        this.handleStartChangeDate = this.handleStartChangeDate.bind(this);
        this.handleStartChangeDumpDate = this.handleStartChangeDumpDate.bind(this);
        this.handleEndChangeDumpDate = this.handleEndChangeDumpDate.bind(this);
        this.handleEndChangeDate = this.handleEndChangeDate.bind(this);
        this.handleLocationChange = this.handleLocationChange.bind(this);
    }
    static propTypes = {
        locationListByTag: PropTypes.array.isRequired,
        childLocations: PropTypes.array.isRequired,
        locationLists: PropTypes.array.isRequired,
        workflowList: PropTypes.array.isRequired,
        concept: PropTypes.array.isRequired,
    }
    async componentWillMount() {
        this._isMounted = true;
        await this.props.getSettingsByUUID('3h98a10f-3edz-43f6-b020-d0823e28ebd1');
        if (this.props.setting != undefined) {
            await this.setState({
                country: this.props.setting.value,
            });
        }
        await this.props.getChildLocations(this.state.country);
        console.log('child loc' + JSON.stringify(this.props.locationLists));
        await this.createProvinceDropDown();
        await this.props.getAllWorkFlows();
        await this.createWorkflowFilter();
        await this.props.getConceptByUUID('c4b494c6-39df-4797-82d5-7d62455f6958');
        await this.createFilter();



    }
    async componentWillReceiveProps(newProps) {
        if (newProps.locationLists != undefined) {
            await this.populateLocationDropdown();
        }
        if (newProps.workflowList != undefined) {
            await this.createWorkflowFilter();
            await this.createFilter()
        }
        if (newProps.workflowList != undefined && newProps.concept != undefined) {
            await this.createFilter()
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    createFilter() {
        if (this.props.workflowList !== undefined && this.props.workflowList.workflows != undefined) {
            let dropdown = '';
            this.options = []
            if (this._isMounted) {
                this.props.workflowList.workflows.forEach(element => {
                    this.options.push({
                        "label": element.name,
                        "value": 'workflow',
                        "uuid": element.uuid
                    })
                })
                dropdown = <Select options={this.options} name="workflow" onChange={this.handleChangeDynamicFilters} />;
                this.otherFilter.push({ 'name': 'Work Flow', 'value': dropdown });
            }
            if (this.props.concept != undefined && this.props.concept.answers !== undefined) {
                let dropdown = '';
                this.optionsTB = [];
                this.props.concept.answers.forEach(element => {
                    this.optionsTB.push({
                        "label": element.display,
                        "value": "presumptiveTB"
                    })


                })
                //  dropdown = <Select options={options}  name="presumptiveTB" onChange={this.handleChangeDynamicFilters}/>;
                //this.otherFilter.push({'name':'Presumptive TB' , 'value':dropdown});

            }
        }


        console.log('filters 2' + JSON.stringify(this.otherFilter))
    }
    async createWorkflowFilter() {
        await this.setState({ filters: [] })
        if (this.props.workflowList !== undefined && this.props.workflowList.workflows !== undefined) {
            let dropdown = '';
            let options = []
            this.props.workflowList.workflows.forEach(element => {
                options.push({
                    "label": element.name,
                    "value": 'workflow'
                })
            })
            dropdown = <Select options={options} name="workflow" onChange={this.handleChangeDynamicFilters} />;
            this.state.filters.push(dropdown);


        }
        console.log('filters ' + JSON.stringify(this.filters))
    }
    async createProvinceDropDown() {
        let provinceDropDown = []
        if (this.props.childLocations != undefined && this.props.childLocations.childLocations != undefined) {
            await this.props.childLocations.childLocations.forEach(element => {
                provinceDropDown.push({
                    "label": element.display,
                    "value": element.uuid
                })
            })
            await this.setState({ provinceDropDown: provinceDropDown })
        }


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
    async handleCityChange(city) {
        await this.setState({ locationDropDown: [] })
        let locationDropDown = [];
        await this.setState({ city: city.value });
        await this.props.getAllLocation();
        await console.log("location list " + JSON.stringify(this.props.locationLists))
        if (this.props.locationLists != undefined) {
            await this.props.locationLists.results.forEach(element => {
                console.log(element.cityVillage)
                if (element.cityVillage == city.label) {
                    console.log('yes')
                    locationDropDown.push({
                        "label": element.display,
                        "value": element.uuid
                    })
                }

            });
            await this.setState({ locationDropDown: locationDropDown })
        }

    }
    async populateLocationDropdown() {
        console.log("populate " + JSON.stringify(this.props.locationLists));
        if (this.state.city != "") {
            let locationDropDown = [];
            if (this.props.locationLists != undefined) {
                await this.props.locationLists.results.forEach(element => {
                    console.log(element.cityVillage)
                    if (element.cityVillage == this.state.city) {
                        console.log('yes')
                        locationDropDown.push({
                            "label": element.display,
                            "value": element.uuid
                        })
                    }

                });
                await this.setState({ locationDropDown: locationDropDown })
            }
        }
    }
    async handleChange(event) {
        if (event.target.value === 'facilityPatients' || event.target.value === 'disaggregationPatients') {
            this.setState({ currentFilters: this.state.filters, currentReport: event.target.value, noAdditionalFiltersFlag: false })
        }
        else {

            this.setState({ currentFilters: this.otherFilter, currentReport: event.target.value, noAdditionalFiltersFlag: false })

        }


    }

    async populateFormDropdown(list) {

        if (list) {
            let formDropDown = [];
            await list.forEach(element => {
                formDropDown.push({
                    "label": element.form.name,
                    "value": "form",
                    "uuid": element.form.uuid
                })
            });
            console.log("populateFormDropdown", formDropDown)
            await this.setState({ formOptions: formDropDown })
        }
    }
    async handleChangeDynamicFilters(event) {
        // if(this.state[this.state.currentReport] != undefined && this.state[this.state.currentReport].length > 2){
        // await    this.setState({[this.state.currentReport]:[]})
        // }
        if (event.value == 'workflow') {
            await this.setState({ selectedWorkflow: event.label })
            // TODO NAVEED send call to fetch forms by workflow
            reportService.getFormsByWorkflow(event.uuid).then(
                data => {
                    console.log("############## RECEIVED DATA ##############", data);
                    this.populateFormDropdown(data)
                })
        }
        else if (event.value == 'form') {
            await this.setState({ selectedForm: event.label })
        }
        else {
            this.setState({ selectedPresumptiveTB: event.label })
        }
        // if(this.state[this.state.currentReport] != undefined) {
        //     var result = this.state[this.state.currentReport].filter(obj => {
        //         return obj.name === event.label
        //       })
        //       if(this.state[this.state.currentReport].indexOf(result[0]) != -1) 
        //       await this.state[this.state.currentReport].splice(this.state[this.state.currentReport].indexOf(result[0]))

        // await    this.state[this.state.currentReport].push({
        //         'name':event.value ,'value':event.label
        //     })
        // }
        // else {
        //   await this.setState({test:[{'name':event.value ,'value':event.label}]});
        // }

    }
    handleDateChangeRaw(e) {
        e.preventDefault();
    }
    handleStartChangeDate(date) {

        this.setState({
            startDate: date
        });
    }
    handleStartChangeDumpDate(date) {

        this.setState({
            startDumpDate: date
        });
    }
    handleEndChangeDumpDate(date) {

        this.setState({
            endDumpDate: date
        });
    }
    handleEndChangeDate(date) {

        this.setState({
            endDate: date
        });
    }

    downloadDump(ext, customType) {

        if (this.state.currentReport == '') {
            createNotification('warning', 'Select a Report to download')
            return;
        }
        if (this.state.startDumpDate == '' || this.state.endDumpDate == '') {
            createNotification('warning', 'Select all mandatory fields')
            return;

        }
        var parameterString = 'from=' + moment(this.state.startDumpDate).format('YYYY-MM-DD') + '&to=' + moment(this.state.endDumpDate).format('YYYY-MM-DD');
        if (this.state.currentReport == 'encounters' || this.state.currentReport == 'patients' || this.state.currentReport == 'custom') {
            parameterString = parameterString + '&workflow=' + this.state.selectedWorkflow + '&form=' + this.state.selectedForm;
        }
        console.log("PRE: ", parameterString)
        if (this.state[this.state.currentReport] != undefined) {
            this.state[this.state.currentReport].forEach(element => {
                parameterString = parameterString + element.name + '=' + element.value.replace(/\s/g, '') + '&';
            })
        }
        console.log("PRE: ", parameterString)
        if (customType) parameterString = parameterString + '&custom-type=' + customType
        reportService.downloadDump(parameterString, this.state.currentReport, ext);

    }

    downloadReport(ext) {
        let location = '';
        this.state.selectedLocation.forEach(element => {
            location = location + element.label + ','
        })
        if (this.state.currentReport == '') {
            createNotification('warning', 'Select a Report to download')
            return;
        }
        if (this.state.stateProvince == '' || this.state.city == '' || this.state.location == '' || this.state.startDate == '' || this.state.endDate == '') {
            createNotification('warning', 'Select all mandatory fields')
            return;

        }
        var parameterString = 'name=' + this.state.currentReport + '&ext=' + ext + '&from=' + moment(this.state.startDate).format('YYYY-MM-DD') + '&to=' + moment(this.state.endDate).format('YYYY-MM-DD') + '&facility=' + location.slice(0, -1) + '&'
        if (this.state[this.state.currentReport] != undefined) {
            this.state[this.state.currentReport].forEach(element => {
                parameterString = parameterString + element.name + '=' + element.value.replace(/\s/g, '') + '&';
            })
        }
        reportService.downloadReport(parameterString.slice(0, -1), this.state.currentReport, ext);

    }
    handleLocationChange(location) {
        this.setState({
            selectedLocation: location
        });

    }
    render() {
        return (
            <CardTemplate
            /*title={	
                <div className="row">
            	
                    <div className="col-sm-2">
                        <div className="row filter-label required">
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
                        <div className="row filter-label required">
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
                        <div className="row filter-location-label required">
                            Location
                   </div>
                        <div className="row">
                            <ReactMultiSelectCheckboxes
                                options={this.state.locationDropDown}
                                name="statetype"
                                className="reports-location-dropdown"
                                onChange={this.handleLocationChange}
                            />
                        </div>
                    </div>
                    <div className="col-sm-2">
                        <div className="row filter-label required">
                            Start Date
                     </div>
                        <div className="row">
                            <DatePicker className="form-control reports-date-picker" maxDate={new Date()} selected={this.state.startDate} showMonthDropdown
                                showYearDropdown onChangeRaw={this.handleDateChangeRaw} onChange={this.handleStartChangeDate} dateFormat="yyyy-MM-dd" placeholderText="Click to select a date" required />
                        </div>
                    </div>
                    <div className="col-sm-2">
                        <div className="row filter-label required">
                            End Date
                  </div>
                        <div className="row">
                            <DatePicker className="form-control reports-date-picker" maxDate={new Date()} selected={this.state.endDate} showMonthDropdown
                                showYearDropdown onChangeRaw={this.handleDateChangeRaw} onChange={this.handleEndChangeDate} dateFormat="yyyy-MM-dd" placeholderText="Click to select a date" required />
                        </div>
                    </div>

                </div>
            }*/
            >
                {/*<div className="row">
                    <div className="col-sm-12">
                        <div className="card inner-card">
                            <RadioGroup aria-label="report" name="report" onChange={this.handleChange} >

                                <table className="table table-bordered">
                                    <thead className="thead-light">
                                        <th style={{ width: "10px" }}>

                                        </th>
                                        <th style={{ width: "300px" }}>
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
                                        <tr style={{ height: '2px' }}>
                                            <td>
                                                <FormControlLabel value="facilityPatients" control={<Radio color="primary" />} />

                                            </td>
                                            <td>
                                                Facility Patients
                            </td>
                                            <td>
                                                This is a report
                                                </td>
                                            <td align="center">
                                                <button onClick={e => this.downloadReport('xlsx')}><img src="https://img.icons8.com/officel/40/000000/csv.png" />
                                                </button><button onClick={e => this.downloadReport('pdf')}> <img src="https://img.icons8.com/office/40/000000/pdf.png" />
                                                </button>
                                                </td>
                                        </tr>

                                        {this.state.currentReport == 'facilityPatients' &&
                                            <tr style={{ backgroundColor: "#87CEEB" }}>
                                                <td colSpan={4}> <label style={{ marginLeft: "100px" }}>Additional Filters</label> <label className="dynamic-filter-label">Workflow </label> : <Select className="filter" options={this.options} name="workflow" onChange={this.handleChangeDynamicFilters} />
                                                </td></tr>}
                                        <tr style={{ height: '20px' }}>
                                            <td>
                                                <FormControlLabel value="disaggregationPatients" control={<Radio color="primary" />} />

                                            </td>
                                            <td>
                                                Age-Gender Disaggregation of Patients                                </td>
                                            <td>
                                                This is a report
                                                </td>
                                            <td align="center">
                                                <button onClick={e => this.downloadReport('xlsx')}><img src="https://img.icons8.com/officel/40/000000/csv.png" />
                                                </button>
                                                <button onClick={e => this.downloadReport('pdf')}> <img src="https://img.icons8.com/office/40/000000/pdf.png" />
                                                </button>
                                                </td>
                                        </tr>
                                        {this.state.currentReport == 'disaggregationPatients' &&
                                            <tr style={{ backgroundColor: "#87CEEB" }}>
                                                <td></td>
                                                <td colSpan={3}>
                                                    Additional Filters
                                                  <label className="dynamic-filter-label">
                                                        Workflow
                                                  </label> : <Select className="filter" options={this.options} name="workflow" onChange={this.handleChangeDynamicFilters} />
                                                </td></tr>}
                                        <tr style={{ height: '20px' }}>
                                            <td>
                                                <FormControlLabel value="diagnosedTbPatients" control={<Radio color="primary" />} />

                                            </td>
                                            <td>
                                                Diagnosed TB Patients
                                                </td>
                                            <td>
                                                This is a report
                                                </td>
                                            <td align="center">
                                                <button onClick={e => this.downloadReport('xlsx')}><img src="https://img.icons8.com/officel/40/000000/csv.png" />
                                                </button><button onClick={e => this.downloadReport('pdf')}> <img src="https://img.icons8.com/office/40/000000/pdf.png" />
                                                </button>
                                                </td>
                                        </tr>
                                        {this.state.currentReport == 'diagnosedTbPatients' &&
                                            <tr style={{ backgroundColor: "#87CEEB" }}>
                                                <td></td>
                                                <td colSpan={3}>
                                                    Additional Filters
                                                  <label className="dynamic-filter-label">
                                                        Workflow
                                                  </label> : <Select className="filter" options={this.options} name="workflow" onChange={this.handleChangeDynamicFilters} />
                                                    <label style={{ marginLeft: "15px" }}>Presumptive TB</label> : <Select className="filter" options={this.optionsTB} name="pTb" onChange={this.handleChangeDynamicFilters} />
                                                </td></tr>}
                                        <tr style={{ height: '20px' }}>
                                            <td>
                                                <FormControlLabel value="presumptivePatients" control={<Radio color="primary" />} />
                                            </td>
                                            <td>
                                                Presumptive Patients                                </td>
                                            <td>
                                                This is a report
                                                </td>
                                            <td align="center">
                                                <button onClick={e => this.downloadReport('xlsx')}><img src="https://img.icons8.com/officel/40/000000/csv.png" />
                                                </button><button onClick={e => this.downloadReport('pdf')}> <img src="https://img.icons8.com/office/40/000000/pdf.png" />
                                                </button>
                                                </td>
                                        </tr>
                                        {this.state.currentReport == 'presumptivePatients' &&
                                            <tr style={{ backgroundColor: "#87CEEB" }}>
                                                <td></td>
                                                <td colSpan={3}>
                                                    Additional Filters
                                                  <label className="dynamic-filter-label">
                                                        Workflow
                                                  </label> : <Select className="filter" options={this.options} name="workflow" onChange={this.handleChangeDynamicFilters} />
                                                    <label style={{ marginLeft: "15px" }}>Presumptive TB</label> : <Select className="filter" options={this.optionsTB} name="pTb" onChange={this.handleChangeDynamicFilters} />
                                                </td></tr>}		
                                    </tbody>
                                </table>
                            </RadioGroup>

                        </div>
                    </div>
                </div>
	*/}

                {/*<div className="row">
					
                        <div className="col-sm-2">
							<b>Dumps</b>
						</div>	
				</div>*/}

                <div className="row" align="center">

                    <b align="center">&nbsp;&nbsp;&nbsp;&nbsp;Filters: </b>
                    <div className="col-sm-2">
                        <div className="row filter-label required">
                            Start Date
                       </div>
                        <div className="col-sm-2">
                            <DatePicker className="form-control reports-date-picker" maxDate={new Date()} selected={this.state.startDumpDate} showMonthDropdown
                                showYearDropdown onChangeRaw={this.handleDateChangeRaw} onChange={this.handleStartChangeDumpDate} dateFormat="yyyy-MM-dd" placeholderText="Click to select a date" required />
                        </div>
                    </div>

                    <div className="col-sm-2">
                        <div className="row filter-label required">
                            End Date
                       </div>
                        <div className="col-sm-2">
                            <DatePicker className="form-control reports-date-picker" maxDate={new Date()} selected={this.state.endDumpDate} showMonthDropdown
                                showYearDropdown onChangeRaw={this.handleDateChangeRaw} onChange={this.handleEndChangeDumpDate} dateFormat="yyyy-MM-dd" placeholderText="Click to select a date" required />
                        </div>
                    </div>

                </div>

                <br />
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card inner-card">
                            <RadioGroup aria-label="report" name="report" onChange={this.handleChange} >

                                <table className="table table-bordered">
                                    <thead className="thead-light">
                                        <th style={{ width: "10px" }}>

                                        </th>
                                        <th style={{ width: "300px" }}>
                                            Dump Name
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
                                                <FormControlLabel value="patients" control={<Radio color="primary" />} />

                                            </td>
                                            <td>
                                                Patients
                                                </td>
                                            <td>
                                                Dumps for patient data in selected workflow
                                                </td>
                                            <td align="center">
                                                <button onClick={e => this.downloadDump('csv')}><img src="https://img.icons8.com/officel/40/000000/csv.png" />
                                                </button>{/* <button onClick={e => this.downloadReport('pdf')}> <img src="https://img.icons8.com/office/40/000000/pdf.png" />
                                                </button>*/}
                                                {/* <img src="https://img.icons8.com/office/40/000000/html-filetype.png" />*/}</td>
                                        </tr>
                                        {this.state.currentReport == 'patients' &&
                                            <tr style={{ backgroundColor: "#b1bfc4" }}>
                                                <td></td>
                                                <td colSpan={3}>
                                                    Additional Filters
                                                  <label className="dynamic-filter-label">
                                                        Workflow
                                                  </label> : <Select className="filter" options={this.options} name="workflow" onChange={this.handleChangeDynamicFilters} />
                                                </td></tr>}
                                        <tr style={{ height: '20px' }}>
                                            <td>
                                                <FormControlLabel value="providers" control={<Radio color="primary" />} />

                                            </td>
                                            <td>
                                                Providers
                                                </td>
                                            <td>
                                                Dumps for provider/user data
                                                </td>
                                            <td align="center">
                                                <button onClick={e => this.downloadDump('csv')}><img src="https://img.icons8.com/officel/40/000000/csv.png" />
                                                </button>{/* <button onClick={e => this.downloadReport('pdf')}> <img src="https://img.icons8.com/office/40/000000/pdf.png" />
                                                </button>*/}
                                                {/* <img src="https://img.icons8.com/office/40/000000/html-filetype.png" />*/}</td>
                                        </tr>
                                        <tr style={{ height: '20px' }}>
                                            <td>
                                                <FormControlLabel value="locations" control={<Radio color="primary" />} />

                                            </td>
                                            <td>
                                                Locations
                                                </td>
                                            <td>
                                                Dumps for locations data

                                                </td>
                                            <td align="center">
                                                <button onClick={e => this.downloadDump('csv')}><img src="https://img.icons8.com/officel/40/000000/csv.png" />
                                                </button>{/* <button onClick={e => this.downloadReport('pdf')}> <img src="https://img.icons8.com/office/40/000000/pdf.png" />
                                                </button>*/}
                                                {/* <img src="https://img.icons8.com/office/40/000000/html-filetype.png" />*/}</td>
                                        </tr>
                                        <tr style={{ height: '20px' }}>
                                            <td>
                                                <FormControlLabel value="encounters" control={<Radio color="primary" />} />

                                            </td>
                                            <td>
                                                Encounters
                                                </td>
                                            <td>
                                                Dumps for all encounters entered in selected wokflow

                                                </td>
                                            <td align="center">
                                                <button onClick={e => this.downloadDump('zip')}><img src="https://img.icons8.com/officel/40/000000/csv.png" />
                                                </button>{/* <button onClick={e => this.downloadReport('pdf')}> <img src="https://img.icons8.com/office/40/000000/pdf.png" />
                                                </button>*/}
                                                {/* <img src="https://img.icons8.com/office/40/000000/html-filetype.png" />*/}</td>
                                        </tr>

                                        <tr style={{ height: '20px' }}>
                                            <td>
                                                <FormControlLabel value="custom" control={<Radio color="primary" />} />

                                            </td>
                                            <td>
                                                Custom
                                                </td>
                                            <td>
                                                For custom reports

                                                </td>
                                            <td align="center">
                                                <button onClick={e => this.downloadDump('zip', 'screened-preexisting')}>Screened pre-existing conditions
                                                </button>
                                                {/* <button onClick={e => this.downloadReport('pdf')}> <img src="https://img.icons8.com/office/40/000000/pdf.png" />
                                                </button>*/}
                                                {/* <img src="https://img.icons8.com/office/40/000000/html-filetype.png" />*/}</td>
                                        </tr>
                                        {(this.state.currentReport == 'encounters') &&
                                            <tr style={{ backgroundColor: "#b1bfc4" }}>
                                                <td></td>
                                                <td colSpan={3}>
                                                    Additional Filters
                                                  <label className="dynamic-filter-label">
                                                        Workflow
                                                  </label> : <Select className="filter" options={this.options} name="workflow" onChange={this.handleChangeDynamicFilters} />
                                                    <label className="dynamic-filter-label"> Form </label> :
                                                  <Select className="filter" options={this.state.formOptions} name="form" onChange={this.handleChangeDynamicFilters} />

                                                </td></tr>}
                                    </tbody>
                                </table>
                            </RadioGroup>

                        </div>
                    </div>
                </div>

            </CardTemplate>
        )
    }
}
const mapStateToProps = state => ({
    locationListByTag: state.location.locationsForATag,
    childLocations: state.location.childLocations,
    setting: state.systemSettings.systemSetting,
    locationLists: state.location.locations,
    workflowList: state.workflow.workflows,
    concept: state.concepts.concept
});

const mapDispatchToProps = {
    getSettingsByUUID: systemSettingsAction.getSystemSettingsByUUID,
    getLocationByTag: locationAction.getLocationByTag,
    getChildLocations: locationAction.getChildLocations,
    getAllLocation: locationAction.fetchLocations,
    getAllWorkFlows: workflowAction.getAllWorkflow,
    getConceptByUUID: conceptsAction.getConceptByUUID
};

export default connect(mapStateToProps, mapDispatchToProps)(Reports) 