import React from 'react'
import Select from 'react-select';


const CustomSelect = ({
    options,
    handleChange,
    handleBlur,
    name,
    touched,
    error,
    isMulti,
    value
}) => {
    return (
        <Select
            id = {name}
            value={value}
            options={options}
            isMulti={isMulti}
            onChange={val => handleChange(name, val)}
        />
    )
}
export default CustomSelect