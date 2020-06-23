import React, { useState } from 'react'

import {
    Formik,
    Field,
    Form,
    useField,
    FieldAttributes,
    FieldArray,
    useFormikContext
}
    from 'formik'
import {
    TextField,
    FormGroup,
}
    from '@material-ui/core'

import {
    NUMERIC,
    CODED,
    TEXT,
    DATE_TIME,
    CONTACT_TRACING,
    DATE_TIME_PICKER,
    TEXT_BOX,
    SINGLE_SELECT_DROPDOWN,
    MULTIPLE_CHOICE,
    SINGLE_SELECT_RADIOBUTTON,
    HEADING,
    AGE,
    ADDRESS
} from '../../../../../utilities/constants/globalconstants'
import CustomSelect from './widgets/CustomSelect'
import AddressWidget from './widgets/AddressWidget'
import styles from './fromview.module.css';
import ContactTracingWidget from './widgets/ContactTracingWidget'
import { DatePickerField } from './widgets/DatePickerField'
import { CustomRadioButton } from './widgets/CustomRadioButton'
import { HeadingWidget } from './widgets/HeadingWidget'
import { CustomCheckBox } from './widgets/CustomCheckBox'
import CheckRule from './parser/CheckRule'



const WidgetGenerator = ({
    type,
    setFieldValue,
    values,
    handleChange,
    handleBlur,
    setFieldTouched,
    touched,
    errors,
    country
}) => (

    <CheckRule
        values={values}
        setFieldValue={setFieldValue}
        type={type}
        temType ={type}
        handleChange={handleChange}
        handleBlur={handleBlur}
        setFieldTouched={setFieldTouched}
        touched={touched}
        errors={errors}
        country={country}
    />




    // switch (display) {

    //     case TEXT_BOX:
    //         return (
    //             <CheckRule
    //                 rule={parsedRule}
    //                 values={values}
    //                 type={display}
    //                 setFieldValue={setFieldValue}
    //             >
    //                 <FormGroup>
    //                     <label className={mandatory ? "required" : ""}>{displayText ? displayText : name}</label>
    //                     <input
    //                         placeholder=""
    //                         type="text"
    //                         name={fieldId}
    //                         className='form-control'
    //                         onChange={value => setFieldValue(fieldId, value.target.value)}
    //                     />
    //                     {
    //                         errors[fieldId] ? <span className={styles.error}>{errors[fieldId]}</span> : ""
    //                     }
    //                 </FormGroup>
    //             </CheckRule>
    //         )
    //     case SINGLE_SELECT_DROPDOWN:
    //         return (
    //             <CheckRule
    //                 rule={parsedRule}
    //                 values={values}
    //                 type={display}
    //                 setFieldValue={setFieldValue}
    //                 setFieldTouched={setFieldTouched}
    //                 handleAutoSelect={handleAutoSelect}
    //                 name={fieldId}
    //                 answers={answers}
    //             >
    //                 <FormGroup>
    //                     <label className={mandatory ? "required" : ""}>{displayText ? displayText : name}</label>
    //                     <CustomSelect
    //                         name={fieldId}
    //                         handleChange={setFieldValue}
    //                         options={answers.map(data => (
    //                             {
    //                                 label: data.concept.display,
    //                                 value: data.concept.uuid
    //                             })
    //                         )}
    //                         error={errors}
    //                         touched={touched}
    //                         isMulti={false}
    //                         value={values["" + fieldId + ""]}

    //                     />
    //                     {
    //                         errors[fieldId] ? <span className={styles.error}>{errors[fieldId]}</span> : ""
    //                     }
    //                 </FormGroup>
    //             </CheckRule>

    //         )
    //     case SINGLE_SELECT_RADIOBUTTON:
    //         return (
    //             <CheckRule
    //                 rule={parsedRule}
    //                 values={values}
    //                 type={display}
    //                 setFieldValue={setFieldValue}
    //                 name={fieldId}
    //                 answers={answers}
    //             >
    //                 <FormGroup>
    //                     <label className={mandatory ? "required" : ""}>{displayText ? displayText : name}</label>
    //                     {
    //                         answers.map((element, index) => (
    //                             <CustomRadioButton
    //                                 name={fieldId}
    //                                 type="radio"
    //                                 value={element.concept.uuid}
    //                                 label={element.concept.display}
    //                             />
    //                         ))
    //                     }
    //                     {
    //                         errors[fieldId] ? <span className={styles.error}>{errors[fieldId]}</span> : ""
    //                     }
    //                 </FormGroup>
    //             </CheckRule>
    //         )
    //     case MULTIPLE_CHOICE:
    //         return (
    //             <CheckRule
    //                 rule={parsedRule}
    //                 values={values}
    //                 type={display}
    //                 setFieldValue={setFieldValue}
    //                 name={fieldId}
    //                 answers={answers}
    //             >
    //                 <FormGroup>
    //                     <label className={mandatory ? "required" : ""}>{displayText ? displayText : name}</label>
    //                     {
    //                         answers.map((element, index) => (
    //                             <CustomCheckBox
    //                                 name={fieldId}
    //                                 type="checkbox"
    //                                 value={element.concept.uuid}
    //                                 label={element.concept.display}
    //                             />
    //                         ))
    //                     }

    //                     {/* <CustomSelect
    //                     name={fieldId}
    //                     handleChange={setFieldValue}
    //                     options={answers.map(data => (
    //                         {
    //                             label: data.concept.display,
    //                             value: data.uuid
    //                         })
    //                     )}

    //                     error={errors}
    //                     touched={touched}
    //                     isMulti={true}

    //                 /> */}
    //                     {
    //                         errors[fieldId] ? <span className={styles.error}>{errors[fieldId]}</span> : ""
    //                     }
    //                 </FormGroup>
    //             </CheckRule>
    //         )
    //     case HEADING:
    //         return (
    //             <HeadingWidget
    //                 displayText={displayText}
    //                 name={name}
    //             />
    //         )
    //     case ADDRESS:
    //         return (

    //             <AddressWidget
    //                 country={country}
    //                 fieldId={fieldId}
    //                 setFieldValue={setFieldValue}
    //                 errors={errors}
    //                 touched={touched}
    //                 values={values}
    //                 mandatory={mandatory}
    //                 displayText={displayText}
    //                 name={name}
    //             />

    //         )
    //     case CONTACT_TRACING:
    //         return (
    //             <ContactTracingWidget
    //                 displayText={displayText}
    //                 name={name}
    //                 country={country}
    //                 fieldId={fieldId}
    //                 setFieldValue={setFieldValue}
    //                 errors={errors}
    //                 touched={touched}
    //                 values={values}
    //                 children={children}
    //             />
    //         )
    //     case AGE:
    //         return (
    //             <FormGroup>
    //                 <div>{name}</div>
    //                 <Field
    //                     name={fieldId}
    //                     type="input"
    //                     as={TextField}
    //                 />
    //             </FormGroup>
    //         )
    //     case DATE_TIME_PICKER:
    //         return (
    //             <FormGroup>
    //                 <label className={mandatory ? "required" : ""}>{displayText ? displayText : name}</label>
    //                 <DatePickerField name={fieldId} />
    //                 {
    //                     errors[fieldId] ? <span className={styles.error}>{errors[fieldId]}</span> : ""
    //                 }
    //             </FormGroup>
    //         )
    //     default:
    //         return (<></>)
    // }


)

export default WidgetGenerator