import React from 'react'
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
            <Select
                options={options}
                isMulti ={isMulti}
                onChange={value => handleChange(name, value)}
            />
    )
}
export default CustomSelect