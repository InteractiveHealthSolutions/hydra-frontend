import React from 'react'
import CardTemplate from '../../../../../ui/cards/SimpleCard/CardTemplate'
import { ContactWidgetType } from './ContactWidgetType'


export const ContactTracingWidgetItems =
    ({
        displayText,
        name,
        fieldId,
        setFieldValue,
        children,
        contactNumber
    }) => (

            <CardTemplate
                title={
                    <div className="row">
                        <div className="col-sm-0"><h2 style={{ background: "var(--bg)", width: "19px", color: "white" }}>{contactNumber}</h2></div>
                        <div className="col-sm-2"><p style={{ marginTop: "4px" }}>Contact Details</p> </div>
                    </div>}
            >
                {
                    children ? children.map((element, index) => (
                        <>
                            {(index < 6) ?
                                <ContactWidgetType
                                    fieldType={element.field.uuid}
                                    parentFieldId={fieldId}
                                    setFieldValue={setFieldValue}
                                    displayText = {element.displayText}
                                    fieldName = {element.field.name}
                                    contactNumber = {contactNumber}
                                />
                                : null
                            }

                        </>
                    )) : null

                }
            </CardTemplate>

        )
