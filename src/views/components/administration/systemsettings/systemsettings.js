import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import RandExp from 'randexp';
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
                {'label':'Afghan afghani' , 'value':'AFN'},
                {'label':'Albanian lek' , 'value':'ALL'},
                {'label':'Algerian dinar' , 'value':'DZD'},
                {'label':'Euro' , 'value':'EUR'},
                {'label':'Angolan kwanza' , 'value':'AOA'},
                {'label':'Eastern Caribbean dollar' , 'value':'XCD'},
                {'label':'Argentine peso' , 'value':'ARS'},
                {'label':'Armenian dram' , 'value':'AMD'},
                {'label':'Aruban florin' , 'value':'AWG'},
                {'label':'Australian dollar' , 'value':'AUD'},
                {'label':'Azerbaijani manat' , 'value':'AZN'},
                {'label':'Bahamian dollar' , 'value':'BSD'},
                {'label':'Bahraini dinar' , 'value':'BHD'},
                {'label':'Bangladeshi taka' , 'value':'BDT'},
                {'label':'Barbadian dollar' , 'value':'BBD'},
                {'label':'Belarusian ruble' , 'value':'BYN'},
                {'label':'Belize dollar' , 'value':'BZD'},
                {'label':'West African CFA franc' , 'value':'XOF'},
                {'label':'Bermudian dollar' , 'value':'BMD'},
                {'label':'Bhutanese ngultrum' , 'value':'BTN'},
                {'label':'Bolivian boliviano' , 'value':'BOB'},
                {'label':'Bosnia and Herzegovina convertible mark' , 'value':'BAM'},
                {'label':'Botswana pula' , 'value':'BWP'},
                {'label':'Brazilian real' , 'value':'BRL'},
                {'label':'Bulgarian lev' , 'value':'BGN'},
                {'label':'Burundian franc' , 'value':'BIF'},
                {'label':'Cambodian riel' , 'value':'KHR'},
                {'label':'Central African CFA franc' , 'value':'XAF'},
                {'label':'Canadian dollar' , 'value':'CAD'},
                {'label':'Cape Verdean escudo' , 'value':'CVE'},
                {'label':'Cayman Islands dollar' , 'value':'KYD'},
                {'label':'Chilean peso' , 'value':'CLP'},
                {'label':'Chinese yuan' , 'value':'CNY'},
                {'label':'Colombian peso' , 'value':'COP'},
                {'label':'Comorian franc' , 'value':'KMF'},
                {'label':'Congolese franc' , 'value':'CDF'},
                {'label':'Cook Islands dollar' , 'value':'CKD[G]'},
                {'label':'Costa Rican colón' , 'value':'CRC'},
                {'label':'Croatian kuna' , 'value':'HRK'},
                {'label':'Cuban convertible peso' , 'value':'CUC'},
                {'label':'Netherlands Antillean guilder' , 'value':'ANG'},
                {'label':'Czech koruna' , 'value':'CZK'},
                {'label':'Danish krone' , 'value':'DKK'},
                {'label':'Djiboutian franc' , 'value':'DJF'},
                {'label':'Eastern Caribbean dollar' , 'value':'XCD'},
                {'label':'Dominican peso' , 'value':'DOP'},
                {'label':'Egyptian pound' , 'value':'EGP'},
                {'label':'Eritrean nakfa' , 'value':'ERN'},
                {'label':'Ethiopian birr' , 'value':'ETB'},
                {'label':'Falkland Islands pound' , 'value':'FKP'},
                {'label':'Faroese króna' , 'value':'FOK[G]'},
                {'label':'Fijian dollar' , 'value':'FJD'},
                {'label':'CFP franc' , 'value':'XPF'},
                {'label':'Gambian dalasi' , 'value':'GMD'},
                {'label':'Georgian lari' , 'value':'GEL'},
                {'label':'Ghanaian cedi' , 'value':'GHS'},
                {'label':'Gibraltar pound' , 'value':'GIP'},
                {'label':'Guatemalan quetzal' , 'value':'GTQ'},
                {'label':'Guernsey pound' , 'value':'GGP[G]'},
                {'label':'Guinean franc' , 'value':'GNF'},
                {'label':'Guyanese dollar' , 'value':'GYD'},
                {'label':'Haitian gourde' , 'value':'HTG'},
                {'label':'Honduran lempira' , 'value':'HNL'},
                {'label':'Hong Kong dollar' , 'value':'HKD'},
                {'label':'Icelandic króna' , 'value':'ISK'},
                {'label':'Indian rupee' , 'value':'INR'},
                {'label':'Indonesian rupiah' , 'value':'IDR'},
                {'label':'Iranian rial' , 'value':'IRR'},
                {'label':'Iraqi dinar' , 'value':'IQD'},
                {'label':'Israeli new shekel' , 'value':'ILS'},
                {'label':'Japanese yen' , 'value':'JPY'},
                {'label':'Jersey pound' , 'value':'JEP[G]'},
                {'label':'Jordanian dinar' , 'value':'JOD'},
                {'label':'Kazakhstani tenge' , 'value':'KZT'},
                {'label':'Kenyan shilling' , 'value':'KES'},
                {'label':'Kiribati dollar[E]' , 'value':'KID[G]'},
                {'label':'North Korean won' , 'value':'KPW'},
                {'label':'South Korean won' , 'value':'KRW'},
                {'label':'Kuwaiti dinar' , 'value':'KWD'},
                {'label':'Kyrgyzstani som' , 'value':'KGS'},
                {'label':'Lao kip' , 'value':'LAK'},
                {'label':'Lebanese pound' , 'value':'LBP'},
                {'label':'Lesotho loti' , 'value':'LSL'},
                {'label':'Liberian dollar' , 'value':'LRD'},
                {'label':'Libyan dinar' , 'value':'LYD'},
                {'label':'Macanese pataca' , 'value':'MOP'},
                {'label':'Malagasy ariary' , 'value':'MGA'},
                {'label':'Malawian kwacha' , 'value':'MWK'},
                {'label':'Malaysian ringgit' , 'value':'MYR'},
                {'label':'Maldivian rufiyaa' , 'value':'MVR'},
                {'label':'Mauritanian ouguiya' , 'value':'MRU'},
                {'label':'Mauritian rupee' , 'value':'MUR'},
                {'label':'Mexican peso' , 'value':'MXN'},
                {'label':'Moldovan leu' , 'value':'MDL'},
                {'label':'Mongolian tögrög' , 'value':'MNT'},
                {'label':'Moroccan dirham' , 'value':'MAD'},
                {'label':'Mozambican metical' , 'value':'MZN'},
                {'label':'Burmese kyat' , 'value':'MMK'},
                {'label':'Namibian dollar' , 'value':'NAD'},
                {'label':'Nepalese rupee' , 'value':'NPR'},
                {'label':'CFP franc' , 'value':'XPF'},
                {'label':'New Zealand dollar' , 'value':'NZD'},
                {'label':'Nicaraguan córdoba' , 'value':'NIO'},
                {'label':'Nigerian naira' , 'value':'NGN'},
                {'label':'Niue dollar[E]' , 'value':'(none)'},
                {'label':'Norwegian krone' , 'value':'NOK'},
                {'label':'Omani rial' , 'value':'OMR'},
                {'label':'Pakistani rupee' , 'value':'PKR'},
                {'label':'Israeli new shekel' , 'value':'ILS'},
                {'label':'Panamanian balboa' , 'value':'PAB'},
                {'label':'Papua New Guinean kina' , 'value':'PGK'},
                {'label':'Paraguayan guaraní' , 'value':'PYG'},
                {'label':'Peruvian sol' , 'value':'PEN'},
                {'label':'Philippine peso' , 'value':'PHP'},
                {'label':'Pitcairn Islands dollar[E]' , 'value':'PND[G]'},
                {'label':'Polish złoty' , 'value':'PLN'},
                {'label':'Qatari riyal' , 'value':'QAR'},
                {'label':'Russian ruble' , 'value':'RUB'},
                {'label':'Rwandan franc' , 'value':'RWF'},
                {'label':'Saint Helena pound' , 'value':'SHP'},
                {'label':'Samoan tālā' , 'value':'WST'},
                {'label':'São Tomé and Príncipe dobra' , 'value':'STN'},
                {'label':'Saudi riyal' , 'value':'SAR'},
                {'label':'Serbian dinar' , 'value':'RSD'},
                {'label':'Seychellois rupee' , 'value':'SCR'},
                {'label':'Sierra Leonean leone' , 'value':'SLL'},
                {'label':'Singapore dollar' , 'value':'SGD'},
                {'label':'Netherlands Antillean guilder' , 'value':'ANG'},
                {'label':'Solomon Islands dollar' , 'value':'SBD'},
                {'label':'Somali shilling' , 'value':'SOS'},
                {'label':'South African rand' , 'value':'ZAR'},
                {'label':'South Sudanese pound' , 'value':'SSP'},
                {'label':'Sri Lankan rupee' , 'value':'LKR'},
                {'label':'Sudanese pound' , 'value':'SDG'},
                {'label':'Surinamese dollar' , 'value':'SRD'},
                {'label':'Swedish krona' , 'value':'SEK'},
                {'label':'Swiss franc' , 'value':'CHF'},
                {'label':'Syrian pound' , 'value':'SYP'},
                {'label':'New Taiwan dollar' , 'value':'TWD'},
                {'label':'Tajikistani somoni' , 'value':'TJS'},
                {'label':'Tanzanian shilling' , 'value':'TZS'},
                {'label':'Thai baht' , 'value':'THB'},
                {'label':'Tongan paʻanga[P]' , 'value':'TOP'},
                {'label':'Trinidad and Tobago dollar' , 'value':'TTD'},
                {'label':'Tunisian dinar' , 'value':'TND'},
                {'label':'Turkish lira' , 'value':'TRY'},
                {'label':'Turkmenistan manat' , 'value':'TMT'},
                {'label':'Tuvaluan dollar' , 'value':'TVD[G]'},
                {'label':'Ugandan shilling' , 'value':'UGX'},
                {'label':'Ukrainian hryvnia' , 'value':'UAH'},
                {'label':'United Arab Emirates dirham' , 'value':'AED'},
                {'label':'British pound' , 'value':'GBP'},
                {'label':'United States dollar' , 'value':'USD'},
                {'label':'Uruguayan peso' , 'value':'UYU'},
                {'label':'Uzbekistani soʻm' , 'value':'UZS'},
                {'label':'Vanuatu vatu' , 'value':'VUV'},
                {'label':'Venezuelan bolívar soberano' , 'value':'VES'},
                {'label':'Vietnamese đồng' , 'value':'VND'},
                {'label':'Zambian kwacha' , 'value':'ZMW'},
                {'label':'RTGS dollar[6]' , 'value':''},],
            value: null,
            formData: {
                identifier: '',
                date: '',
                country: '',
                currency: '',
               
                defaultValueCurrency : {
                    "label" : "",
                    "value" : ""
                }
            },
            defaultCountry: {
                "label": "",
                "value": ""
            },
            colorCountryError: false,
            colorCurrencyError: false,
            showIdentifierExample: false,
            exampleExpression : ''
            
            
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeCountry = this.handleChangeCountry.bind(this);
        this.handleChangeCurrency = this.handleChangeCurrency.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.refreshExample = this.refreshExample.bind(this);

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
            },
            exampleExpression: new RandExp(this.props.setting.value ).gen()
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
               // country: this.props.setting.value,
                defaultValueCountry : {
                    "label" : this.props.setting.value,
                    "value" : this.props.setting.value
                }
            },
            defaultCountry: {
                "label": this.props.setting.value,
                "value": this.props.setting.value
            }
          
        });
        await this.props.getSettingsByUUID('5a74a10b-3eae-43f6-b019-d0823e28ead1');
        await this.setState({
            formData: {
                ...this.state.formData,
               // currency: this.props.setting.value,
                defaultValueCurrency : {
                    "label" : this.props.setting.value,
                    "value" : this.props.setting.value
                }
            }
            
        });
        await console.log('dataaaa '+this.state.exampleExpression);
        await console.log('form data '+JSON.stringify(this.state.formData.defaultValueCountry));
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
        if(event.target.name == 'identifier') {
           var text = new RandExp(event.target.value).gen();
           this.setState({exampleExpression:text})
        }
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
        if(this.state.formData.country == '' && this.state.formData.currency == '') {
           this.setState({colorCountryError:true});
           this.setState({colorCurrencyError:true});
           return;
        }
        else if(this.state.formData.country == '') {
          this.setState({colorCountryError:true});
          return;
        }
        else if(this.state.formData.currency == '') {
          this.setState({colorCurrencyError:true});
          return;
        }
        else {
            await this.props.postSystemSettings('9b68a10b-3ede-43f6-b019-d0823e28ebd1',this.getJSON(this.state.formData.identifier))
            await this.props.postSystemSettings('6a78a10b-3eae-43f6-b019-d0823e28ebd1',this.getJSON(this.state.formData.date))
            await this.props.postSystemSettings('3h98a10f-3edz-43f6-b020-d0823e28ebd1',this.getJSON(this.state.formData.country))
            await this.props.postSystemSettings('5a74a10b-3eae-43f6-b019-d0823e28ead1',this.getJSON(this.state.formData.currency))
            await createNotification('success','Global Config Updated');
    
        }

    }
    getJSON(value) {
        return {
            "value" : value
        }
    }
    async refreshExample(e) {
        e.preventDefault()
        await this.setState({exampleExpression:new RandExp(this.state.formData.identifier).gen()});
    }
    render() {
        const { formData ,colorCountryError , colorCurrencyError} = this.state;
        console.log('hereee '+JSON.stringify(formData))
        return (
            <div className="row container-fluid l-main-container">
                <div className="card fp-header">
                <div className="card-header">
                        <div className="row">
                            <div className="col-md-8 col-sm-4">
                                <span className="text-muted">Global Settings</span>
                            </div>
                         </div>
                    </div>
                   
                    <div className="card-body rm-paadding" style={{height:'450px'}}>
                        <div className="row">

                            <div className="col-sm-2">
                            </div>
                            <div className="col-sm-8">
                                <div className="card" style={{ marginTop: '30px' }}>
                                    <div className="card-header">
                                        Global Configuration
                                </div>
                                    <div className="card-body" >
                                        <form onSubmit={this.handleSubmit}>
                                            <div className="form-group row">
                                                <label className="col-form-label col-sm-4 required" htmlFor="identifier">Identifier Format</label>
                                                <div className="col-sm-8">
                                                    <input type="text" className="form-control" value={formData.identifier} name="identifier" onChange={this.handleChange} required />
                                                </div>
                                                
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-form-label col-sm-4" htmlFor="ex">Example</label>
                                                <div className="col-sm-8">
                                                {this.state.exampleExpression} <button onClick={this.refreshExample}><i class="fas fa-redo-alt"></i>
</button>
                                                </div>
                                                
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-form-label col-sm-4 required" htmlFor="date">Date Format</label>
                                                <div className="col-sm-8">
                                                    <input type="text" className="form-control" name="date" value={formData.date} onChange={this.handleChange} required/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="country" className="col-form-label col-sm-4 required">Country</label>
                                                <div className="col-sm-8">
                                                    <Select
                                                        //components={animatedComponents}
                                                        options={this.state.countryOptions}
                                                        onChange={this.handleChangeCountry}
                                                        defaultValue={{"label" : this.state.formData.country,
                                                                       "value" : this.state.formData.country
                                                                    }}

                                                        name="country"
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
                                                    //closeMenuOnSelect={false}
                                                    />
                                                </div>

                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="currency" className="col-form-label col-sm-4 required">Currency</label>
                                                <div className="col-sm-8">
                                                    <Select
                                                        //components={animatedComponents}
                                                        options={this.state.currencyOptions}
                                                        defaultValue={this.state.formData.defaultValueCurrency}
                                                        onChange={this.handleChangeCurrency}
                                                        name="currency"
                                                        styles={{
                                                            control: (provided, state) =>
                                                                colorCurrencyError
                                                                    ? {
                                                                        ...provided,
                                                                        boxShadow: "0 0 0 1px red !important",
                                                                        borderColor: "red !important"
                                                                    }
                                                                    : provided
                                                        }}
                                                    // closeMenuOnSelect={false}
                                                    // isMulti
                                                    />
                                                </div>

                                            </div>
                                            <button type="submit" class="btn btn-primary ss-btn-submit">
                                                Save
                        </button>
                                     


                                        </form>
                                    </div>
                                </div>

                            </div>
                            <div className="col-sm-2">
                            </div>
                        </div>
                    </div>
                </div>
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