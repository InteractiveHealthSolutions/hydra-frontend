import React from 'react'
import { CustomInput } from './CustomInput'
import CardTemplate from '../../../../ui/cards/SimpleCard/CardTemplate'
import DatePicker from "react-datepicker";
import {
    useField,
    useFormikContext
}
    from 'formik'
import {
    FormGroup,
}
    from '@material-ui/core'

export const DatePickerField = ({ ...props }) => {
    const { setFieldValue } = useFormikContext();
    const [field] = useField(props);
    return (
        <DatePicker
            {...field}
            {...props}
            className="form-control"
            selected={(field.value && new Date(field.value)) || null}
            onChange={val => {
                setFieldValue(field.name, val);
            }}
        />
    );
};

export const ContactTracingWidgetItems =
    ({
        displayText,
        name,
        fieldId,
        setFieldValue,
        children,
        contactNumber
    })=> (

            <CardTemplate
                title={
                <div className ="row"> 
                    <div className ="col-sm-0"><h2 style ={{background:"var(--bg)", width:"19px" ,color: "white"}}>{contactNumber}</h2></div> 
                    <div className ="col-sm-2"><p style ={{marginTop:"4px"}}>Contact Details</p> </div> 
                </div>}
            >
                {
                    children ? children.map((element, index) => (
                        <>
                            {(index < 6) ?
                                (element.field.attributeName === "Datetime") ?
                                    <FormGroup>
                                        <div>{element.displayText ? element.displayText : element.field.name}</div>
                                        <DatePickerField name={element.field.fieldId} />
                                    </FormGroup>
                                    :
                                    <CustomInput
                                        displayText={element.displayText ? element.displayText : element.field.name}
                                        name={element.field.name}
                                        fieldId={element.field.fieldId}
                                        setFieldValue={setFieldValue}
                                    />
                                : null
                            }

                        </>
                    )) : null

                }
            </CardTemplate>

        )
