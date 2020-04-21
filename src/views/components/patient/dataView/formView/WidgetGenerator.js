import React from 'react'
import CardTemplate from '../../../../ui/cards/SimpleCard/CardTemplate'
import * as Yup from 'yup'
import DateFnsUtils from '@date-io/date-fns';
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
import DatePicker from "react-datepicker";

import CustomSelect from './CustomSelect'
import AddressWidget from './AddressWidget'

import styles from './fromview.module.css';
import makeAnimated from 'react-select/animated';
import ContactTracingWidget from './ContactTracingWidget'


const animatedComponents = makeAnimated();

const CustomRadioButton = ({ label, ...props }) => {
    const [field] = useField(props);
    return <FormControlLabel {...field} control={<Radio />} label={label} />;
};



const CustomTextField = ({
    placeholder,
    ...props
}) => {
    const [field, meta] = useField(props)
    const errorText = meta.error && meta.touched ? meta.error : "";
    return (

        <TextField
            placeholder={placeholder}
            {...field}
            helperText={errorText}
            error={!!errorText}
            className="form-control"
        />
    );
};


export const DatePickerField = ({ ...props }) => {
    const { setFieldValue } = useFormikContext();
    const [field] = useField(props);
    return (
        <DatePicker
            {...field}
            {...props}
            className="form-control"
            selected={(field.value && new Date(field.value)) || null}
            onChange={val => {
                setFieldValue(field.name, val);
            }}
        />
    );
};


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
                <FormGroup>
                    <div className={styles.heading_}> {displayText ? displayText : name}</div>
                </FormGroup>)
        case ADDRESS:
            return (
                <FormGroup>
                     <label className={mandatory ? "required" : ""}>{displayText ? displayText : name}</label>
                    <AddressWidget
                        country={country}
                        fieldId={fieldId}
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                        values={values}
                    />
                </FormGroup>)
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
                    <div>{displayText ? displayText : name}</div>
                    <DatePickerField name={fieldId} />
                </FormGroup>
            )
        default:
            break;
    }


}

export default WidgetGenerator