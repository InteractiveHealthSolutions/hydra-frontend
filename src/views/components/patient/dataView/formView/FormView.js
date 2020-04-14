import React from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { TextField, Button } from '@material-ui/core'
import CardTemplate from '../../../../ui/cards/SimpleCard/CardTemplate'

const FormView = ({ form: { field, name, formFields } }) => {


    return (

        <Formik
            initialValues={{
                username: "",
                password: ""
            }}
            onSubmit={(data) => {
                console.log(data)
            }}
        >{({ values, handleSubmit, handleChange }) => (
            <form onSubmit={handleSubmit}>
                <CardTemplate
                    title={name}
                    action={<Button type="submit" variant="primary">Save</Button>}
                >
                    {
                        formFields ? formFields.map((data, index) => (
                            <>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label={data.displayText}
                                    variant="outlined"
                                    name="username"
                                    onChange={handleChange}
                                />
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