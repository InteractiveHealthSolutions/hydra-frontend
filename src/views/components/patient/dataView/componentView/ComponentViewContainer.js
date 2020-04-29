import React, { useEffect, useState } from 'react'
import ComponentView from './ComponentView'
import { useDispatch, useSelector } from 'react-redux'
import { componentAction } from '../../../../../state/ducks/stages'
import { formAction } from '../../../../../state/ducks/form'
import { LoaderDots } from '../../../common/loader/LoaderDots'
import { history } from '../../../../../history'

export default function ComponentViewContainer({ phaseUuid }) {
    const dispatch = useDispatch()
    const { phaseComponents, componentForms, loading } = useSelector(state => ({
        phaseComponents: state.stages.phaseComponents,
        componentForms: state.formField.componentFormRelations,
        loading: state.stages.loading
    }))
    useEffect(() => {
        dispatch(componentAction.fetchPhaseComponent("dataview", phaseUuid))
        dispatch(formAction.getComponentFormRelation("dataview", phaseUuid))
    }, [])


    function handleOnClick(evt, data) {
        console.log("clicked :: ", data.form)
        localStorage.setItem("form",JSON.stringify(data.form))

        history.push('/patient/detail/dataentry/form')
    }

    return loading ? <LoaderDots withMargin="true" height={40} width={40} /> :
        <ComponentView
            phaseComponents={phaseComponents}
            componentForms={componentForms}
            handleOnClick={handleOnClick}
        />
}
