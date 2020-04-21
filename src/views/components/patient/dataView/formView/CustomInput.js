import React from 'react'
import {
    FormGroup,
}
  from '@material-ui/core'

export const CustomInput =
 ({
     displayText,
     name,
     fieldId,
     setFieldValue
 }) =>(
    <>
        <FormGroup>
            <label >{displayText? displayText:name}</label>
            <input
                type="text"
                name={fieldId + `-${name}`}
                className='form-control'
                onChange={value => setFieldValue(fieldId + `-${name.trim()}`, value.target.value)}
            />
        </FormGroup>

    </>
  )
