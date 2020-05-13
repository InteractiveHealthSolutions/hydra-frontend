import React from 'react'
import { CustomInput } from './CustomInput'
import CardTemplate from '../../../../ui/cards/SimpleCard/CardTemplate'
import { DatePickerField } from './DatePickerField'
import { CustomRadioButton } from './CustomRadioButton'
import {
    FormGroup,
}
    from '@material-ui/core'

export const ContactWidgetType =
    ({
        fieldType,
        parentFieldId,
        setFieldValue,
        displayText,
        fieldName,
        contactNumber

    }) => {
        switch (fieldType) {
            case "73e557b7-0be7-4e96-b1f2-11c39534ec29":
                //age
                return <FormGroup>
                    <label>{displayText ? displayText : fieldName}</label>
                    <DatePickerField name={parentFieldId + "-dob-" + contactNumber} />
                </FormGroup>

            case "73eb7357-7eb0-4e96-b1f2-11c39534ec29":
                //gender
                return <>
                    <label>{displayText ? displayText : fieldName}</label>
                    <br></br>
                    <CustomRadioButton
                        name={parentFieldId + "-gender-" + contactNumber}
                        type="radio"
                        value="Male"
                        label="Male"
                    />
                    <CustomRadioButton
                        name={parentFieldId + "-gender-" + contactNumber}
                        type="radio"
                        value="Female"
                        label="Female"
                    />
                </>

            case "73e557b7-7eb0-4e96-2f1b-11c39534ec29":
                //firstName
                return <CustomInput
                    displayText={displayText ? displayText : fieldName}
                    name={parentFieldId + "-firstName-" + contactNumber}
                    setFieldValue={setFieldValue}
                />


            case "73e557b7-7eb0-4e96-b1f2-11c39534e92c":
                //familName
                return <CustomInput
                    displayText={displayText ? displayText : fieldName}
                    name={parentFieldId + "-familyName-" + contactNumber}
                    setFieldValue={setFieldValue}
                />

            case "37e557b7-7eb0-4e96-b1f2-11c395ec4329":
                //identifier
                return <CustomInput
                    displayText={displayText ? displayText : fieldName}
                    name={parentFieldId + "-identifier-" + contactNumber}
                    setFieldValue={setFieldValue}
                />

            case "37e557b7-0be7-4e96-b1f2-11c395ec4329":
                //relationship
                return <CustomInput
                    displayText={displayText ? displayText : fieldName}
                    name={parentFieldId + "-relationship-" + contactNumber}
                    setFieldValue={setFieldValue}
                />
        }


    }
