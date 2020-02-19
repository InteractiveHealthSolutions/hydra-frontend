import React from 'react';
import './patientregistration.css'
import DatePicker from "react-datepicker";
import {PatiendSideBackButton} from '../../common/sidebutton/SideBackButton'

class PatientRegistration extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            startDate: "",
        }
    }

    handleDateChangeRawFrom = e => {
        e.preventDefault();
    }
    handleChangeDateFrom = date => {
        this.setState({

            startDate: date
        });
    }
    render() {
        const { startDate } = this.state;
        return (
            <div class="register">
                <div class="row">
                    <div class="col-md-1 register-left">
                    </div>
                    <div class="col-md-10 col-sm-11 register-right">
                        <div class="tab-content" id="myTabContent">
                            <h3 class="register-heading">Create a New Patient</h3>
                            <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                <div class="row register-form">

                                    <div className="row register-form-row">
                                        <label htmlFor="eventName" className="ec-label">First name <span className="astaric-color">*</span></label>
                                        <input
                                            placeholder=""
                                            type="text"
                                            name="eventName"
                                            className='pr-width-control form-control'
                                        />
                                    </div>
                                    <div className="row register-form-row">
                                        <label htmlFor="eventName" className="ec-label">Last Name <span className="astaric-color">*</span></label>
                                        <input
                                            placeholder=""
                                            type="text"
                                            name="eventName"
                                            className='pr-width-control form-control'
                                        />
                                    </div>
                                    <div className="row register-form-row">
                                        <label htmlFor="eventName" className="ec-label">Identifier <span className="astaric-color">*</span></label>
                                        <input
                                            placeholder=""
                                            type="text"
                                            name="eventName"
                                            className='pr-width-control form-control'
                                        />
                                    </div>
                                    {/* demography */}
                                    <div className="row register-form-row pr-radio-container">
                                        <div className="col-sm-8">
                                            <label htmlFor="eventName" className="ec-label">Gender<span className="astaric-color">*</span></label>
                                        </div>
                                        <div className="col-sm-8">
                                            <label className="radio-inline pr-radio" >
                                                <input type="radio" name="optradio" required /> Male
                                          </label>
                                            <label class="radio-inline">
                                                <input type="radio" name="optradio" /> Female
                                          </label>
                                        </div>
                                    </div>
                                    <div className="row register-form-row pr-date-div">
                                        <div className="col-sm-8">
                                            <label htmlFor="eventName" className="ec-label">Birthdate</label>
                                        </div>
                                        <div className="col-sm-8">
                                            <DatePicker
                                                selected={startDate}
                                                onChangeRaw={this.handleDateChangeRawFrom}
                                                onChange={this.handleChangeDateFrom}
                                                className="form-control"
                                                dateFormat="dd/MM/yyyy"
                                                placeholderText=""
                                            />
                                        </div>
                                    </div>
                                    <div className="row register-form-row pr-age-div">
                                        <label htmlFor="eventName" className="ec-label">Age (yrs) </label>
                                        <input
                                            placeholder=""
                                            type="number"
                                            name="eventName"
                                            className='pr-width-control form-control'
                                        />
                                    </div>
                                    {/* save button */}
                                    <div className="col-md-4 col-sm-2 pr-save-btn-div">
                                        {/* <Link to="/PatientRegistration"> */}
                                        <button class="fp-btn btn btn-primary pr-save-btn"><i class="fas fa-save"> </i> Save</button>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <PatiendSideBackButton
                        navigateTo="FindPatient"
                    ></PatiendSideBackButton>
                </div>
            </div>
        )
    }
}

export default PatientRegistration