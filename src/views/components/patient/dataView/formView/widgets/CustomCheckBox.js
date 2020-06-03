import React from 'react'
import {
    useField
}
    from 'formik'
import {
    Checkbox,
    FormControlLabel,
    FormGroup
}
    from '@material-ui/core'

export const CustomCheckBox = ({ label, ...props }) => {
    const [field] = useField(props);
    return  <FormGroup><FormControlLabel {...field}  control={<Checkbox />} label={label} /></FormGroup>;
};
