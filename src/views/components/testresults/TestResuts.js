import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux'
import HashMap from 'hashmap';
import DatePicker from "react-datepicker"; 
import Select from 'react-select';
import { labtestattributeAction } from '../../../state/ducks/labtestattribute';
import {labtestOrderAction} from '../../../state/ducks/labtestorder';
import { conceptsAction } from '../../../state/ducks/concepts';
import './TestResults.css'

class TestResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            htmlToDisplay: [],
            formData: []
        }
        this.testUUID = localStorage.getItem('active-test-type');
        this.testOrder = localStorage.getItem('active-test');
        this.labReferenceNumber = localStorage.getItem('reference');
        this.attributes = [];
        this.configOptions = new HashMap();
        this.HTMLToRender = [];
        this.dropDown = [];
        this.onChangeSelect = this.onChangeSelect.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)

    }
    static propTypes = {
        attributesForOrder: PropTypes.array.isRequired,
        concept: PropTypes.array.isRequired
    };
    async componentWillMount() {
        await this.props.getAttributesForOrder(this.testUUID);
        // await this.createAttributes();
        await this.createAttributes()
        await this.sortAttributesBasedOnSortWeight();
        // await this.createDropDowns();

        await this.generateForm();
        await this.setState({ htmlToDisplay: this.generateForm() })
    }
    createAttributes() {
        this.attributes = this.props.attributesForOrder.results;
    }
    createDropDowns() {
        this.attributes.forEach(element => {
            if (element.datatypeClassname == 'org.openmrs.customdatatype.datatype.ConceptDatatype') {
                alert(element.display)
                let dropDown = [];
                this.props.getConceptByUUID(element.datatypeConfig).then(() => {
                    this.props.concept.answers.forEach(element => {
                        dropDown.push({
                            "label": element.display,
                            "value": element.uuid
                        })
                    })
                    console.log('elem ' + element.display)
                    this.configOptions.set(element.display, dropDown);

                });
            }


        });
    }
    createJSONForPost() {
        return {
            "order": this.testOrder,
            "labReferenceNumber": this.labReferenceNumber,
            "labTestType": this.testUUID,
            "attributes": this.state.formData

        }
    }
    sortAttributesBasedOnSortWeight() {
        for (let i = 0; i < this.attributes.length; i++) {
            let holder = this.attributes[i];
            let j = i - 1;
            while (j >= 0 && this.attributes[j].sortWeight > holder.sortWeight) {
                this.attributes[j + 1] = this.attributes[j];
                j = j - 1;
            }
            this.attributes[j + 1] = holder;
        }
        console.log('--' + JSON.stringify(this.attributes))
    }
    async generateDropDown(uuid, display) {
        // this.dropDown = [];
        await this.props.getConceptByUUID(uuid)
        await this.props.concept.answers.forEach(element => {
            this.dropDown.push({
                "label": element.display,
                "value": element.uuid
            })
            // alert(JSON.stringify(dropDown))
        })
        //return dropDown;
        await this.configOptions.set([display], this.dropDown);


        await console.log('concept i ' + JSON.stringify(this.configOptions))

    }
    onChangeSelect = (params, meta) => {
        console.log('params' + JSON.stringify(meta));
        this.state.formData.push({
            "attributeType": meta.name,
            "valueReference": params.label
        })
    }
    handleChange(event) {
        const { name, value } = event.target;
        var result = this.state.formData.filter(obj => {
            return obj.attributeType === name
          })
        console.log('resultz '+JSON.stringify(result[0])+this.state.formData.indexOf(result[0]))
       // this.state.formData.
        //this.state.formData.filter(function(formData) {return formData.attributeType === name}) ?
        if(this.state.formData.indexOf(result[0]) != -1) 
         this.state.formData.splice(this.state.formData.indexOf(result[0]))

       // this.state.formData.indexOf(result[0])
        this.state.formData.push({
            "attributeType": name,
            "valueReference": value
        })
    }
    handleSubmit(event) {
        event.preventDefault();
        this.state.formData.forEach(element => {
            console.log('elm {' + element.attributeType + ',' + element.valueReference + "}")
        });
        console.log('post'+JSON.stringify(this.createJSONForPost()));
        this.props.postTestOrder(this.createJSONForPost())
    }
    async handleChangeDate(date, name) {
        ///const { sampleFormData } = this.state;
        alert(name)
        await this.setState({ [name]: date });
        //await alert(this.state[name])
        this.state.formData.push({
            "attributeType": name,
            "valueReference": date
        })
        // this.setState({
        //     sampleFormData: {
        //         ...sampleFormData,
        //         collectionDate: date
        //     }
        // });
    }
    generateForm() {
        let HTMLToRender = [];
        this.attributes.forEach(element => {
            console.log('element ' + element.display)
            switch (element.datatypeClassname) {
                case 'org.openmrs.customdatatype.datatype.DateDatatype': {
                    HTMLToRender.push(
                        <div className="form-group row">
                            <label htmlFor={element.display} className="col-form-label col-sm-6 form-label">{element.name}</label>
                            <div className="col-sm-6">
                                <DatePicker name={element.uuid} selected={this.state[element.uuid]} className="form-control date-picker" onChange={(date) => this.handleChangeDate(date, element.uuid)} maxDate={new Date()} dateFormat="dd/MM/yyyy" placeholderText="Click to select a date" />
                            </div>
                        </div>
                    )
                    break;
                }
                case 'org.openmrs.customdatatype.datatype.FreeTextDatatype': {
                    HTMLToRender.push(
                        <div className="form-group row">
                            <label htmlFor={element.display} className="col-form-label col-sm-6 form-label">{element.name}</label>
                            <div className="col-sm-6">
                                <input type="text" className="form-control" name={element.uuid} maxLength={element.datatypeConfig != '' ? element.datatypeConfig.match(/\d+/)[0] : ''} onChange={this.handleChange} />
                            </div>
                        </div>
                    )
                    break;
                }
                case 'org.openmrs.customdatatype.datatype.FloatDatatype': {
                    HTMLToRender.push(
                        <div className="form-group row">
                            <label htmlFor={element.display} className="col-form-label col-sm-6 form-label">{element.name}</label>
                            <div className="col-sm-6">
                                <input type="number" name={element.uuid} max={element.datatypeConfig ? element.datatypeConfig.match(/\d+/)[0] : ''} onChange={this.handleChange} />
                            </div>
                        </div>
                    )
                    break;
                }
                case 'org.openmrs.customdatatype.datatype.ConceptDatatype': {

                    this.generateDropDown(element.datatypeConfig, element.display);
                    //this.setState({[element.display]:this.dropDown});


                    //  console.log("json " + JSON.stringify(dropDown))
                    HTMLToRender.push(
                        <div className="form-group row">
                            <label htmlFor={element.display} className="col-form-label col-sm-6 form-label">{element.name}</label>
                            <div className="col-sm-6">
                                <Select
                                    //value={}
                                    onChange={this.onChangeSelect}
                                    options={this.dropDown}
                                    className="tr-select-dropdown"
                                    name={element.uuid}

                                />
                            </div>
                        </div>)
                    //HTMLToRender.push(this.generateDropDown(element.datatypeConfig,element))
                    break;
                }
                case 'org.openmrs.customdatatype.datatype.BooleanDatatype': {
                    if (element.datatypeConfig == "") {
                        HTMLToRender.push(
                            <div className="col-sm-6">
                                <div className="form-check">
                                    <input className="form-check-input" type='checkbox' name={element.uuid} value={element.uuid} onChange={this.handleChange} />
                                    <label className="form-check-label form-label" htmlFor="gridRadios3">{element.name} </label>
                                </div>
                            </div>
                        )
                    }
                    break;
                }
                case 'org.openmrs.customdatatype.datatype.LongFreeTextDatatype': {
                    HTMLToRender.push(
                        <div className="form-group row">
                            <label htmlFor={element.display} className="col-form-label col-sm-4">{element.name}</label>
                            <div className="col-sm-8">
                                <textarea name={element.uuid} maxLength={element.datatypeConfig != '' ? element.datatypeConfig.match(/\d+/)[0] : ''} onChange={this.handleChange} />
                            </div>
                        </div>
                    )
                    break;
                }
                default: break;
            }
        })
        console.log('htm g' + this.HTMLToRender)
        return HTMLToRender;
    }
    render() {
        console.log('reender' + JSON.stringify(this.configOptions))
        const { state } = this.state
        return (
            <div className="row ol-main-header">
                <div className="lt-heading col-sm-4 col-md-4 col-lg-4">
                    <h2 className="title">Add Test Result</h2>
                </div>
                <div className="ol-main-card card">
                    <div className="row card-header">
                        <h4>Results for {localStorage.getItem('active-test-name')}</h4>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-sm-3">
                            </div>
                            <div className="col-sm-6" >
                                <form onSubmit={this.handleSubmit}>
                                    {
                                        this.state.htmlToDisplay
                                    }
                                    <div className="row">
                                        <button type="submit" className="btn btn-primary sb-button">Save</button>
                                        <button type="button" className="btn btn-danger cancel-button">Cancel</button>
                                    </div>
                                </form>
                            </div>
                            <div className="col-sm-3">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }

}
const mapStateToProps = state => ({
    attributesForOrder: state.labtestattribute.labTestAttributeForOrder,
    concept: state.concepts.concept
})
const mapDispatchToProps = {
    getAttributesForOrder: labtestattributeAction.getLabTestAttributeForOrder,
    getConceptByUUID: conceptsAction.getConceptByUUID,
    postTestOrder: labtestOrderAction.postLabTestOrder

}
export default connect(mapStateToProps, mapDispatchToProps)(TestResults);