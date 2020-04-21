import React, { useState } from 'react'
import { CustomInput } from './CustomInput'
import {ContactTracingWidgetItems} from './ContactTracingWidgetItems'


export default function ContactTracingWidget({
    displayText,
    name,
    country,
    fieldId,
    setFieldValue,
    errors,
    touched,
    values,
    children
}) {

    const [numberOfContact, setNumberOfContact] = useState([])

    function handleChange(name ,value){
        let arr =[]
           var i;
            for (i = 0; i < value; i++) {
                arr.push({i})
            }
            setNumberOfContact(arr)
        setFieldValue(name,value)
    }
    console.log("numberOfContact", numberOfContact)
    return (
        <>
            <CustomInput
                displayText={displayText}
                name={name}
                setFieldValue={handleChange}
                fieldId={fieldId}
            />
            <br></br>
            {
                (numberOfContact? numberOfContact.map((el,index) => (
                        <ContactTracingWidgetItems 
                        displayText= {displayText}
                        name ={name}
                        fieldId= {fieldId}
                        setFieldValue={setFieldValue}
                        children ={children}
                        contactNumber= {index+1}
                    />
                ))
                  
                    :null)

            }
            

        </>
    )
}
