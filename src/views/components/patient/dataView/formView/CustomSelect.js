import React from 'react'
import { withFormik } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';


const CustomSelect = ({
    options,
    handleChange,
    handleBlur,
    name,
    touched,
    error,
    isMulti
}) => {

    return (
        <div style={{ margin: '1rem 0' }}>
            <Select
                options={options}
                isMulti ={isMulti}
                onChange={value => handleChange(name, value)}
            />
            {/* {!!props.error &&
                props.touched && (
                    <div style={{ color: 'red', marginTop: '.5rem' }}>{props.error}</div>
                )} */}
        </div>
    )
}
export default CustomSelect