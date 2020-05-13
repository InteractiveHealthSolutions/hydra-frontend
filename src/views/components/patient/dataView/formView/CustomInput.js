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
                name={name}
                className='form-control'
                onChange={value => setFieldValue(name, value.target.value)}
            />
        </FormGroup>

    </>
  )
