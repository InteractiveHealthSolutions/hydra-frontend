import React from 'react'
import CardTemplate from '../../../../ui/cards/SimpleCard/CardTemplate'
import WidgetGenerator from './WidgetGenerator'
import { CreateYupSchema } from './CreateYupSchema'
import * as yup from "yup";
import {
    Formik,
}
    from 'formik'




const FormView = ({ form: { field, name, formFields } }) => {
    const initialValues = {};
    formFields.forEach(item => {
        initialValues[item.field.fieldId] = "";
    });

    const yepSchema = formFields.reduce(CreateYupSchema, {});
    const validateSchema = yup.object().shape(yepSchema);

    return (

        <Formik
            initialValues={initialValues}
            validationSchema={validateSchema}
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
                                        /> : null}

                                    <div style={{ marginTop: '8px' }}></div>
                                </>
                            )) : null

                        }
                        <pre>{JSON.stringify(values, null, 2)}</pre>
                    </CardTemplate>
                </form>
            )}
        </Formik>
    )
}

export default FormView