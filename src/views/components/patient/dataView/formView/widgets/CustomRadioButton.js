import React from 'react'
import {
    useField
}
    from 'formik'
import {
    Radio,
    FormControlLabel
}
    from '@material-ui/core'

export const CustomRadioButton = ({ label, ...props }) => {
    const [field] = useField(props);
    return <FormControlLabel {...field} control={<Radio />} label={label} />;
};
