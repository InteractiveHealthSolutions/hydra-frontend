import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import {NotificationContainer} from 'react-notifications';

import PropTypes from 'prop-types';
import { systemSettingsAction } from '../../../../state/ducks/systemsettings'
import {createNotification} from '../../../../utilities/helpers/helper'

import './systemsettings.css';

class SystemSetting extends React.Component {
    constructor(props) {
        super(props);
        this.countryOptions = countryList().getData()
        console.log('country '+JSON.stringify(this.countryOptions))
        this.state = {
            countryOptions: this.countryOptions,
            currencyOptions : [
                {'label':'PKR','value':'PKR'},
                {'label':'US Dollars','value':'$'},
                {'label':'Indian Rupee','value':'INR'},
                {'label':'Veitnam Dong','value':'VND'},
                {'label':'United Kingdom Pound','value':'£'},
                {'label' : 'Indonesian Rupee' , 'value':'IDR'}
            ],
            value: null,
            formData: {
                identifier: '',
                date: '',
                country: '',
                currency: '',
                defaultValueCountry : {
                    'label' : '',
                    'value' : ''
                },
                defaultValueCurrency : {
                    "label" : "",
                    "value" : ""
                }
            }
            
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeCountry = this.handleChangeCountry.bind(this);
        this.handleChangeCurrency = this.handleChangeCurrency.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)

    }
    static propTypes = {
        setting: PropTypes.array.isRequired
    }
    async componentWillMount() {
        await this.setValues()
    }
    async setValues() {
        await this.props.getSettingsByUUID('9b68a10b-3ede-43f6-b019-d0823e28ebd1');
        
        await this.setState({
            formData: {
                ...this.state.formData,
                identifier: this.props.setting.value
            }
        });
        await this.props.getSettingsByUUID('6a78a10b-3eae-43f6-b019-d0823e28ebd1');
        await this.setState({
            formData: {
                ...this.state.formData,
                date: this.props.setting.value
            }
        });
        await this.props.getSettingsByUUID('3h98a10f-3edz-43f6-b020-d0823e28ebd1');
        await this.setState({
            formData: {
                ...this.state.formData,
                country: this.props.setting.value,
                defaultValueCountry : {
                    label : this.props.setting.value,
                    value : this.props.setting.value
                }
            }
        });
        await this.props.getSettingsByUUID('5a74a10b-3eae-43f6-b019-d0823e28ead1');
        await this.setState({
            formData: {
                ...this.state.formData,
                currency: this.props.setting.value,
                defaultValueCurrency : {
                    'label' : this.props.setting.value,
                    'value' : this.props.setting.value
                }
            }
            
        });
        await console.log('dataaaa '+this.state.formData.defaultValueCountry.label)
    }
    handleChangeCountry = country => {
        const {formData} = this.state;
        this.setState({
             formData : {
                 ...formData , 
                 country : country.label
             }
        })
    }
    handleChangeCurrency = currency => {
        const {formData} = this.state;
        this.setState({
             formData : {
                 ...formData , 
                 currency : currency.value
                 
             }
        })
    }
    handleChange(event) {
        const { name, value } = event.target;
        const {formData} = this.state;
        this.setState({
             formData : {
                 ...formData , 
                 [name] : value
             }
        })
    }
    async handleSubmit(e) {
        e.preventDefault();
        console.log('submit '+JSON.stringify(this.state.formData))
        await this.props.postSystemSettings('9b68a10b-3ede-43f6-b019-d0823e28ebd1',this.getJSON(this.state.formData.identifier))
        await this.props.postSystemSettings('6a78a10b-3eae-43f6-b019-d0823e28ebd1',this.getJSON(this.state.formData.date))
        await this.props.postSystemSettings('3h98a10f-3edz-43f6-b020-d0823e28ebd1',this.getJSON(this.state.formData.country))
        await this.props.postSystemSettings('5a74a10b-3eae-43f6-b019-d0823e28ead1',this.getJSON(this.state.formData.currency))
        await createNotification('success','Global Config Updated');

    }
    getJSON(value) {
        return {
            "value" : value
        }
    }
    render() {
        const { formData } = this.state;
        console.log('hereee '+JSON.stringify(formData))
        return (
            <div className="row ss-main-header">
                <div className="ss-heading col-sm-8 col-md-8 col-lg-8">
                    <h2 className="title">Advanced Settings</h2>
                </div>
                <div className="role-main-card card">

                    <div className="card-body">
                        <div className="row">

                            <div className="col-sm-3">
                            </div>
                            <div className="col-sm-6">
                                <div className="card" style={{ marginTop: '30px' }}>
                                    <div className="card-header">
                                        Global Configuration
                                </div>
                                    <div className="card-body">
                                        <form onSubmit={this.handleSubmit}>
                                            <div className="form-group row">
                                                <label className="col-form-label col-sm-4" htmlFor="identifier">Identifier Format</label>
                                                <div className="col-sm-8">
                                                    <input type="text" className="form-control" value={formData.identifier} name="identifier" onChange={this.handleChange} />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-form-label col-sm-4" htmlFor="date">Date Format</label>
                                                <div className="col-sm-8">
                                                    <input type="text" className="form-control" name="date" value={formData.date} onChange={this.handleChange}/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="country" className="col-form-label col-sm-4">Country</label>
                                                <div className="col-sm-8">
                                                    <Select
                                                        //components={animatedComponents}
                                                        options={this.countryOptions}
                                                        defaultValue={this.state.formData.defaultValueCountry}
                                                        onChange={this.handleChangeCountry}
                                                        name="country"
                                                    //closeMenuOnSelect={false}
                                                    />
                                                </div>

                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="currency" className="col-form-label col-sm-4">Currency</label>
                                                <div className="col-sm-8">
                                                    <Select
                                                        //components={animatedComponents}
                                                        options={this.state.currencyOptions}
                                                        defaultValue={this.state.formData.defaultValueCurrency}
                                                        onChange={this.handleChangeCurrency}
                                                        name="currency"
                                                    // closeMenuOnSelect={false}
                                                    // isMulti
                                                    />
                                                </div>

                                            </div>
                                            <button type="submit" class="btn btn-success ss-btn-submit">
                                                Save
                        </button>
                                            <button type="button" class="btn btn-danger ss-btn-cancel">
                                                Cancel
                        </button>


                                        </form>
                                    </div>
                                </div>

                            </div>
                            <div className="col-sm-3">
                            </div>
                        </div>
                    </div>
                </div>
                <NotificationContainer />
            </div>
        )
    }
}
const mapStateToProps = state => ({
    setting: state.systemSettings.systemSetting
});
const mapDispatchToProps = {
    getSettingsByUUID: systemSettingsAction.getSystemSettingsByUUID,
    postSystemSettings : systemSettingsAction.postSystemSettings
}
export default connect(mapStateToProps, mapDispatchToProps)(SystemSetting)