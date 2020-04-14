import React from 'react'
import FormView from './FormView'

export default function FormViewContainer() {
    const form = JSON.parse(localStorage.getItem("form"))
    return <FormView
        form={form}
    />
}
