import React, { useState } from 'react'
import CardTemplate from '../../../../ui/cards/SimpleCard/CardTemplate'
import WidgetGenerator from './WidgetGenerator'
import { CreateYupSchema, FormValidation } from './validation/CreateValidationSchema'
import * as yup from "yup";
import {
    Formik, Form,
}
    from 'formik'
import { ADDRESS } from '../../../../../utilities/constants/globalconstants';
import styles from './fromview.module.css';
import { FormLabel } from '@material-ui/core';
import { autoSelectParser } from './parser/Parser'

function FormView({
    form: { field, name, formFields },
    country,
    currentPatient,
    submitForm,
}) {

    const yepSchema = formFields.reduce(CreateYupSchema, {});
    const validateSchema = yup.object().shape(yepSchema);
    const initialValues = {};
    formFields.forEach(item => {
        const fieldName = item.field.fieldId
        const fieldType = item.field.attributeName
        if (fieldType === ADDRESS) {
            initialValues[fieldName + "-country"] = "";
            initialValues[fieldName + "-province"] = "";
            initialValues[fieldName + "-city"] = "";
            initialValues[fieldName + "-address"] = "";
        } else {
            initialValues[item.field.fieldId] = "";
        }
    });

    // not used
    function handleAutoSelect(name, val, setFieldValue, setFieldTouched) {
        // debugger;
        console.log("handleAutoSelect tt", name, val)
        //  setFieldValue(name, val)
       //  setFieldValue(name, val);
        // setTimeout(() => setFieldTouched(name, true));
        //initialValues[name] = val
        var objSelect = document.getElementById(name);
        console.log("objSelect",objSelect)
        // document.querySelector('#'+name).value = 
        // setReload(!reload)
    }


    return (
        <div className="row">
            <div className="col-md-4" style={{ marginRight: 0, paddingRight: 4 }}>
                <CardTemplate
                    title="Patient Detail"
                >
                    <div className="row">
                        <div className="col-md-4"><FormLabel>Name</FormLabel></div>
                        <div className="col-md-8"><FormLabel className={styles.font_adjust}>{currentPatient.given + " " + currentPatient.familyname}</FormLabel></div>
                    </div>
                    <div className="row">
                        <div className="col-md-4"><FormLabel>Identifier</FormLabel></div>
                        <div className="col-md-8"><FormLabel className={styles.font_adjust}>{currentPatient.identifier}</FormLabel></div>
                    </div>
                    <div className="row">
                        <div className="col-md-4"><FormLabel>Gender</FormLabel></div>
                        <div className="col-md-8"><FormLabel className={styles.font_adjust}>{currentPatient.gender}</FormLabel></div>
                    </div>
                    <div className="row">
                        <div className="col-md-4"><FormLabel>DOB</FormLabel></div>
                        <div className="col-md-8"><FormLabel className={styles.font_adjust}>{currentPatient.age + " year(s) (" + currentPatient.birthday + ")"}</FormLabel></div>
                    </div>
                </CardTemplate>
            </div>
            <div className="col-md-8" style={{ marginLeft: 0, paddingLeft: 4 }}>
                <Formik
                    enableReinitialize={true}
                    initialValues={initialValues}
                    // validationSchema={validateSchema}
                    validateOnChange={false}
                    validateOnBlur={false}
                    validate={(values) => {
                        // initialValues["1024"] = { label: "CHIKUNGUNYA FEVER", value: "120742AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" }
                        return FormValidation(formFields, values)
                    }}
                    onSubmit={(data) => {
                        console.log(data)
                        submitForm(data)
                    }}
                >{({
                    values,
                    touched,
                    errors,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    setFieldValue,
                    setFieldTouched
                }) => (
                        <form onSubmit={handleSubmit}>
                            <CardTemplate
                                title={name}
                                action={<button type='submit' className='btn btn-primary '>Save</button>}
                            >
                                {
                                    formFields ? formFields.map((data, index) => (
                                        <>
                                            {(data.field.fieldType) ?
                                                <WidgetGenerator
                                                    type={data}
                                                    setFieldValue={setFieldValue}
                                                    values={values}
                                                    handleChange={handleChange}
                                                    handleBlur={handleBlur}
                                                    errors={errors}
                                                    touched={touched}
                                                    country={country}
                                                    setFieldTouched={setFieldTouched}
                                                    handleAutoSelect={handleAutoSelect}
                                                /> : null}

                                            <div style={{ marginTop: '8px' }}></div>
                                        </>
                                    )) : null

                                }
                                {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
                                {/* <pre>{JSON.stringify(errors, null, 2)}</pre> */}
                            </CardTemplate>
                        </form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default FormView