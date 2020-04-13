import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { formAction } from '../../../../../state/ducks/form'
import FormView from './FormView'

export default function FormViewContainer({ phaseUUID, componentUUID }) {
    const dispatch = useDispatch()
    const { componentForms } = useSelector(state => ({
        componentForms: state.formField.componentFormRelations
    }))
    console.log("element.phaseUUID component from", componentUUID)
    useEffect(() => {
        dispatch(formAction.getComponentFormRelation("dataview", phaseUUID, componentUUID))
    }, [])

    //console.log("componentForms Form ", componentForms)
    return <FormView
        componentForms={componentForms}
        componentUUID ={componentUUID}
    />
}
