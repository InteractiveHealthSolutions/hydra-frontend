import React from 'react'
import DatePicker from "react-datepicker";
import {
    useField,
    useFormikContext
}
    from 'formik'


export const DatePickerField = ({ ...props }) => {
    const { setFieldValue } = useFormikContext();
    const [field] = useField(props);
    return (
        <DatePicker
            {...field}
            {...props}
            className="form-control"
            showMonthDropdown
            showYearDropdown 
            selected={(field.value && new Date(field.value)) || null}
            onChange={val => {
                setFieldValue(field.name, val);
            }}
        />
    );
};
