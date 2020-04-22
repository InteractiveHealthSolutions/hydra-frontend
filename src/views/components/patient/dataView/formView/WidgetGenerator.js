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
    Button,
    Checkbox,
    Radio,
    FormControlLabel,
    MenuItem,
    FormGroup,
    Input,
    FormControl

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
import {DatePickerField} from './DatePickerField'
import {CustomRadioButton} from './CustomRadioButton'
import {HeadingWidget} from './HeadingWidget'


const WidgetGenerator = ({
    type: {
        field: { fieldType: { display }, fieldId, answers, name },
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



    switch (display) {

        case TEXT_BOX:
            return (
                <FormGroup>
                    <label className={mandatory ? "required" : ""}>{displayText ? displayText : name}</label>
                    <input
                        placeholder=""
                        type="text"
                        name={fieldId}
                        className='form-control'
                        onChange={value => setFieldValue(fieldId, value.target.value)}
                    />
                </FormGroup>
            )
        case SINGLE_SELECT_DROPDOWN:
            return (
                <FormGroup>
                    <label className={mandatory ? "required" : ""}>{displayText ? displayText : name}</label>
                    <CustomSelect
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
                        isMulti={false}

                    />
                </FormGroup>
            )
        case SINGLE_SELECT_RADIOBUTTON:
            return (
                <FormGroup>
                    <label className={mandatory ? "required" : ""}>{displayText ? displayText : name}</label>
                    {
                        answers.map((element, index) => (
                            <CustomRadioButton name={fieldId} type="radio" value={element.uuid} label={element.concept.display} />
                        ))
                    }
                </FormGroup>
            )
        case MULTIPLE_CHOICE:
            return (
                <FormGroup>
                    <label className={mandatory ? "required" : ""}>{displayText ? displayText : name}</label>
                    <CustomSelect
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

                    />
                </FormGroup>
            )
        case HEADING:
            return (
                    <HeadingWidget 
                        displayText ={displayText}
                        name = {name}
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
                            mandatory ={mandatory}
                            displayText ={displayText}
                            name ={name}
                        />
                    )
        case CONTACT_TRACING:
            return (
                    <ContactTracingWidget
                      displayText ={displayText}
                      name ={name}
                      country={country}
                      fieldId={fieldId}
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                      values={values}  
                      children ={children}          
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
                    <label>{displayText ? displayText : name}</label>
                    <DatePickerField name={fieldId} />
                </FormGroup>
            )
        default:
            break;
    }


}

export default WidgetGenerator