import React from 'react'

import {
    Formik,
    Field,
    Form,
    useField,
    FieldAttributes,
    FieldArray,
    useFormikContext
}
    from 'formik'
import {
    TextField,
    FormGroup,
}
    from '@material-ui/core'

import {
    NUMERIC,
    CODED,
    TEXT,
    DATE_TIME,
    CONTACT_TRACING,
    DATE_TIME_PICKER,
    TEXT_BOX,
    SINGLE_SELECT_DROPDOWN,
    MULTIPLE_CHOICE,
    SINGLE_SELECT_RADIOBUTTON,
    HEADING,
    AGE,
    ADDRESS
} from '../../../../../utilities/constants/globalconstants'
import CustomSelect from './CustomSelect'
import AddressWidget from './AddressWidget'
import styles from './fromview.module.css';
import ContactTracingWidget from './ContactTracingWidget'
import { DatePickerField } from './DatePickerField'
import { CustomRadioButton } from './CustomRadioButton'
import { HeadingWidget } from './HeadingWidget'
import { CustomCheckBox } from './CustomCheckBox'
import CheckRule from './CheckRule'



const WidgetGenerator = ({
    type: {
        field: { parsedRule, fieldType: { display }, fieldId, answers, name },
        displayText,
        mandatory,
        children
    },
    setFieldValue,
    values,
    handleChange,
    handleBlur,
    setFieldTouched,
    touched,
    errors,
    country
}) => {

    //console.log("parsedRule", parsedRule)

    switch (display) {

        case TEXT_BOX:
            return (
                <CheckRule
                    rule={parsedRule}
                    values ={values}
                    type ={display}
                >
                    <FormGroup>
                        <label className={mandatory ? "required" : ""}>{displayText ? displayText : name}</label>
                        <input
                            placeholder=""
                            type="text"
                            name={fieldId}
                            className='form-control'
                            onChange={value => setFieldValue(fieldId, value.target.value)}
                        />
                        {
                            errors[fieldId] ? <span className={styles.error}>{errors[fieldId]}</span> : ""
                        }
                    </FormGroup>
                </CheckRule>
            )
        case SINGLE_SELECT_DROPDOWN:
            return (
                <CheckRule
                    rule={parsedRule}
                    values ={values}
                    type ={display}
                >
                    <FormGroup>
                        <label className={mandatory ? "required" : ""}>{displayText ? displayText : name}</label>
                        <CustomSelect
                            name={fieldId}
                            handleChange={setFieldValue}
                            options={answers.map(data => (
                                {
                                    label: data.concept.display,
                                    value: data.concept.uuid
                                })
                            )}
                            error={errors}
                            touched={touched}
                            isMulti={false}

                        />
                        {
                            errors[fieldId] ? <span className={styles.error}>{errors[fieldId]}</span> : ""
                        }
                    </FormGroup>
                </CheckRule>

            )
        case SINGLE_SELECT_RADIOBUTTON:
            return (
                <CheckRule
                    rule={parsedRule}
                    values ={values}
                    type ={display}
                >
                    <FormGroup>
                        <label className={mandatory ? "required" : ""}>{displayText ? displayText : name}</label>
                        {
                            answers.map((element, index) => (
                                <CustomRadioButton name={fieldId} type="radio" value={element.concept.uuid} label={element.concept.display} />
                            ))
                        }
                        {
                            errors[fieldId] ? <span className={styles.error}>{errors[fieldId]}</span> : ""
                        }
                    </FormGroup>
                </CheckRule>
            )
        case MULTIPLE_CHOICE:
            return (
                <FormGroup>
                    <label className={mandatory ? "required" : ""}>{displayText ? displayText : name}</label>
                    {
                        answers.map((element, index) => (
                            <CustomCheckBox name={fieldId} type="checkbox" value={element.concept.uuid} label={element.concept.display} />
                        ))
                    }

                    {/* <CustomSelect
                        name={fieldId}
                        handleChange={setFieldValue}
                        options={answers.map(data => (
                            {
                                label: data.concept.display,
                                value: data.uuid
                            })
                        )}

                        error={errors}
                        touched={touched}
                        isMulti={true}

                    /> */}
                    {
                        errors[fieldId] ? <span className={styles.error}>{errors[fieldId]}</span> : ""
                    }
                </FormGroup>
            )
        case HEADING:
            return (
                <HeadingWidget
                    displayText={displayText}
                    name={name}
                />
            )
        case ADDRESS:
            return (

                <AddressWidget
                    country={country}
                    fieldId={fieldId}
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    values={values}
                    mandatory={mandatory}
                    displayText={displayText}
                    name={name}
                />

            )
        case CONTACT_TRACING:
            return (
                <ContactTracingWidget
                    displayText={displayText}
                    name={name}
                    country={country}
                    fieldId={fieldId}
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    values={values}
                    children={children}
                />
            )
        case AGE:
            return (
                <FormGroup>
                    <div>{name}</div>
                    <Field
                        name={fieldId}
                        type="input"
                        as={TextField}
                    />
                </FormGroup>
            )
        case DATE_TIME_PICKER:
            return (
                <FormGroup>
                    <label className={mandatory ? "required" : ""}>{displayText ? displayText : name}</label>
                    <DatePickerField name={fieldId} />
                    {
                        errors[fieldId] ? <span className={styles.error}>{errors[fieldId]}</span> : ""
                    }
                </FormGroup>
            )
        default:
            break;
    }


}

export default WidgetGenerator