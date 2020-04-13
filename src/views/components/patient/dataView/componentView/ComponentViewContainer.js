import React, { useEffect, useState } from 'react'
import ComponentView from './ComponentView'
import { useDispatch, useSelector } from 'react-redux'
import { componentAction } from '../../../../../state/ducks/stages'

export default function ComponentViewContainer({phaseUuid}) {
    const dispatch = useDispatch()
    const { phaseComponents } = useSelector(state => ({
        phaseComponents: state.stages.phaseComponents
    }))

    console.log("phaseUuid component " , phaseUuid)
    useEffect(() => {
        dispatch(componentAction.fetchPhaseComponent("dataview", phaseUuid))
    }, [])

    //console.log("phaseUuid component ize " , phaseComponents.length)
    return <ComponentView
        phaseComponents={phaseComponents}
    />
}
