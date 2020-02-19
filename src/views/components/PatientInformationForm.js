import React from 'react';
import DatePicker from "react-datepicker";
import Select from 'react-select';
import { connect } from 'react-redux';
import {formdesignerconstants} from '../../utilities/constants';
import '../style/patientinformationform.css';

const options = [
    { label: 'Verbal Screening By Nurse', value: 'a' },
    { label: 'Verbal Screening by Doctors', value: 'b' },
    { label: 'Screening Component by Doctors', value: 'c' },
    { label: 'Screening Component by Doctors', value: 'd' }


];
class PatientInformationForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedOption: null,
            showProperty: false,
            form : '',
            userNameLabel: 'First Name'
        };
        this.onClick = this.onClick.bind(this);
    }

    handleInputFormChange = (e) => {
        this.setState({
            userNameLabel: e.target.value
        });
    }
    handleSubmit = e => {
        e.preventDefault();
        
        let newevent = [
            {
                dataName: 'Data Name' , 
                labelName: 'Label name' ,
                defaultValue : 'Default value',
                required: false,
                fieldLength : '0',
                showQuestion: '',
                errorMessage: ''
            }
        ];
        this.props.saveProp(newevent);
    }
    

    onClick(e) {
        this.setState({ showProperty: true });
        this.setState({
                form :<form onSubmit={this.handleSubmit}>
                <label>Data name</label>
                <input type="text" className="form-control"   placeholder={e.target.name}/>
                <label>Label name</label>
                <br/>
                <input type="text" className="form-control" onChange={this.handleInputFormChange} placeholder={e.target.previousElementSibling.textContent}/>
                <label>Default value</label>
                <input className="form-control" type="text" />
                <label>Required</label>&nbsp;&nbsp;
                <input type="radio" name="isRequired" />
                <label>Yes</label>&nbsp;&nbsp;&nbsp;
                <input type="radio" name="isRequired" />
                <label>No</label>
                <br/>
                <label>Field Length</label>
                <br/>
                <input type="number" className="form-control" style={{width: "50px"}} placeholder={e.target.maxLength?e.target.maxLength:0}/>
                <label>Show question</label>&nbsp;&nbsp;
                <input type="checkbox" />
                <br/>
                <label>Error message</label>
                <input type="text" className="form-control" style={{width: "200px"}}/>
                <button type="submit" className="btn btn-primary form-control" style={{width: "200px", marginLeft: '80px', marginTop : '8px'}}>Save</button>
            </form>
        })

        
    }
 
    handleChange = selectedOption => {
        this.setState({ selectedOption });
    };
    render() {
        const { selectedOption,userNameLabel } = this.state;

        return (
            <div className="row" style={{ width: '100%', height: '100%' }}>
                <div className="col-6">
                    <h2 style={{ marginLeft: "35px", marginTop: "-15px" }}>Screening Component</h2>

                    <div id="form-panel-form-designer" className="card">
                        <div className="card-header">
                            Patient Information
                   </div>   
                        <div className="card-body">
                            <form>
                                <div className="form-group row" style={{ marginLeft: '20px' }}>
                                    <label htmlFor="firstName" class="col-sm-2 col-form-label">{userNameLabel}</label>
                                    {/* <div class="col-sm-4" style={{ marginLeft: "-30px" }}> */}
                                        <input type="text" className="form-control col-sm-4" autoComplete="off" name="firstname" maxLength="10"onClick={this.onClick} readOnly />
                                    {/* </div> */}
                                    <label htmlFor="givenname" className="col-sm-2 col-form-label">Given Name</label>
                                    {/* <div class="col-sm-4" style={{ marginLeft: "-20px" }}> */}
                                        <input type="text" className="form-control col-sm-4" autoComplete="off" name="givenname" onClick={this.onClick} readOnly />
                                    </div>
                                {/* </div> */}
                                <div className="form-group row" style={{ marginLeft: '20px' }}>
                                    <label htmlFor="address" class="col-sm-2 col-form-label">Address</label>
                                    {/* <div class="col-sm-10" style={{ marginLeft: "-30px" }}> */}
                                        <input type="text" className="form-control col-sm-10" style={{ height: "70px", width: "660px" }} autoComplete="off" name="address" onClick={this.onClick} readOnly />
                                    {/* </div> */}
                                </div>
                                <div className="form-group row" style={{ marginLeft: '20px' }}>
                                    <label htmlFor="age" class="col-sm-2 col-form-label">Age or DOB</label>
                                    {/* <div class="col-sm-10" style={{ marginLeft: "-30px" }}> */}
                                        <DatePicker name="date" style={{ marginLeft: "20px" }} className="form-control date-picker-form" maxDate={new Date()} dateFormat="dd/MM/yyyy" placeholderText="" onClick={this.onClick} />
                                        <img style={{ width: "50px", marginTop: "-8px" }} src={require('../../assets/datepicker.png')} alt="" />
                                    </div>
                                {/* </div> */}
                                <div className="form-group row" style={{ marginLeft: '20px' }}>
                                    <label htmlFor="statetype" class="col-sm-2 col-form-label">State Type</label>
                                    <div class="col-sm-10" style={{ marginLeft: "-18px" }}>
                                        <Select
                                            value={selectedOption}
                                            isMulti
                                            onChange={this.handleChange}
                                            options={options}
                                            className="select-dropdown"
                                            name = "statetype"
                                            onClick={this.onClick}
                                        />
                                    </div>
                                </div>
                                <div className="form-group row" style={{ marginLeft: '20px' }}>
                                    <label htmlFor="address" class="col-sm-2 col-form-label">Post Actions</label>
                                    <div class="col-sm-10" style={{ marginLeft: "-18px" }}>

                                        <input type="text" className="form-control col-sm-10" style={{ height: "70px", width: "660px" }} autoComplete="off" name="action"/>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-3">
                    <div id="properties-panel" className="card">
                        <div className="card-header">
                            Properties
                   </div>
                        <div className="card-body">
                            {
                                this.state.showProperty &&
                                <div>
                                   {this.state.form}
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapSateToProps = (state) => {
    console.log("State=== ")
    return {
        getProperties: state.formdesignerreducer.propData
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveProp: (data) => { dispatch({ type: formdesignerconstants.SAVE, payload: data }) }
    }
}



export default connect(mapSateToProps,mapDispatchToProps)(PatientInformationForm);