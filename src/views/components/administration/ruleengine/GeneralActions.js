import React, { useState, useCallback } from 'react';
import Select from 'react-select';

export default function GeneralActions({ values, handleChange, prevStep, saverule }) {

    useCallback(
        (e) => {
            e.preventDefault();
            prevStep();
            saverule();
        },
        [],
    );


    return (
        <div className="row container-fluid ">
            <div className="card" style={{
                width: '60%', display: 'block', marginLeft: 'auto',
                marginRight: 'auto',
                padding: '20px'
            }}>
                <div className="card-body">
                    <div className="row">
                        <form style={{ width: '100%' }}>
                            <div className="row" style={{ padding: '15px' }}>
                                <div className="col-sm-3 col-md-3 col-lg-3">
                                    <label className="ec-label">Select Action</label>
                                </div>
                                <div className="col-sm-9 col-md-9 col-lg-9">
                                    <Select
                                        // value={values.workflowType}
                                        // onChange={this.handleEventTypeChange}
                                        options={values.actionTypes}
                                    />
                                </div>
                            </div>
                            <div className="row" style={{ padding: '15px' }}>
                                <div className="col-sm-3 col-md-3 col-lg-3">
                                    <label className="ec-label">Select Form</label>
                                </div>
                                <div className="col-sm-9 col-md-9 col-lg-9">
                                    <Select
                                        // value={eventTypeOption}
                                        // onChange={this.handleEventTypeChange}
                                        options={values.formOptions}
                                    />
                                </div>
                            </div>
                            <div className="row " style={{ marginTop: '20px', marginBottom: '20px' }}>
                                <div className="col-sm-4" ></div>
                                <div className="col-sm-4" >
                                      <button onClick={prevStep.bind(this)} className='btn btn-primary  save-btn'>Previous</button>
                                </div>
                                <div className='col-sm-4 '>
                                        <button onClick={saverule.bind(this)} className='btn btn-primary  save-btn'>Save Rule</button>
                                </div>
                            </div>
                        </form>

                    </div>
                </div>
            </div>

        </div>
    )
}