import React from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import PropTypes from 'prop-types';
import makeAnimated from 'react-select/animated';
import moment from 'moment'

import { connect } from 'react-redux';
import { locationAction } from '../../../state/ducks/location';
import { conceptsAction } from '../../../state/ducks/concepts';
import {workflowAction} from '../../../state/ducks/workflow';
import {reportService} from '../../../services/reportsservice';
import { systemSettingsAction } from '../../../state/ducks/systemsettings'
import { createNotification } from '../../../utilities/helpers/helper'
import "react-datepicker/dist/react-datepicker.css";
import './Reports.css'

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
            currentFilters : [],
            currentReport : '',
            noAdditionalFiltersFlag : false,
            startDate:'',
            endDate:'',
            selectedLocation:[]
        }
        this.filters = {
            reportname : 'FacilityPatients',
            filters : [
            ]
        }
        this.otherFilter = [];
        this.options = [];
        //this.isMounted = true;
        this.handleProvinceChange = this.handleProvinceChange.bind(this);
        this.handleCityChange = this.handleCityChange.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.handleChangeDynamicFilters = this.handleChangeDynamicFilters.bind(this)
        this.handleStartChangeDate = this.handleStartChangeDate.bind(this);
        this.handleEndChangeDate = this.handleEndChangeDate.bind(this);
        this.handleLocationChange = this.handleLocationChange.bind(this);
    }
    static propTypes = {
        locationListByTag: PropTypes.array.isRequired,
        childLocations: PropTypes.array.isRequired,
        locationLists: PropTypes.array.isRequired,
        workflowList: PropTypes.array.isRequired,
        concept : PropTypes.array.isRequired,
    }
    async componentWillMount() {
        this._isMounted=true;
        await this.props.getSettingsByUUID('3h98a10f-3edz-43f6-b020-d0823e28ebd1');
        if(this.props.setting != undefined)
        {
            await this.setState({
            country: this.props.setting.value,
        });
    }
        await this.props.getChildLocations(this.state.country);
        await this.props.getAllLocation();
        console.log('child loc' + JSON.stringify(this.props.locationLists));
        await this.createProvinceDropDown();
        await this.props.getAllWorkFlows();
        await this.createWorkflowFilter();
        await this.props.getConceptByUUID('c4b494c6-39df-4797-82d5-7d62455f6958');
        await this.createTBFilter() ;

       

    }
    async componentWillReceiveProps(newProps) {
        if(newProps.locationLists != undefined) {
            await this.createProvinceDropDown();
        }
        if(newProps.workflowList != undefined) {
            await this.createWorkflowFilter();
        }
        if(newProps.workflowList != undefined && newProps.concept != undefined) {
            await this.createTBFilter()
        }
    }
    componentWillUnmount() {
        this._isMounted=false;
    }
    createTBFilter() {
        if(this.props.workflowList !== undefined && this.props.workflowList.workflows != undefined) {
            let dropdown ='';
            this.options=[]
            if(this._isMounted) {
                this.props.workflowList.workflows.forEach(element => {
                    this.options.push({
                        "label":element.name,
                        "value":'workflow'
                    })
                })
                dropdown = <Select options={this.options}  name="workflow" onChange={this.handleChangeDynamicFilters}/>;
                this.otherFilter.push({'name':'Work Flow' , 'value':dropdown});
            }
         if(this.props.concept != undefined  && this.props.concept.answers !== undefined) {
             let dropdown='';
             let options=[];
             this.props.concept.answers.forEach(element => {
                 options.push({
                     "label":element.display,
                     "value":"presumptiveTB"
                 })
             })
             dropdown = <Select options={options}  name="presumptiveTB" onChange={this.handleChangeDynamicFilters}/>;
             this.otherFilter.push({'name':'Presumptive TB' , 'value':dropdown});
         
            }
          }
     
    
     console.log('filters 2'+JSON.stringify(this.otherFilter))
    }
    createWorkflowFilter() {
        if(this.props.workflowList !== undefined && this.props.workflowList.workflows !== undefined) {
            let dropdown ='';
            let options=[]
            if(this._isMounted) {
                this.props.workflowList.workflows.forEach(element => {
                    options.push({
                        "label":element.name,
                        "value":'workflow'
                    })
                })
                dropdown = <Select options={options}  name="workflow" onChange={this.handleChangeDynamicFilters}/>;
                this.filters.filters.push({'name':'Work Flow' , 'value':dropdown});
            
            }
          }
        console.log('filters '+JSON.stringify(this.filters))
    }
    async createProvinceDropDown() {
        let provinceDropDown = []
        if (this.props.childLocations) {
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
    async handleChange(event) {
       if(event.target.value === 'facilityPatients' || event.target.value === 'disaggregationPatients'){
           this.setState({currentFilters:this.filters.filters,currentReport:event.target.value,noAdditionalFiltersFlag:false})
       }
       else {
        
        this.setState({currentFilters:this.otherFilter,currentReport:event.target.value,noAdditionalFiltersFlag:false})
       
       }
       await alert(JSON.stringify(this.state.currentFilters))


    }
    async handleChangeDynamicFilters(event) {
        // if(this.state[this.state.currentReport] != undefined && this.state[this.state.currentReport].length > 2){
        // await    this.setState({[this.state.currentReport]:[]})
        //     //alert('here ')
        // }
        if(this.state[this.state.currentReport] != undefined) {
            var result = this.state[this.state.currentReport].filter(obj => {
                return obj.name === event.value
              })
              if(this.state[this.state.currentReport].indexOf(result[0]) != -1) 
              await this.state[this.state.currentReport].splice(this.state[this.state.currentReport].indexOf(result[0]))
    
        await    this.state[this.state.currentReport].push({
                'name':event.value ,'value':event.label
            })
        }
        else {
          await this.setState({test:[{'name':event.value ,'value':event.label}]});
        }
        
     }
     handleDateChangeRaw(e) {
        e.preventDefault();
    }
    handleStartChangeDate(date) {

        this.setState({
            startDate : date
        });
    }
    handleEndChangeDate(date) {

        this.setState({
            endDate : date
        });
    }

    downloadReport(ext) {
        let location='';
        this.state.selectedLocation.forEach(element => {
            location=location+element.label+','
        })
        if(this.state.currentReport == '') {
            createNotification('warning','Select a Report to download')
            return;
        }
        if(this.state.stateProvince == '' || this.state.city == '' || this.state.location == '' || this.state.startDate == '' || this.state.endDate == '') {
            createNotification('warning','Select all mandatory fields')
            return;
        
        }
        var parameterString = 'name='+this.state.currentReport+'&ext='+ext+'&from='+moment(this.state.startDate).format('YYYY-MM-DD')+'&to='+moment(this.state.endDate).format('YYYY-MM-DD')+'&facility='+location.slice(0,-1)+'&'
        if(this.state[this.state.currentReport]!=undefined) {
            //alert(JSON.stringify(this.state[this.state.currentReport]))
            this.state[this.state.currentReport].forEach(element => {
                parameterString = parameterString + element.name +'='+element.value.replace(/\s/g, '')+'&';
            })
        }
        reportService.downloadReport(parameterString.slice(0,-1),this.state.currentReport,ext);
        
    }
   handleLocationChange(location){
    this.setState({
            selectedLocation: location
    });
    
   }
   render() {
    return (
        <div className="row reports-main-header">
            <div className="reports-heading col-sm-8 col-md-8 col-lg-8">
                <h2 className="header_title">Reports</h2>
            </div>
            <div className="col-sm-4 col-md-4 col-lg-4">

                {/* <button type="button" className="btn btn-sm btn-primary btn-add-report">
                    + Add Report
</button> */}
            </div>
            <div className="reports-main-card card">

                <div className="row card-header">

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
                        <div className="row filter-label required">
                            Location
                </div>
                        <div className="row">
                            <Select

                                options={this.state.locationDropDown}
                                className="reports-location-dropdown"
                                name="statetype"
                                components={animatedComponents}
                            onChange={this.handleLocationChange}
                                
                                isMulti

                            />
                        </div>
                    </div>
                    <div className="col-sm-2">
                        <div className="row filter-label required">
                            Start Date
                </div>
                        <div className="row">
                            <DatePicker className="form-control reports-date-picker" maxDate={new Date()} selected={this.state.startDate} showMonthDropdown
                                    showYearDropdown onChangeRaw={this.handleDateChangeRaw} onChange={this.handleStartChangeDate}dateFormat="yyyy-MM-dd" placeholderText="Click to select a date" required />
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
                <div className="card-body">
                    <div className="row">
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
                                                    <FormControlLabel value="facilityPatients" control={<Radio color="primary"/>} />

                                                </td>
                                                <td>
                                                    Facility Patients
                            </td>
                                                <td>
                                                    This is a report
                                                </td>
                                                <td>
                                                    <button onClick={e=>this.downloadReport('xlsx')}><img src="https://img.icons8.com/ios/50/000000/csv.png"/>
                                                   </button><button onClick={e=>this.downloadReport('pdf')}><img src="https://img.icons8.com/ios/50/000000/pdf-2.png"/>
                                                  </button>
                                                    {/* <img src="https://img.icons8.com/office/40/000000/html-filetype.png" />*/}</td>
                                            </tr>
                                            
                                            {this.state.currentReport == 'facilityPatients' && 
                                           <tr>{this.state.currentFilters.map((value,key) => {
                                            return (
                                                
                                                   <div className="row" style={{width:"1050px"}}>
                                                   <div className="col" style={{marginLeft:"200px"}} >
                                                   <label>{value.name}</label>
                                                   </div>
                                                   <div className="col">
                                                   {value.value}
                                                   </div>
                                         </div>
                                            );
                                        })}</tr>}
                                            <tr style={{ height: '20px' }}>
                                                <td>
                                                    <FormControlLabel value="disaggregationPatients" control={<Radio color="primary"/>} />

                                                </td>
                                                <td>
                                                Age-Gender Disaggregation of Patients                                </td>
                                                <td>
                                                    This is a report
                                                </td>
                                                <td>
                                                <button onClick={e=>this.downloadReport('xlsx')}><img src="https://img.icons8.com/ios/50/000000/csv.png"/>
                                                   </button><button onClick={e=>this.downloadReport('pdf')}> <img src="https://img.icons8.com/ios/50/000000/pdf-2.png"/>
                                                  </button>
                                                    {/* <img src="https://img.icons8.com/office/40/000000/html-filetype.png" />*/}</td>
                                            </tr>
                                            <tr style={{ height: '20px' }}>
                                                <td>
                                                    <FormControlLabel value="diagnosedTbPatients" control={<Radio color="primary"/>} />

                                                </td>
                                                <td>
                                                Diagnosed TB Patients
                                                </td>
                                                <td>
                                                    This is a report
                                                </td>
                                                <td>
                                                <button onClick={e=>this.downloadReport('xlsx')}><img src="https://img.icons8.com/ios/50/000000/csv.png"/>
                                                   </button><button onClick={e=>this.downloadReport('pdf')}> <img src="https://img.icons8.com/ios/50/000000/pdf-2.png"/>
                                                  </button>
                                                    {/* <img src="https://img.icons8.com/office/40/000000/html-filetype.png" />*/}</td>
                                            </tr>
                                            <tr style={{ height: '20px' }}>
                                                <td>
                                                    <FormControlLabel value="presumptivePatients" control={<Radio color="primary"/>} />

                                                </td>
                                                <td>
                                                Presumptive Patients                                </td>
                                                <td>
                                                    This is a report
                                                </td>
                                                <td>
                                                <button onClick={e=>this.downloadReport('xlsx')}><img src="https://img.icons8.com/ios/50/000000/csv.png"/>
                                                   </button><button onClick={e=>this.downloadReport('pdf')}> <img src="https://img.icons8.com/ios/50/000000/pdf-2.png"/>
                                                  </button>
                                                    {/* <img src="https://img.icons8.com/office/40/000000/html-filetype.png" />*/}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </RadioGroup>

                            </div>
                        </div>
                        {/* <div className="col-sm-4">
                            <div className="card inner-card">
                                <table className="table">
                                    <thead className="thead-light">
                                        <th>
                                            Additional Filters
                    </th>

                                    </thead>
                                    <tbody>
                                      <br />
                                      <br />  
                                        {
                                            this.state.currentFilters.map((value,key) => {
                                                return (

                                                   <tr>
                                                                                                               <div className="form-group row ">

                                                       <label className="col-form-label col-sm-6" style={{marginLeft:'15px'}}>{value.name}</label>
                                                       <div className="col-sm-6" style={{marginLeft:'-80px'}}>

                                                       {value.value}
                                                       </div>
                                                       </div>

                                                    </tr>

                                                );
                                            })
                                        }
                                        </tbody>
                                </table>
                            </div>
                        </div> */}
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