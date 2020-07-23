import React, { useState } from 'react'

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
import CustomSelect from './widgets/CustomSelect'
import AddressWidget from './widgets/AddressWidget'
import styles from './fromview.module.css';
import ContactTracingWidget from './widgets/ContactTracingWidget'
import { DatePickerField } from './widgets/DatePickerField'
import { CustomRadioButton } from './widgets/CustomRadioButton'
import { HeadingWidget } from './widgets/HeadingWidget'
import { CustomCheckBox } from './widgets/CustomCheckBox'
import CheckRule from './parser/CheckRule'



const WidgetGenerator = ({
    type,
    setFieldValue,
    values,
    handleChange,
    handleBlur,
    setFieldTouched,
    touched,
    errors,
    country
}) => (

    <CheckRule
        values={values}
        setFieldValue={setFieldValue}
        type={type}
        temType ={type}
        handleChange={handleChange}
        handleBlur={handleBlur}
        setFieldTouched={setFieldTouched}
        touched={touched}
        errors={errors}
        country={country}
    />
)

export default WidgetGenerator