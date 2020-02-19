import React, { useState, useCallback, useEffect } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux'
import { formAction } from '../../../../../state/ducks/form'
import { createNotification } from '../../../../../utilities/helpers/helper'

function TargetActions(props) {

    const [targetFormList, setTargetFormList] = useState([])
    const [targetFormQuestionList, setTargetFormQuestionList] = useState([])
    const [targetFormQuestionListOrg, setTargetFormQuestionListOrg] = useState([])
    const [formListInOriginalFormat, setFormListInOriginalFormat] = useState([])
    const [targetFormQuestionOptionList, setTargetFormQuestionOptionList] = useState([])
    const [form, setForm] = useState('')
    const [actionTypeValue, setActionTypeValue] = useState('')
    const [formQuestion, setFormQuestion] = useState('')
    const [targetActionList, setTargetActionList] = ([])

    useCallback(
        (e) => {
            e.preventDefault();
            props.prevStep();
            props.saverule();
        },
        [],
    );

    useEffect(() => {
        if (props.formList !== undefined) {
            console.log("formlist :: ", props.formList)
            setFormListInOriginalFormat(props.formList)
            setTargetFormList(formFormat(props.formList.forms))
        }
    }, [props.formList])

    function formFormat(list) {
        let array = []
        if (list) {
            list.forEach(element => {
                array.push(
                    {
                        label: element.name,
                        value: element.uuid
                    }
                )
            });

        }
        return array
    }

    function handleEventTypeChange(val) {
        setActionTypeValue(val)
        if (val.value === 'openform') {
            setTargetFormQuestionList([])
        }

    }
    function handleFormChange(value) {
        setForm(value)
        filterQuestion(value)
    }
    function filterQuestion(value) {
        let filterForm = formListInOriginalFormat.forms.filter(data => data.uuid === value.value)
        if (filterForm !== undefined && filterForm[0].formFields.length > 0 && actionTypeValue.value !== 'openform') {
            setTargetFormQuestionList(questionFormat(filterForm[0].formFields))
        }
    }

    function questionFormat(list) {
        console.log("questionFormat :: ", list)
        let array = []
        if (list) {
            list.forEach(element => {
                if (element.field) {
                    array.push(
                        {
                            label: element.displayText ? element.displayText : element.field.name,
                            value: element.field.uuid
                        }
                    )
                }

            });
        }
        return array
    }

    function handleFormQuestionChange(val) {
        setFormQuestion(val)
    }

    function saverule(e) {
        e.preventDefault();
        console.log("save Form rule ", form.value, actionTypeValue)
        if (form.value === undefined && actionTypeValue === '') {
            createNotification("error", "")
        } else {
            const targetForm = {
                ruleAction: actionTypeValue.value,
                targetForm: form.value,
                targetQuestion: formQuestion.value
            }
            console.log("targetForm :: ", targetForm)
            props.saverule({ targetForm: targetForm })
        }
    }


    return (
        <div className="row container-fluid ">
            <div className="card" style={{
                width: '60%', display: 'block', marginLeft: 'auto',
                marginRight: 'auto',
                padding: '20px'
            }}>
                <div className="card-body">
                    <div className="row">
                        <form onSubmit={saverule} style={{ width: '100%' }}>
                            <div className="row" style={{ padding: '15px' }}>
                                <div className="col-sm-3 col-md-3 col-lg-3">
                                    <label className="required ec-label">Select Action</label>
                                </div>
                                <div className="col-sm-9 col-md-9 col-lg-9">
                                    <Select
                                        value={actionTypeValue}
                                        onChange={handleEventTypeChange}
                                        options={props.values.actionTypes}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row" style={{ padding: '15px' }}>
                                <div className="col-sm-3 col-md-3 col-lg-3">
                                    <label className="required ec-label">Select Form</label>
                                </div>
                                <div className="col-sm-9 col-md-9 col-lg-9">
                                    <Select
                                        value={form}
                                        onChange={handleFormChange}
                                        options={targetFormList}
                                        required
                                    />
                                </div>
                            </div>
                            {
                                (targetFormQuestionList && targetFormQuestionList.length > 0) ?
                                    <div className="row" style={{ padding: '15px' }}>
                                        <div className="col-sm-3 col-md-3 col-lg-3">
                                            <label className="ec-label">Select Question</label>
                                        </div>
                                        <div className="col-sm-9 col-md-9 col-lg-9">
                                            <Select
                                                value={formQuestion}
                                                onChange={handleFormQuestionChange}
                                                options={targetFormQuestionList}
                                            />
                                        </div>
                                    </div>
                                    : <></>
                            }

                            <div className="row " style={{ marginTop: '20px', marginBottom: '20px' }}>
                                <div className="col-sm-4" ></div>
                                <div className="col-sm-4" >
                                    <button onClick={props.prevStep.bind(this)} className='btn btn-primary  save-btn'>Previous</button>
                                </div>
                                <div className='col-sm-4 '>
                                    <button type="submit" className='btn btn-primary  save-btn'>Save Rule</button>
                                </div>
                            </div>
                        </form>

                    </div>
                </div>
            </div>

        </div>
    )
}
const mapStateToProps = state => ({
    formList: state.formField.forms
})

const mapDispatchToProps = {
    getAllForm: formAction.fetchForms
}

export default connect(mapStateToProps, mapDispatchToProps)(TargetActions);