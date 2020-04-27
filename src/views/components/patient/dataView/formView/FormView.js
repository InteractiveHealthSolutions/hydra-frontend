import React from 'react'
import CardTemplate from '../../../../ui/cards/SimpleCard/CardTemplate'
import WidgetGenerator from './WidgetGenerator'
import { CreateYupSchema, FormValidation } from './CreateYupSchema'
import * as yup from "yup";
import {
    Formik,
}
    from 'formik'
import { ADDRESS } from '../../../../../utilities/constants/globalconstants';




const FormView = ({ form: { field, name, formFields }, country }) => {
    const initialValues = {};
    formFields.forEach(item => {
        const fieldName = item.field.fieldId
        const fieldType = item.field.attributeName
        if(fieldType === ADDRESS){
            initialValues[fieldName+"-country"] = "";
            initialValues[fieldName+"-province"] = "";
            initialValues[fieldName+"-city"] = "";
            initialValues[fieldName+"-address"] = "";
        }else{
            initialValues[item.field.fieldId] = "";
        }

    });

    const yepSchema = formFields.reduce(CreateYupSchema, {});
    const validateSchema = yup.object().shape(yepSchema);

    return (

        <Formik
            initialValues={initialValues}
            // validationSchema={validateSchema}
            validate ={(values) => {
                return FormValidation(formFields ,values)
            }}
            onSubmit={(data) => {
                console.log(data)
            }}
        >{({
            values,
            touched,
            dirty,
            errors,
            handleChange,
            handleBlur,
            handleSubmit,
            handleReset,
            setFieldValue,
            setFieldTouched,
            isSubmitting
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
                                            country ={country}
                                        /> : null}

                                    <div style={{ marginTop: '8px' }}></div>
                                </>
                            )) : null

                        }
                          <pre>{JSON.stringify(values, null, 2)}</pre>
                        <pre>{JSON.stringify(errors, null, 2)}</pre>
                    </CardTemplate>
                </form>
            )}
        </Formik>
    )
}

export default FormView