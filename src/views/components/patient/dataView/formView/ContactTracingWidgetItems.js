import React from 'react'
import { CustomInput } from './CustomInput'
import CardTemplate from '../../../../ui/cards/SimpleCard/CardTemplate'
import {DatePickerField} from './DatePickerField'

import {
    FormGroup,
}
    from '@material-ui/core'


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
