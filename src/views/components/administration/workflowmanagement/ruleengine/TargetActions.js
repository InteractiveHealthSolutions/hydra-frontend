import React, { useState, useCallback, useEffect } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux'
import { formAction } from '../../../../../state/ducks/form'
import { createNotification } from '../../../../../utilities/helpers/helper'
import CardTemplate from '../../../../ui/cards/SimpleCard/CardTemplate';

function TargetActions(props) {

    const [targetFormList, setTargetFormList] = useState([])
    const [targetFormQuestionList, setTargetFormQuestionList] = useState([])
    const [formListInOriginalFormat, setFormListInOriginalFormat] = useState([])
    const [form, setForm] = useState('')
    const [actionTypeValue, setActionTypeValue] = useState('')
    const [formQuestion, setFormQuestion] = useState('')
    const [questionOptions, setQuestionOptions] = useState([])
    const [selectOption, setSelectOption] = useState('')


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
            setSelectOption('')
            setQuestionOptions([])
        }

    }
    function handleFormChange(value) {
        setForm(value)
        filterQuestion(value)
    }
    async function filterQuestion(value) {
        let filterForm = formListInOriginalFormat.forms.filter(data => data.uuid === value.value)
        if (filterForm !== undefined && filterForm[0].formFields.length > 0 && actionTypeValue.value !== 'openform') {
            if (actionTypeValue.value === 'autoselect') {
                let CodedList = await filterForm[0].formFields.filter(question => question.field.attributeName === "Coded")
                setTargetFormQuestionList(questionFormat(CodedList))
            } else {
                setTargetFormQuestionList(questionFormat(filterForm[0].formFields))
            }

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
                            value: element.field.uuid,
                            formField: element.uuid,
                            dataType: element.field.attributeName,
                            answers: element.field.answers

                        }
                    )
                }

            });
        }
        return array
    }

    function handleFormQuestionChange(val) {
        setFormQuestion(val)
        if (actionTypeValue.value === 'autoselect') {
            setQuestionOptions(questionOptionFormat(val.answers))
        }
    }
    function questionOptionFormat(list) {
        let array = []
        if (list) {
            array = list.map(element => ({
                label: element.concept.display,
                value: element.uuid
            }))
        }
        return array
    }
    function handleOptionChange(val) {
        setSelectOption(val)
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
                targetQuestion: formQuestion.value,
                targetFieldAnswer: selectOption.value,
                targetFormField: formQuestion.formField
            }
            console.log("targetForm :: ", targetForm)
            props.saverule({ targetForm: targetForm })
        }
    }
    return (
        <form onSubmit={saverule} style={{ width: '100%' }}>
            <CardTemplate
                title="Target Form"
                height="500px"
                action={
                    <>
                        <button onClick={props.prevStep.bind(this)} className='btn btn-primary btn-re'>Previous</button>
                        <button type="submit" className='btn btn-primary btn-re'>Save Rule</button>
                    </>}
            >
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
                        <>
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
                            {
                                (questionOptions && questionOptions.length > 0) ?
                                    <div className="row" style={{ padding: '15px' }}>
                                        <div className="col-sm-3 col-md-3 col-lg-3">
                                            <label className="ec-label">Select Option</label>
                                        </div>
                                        <div className="col-sm-9 col-md-9 col-lg-9">
                                            <Select
                                                value={selectOption}
                                                onChange={handleOptionChange}
                                                options={questionOptions}
                                            />
                                        </div>
                                    </div>
                                    : <></>
                            }
                        </>
                        : <></>
                }


            </CardTemplate>
        </form>
    )
}
const mapStateToProps = state => ({
    formList: state.formField.forms
})

const mapDispatchToProps = {
    getAllForm: formAction.fetchForms
}

export default connect(mapStateToProps, mapDispatchToProps)(TargetActions);